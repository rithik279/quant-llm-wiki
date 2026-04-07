"""
db.py
=====
Shared Postgres connection pool for all database modules.

Reads DATABASE_URL from the environment (set this on Render).
Supabase provides this as the "URI" connection string under:
  Project Settings → Database → Connection string (URI mode)

Usage
-----
  from db import get_conn

  with get_conn() as conn:
      with conn.cursor() as cur:
          cur.execute("SELECT ...")
          rows = cur.fetchall()
  # connection auto-committed and returned to pool on exit
"""

from __future__ import annotations

import logging
import os

import psycopg2
import psycopg2.extras
from psycopg2.pool import ThreadedConnectionPool

log = logging.getLogger(__name__)

_pool: ThreadedConnectionPool | None = None


def _get_pool() -> ThreadedConnectionPool:
    global _pool
    if _pool is None:
        url = os.environ.get("DATABASE_URL")
        if not url:
            raise RuntimeError(
                "DATABASE_URL environment variable is not set. "
                "Add your Supabase connection string to Render environment variables."
            )
        # min=1 max=5 — safe for Supabase free tier (60 connection limit)
        _pool = ThreadedConnectionPool(1, 5, url)
        log.info("[db] Postgres connection pool initialised")
    return _pool


class _ManagedConn:
    """Context manager: borrow a connection from the pool, commit/rollback, return."""

    def __enter__(self) -> psycopg2.extensions.connection:
        self._conn = _get_pool().getconn()
        return self._conn

    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_type:
            self._conn.rollback()
        else:
            self._conn.commit()
        _get_pool().putconn(self._conn)
        return False  # don't suppress exceptions


def get_conn() -> _ManagedConn:
    """Return a context manager that yields a pooled Postgres connection."""
    return _ManagedConn()


def rows_as_dicts(cursor: psycopg2.extensions.cursor) -> list[dict]:
    """Convert cursor results to a list of plain dicts using column names."""
    if cursor.description is None:
        return []
    cols = [d.name for d in cursor.description]
    return [dict(zip(cols, row)) for row in cursor.fetchall()]
