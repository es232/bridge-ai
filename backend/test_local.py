from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

payload = {
    "message": "Hello", 
    "user_profile": {"name": "Test", "qualification": "UG", "state": "TN"}
}

response = client.post("/chat", json=payload)
print("TEST CLIENT RESP:", response.status_code)
print(response.json())
