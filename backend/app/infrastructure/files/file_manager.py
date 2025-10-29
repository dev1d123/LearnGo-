from typing import List
import io
import anyio

import pdfplumber
import docx 

def extract_pdf_content(file_bytes: bytes, filename: str) -> List[str]:
    pages = []
    try:
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            metadata = pdf.metadata or {}
            meta_text = [f"Filename: {filename}"]
            for key in ("Title", "Author", "Subject", "Creator", "Producer"):
                if metadata.get(key):
                    meta_text.append(f"{key}: {metadata[key]}")
            pages.append("\n".join(meta_text))

            for i, page in enumerate(pdf.pages, start=1):
                page_text = page.extract_text() or ""
                pages.append(page_text.strip())
    except Exception as e:
        pages.append(f"Error processing PDF file {filename}: {str(e)}")
    return pages

def extract_docx_content(file_bytes: bytes, filename: str) -> List[str]:
    """Extrae el texto de un archivo .docx."""
    try:
        doc_stream = io.BytesIO(file_bytes)
        document = docx.Document(doc_stream)
        full_text = "\n".join([para.text for para in document.paragraphs])
        return [full_text]
    except Exception as e:
        return [f"Error processing Word file {filename}: {str(e)}"]

async def extract_file_contents(files) -> List[List[str]]:
    if not files or len(files) == 0:
        return []
    content = []

    for file in files:
        file_bytes = await file.read()
        filename = file.filename.lower()

        if filename.endswith(".pdf"):
            extracted = await anyio.to_thread.run_sync(extract_pdf_content, file_bytes, file.filename)
        elif filename.endswith(".docx"): 
            extracted = await anyio.to_thread.run_sync(extract_docx_content, file_bytes, file.filename)
        else:
            extracted = [f"{file.filename}\n------------\n\nUnsupported file type."]

        content.append(extracted)

    return content