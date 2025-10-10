from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from email.mime.text import MIMEText
import base64
from dotenv import load_dotenv
import os
import django


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "study_language.settings")
django.setup()
load_dotenv()

# 🔧 THAY THÔNG TIN NÀY BẰNG CỦA BẠN
CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")
REFRESH_TOKEN = os.getenv("REFRESH_TOKEN")
# Thông tin người gửi và người nhận
SENDER = "nguyenvanphuoc09112004@gmail.com"
TO = "email.for.ai.987654321@gmail.com"

def send_email_via_gmail():
    try:
        # Tạo credentials từ refresh_token
        creds = Credentials(
            None,
            refresh_token=REFRESH_TOKEN,
            token_uri="https://oauth2.googleapis.com/token",
            client_id=CLIENT_ID,
            client_secret=CLIENT_SECRET,
            scopes=["https://www.googleapis.com/auth/gmail.send"]
        )

        # Tạo service Gmail API
        service = build("gmail", "v1", credentials=creds)

        # Soạn email
        message = MIMEText("Hello! Đây là email test từ Gmail API 🚀")
        message["to"] = TO
        message["from"] = SENDER
        message["subject"] = "Test Gmail API"

        # Encode và gửi
        raw_message = base64.urlsafe_b64encode(message.as_bytes()).decode()
        body = {"raw": raw_message}
        sent_message = service.users().messages().send(userId="me", body=body).execute()

        print(f"✅ Gửi email thành công! Message ID: {sent_message['id']}")

    except Exception as e:
        print("❌ Lỗi khi gửi email:", e)

if __name__ == "__main__":
    send_email_via_gmail()
