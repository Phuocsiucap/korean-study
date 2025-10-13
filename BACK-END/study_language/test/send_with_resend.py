import requests

API_KEY = "" # lấy ở https://resend.com/api-keys

def send_email(to_email, subject, html_content):
    url = "https://api.resend.com/emails"
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "from": "noreply@phuocsiucap.id.vn",  # miễn phí dùng domain của Resend
        "to": [to_email],
        "subject": subject,
        "html": html_content
    }
    res = requests.post(url, headers=headers, json=payload)
    print(res.status_code, res.text)

send_email(
    "email.for.ai.987654321@gmail.com",
    "Test Email qua Resend API",
    "<p>Xin chào! Đây là email gửi qua <b>Resend API</b>.</p>"
)
