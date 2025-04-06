from flask import Flask, render_template, request, jsonify, redirect, url_for, session
import pandas as pd
import numpy as np
import pickle
import os
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import sqlite3


app = Flask(__name__)
app.secret_key="your_secret_key"


# Train model if not found
MODEL_PATH = "heart_model.pkl"

if not os.path.exists(MODEL_PATH):
    dataset = pd.read_csv("heart.csv")
    X = dataset.drop(columns="target", axis=1)
    Y = dataset["target"]
    X_train, X_test, Y_train, Y_test = train_test_split(X, Y, test_size=0.2, stratify=Y, random_state=2)
     
    #here we tested two ML model (LR,RF).RF get high accuracy
    #model = LogisticRegression()
    
    model=RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, Y_train)

    with open(MODEL_PATH, "wb") as f:
        pickle.dump(model, f)

# Load the trained model once to optimize performance
with open(MODEL_PATH, "rb") as f:
    model = pickle.load(f)


# Route for Home Page

@app.route('/')
def home():
    return render_template('homepage.html')


# Route for Signup Page
@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        return redirect(url_for('login'))
    return render_template('signup.html')


# Route for Login Page
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        # Authenticate user
        return redirect( url_for('userHome'))
    return render_template('login.html') 


#route for home page of user
@app.route('/userHome')
def userHome():
    return render_template('userHome.html')


#route for doctors database
@app.route("/doctors")
def doctors():
    return render_template("doctors.html")


#route for landing page
@app.route('/logout')
def logout():
    return render_template('homepage.html')


#route for admin login page
@app.route("/admin_login")
def admin_login():
    ADMIN_USERNAME = "admin"
    ADMIN_PASSWORD = "corbeat"

    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        if username == ADMIN_USERNAME and password == ADMIN_PASSWORD:
            session['admin'] = True  
            flash("Login successful!", "success")
            return redirect(url_for('admin_dashboard'))
        else:
            flash("Invalid username or password!", "danger")

    
    return render_template("admin_login.html")


#admin dashboard
@app.route("/admin_dashboard")
def admin_dashboard():

    conn = sqlite3.connect('heart_data.db')
    cursor = conn.cursor()
    
    cursor.execute('SELECT COUNT(*) FROM patient_data')
    total_predictions = cursor.fetchone()[0]
    
    conn.close()
    
    return render_template('admin.html', total_predictions=total_predictions)


#HD risk assessment survey
@app.route("/risk_assessment", methods=["GET", "POST"])
def risk_assessment():
    if request.method == "POST":
        return jsonify({"message": "Risk assessment completed"})
    return render_template("risk_assessment.html")


#HD prediction
@app.route("/hd_prediction", methods=["GET", "POST"])
def hd_prediction():
    if request.method == "POST":
        try:
            # Extract input values from form
            age = int(request.form["age"])
            sex = int(request.form["sex"])
            chest_pain = int(request.form["chest_pain"])
            resting_bp = int(request.form["resting_bp"])
            cholesterol = int(request.form["cholesterol"])
            fasting_blood_sugar = int(request.form["fasting_blood_sugar"])
            resting_ecg = int(request.form["resting_ecg"])
            max_heart_rate = int(request.form["max_heart_rate"])
            exercise_angina = int(request.form["exercise_angina"])
            oldpeak = float(request.form["oldpeak"])
            st_slope = int(request.form["st_slope"])

            # Prepare the input data for prediction
            input_data = np.array([[age, sex, chest_pain, resting_bp, cholesterol,
                                    fasting_blood_sugar, resting_ecg, max_heart_rate,
                                    exercise_angina, oldpeak, st_slope]])

            # Make prediction
            prediction = model.predict(input_data)[0]

            # Prepare the result message
            prediction_result = "Warning!!!  There's a strong possibility of heart disease." if prediction == 1 else "Congratulations! You have a very low chance of heart disease"

            # Save data to the database
            conn = sqlite3.connect('heart_data.db')
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO patient_data (age, sex, chest_pain, resting_bp, cholesterol, 
                                          fasting_blood_sugar, resting_ecg, max_heart_rate, 
                                          exercise_angina, oldpeak, st_slope, prediction_result)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (age, sex, chest_pain, resting_bp, cholesterol, fasting_blood_sugar,
                  resting_ecg, max_heart_rate, exercise_angina, oldpeak, st_slope, prediction_result))
            conn.commit()
            conn.close()

            # Display the result to the user
            return render_template("hd_prediction.html", prediction_result=prediction_result)

        except Exception as e:
            return jsonify({"error": str(e)})

    return render_template("hd_prediction.html")

if __name__ == '__main__':
    app.run(debug=True)
