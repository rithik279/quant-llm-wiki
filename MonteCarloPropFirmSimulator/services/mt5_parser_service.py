"""Service wrapper for MT5 report parsing."""

from __future__ import annotations

from pathlib import Path

from mt5_csv_ingestion import (
    MT5ParseError,
    detect_mt5_report_type,
    parse_mt5_trade_results,
)


class MT5ParserServiceError(ValueError):
    """Raised when parsing fails with a user-facing message."""


def parse_mt5_file(file_path: str | Path) -> dict:
    """Parse an MT5 report file and return report metadata + trade results."""
    path = Path(file_path)
    if not path.exists():
        raise MT5ParserServiceError("Uploaded file could not be processed.")

    try:
        report_type = detect_mt5_report_type(path)
        trade_results = parse_mt5_trade_results(path)
    except MT5ParseError as exc:
        raise MT5ParserServiceError("Invalid MT5 report format.") from exc
    except Exception as exc:
        raise MT5ParserServiceError("Could not read this file. It may be corrupted.") from exc

    if not trade_results:
        raise MT5ParserServiceError("This MT5 report contains no closed trades.")

    return {
        "report_type": report_type,
        "trade_results": [float(v) for v in trade_results],
    }
