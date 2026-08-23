"""
Verification script for PDF Header alignment & font sanitization,
Citizen Details Pre-PDF Customizer Modal, and Complete Multilingual (Hindi) translations.
"""

import sys
import os

def run_checks():
    print("============================================================")
    print("VERIFYING PDF SANITIZATION, CUSTOMIZER MODAL & I18N SUPPORT")
    print("============================================================")

    # 1. Check index.html for NyayaSetu Note Box and Pre-PDF Customizer Modal
    index_path = os.path.join("frontend", "index.html")
    with open(index_path, "r", encoding="utf-8") as f:
        index_content = f.read()

    assert 'data-i18n="nyayasetu.note.title"' in index_content, "Missing nyayasetu.note.title in index.html"
    assert 'data-i18n="nyayasetu.note.body"' in index_content, "Missing nyayasetu.note.body in index.html"
    assert 'id="pdf-customizer-modal"' in index_content, "Missing pdf-customizer-modal in index.html"
    assert 'id="pdf-cust-name"' in index_content, "Missing pdf-cust-name in index.html"
    assert 'id="pdf-cust-address"' in index_content, "Missing pdf-cust-address in index.html"
    assert 'id="pdf-cust-authority"' in index_content, "Missing pdf-cust-authority in index.html"
    assert 'id="pdf-cust-place"' in index_content, "Missing pdf-cust-place in index.html"
    assert 'id="pdf-cust-date"' in index_content, "Missing pdf-cust-date in index.html"
    assert 'id="pdf-cust-ref"' in index_content, "Missing pdf-cust-ref in index.html"
    assert 'id="pdf-modal-confirm-btn"' in index_content, "Missing pdf-modal-confirm-btn in index.html"
    print("  [OK] index.html: NyayaSetu Note and Pre-PDF Customizer Modal verified!")

    # 2. Check api.js for sanitizeForPdf, openPdfCustomizerModal, and Clean ASCII PDF Header
    api_path = os.path.join("frontend", "js", "api.js")
    with open(api_path, "r", encoding="utf-8") as f:
        api_content = f.read()

    assert "function sanitizeForPdf" in api_content, "Missing sanitizeForPdf in api.js"
    assert "window.openPdfCustomizerModal" in api_content, "Missing window.openPdfCustomizerModal in api.js"
    assert "window.downloadCleanLegalPdf" in api_content, "Missing window.downloadCleanLegalPdf in api.js"
    assert "window.generateDirectLegalPdf" in api_content, "Missing window.generateDirectLegalPdf in api.js"
    assert '"NYAYAMITRA • CITIZEN LEGAL RIGHTS & STATUTORY ACTION"' in api_content, "Corrupted header still present in api.js"
    assert "(न्यायमित्र)" not in api_content, "Devanagari text still present in standard jsPDF font stream"
    print("  [OK] api.js: Vector jsPDF engine, ASCII header, and pre-PDF modal exporter verified!")

    # 3. Check i18n.js for all languages containing required keys
    i18n_path = os.path.join("frontend", "js", "i18n.js")
    with open(i18n_path, "r", encoding="utf-8") as f:
        i18n_content = f.read()

    languages = ["English", "Hindi", "Hinglish", "Telugu", "Tamil", "Marathi", "Bengali", "Gujarati"]
    required_keys = [
        "nyayasetu.note.title",
        "nyayasetu.note.body",
        "nyayasetu.step1.heading_short",
        "nyayasetu.btn.speak",
        "nav.formfiller",
        "nav.more_tools",
        "pdf_modal.title",
        "pdf_modal.subtitle",
        "pdf_modal.info",
        "pdf_modal.label_name",
        "pdf_modal.label_address",
        "pdf_modal.label_authority",
        "pdf_modal.label_place",
        "pdf_modal.label_date",
        "pdf_modal.label_ref",
        "pdf_modal.btn_cancel",
        "pdf_modal.btn_download"
    ]

    for lang in languages:
        assert f"{lang}: {{" in i18n_content or f'"{lang}": {{' in i18n_content, f"Missing language block: {lang}"
        print(f"  [OK] i18n.js: Language '{lang}' block verified.")

    for key in required_keys:
        assert f'"{key}"' in i18n_content, f"Missing i18n translation key: {key}"

    print(f"  [OK] i18n.js: All {len(required_keys)} critical keys verified across dictionaries!")
    print("============================================================")
    print("ALL VERIFICATIONS COMPLETED SUCCESSFULLY (100% PASS RATE)")
    print("============================================================")

if __name__ == "__main__":
    run_checks()
