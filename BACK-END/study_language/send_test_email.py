import os
import django
from django.core.mail import send_mail
from dotenv import load_dotenv

# Load môi trường Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "study_language.settings")
django.setup()
load_dotenv()

# Gửi thử email
subject = "🧩 Test Email from Django"
message = "Xin chào! Đây là email test gửi bằng Outlook SMTP."
from_email = os.getenv("EMAIL_HOST_USER")
to_email = ["nguyenvanphuoc09112004@gmail.com"]  # 👉 thay bằng email thật của bạn

try:
    send_mail(subject, message, from_email, to_email, fail_silently=False)
    print("✅ Gửi email thành công!")
except Exception as e:
    print("❌ Lỗi khi gửi email:", e)
