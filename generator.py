from pathlib import Path
from random import sample
from docx import Document

folder = Path(__file__).resolve().parent
text = (folder / "voprosy.txt").read_text(encoding="utf-8-sig")
questions = list(dict.fromkeys(line.strip() for line in text.splitlines() if line.strip()))

if len(questions) < 3:
    raise SystemExit("Добавьте хотя бы три разных вопроса в voprosy.txt.")

document = Document()
document.add_heading("Экзаменационные билеты", 0)

for number in range(1, 25):
    if number > 1:
        document.add_page_break()
    document.add_heading(f"Билет №{number}", level=1)
    for index, question in enumerate(sample(questions, 3), start=1):
        document.add_paragraph(f"{index}. {question}")

document.save(folder / "bilety.docx")
print("Готово! Создан файл bilety.docx с 24 билетами.")
