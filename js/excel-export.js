/**
 * excel-export.js
 * Handles export to Excel (.xlsx) using SheetJS and instant 1-click clipboard export for Google Sheets.
 */

class ExcelExporter {
    constructor() {
        this.xlsx = window.XLSX;
    }

    /**
     * Checks if SheetJS is available
     */
    checkLibrary() {
        if (!window.XLSX) {
            alert('Excel export library (SheetJS) is still loading. Please check your internet connection or try again.');
            return false;
        }
        return true;
    }

    /**
     * Formats currency amounts safely
     */
    formatCurrency(amount, currency = 'USD') {
        if (!amount && amount !== 0) return 'N/A';
        return `${currency} ${Number(amount).toLocaleString()}`;
    }

    /**
     * Export all tenders in the system into a multi-sheet Excel file (.xlsx)
     * Compatible with Microsoft Excel, Google Sheets, LibreOffice.
     * @param {Array} tenders 
     */
    exportAllTendersToExcel(tenders) {
        if (!this.checkLibrary()) return;

        const wb = XLSX.utils.book_new();

        // 1. Sheet 1: Master Tenders Summary
        const tendersData = tenders.map(t => ({
            "Procurement ID": t.procurementId || '',
            "Procurement Title": t.procurementTitle || '',
            "Procurement Entity": t.procurementEntity || '',
            "Publish Date": t.publishDate || '',
            "Submission Date": t.submissionDate ? t.submissionDate.replace('T', ' ') : '',
            "JV or Not": t.isJV || 'No',
            "JV Partner Details": t.jvPartnerDetails || 'None',
            "Solution Proposed": t.solution || '',
            "Account Manager": t.accountManager || '',
            "Tender Status": t.status || 'Draft',
            "Estimated Value": t.estimatedValue ? `${t.currency || 'USD'} ${t.estimatedValue}` : '',
            "Our Bid Amount": t.ourBidAmount ? `${t.currency || 'USD'} ${t.ourBidAmount}` : '',
            "Remark / Latest Update": t.remarks || '',
            "Participating Competitors": (t.participatedCompanies || []).length,
            "Documents Attached": (t.documents || []).length,
            "Last Modified": t.updatedAt ? new Date(t.updatedAt).toLocaleDateString() : ''
        }));

        const wsTenders = XLSX.utils.json_to_sheet(tendersData);

        // Auto-fit column widths
        wsTenders['!cols'] = [
            { wch: 22 }, // Proc ID
            { wch: 45 }, // Title
            { wch: 32 }, // Entity
            { wch: 14 }, // Pub Date
            { wch: 18 }, // Sub Date
            { wch: 10 }, // JV
            { wch: 30 }, // JV Details
            { wch: 40 }, // Solution
            { wch: 20 }, // AM
            { wch: 15 }, // Status
            { wch: 18 }, // Est Value
            { wch: 18 }, // Our Bid
            { wch: 45 }, // Remarks
            { wch: 12 }, // Competitors
            { wch: 12 }, // Docs
            { wch: 14 }  // Modified
        ];

        XLSX.utils.book_append_sheet(wb, wsTenders, "All Tenders Summary");

        // 2. Sheet 2: Participated Company & Competitor Readings
        const readingsData = [];
        tenders.forEach(t => {
            const comps = t.participatedCompanies || [];
            comps.forEach(c => {
                readingsData.push({
                    "Procurement ID": t.procurementId,
                    "Procurement Title": t.procurementTitle,
                    "Participating Company": c.companyName,
                    "Bid Price / Reading": c.bidPrice ? `${c.currency || t.currency || 'USD'} ${Number(c.bidPrice).toLocaleString()}` : 'N/A',
                    "Raw Amount": c.bidPrice || 0,
                    "Technical Score (%)": c.technicalScore || 'N/A',
                    "Solution / Brand Offered": c.solutionOffered || 'N/A',
                    "Rank / Status": c.rankStatus || 'N/A',
                    "Variance vs Our Bid (%)": c.variancePercent !== undefined ? `${c.variancePercent > 0 ? '+' : ''}${c.variancePercent}%` : '',
                    "Remarks / Reading Notes": c.remarks || ''
                });
            });
        });

        if (readingsData.length > 0) {
            const wsReadings = XLSX.utils.json_to_sheet(readingsData);
            wsReadings['!cols'] = [
                { wch: 22 },
                { wch: 35 },
                { wch: 35 },
                { wch: 20 },
                { wch: 14 },
                { wch: 18 },
                { wch: 35 },
                { wch: 22 },
                { wch: 20 },
                { wch: 40 }
            ];
            XLSX.utils.book_append_sheet(wb, wsReadings, "Participated Company Readings");
        }

        // 3. Sheet 3: Document Registry
        const docsData = [];
        tenders.forEach(t => {
            (t.documents || []).forEach(doc => {
                docsData.push({
                    "Procurement ID": t.procurementId,
                    "Procurement Title": t.procurementTitle,
                    "Document Name": doc.name,
                    "Category": doc.category || 'General',
                    "File Size": doc.size || '',
                    "Upload Date": doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleString() : '',
                    "Analysis Status": doc.status || 'Pending'
                });
            });
        });

        if (docsData.length > 0) {
            const wsDocs = XLSX.utils.json_to_sheet(docsData);
            wsDocs['!cols'] = [
                { wch: 22 },
                { wch: 35 },
                { wch: 35 },
                { wch: 22 },
                { wch: 14 },
                { wch: 22 },
                { wch: 16 }
            ];
            XLSX.utils.book_append_sheet(wb, wsDocs, "Attached Documents");
        }

        const fileName = `TenderHub_Master_Export_${new Date().toISOString().slice(0, 10)}.xlsx`;
        XLSX.writeFile(wb, fileName);
    }

    /**
     * Export a specific single tender's full dossier into Excel
     * @param {Object} tender 
     */
    exportSingleTenderToExcel(tender) {
        if (!this.checkLibrary()) return;

        const wb = XLSX.utils.book_new();

        // Sheet 1: Tender Details & Profile
        const overviewData = [
            { "Field": "Procurement Title", "Value": tender.procurementTitle || '' },
            { "Field": "Procurement ID", "Value": tender.procurementId || '' },
            { "Field": "Procurement Entity", "Value": tender.procurementEntity || '' },
            { "Field": "Tender Status", "Value": tender.status || 'Draft' },
            { "Field": "Publish Date", "Value": tender.publishDate || '' },
            { "Field": "Submission Date & Time", "Value": tender.submissionDate ? tender.submissionDate.replace('T', ' ') : '' },
            { "Field": "Joint Venture (JV) Status", "Value": tender.isJV || 'No' },
            { "Field": "JV Partner Details", "Value": tender.jvPartnerDetails || 'N/A' },
            { "Field": "Account Manager", "Value": tender.accountManager || '' },
            { "Field": "Estimated Tender Budget", "Value": tender.estimatedValue ? `${tender.currency || 'USD'} ${Number(tender.estimatedValue).toLocaleString()}` : 'N/A' },
            { "Field": "Our Quoted Bid Amount", "Value": tender.ourBidAmount ? `${tender.currency || 'USD'} ${Number(tender.ourBidAmount).toLocaleString()}` : 'N/A' },
            { "Field": "Remark / Latest Update", "Value": tender.remarks || '' },
            { "Field": "Proposed Solution Overview", "Value": tender.solution || '' }
        ];

        // Detailed solution fields if available
        if (tender.solutionDetails) {
            overviewData.push(
                { "Field": "Solution Architecture", "Value": tender.solutionDetails.architecture || '' },
                { "Field": "OEM & Technology Partners", "Value": tender.solutionDetails.oemPartners || '' },
                { "Field": "Delivery Timeline & SLA", "Value": tender.solutionDetails.deliveryTimeline || '' },
                { "Field": "Key Differentiators", "Value": tender.solutionDetails.keyDifferentiators || '' }
            );
        }

        const wsOverview = XLSX.utils.json_to_sheet(overviewData);
        wsOverview['!cols'] = [{ wch: 30 }, { wch: 65 }];
        XLSX.utils.book_append_sheet(wb, wsOverview, "Tender Overview");

        // Sheet 2: Participated Company Readings
        const readings = (tender.participatedCompanies || []).map((c, idx) => ({
            "Rank / Position": c.rankStatus || `Bidder #${idx + 1}`,
            "Company / Bidder Name": c.companyName,
            "Bid Price (Reading)": c.bidPrice ? `${c.currency || tender.currency || 'USD'} ${Number(c.bidPrice).toLocaleString()}` : 'N/A',
            "Technical Score (%)": c.technicalScore || 'N/A',
            "Proposed Solution / Brand": c.solutionOffered || 'N/A',
            "Variance vs Our Bid (%)": c.variancePercent !== undefined ? `${c.variancePercent > 0 ? '+' : ''}${c.variancePercent}%` : '',
            "Remarks / Evaluation Notes": c.remarks || ''
        }));

        if (readings.length > 0) {
            const wsReadings = XLSX.utils.json_to_sheet(readings);
            wsReadings['!cols'] = [
                { wch: 20 },
                { wch: 35 },
                { wch: 22 },
                { wch: 18 },
                { wch: 35 },
                { wch: 22 },
                { wch: 45 }
            ];
            XLSX.utils.book_append_sheet(wb, wsReadings, "Participated Companies");
        }

        // Sheet 3: Checklist
        if (tender.checklist && tender.checklist.length > 0) {
            const checklistData = tender.checklist.map((item, idx) => ({
                "#": idx + 1,
                "Requirement / Mandatory Submission Item": item.text,
                "Status": item.checked ? "COMPLIANT / READY" : "PENDING / INCOMPLETE"
            }));
            const wsChecklist = XLSX.utils.json_to_sheet(checklistData);
            wsChecklist['!cols'] = [{ wch: 6 }, { wch: 55 }, { wch: 24 }];
            XLSX.utils.book_append_sheet(wb, wsChecklist, "Submission Checklist");
        }

        const safeId = (tender.procurementId || 'Tender').replace(/[^a-zA-Z0-9_-]/g, '_');
        const fileName = `Tender_${safeId}_Dossier.xlsx`;
        XLSX.writeFile(wb, fileName);
    }

    /**
     * Copies tender data in TSV (Tab-Separated Values) format directly to clipboard.
     * This allows immediate Ctrl+V paste into Google Sheets with auto-formatting into columns!
     * @param {Array} tenders 
     * @returns {Promise<boolean>}
     */
    async copyTendersForGoogleSheets(tenders) {
        const headers = [
            "Procurement ID",
            "Procurement Title",
            "Procurement Entity",
            "Publish Date",
            "Submission Date",
            "JV or Not",
            "JV Partner Details",
            "Solution",
            "Account Manager",
            "Status",
            "Estimated Value",
            "Our Bid Amount",
            "Remark or Update",
            "Competitors Count"
        ];

        const rows = tenders.map(t => [
            t.procurementId || '',
            (t.procurementTitle || '').replace(/\t|\n|\r/g, ' '),
            (t.procurementEntity || '').replace(/\t|\n|\r/g, ' '),
            t.publishDate || '',
            t.submissionDate ? t.submissionDate.replace('T', ' ') : '',
            t.isJV || 'No',
            (t.jvPartnerDetails || '').replace(/\t|\n|\r/g, ' '),
            (t.solution || '').replace(/\t|\n|\r/g, ' '),
            t.accountManager || '',
            t.status || 'Draft',
            t.estimatedValue ? `${t.currency || 'USD'} ${t.estimatedValue}` : '',
            t.ourBidAmount ? `${t.currency || 'USD'} ${t.ourBidAmount}` : '',
            (t.remarks || '').replace(/\t|\n|\r/g, ' '),
            (t.participatedCompanies || []).length
        ]);

        const tsv = [headers.join('\t'), ...rows.map(r => r.join('\t'))].join('\n');

        try {
            await navigator.clipboard.writeText(tsv);
            return true;
        } catch (err) {
            console.error('Clipboard copy failed:', err);
            // Fallback using textarea
            const textarea = document.createElement('textarea');
            textarea.value = tsv;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            const success = document.execCommand('copy');
            document.body.removeChild(textarea);
            return success;
        }
    }

    /**
     * Copies participated company readings of a single tender for Google Sheets
     * @param {Object} tender 
     */
    async copyReadingsForGoogleSheets(tender) {
        const headers = [
            "Rank / Status",
            "Company / Bidder Name",
            "Bid Price (Reading)",
            "Technical Score (%)",
            "Solution / Brand Offered",
            "Variance vs Our Bid (%)",
            "Remarks / Notes"
        ];

        const rows = (tender.participatedCompanies || []).map(c => [
            c.rankStatus || '',
            (c.companyName || '').replace(/\t|\n|\r/g, ' '),
            c.bidPrice ? `${c.currency || tender.currency || 'USD'} ${Number(c.bidPrice).toLocaleString()}` : '',
            c.technicalScore || '',
            (c.solutionOffered || '').replace(/\t|\n|\r/g, ' '),
            c.variancePercent !== undefined ? `${c.variancePercent}%` : '',
            (c.remarks || '').replace(/\t|\n|\r/g, ' ')
        ]);

        const tsv = [headers.join('\t'), ...rows.map(r => r.join('\t'))].join('\n');

        try {
            await navigator.clipboard.writeText(tsv);
            return true;
        } catch (err) {
            console.error('Clipboard copy failed:', err);
            return false;
        }
    }
}

window.excelExporter = new ExcelExporter();
