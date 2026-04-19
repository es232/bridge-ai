import mysql.connector
try:
    db = mysql.connector.connect(host="localhost", user="root", password="1011", database="bridge_ai")
    cursor = db.cursor()
    cursor.execute("ALTER TABLE users ADD COLUMN saved_items JSON")
    db.commit()
    print("✅ Migration: added saved_items JSON column")
except Exception as e:
    print(f"Migration error (might already exist): {e}")
