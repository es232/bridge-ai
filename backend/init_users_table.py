import mysql.connector

try:
    db = mysql.connector.connect(
        host="localhost",
        user="root",
        password="1011",
        database="bridge_ai"
    )
    cursor = db.cursor()

    create_table_query = """
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(100),
        age VARCHAR(10),
        qualification VARCHAR(100),
        state VARCHAR(100),
        domain VARCHAR(100),
        expectations TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """
    
    cursor.execute(create_table_query)
    db.commit()
    print("✅ Users table created successfully!")

except Exception as e:
    print(f"❌ Database error: {e}")
finally:
    if 'db' in locals() and db.is_connected():
        cursor.close()
        db.close()
