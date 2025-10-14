
import google.genai as genai
from django.conf import settings
import json
import re

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

def call_gemini_flash(promt):
    response  = client.models.generate_content(
        model="models/gemini-2.5-flash",
        contents=promt,
        # temperature=0.2,
        # max_output_tokens=1024,
        # top_p=0.8,
        # top_k=40,
        # stop_sequences=["###"]
    )
    return response.text

@api_view(['POST'])
@permission_classes([AllowAny])
def generate_quiz(request):
    data = request.data
    words = data.get("words", [])
    question_count = data.get("numOfquestion", 5)
    if not words:
        return Response({"error": "Danh sách từ trống"}, status=status.HTTP_400_BAD_REQUEST)
    
    words_list = ', '.join(words)
    # Tạo prompt cho Gemini
    prompt = f"""
    Dưới đây là dữ liệu thực tế từ cơ sở dữ liệu
    {words_list}
    Tạo {question_count} câu hỏi trong cho đề kiểm tra dưới dạng json như mẫu sau cho các từ tìm được .
    {sample}
    Trả lời dưới dạng json, không giải thích gì thêm.
    """
    print("🤖 Gửi prompt tới Gemini...")
    response = client.models.generate_content(
        model="models/gemini-2.5-pro",
        contents=prompt
    )
    text = response.text.strip()

    # 🧹 Loại bỏ code block markdown nếu có
    text = re.sub(r"^```json|```$", "", text, flags=re.MULTILINE).strip()

    try:
        quiz_data = json.loads(text)
    except json.JSONDecodeError:
        print("⚠️ JSON không hợp lệ, in chuỗi để debug:")
        print(text)
        return Response({"error": "Phản hồi không phải JSON hợp lệ", "raw": text}, status=500)

    return Response({"quiz": quiz_data})