"""
mt5_csv_ingestion_test.py
=========================
Validation script for MT5 XLSX/CSV ingestion.

Run:
    python mt5_csv_ingestion_test.py
"""

from __future__ import annotations

from pathlib import Path

from mt5_csv_ingestion import (
    MT5ParseError,
    detect_mt5_report_type,
    parse_mt5_trade_results,
)


ROOT = Path(__file__).resolve().parent
REPORT_HISTORY = ROOT / "ReportHistory-102531645.xlsx"
REPORT_TESTER = ROOT / "ReportTester-102531645.xlsx"


def _validate_basic_trade_list(values: list[float]) -> None:
    assert isinstance(values, list), "Parser must return a list"
    assert values, "Parser returned an empty list"
    assert all(isinstance(v, float) for v in values), "All elements must be float"
    assert any(v > 0 for v in values), "Expected at least one winning trade"
    assert any(v < 0 for v in values), "Expected at least one losing trade"


def test_detect_report_types_real_exports() -> None:
    t_history = detect_mt5_report_type(REPORT_HISTORY)
    t_tester = detect_mt5_report_type(REPORT_TESTER)

    # Detection is based on file content, not filename.
    assert t_history == "trade_history", f"ReportHistory detection mismatch: {t_history}"
    assert t_tester == "strategy_tester", f"ReportTester detection mismatch: {t_tester}"


def test_parse_trade_history_export() -> None:
    values = parse_mt5_trade_results(REPORT_HISTORY)
    _validate_basic_trade_list(values)
    assert len(values) >= 300, f"Unexpectedly small trade list from trade history: {len(values)}"

    # Trade history report should include large negative trade values present in sample.
    assert min(values) <= -90.0, f"Expected deep negative trade in history report, min={min(values)}"


def test_parse_strategy_tester_export() -> None:
    values = parse_mt5_trade_results(REPORT_TESTER)
    _validate_basic_trade_list(values)

    # Strategy tester deals contain many entry="in" rows with zero profit;
    # parser should focus realized exits and therefore avoid being dominated by zeros.
    zero_ratio = sum(1 for v in values if abs(v) < 1e-12) / len(values)
    assert zero_ratio < 0.2, f"Too many zero-profit rows; likely includes entry rows. zero_ratio={zero_ratio:.2%}"


def test_raises_on_invalid_file() -> None:
    try:
        _ = parse_mt5_trade_results(ROOT / "__missing_report__.xlsx")
    except MT5ParseError:
        return
    except FileNotFoundError:
        return
    raise AssertionError("Expected parsing failure for missing file.")


def run_all() -> None:
    tests = [
        test_detect_report_types_real_exports,
        test_parse_trade_history_export,
        test_parse_strategy_tester_export,
        test_raises_on_invalid_file,
    ]

    passed = 0
    failed = 0

    for fn in tests:
        name = fn.__name__
        try:
            fn()
            print(f"[PASS] {name}")
            passed += 1
        except Exception as exc:
            print(f"[FAIL] {name}: {exc}")
            failed += 1

    print("\n=== MT5 ingestion test summary ===")
    print(f"Passed: {passed}")
    print(f"Failed: {failed}")

    if failed:
        raise SystemExit(1)


if __name__ == "__main__":
    run_all()
