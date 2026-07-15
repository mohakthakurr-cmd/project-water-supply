from flask import Flask, render_template, request, jsonify, redirect

import sqlite3
import subprocess
from datetime import date
import os

app = Flask(__name__)


BASE_FOLDER = os.path.dirname(os.path.abspath(__file__))
DATABASE = os.path.join(BASE_FOLDER, "water_supply.db")


STATUS_PROGRAM = os.path.join(BASE_FOLDER, "water_status")


def get_database():
    connection = sqlite3.connect(DATABASE)
    connection.row_factory = sqlite3.Row
    return connection

def get_tank_status(level):
    result = subprocess.run(
        [STATUS_PROGRAM],
        input=str(level),
        text=True,
        capture_output=True
    )
    return result.stdout.strip()

def setup_database():
    connection = get_database()

    with open(os.path.join(BASE_FOLDER, "schema.sql"), "r") as file:
        connection.executescript(file.read())

    connection.commit()

    count = connection.execute("SELECT COUNT(*) FROM wards").fetchone()[0]

    if count == 0:
        connection.executemany(
            """
            INSERT INTO wards
            (ward_id, area_name, zone, supply_days, supply_time)
            VALUES (?, ?, ?, ?, ?)
            """,
            [
                (1, "Sanjauli", "North", "Monday and Thursday", "6:00 AM - 8:00 AM"),
                (2, "Mall Road", "Central", "Tuesday and Friday", "7:00 AM - 9:00 AM"),
                (3, "Summer Hill", "South", "Wednesday and Saturday", "6:30 AM - 8:30 AM")
            ]
        )

        connection.executemany(
            """
            INSERT INTO tanks
            (tank_name, ward_id, water_level)
            VALUES (?, ?, ?)
            """,
            [
                ("Sanjauli Lift Tank", 1, 72),
                ("Central Storage Tank", 2, 58),
                ("Summer Hill Tank", 3, 81)
            ]
        )

        connection.execute(
            """
            INSERT INTO alerts
            (ward_id, alert_message)
            VALUES (?, ?)
            """,
            (
                2,
                "Pipeline maintenance may delay supply by one hour."
            )
        )

        connection.commit()

    connection.close()


setup_database()


@app.route("/")
def home():
    connection = get_database()

    wards = connection.execute("SELECT * FROM wards").fetchall()
    tanks = connection.execute("SELECT * FROM tanks").fetchall()
    alerts = connection.execute("SELECT * FROM alerts").fetchall()

    connection.close()

    tank_data = []

    for tank in tanks:
        tank_data.append({
            "name": tank["tank_name"],
            "level": tank["water_level"],
            "status": get_tank_status(tank["water_level"])
        })

    return render_template(
        "index.html",
        wards=wards,
        tanks=tank_data,
        alerts=alerts
    )


@app.route("/submit-feedback", methods=["POST"])
def submit_feedback():
    name = request.form["name"]
    ward_id = request.form["ward_id"]
    message = request.form["message"]

    connection = get_database()

    connection.execute(
    """
    INSERT INTO complaints
    (person_name, ward_id, message, submitted_on, status)
    VALUES (?, ?, ?, ?, ?)
    """,
    (
        name,
        ward_id,
        message,
        date.today().isoformat(),
        "Pending"
    )
)

    connection.commit()
    connection.close()

    return jsonify({"message": "Feedback submitted successfully!"})

@app.route("/complaints")
def view_complaints():
    connection = get_database()

    complaints = connection.execute("""
        SELECT
            complaints.complaint_id,
            complaints.person_name,
            wards.area_name,
            complaints.message,
            complaints.submitted_on,
            complaints.status
        FROM complaints
        JOIN wards
        ON complaints.ward_id = wards.ward_id
        ORDER BY complaints.complaint_id DESC
    """).fetchall()

    total = len(complaints)
    pending = sum(1 for c in complaints if c["status"] == "Pending")
    resolved = sum(1 for c in complaints if c["status"] == "Resolved")

    connection.close()

    return render_template(
        "complaints.html",
        complaints=complaints,
        total=total,
        pending=pending,
        resolved=resolved
    )

if __name__ == "__main__":
    app.run(debug=True)