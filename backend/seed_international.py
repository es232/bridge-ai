import mysql.connector

try:
    db = mysql.connector.connect(
        host="localhost",
        user="root",
        password="1011",
        database="bridge_ai"
    )
    cursor = db.cursor()
    import json
    
    try:
        cursor.execute("ALTER TABLE opportunities ADD COLUMN description_ta TEXT")
        db.commit()
    except:
        pass

    international_opps = [
        {
            "type": "scholarship",
            "title_en": "Oxford Reach Scholarship",
            "title_ta": "ஆக்ஸ்போர்டு ரீச் உதவித்தொகை",
            "title_hi": "ऑक्सफोर्ड रीच छात्रवृत्ति",
            "description_en": "Full scholarship for exceptional students from developing countries to study at Oxford University.",
            "description_ta": "வளர்ந்து வரும் நாடுகளின் மாணவர்களுக்கான முழுமையான ஆக்ஸ்போர்டு உதவித்தொகை.",
            "description_hi": "ऑक्सफोर्ड में पढ़ने के लिए विकासशील देशों के छात्रों के लिए पूर्ण छात्रवृत्ति।",
            "requirements": json.dumps(["Academic Merit (95%+)", "Financial Need", "Leadership"]),
            "match_score": 98,
            "value_amount": "£30,000/yr",
            "apply_link": "https://www.ox.ac.uk/",
            "tags": json.dumps(["UG", "PG", "International", "Oxford", "Any State", "India"])
        },
        {
            "type": "scholarship",
            "title_en": "Chevening Scholarship (UK)",
            "title_ta": "செவனிங் உதவித்தொகை (யுகே)",
            "title_hi": "शेवनिंग छात्रवृत्ति (यूके)",
            "description_en": "UK government's global scholarship programme offering fully-funded master's degrees.",
            "description_ta": "முழுமையாக நிதியளிக்கப்பட்ட முதுகலை பட்டங்களுக்கான யுகே அரசாங்கத்தின் உலகளாவிய கல்வித் திட்டம்.",
            "description_hi": "पूरी तरह से वित्त पोषित मास्टर डिग्री की पेशकश करने वाला यूके सरकार का वैश्विक छात्रवृत्ति कार्यक्रम।",
            "requirements": json.dumps(["Undergraduate degree", "2 years work experience", "Leadership potential"]),
            "match_score": 95,
            "value_amount": "Fully Funded",
            "apply_link": "https://www.chevening.org/",
            "tags": json.dumps(["PG", "International", "Leaders", "UK", "Any State", "India"])
        },
        {
            "type": "scholarship",
            "title_en": "Fulbright Foreign Student Program (USA)",
            "title_ta": "ஃபுல்பிரைட் வெளிநாட்டு மாணவர் திட்டம் (அமெரிக்கா)",
            "title_hi": "फुलब्राइट विदेशी छात्र कार्यक्रम (यूएसए)",
            "description_en": "Enables graduate students, young professionals to study and conduct research in the US.",
            "description_ta": "அமெரிக்காவில் முதுகலை படிக்க அல்லது ஆராய்ச்சி செய்ய விரும்பும் வெளிநாட்டு மாணவர்களுக்கான திட்டம்.",
            "description_hi": "स्नातक छात्रों, युवा पेशेवरों को अमेरिका में अध्ययन और शोध करने में सक्षम बनाता है।",
            "requirements": json.dumps(["Academic record", "English proficiency", "Cross-cultural exchange"]),
            "match_score": 96,
            "value_amount": "$40,000/yr",
            "apply_link": "https://foreign.fulbrightonline.org/",
            "tags": json.dumps(["PG", "Research", "USA", "International", "Any State", "India"])
        }
    ]

    insert_query = """
    INSERT INTO opportunities (
        type, title_en, title_ta, title_hi, description_en, description_ta, description_hi, 
        requirements, match_score, value_amount, apply_link, tags
    ) VALUES (
        %(type)s, %(title_en)s, %(title_ta)s, %(title_hi)s, %(description_en)s, %(description_ta)s, %(description_hi)s, 
        %(requirements)s, %(match_score)s, %(value_amount)s, %(apply_link)s, %(tags)s
    )
    """
    
    count = 0
    for opp in international_opps:
        # Avoid duplicate insertions
        cursor.execute("SELECT id FROM opportunities WHERE title_en = %s", (opp["title_en"],))
        if not cursor.fetchone():
            cursor.execute(insert_query, opp)
            count += 1

    db.commit()
    print(f"✅ Successfully inserted {count} international opportunities!")

except Exception as e:
    print(f"Error seeding database: {e}")
finally:
    if 'db' in locals() and db.is_connected():
        cursor.close()
        db.close()
