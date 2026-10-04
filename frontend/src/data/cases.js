export const DEMO_CASES = {
  case1: {
    id: "case1",
    title: "Case 1: Damaged Parcel",
    domain: "E-Commerce & Logistics",
    docketSerial: "PASS-2026-DS904",
    user: {
      name: "Mira Sen",
      email: "mira.sen@example.com",
      phone: "+91 98201 44812",
      address: "Flat 4B, Gulmohar Enclave, Pune 411007"
    },
    narrative: "I ordered a 16-piece ceramic dinner set from Sahyadri Home Goods (order SHG-20418) for ₹4,299. It arrived yesterday evening via SwiftRoute Logistics (AWB: SR-882190). When I unpacked the outer cardboard box, the top corner was completely crushed and four of the main dinner plates were shattered into pieces. I need a free replacement or full refund.",
    rawAmount: "₹4,299",
    evidenceList: [
      {
        id: "ev-1",
        name: "Invoice_SHG-20418.pdf",
        type: "invoice",
        category: "Financial & Order Proof",
        size: "142 KB",
        tag: "Order & Payment Proof",
        preview: "Sahyadri Home Goods • Order #SHG-20418 • Paid ₹4,299 via UPI",
        icon: "receipt_long"
      },
      {
        id: "ev-2",
        name: "Crushed_Box_Exterior.jpg",
        type: "photo",
        category: "Damage Verification",
        size: "1.8 MB",
        tag: "Transit Damage",
        preview: "Outer box crushed corner with courier label visible",
        icon: "image"
      },
      {
        id: "ev-3",
        name: "Broken_Plates_Detail.jpg",
        type: "photo",
        category: "Product Condition",
        size: "2.1 MB",
        tag: "Damaged Goods",
        preview: "Four shattered porcelain dinner plates inside inner carton",
        icon: "broken_image"
      },
      {
        id: "ev-4",
        name: "Delivery_SMS_SwiftRoute.png",
        type: "sms",
        category: "Delivery Timestamp",
        size: "94 KB",
        tag: "Timestamp Log",
        preview: "Delivered 03 Oct 2026 18:42 IST by agent Suresh",
        icon: "sms"
      }
    ],
    organizations: [
      {
        slug: "shopmart",
        name: "Sahyadri Home Goods",
        category: "Seller / Merchant",
        role: "seller",
        domain: "e-commerce",
        ticketType: "merchant.replacement_request.v2",
        status: "acknowledged",
        ticketRef: "SHG-CLM-8821",
        channel: "Sandbox REST API (v2)",
        sla: "24h Response • 72h Resolution",
        requires: ["Order ID (SHG-20418)", "Item SKU", "Resolution Choice", "Product Damage Photos"],
        withholds: ["Courier internal route logs", "Bank account full details"],
        allowedEvidence: ["ev-1", "ev-2", "ev-3"],
        rationale: "Primary counterparty for sales contract and replacement warranty fulfillment."
      },
      {
        slug: "swiftroute",
        name: "SwiftRoute Logistics",
        category: "Logistics / Courier",
        role: "courier",
        domain: "logistics",
        ticketType: "courier.damage_inspection.v1",
        status: "visit_scheduled",
        ticketRef: "SR-INSP-4019",
        channel: "Direct Dispatch & Webhook",
        sla: "48h Field Inspection",
        dependsOn: {
          org: "shopmart",
          field: "ticketRef",
          label: "Merchant Claim Ref"
        },
        requires: ["AWB Number (SR-882190)", "Delivery Date", "Outer Packaging Photos", "Inspection Slot"],
        withholds: ["Invoice price & payment method (redacted for privacy)"],
        allowedEvidence: ["ev-2", "ev-4"],
        rationale: "Contracted carrier responsible for physical transit custody and damage inspection."
      },
      {
        slug: "cardissuer",
        name: "HDFC Card Dispute Desk",
        category: "Payment Issuer",
        role: "bank",
        domain: "finance",
        ticketType: "bank.chargeback_intimation.v1",
        status: "contingent",
        ticketRef: "CONTINGENT-CB",
        channel: "Assisted Banking Intake",
        sla: "Chargeback window: 45 days",
        requires: ["Transaction Reference", "Dispute Reason", "Merchant Initial Contact Log"],
        withholds: ["Courier inspection photos"],
        allowedEvidence: ["ev-1"],
        rationale: "Contingent safety net: drafts chargeback claim automatically if merchant defaults SLA."
      }
    ],
    drafts: {
      shopmart: {
        title: "Return & Replace Request: #SHG-20418",
        fields: {
          "Order ID": "SHG-20418",
          "Customer Name": "Mira Sen",
          "Item Description": "16-Piece Heritage Ceramic Dinner Set (Glazed Terracotta)",
          "Purchase Value": "₹4,299 (Paid via UPI)",
          "Primary Defect": "Transit impact damage; 4 plates fractured",
          "Requested Remedy": "Direct Replacement of affected units or complete set",
          "Pickup Address": "Flat 4B, Gulmohar Enclave, Pune 411007"
        },
        evidenceIncluded: ["ev-1", "ev-2", "ev-3"],
        delegationStatement: "Passage is authorized by Mira Sen to initiate this replacement petition and relay inspection reports directly."
      },
      swiftroute: {
        title: "Consignee Damage Inspection Docket: SR-882190",
        fields: {
          "Consignment AWB": "SR-882190",
          "Consignee": "Mira Sen (+91 98201 44812)",
          "Delivery Timestamp": "03 Oct 2026, 18:42 IST",
          "Package Condition": "Severe corner crush on outer double-wall corrugated carton",
          "Damage Assessment": "Impact sustained in handling/sorting; inner contents broken",
          "Shipper Claim Ref": "SHG-CLM-8821 (Auto-linked from Sahyadri)",
          "Requested Inspection Window": "Tomorrow 10:00 AM – 01:00 PM IST"
        },
        evidenceIncluded: ["ev-2", "ev-4"],
        redactions: ["Invoice price, customer bank statement, order margin data redacted"],
        delegationStatement: "Filed on behalf of Mira Sen. SwiftRoute field inspector is granted permission to inspect and photograph the parcel at consignee address."
      }
    },
    initialEvents: [
      {
        id: "evt-1",
        timestamp: "04 Oct 2026 • 11:45 IST",
        type: "docket_created",
        title: "First-Party Statement Recorded",
        desc: "Narrative compiled via Groq high-speed LPU engine. Zero external data retention.",
        hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        author: "Mira Sen (Passage Engine)"
      },
      {
        id: "evt-2",
        timestamp: "04 Oct 2026 • 11:46 IST",
        type: "org_routing",
        title: "Tripartite Resolution Architecture Structured",
        desc: "Org router matched Sahyadri Home Goods (order trigger) and SwiftRoute (AWB trigger).",
        hash: "7d1a54127b222502f5b79b5fb0803061152a44f92b37e23c65dd0f32937ec81f",
        author: "Passage Org Router v2.0"
      }
    ],
    question: {
      id: "q-1",
      orgSlug: "swiftroute",
      orgName: "SwiftRoute Logistics",
      title: "Confirm Physical Inspection Slot",
      text: "SwiftRoute field inspector #84 (Sunil Jadhav) is scheduled for your area. Please confirm when the parcel box will be available for physical inspection and photo capture.",
      options: [
        "Tomorrow (05 Oct) 10:00 AM – 01:00 PM IST",
        "Tomorrow (05 Oct) 02:00 PM – 05:00 PM IST",
        "Day After (06 Oct) 10:00 AM – 01:00 PM IST"
      ],
      relayNotice: "Your response will be relayed directly to SwiftRoute field dispatch and logged to your docket."
    },
    escalation: {
      id: "esc-1",
      triggerReason: "Sahyadri Home Goods replacement SLA threshold (48 hours) expiring without dispatch confirmation.",
      targetOrg: "National Consumer Helpline (NCH) & Card Dispute Desk",
      draftSummary: "Formal intimation of defective delivery and failed statutory return timeline under Consumer Protection (E-Commerce) Rules.",
      remedyClaim: "Immediate reverse pickup + 100% refund of ₹4,299 + ₹500 transit inconvenience indemnity.",
      statute: "Consumer Protection Act 2019, Section 35(1)"
    },
    resolvedOutcome: {
      summary: "Full replacement dinner set dispatched + damaged units cleared without mandatory return.",
      replacementOrder: "SHG-REP-99214",
      courierClearance: "SR-INSP-APPROVED (Liability assigned to transit sorting hub)",
      retellingsAvoided: 3,
      hoursSaved: 4.2,
      organizationsCoordinated: 2,
      chainLength: 7
    }
  },

  case2: {
    id: "case2",
    title: "Case 2: Money Debited, Payment Failed",
    domain: "Finance & Digital Payments",
    docketSerial: "PASS-2026-UPI-719",
    user: {
      name: "Arjun Verma",
      email: "arjun.v@example.com",
      phone: "+91 99302 77102",
      address: "B-201, Green Glen Layout, Bellandur, Bengaluru 560103"
    },
    narrative: "I tried paying ₹6,850 to Blueleaf Supermarket using PayEasy UPI (Txn ID: PE-9912049182, RRN: 427918291041). The amount was immediately debited from my Northfield Bank savings account (A/c ending 4902), but the merchant's machine showed 'Payment Timed Out'. Merchant refused to give me groceries without a second cash payment.",
    rawAmount: "₹6,850",
    evidenceList: [
      {
        id: "ev-201",
        name: "PayEasy_Failure_Screen.png",
        type: "screenshot",
        category: "Transaction Status",
        size: "310 KB",
        tag: "UPI Txn ID: PE-9912049182",
        preview: "PayEasy app showing 'Payment Pending / Failed at Beneficiary'",
        icon: "phonelink_erase"
      },
      {
        id: "ev-202",
        name: "Bank_Debit_SMS.png",
        type: "sms",
        category: "Financial Ledger Entry",
        size: "82 KB",
        tag: "RRN: 427918291041",
        preview: "SMS: A/c 4902 debited for INR 6,850.00 on 04-Oct 09:14 IST",
        icon: "account_balance"
      },
      {
        id: "ev-203",
        name: "Merchant_Declined_Slip.jpg",
        type: "photo",
        category: "Point of Sale",
        size: "1.2 MB",
        tag: "POS Error Slip",
        preview: "POS Slip reading 'Response Code 91: Issuer Timeout'",
        icon: "receipt"
      }
    ],
    organizations: [
      {
        slug: "payeasy",
        name: "PayEasy Payments",
        category: "UPI Third Party App (TPAP)",
        role: "seller",
        domain: "fintech",
        ticketType: "tpap.dispute_ticket.v1",
        status: "acknowledged",
        ticketRef: "PE-DISP-38192",
        channel: "Direct API Webhook",
        sla: "T+1 Auto-Reversal Check",
        requires: ["UPI Txn ID", "Remitter VPA", "Timestamp", "Beneficiary VPA"],
        withholds: ["Full bank account number", "Unrelated bank account balance"],
        allowedEvidence: ["ev-201"],
        rationale: "Initiating app interface holding technical transaction trace and NPCI UDIR logs."
      },
      {
        slug: "northfield",
        name: "Northfield Bank",
        category: "Remitter Bank",
        role: "bank",
        domain: "banking",
        ticketType: "bank.reversal_complaint.v2",
        status: "in_progress",
        ticketRef: "NF-CMP-2026-904",
        channel: "Zammad REST Helpdesk",
        sla: "T+2 Statutory Reversal (RBI Turnaround)",
        dependsOn: {
          org: "payeasy",
          field: "ticketRef",
          label: "TPAP Incident ID"
        },
        requires: ["Account Last 4 (4902)", "Debit RRN (427918291041)", "Debit SMS / Statement"],
        withholds: ["Merchant private chat transcripts"],
        allowedEvidence: ["ev-201", "ev-202"],
        rationale: "Remitter bank that debited customer funds without settlement confirmation."
      }
    ],
    drafts: {
      payeasy: {
        title: "UPI UDIR Trace & Beneficiary Reconciliation",
        fields: {
          "UPI Transaction ID": "PE-9912049182",
          "RRN": "427918291041",
          "Amount Debited": "₹6,850.00",
          "Remitter VPA": "arjun.verma@oknorthfield",
          "Beneficiary VPA": "blueleafpos@icici",
          "Error Category": "Debited but Merchant Uncredited (UDIR Status: Pending)"
        },
        evidenceIncluded: ["ev-201"],
        delegationStatement: "Authorized by Arjun Verma to lodge NPCI UDIR complaint."
      },
      northfield: {
        title: "Disputed UPI Debit Reversal: RRN 427918291041",
        fields: {
          "Account Number": "••••••••4902 (Savings)",
          "Customer Name": "Arjun Verma",
          "Debit Date & Time": "04 Oct 2026, 09:14 IST",
          "RRN": "427918291041",
          "Disputed Sum": "₹6,850.00",
          "TPAP Reference": "PE-DISP-38192 (Linked from PayEasy)",
          "Applicable Directive": "RBI/2019-20/67 DPSS.CO.PD No.629 Harmonisation of TAT"
        },
        evidenceIncluded: ["ev-201", "ev-202"],
        redactions: ["Merchant POS proprietary terminal keys withheld"],
        delegationStatement: "Lodge formal bank grievance. Customer reserves right to statutory indemnity of ₹100/day if not credited within T+5."
      }
    },
    initialEvents: [
      {
        id: "evt-201",
        timestamp: "04 Oct 2026 • 09:30 IST",
        type: "docket_created",
        title: "Failed Payment Evidence Recorded",
        desc: "RRN and Txn ID extracted from SMS and screenshots with local privacy filtering.",
        hash: "18a93e3d24e52467d5e49bc6723b72381284a1e948c3b9b47e8b919d71829302",
        author: "Arjun Verma (Local Passage Engine)"
      }
    ],
    question: {
      id: "q-2",
      orgSlug: "northfield",
      orgName: "Northfield Bank Grievance Cell",
      title: "Confirm Remitter Account Identifier",
      text: "Northfield Bank automated gateway requires verification of your registered account branch to execute manual ledger credit.",
      options: [
        "Bellandur Outer Ring Road Branch (IFSC: NOFT0004128)",
        "Indiranagar 100ft Road Branch (IFSC: NOFT0001092)",
        "Koramangala 4th Block Branch (IFSC: NOFT0002104)"
      ],
      relayNotice: "Relayed to Northfield Bank Core Banking Integration. PayEasy will NOT see your IFSC or branch."
    },
    escalation: {
      id: "esc-2",
      triggerReason: "T+2 RBI statutory reversal deadline crossed without credit notification.",
      targetOrg: "Reserve Bank of India (RBI) Ombudsman (CMS Portal)",
      draftSummary: "Escalation under RBI Integrated Ombudsman Scheme 2021 for delayed UPI auto-reversal beyond mandated TAT.",
      remedyClaim: "Immediate credit of ₹6,850 + ₹200 delayed TAT statutory compensation (₹100/day per RBI circular).",
      statute: "RBI Harmonisation of Turn Around Time (TAT) and customer compensation, DPSS.CO.PD No.629/02.12.014/2019-20"
    },
    resolvedOutcome: {
      summary: "Amount ₹6,850.00 credited back to Account ••••4902 with RBI compliance reference.",
      replacementOrder: "UTR-REV-9021481024",
      courierClearance: "NPCI UDIR Deemed Settlement Reversal",
      retellingsAvoided: 2,
      hoursSaved: 3.5,
      organizationsCoordinated: 2,
      chainLength: 6
    }
  },

  case3: {
    id: "case3",
    title: "Case 3: Burst Water Main",
    domain: "Civic Infrastructure & Insurance",
    docketSerial: "PASS-2026-CIVIC-419",
    user: {
      name: "Priya Rao",
      email: "priya.rao@example.com",
      phone: "+91 97401 55901",
      address: "Cross 7, 14th Main, Malleshwaram, Bengaluru 560003"
    },
    narrative: "At 03:00 AM, a municipal water supply main burst outside my gate on 14th Main, Malleshwaram. The street was flooded up to 2.5 feet, submerging the BESCOM roadside transformer meter box and flooding my parked scooter (Honda Activa, reg KA-02-JH-4419). Engine and exhaust are flooded with mud and silt.",
    rawAmount: "₹18,500 Estimated Loss",
    evidenceList: [
      {
        id: "ev-301",
        name: "Flooded_Street_WaterMain.jpg",
        type: "photo",
        category: "Municipal Hazard",
        size: "3.4 MB",
        tag: "Geo: 13.0031° N, 77.5684° E",
        preview: "Water gushing from cracked road surface; street submerged",
        icon: "water_damage"
      },
      {
        id: "ev-302",
        name: "Submerged_Power_Meter.jpg",
        type: "photo",
        category: "Electrical Hazard",
        size: "2.8 MB",
        tag: "BESCOM Box #MB-402",
        preview: "Live roadside meter box partially submerged with visible sparks",
        icon: "electric_bolt"
      },
      {
        id: "ev-303",
        name: "Scooter_Submerged_Engine.jpg",
        type: "photo",
        category: "Vehicle Damage",
        size: "2.1 MB",
        tag: "KA-02-JH-4419",
        preview: "Honda Activa submerged past air filter & crankcase",
        icon: "two_wheeler"
      },
      {
        id: "ev-304",
        name: "Shield_Insurance_Policy.pdf",
        type: "pdf",
        category: "Comprehensive Cover",
        size: "412 KB",
        tag: "Policy #SHD-MOT-992140",
        preview: "Active 2-Wheeler Comprehensive Policy with Flood/Inundation Add-on",
        icon: "policy"
      }
    ],
    organizations: [
      {
        slug: "open311",
        name: "City Water & Sewerage Board (BWSSB)",
        category: "Municipal Public Works",
        role: "seller",
        domain: "civic",
        ticketType: "open311.georeport.v2",
        status: "acknowledged",
        ticketRef: "BWSSB-311-90412",
        channel: "Open311 GeoReport v2 REST",
        sla: "4h Emergency Response",
        requires: ["Service Code (WATER_MAIN_BURST)", "Latitude/Longitude", "Location Description", "Media URLs"],
        withholds: ["Private insurance policy number"],
        allowedEvidence: ["ev-301"],
        rationale: "Statutory municipal authority operating underground water mains."
      },
      {
        slug: "powerutility",
        name: "State Electricity Distribution (BESCOM)",
        category: "Power Utility",
        role: "courier",
        domain: "utility",
        ticketType: "utility.safety_hazard.v1",
        status: "acknowledged",
        ticketRef: "BES-HAZ-29104",
        channel: "Emergency Safety Webhook",
        sla: "1h Immediate Power Isolation",
        requires: ["Transformer Box ID", "Water Submersion Level", "Immediate Danger Flag (YES)"],
        withholds: ["Vehicle claim paperwork"],
        allowedEvidence: ["ev-301", "ev-302"],
        rationale: "Grid authority required to de-energize submerged electrical equipment."
      },
      {
        slug: "shieldmotor",
        name: "Shield Motor Insurance",
        category: "Motor Insurer",
        role: "bank",
        domain: "insurance",
        ticketType: "insurance.flood_claim.v3",
        status: "in_progress",
        ticketRef: "SHD-CLM-77192",
        channel: "Structured Email & PDF Claim Form (Mailpit)",
        sla: "48h Surveyor Deputation",
        dependsOn: {
          org: "open311",
          field: "ticketRef",
          label: "Municipal Incident Docket"
        },
        requires: ["Policy #", "Vehicle Reg", "Cause of Loss (Municipal Failure)", "Third-Party Police/Civic Ref"],
        withholds: ["Power grid technical breaker telemetry"],
        allowedEvidence: ["ev-301", "ev-303", "ev-304"],
        rationale: "Insurer providing comprehensive flood loss coverage backed by civic incident proof."
      }
    ],
    drafts: {
      open311: {
        title: "Open311 GeoReport v2: Water Main Rupture",
        fields: {
          "Service Code": "INFRA-WATER-BURST-01",
          "Location": "Opposite Gate #14, 7th Cross, Malleshwaram",
          "Coordinates": "13.0031° N, 77.5684° E",
          "Urgency": "High (Flooding residential road & electrical installations)",
          "Reporter": "Priya Rao (+91 97401 55901)"
        },
        evidenceIncluded: ["ev-301"],
        delegationStatement: "Filed via Passage Open311 Civic Adapter."
      },
      powerutility: {
        title: "Emergency Hazard Dispatch: Submerged Meter Box",
        fields: {
          "Installation ID": "BESCOM Meter Unit #MB-402",
          "Submersion Level": "Approx. 2.5 feet standing water",
          "Immediate Hazard": "High Voltage Arc / Electrocution Risk to Public",
          "Site Contact": "Priya Rao (+91 97401 55901)"
        },
        evidenceIncluded: ["ev-301", "ev-302"],
        delegationStatement: "Immediate hazard reporting on behalf of resident."
      },
      shieldmotor: {
        title: "Motor Claim Intimation: Hydrostatic Lock & Inundation",
        fields: {
          "Policy Number": "SHD-MOT-992140",
          "Vehicle Registration": "KA-02-JH-4419 (Honda Activa 6G)",
          "Incident Date/Time": "04 Oct 2026, 03:00 AM IST",
          "Third-Party Authority Docket": "BWSSB-311-90412 (Auto-attached from Open311)",
          "Damage Summary": "Engine submerged, silencer water ingress, electrical harness soaked",
          "Survey Location": "Residence: 7th Cross, Malleshwaram"
        },
        evidenceIncluded: ["ev-301", "ev-303", "ev-304"],
        delegationStatement: "Passage authorized to file claim and attach municipal incident verification."
      }
    },
    initialEvents: [
      {
        id: "evt-301",
        timestamp: "04 Oct 2026 • 04:15 IST",
        type: "docket_created",
        title: "Civic Flooding & Loss Dossier Compiled",
        desc: "Geo-coordinates and hazard classification extracted. Cross-department routing planned.",
        hash: "4f73891029471928374619203847192038471920384719203847192038471920",
        author: "Priya Rao (Local Passage Engine)"
      }
    ],
    question: {
      id: "q-3",
      orgSlug: "shieldmotor",
      orgName: "Shield Motor Insurance Claims",
      title: "Did You Attempt to Start the Engine?",
      text: "Surveyor assessment question: In order to process hydrostatic lock coverage under Clause 4.2, confirm whether ignition was cranked after water entered the exhaust pipe.",
      options: [
        "No — Ignition remained strictly off throughout",
        "Vehicle was stationary and untouched since parking",
        "Key was turned on once to assess headlight"
      ],
      relayNotice: "This answer is routed strictly to Shield Insurance claim file #SHD-CLM-77192."
    },
    escalation: {
      id: "esc-3",
      triggerReason: "Municipal water repair delay exceeding 12-hour statutory emergency limit.",
      targetOrg: "District Disaster Management Authority (DDMA) & Municipal Ombudsman",
      draftSummary: "Emergency escalation regarding unattended trunk line failure causing continued structural and vehicular property loss.",
      remedyClaim: "Immediate emergency suction dewatering + municipal third-party property damage compensation.",
      statute: "Karnataka Municipal Corporations Act & Disaster Management Act Sec 51"
    },
    resolvedOutcome: {
      summary: "Area drained & made safe. Shield Motor approved ₹14,200 repair payout with zero depreciation.",
      replacementOrder: "CLAIM-SETTLED-SHD-77192",
      courierClearance: "BWSSB Repair Docket Closed #REC-311-OK",
      retellingsAvoided: 4,
      hoursSaved: 6.8,
      organizationsCoordinated: 3,
      chainLength: 9
    }
  }
};
