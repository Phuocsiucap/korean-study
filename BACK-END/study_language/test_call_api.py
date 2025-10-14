import sqlite3
import google.genai as genai
import json
import re
from django.conf import settings
# 🧠 Khởi tạo Gemini client
# apikey = settings.GEMINI_API_KEY
apikey = "AIzaSyAoOjk40YjicsFxTam5aom20u-jH9eaQ8w"
client = genai.Client(api_key=apikey)

# 🧱 Cấu trúc CSDL cố định
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
    }"""

# 🔁 Vòng lặp hội thoại
history = []  # mỗi phần tử: {"question": ..., "answer": ...}

while True:
    user_query = input("\n💬 Nhập yêu cầu (hoặc 'exit' để thoát): ").strip()
    if user_query.lower() in ["exit", "quit"]:
        print("👋 Kết thúc chương trình.")
        break   

    # 1️⃣ Tạo lịch sử hội thoại dạng text
    history_text = ""
    for i, h in enumerate(history[-5:]):  # chỉ giữ 5 câu gần nhất để tránh prompt quá dài
        history_text += f"Câu hỏi {i+1}: {h['question']}\nTrả lời {i+1}: {h['answer']}\n"

    # 2️⃣ Bước 1: yêu cầu Gemini sinh SQL
    sql_prompt = f"""
Bạn là chuyên gia SQL. Dựa vào cấu trúc cơ sở dữ liệu SQLite sau:
{schema}

Dưới đây là lịch sử hội thoại gần đây:
{history_text}

Viết câu lệnh SQL chính xác để trả lời câu hỏi sau.
Kết quả trả về **chỉ ở dạng JSON** như ví dụ:
{{
  "sql": "SELECT ... FROM ..."
}}

Câu hỏi hiện tại của người dùng: "{user_query}"
"""

    try:
        sql_response = client.models.generate_content(
            model="models/gemini-2.5-flash",
            contents=sql_prompt
        )

        print("\n🤖 Gemini tạo SQL:")
        print(sql_response.text)

        # 👉 Parse JSON từ Gemini (kể cả khi nó nằm trong ```json ... ```)
        raw_text = sql_response.text.strip()
        clean_text = re.sub(r"```(?:json)?", "", raw_text).strip("` \n")

        try:
            sql_json = json.loads(clean_text)
            sql_query = sql_json.get("sql")
        except Exception as e:
            print("⚠️ Lỗi khi đọc JSON từ Gemini:", e)
            print("Nội dung Gemini trả về:\n", raw_text)
            continue

        # 3️⃣ Thực thi SQL trên SQLite
        conn = sqlite3.connect("db.sqlite3")
        cursor = conn.cursor()

        try:
            cursor.execute(sql_query)
            results = cursor.fetchall()
            columns = [desc[0] for desc in cursor.description] if cursor.description else []
        except Exception as e:
            print("⚠️ Lỗi khi thực thi SQL:", e)
            conn.close()
            continue

        conn.close()

        print("\n📊 Dữ liệu thật từ DB:")
        print("Cột:", columns)
        print("Kết quả:", results[:10])

        # 4️⃣ Gửi dữ liệu lại cho Gemini để trả lời bằng tiếng Việt tự nhiên
        final_prompt = f"""
Dưới đây là dữ liệu thực tế từ cơ sở dữ liệu và câu hỏi của người dùng.

Lịch sử hội thoại gần đây:
{history_text}

❓ Câu hỏi hiện tại: "{user_query}"
💾 SQL đã thực thi: {sql_query}
📊 Kết quả: {results[:10]}

thực hiện tạo các câu hỏi trong cho đề kiểm tra dưới dạng json như mẫu sau cho các từ tìm được .
{sample}
"""

        final_response = client.models.generate_content(
            model="models/gemini-2.5-pro",
            contents=final_prompt
        )

        answer_text = final_response.text
        print("\n🧠 Trả lời từ Gemini (dựa vào dữ liệu thật):")
        print(answer_text)

        # 5️⃣ Lưu lịch sử
        history.append({"question": user_query, "answer": answer_text})

    except Exception as e:
        print("⚠️ Lỗi khi gọi Gemini:", e)