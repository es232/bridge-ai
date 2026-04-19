import mysql.connector

try:
    db = mysql.connector.connect(
        host="localhost",
        user="root",
        password="1011",
        database="bridge_ai"
    )
    cursor = db.cursor()
    cursor.execute("ALTER TABLE users ADD COLUMN phone VARCHAR(20) DEFAULT ''")
    db.commit()
    print("✅ Phone column added to users table!")
except Exception as e:
    print(f"Migration error (might already exist): {e}")
finally:
    if 'db' in locals() and db.is_connected():
        cursor.close()
        db.close()
