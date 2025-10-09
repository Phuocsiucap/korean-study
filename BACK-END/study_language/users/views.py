from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth import get_user_model
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .serializers import CustomUserSerializer
from django.contrib.auth import authenticate, login, logout
from django.core.cache import cache
import random
import string

User = get_user_model()
CLIENT_ID = settings.CLIENT_ID
CLIENT_SECRET = settings.CLIENT_SECRET
REFRESH_TOKEN = settings.REFRESH_TOKEN
# ===================== GENERATE OTP =====================
def generate_otp(length=6):
    """Tạo mã OTP ngẫu nhiên gồm 6 chữ số"""
    return ''.join(random.choices(string.digits, k=length))


# ===================== SEND OTP =====================
@api_view(['POST'])
@permission_classes([AllowAny])
def send_otp(request):
    email = request.data.get("email")
    
    if not email:
        return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    # Kiểm tra email đã tồn tại chưa
    if User.objects.filter(email=email).exists():
        return Response({"error": "Email đã được đăng ký"}, status=status.HTTP_400_BAD_REQUEST)
    
    # Tạo mã OTP
    otp_code = generate_otp()
    
    # Lưu OTP vào cache với thời gian hết hạn 5 phút (300 giây)
    cache_key = f"otp_{email}"
    cache.set(cache_key, otp_code, timeout=300)
    
    # Gửi email
    try:
        send_mail(
            subject="🔐 Mã xác nhận đăng ký - Study Language",
            message=f"""
                Xin chào,

                Mã xác nhận của bạn là: {otp_code}

                Mã này sẽ hết hạn sau 5 phút.

                Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.

                Trân trọng,
                Đội ngũ Study Language 🌱
            """,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=False,
        )
        print(f"📧 OTP đã được gửi tới {email}: {otp_code}")
        return Response({
            "message": "Mã xác nhận đã được gửi đến email của bạn",
            "email": email
        })
    except Exception as e:
        print(f"❌ Lỗi khi gửi email: {e}")
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

    # Kiểm tra OTP
    cache_key = f"otp_{email}"
    stored_otp = cache.get(cache_key)
    
    if not stored_otp:
        return Response({"error": "Mã xác nhận đã hết hạn. Vui lòng gửi lại mã"}, status=status.HTTP_400_BAD_REQUEST)
    
    if stored_otp != verification_code:
        return Response({"error": "Mã xác nhận không chính xác"}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({"error": "Tên đăng nhập đã tồn tại"}, status=status.HTTP_400_BAD_REQUEST)


    # Tạo user
    user = User.objects.create_user(username=username, password=password, email=email)
    
    # Xóa OTP sau khi đăng ký thành công
    cache.delete(cache_key)

    # Gửi email chào mừng
    try:
        html_body = f"""
            <h3>Xin chào!</h3>
            <p>Mã xác nhận của bạn là: <b>{otp_code}</b></p>
            <p>Mã sẽ hết hạn sau 5 phút.</p>
            <p>Trân trọng,<br>Đội ngũ Study Language 🌱</p>
        """
        send_gmail_api(
            to_email=email,
            subject="🔐 Mã xác nhận đăng ký - Study Language",
            html_content=html_body
        )

        print(f"📧 Email chào mừng đã được gửi tới: {email}")
    except Exception as e:
        print(f"❌ Lỗi khi gửi email: {e}")

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