import sqlite3
import google.genai as genai
import json
import re
from django.conf import settings
# 🧠 Khởi tạo Gemini client
apikey = settings.GEMINI_API_KEY
client = genai.Client(api_key=apikey)

# 🧱 Cấu trúc CSDL cố định
schema = """
🧱 category_categorAIzaSyAoOjk40YjicsFxTam5aom20u-jH9eaQ8wy: ['id', 'name', 'description', 'lesson', 'total_words', 'completed', 'progress', 'icon', 'color', 'user_id']
🧱 category_word: ['id', 'word', 'meaning', 'difficulty', 'learned', 'lastStudied', 'streak', 'lesson_id']
🧱 category_lesson: ['id', 'title', 'description', 'word_count', 'difficulty', 'completed', 'lastStudied', 'score', 'category_id', 'studyTime']
🧱 users_customuser: ['id', 'password', 'last_login', 'is_superuser', 'username', 'first_name', 'last_name', 'email', 'is_staff', 'is_active', 'date_joined', 'points', 'streak', 'wordsLearned', 'studyTime', 'phone', 'avatar']
"""

# 🔁 Vòng lặp hội thoại
while True:
    user_query = input("\n💬 Nhập yêu cầu (hoặc 'exit' để thoát): ").strip()
    if user_query.lower() in ["exit", "quit"]:
        print("👋 Kết thúc chương trình.")
        break

    # 1️⃣ Bước 1: yêu cầu Gemini sinh SQL
    sql_prompt = f"""
    Bạn là chuyên gia SQL. Dựa vào cấu trúc cơ sở dữ liệu SQLite sau:
    {schema}

    Viết câu lệnh SQL chính xác để trả lời câu hỏi sau.
    Kết quả trả về **chỉ ở dạng JSON** như ví dụ:
    {{
      "sql": "SELECT ... FROM ..."
    }}

    Câu hỏi của người dùng: "{user_query}"
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

        # Xóa markdown code block nếu có
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

        ❓ Câu hỏi: "{user_query}"
        💾 SQL đã thực thi: {sql_query}
        📊 Kết quả: {results[:10]}

        Hãy trả lời rõ ràng, chính xác bằng tiếng Việt dựa trên dữ liệu này.
        """

        final_response = client.models.generate_content(
            model="models/gemini-2.5-flash",
            contents=final_prompt
        )

        print("\n🧠 Trả lời từ Gemini (dựa vào dữ liệu thật):")
        print(final_response.text)

    except Exception as e:
        print("⚠️ Lỗi khi gọi Gemini:", e)
