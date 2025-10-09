import random
import string
import base64
from email.mime.text import MIMEText
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

from django.core.cache import cache
from django.conf import settings
from django.contrib.auth import get_user_model, authenticate, login, logout
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .serializers import CustomUserSerializer


User = get_user_model()

# ===================== CẤU HÌNH GMAIL API =====================
CLIENT_ID = settings.CLIENT_ID
CLIENT_SECRET = settings.CLIENT_SECRET
REFRESH_TOKEN = settings.REFRESH_TOKEN


# ===================== HÀM GỬI EMAIL QUA GMAIL API =====================
def send_gmail_api(to_email: str, subject: str, html_content: str):
    """
    Gửi email qua Gmail API (OAuth2) — không cần SMTP.
    """
    try:
        creds = Credentials(
            None,
            refresh_token=REFRESH_TOKEN,
            token_uri="https://oauth2.googleapis.com/token",
            client_id=CLIENT_ID,
            client_secret=CLIENT_SECRET,
        )
        service = build("gmail", "v1", credentials=creds)

        # Tạo email MIME
        message = MIMEText(html_content, "html")
        message["to"] = to_email
        message["subject"] = subject

        # Mã hóa base64 để gửi
        raw_message = base64.urlsafe_b64encode(message.as_bytes()).decode()

        # Gửi email
        result = (
            service.users()
            .messages()
            .send(userId="me", body={"raw": raw_message})
            .execute()
        )

        print(f"✅ Email đã gửi tới {to_email}: {result.get('id')}")
        return True

    except Exception as e:
        print(f"❌ Lỗi khi gửi email qua Gmail API: {e}")
        return False


# ===================== TẠO MÃ OTP =====================
def generate_otp(length=6):
    """Tạo mã OTP ngẫu nhiên gồm 6 chữ số"""
    return ''.join(random.choices(string.digits, k=length))


# ===================== GỬI MÃ OTP =====================
@api_view(['POST'])
@permission_classes([AllowAny])
def send_otp(request):
    email = request.data.get("email")

    if not email:
        return Response({"error": "Email là bắt buộc"}, status=status.HTTP_400_BAD_REQUEST)

    # Kiểm tra email đã tồn tại chưa
    if User.objects.filter(email=email).exists():
        return Response({"error": "Email đã được đăng ký"}, status=status.HTTP_400_BAD_REQUEST)

    # Tạo mã OTP
    otp_code = generate_otp()
    cache_key = f"otp_{email}"
    cache.set(cache_key, otp_code, timeout=300)  # Hết hạn sau 5 phút

    # Gửi email
    html_body = f"""
        <h3>Xin chào!</h3>
        <p>Mã xác nhận của bạn là: <b>{otp_code}</b></p>
        <p>Mã này sẽ hết hạn sau <b>5 phút</b>.</p>
        <p>Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.</p>
        <p>Trân trọng,<br>Đội ngũ Study Language 🌱</p>
    """

    try:
        ok = send_gmail_api(
            to_email=email,
            subject="🔐 Mã xác nhận đăng ký - Study Language",
            html_content=html_body
        )
        if not ok:
            raise Exception("Không gửi được email")

        print(f"📧 OTP đã được gửi tới {email}: {otp_code}")
        return Response({
            "message": "Mã xác nhận đã được gửi đến email của bạn",
            "email": email
        })

    except Exception as e:
        print(f"❌ Lỗi khi gửi OTP: {e}")
        return Response({"error": "Không thể gửi email"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ===================== ĐĂNG KÝ NGƯỜI DÙNG =====================
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    username = request.data.get("username")
    password = request.data.get("password")
    email = request.data.get("email")
    verification_code = request.data.get("verification_code")

    if not email or not username or not password or not verification_code:
        return Response({"error": "Tất cả các trường là bắt buộc"}, status=status.HTTP_400_BAD_REQUEST)

    # Kiểm tra OTP
    cache_key = f"otp_{email}"
    stored_otp = cache.get(cache_key)

    if not stored_otp:
        return Response({"error": "Mã xác nhận đã hết hạn. Vui lòng gửi lại mã"}, status=status.HTTP_400_BAD_REQUEST)

    if stored_otp != verification_code:
        return Response({"error": "Mã xác nhận không chính xác"}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({"error": "Tên đăng nhập đã tồn tại"}, status=status.HTTP_400_BAD_REQUEST)

    # Tạo user mới
    user = User.objects.create_user(username=username, password=password, email=email)
    cache.delete(cache_key)

    # Gửi email chào mừng
    try:
        html_body = f"""
            <h3>Xin chào {username}!</h3>
            <p>Cảm ơn bạn đã đăng ký tài khoản tại <b>Study Language</b>.</p>
            <p>Hãy bắt đầu hành trình học tập của bạn ngay hôm nay nhé!</p>
            <p>Trân trọng,<br>Đội ngũ Study Language 🌱</p>
        """
        send_gmail_api(
            to_email=email,
            subject="🎉 Chào mừng bạn đến với Study Language!",
            html_content=html_body
        )
        print(f"📧 Email chào mừng đã được gửi tới: {email}")

    except Exception as e:
        print(f"❌ Lỗi khi gửi email chào mừng: {e}")

    return Response({"message": "Đăng ký thành công"})


# ===================== ĐĂNG NHẬP =====================
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get("username")
    password = request.data.get("password")

    user = authenticate(username=username, password=password)
    if user is not None:
        login(request, user)
        serializer = CustomUserSerializer(user)
        return Response({
            "message": "Đăng nhập thành công",
            "user": serializer.data
        })

    return Response({"error": "Tên đăng nhập hoặc mật khẩu không đúng"}, status=status.HTTP_400_BAD_REQUEST)


# ===================== ĐĂNG XUẤT =====================
@api_view(['POST'])
def logout_view(request):
    logout(request)
    return Response({"message": "Đăng xuất thành công"})


# ===================== LẤY THÔNG TIN NGƯỜI DÙNG =====================
@api_view(['GET'])
def me(request):
    if not request.user.is_authenticated:
        return Response({"error": "Chưa đăng nhập"}, status=status.HTTP_401_UNAUTHORIZED)

    serializer = CustomUserSerializer(request.user)
    return Response(serializer.data)
