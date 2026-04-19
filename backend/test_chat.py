import asyncio
import json
import httpx

async def test_chat():
    url = "http://localhost:8000/chat"
    
    # We need a token to hit /chat now!
    # First, login or bypass. Wait, does /chat require token?
    # In main.py:
    # @app.post("/chat")
    # async def chat_endpoint(req: ChatRequest):
    # wait - I didn't add `user_payload = Depends(verify_token)` to `/chat` in main.py!
    
    headers = {"Content-Type": "application/json"}
    payload = {
        "message": "Hello", 
        "user_profile": {"name": "Test", "qualification": "UG", "state": "TN"}
    }
    
    async with httpx.AsyncClient() as client:
        try:
            resp = await client.post(url, json=payload, timeout=20.0)
            print("Status:", resp.status_code)
            print("Body:", resp.text)
        except Exception as e:
            print("Client error:", e)

if __name__ == "__main__":
    asyncio.run(test_chat())
