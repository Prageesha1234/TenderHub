# TenderHub - Enterprise Tender & Bid Management Platform

A modern, responsive, client-side web application built with **HTML5, Tailwind CSS, and JavaScript** to manage tenders, RFPs, procurement documents, proposed solutions, competitor bid opening readings, and Excel/Google Sheets exports.

---

## 🌟 Key Features

### 1. Tender Details Entry & Form Management
Manage your organization's tender pipeline with a dedicated entry and edit form containing all key procurement fields:
* **Procurement Title**: Official title of the tender / RFP.
* **Procurement ID**: Reference number (e.g. `ICTA/GOSL/2026/RFP/088`).
* **Procurement Entity**: Client ministry, department, or enterprise authority.
* **Publish Date & Submission Date**: With real-time deadline countdown badge (e.g. `5 days left`, `urgent today`).
* **JV or Not**: Joint Venture toggle (Solo Bidder vs. JV Consortium with partner details and equity share percentage).
* **Solution**: Detailed scope and technical solution proposed.
* **Account Manager**: Assigned bid manager / AM in charge.
* **Remark or Update**: Ongoing status updates, meeting minutes, and next steps.
* **Status & Financials**: Pipeline status (Draft, In Progress, Submitted, Awarded, Lost) and quoted bid amounts.

### 2. Document Upload & Smart Document Analysis
* **Multi-Format Upload**: Drag & drop or select files (PDF, DOCX, XLSX, TXT, CSV, images).
* **Local IndexedDB Storage**: Files are stored securely inside the browser without file size limit restrictions.
* **Intelligent Document Analysis Engine**:
  * Extracts **Key Submission Deadlines** and Pre-Bid meeting dates.
  * Identifies **Bid Security / Bank Guarantee (EMD)** requirements and amounts.
  * Highlights **Minimum Eligibility Criteria** (Annual turnover, past experience, ISO certifications, OEM authorization).
  * Flags **Liquidated Damages & Delay Penalties**.
  * Auto-generates a **Mandatory Submission Checklist** that can be synced with one click.
  * Assesses overall **Tender Risk Level** (Low, Moderate, High).

### 3. Our Solution & Participated Company Readings
* **Our Solution Specification**: Dedicated section detailing Architecture, OEM Partners, Delivery Timeline & SLA, and Key Win Themes / Differentiators.
* **Participated Company Readings**:
  * Record all competitor prices read out during bid openings.
  * Automatic variance calculation (`% difference` compared to our bid price).
  * Technical score ratings and ranking (L1 Lowest Evaluated Bidder, L2, L3, Disqualified, Non-Compliant).
  * **Interactive Chart.js Visualizer**: Side-by-side bar chart showing our bid against all participating bidders.

### 4. Excel & Google Sheets Integration
* **Download as Excel (`.xlsx`)**:
  * Single-click multi-sheet workbook generation powered by **SheetJS**:
    * **Sheet 1**: All Tenders Summary.
    * **Sheet 2**: Participated Company & Competitor Readings.
    * **Sheet 3**: Attached Documents Registry.
  * Also supports single-tender comprehensive dossier exports.
* **Google Sheets 1-Click Clipboard Export**:
  * Formats all table rows into clean Tab-Separated Values (TSV).
  * Just click **"Copy for Google Sheets"**, open [Google Sheets (sheets.new)](https://sheets.new), and press `Ctrl+V` to immediately populate columns with formatting!

---

## 🚀 How to Run

Because the application is built entirely with modern HTML and vanilla JavaScript:

### Method 1: Direct File Open
Simply double-click [`index.html`](file:///c:/Users/Lenovo/OneDrive/Documents/new/index.html) in your Windows File Explorer to open it in Chrome, Edge, or Firefox.

### Method 2: Local HTTP Server (Optional)
Run using Python from this folder:
```powershell
python -m http.server 8000
```
Then open: [http://localhost:8000](http://localhost:8000)

---

## 📂 Project Structure

```
c:\Users\Lenovo\OneDrive\Documents\new\
│
├── index.html                   # Main application web page
├── README.md                    # Documentation & user guide
│
├── css/
│   └── styles.css               # Custom styles, animations, badges
│
├── js/
│   ├── app.js                   # Main application controller & UI handlers
│   ├── storage.js               # LocalStorage & IndexedDB document storage
│   ├── analyzer.js              # PDF text parser & tender document analyzer
│   ├── excel-export.js          # SheetJS Excel exporter & Google Sheets copy
│   └── sample-data.js           # Pre-loaded sample tenders for immediate test
│
└── sample-docs/
    └── Sample_RFP_Tender_Document.txt  # Sample tender RFP for testing document analysis
```

---

## 🧪 Testing Document Analysis

1. Click on the sample tender **"Turnkey Implementation of National Cloud Infrastructure"** to open its dossier.
2. Go to the **"Documents & AI Analysis"** tab.
3. Drag and drop [`sample-docs/Sample_RFP_Tender_Document.txt`](file:///c:/Users/Lenovo/OneDrive/Documents/new/sample-docs/Sample_RFP_Tender_Document.txt) or any PDF tender document.
4. The system will parse the text and extract the submission deadlines, USD 45,000 bank guarantee requirement, ISO 27001 / MAF requirements, and 0.5% delay penalties automatically!
