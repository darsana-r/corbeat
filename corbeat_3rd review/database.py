import sqlite3

def init_db():
    conn = sqlite3.connect('heart_data.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS patient_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            age INTEGER,
            sex INTEGER,
            chest_pain INTEGER,
            resting_bp INTEGER,
            cholesterol INTEGER,
            fasting_blood_sugar INTEGER,
            resting_ecg INTEGER,
            max_heart_rate INTEGER,
            exercise_angina INTEGER,
            oldpeak REAL,
            st_slope INTEGER,
            prediction_result TEXT
        )
    ''')
    conn.commit()
    conn.close()

if __name__=="__main__":
    init_db()