from flask import Flask, render_template, request, jsonify, redirect, url_for, session
import pandas as pd
import numpy as np
import pickle
import os
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split


app = Flask(__name__)



app = Flask(__name__)
app.secret_key = "your_secret_key"  

# Train model if not found
MODEL_PATH = "heart_model.pkl"

if not os.path.exists(MODEL_PATH):
    dataset = pd.read_csv("heart.csv")
    X = dataset.drop(columns="target", axis=1)
    Y = dataset["target"]
    X_train, X_test, Y_train, Y_test = train_test_split(X, Y, test_size=0.2, stratify=Y, random_state=2)

    model = LogisticRegression()
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
        # Process signup data (e.g., store in Firebase)
        return redirect({{ url_for('login') }})  # Redirect to login page after signup
    return render_template('signup.html')

# Route for Login Page
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        # Authenticate user
        return redirect({{ url_for('homepage') }})
    return render_template('login.html')  # This ensures Flask looks for the file

#@app.route('/login', methods=['GET', 'POST'])
#def login():
   # if request.method == 'POST':
        # Authenticate user (e.g., check Firebase credentials)
      #  return redirect(url_for('homepage'))  # Redirect to user home after login
   # return render_template('login.html')

# Route for User Home Page
@app.route("/doctors")
def doctors():
    return render_template("doctors.html")


@app.route('/userHome')
def userHome():
    return render_template('userHome.html')
@app.route('/logout')
def logout():
    return render_template('homepage.html')

@app.route("/admin_login")
def admin_login():
    return render_template("admin_login.html")

@app.route("/admin")
def admin():
    return render_template("admin.html")


@app.route("/risk_assessment", methods=["GET", "POST"])
def risk_assessment():
    if request.method == "POST":
        return jsonify({"message": "Risk assessment completed"})
    return render_template("risk_assessment.html")

@app.route("/hd_prediction", methods=["GET", "POST"])
def hd_prediction():
    if request.method == "POST":
        try:
            # Extract input values from form
            input_data = np.array([[
                int(request.form["age"]),
                int(request.form["sex"]),
                int(request.form["chest_pain"]),
                int(request.form["resting_bp"]),
                int(request.form["cholesterol"]),
                int(request.form["fasting_blood_sugar"]),
                int(request.form["resting_ecg"]),
                int(request.form["max_heart_rate"]),
                int(request.form["exercise_angina"]),
                float(request.form["oldpeak"]),
                int(request.form["st_slope"])
            ]])

            # Make prediction
            prediction = model.predict(input_data)[0]

            
            result = "Oops!!! You Have Heart Disease" if prediction == 1 else "Congratulations!!! You Have NO Heart Disease"

            return render_template("hd_prediction.html", prediction_result=result)

        except Exception as e:
            return jsonify({"error": str(e)})

    return render_template("hd_prediction.html")


if __name__ == '__main__':
    app.run(debug=True)
