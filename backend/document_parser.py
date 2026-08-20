"""
Document parsing utility for NyayMitra
Extracts text from uploaded PDF, TXT, and Markdown files safely.
"""

import io
from typing import Tuple
from pypdf import PdfReader

def extract_text_from_bytes(file_bytes: bytes, filename: str) -> Tuple[str, str]:
    """
    Extracts text and detected format from file bytes.
    Returns (extracted_text, format_type).
    """
    filename_lower = filename.lower()
    
    if filename_lower.endswith(".pdf"):
        try:
            reader = PdfReader(io.BytesIO(file_bytes))
            pages_text = []
            for i, page in enumerate(reader.pages):
                text = page.extract_text()
                if text and text.strip():
                    pages_text.append(f"--- [Page {i+1}] ---\n{text.strip()}")
            
            full_text = "\n\n".join(pages_text)
            if not full_text.strip():
                return "The uploaded PDF appears to contain scanned images without readable digital text layers. Please paste the text manually or use clear digital documents.", "pdf_empty"
            return full_text, "pdf"
        except Exception as e:
            return f"Error extracting text from PDF: {str(e)}", "error"

    elif filename_lower.endswith((".txt", ".md", ".csv", ".json")):
        try:
            # Try utf-8 first, fallback to latin-1
            try:
                text = file_bytes.decode("utf-8")
            except UnicodeDecodeError:
                text = file_bytes.decode("latin-1", errors="replace")
            return text, "text"
        except Exception as e:
            return f"Error reading text file: {str(e)}", "error"
            
    else:
        # Fallback attempt to decode as UTF-8
        try:
            return file_bytes.decode("utf-8", errors="ignore"), "generic"
        except Exception as e:
            return f"Unsupported file type: {filename}", "unsupported"
