import mysql.connector
import json

# Connect to your MySQL Workbench
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="1011",
    database="bridge_ai"
)
cursor = db.cursor()

# Real-world sample data to "Seed" your DB
scraped_data = [
    {
        "type": "scholarships",
        "title_en": "HDFC Badhte Kadam Scholarship",
        "title_ta": "HDFC முன்னேற்ற கல்வி உதவித்தொகை",
        "match_score": 92,
        "value_amount": "₹1,00,000",
        "tags": ["Private", "Merit-Based"],
        "desc": "Supports students from high school to graduation.",
        "reqs": ["Income Certificate", "Mark Sheet"],
        "link": "https://www.buddy4study.com/page/hdfc-bank-parivartan-s-ecss-scholarship"
    },
    {
        "type": "schemes",
        "title_en": "PM SVANidhi Scheme",
        "title_ta": "பிரதமர் ஸ்வாநிதி திட்டம்",
        "match_score": 85,
        "value_amount": "₹10,000 Loan",
        "tags": ["Govt", "Business"],
        "desc": "Working capital loan for street vendors.",
        "reqs": ["Aadhar Card", "Voter ID"],
        "link": "https://pmsvanidhi.mohua.gov.in/"
    }
]

query = """INSERT INTO opportunities 
           (type, title_en, title_ta, match_score, value_amount, tags, description_en, requirements, apply_link) 
           VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"""

for item in scraped_data:
    values = (
        item["type"], item["title_en"], item["title_ta"], item["match_score"],
        item["value_amount"], json.dumps(item["tags"]), item["desc"], 
        json.dumps(item["reqs"]), item["link"]
    )
    cursor.execute(query, values)

db.commit()
print(f"Successfully added {len(scraped_data)} opportunities to MySQL!")