from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
import os

app = Flask(__name__)
CORS(app)


# ===============================
# DATABASE CONNECTION
# ===============================

def get_db_connection():
    return mysql.connector.connect(
        host=os.getenv("MYSQLHOST", "localhost"),
        port=int(os.getenv("MYSQLPORT", "3306")),
        user=os.getenv("MYSQLUSER", "root"),
        password=os.getenv("MYSQLPASSWORD", ""),
        database=os.getenv("MYSQLDATABASE", "portfolio_db")
    )


# ===============================
# HOME
# ===============================

@app.route("/")
def home():
    return jsonify({
        "message": "Priyadharsini Portfolio Backend is Running!"
    })


# ===============================
# PROFILE
# ===============================

@app.route("/api/profile", methods=["GET"])
def get_profile():

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    cursor.execute("""
        SELECT *
        FROM profile
        LIMIT 1
    """)

    profile = cursor.fetchone()

    cursor.close()
    connection.close()

    return jsonify(profile)


# ===============================
# PROJECTS
# ===============================

@app.route("/api/projects", methods=["GET"])
def get_projects():

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    cursor.execute("""
        SELECT *
        FROM projects
        ORDER BY id DESC
    """)

    projects = cursor.fetchall()

    cursor.close()
    connection.close()

    return jsonify(projects)


# ===============================
# CONTACT FORM
# ===============================

@app.route("/api/contact", methods=["POST"])
def contact():

    data = request.json

    name = data.get("name")
    email = data.get("email")
    subject = data.get("subject")
    message = data.get("message")

    if not name or not email or not message:
        return jsonify({
            "success": False,
            "message": "Name, email and message are required."
        }), 400

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("""
        INSERT INTO messages
        (name, email, subject, message)
        VALUES (%s, %s, %s, %s)
    """, (name, email, subject, message))

    connection.commit()

    cursor.close()
    connection.close()

    return jsonify({
        "success": True,
        "message": "Your message has been sent successfully!"
    })


# ===============================
# RUN SERVER
# ===============================

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.getenv("PORT", 5000)),
        debug=False
    )