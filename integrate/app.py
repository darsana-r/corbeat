from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

# Route for Home Page
@app.route('/')
def home():
    return render_template('home.html')

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
@app.route('/homepage')
def homepage():
    return render_template('homepage.html')

if __name__ == '__main__':
    app.run(debug=True)
