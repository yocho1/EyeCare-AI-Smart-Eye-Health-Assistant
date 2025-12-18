#!/usr/bin/env python
"""
Safe project cleaner. Removes caches, logs, and build outputs.
Use --deep to also remove node_modules and virtualenvs.
"""
from __future__ import annotations
import argparse
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

SAFE_PATTERNS = [
    "**/__pycache__",
    "**/*.pyc",
    "**/*.pyo",
    "**/.pytest_cache",
    "**/.coverage",
    "**/htmlcov",
    "**/*.log",
    "**/logs",
    "frontend/dist",
    "frontend/build",
    "frontend/.vite",
    "**/.DS_Store",
    "**/Thumbs.db",
]

DEEP_PATTERNS = [
    "frontend/node_modules",
    "**/node_modules",
    ".venv",
    "venv",
]

def remove_glob(pattern: str) -> None:
    for p in ROOT.glob(pattern):
        try:
            if p.is_dir():
                shutil.rmtree(p, ignore_errors=True)
            else:
                p.unlink(missing_ok=True)
        except Exception:
            pass


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--deep", action="store_true", help="Also remove node_modules and virtualenvs")
    args = parser.parse_args()

    for pat in SAFE_PATTERNS:
        remove_glob(pat)

    if args.deep:
        for pat in DEEP_PATTERNS:
            remove_glob(pat)

    print("Clean complete.")


if __name__ == "__main__":
    main()
