import sqlite3

# Kết nối đến file DB
conn = sqlite3.connect("db.sqlite3")
cursor = conn.cursor()

# Lấy danh sách các bảng
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = [row[0] for row in cursor.fetchall()]

print("Danh sách bảng:", tables)

# Lấy cột của từng bảng
for table in tables:
    cursor.execute(f"PRAGMA table_info({table});")
    columns = [col[1] for col in cursor.fetchall()]
    print(f"🧱 {table}: {columns}")
