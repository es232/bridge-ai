from fastapi import FastAPI, HTTPException, Depends, UploadFile, File
from fastapi.responses import StreamingResponse
from io import BytesIO
from gtts import gTTS
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import mysql.connector
from mysql.connector import pooling
from agents import EligibilityAgent, ResearcherAgent
import json
from google import genai 
import uvicorn
from duckduckgo_search import DDGS

# Import our custom modules
from auth import get_password_hash, verify_password, create_access_token, verify_token
from email_service import send_notification, get_welcome_html, get_opportunity_alert_html

app = FastAPI()

import os
from dotenv import load_dotenv

load_dotenv()

# --- CONFIGURATION ---
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY", "your-api-key")) 

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- DATABASE CONNECTION POOL ---
db_config = {
    "host": os.getenv("DB_HOST", "localhost"),
    "user": os.getenv("DB_USER", "root"),
    "password": os.getenv("DB_PASSWORD", "1011"),
    "database": os.getenv("DB_NAME", "bridge_ai"),
    "port": int(os.getenv("DB_PORT", 3306)),
    "pool_name": "bridge_pool",
    "pool_size": 5
}
try:
    db_pool = mysql.connector.pooling.MySQLConnectionPool(**db_config)
except Exception as e:
    print(f"❌ Could not create DB Pool: {e}")

def get_db_connection():
    return db_pool.get_connection()

# --- MODELS ---
class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    phone: str = ""
    age: str = ""
    qualification: str = ""
    state: str = ""
    domain: str = ""
    expectations: str = ""

class LoginRequest(BaseModel):
    email: str
    password: str

class SyncSavedRequest(BaseModel):
    saved_ids: list[int]

class UpdateProfileRequest(BaseModel):
    name: str = None
    age: str = None
    qualification: str = None
    state: str = None
    domain: str = None

class ChatRequest(BaseModel):
    message: str
    user_profile: dict

class TTSRequest(BaseModel):
    text: str
    lang: str = "en"

class ParseRegRequest(BaseModel):
    chat_history: str

# --- TTS ENDPOINT ---
@app.post("/tts")
def generate_speech(req: TTSRequest):
    # Map frontend shorthand to gTTS standard
    lang_code = 'en'
    if req.lang == 'ta': lang_code = 'ta'
    elif req.lang == 'hi': lang_code = 'hi'

    try:
        tts = gTTS(text=req.text, lang=lang_code, slow=False)
        fp = BytesIO()
        tts.write_to_fp(fp)
        fp.seek(0)
        return StreamingResponse(fp, media_type="audio/mpeg")
    except Exception as e:
        print("TTS Error:", e)
        raise HTTPException(status_code=500, detail="Voice generation failed")

# --- AUTH ENDPOINTS ---
@app.post("/register")
def register(user: RegisterRequest):
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Check if email exists
        cursor.execute("SELECT id FROM users WHERE email = %s", (user.email,))
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="Email already registered")
            
        hashed_password = get_password_hash(user.password)
        
        query = """INSERT INTO users 
                   (email, password_hash, name, phone, age, qualification, state, domain, expectations) 
                   VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"""
        values = (user.email, hashed_password, user.name, user.phone, user.age, user.qualification, user.state, user.domain, user.expectations)
        
        cursor.execute(query, values)
        conn.commit()
        
        user_id = cursor.lastrowid
        
        # Generate token
        token = create_access_token({"sub": user.email, "user_id": user_id})
        
        # Prepare user profile to return
        user_profile = {
            "name": user.name, "email": user.email, "age": user.age, 
            "qualification": user.qualification, "state": user.state, "domain": user.domain,
            "saved_ids": []
        }
        
        # TRIGGER WELCOME EMAIL NOTIFICATION (ASYNC ideally, but sync here for simplicity)
        if user.email:
            send_notification(
                user.email,
                f"Welcome to BridgeAI, {user.name}! 🚀",
                get_welcome_html(user.name)
            )

        return {"access_token": token, "token_type": "bearer", "user": user_profile}
        
    except HTTPException:
        raise
    except Exception as e:
        print("Exception:", e)
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")
    finally:
        if conn: conn.close()

@app.post("/login")
def login(creds: LoginRequest):
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        cursor.execute("SELECT * FROM users WHERE email = %s", (creds.email,))
        db_user = cursor.fetchone()
        
        if not db_user or not verify_password(creds.password, db_user['password_hash']):
            raise HTTPException(status_code=401, detail="Invalid email or password")
            
        token = create_access_token({"sub": creds.email, "user_id": db_user['id']})
        
        try:
            saved_arr = json.loads(db_user['saved_items']) if db_user.get('saved_items') else []
        except:
            saved_arr = []

        user_profile = {
            "name": db_user['name'], "email": db_user['email'], "age": db_user['age'], 
            "qualification": db_user['qualification'], "state": db_user['state'], "domain": db_user['domain'],
            "saved_ids": saved_arr
        }
        
        return {"access_token": token, "token_type": "bearer", "user": user_profile}
    finally:
        if conn: conn.close()


@app.post("/sync-saved")
def sync_saved(req: SyncSavedRequest, user_payload: dict = Depends(verify_token)):
    user_email = user_payload.get("sub")
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("UPDATE users SET saved_items = %s WHERE email = %s", (json.dumps(req.saved_ids), user_email))
        conn.commit()
        return {"status": "success"}
    finally:
        if conn: conn.close()

@app.post("/update-profile")
def update_profile(req: UpdateProfileRequest, user_payload: dict = Depends(verify_token)):
    user_email = user_payload.get("sub")
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        query = "UPDATE users SET name=%s, age=%s, qualification=%s, state=%s, domain=%s WHERE email=%s"
        cursor.execute(query, (req.name, req.age, req.qualification, req.state, req.domain, user_email))
        conn.commit()
        return {"status": "success"}
    except Exception as e:
        print("Update error:", e)
        raise HTTPException(status_code=500, detail="Update failed")
    finally:
        if conn: conn.close()

# --- CORE ENDPOINTS ---

@app.get("/opportunities")
def fetch_opportunities(category: str = None, search: str = None):
    # ... existing implementation exactly as before ...
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        query = "SELECT * FROM opportunities WHERE 1=1"
        params = []
        if category:
            query += " AND (tags LIKE %s OR type = %s)"
            params.extend([f"%{category}%", category])
        if search:
            query += " AND (title_en LIKE %s OR description_en LIKE %s)"
            params.extend([f"%{search}%", f"%{search}%"])
        query += " ORDER BY match_score DESC"
        cursor.execute(query, params)
        rows = cursor.fetchall()
        
        opportunities = [] 
        for row in rows:
            opportunities.append({
                'id': row['id'], 'type': row['type'],
                'title': {'en': row['title_en'], 'ta': row['title_ta']},
                'match_score': row['match_score'], 'value_amount': row['value_amount'],
                'tags': json.loads(row['tags']) if isinstance(row['tags'], str) else row['tags'],
                'description_en': row['description_en'],
                'requirements': json.loads(row['requirements']) if isinstance(row['requirements'], str) else row['requirements'],
                'apply_link': row['apply_link']
            })
        return opportunities
    finally:
        if conn: conn.close()
            
@app.post("/extract-vision")
async def extract_vision(file: UploadFile = File(...)):
    contents = await file.read()
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=[
                "Read this ID or marksheet. Return ONLY raw JSON with keys: 'name', 'age', 'qualification', 'state'. Do not write markdown backticks.",
                {"mime_type": file.content_type, "data": contents}
            ]
        )
        try:
            return json.loads(response.text.strip().replace('```json', '').replace('```', ''))
        except:
            return {"name": "Vision Error - Could not parse"}
    except Exception as e:
        print("Vision API Error:", e)
        raise HTTPException(status_code=500, detail="Vision AI Error")

@app.post("/chat")
async def chat_endpoint(req: ChatRequest):
    user = req.user_profile
    conn = None
    try:
        # Agent 1: Eligibility Math
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT id, type, title_en, tags FROM opportunities")
        all_opps = cursor.fetchall()
        ranked_opps = EligibilityAgent.filter_and_rank(user, all_opps)
        
        # Agent 2: Researcher Live Web Search
        live_web_data = ResearcherAgent.perform_live_search(req.message)
        
        # Agent 3: Synthesis
        system_prompt = f"""
        You are BridgeAI, a highly intelligent Multi-Agent platform helping: 
        Name: {user.get('name')}
        Qualification: {user.get('qualification')}
        State: {user.get('state')}
        
        SWARM DATA:
        1. DATABASE MATH MATCHES: {json.dumps(ranked_opps)}
        2. LIVE WEB RESEARCH: {json.dumps(live_web_data)}
        
        CRITICAL INSTRUCTIONS:
        1. Respond to the user natively and warmly. Suggest highly matched items outlining exactly *why* they match.
        2. Be EXTREMELY conversational, concise, and punchy (Max 3-4 sentences).
        3. DO NOT USE ANY MARKDOWN (*, **, #). Provide PLAIN TEXT ONLY. Your output is being streamed directly to a Text-To-Speech engine.
        """
        
        import time
        response_text = ""
        for attempt in range(3):
            try:
                response = client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=f"{system_prompt}\n\nUser: {req.message}"
                )
                response_text = response.text
                break
            except Exception as retry_err:
                if attempt == 2:
                    error_msg = str(retry_err)
                    if "503" in error_msg or "UNAVAILABLE" in error_msg:
                        response_text = "The global AI servers are experiencing extremely high demand right now. Please wait a few seconds and try again!"
                    else:
                        response_text = "I'm having a brief technical hiccup. Please try again in a moment!"
                time.sleep(1)
                
        return {"response": response_text}

    except Exception as e:
        print(f"Internal Chat Error: {e}") 
        return {"response": "I'm having a massive technical hiccup. Please try again!"}
    finally:
        if conn: conn.close()

@app.post("/parse-registration")
def parse_registration(req: ParseRegRequest):
    try:
        system_prompt = """You are an elite NLP data extraction AI. Read the upcoming conversational transcript.
        Extract the user details into a strict RAW JSON object with NO markdown or code fences. 
        Keys permitted: name, email, password, phone, age, qualification, state, expectations, domain.
        CRITICAL INSTRUCTIONS: 
        1. ONLY extract the exact literal values. 
        2. If the user says 'I am looking for scholarships', DO NOT put that as their name.
        3. If no name is explicitly given (e.g. they only answer 'hello'), leave 'name' completely empty.
        4. Leave missing keys entirely out of the JSON."""
        
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=f"{system_prompt}\nUser Chat:\n{req.chat_history}"
        )
        return json.loads(response.text.strip().replace('```json', '').replace('```', ''))
    except Exception as e:
        print("Registration parsing error:", e)
        return {}

@app.get("/recommendations")
def get_ai_recommendations(user_payload: dict = Depends(verify_token)):
    user_email = user_payload.get("sub")
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Get user details
        cursor.execute("SELECT * FROM users WHERE email = %s", (user_email,))
        user = cursor.fetchone()
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # In a real app, you would pass all DB opportunities to Gemini to filter.
        # Here we just fetch Top 6 from DB directly for performance, then use simple logic, 
        # but to prove AI ranking, we'll let Gemini rank some.
        return {"status": "AI Dashboard Ready", "user": user["name"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if conn: conn.close()

class BroadcastOpportunityRequest(BaseModel):
    title_en: str
    type: str
    value_amount: str
    requirements: list[str]
    access_code: str # Simple security check

@app.post("/admin/broadcast")
def admin_broadcast(req: BroadcastOpportunityRequest):
    if req.access_code != "bridge_admin_777":
        raise HTTPException(status_code=403, detail="Forbidden")
    
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        # Fetch all registered users
        cursor.execute("SELECT name, email FROM users WHERE email IS NOT NULL AND email != ''")
        all_users = cursor.fetchall()
        
        req_str = ", ".join(req.requirements)
        
        # Broadcast the Opportunity Alert using the beautiful Apple-grade template
        success_count = 0
        for usr in all_users:
            subject = f"New {req.type.title()} Match: {req.title_en}"
            html = get_opportunity_alert_html(
                usr['name'], req.title_en, req.type, req.value_amount, req_str
            )
            if send_notification(usr['email'], subject, html):
                success_count += 1
                
        return {"status": "success", "message": f"Broadcast successfully sent to {success_count} users."}
    finally:
        if conn: conn.close()

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)