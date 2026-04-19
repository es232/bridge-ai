import mysql.connector

try:
    db = mysql.connector.connect(
        host="localhost",
        user="root",
        password="1011",
        database="bridge_ai"
    )
    cursor = db.cursor()
    query = """INSERT INTO users 
               (email, password_hash, name, age, qualification, state, domain, expectations) 
               VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"""
    values = ("test@example.com", "hash", "Test Name", "20", "UG", "TN", "CS", "None")
    cursor.execute(query, values)
    db.commit()
    print("Success")
except Exception as e:
    print(f"Error: {e}")
finally:
    if 'db' in locals() and db.is_connected():
        db.close()
