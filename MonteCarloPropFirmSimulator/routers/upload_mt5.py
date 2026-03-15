"""MT5 upload endpoint."""

from __future__ import annotations

import os
import tempfile
from pathlib import Path

from fastapi import APIRouter, File, UploadFile
from fastapi.responses import JSONResponse

from services.mt5_parser_service import MT5ParserServiceError, parse_mt5_file
from services.monte_carlo_service import MonteCarloServiceError, run_trade_simulation


router = APIRouter(tags=["Upload"])

_ALLOWED_EXTENSIONS = {".csv", ".xlsx", ".xls", ".xlsm"}


@router.post("/upload/mt5", summary="Upload MT5 report and run simulation")
async def upload_mt5(file: UploadFile = File(...)):
    filename = file.filename or "uploaded_report"
    extension = Path(filename).suffix.lower()

    if extension not in _ALLOWED_EXTENSIONS:
        return JSONResponse(
            status_code=400,
            content={
                "error": "Invalid file type. Please upload .csv or .xlsx MT5 reports.",
            },
        )

    temp_path: str | None = None
    try:
        data = await file.read()
        if not data:
            return JSONResponse(status_code=400, content={"error": "Uploaded file is empty."})

        with tempfile.NamedTemporaryFile(delete=False, suffix=extension) as tmp:
            tmp.write(data)
            temp_path = tmp.name

        parsed = parse_mt5_file(temp_path)
        simulation = run_trade_simulation(parsed["trade_results"])

        return {
            "report_type": parsed["report_type"],
            **simulation,
        }

    except MT5ParserServiceError as exc:
        return JSONResponse(status_code=400, content={"error": str(exc)})
    except MonteCarloServiceError as exc:
        return JSONResponse(status_code=400, content={"error": str(exc)})
    except Exception:
        return JSONResponse(
            status_code=400,
            content={"error": "Could not process this file. Please upload a valid MT5 report."},
        )
    finally:
        await file.close()
        if temp_path and os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except OSError:
                pass
