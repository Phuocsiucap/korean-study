
import google.genai as genai
from django.conf import settings
import json
import re
import requests
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

api_key = settings.GEMINI_API_KEY
client = genai.Client(api_key=api_key)
# Create your views here.
schema = """
🧱 category_category: ['id', 'name', 'description', 'lesson', 'total_words', 'completed', 'progress', 'icon', 'color', 'user_id']
🧱 category_word: ['id', 'word', 'meaning', 'difficulty', 'learned', 'lastStudied', 'streak', 'lesson_id']
🧱 category_lesson: ['id', 'title', 'description', 'word_count', 'difficulty', 'completed', 'lastStudied', 'score', 'category_id', 'studyTime']
🧱 users_customuser: ['id', 'password', 'last_login', 'is_superuser', 'username', 'first_name', 'last_name', 'email', 'is_staff', 'is_active', 'date_joined', 'points', 'streak', 'wordsLearned', 'studyTime', 'phone', 'avatar']
"""
sample = """
   {
      id: 101,
      type: 'cloze',
      prompt: '저는 ____를 먹었어요.',
      answer: '사과',
      choices: ['사과', '배', '포도', '바나나'],
      hints: ['음식', '과일'],
      difficulty: 1,
      mode: 'mcq',
      translation: 'Tôi đã ăn ____.',
      exampleSentence: '사과는 빨갛고 맛있어요. (Táo màu đỏ và ngon.)'
    },
    {
      id: 102,
      type: 'cloze',
      prompt: '오늘 날씨가 정말 ____.',
      answer: '좋아요',
      choices: null,
      hints: ['형용사', '기분'],
      difficulty: 2,
      mode: 'input',
      translation: 'Hôm nay thời tiết thật ____.',
      exampleSentence: '날씨가 좋아요. 산책하러 갈까요? (Thời tiết tốt. Đi dạo nhé?)'
    },
    {
      id: 103,
      type: 'cloze',
      prompt: '제 이름은 ____입니다.',
      answer: '민수',
      choices: ['민수', '영희', '철수', '지연'],
      hints: ['이름', '남자'],
      difficulty: 1,
      mode: 'mcq',
      translation: 'Tên tôi là ____.',
      exampleSentence: '민수는 학생입니다. (Minsu là học sinh.)'
    }
"""

BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models"

# ✳️ Gọi Gemini qua REST API
def call_gemini_flash(prompt, model="gemini-2.0-flash"):
    url = f"{BASE_URL}/{model}:generateContent?key={api_key}"
    headers = {"Content-Type": "application/json"}
    payload = {
        "contents": [
            {"parts": [{"text": prompt}]}
        ]
    }
    response = requests.post(url, headers=headers, json=payload)
    data = response.json()
    try:
        return data["candidates"][0]["content"]["parts"][0]["text"]
    except Exception:
        print("⚠️ Lỗi phản hồi Gemini:", data)
        return None


@api_view(['POST'])
@permission_classes([AllowAny])
def generate_quiz(request):
    data = request.data
    words = data.get("words", [])
    question_count = data.get("numOfquestion", 5)

    if not words:
        return Response({"error": "Danh sách từ trống"}, status=status.HTTP_400_BAD_REQUEST)

    words_list = ", ".join(words)

    prompt = f"""
    Dưới đây là dữ liệu thực tế từ cơ sở dữ liệu:
    {words_list}

    Hãy tạo {question_count} câu hỏi cho bài kiểm tra, ở dạng JSON như mẫu dưới đây.
    Mỗi câu hỏi có các thuộc tính tương tự mẫu (id, type, prompt, answer, choices, v.v.).
    Đáp án phải nằm trong danh sách từ trên.
    Trả lời duy nhất bằng JSON hợp lệ, không giải thích thêm.

    Mẫu:
    {sample}
    """

    print("🤖 Gửi prompt tới Gemini REST API...")
    text = call_gemini_flash(prompt, model="gemini-2.5-pro")

    if not text:
        return Response({"error": "Không nhận được phản hồi từ Gemini"}, status=500)

    # 🧹 Làm sạch JSON nếu Gemini trả về có markdown
    text = re.sub(r"^```json|```$", "", text, flags=re.MULTILINE).strip()

    try:
        quiz_data = json.loads(text)
    except json.JSONDecodeError:
        print("⚠️ JSON không hợp lệ, in chuỗi để debug:")
        print(text)
        return Response({"error": "Phản hồi không phải JSON hợp lệ", "raw": text}, status=500)

    return Response({"quiz": quiz_data})