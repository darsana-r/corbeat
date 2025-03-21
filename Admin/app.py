from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def admin_dashboard():
    return render_template('adminfinal.html')

if __name__ == '__main__':
    app.run(debug=True)