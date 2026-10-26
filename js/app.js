/**
 * app.js
 * Core application controller for TenderHub.
 * Coordinates UI rendering, event handling, CRUD operations, and integrations.
 */

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Initialize Sample Data if storage is empty
    checkAndSeedSampleData();

    // 2. State
    let currentTenders = window.storageManager.getTenders();
    let selectedTenderId = null;
    let competitorChartInstance = null;
    let activeViewMode = 'grid'; // 'grid' or 'table'

    // 3. UI Element References
    const elements = {
        // Stats
        statTotal: document.getElementById('stat-total'),
        statInProgress: document.getElementById('stat-inprogress'),
        statSubmitted: document.getElementById('stat-submitted'),
        statJv: document.getElementById('stat-jv'),

        // Filters & Search
        inputSearch: document.getElementById('input-search'),
        selectFilterStatus: document.getElementById('select-filter-status'),
        selectFilterJv: document.getElementById('select-filter-jv'),
        viewToggleGrid: document.getElementById('view-toggle-grid'),
        viewToggleTable: document.getElementById('view-toggle-table'),

        // Containers
        tendersGridView: document.getElementById('tenders-grid-view'),
        tendersTableView: document.getElementById('tenders-table-view'),
        tendersTableBody: document.getElementById('tenders-table-body'),
        emptyState: document.getElementById('empty-state'),

        // Main Action Buttons
        btnNewTender: document.getElementById('btn-new-tender'),
        btnExportExcelAll: document.getElementById('btn-export-excel-all'),
        btnCopyGSheetAll: document.getElementById('btn-copy-gsheet-all'),
        btnEmptyCreate: document.getElementById('btn-empty-create'),
        btnSettingsToggle: document.getElementById('btn-settings-toggle'),
        settingsMenu: document.getElementById('settings-menu'),
        btnBackupJson: document.getElementById('btn-backup-json'),
        inputRestoreFile: document.getElementById('input-restore-file'),
        btnResetSample: document.getElementById('btn-reset-sample'),

        // Tender Form Modal
        modalTenderForm: document.getElementById('modal-tender-form'),
        modalFormOverlay: document.getElementById('modal-form-overlay'),
        btnCloseFormModal: document.getElementById('btn-close-form-modal'),
        btnCancelForm: document.getElementById('btn-cancel-form'),
        tenderDetailsForm: document.getElementById('tender-details-form'),
        formModalTitle: document.getElementById('form-modal-title'),
        formTenderId: document.getElementById('form-tender-id'),
        formProcurementTitle: document.getElementById('form-procurement-title'),
        formProcurementId: document.getElementById('form-procurement-id'),
        formProcurementEntity: document.getElementById('form-procurement-entity'),
        formPublishDate: document.getElementById('form-publish-date'),
        formSubmissionDate: document.getElementById('form-submission-date'),
        formJvDetailsContainer: document.getElementById('jv-details-container'),
        formJvDetails: document.getElementById('form-jv-details'),
        formSolution: document.getElementById('form-solution'),
        formAccountManager: document.getElementById('form-account-manager'),
        formStatus: document.getElementById('form-status'),
        formCurrency: document.getElementById('form-currency'),
        formBidAmount: document.getElementById('form-bid-amount'),
        formRemarks: document.getElementById('form-remarks'),

        // Dossier Modal
        modalDossier: document.getElementById('modal-dossier'),
        modalDossierOverlay: document.getElementById('modal-dossier-overlay'),
        btnCloseDossier: document.getElementById('btn-close-dossier'),
        btnDossierExportExcel: document.getElementById('btn-dossier-export-excel'),
        dossierIdBadge: document.getElementById('dossier-id-badge'),
        dossierStatusBadge: document.getElementById('dossier-status-badge'),
        dossierJvBadge: document.getElementById('dossier-jv-badge'),
        dossierTitle: document.getElementById('dossier-title'),

        // Dossier Overview
        dossierEntity: document.getElementById('dossier-entity'),
        dossierAm: document.getElementById('dossier-am'),
        dossierBudget: document.getElementById('dossier-budget'),
        dossierOurPrice: document.getElementById('dossier-our-price'),
        dossierPublishDate: document.getElementById('dossier-publish-date'),
        dossierSubmissionDate: document.getElementById('dossier-submission-date'),
        dossierCountdown: document.getElementById('dossier-countdown'),
        dossierJvText: document.getElementById('dossier-jv-text'),
        dossierJvIcon: document.getElementById('dossier-jv-icon'),
        dossierJvLabel: document.getElementById('dossier-jv-label'),
        dossierRemarks: document.getElementById('dossier-remarks'),
        dossierLastUpdated: document.getElementById('dossier-last-updated'),

        // Dossier Solution
        dossierSolutionSummary: document.getElementById('dossier-solution-summary'),
        dossierSolutionArch: document.getElementById('dossier-solution-arch'),
        dossierSolutionOem: document.getElementById('dossier-solution-oem'),
        dossierSolutionTimeline: document.getElementById('dossier-solution-timeline'),
        dossierSolutionDiff: document.getElementById('dossier-solution-diff'),
        btnEditSolution: document.getElementById('btn-edit-solution'),

        // Dossier Documents & Analysis
        docDropZone: document.getElementById('doc-drop-zone'),
        inputTenderDoc: document.getElementById('input-tender-doc'),
        selectUploadCategory: document.getElementById('select-upload-category'),
        dossierDocsList: document.getElementById('dossier-docs-list'),
        docTableCounter: document.getElementById('doc-table-counter'),
        badgeDocCount: document.getElementById('badge-doc-count'),
        analysisResultsCard: document.getElementById('analysis-results-card'),
        analysisFileName: document.getElementById('analysis-file-name'),
        analysisRiskBadge: document.getElementById('analysis-risk-badge'),
        analysisDeadlinesList: document.getElementById('analysis-deadlines-list'),
        analysisSecurityText: document.getElementById('analysis-security-text'),
        analysisEligibilityList: document.getElementById('analysis-eligibility-list'),
        analysisPenaltyText: document.getElementById('analysis-penalty-text'),
        analysisKeywordsCloud: document.getElementById('analysis-keywords-cloud'),
        btnApplyExtractedChecklist: document.getElementById('btn-apply-extracted-checklist'),

        // Dossier Participated Readings
        btnCopyReadingsGsheet: document.getElementById('btn-copy-readings-gsheet'),
        btnAddCompetitor: document.getElementById('btn-add-competitor'),
        tableCompetitorsBody: document.getElementById('table-competitors-body'),
        badgeCompCount: document.getElementById('badge-comp-count'),

        // Dossier Checklist
        checklistItemsContainer: document.getElementById('checklist-items-container'),
        checklistProgressBar: document.getElementById('checklist-progress-bar'),
        checklistProgressText: document.getElementById('checklist-progress-text'),
        inputNewCheckItem: document.getElementById('input-new-check-item'),
        btnAddCheckItem: document.getElementById('btn-add-check-item'),

        // Competitor Form Modal
        modalCompetitorForm: document.getElementById('modal-competitor-form'),
        modalCompOverlay: document.getElementById('modal-comp-overlay'),
        btnCloseCompModal: document.getElementById('btn-close-comp-modal'),
        btnCancelComp: document.getElementById('btn-cancel-comp'),
        competitorForm: document.getElementById('competitor-form'),
        compModalTitle: document.getElementById('comp-modal-title'),
        compEditId: document.getElementById('comp-edit-id'),
        compName: document.getElementById('comp-name'),
        compPrice: document.getElementById('comp-price'),
        compTechScore: document.getElementById('comp-tech-score'),
        compRank: document.getElementById('comp-rank'),
        compSolution: document.getElementById('comp-solution'),
        compRemarks: document.getElementById('comp-remarks')
    };

    // Stored temporary analysis extracted checklist
    let lastExtractedChecklist = [];

    // --- Toast Notifications ---
    function showToast(message, type = 'success', duration = 3500) {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast-item flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-xs font-semibold ${
            type === 'success' ? 'bg-emerald-50 text-emerald-900 border-emerald-200' :
            type === 'error' ? 'bg-rose-50 text-rose-900 border-rose-200' :
            'bg-blue-50 text-blue-900 border-blue-200'
        }`;

        const icon = type === 'success' ? 'fa-circle-check text-emerald-600' :
                     type === 'error' ? 'fa-circle-xmark text-rose-600' :
                     'fa-circle-info text-blue-600';

        toast.innerHTML = `
            <i class="fa-solid ${icon} text-base"></i>
            <span class="flex-1">${message}</span>
            <button class="text-slate-400 hover:text-slate-600 ml-2" onclick="this.parentElement.remove()">
                <i class="fa-solid fa-xmark"></i>
            </button>
        `;

        container.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    // --- Helpers ---
    function formatCurrency(amount, currency = 'USD') {
        if (!amount && amount !== 0) return 'Not Specified';
        return `${currency} ${Number(amount).toLocaleString()}`;
    }

    function calculateTimeRemaining(deadlineStr) {
        if (!deadlineStr) return { text: 'No Date Set', urgent: false, expired: false };
        const deadline = new Date(deadlineStr).getTime();
        const now = new Date().getTime();
        const diff = deadline - now;

        if (diff <= 0) {
            return { text: 'Submission Closed', urgent: false, expired: true };
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        if (days > 1) {
            return { text: `${days} days left`, urgent: days <= 5, expired: false };
        } else if (days === 1) {
            return { text: `1 day, ${hours} hrs left`, urgent: true, expired: false };
        } else {
            return { text: `${hours} hours left today!`, urgent: true, expired: false };
        }
    }

    function getStatusBadgeClass(status) {
        switch (status) {
            case 'Draft': return 'badge-draft';
            case 'In Progress': return 'badge-inprogress';
            case 'Submitted': return 'badge-submitted';
            case 'Awarded': return 'badge-awarded';
            case 'Lost': return 'badge-lost';
            default: return 'badge-inprogress';
        }
    }

    // --- Render Dashboard & KPIs ---
    function updateKPIs(tenders) {
        elements.statTotal.textContent = tenders.length;
        elements.statInProgress.textContent = tenders.filter(t => t.status === 'In Progress').length;
        elements.statSubmitted.textContent = tenders.filter(t => t.status === 'Submitted' || t.status === 'Awarded').length;
        elements.statJv.textContent = tenders.filter(t => t.isJV === 'Yes').length;
    }

    function filterTenders() {
        const query = elements.inputSearch.value.trim().toLowerCase();
        const statusFilter = elements.selectFilterStatus.value;
        const jvFilter = elements.selectFilterJv.value;

        return currentTenders.filter(t => {
            const matchesQuery = !query || 
                (t.procurementTitle || '').toLowerCase().includes(query) ||
                (t.procurementId || '').toLowerCase().includes(query) ||
                (t.procurementEntity || '').toLowerCase().includes(query) ||
                (t.solution || '').toLowerCase().includes(query) ||
                (t.accountManager || '').toLowerCase().includes(query) ||
                (t.remarks || '').toLowerCase().includes(query);

            const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
            const matchesJv = jvFilter === 'ALL' || t.isJV === jvFilter;

            return matchesQuery && matchesStatus && matchesJv;
        });
    }

    function renderTenders() {
        currentTenders = window.storageManager.getTenders();
        updateKPIs(currentTenders);

        const filtered = filterTenders();

        if (filtered.length === 0) {
            elements.tendersGridView.classList.add('hidden');
            elements.tendersTableView.classList.add('hidden');
            elements.emptyState.classList.remove('hidden');
            return;
        }

        elements.emptyState.classList.add('hidden');

        if (activeViewMode === 'grid') {
            elements.tendersGridView.classList.remove('hidden');
            elements.tendersTableView.classList.add('hidden');
            renderGridView(filtered);
        } else {
            elements.tendersGridView.classList.add('hidden');
            elements.tendersTableView.classList.remove('hidden');
            renderTableView(filtered);
        }
    }

    function renderGridView(tenders) {
        elements.tendersGridView.innerHTML = tenders.map(t => {
            const countdown = calculateTimeRemaining(t.submissionDate);
            const statusClass = getStatusBadgeClass(t.status);
            const isJV = t.isJV === 'Yes';
            const docsCount = (t.documents || []).length;
            const compCount = (t.participatedCompanies || []).length;

            return `
                <div class="tender-card bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between" data-id="${t.id}">
                    <!-- Card Top Header -->
                    <div>
                        <div class="flex items-start justify-between gap-2 mb-2">
                            <span class="font-mono text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                                ${t.procurementId || 'ID Pending'}
                            </span>
                            <div class="flex items-center gap-1.5">
                                ${isJV ? `
                                    <span class="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800" title="${t.jvPartnerDetails || 'Joint Venture'}">
                                        <i class="fa-solid fa-handshake mr-1"></i> JV
                                    </span>
                                ` : `
                                    <span class="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                                        Solo
                                    </span>
                                `}
                                <span class="text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${statusClass}">
                                    ${t.status || 'Draft'}
                                </span>
                            </div>
                        </div>

                        <!-- Title -->
                        <h3 class="font-bold text-slate-900 text-sm hover:text-blue-600 cursor-pointer transition line-clamp-2 leading-snug mb-1.5 btn-open-dossier" data-id="${t.id}">
                            ${t.procurementTitle || 'Untitled Procurement'}
                        </h3>

                        <!-- Entity -->
                        <div class="text-xs text-slate-500 font-medium flex items-center gap-1.5 mb-3">
                            <i class="fa-solid fa-building-columns text-slate-400"></i>
                            <span class="truncate">${t.procurementEntity || 'Procuring Entity Unassigned'}</span>
                        </div>

                        <!-- Solution Box -->
                        <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-slate-700 text-xs mb-3.5">
                            <span class="font-semibold text-slate-800 block text-[11px] mb-0.5 flex items-center gap-1">
                                <i class="fa-solid fa-cube text-blue-500"></i> Solution:
                            </span>
                            <p class="line-clamp-2 text-slate-600">${t.solution || 'No solution details entered yet.'}</p>
                        </div>

                        <!-- Dates & Deadline -->
                        <div class="grid grid-cols-2 gap-2 text-[11px] mb-3">
                            <div class="bg-slate-50 p-2 rounded-lg border border-slate-100">
                                <span class="text-slate-400 block font-medium">Publish Date</span>
                                <span class="font-semibold text-slate-700">${t.publishDate || '--'}</span>
                            </div>
                            <div class="p-2 rounded-lg border ${countdown.expired ? 'bg-slate-50 border-slate-200' : countdown.urgent ? 'bg-amber-50 border-amber-200 text-amber-900 deadline-urgent' : 'bg-slate-50 border-slate-100'}">
                                <span class="text-slate-400 block font-medium">Submission Due</span>
                                <span class="font-bold ${countdown.expired ? 'text-slate-500' : countdown.urgent ? 'text-amber-800' : 'text-slate-700'}">
                                    ${countdown.text}
                                </span>
                            </div>
                        </div>

                        <!-- Account Manager & Bid Value -->
                        <div class="flex items-center justify-between text-xs text-slate-600 border-t border-slate-100 pt-2.5">
                            <div class="flex items-center gap-1.5">
                                <i class="fa-regular fa-user text-slate-400"></i>
                                <span class="font-medium">${t.accountManager || 'Unassigned'}</span>
                            </div>
                            <div>
                                <span class="font-bold text-slate-900">${t.ourBidAmount ? formatCurrency(t.ourBidAmount, t.currency) : (t.estimatedValue ? formatCurrency(t.estimatedValue, t.currency) : 'N/A')}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Card Actions Footer -->
                    <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-1 text-xs">
                        <div class="flex items-center gap-3 text-slate-400 text-[11px]">
                            <span title="${docsCount} Documents Attached"><i class="fa-regular fa-file-lines mr-1"></i>${docsCount}</span>
                            <span title="${compCount} Participating Readings"><i class="fa-solid fa-users-viewfinder mr-1"></i>${compCount}</span>
                        </div>

                        <div class="flex items-center gap-1">
                            <button class="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition btn-export-tender-excel" data-id="${t.id}" title="Download Excel for this tender">
                                <i class="fa-solid fa-file-excel"></i>
                            </button>
                            <button class="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-md transition btn-edit-tender" data-id="${t.id}" title="Edit Details">
                                <i class="fa-solid fa-pen"></i>
                            </button>
                            <button class="px-2.5 py-1.5 font-semibold rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition btn-open-dossier" data-id="${t.id}">
                                Open Dossier <i class="fa-solid fa-arrow-right text-[10px] ml-1"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    function renderTableView(tenders) {
        elements.tendersTableBody.innerHTML = tenders.map(t => {
            const countdown = calculateTimeRemaining(t.submissionDate);
            const statusClass = getStatusBadgeClass(t.status);
            const isJV = t.isJV === 'Yes';

            return `
                <tr class="hover:bg-slate-50/80 transition">
                    <td class="px-4 py-3">
                        <span class="font-mono text-[11px] font-bold text-blue-700 block">${t.procurementId || '--'}</span>
                        <a href="javascript:void(0)" class="font-semibold text-slate-900 hover:text-blue-600 btn-open-dossier text-xs" data-id="${t.id}">
                            ${t.procurementTitle || 'Untitled Procurement'}
                        </a>
                    </td>
                    <td class="px-4 py-3">
                        <span class="font-medium text-slate-800">${t.procurementEntity || '--'}</span>
                    </td>
                    <td class="px-4 py-3">
                        <div class="text-[11px]">
                            <span class="text-slate-500 block">Pub: ${t.publishDate || '--'}</span>
                            <span class="font-semibold ${countdown.urgent ? 'text-amber-700' : 'text-slate-800'}">Due: ${countdown.text}</span>
                        </div>
                    </td>
                    <td class="px-4 py-3">
                        ${isJV ? `
                            <span class="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">JV</span>
                        ` : `
                            <span class="text-[11px] text-slate-500 font-medium">Solo</span>
                        `}
                    </td>
                    <td class="px-4 py-3">
                        <span class="font-medium text-slate-700">${t.accountManager || '--'}</span>
                    </td>
                    <td class="px-4 py-3">
                        <span class="text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${statusClass}">
                            ${t.status || 'Draft'}
                        </span>
                    </td>
                    <td class="px-4 py-3 text-right">
                        <div class="inline-flex items-center gap-1.5">
                            <button class="p-1.5 text-slate-400 hover:text-blue-600 btn-open-dossier" data-id="${t.id}" title="Open Dossier">
                                <i class="fa-solid fa-folder-open"></i>
                            </button>
                            <button class="p-1.5 text-slate-400 hover:text-emerald-600 btn-export-tender-excel" data-id="${t.id}" title="Export Excel">
                                <i class="fa-solid fa-file-excel"></i>
                            </button>
                            <button class="p-1.5 text-slate-400 hover:text-blue-600 btn-edit-tender" data-id="${t.id}" title="Edit">
                                <i class="fa-solid fa-pen"></i>
                            </button>
                            <button class="p-1.5 text-slate-400 hover:text-rose-600 btn-delete-tender" data-id="${t.id}" title="Delete">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    // --- Tender Form Handlers (Create / Edit) ---
    function openTenderForm(tenderId = null) {
        elements.tenderDetailsForm.reset();
        elements.formTenderId.value = '';

        if (tenderId) {
            const tender = window.storageManager.getTenderById(tenderId);
            if (!tender) return;

            elements.formModalTitle.textContent = 'Edit Tender Details';
            elements.formTenderId.value = tender.id;
            elements.formProcurementTitle.value = tender.procurementTitle || '';
            elements.formProcurementId.value = tender.procurementId || '';
            elements.formProcurementEntity.value = tender.procurementEntity || '';
            elements.formPublishDate.value = tender.publishDate || '';
            elements.formSubmissionDate.value = tender.submissionDate || '';

            const isJV = tender.isJV === 'Yes';
            const radioJV = document.querySelector(`input[name="form-is-jv"][value="${isJV ? 'Yes' : 'No'}"]`);
            if (radioJV) radioJV.checked = true;

            elements.formJvDetailsContainer.classList.toggle('hidden', !isJV);
            elements.formJvDetails.value = tender.jvPartnerDetails || '';

            elements.formSolution.value = tender.solution || '';
            elements.formAccountManager.value = tender.accountManager || '';
            elements.formStatus.value = tender.status || 'Draft';
            elements.formCurrency.value = tender.currency || 'USD';
            elements.formBidAmount.value = tender.ourBidAmount || '';
            elements.formRemarks.value = tender.remarks || '';
        } else {
            elements.formModalTitle.textContent = 'Enter Tender Details';
            elements.formJvDetailsContainer.classList.add('hidden');
            const todayStr = new Date().toISOString().slice(0, 10);
            elements.formPublishDate.value = todayStr;
        }

        elements.modalTenderForm.classList.remove('hidden');
    }

    function closeTenderForm() {
        elements.modalTenderForm.classList.add('hidden');
    }

    // Toggle JV Partners input
    document.querySelectorAll('input[name="form-is-jv"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            elements.formJvDetailsContainer.classList.toggle('hidden', e.target.value !== 'Yes');
        });
    });

    elements.tenderDetailsForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const id = elements.formTenderId.value.trim();
        const existing = id ? window.storageManager.getTenderById(id) : null;

        const isJV = document.querySelector('input[name="form-is-jv"]:checked')?.value || 'No';

        const tenderData = {
            id: id || ('TND-' + Date.now()),
            procurementTitle: elements.formProcurementTitle.value.trim(),
            procurementId: elements.formProcurementId.value.trim(),
            procurementEntity: elements.formProcurementEntity.value.trim(),
            publishDate: elements.formPublishDate.value,
            submissionDate: elements.formSubmissionDate.value,
            isJV: isJV,
            jvPartnerDetails: isJV === 'Yes' ? elements.formJvDetails.value.trim() : 'Single Bidder Entity',
            solution: elements.formSolution.value.trim(),
            accountManager: elements.formAccountManager.value.trim(),
            status: elements.formStatus.value,
            currency: elements.formCurrency.value,
            ourBidAmount: elements.formBidAmount.value ? parseFloat(elements.formBidAmount.value) : null,
            remarks: elements.formRemarks.value.trim(),
            // Preserve existing sub-structures
            solutionDetails: existing?.solutionDetails || {
                summary: elements.formSolution.value.trim(),
                architecture: 'Standard enterprise deployment specifications.',
                oemPartners: 'Primary authorized partners',
                deliveryTimeline: 'Per tender milestone schedule',
                keyDifferentiators: 'Competitive compliance and dedicated technical support'
            },
            documents: existing?.documents || [],
            checklist: existing?.checklist || [
                { id: "chk-" + Date.now(), text: "Signed Bid Submission Form & Financial Model", checked: false },
                { id: "chk-" + (Date.now() + 1), text: "Bid Security / Bank Guarantee", checked: false },
                { id: "chk-" + (Date.now() + 2), text: "Tax Clearance & Registration Proof", checked: false }
            ],
            participatedCompanies: existing?.participatedCompanies || []
        };

        window.storageManager.saveTender(tenderData);
        closeTenderForm();
        renderTenders();
        showToast(`Tender "${tenderData.procurementId}" saved successfully!`);

        // If dossier modal is active with this tender, update it
        if (selectedTenderId === tenderData.id) {
            openTenderDossier(tenderData.id);
        }
    });

    // --- Tender Dossier Management Modal ---
    function openTenderDossier(tenderId) {
        selectedTenderId = tenderId;
        const tender = window.storageManager.getTenderById(tenderId);
        if (!tender) return;

        // Header info
        elements.dossierIdBadge.textContent = tender.procurementId || 'ID Pending';
        elements.dossierTitle.textContent = tender.procurementTitle || 'Untitled Procurement';
        elements.dossierStatusBadge.textContent = tender.status || 'Draft';
        elements.dossierStatusBadge.className = `text-xs font-semibold px-2.5 py-0.5 rounded-full ${getStatusBadgeClass(tender.status)}`;
        
        const isJV = tender.isJV === 'Yes';
        elements.dossierJvBadge.textContent = isJV ? 'JV Consortium' : 'Solo Bidder';
        elements.dossierJvBadge.className = `text-xs font-semibold px-2 py-0.5 rounded-full ${isJV ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}`;

        // Overview Tab Data
        elements.dossierEntity.textContent = tender.procurementEntity || 'Unassigned';
        elements.dossierAm.textContent = tender.accountManager || 'Unassigned';
        elements.dossierBudget.textContent = tender.estimatedValue ? formatCurrency(tender.estimatedValue, tender.currency) : 'Not Disclosed';
        elements.dossierOurPrice.textContent = tender.ourBidAmount ? formatCurrency(tender.ourBidAmount, tender.currency) : 'Pending Calculation';
        elements.dossierPublishDate.textContent = tender.publishDate || '--';
        elements.dossierSubmissionDate.textContent = tender.submissionDate ? tender.submissionDate.replace('T', ' at ') : '--';

        const countdown = calculateTimeRemaining(tender.submissionDate);
        elements.dossierCountdown.textContent = countdown.text;

        elements.dossierJvLabel.textContent = isJV ? 'Joint Venture Consortium Active' : 'Single Bidder Entity';
        elements.dossierJvText.textContent = isJV ? (tender.jvPartnerDetails || 'Joint venture consortium details recorded.') : 'Our company is participating independently without external JV partners.';
        elements.dossierJvIcon.innerHTML = isJV ? '<i class="fa-solid fa-handshake"></i>' : '<i class="fa-solid fa-user-shield"></i>';

        elements.dossierRemarks.textContent = tender.remarks || 'No remarks recorded yet.';
        elements.dossierLastUpdated.textContent = tender.updatedAt ? `Last updated: ${new Date(tender.updatedAt).toLocaleString()}` : '';

        // Solution Tab Data
        const sol = tender.solutionDetails || {};
        elements.dossierSolutionSummary.textContent = sol.summary || tender.solution || 'No detailed solution summary provided.';
        elements.dossierSolutionArch.textContent = sol.architecture || 'Architecture specifications not detailed.';
        elements.dossierSolutionOem.textContent = sol.oemPartners || 'No OEM partners listed.';
        elements.dossierSolutionTimeline.textContent = sol.deliveryTimeline || 'Standard delivery timeline per RFP.';
        elements.dossierSolutionDiff.textContent = sol.keyDifferentiators || 'Competitive pricing and compliance.';

        // Documents Tab
        renderDossierDocuments(tender);

        // Competitor Readings Tab
        renderDossierCompetitors(tender);

        // Checklist Tab
        renderDossierChecklist(tender);

        // Default to Overview Tab
        switchDossierTab('tab-overview');

        elements.modalDossier.classList.remove('hidden');
    }

    function closeTenderDossier() {
        elements.modalDossier.classList.add('hidden');
        selectedTenderId = null;
        if (competitorChartInstance) {
            competitorChartInstance.destroy();
            competitorChartInstance = null;
        }
    }

    // Dossier Tabs switching
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            switchDossierTab(targetId);
        });
    });

    function switchDossierTab(targetId) {
        document.querySelectorAll('.tab-button').forEach(b => {
            b.classList.toggle('active', b.getAttribute('data-target') === targetId);
        });
        document.querySelectorAll('.tab-content').forEach(c => {
            c.classList.toggle('hidden', c.id !== targetId);
        });

        // Trigger chart resize if switching to competitors tab
        if (targetId === 'tab-competitors' && selectedTenderId) {
            const tender = window.storageManager.getTenderById(selectedTenderId);
            if (tender) renderCompetitorChart(tender);
        }
    }

    // --- Document Upload & Analysis Handling ---
    function renderDossierDocuments(tender) {
        const docs = tender.documents || [];
        elements.docTableCounter.textContent = `${docs.length} Document${docs.length === 1 ? '' : 's'}`;
        elements.badgeDocCount.textContent = docs.length;

        if (docs.length === 0) {
            elements.dossierDocsList.innerHTML = `
                <tr>
                    <td colspan="5" class="px-4 py-8 text-center text-slate-400">
                        <i class="fa-regular fa-file-excel text-2xl mb-1 block"></i>
                        No tender documents attached yet. Drop files above to upload and analyze.
                    </td>
                </tr>
            `;
            elements.analysisResultsCard.classList.add('hidden');
            return;
        }

        elements.dossierDocsList.innerHTML = docs.map(doc => {
            const isAnalyzed = doc.status === 'Analyzed';
            return `
                <tr class="hover:bg-slate-50 transition">
                    <td class="px-4 py-3">
                        <div class="flex items-center gap-2">
                            <i class="fa-solid fa-file-pdf text-rose-500 text-sm"></i>
                            <span class="font-semibold text-slate-800">${doc.name}</span>
                        </div>
                    </td>
                    <td class="px-4 py-3 text-slate-600">${doc.category || 'General'}</td>
                    <td class="px-4 py-3 text-slate-500">${doc.size || '--'}</td>
                    <td class="px-4 py-3">
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold ${isAnalyzed ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}">
                            ${doc.status || 'Uploaded'}
                        </span>
                    </td>
                    <td class="px-4 py-3 text-right">
                        <div class="inline-flex items-center gap-1.5">
                            <button class="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition btn-analyze-doc" data-docid="${doc.id}">
                                <i class="fa-solid fa-wand-magic-sparkles mr-1"></i> Analyze
                            </button>
                            <button class="p-1.5 text-slate-400 hover:text-blue-600 btn-download-doc" data-docid="${doc.id}" title="Download Document">
                                <i class="fa-solid fa-download"></i>
                            </button>
                            <button class="p-1.5 text-slate-400 hover:text-rose-600 btn-delete-doc" data-docid="${doc.id}" title="Delete Document">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        // If any document was analyzed, show analysis result
        const analyzedDoc = docs.find(d => d.analysisResults);
        if (analyzedDoc) {
            displayAnalysisCard(analyzedDoc.name, analyzedDoc.analysisResults);
        } else {
            elements.analysisResultsCard.classList.add('hidden');
        }
    }

    async function handleFileUpload(files) {
        if (!selectedTenderId || !files || files.length === 0) return;

        const tender = window.storageManager.getTenderById(selectedTenderId);
        if (!tender) return;

        if (!tender.documents) tender.documents = [];
        const category = elements.selectUploadCategory.value;

        for (const file of files) {
            const docId = 'doc-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
            const sizeFormatted = (file.size / 1024 / 1024).toFixed(2) + ' MB';

            // Store in IndexedDB
            await window.storageManager.saveDocumentFile(docId, file, {
                name: file.name,
                type: file.type,
                size: sizeFormatted
            });

            // Add metadata to tender
            const docRecord = {
                id: docId,
                name: file.name,
                category: category,
                size: sizeFormatted,
                uploadedAt: new Date().toISOString(),
                status: 'Processing...'
            };

            tender.documents.push(docRecord);

            // Trigger automatic text extraction & analysis right away!
            try {
                const text = await window.documentAnalyzer.extractText(file);
                const analysis = window.documentAnalyzer.analyzeTenderDocument(text, file.name);
                docRecord.status = 'Analyzed';
                docRecord.analysisResults = analysis;
                displayAnalysisCard(file.name, analysis);
            } catch (err) {
                console.warn('Auto-analysis notice:', err);
                docRecord.status = 'Ready';
            }
        }

        window.storageManager.saveTender(tender);
        renderDossierDocuments(tender);
        renderTenders();
        showToast(`${files.length} document(s) uploaded and analyzed!`);
    }

    function displayAnalysisCard(fileName, analysis) {
        elements.analysisResultsCard.classList.remove('hidden');
        elements.analysisFileName.textContent = `Analyzed Document: ${fileName} (${analysis.wordCount || 0} words parsed)`;

        // Risk Badge
        elements.analysisRiskBadge.textContent = `Risk Level: ${analysis.riskLevel}`;
        elements.analysisRiskBadge.className = `px-2.5 py-0.5 rounded-full font-bold text-xs ${
            analysis.riskLevel === 'High' ? 'bg-rose-100 text-rose-800' :
            analysis.riskLevel === 'Moderate' ? 'bg-amber-100 text-amber-800' :
            'bg-emerald-100 text-emerald-800'
        }`;

        // Deadlines
        elements.analysisDeadlinesList.innerHTML = (analysis.extractedDeadlines || []).map(d => `
            <li class="flex items-start gap-1.5"><i class="fa-solid fa-angle-right text-blue-500 mt-0.5"></i> ${d}</li>
        `).join('');

        // Security
        elements.analysisSecurityText.textContent = analysis.bidSecurity || 'Standard bid bond conditions.';

        // Eligibility
        elements.analysisEligibilityList.innerHTML = (analysis.eligibilityCriteria || []).map(c => `
            <li>${c}</li>
        `).join('');

        // Penalties
        elements.analysisPenaltyText.textContent = analysis.liquidatedDamages || 'Standard penalty conditions.';

        // Keywords Cloud
        elements.analysisKeywordsCloud.innerHTML = (analysis.keyKeywords || []).map(kw => `
            <span class="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-mono text-[11px] border border-slate-200">${kw}</span>
        `).join('');

        lastExtractedChecklist = analysis.generatedChecklist || [];
    }

    // Drag and drop event listeners
    elements.docDropZone.addEventListener('click', () => elements.inputTenderDoc.click());
    elements.inputTenderDoc.addEventListener('change', (e) => {
        handleFileUpload(e.target.files);
        elements.inputTenderDoc.value = '';
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        elements.docDropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            elements.docDropZone.classList.add('dragover');
        });
    });

    ['dragleave', 'drop'].forEach(eventName => {
        elements.docDropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            elements.docDropZone.classList.remove('dragover');
        });
    });

    elements.docDropZone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFileUpload(files);
    });

    // Apply auto-generated checklist to Tender checklist
    elements.btnApplyExtractedChecklist.addEventListener('click', () => {
        if (!selectedTenderId || lastExtractedChecklist.length === 0) return;
        const tender = window.storageManager.getTenderById(selectedTenderId);
        if (!tender) return;

        if (!tender.checklist) tender.checklist = [];
        
        let addedCount = 0;
        lastExtractedChecklist.forEach(item => {
            const exists = tender.checklist.some(c => c.text.toLowerCase() === item.text.toLowerCase());
            if (!exists) {
                tender.checklist.push({
                    id: 'chk-' + Date.now() + '-' + Math.random().toString(36).substr(2, 3),
                    text: item.text,
                    checked: false
                });
                addedCount++;
            }
        });

        window.storageManager.saveTender(tender);
        renderDossierChecklist(tender);
        showToast(`Synced ${addedCount} requirement(s) into Compliance Checklist!`);
        switchDossierTab('tab-checklist');
    });

    // --- Participated Company Readings Management ---
    function renderDossierCompetitors(tender) {
        const competitors = tender.participatedCompanies || [];
        elements.badgeCompCount.textContent = competitors.length;

        if (competitors.length === 0) {
            elements.tableCompetitorsBody.innerHTML = `
                <tr>
                    <td colspan="8" class="px-4 py-8 text-center text-slate-400">
                        <i class="fa-solid fa-users-viewfinder text-2xl mb-1 block"></i>
                        No competitor bid readings recorded yet. Click "Add Bid Reading" to log bidder prices and details.
                    </td>
                </tr>
            `;
            if (competitorChartInstance) competitorChartInstance.destroy();
            return;
        }

        elements.tableCompetitorsBody.innerHTML = competitors.map(c => {
            const isOurCompany = (c.companyName || '').toLowerCase().includes('our company');
            const variance = c.variancePercent !== undefined ? c.variancePercent : 0;
            const varianceDisplay = variance === 0 ? 'Baseline' : `${variance > 0 ? '+' : ''}${variance}%`;
            const varianceClass = variance < 0 ? 'text-rose-600 font-bold' : variance > 0 ? 'text-emerald-600 font-bold' : 'text-blue-600 font-semibold';

            return `
                <tr class="${isOurCompany ? 'bg-blue-50/60 font-semibold' : 'hover:bg-slate-50'} transition">
                    <td class="px-3.5 py-3">
                        <div class="flex items-center gap-2">
                            ${isOurCompany ? '<i class="fa-solid fa-circle-check text-blue-600"></i>' : '<i class="fa-regular fa-building text-slate-400"></i>'}
                            <span class="${isOurCompany ? 'text-blue-900' : 'text-slate-800'}">${c.companyName}</span>
                        </div>
                    </td>
                    <td class="px-3.5 py-3 font-mono font-bold text-slate-900">
                        ${c.bidPrice ? formatCurrency(c.bidPrice, c.currency || tender.currency) : 'N/A'}
                    </td>
                    <td class="px-3.5 py-3 ${varianceClass}">
                        ${varianceDisplay}
                    </td>
                    <td class="px-3.5 py-3">
                        ${c.technicalScore ? `<span class="font-bold text-slate-800">${c.technicalScore}</span>/100` : '--'}
                    </td>
                    <td class="px-3.5 py-3 text-slate-600 max-w-xs truncate" title="${c.solutionOffered || ''}">
                        ${c.solutionOffered || '--'}
                    </td>
                    <td class="px-3.5 py-3">
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            (c.rankStatus || '').includes('L1') ? 'bg-emerald-100 text-emerald-800' :
                            (c.rankStatus || '').includes('Disqualified') ? 'bg-rose-100 text-rose-800' :
                            'bg-slate-100 text-slate-700'
                        }">
                            ${c.rankStatus || 'Under Review'}
                        </span>
                    </td>
                    <td class="px-3.5 py-3 text-slate-500 text-[11px] max-w-xs truncate" title="${c.remarks || ''}">
                        ${c.remarks || '--'}
                    </td>
                    <td class="px-3.5 py-3 text-right">
                        <div class="inline-flex items-center gap-1">
                            <button class="p-1 text-slate-400 hover:text-blue-600 btn-edit-comp" data-compid="${c.id}" title="Edit Reading">
                                <i class="fa-solid fa-pen"></i>
                            </button>
                            <button class="p-1 text-slate-400 hover:text-rose-600 btn-delete-comp" data-compid="${c.id}" title="Delete Reading">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        renderCompetitorChart(tender);
    }

    function renderCompetitorChart(tender) {
        const competitors = tender.participatedCompanies || [];
        const ctx = document.getElementById('chart-competitors');
        if (!ctx) return;

        if (competitorChartInstance) {
            competitorChartInstance.destroy();
            competitorChartInstance = null;
        }

        if (competitors.length === 0) return;

        const labels = competitors.map(c => c.companyName);
        const data = competitors.map(c => c.bidPrice || 0);
        const backgroundColors = competitors.map(c => 
            (c.companyName || '').toLowerCase().includes('our company') ? 'rgba(37, 99, 235, 0.85)' : 'rgba(148, 163, 184, 0.65)'
        );
        const borderColors = competitors.map(c => 
            (c.companyName || '').toLowerCase().includes('our company') ? 'rgb(29, 78, 216)' : 'rgb(100, 116, 139)'
        );

        competitorChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: `Bid Price (${tender.currency || 'USD'})`,
                    data: data,
                    backgroundColor: backgroundColors,
                    borderColor: borderColors,
                    borderWidth: 1.5,
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `Bid Amount: ${tender.currency || 'USD'} ${Number(context.raw).toLocaleString()}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return (value / 1000).toLocaleString() + 'k';
                            }
                        }
                    }
                }
            }
        });
    }

    function openCompetitorForm(compId = null) {
        elements.competitorForm.reset();
        elements.compEditId.value = '';

        if (!selectedTenderId) return;
        const tender = window.storageManager.getTenderById(selectedTenderId);
        if (!tender) return;

        if (compId) {
            const comp = (tender.participatedCompanies || []).find(c => c.id === compId);
            if (comp) {
                elements.compModalTitle.textContent = 'Edit Participated Company Reading';
                elements.compEditId.value = comp.id;
                elements.compName.value = comp.companyName || '';
                elements.compPrice.value = comp.bidPrice || '';
                elements.compTechScore.value = comp.technicalScore || '';
                elements.compRank.value = comp.rankStatus || 'L2';
                elements.compSolution.value = comp.solutionOffered || '';
                elements.compRemarks.value = comp.remarks || '';
            }
        } else {
            elements.compModalTitle.textContent = 'Record Participated Company Reading';
        }

        elements.modalCompetitorForm.classList.remove('hidden');
    }

    function closeCompetitorForm() {
        elements.modalCompetitorForm.classList.add('hidden');
    }

    elements.competitorForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!selectedTenderId) return;

        const tender = window.storageManager.getTenderById(selectedTenderId);
        if (!tender) return;

        if (!tender.participatedCompanies) tender.participatedCompanies = [];

        const compId = elements.compEditId.value;
        const bidPrice = parseFloat(elements.compPrice.value);
        const ourPrice = tender.ourBidAmount || bidPrice;
        
        let variancePercent = 0;
        if (ourPrice && ourPrice > 0) {
            variancePercent = Number((((bidPrice - ourPrice) / ourPrice) * 100).toFixed(2));
        }

        const compData = {
            id: compId || ('comp-' + Date.now()),
            companyName: elements.compName.value.trim(),
            bidPrice: bidPrice,
            currency: tender.currency || 'USD',
            technicalScore: elements.compTechScore.value ? parseFloat(elements.compTechScore.value) : null,
            rankStatus: elements.compRank.value,
            solutionOffered: elements.compSolution.value.trim(),
            variancePercent: variancePercent,
            remarks: elements.compRemarks.value.trim()
        };

        const existingIdx = tender.participatedCompanies.findIndex(c => c.id === compId);
        if (existingIdx >= 0) {
            tender.participatedCompanies[existingIdx] = compData;
        } else {
            tender.participatedCompanies.push(compData);
        }

        // Sort by bid price ascending (lowest first)
        tender.participatedCompanies.sort((a, b) => (a.bidPrice || 0) - (b.bidPrice || 0));

        window.storageManager.saveTender(tender);
        closeCompetitorForm();
        renderDossierCompetitors(tender);
        renderTenders();
        showToast('Participated company reading saved successfully!');
    });

    // --- Compliance Checklist Management ---
    function renderDossierChecklist(tender) {
        const checklist = tender.checklist || [];
        const completed = checklist.filter(c => c.checked).length;
        const total = checklist.length;
        const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

        elements.checklistProgressText.textContent = `${completed} / ${total} Completed (${percent}%)`;
        elements.checklistProgressBar.style.width = `${percent}%`;

        if (checklist.length === 0) {
            elements.checklistItemsContainer.innerHTML = `
                <p class="text-slate-400 py-6 text-center">No checklist items yet. Add mandatory RFP submission items above or sync from document analysis.</p>
            `;
            return;
        }

        elements.checklistItemsContainer.innerHTML = checklist.map(item => `
            <div class="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100/70 rounded-xl border border-slate-200 transition">
                <label class="flex items-center gap-3 cursor-pointer flex-1">
                    <input type="checkbox" class="chk-item-toggle w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500" data-id="${item.id}" ${item.checked ? 'checked' : ''}>
                    <span class="text-xs font-medium ${item.checked ? 'line-through text-slate-400' : 'text-slate-800'}">${item.text}</span>
                </label>
                <button class="p-1 text-slate-400 hover:text-rose-600 btn-delete-check-item" data-id="${item.id}" title="Remove Item">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
        `).join('');
    }

    elements.btnAddCheckItem.addEventListener('click', () => {
        const text = elements.inputNewCheckItem.value.trim();
        if (!text || !selectedTenderId) return;

        const tender = window.storageManager.getTenderById(selectedTenderId);
        if (!tender) return;

        if (!tender.checklist) tender.checklist = [];
        tender.checklist.push({
            id: 'chk-' + Date.now(),
            text: text,
            checked: false
        });

        window.storageManager.saveTender(tender);
        elements.inputNewCheckItem.value = '';
        renderDossierChecklist(tender);
        showToast('Checklist item added!');
    });

    // Delegated click for checklist toggles and deletes
    elements.checklistItemsContainer.addEventListener('change', (e) => {
        if (e.target.classList.contains('chk-item-toggle') && selectedTenderId) {
            const chkId = e.target.getAttribute('data-id');
            const tender = window.storageManager.getTenderById(selectedTenderId);
            if (!tender || !tender.checklist) return;

            const item = tender.checklist.find(c => c.id === chkId);
            if (item) {
                item.checked = e.target.checked;
                window.storageManager.saveTender(tender);
                renderDossierChecklist(tender);
            }
        }
    });

    elements.checklistItemsContainer.addEventListener('click', (e) => {
        const delBtn = e.target.closest('.btn-delete-check-item');
        if (delBtn && selectedTenderId) {
            const chkId = delBtn.getAttribute('data-id');
            const tender = window.storageManager.getTenderById(selectedTenderId);
            if (!tender || !tender.checklist) return;

            tender.checklist = tender.checklist.filter(c => c.id !== chkId);
            window.storageManager.saveTender(tender);
            renderDossierChecklist(tender);
        }
    });

    // --- Global Document & Competitor Action Delegations ---
    document.addEventListener('click', async (e) => {
        // Open Dossier
        const openDossierBtn = e.target.closest('.btn-open-dossier');
        if (openDossierBtn) {
            const id = openDossierBtn.getAttribute('data-id');
            openTenderDossier(id);
            return;
        }

        // Edit Tender
        const editTenderBtn = e.target.closest('.btn-edit-tender');
        if (editTenderBtn) {
            const id = editTenderBtn.getAttribute('data-id');
            openTenderForm(id);
            return;
        }

        // Delete Tender
        const deleteTenderBtn = e.target.closest('.btn-delete-tender');
        if (deleteTenderBtn) {
            const id = deleteTenderBtn.getAttribute('data-id');
            if (confirm('Are you sure you want to delete this tender and all attached documents?')) {
                window.storageManager.deleteTender(id);
                renderTenders();
                showToast('Tender removed successfully');
            }
            return;
        }

        // Export Single Tender Excel
        const exportTenderBtn = e.target.closest('.btn-export-tender-excel');
        if (exportTenderBtn) {
            const id = exportTenderBtn.getAttribute('data-id');
            const tender = window.storageManager.getTenderById(id);
            if (tender) {
                window.excelExporter.exportSingleTenderToExcel(tender);
                showToast(`Downloaded Excel dossier for "${tender.procurementId}"`);
            }
            return;
        }

        // Analyze specific document
        const analyzeDocBtn = e.target.closest('.btn-analyze-doc');
        if (analyzeDocBtn && selectedTenderId) {
            const docId = analyzeDocBtn.getAttribute('data-docid');
            const tender = window.storageManager.getTenderById(selectedTenderId);
            if (!tender) return;

            const doc = (tender.documents || []).find(d => d.id === docId);
            if (doc) {
                showToast(`Analyzing ${doc.name}...`);
                const fileRecord = await window.storageManager.getDocumentFile(docId);
                if (fileRecord && fileRecord.file) {
                    try {
                        const text = await window.documentAnalyzer.extractText(fileRecord.file);
                        const analysis = window.documentAnalyzer.analyzeTenderDocument(text, doc.name);
                        doc.status = 'Analyzed';
                        doc.analysisResults = analysis;
                        window.storageManager.saveTender(tender);
                        displayAnalysisCard(doc.name, analysis);
                        renderDossierDocuments(tender);
                        showToast(`Analysis complete for ${doc.name}!`);
                    } catch (err) {
                        alert(`Analysis error: ${err.message}`);
                    }
                } else if (doc.analysisResults) {
                    displayAnalysisCard(doc.name, doc.analysisResults);
                } else {
                    alert('Original document file data not found in cache.');
                }
            }
            return;
        }

        // Download attached document
        const downloadDocBtn = e.target.closest('.btn-download-doc');
        if (downloadDocBtn) {
            const docId = downloadDocBtn.getAttribute('data-docid');
            const fileRecord = await window.storageManager.getDocumentFile(docId);
            if (fileRecord && fileRecord.file) {
                const url = URL.createObjectURL(fileRecord.file);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileRecord.name;
                a.click();
                URL.revokeObjectURL(url);
            } else {
                alert('Document file binary not found in local browser storage.');
            }
            return;
        }

        // Delete attached document
        const deleteDocBtn = e.target.closest('.btn-delete-doc');
        if (deleteDocBtn && selectedTenderId) {
            const docId = deleteDocBtn.getAttribute('data-docid');
            if (confirm('Delete this attached document?')) {
                const tender = window.storageManager.getTenderById(selectedTenderId);
                if (tender) {
                    tender.documents = (tender.documents || []).filter(d => d.id !== docId);
                    window.storageManager.deleteDocumentFile(docId);
                    window.storageManager.saveTender(tender);
                    renderDossierDocuments(tender);
                    renderTenders();
                    showToast('Document deleted');
                }
            }
            return;
        }

        // Edit Competitor
        const editCompBtn = e.target.closest('.btn-edit-comp');
        if (editCompBtn) {
            const compId = editCompBtn.getAttribute('data-compid');
            openCompetitorForm(compId);
            return;
        }

        // Delete Competitor
        const deleteCompBtn = e.target.closest('.btn-delete-comp');
        if (deleteCompBtn && selectedTenderId) {
            const compId = deleteCompBtn.getAttribute('data-compid');
            if (confirm('Delete this participated company reading?')) {
                const tender = window.storageManager.getTenderById(selectedTenderId);
                if (tender) {
                    tender.participatedCompanies = (tender.participatedCompanies || []).filter(c => c.id !== compId);
                    window.storageManager.saveTender(tender);
                    renderDossierCompetitors(tender);
                    renderTenders();
                    showToast('Competitor reading deleted');
                }
            }
            return;
        }
    });

    // --- Top Actions & Buttons ---
    elements.btnNewTender.addEventListener('click', () => openTenderForm());
    elements.btnEmptyCreate.addEventListener('click', () => openTenderForm());
    elements.btnCloseFormModal.addEventListener('click', closeTenderForm);
    elements.btnCancelForm.addEventListener('click', closeTenderForm);
    elements.modalFormOverlay.addEventListener('click', closeTenderForm);

    elements.btnCloseDossier.addEventListener('click', closeTenderDossier);
    elements.modalDossierOverlay.addEventListener('click', closeTenderDossier);

    // Export All to Excel
    elements.btnExportExcelAll.addEventListener('click', () => {
        const tenders = window.storageManager.getTenders();
        if (tenders.length === 0) {
            alert('No tenders available to export.');
            return;
        }
        window.excelExporter.exportAllTendersToExcel(tenders);
        showToast('Exported all tenders to Excel (.xlsx)!');
    });

    // Export Single Tender from Dossier
    elements.btnDossierExportExcel.addEventListener('click', () => {
        if (!selectedTenderId) return;
        const tender = window.storageManager.getTenderById(selectedTenderId);
        if (tender) {
            window.excelExporter.exportSingleTenderToExcel(tender);
            showToast(`Exported "${tender.procurementId}" dossier to Excel!`);
        }
    });

    // Copy All for Google Sheets
    elements.btnCopyGSheetAll.addEventListener('click', async () => {
        const tenders = window.storageManager.getTenders();
        if (tenders.length === 0) {
            alert('No tenders available to copy.');
            return;
        }
        const copied = await window.excelExporter.copyTendersForGoogleSheets(tenders);
        if (copied) {
            showToast('Copied all tenders! Press Ctrl+V inside Google Sheets (sheets.new) to paste cleanly into columns.');
        } else {
            alert('Unable to access clipboard.');
        }
    });

    // Copy Readings for Google Sheets
    elements.btnCopyReadingsGsheet.addEventListener('click', async () => {
        if (!selectedTenderId) return;
        const tender = window.storageManager.getTenderById(selectedTenderId);
        if (!tender) return;

        const copied = await window.excelExporter.copyReadingsForGoogleSheets(tender);
        if (copied) {
            showToast('Copied competitor readings! Press Ctrl+V in Google Sheets to paste.');
        } else {
            alert('Unable to copy readings to clipboard.');
        }
    });

    // Competitor Form Modal controls
    elements.btnAddCompetitor.addEventListener('click', () => openCompetitorForm());
    elements.btnCloseCompModal.addEventListener('click', closeCompetitorForm);
    elements.btnCancelComp.addEventListener('click', closeCompetitorForm);
    elements.modalCompOverlay.addEventListener('click', closeCompetitorForm);

    // Edit Solution Button
    elements.btnEditSolution.addEventListener('click', () => {
        if (!selectedTenderId) return;
        openTenderForm(selectedTenderId);
    });

    // View Toggles
    elements.viewToggleGrid.addEventListener('click', () => {
        activeViewMode = 'grid';
        elements.viewToggleGrid.classList.add('bg-white', 'text-blue-600', 'shadow-xs');
        elements.viewToggleGrid.classList.remove('text-slate-600');
        elements.viewToggleTable.classList.remove('bg-white', 'text-blue-600', 'shadow-xs');
        elements.viewToggleTable.classList.add('text-slate-400');
        renderTenders();
    });

    elements.viewToggleTable.addEventListener('click', () => {
        activeViewMode = 'table';
        elements.viewToggleTable.classList.add('bg-white', 'text-blue-600', 'shadow-xs');
        elements.viewToggleTable.classList.remove('text-slate-400');
        elements.viewToggleGrid.classList.remove('bg-white', 'text-blue-600', 'shadow-xs');
        elements.viewToggleGrid.classList.add('text-slate-600');
        renderTenders();
    });

    // Search & Filters input listeners
    elements.inputSearch.addEventListener('input', renderTenders);
    elements.selectFilterStatus.addEventListener('change', renderTenders);
    elements.selectFilterJv.addEventListener('change', renderTenders);

    // Settings / Backup Menu
    elements.btnSettingsToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        elements.settingsMenu.classList.toggle('hidden');
    });

    document.addEventListener('click', (e) => {
        if (!elements.settingsMenu.contains(e.target) && e.target !== elements.btnSettingsToggle) {
            elements.settingsMenu.classList.add('hidden');
        }
    });

    elements.btnBackupJson.addEventListener('click', () => {
        window.storageManager.exportBackup();
        elements.settingsMenu.classList.add('hidden');
        showToast('Downloaded full backup file (JSON)!');
    });

    elements.inputRestoreFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const res = window.storageManager.importBackup(event.target.result);
            if (res.success) {
                renderTenders();
                showToast(`Restored ${res.count} tenders from backup!`);
            } else {
                alert(`Backup restore failed: ${res.error}`);
            }
        };
        reader.readAsText(file);
        elements.inputRestoreFile.value = '';
        elements.settingsMenu.classList.add('hidden');
    });

    elements.btnResetSample.addEventListener('click', () => {
        if (confirm('Reset tenders back to standard sample data?')) {
            window.storageManager.saveTenders(SAMPLE_TENDERS);
            renderTenders();
            elements.settingsMenu.classList.add('hidden');
            showToast('Reset to sample tenders!');
        }
    });

    // Initial render
    renderTenders();
});
