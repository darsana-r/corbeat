import sqlite3

conn = sqlite3.connect('heart_data.db')
cursor = conn.cursor()

cursor.execute("SELECT * FROM patient_data")
rows = cursor.fetchall()
conn.close()

if rows:
    for row in rows:
        print(row)
else:
    print("No data found in the table.")
