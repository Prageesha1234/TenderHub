/**
 * sample-data.js
 * Preloaded realistic tender examples to demonstrate the platform immediately.
 */

const SAMPLE_TENDERS = [
    {
        id: "TND-2026-001",
        procurementTitle: "Turnkey Implementation of National Cloud Infrastructure and Multi-Agency e-Services Gateway",
        procurementId: "ICTA/GOSL/2026/RFP/088",
        procurementEntity: "Ministry of Digital Infrastructure & ICTA",
        publishDate: "2026-01-15",
        submissionDate: "2026-03-18T14:00",
        isJV: "Yes",
        jvPartnerDetails: "Consortium with TechCloud International Pte Ltd (We hold 60% lead, Partner holds 40%)",
        solution: "High Availability Hyper-Converged Cloud Platform (Nutanix/VMware) with SDN, automated disaster recovery site replication, and 24x7 Tier-3 Managed Support Operations.",
        accountManager: "Nuwan Perera",
        remarks: "Pre-bid meeting completed on Feb 2. Addendum 1 received clarifying server warranty requirement. Financial model approved by leadership; bid bond in progress with Bank of Ceylon.",
        status: "Submitted",
        estimatedValue: 4200000,
        currency: "USD",
        ourBidAmount: 3850000,
        category: "Cloud & Infrastructure",
        solutionDetails: {
            summary: "End-to-end turnkey private cloud with multi-tenant sovereign security, multi-agency API gateway, and 99.98% SLA.",
            architecture: "Dual-site active-passive HCI cluster with 2,000 vCPU, 16TB RAM, 500TB NVMe storage, Cisco ACI fabric, Palo Alto NGFWs.",
            oemPartners: "Nutanix, Cisco Systems, Palo Alto Networks, Veeam Backup",
            deliveryTimeline: "6 Months Implementation + 36 Months 24x7 Platinum Support",
            keyDifferentiators: "Local 24/7 Level-3 certified engineers, proven tier-3 data center migration experience, zero downtime replication guarantee."
        },
        documents: [
            {
                id: "doc-001-rfp",
                name: "ICTA_RFP_088_National_Cloud_Gateway.pdf",
                category: "RFP / Tender Notice",
                size: "2.4 MB",
                uploadedAt: "2026-01-16T10:30:00Z",
                status: "Analyzed",
                analysisResults: {
                    extractedDeadlines: ["Submission: 18th March 2026 at 14:00 hrs", "Clarifications: 10th February 2026", "Bid Validity: 120 calendar days"],
                    bidSecurity: "USD 45,000 Bank Guarantee valid for 148 days",
                    eligibilityCriteria: [
                        "Minimum Average Annual Turnover: USD 5,000,000 in last 3 years",
                        "At least 2 turnkey enterprise cloud projects in last 5 years",
                        "ISO 9001 and ISO/IEC 27001 certifications mandatory",
                        "Original Manufacturer Authorization Form (MAF) required"
                    ],
                    liquidatedDamages: "0.5% of contract price per week of delay (Max 10% ceiling)",
                    riskLevel: "Low to Moderate",
                    keyKeywords: ["Cloud Infrastructure", "HCI", "DR Site", "SDN", "SLA 99.98%", "Turnover USD 5M"]
                }
            },
            {
                id: "doc-001-boq",
                name: "BoQ_Financial_Proposal_Breakdown_v2.xlsx",
                category: "BoQ / Pricing Sheet",
                size: "840 KB",
                uploadedAt: "2026-02-20T15:15:00Z",
                status: "Ready"
            },
            {
                id: "doc-001-bank-guarantee",
                name: "Bank_Guarantee_Bid_Bond_BOC.pdf",
                category: "Bid Bond / Security",
                size: "420 KB",
                uploadedAt: "2026-03-01T11:00:00Z",
                status: "Verified"
            }
        ],
        checklist: [
            { id: "chk-1", text: "Signed Bid Submission Form & Priced BoQ", checked: true },
            { id: "chk-2", text: "Original Bank Guarantee (Bid Security USD 45,000)", checked: true },
            { id: "chk-3", text: "Audited Financials (2023, 2024, 2025)", checked: true },
            { id: "chk-4", text: "Original Manufacturer Authorization Letters (MAFs)", checked: true },
            { id: "chk-5", text: "Notarized Joint Venture Consortium Agreement", checked: true },
            { id: "chk-6", text: "ISO 9001 & ISO 27001 Certifications", checked: true },
            { id: "chk-7", text: "Client References (Minimum 2 Enterprise Cloud Deployments)", checked: true }
        ],
        participatedCompanies: [
            {
                id: "comp-1",
                companyName: "Our Company (Lead) & TechCloud JV",
                bidPrice: 3850000,
                currency: "USD",
                technicalScore: 94.5,
                solutionOffered: "Nutanix Enterprise Cloud + Cisco ACI + Palo Alto",
                rankStatus: "L1 (Lowest Compliant)",
                variancePercent: 0,
                remarks: "Our bid: Lowest evaluated responsive bid with highest technical benchmark score."
            },
            {
                id: "comp-2",
                companyName: "Global Telecom & Systems PLC",
                bidPrice: 4120000,
                currency: "USD",
                technicalScore: 88.0,
                solutionOffered: "Huawei Cloud Stack + FusionServer + CloudEngine",
                rankStatus: "L2",
                variancePercent: 7.01,
                remarks: "Second lowest. High hardware footprint, requires additional proprietary software licenses."
            },
            {
                id: "comp-3",
                companyName: "Apex Enterprise Solutions Inc.",
                bidPrice: 4450000,
                currency: "USD",
                technicalScore: 91.2,
                solutionOffered: "Dell VxRail + VMware Cloud Foundation",
                rankStatus: "L3",
                variancePercent: 15.58,
                remarks: "Technically sound proposal but 15.5% higher pricing than our consortium."
            },
            {
                id: "comp-4",
                companyName: "CyberCore Technologies Ltd",
                bidPrice: 3600000,
                currency: "USD",
                technicalScore: 62.0,
                solutionOffered: "Custom Whitebox Servers + OpenStack",
                rankStatus: "Disqualified",
                variancePercent: -6.49,
                remarks: "Disqualified during technical evaluation: Did not meet ISO 27001 mandatory prerequisite and lacked OEM MAF."
            }
        ]
    },
    {
        id: "TND-2026-002",
        procurementTitle: "Supply, Installation & Maintenance of Smart Grid Automated Metering Infrastructure (AMI)",
        procurementId: "CEB/TR/2026/042",
        procurementEntity: "Ceylon Electricity Board (CEB)",
        publishDate: "2026-02-01",
        submissionDate: "2026-04-10T11:00",
        isJV: "No",
        jvPartnerDetails: "Single Bidder Entity",
        solution: "Cellular NB-IoT Smart Meters with Head-End System (HES) and Meter Data Management System (MDMS) integration into SAP ERP.",
        accountManager: "Sarah Fernando",
        remarks: "Clarification request submitted regarding cybersecurity standards for cellular SIM cards. Sample meter bench testing scheduled next week with CEB technical committee.",
        status: "In Progress",
        estimatedValue: 12500000,
        currency: "USD",
        ourBidAmount: 11800000,
        category: "Smart Energy / IoT",
        solutionDetails: {
            summary: "Comprehensive AMI solution deploying 150,000 smart three-phase and single-phase meters with real-time tamper alerts.",
            architecture: "Hybrid NB-IoT / RF Mesh communications, Cloud-hosted Head-End System, CIM-compliant enterprise service bus.",
            oemPartners: "Schneider Electric, Landis+Gyr, CyanConnode",
            deliveryTimeline: "12 Months Phased Rollout + 5 Years Warranty",
            keyDifferentiators: "Plug-and-play meter installation, automatic outage detection, dynamic tariff rate switching."
        },
        documents: [
            {
                id: "doc-002-rfp",
                name: "CEB_TR_2026_042_Smart_Metering_Bidding_Doc.pdf",
                category: "RFP / Tender Notice",
                size: "4.1 MB",
                uploadedAt: "2026-02-03T09:00:00Z",
                status: "Analyzed",
                analysisResults: {
                    extractedDeadlines: ["Submission: 10th April 2026 at 11:00 hrs", "Pre-bid: 18th February 2026"],
                    bidSecurity: "USD 120,000 valid for 180 days",
                    eligibilityCriteria: [
                        "Meter manufacturer must have supplied at least 500,000 smart meters globally",
                        "DLMS/COSEM certification mandatory",
                        "Annual revenue exceeding USD 15M"
                    ],
                    liquidatedDamages: "1.0% per week (Max 10%)",
                    riskLevel: "Moderate",
                    keyKeywords: ["Smart Meter", "NB-IoT", "MDMS", "DLMS/COSEM", "CEB", "Tamper Detection"]
                }
            }
        ],
        checklist: [
            { id: "chk-201", text: "Meter Type Test Certificates (KEMA / CPRI)", checked: true },
            { id: "chk-202", text: "DLMS/COSEM Protocol Compliance Certificate", checked: true },
            { id: "chk-203", text: "Bid Security Bank Guarantee USD 120,000", checked: false },
            { id: "chk-204", text: "Sample Smart Meters for Laboratory Testing", checked: true },
            { id: "chk-205", text: "OEM Authorization & Letter of Guarantee", checked: false }
        ],
        participatedCompanies: [
            {
                id: "comp-201",
                companyName: "Our Company (Solo Bidder)",
                bidPrice: 11800000,
                currency: "USD",
                technicalScore: 92.0,
                solutionOffered: "Schneider Electric Meters + CyanConnode RF Mesh",
                rankStatus: "Under Review",
                variancePercent: 0,
                remarks: "Target bid pricing based on competitive volume discount from OEM."
            },
            {
                id: "comp-202",
                companyName: "Siemens Energy Consortium",
                bidPrice: 12900000,
                currency: "USD",
                technicalScore: 95.0,
                solutionOffered: "Siemens EnergyIP MDMS + Aclara Meters",
                rankStatus: "Under Review",
                variancePercent: 9.32,
                remarks: "High-end European solution, premium pricing."
            },
            {
                id: "comp-203",
                companyName: "Hexing Electrical Co Ltd",
                bidPrice: 10500000,
                currency: "USD",
                technicalScore: 84.0,
                solutionOffered: "Hexing In-house MDMS + GPRS Meters",
                rankStatus: "Under Review",
                variancePercent: -11.02,
                remarks: "Aggressive low pricing, but software compliance to CEB specifications under query."
            }
        ]
    },
    {
        id: "TND-2026-003",
        procurementTitle: "Design and Deployment of Hospital Information Management System (HIMS)",
        procurementId: "MOH/PROC/2026/015",
        procurementEntity: "Ministry of Health",
        publishDate: "2026-02-15",
        submissionDate: "2026-04-28T10:00",
        isJV: "Yes",
        jvPartnerDetails: "JV with MedTech Healthcare Systems (India) - 50:50 revenue split",
        solution: "HL7/FHIR compliant Hospital Information System covering OPD, IPD, Pharmacy, Radiology (PACS), Electronic Medical Records (EMR), and Billing.",
        accountManager: "Kasun Jayasuriya",
        remarks: "Internal tender qualification passed. Solution architecture draft underway. Clarification letter sent regarding integration with existing national e-health health ID system.",
        status: "Draft",
        estimatedValue: 2800000,
        currency: "USD",
        ourBidAmount: 2650000,
        category: "Healthcare IT",
        solutionDetails: {
            summary: "Comprehensive open-standards electronic medical records system connecting 12 base hospitals with centralized patient index.",
            architecture: "Microservices architecture on Kubernetes, PostgreSQL database, HL7 FHIR API interface.",
            oemPartners: "MedTech HIS Suite, Red Hat OpenShift, Dell EMC Storage",
            deliveryTimeline: "9 Months Implementation + 24 Months Maintenance",
            keyDifferentiators: "Proven deployment in 50+ public hospitals across South Asia, clinician-friendly mobile UI."
        },
        documents: [],
        checklist: [
            { id: "chk-301", text: "Company Registration & Tax Clearance", checked: true },
            { id: "chk-302", text: "HL7 FHIR Conformance Certification", checked: false },
            { id: "chk-303", text: "Bid Bond $30,000", checked: false }
        ],
        participatedCompanies: []
    }
];

// Pre-populate if storage is empty
function checkAndSeedSampleData() {
    const existing = window.storageManager.getTenders();
    if (!existing || existing.length === 0) {
        window.storageManager.saveTenders(SAMPLE_TENDERS);
        console.log('Seeded sample tenders into storageManager');
    }
}
