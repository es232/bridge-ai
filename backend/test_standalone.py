import json
import mysql.connector
from google import genai
from duckduckgo_search import DDGS

db_config = {
    "host": "localhost",
    "user": "root",
    "password": "1011",
    "database": "bridge_ai"
}

def perform_live_search(query: str):
    try:
        results = DDGS().text(f"{query} scholarships schemes opportunities India", max_results=3)
        return json.dumps([{"title": r['title'], "snippet": r['body'], "link": r['href']} for r in results])
    except Exception as e:
        print("Live search error:", e)
        return "[]"

client = genai.Client(api_key="AIzaSyCnZTOxupgZqv1oWgd-K5fhbHqD2o-nRbU") 

def run_chat_test():
    user = {"name": "Test", "qualification": "UG", "state": "TN"}
    req_message = "Find me scholarships"
    conn = None
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT type, title_en, tags FROM opportunities LIMIT 15")
        db_data = cursor.fetchall()
        
        live_web_data = perform_live_search(req_message)
        
        system_prompt = f"""
        You are BridgeAI, an inclusive, highly intelligent agent.
        You are helping: {user.get('name')} (Qualification: {user.get('qualification')}, State: {user.get('state')}).
        
        Your Sources:
        1. LOCAL DATABASE: {json.dumps(db_data)}
        2. LIVE WEB SEARCH RESULTS: {live_web_data}
        
        Task: perfectly answer using sources.
        """
        
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=f"{system_prompt}\n\nUser: {req_message}"
        )
        print("SUCCESS! Output:")
        print(response.text)
    except Exception as e:
        print("FAILED WITH ERROR:")
        import traceback
        traceback.print_exc()
    finally:
        if conn: conn.close()

if __name__ == "__main__":
    run_chat_test()
