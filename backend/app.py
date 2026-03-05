from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import uuid
from datetime import datetime
import os
from zoneinfo import ZoneInfo

from supabase import create_client
from dotenv import load_dotenv
# ✅ SendGrid Imports
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

# ✅ Excel Imports
from openpyxl import Workbook, load_workbook

app = Flask(__name__)
CORS(app)

DATA_FILE = "complaints.json"
EXCEL_FILE = "complaints.xlsx"

# ✅ Load .env
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ENV_PATH = os.path.join(BASE_DIR, ".env")
load_dotenv(dotenv_path=ENV_PATH)

# -------- Supabase Config --------
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

supabase = None
if SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY:
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
        print("✅ Supabase client initialized")
    except Exception as e:
        print("❌ Supabase client init error:", e)
else:
    print("⚠️ Supabase not configured.")

# -------- Email Portfolio Mapping --------
PORTFOLIO_EMAILS = {
    "water": "a22853041@gmail.com",
    "electricity": "efgh28099@gmail.com",
    "housekeeping": "ijkl66708@gmail.com",
    "security": "mnop7875@gmail.com"
}

# -------- Utility Functions --------
def load_complaints():
    if not os.path.exists(DATA_FILE):
        return []
    with open(DATA_FILE, "r") as f:
        return json.load(f)

def save_complaints(data):
    with open(DATA_FILE, "w") as f:
        json.dump(data, f, indent=4)

# -------- Excel Save Function --------
def save_to_excel(complaint):
    try:
        if os.path.exists(EXCEL_FILE):
            workbook = load_workbook(EXCEL_FILE)
            sheet = workbook.active
        else:
            workbook = Workbook()
            sheet = workbook.active
            sheet.title = "Complaints"

            headers = [
                "Complaint ID",
                "Flat Number",
                "Name",
                "Phone",
                "Portfolio",
                "Description",
                "Date"
            ]
            sheet.append(headers)

        sheet.append([
            complaint["complaint_id"],
            complaint["flat_number"],
            complaint["name"],
            complaint["phone"],
            complaint["portfolio"],
            complaint["description"],
            complaint["date"]
        ])

        workbook.save(EXCEL_FILE)
        print("✅ Saved to Excel")

    except Exception as e:
        print("❌ Excel save error:", e)

# -------- Email Function --------
def send_email(complaint):
    receiver = PORTFOLIO_EMAILS.get((complaint.get("portfolio") or "").lower())

    if not receiver:
        print("❌ No email mapped for portfolio")
        return

    message = Mail(
        from_email="tribhuvanroy2006@gmail.com",  # Must be verified in SendGrid
        to_emails=receiver,
        subject=f"New {complaint['portfolio'].title()} Complaint",
        html_content=f"""
        <h3>New Complaint Registered</h3>
        <p><b>Complaint ID:</b> {complaint['complaint_id']}</p>
        <p><b>Resident:</b> {complaint['name']}</p>
        <p><b>Flat Number:</b> {complaint['flat_number']}</p>
        <p><b>Phone:</b> {complaint['phone']}</p>
        <p><b>Portfolio:</b> {complaint['portfolio']}</p>
        <p><b>Description:</b> {complaint['description']}</p>
        <p><b>Date:</b> {complaint['date']}</p>
        """
    )

    try:
        sg = SendGridAPIClient(os.getenv("SENDGRID_API_KEY"))
        sg.send(message)
        print(f"✅ Email sent to {receiver}")
    except Exception as e:
        print("❌ SendGrid error:", e)

# -------- Supabase Insert --------
def save_to_supabase(complaint):
    if not supabase:
        print("⚠️ Supabase insert skipped.")
        return

    try:
        payload = {
            "complaint_id": complaint["complaint_id"],
            "flat_number": complaint["flat_number"],
            "name": complaint["name"],
            "phone": complaint["phone"],
            "portfolio": complaint["portfolio"],
            "description": complaint["description"],
        }

        res = supabase.table("complaints").insert(payload).execute()
        print("✅ Saved to Supabase:", res.data)

    except Exception as e:
        print("❌ Supabase insert error:", e)

# -------- Home Route --------
@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "status": "OK",
        "message": "Community Connect Backend is running"
    })

# -------- Submit Complaint API --------
@app.route("/submit-complaint", methods=["POST"])
def submit_complaint():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No data received"}), 400

    # ✅ Required Field Validation
    required_fields = ["flat_number", "resident_name", "phone_number", "portfolio", "description"]

    for field in required_fields:
        if not data.get(field):
            return jsonify({"error": f"{field} is required"}), 400

    complaint_id = str(uuid.uuid4())[:8]

    complaint = {
        "complaint_id": complaint_id,
        "flat_number": data.get("flat_number"),
        "name": data.get("resident_name"),
        "phone": data.get("phone_number"),
        "portfolio": data.get("portfolio"),
        "description": data.get("description"),
        "date": datetime.now(ZoneInfo("Asia/Kolkata")).strftime("%Y-%m-%d --- %H:%M:%S")
    }

    # Save JSON
    complaints = load_complaints()
    complaints.append(complaint)
    save_complaints(complaints)

    # Save Supabase
    save_to_supabase(complaint)

    # Save Excel
    save_to_excel(complaint)

    # Send Email
    send_email(complaint)

    return jsonify({
        "message": "Complaint submitted successfully",
        "complaint_id": complaint_id
    }), 200

# -------- Run Server --------
if __name__ == "__main__":
    app.run(debug=True)

