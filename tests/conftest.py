import os
import sys


def _add_backend_to_path():
    """Ensure the backend package is importable in tests.

    Adds the workspace 'backend' directory to sys.path so tests can import
    the FastAPI app as `from app.main import app`.
    """
    repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    backend_path = os.path.join(repo_root, "backend")
    if backend_path not in sys.path:
        sys.path.insert(0, backend_path)


_add_backend_to_path()
