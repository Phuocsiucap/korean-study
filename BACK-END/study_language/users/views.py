import requests
from django.conf import settings
from django.contrib.auth import get_user_model, authenticate, login, logout
from django.core.cache import cache
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
import random
import string
from .serializers import CustomUserSerializer

User = get_user_model()

# ===================== RESEND CONFIG =====================
RESEND_API_KEY = settings.RESEND_API_KEY
RESEND_URL = settings.RESEND_URL


def send_email_resend(to_email, subject, html_content):
    """Gửi email qua Resend API"""
    headers = {
        "Authorization": f"Bearer {RESEND_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "from": "noreply@phuocsiucap.id.vn",   # domain đã verify trong Resend
        "to": [to_email],
        "subject": subject,
        "html": html_content
    }
    res = requests.post(RESEND_URL, headers=headers, json=payload)
    print(f"📤 Gửi email tới {to_email}: {res.status_code} {res.text}")
    return res.status_code == 200 or res.status_code == 202


# ===================== GENERATE OTP =====================
def generate_otp(length=6):
    return ''.join(random.choices(string.digits, k=length))


# ===================== SEND OTP =====================
@api_view(['POST'])
@permission_classes([AllowAny])
def send_otp(request):
    email = request.data.get("email")

    if not email:
        return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(email=email).exists():
        return Response({"error": "Email đã được đăng ký"}, status=status.HTTP_400_BAD_REQUEST)

    otp_code = generate_otp()
    cache_key = f"otp_{email}"
    cache.set(cache_key, otp_code, timeout=300)

    # Gửi OTP bằng Resend
    html_body = f"""
        <h3>🔐 Mã xác nhận đăng ký Study Language</h3>
        <p>Mã xác nhận của bạn là: <b>{otp_code}</b></p>
        <p>Mã sẽ hết hạn sau 5 phút.</p>
        <p>Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.</p>
        <p>Trân trọng,<br>Đội ngũ Study Language 🌱</p>
    """

    if send_email_resend(email, "🔐 Mã xác nhận đăng ký - Study Language", html_body):
        print(f"📧 OTP đã được gửi tới {email}: {otp_code}")
        return Response({"message": "Mã xác nhận đã được gửi đến email của bạn"})
    else:
        return Response({"error": "Không thể gửi email"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ===================== REGISTER =====================
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    username = request.data.get("username")
    password = request.data.get("password")
    email = request.data.get("email")
    verification_code = request.data.get("verification_code")

    if not email or not username or not password or not verification_code:
        return Response({"error": "Tất cả các trường là bắt buộc"}, status=status.HTTP_400_BAD_REQUEST)

    cache_key = f"otp_{email}"
    stored_otp = cache.get(cache_key)

    if not stored_otp:
        return Response({"error": "Mã xác nhận đã hết hạn. Vui lòng gửi lại mã"}, status=status.HTTP_400_BAD_REQUEST)

    if stored_otp != verification_code:
        return Response({"error": "Mã xác nhận không chính xác"}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({"error": "Tên đăng nhập đã tồn tại"}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, password=password, email=email)
    cache.delete(cache_key)

    # Gửi email chào mừng
    html_body = f"""
        <h2>Chào mừng {username}!</h2>
        <p>Tài khoản của bạn đã được tạo thành công.</p>
        <p>Chúc bạn học tập hiệu quả cùng <b>Study Language 🌱</b></p>
    """
    send_email_resend(email, "🎉 Chào mừng đến với Study Language!", html_body)

    print(f"📧 Email chào mừng đã gửi tới: {email}")
    return Response({"message": "Đăng ký thành công"})


# ===================== LOGIN =====================
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


# ===================== LOGOUT =====================
@api_view(['POST'])
def logout_view(request):
    logout(request)
    return Response({"message": "Đăng xuất thành công"})


# ===================== PROFILE =====================
@api_view(['GET'])
def me(request):
    if not request.user.is_authenticated:
        return Response({"error": "Chưa đăng nhập"}, status=status.HTTP_401_UNAUTHORIZED)
    serializer = CustomUserSerializer(request.user)
    return Response(serializer.data)


# ===================== SIMPLE REGISTER =====================
@api_view(['POST'])
@permission_classes([AllowAny])
def simple_register(request):
    username = request.data.get("username")
    password = request.data.get("password")
    email = request.data.get("email")

    if not email or not username or not password:
        return Response({"error": "Tất cả các trường là bắt buộc"}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({"error": "Tên đăng nhập đã tồn tại"}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(email=email).exists():
        return Response({"error": "Email đã được đăng ký"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.create_user(username=username, password=password, email=email)
        login(request, user)
        serializer = CustomUserSerializer(user)
        return Response({
            "message": "Đăng ký thành công",
            "user": serializer.data
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        print(f"❌ Lỗi khi tạo user: {e}")
        return Response({"error": "Không thể tạo tài khoản. Vui lòng thử lại"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
