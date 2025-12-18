from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_root_ok():
    resp = client.get("/")
    assert resp.status_code == 200
    data = resp.json()
    assert "name" in data and "version" in data


def test_health_ok():
    resp = client.get("/health")
    assert resp.status_code == 200
    data = resp.json()
    assert data.get("status") == "healthy"
    assert "version" in data