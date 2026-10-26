/**
 * analyzer.js
 * Document processing and intelligent tender document analysis engine.
 * Supports PDF text extraction (via PDF.js) and standard text/csv files.
 */

class DocumentAnalyzer {
    constructor() {
        this.pdfjsLib = window['pdfjs-dist/build/pdf'] || null;
    }

    /**
     * Extracts text content from a File object.
     * @param {File} file 
     * @returns {Promise<string>}
     */
    async extractText(file) {
        const fileType = file.type;
        const fileName = file.name.toLowerCase();

        if (fileName.endsWith('.pdf') || fileType === 'application/pdf') {
            return await this.extractPdfText(file);
        } else if (fileName.endsWith('.txt') || fileName.endsWith('.md') || fileName.endsWith('.csv') || fileName.endsWith('.json') || fileName.endsWith('.xml') || fileName.endsWith('.html')) {
            return await this.extractPlainText(file);
        } else {
            // For other binary files, return a notice or attempt partial text decoding
            try {
                return await this.extractPlainText(file);
            } catch (e) {
                return `[Binary file: ${file.name} (${file.type || 'unknown type'}). Plain text extraction is not directly supported; standard metadata recorded.]`;
            }
        }
    }

    extractPlainText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result || '');
            reader.onerror = (e) => reject(new Error('Failed to read file text'));
            reader.readAsText(file);
        });
    }

    async extractPdfText(file) {
        try {
            const arrayBuffer = await file.arrayBuffer();
            if (!window.pdfjsLib) {
                console.warn('PDF.js not loaded. Falling back to basic inspection.');
                return 'PDF text extraction requires PDF.js library.';
            }

            // Set worker source if available
            if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
                pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
            }

            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;
            let fullText = '';

            const maxPages = Math.min(pdf.numPages, 40); // Analyze first 40 pages
            for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
                const page = await pdf.getPage(pageNum);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map(item => item.str).join(' ');
                fullText += `\n--- Page ${pageNum} ---\n` + pageText;
            }

            return fullText;
        } catch (error) {
            console.error('Error extracting PDF text:', error);
            throw new Error(`PDF extraction failed: ${error.message}`);
        }
    }

    /**
     * Analyzes raw tender document text to identify critical RFP data.
     * @param {string} text 
     * @param {string} fileName 
     * @returns {Object} Structured analysis results
     */
    analyzeTenderDocument(text, fileName = '') {
        const lower = text.toLowerCase();
        
        // 1. Deadlines & Key Dates Detection
        const extractedDeadlines = [];
        const deadlinePatterns = [
            /(?:submission deadline|bid submission|closing date|submission date|bids must be delivered on or before)[:\s]+([^\n\r.,;]+(?:\d{4}|\d{1,2}:\d{2}))/gi,
            /(?:pre-bid meeting|pre-bid conference|clarification meeting)[:\s]+([^\n\r.,;]+(?:\d{4}|\d{1,2}:\d{2}))/gi,
            /(?:bid opening|opening of bids)[:\s]+([^\n\r.,;]+(?:\d{4}|\d{1,2}:\d{2}))/gi,
            /(?:bid validity|validity period)[:\s]+([^\n\r.,;]+(?:days|calendar days|months))/gi
        ];

        deadlinePatterns.forEach(pattern => {
            let match;
            while ((match = pattern.exec(text)) !== null) {
                const cleaned = match[0].trim();
                if (cleaned && !extractedDeadlines.includes(cleaned)) {
                    extractedDeadlines.push(cleaned);
                }
            }
        });

        // If no explicit matches, check simple date patterns
        if (extractedDeadlines.length === 0) {
            const generalDateMatches = text.match(/\b(?:\d{1,2}(?:st|nd|rd|th)?[\s\/-]+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\s\/-]+\d{2,4})\b/gi);
            if (generalDateMatches) {
                extractedDeadlines.push(...generalDateMatches.slice(0, 4).map(d => `Identified Date: ${d}`));
            }
        }

        // 2. Bid Security / Bank Guarantee Detection
        let bidSecurity = 'Not explicitly detected or may not be required';
        const securityPatterns = [
            /(?:bid security|bid bond|bank guarantee|earnest money deposit|emd)[\s\w,:]+(?:amount of|sum of|value of)?[\s:]*([$€£LKRINR\d,.\s]+(?:usd|lkr|inr|eur|million|thousand)?)/i,
            /(?:bid security|bid bond|bank guarantee)[\s\S]{1,120}?(?:USD|LKR|INR|EUR|Rs\.?|\$)\s*([\d,]+)/i
        ];
        for (const regex of securityPatterns) {
            const match = text.match(regex);
            if (match) {
                bidSecurity = match[0].trim().replace(/\s+/g, ' ');
                break;
            }
        }

        // 3. Eligibility & Qualification Criteria
        const eligibilityCriteria = [];
        if (/turnover/i.test(text)) {
            const match = text.match(/(?:turnover|annual turnover|maat)[\s\w,:]+([$€£LKRINR\d,.\s]+(?:usd|lkr|million)?[\s\S]{1,60}?(?:years|financial years)?)/i);
            eligibilityCriteria.push(match ? match[0].trim().replace(/\s+/g, ' ') : 'Annual financial turnover requirement mentioned in document');
        }
        if (/experience|completed projects|similar scale/i.test(text)) {
            const match = text.match(/(?:experience|completed|track record)[\s\w,:]+(?:at least|minimum)?[\s\S]{1,80}?(?:years|projects|contracts)/i);
            eligibilityCriteria.push(match ? match[0].trim().replace(/\s+/g, ' ') : 'Minimum relevant past project completion experience required');
        }
        if (/iso\s*\d+/i.test(text)) {
            const isoMatches = text.match(/iso\s*\d+[-:\w]*/gi);
            if (isoMatches) {
                eligibilityCriteria.push(`Mandatory Certifications: ${[...new Set(isoMatches)].join(', ')}`);
            }
        }
        if (/manufacturer authorization|maf|authorization letter/i.test(text)) {
            eligibilityCriteria.push("Original Manufacturer's Authorization Form (MAF) required from primary OEMs");
        }
        if (/joint venture|jv|consortium/i.test(text)) {
            const jvMatch = text.match(/(?:joint venture|jv|consortium)[\s\S]{1,120}?(?:permitted|lead partner|agreement|share)/i);
            eligibilityCriteria.push(jvMatch ? jvMatch[0].trim().replace(/\s+/g, ' ') : 'Joint Venture (JV) / Consortium regulations apply');
        }

        // 4. Liquidated Damages & Penalties
        let liquidatedDamages = 'Standard government / commercial conditions apply';
        const ldMatch = text.match(/(?:liquidated damages|delay penalty|penalty for delay|failure to achieve)[\s\S]{1,150}?(?:%|percent|ceiling|maximum)/i);
        if (ldMatch) {
            liquidatedDamages = ldMatch[0].trim().replace(/\s+/g, ' ');
        }

        // 5. Mandatory Checklist Items Generator
        const generatedChecklist = [
            { text: "Duly Signed & Sealed Bid Submission Letter", checked: false },
            { text: "Priced Bill of Quantities (BoQ) & Financial Model", checked: false }
        ];

        if (/bid (?:security|bond)|guarantee/i.test(text)) {
            generatedChecklist.push({ text: `Bank Guarantee / Bid Security (${bidSecurity.substring(0, 45)})`, checked: false });
        }
        if (/power of attorney|authorized signatory/i.test(text)) {
            generatedChecklist.push({ text: "Power of Attorney / Board Resolution for Signatory", checked: false });
        }
        if (/financial statement|audited/i.test(text)) {
            generatedChecklist.push({ text: "Audited Financial Statements (Last 3 Years)", checked: false });
        }
        if (/manufacturer authorization|maf/i.test(text)) {
            generatedChecklist.push({ text: "Original OEM Manufacturer Authorization Letters (MAFs)", checked: false });
        }
        if (/joint venture|consortium|jv/i.test(text)) {
            generatedChecklist.push({ text: "Notarized Joint Venture / Consortium Agreement", checked: false });
        }
        if (/tax clearance|business registration/i.test(text)) {
            generatedChecklist.push({ text: "Valid Tax Clearance & Business Registration Certificates", checked: false });
        }
        if (/iso/i.test(text)) {
            generatedChecklist.push({ text: "Certified Copies of ISO Standards & Quality Certificates", checked: false });
        }
        if (/client reference|completion certificate/i.test(text)) {
            generatedChecklist.push({ text: "Past Client Reference Letters & Proof of Experience", checked: false });
        }
        if (/sla|service level/i.test(text)) {
            generatedChecklist.push({ text: "SLA Commitment & Maintenance Methodology Document", checked: false });
        }

        // 6. Keywords Cloud Extraction
        const candidateKeywords = [
            "Cloud", "HCI", "Data Center", "Storage", "Network", "Security", "Firewall", "Server", 
            "SLA", "Disaster Recovery", "Turnkey", "Smart Grid", "AMI", "IoT", "ERP", "API Gateway",
            "DLMS", "Hospital Information", "PACS", "EMR", "Warranty", "Commissioning", "Training",
            "Joint Venture", "Turnover", "High Availability", "Testing", "Maintenance", "ISO 27001", "ISO 9001"
        ];
        const matchedKeywords = candidateKeywords.filter(kw => new RegExp(`\\b${kw}\\b`, 'i').test(text));

        // 7. Risk Level Assessment
        let riskScore = 0;
        let riskReasons = [];
        if (/liquidated damages/i.test(text) && /10%|ceiling/i.test(text)) {
            riskScore += 2;
            riskReasons.push("Liquidated damages clause with high penalty threshold");
        }
        if (/bank guarantee|bid security/i.test(text)) {
            riskScore += 1;
            riskReasons.push("Substantial bank guarantee required");
        }
        if (extractedDeadlines.some(d => /urgent|short|immediate|14 days/i.test(d))) {
            riskScore += 2;
            riskReasons.push("Tight submission or delivery timeframe");
        }
        if (/turnover/i.test(text) && /(?:5,000,000|10,000,000|15,000,000|million)/i.test(text)) {
            riskScore += 1;
            riskReasons.push("High financial turnover qualification threshold");
        }

        let riskLevel = "Low";
        if (riskScore >= 4) riskLevel = "High";
        else if (riskScore >= 2) riskLevel = "Moderate";

        // Summary words count
        const wordCount = text.split(/\s+/).filter(Boolean).length;

        return {
            fileName,
            analyzedAt: new Date().toISOString(),
            wordCount,
            extractedDeadlines: extractedDeadlines.length ? extractedDeadlines : ["No clear deadline patterns found. Review document manually."],
            bidSecurity,
            eligibilityCriteria: eligibilityCriteria.length ? eligibilityCriteria : ["General commercial eligibility terms apply."],
            liquidatedDamages,
            generatedChecklist,
            keyKeywords: matchedKeywords.length ? matchedKeywords : ["Procurement", "Tender", "Specifications"],
            riskLevel,
            riskReasons: riskReasons.length ? riskReasons : ["Standard procurement risk level."]
        };
    }
}

window.documentAnalyzer = new DocumentAnalyzer();
