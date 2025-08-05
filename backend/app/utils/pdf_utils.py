import PyPDF2

def extract_text_from_pdf(file_path):
    with open(file_path, "rb") as f:
        reader = PyPDF2.PdfReader(f)
        text = ""
        for page in reader.pages:
            if page.extract_text():
                text += page.extract_text()
        return text.strip()	