import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime

import os
from dotenv import load_dotenv

load_dotenv()

# Cloud-agnostic configuration via environment variables
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SENDER_EMAIL = os.getenv("SMTP_EMAIL", "your-email@gmail.com") 
SENDER_PASSWORD = os.getenv("SMTP_PASSWORD", "")

def send_notification(to_email: str, subject: str, message_html: str):
    print(f"\n[{datetime.now()}] 🚀 PREPARING TO SEND EMAIL TO: {to_email}")
    print(f"Subject: {subject}\n")
    
    msg = MIMEMultipart()
    msg['From'] = f"BridgeAI <{SENDER_EMAIL}>"
    msg['To'] = to_email
    msg['Subject'] = subject
    msg.attach(MIMEText(message_html, 'html'))
    
    try:
        # Fallback console log for testing if not configured
        if SENDER_EMAIL == "your-email@gmail.com":
            print("⚠️ SMTP credentials not configured. Printing email to console instead:")
            print("========================================")
            print(message_html)
            print("========================================")
            return True
            
        # Actual SMTP Send
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        server.send_message(msg)
        server.quit()
        print("✅ Email successfully sent!")
        return True
    except Exception as e:
        print(f"❌ Failed to send email: {e}")
        return False

def get_welcome_html(user_name):
    return f"""
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8fafc; padding: 40px; text-align: center;">
        <div style="max-w-xl mx-auto background-color: #ffffff; border-radius: 20px; padding: 40px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); text-align: left; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0;">
            <div style="display: flex; align-items: center; justify-content: center; width: 100px; height: 60px; background-color: #4f46e5; border-radius: 15px; margin-bottom: 20px;">
                <span style="color: white; font-size: 24px; font-weight: bold;">BRIDGE</span>
            </div>
            <h1 style="color: #0f172a; font-size: 28px; font-weight: 800; margin-bottom: 10px;">Welcome to the Future of Discovery, {user_name}.</h1>
            <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                We are absolutely thrilled to have you here. Your BridgeAI conversational assistant is officially online and matching your profile parameters with the best government schemes, global scholarships, and grants.
            </p>
            <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                We promise to handle the chaotic portal navigation so you can focus on building your career. Every piece of advice is tailored precisely for your demographic.
            </p>
            <a href="http://localhost:5173/dashboard" style="display: inline-block; background-color: #4f46e5; color: #ffffff; font-weight: bold; text-decoration: none; padding: 14px 28px; border-radius: 12px; font-size: 16px;">Access Your Dashboard</a>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 40px 0;">
            <p style="color: #94a3b8; font-size: 12px; text-align: center;">© {(datetime.now().year)} BridgeAI Engine. Always evolving.</p>
        </div>
    </div>
    """

def get_opportunity_alert_html(user_name, opp_title, opp_type, opp_value, required_docs):
    return f"""
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8fafc; padding: 40px; text-align: center;">
        <div style="max-w-xl mx-auto background-color: #ffffff; border-radius: 20px; padding: 40px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); text-align: left; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0;">
            <div style="display: inline-block; padding: 6px 14px; background-color: #10b981; color: #ffffff; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase; margin-bottom: 20px;">
                NEW MATCH 🎯
            </div>
            <h1 style="color: #0f172a; font-size: 26px; font-weight: 800; margin-bottom: 10px;">A new {opp_type} just dropped, {user_name}!</h1>
            <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                BridgeAI Swarm detected a newly added opportunity that aligns exquisitely with your saved profile parameters:
            </p>
            <div style="background-color: #f1f5f9; padding: 20px; border-radius: 12px; border-left: 4px solid #4f46e5; margin-bottom: 30px;">
                <h2 style="color: #1e293b; font-size: 18px; margin-top: 0; margin-bottom: 10px;">{opp_title}</h2>
                <p style="color: #64748b; font-size: 14px; margin: 0;"><strong>Value Estimate:</strong> {opp_value}</p>
                <p style="color: #64748b; font-size: 14px; margin-top: 8px; margin-bottom:0;"><strong>Requirements:</strong> {required_docs}</p>
            </div>
            <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                Our Application Copilot is primed and ready to guide you step-by-step through this portal.
            </p>
            <a href="http://localhost:5173/dashboard" style="display: inline-block; background-color: #4f46e5; color: #ffffff; font-weight: bold; text-decoration: none; padding: 14px 28px; border-radius: 12px; font-size: 16px;">View Details & Auto-Apply</a>
        </div>
    </div>
    """
