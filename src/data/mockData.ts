import { Task, DashboardMetrics, EmployeeContribution } from "../types";

export const mockEmployeeContributions: EmployeeContribution[] = [
  {
    name: "Anita China Guess",
    latest_contribution: 0,
    latest_contribution_date: null,
    ytd_contribution: 0,
  },
  {
    name: "Adam Choppin",
    latest_contribution: 1250,
    latest_contribution_date: "2025-01-15",
    ytd_contribution: 8500,
  },
  {
    name: "Sarah Johnson",
    latest_contribution: 2300,
    latest_contribution_date: "2025-01-20",
    ytd_contribution: 12000,
  },
  {
    name: "Michael Brown",
    latest_contribution: 0,
    latest_contribution_date: null,
    ytd_contribution: 0,
  },
  {
    name: "Emily Davis",
    latest_contribution: 1800,
    latest_contribution_date: "2025-01-18",
    ytd_contribution: 9500,
  },
  {
    name: "David Wilson",
    latest_contribution: 3200,
    latest_contribution_date: "2025-01-22",
    ytd_contribution: 15000,
  },
  {
    name: "Lisa Anderson",
    latest_contribution: 0,
    latest_contribution_date: null,
    ytd_contribution: 0,
  },
  {
    name: "Robert Taylor",
    latest_contribution: 2100,
    latest_contribution_date: "2025-01-19",
    ytd_contribution: 11200,
  },
];

export const mockTasks: Task[] = [
  {
    task_id: "task-052",
    task_category: "Regulatory Form Filing",
    task_short_description: "Form 13 F",
    frequency: "Quarterly",
    task_due_date: "2025-08-14",
    status: "active",
    description: "Quarterly Form 13F filing requirement",
    subtasks: []
  },
  {
    task_id: "task-053",
    task_category: "Regulatory Form Filing",
    task_short_description: "Form 13 H",
    frequency: "Annual",
    task_due_date: "2025-02-14",
    status: "active",
    description: "Annual Form 13H filing requirement",
    subtasks: []
  },
  {
    task_id: "task-054",
    task_category: "Regulatory Form Filing",
    task_short_description: "Form 600 H",
    frequency: "Annual",
    task_due_date: "2025-04-01",
    status: "active",
    description: "Annual Form 600H filing requirement",
    subtasks: []
  },
  {
    task_id: "task-055",
    task_category: "Regulatory Form Filing",
    task_short_description: "Form 600 J",
    frequency: "Annual",
    task_due_date: "2025-04-01",
    status: "active",
    description: "Annual Form 600J filing requirement",
    subtasks: []
  },
  {
    task_id: "task-166",
    task_category: "Regulatory Form Filing",
    task_short_description: "Form 700 & Disclosure of Contributions and Gifts",
    frequency: "Annual",
    task_due_date: "2025-04-01",
    status: "active",
    description: "Annual Form 700 filing and disclosure requirement",
    subtasks: []
  },
  {
    task_id: "task-057",
    task_category: "Regulatory Form Filing",
    task_short_description: "Form ADV",
    frequency: "Annual",
    task_due_date: "2025-03-31",
    status: "active",
    description: "Annual Form ADV filing requirement",
    subtasks: []
  },
  {
    task_id: "task-058",
    task_category: "Regulatory Form Filing",
    task_short_description: "Form CRS",
    frequency: "Annual",
    task_due_date: "2025-03-31",
    status: "active",
    description: "Annual Form CRS filing requirement",
    subtasks: []
  },
  {
    task_id: "task-059",
    task_category: "Regulatory Form Filing",
    task_short_description: "Form D",
    frequency: "Annual",
    task_due_date: "2025-12-31",
    status: "active",
    description: "Annual Form D filing requirement",
    subtasks: []
  },
  {
    task_id: "task-060",
    task_category: "Regulatory Form Filing",
    task_short_description: "Form LM-10",
    frequency: "Annual",
    task_due_date: "2025-03-31",
    status: "active",
    description: "Annual Form LM-10 filing requirement",
    subtasks: []
  },
  {
    task_id: "task-061",
    task_category: "Regulatory Form Filing",
    task_short_description: "Form PF",
    frequency: "Annual",
    task_due_date: "2025-04-30",
    status: "active",
    description: "Annual Form PF filing requirement",
    subtasks: []
  },
  {
    task_id: "task-184",
    task_category: "Regulatory Form Filing",
    task_short_description: "State Reporting Requirement - CA",
    frequency: "Annual",
    task_due_date: "2025-02-07",
    status: "active",
    description: "Annual state reporting requirement for California",
    subtasks: []
  },
  {
    task_id: "task-187",
    task_category: "Regulatory Form Filing",
    task_short_description: "State Reporting Requirement - CT",
    frequency: "Annual",
    task_due_date: "2025-05-31",
    status: "active",
    description: "Annual state reporting requirement for Connecticut",
    subtasks: []
  },
  {
    task_id: "task-190",
    task_category: "Regulatory Form Filing",
    task_short_description: "State Reporting Requirement - NC",
    frequency: "Annual",
    task_due_date: "2025-04-15",
    status: "active",
    description: "Annual state reporting requirement for North Carolina",
    subtasks: []
  },
  {
    task_id: "task-051",
    task_category: "Industry Trend Analysis & Updates",
    task_short_description: "Industry Trend Analysis & Updates",
    frequency: "Monthly",
    task_due_date: "2025-12-31",
    status: "active",
    description: "Regular monitoring and analysis of industry trends and regulatory updates",
    subtasks: []
  },
  {
    task_id: "task-044",
    task_category: "Compliance Reviews",
    task_short_description: "Compliance Program Review - Distribute to Clients",
    frequency: "Annual",
    task_due_date: "2025-12-31",
    status: "active",
    description: "Annual compliance program review distribution to clients",
    subtasks: []
  },
  {
    task_id: "task-045",
    task_category: "Compliance Reviews",
    task_short_description: "Compliance Review - Share with Clients",
    frequency: "Quarterly",
    task_due_date: "2025-12-31",
    status: "active",
    description: "Semi-annual compliance review sharing with clients",
    subtasks: []
  },
  {
    task_id: "task-046",
    task_category: "Compliance Reviews",
    task_short_description: "M &T Review",
    frequency: "Quarterly",
    task_due_date: "2025-10-15",
    status: "active",
    description: "Quarterly M&T compliance review",
    subtasks: []
  },
  {
    task_id: "task-139",
    task_category: "Compliance Reviews",
    task_short_description: "NYS Teachers - Marketing Permission Letter",
    frequency: "Annual",
    task_due_date: "2025-09-01",
    status: "active",
    description: "Annual marketing permission letter for NYS Teachers",
    subtasks: []
  },
  {
    task_id: "task-142",
    task_category: "Compliance Reviews",
    task_short_description: "Permission to use NYS Teachers Name in Pitch Books",
    frequency: "Annual",
    task_due_date: "2025-08-01",
    status: "active",
    description: "Annual permission for using NYS Teachers name in pitch books",
    subtasks: []
  },
  {
    task_id: "task-145",
    task_category: "Compliance Reviews",
    task_short_description: "PSERS - Compliance Review",
    frequency: "Annual",
    task_due_date: "2025-05-16",
    status: "active",
    description: "Annual PSERS compliance review",
    subtasks: []
  },
  {
    task_id: "task-012",
    task_category: "Compliance Reminders Management",
    task_short_description: "Compliance Training",
    frequency: "Annual",
    task_due_date: "2025-11-01",
    status: "active",
    description: "Annual compliance training program",
    subtasks: []
  },
  {
    task_id: "task-013",
    task_category: "Compliance Reminders Management",
    task_short_description: "Affidavit of Use for - #UNKNOWN!",
    frequency: "Once in six years",
    task_due_date: "2026-06-23",
    status: "active",
    description: "Six-year affidavit of use filing",
    subtasks: []
  },
  {
    task_id: "task-014",
    task_category: "Compliance Reminders Management",
    task_short_description: "Affidavit of Use for - XPONANCE (name)",
    frequency: "Once in six years",
    task_due_date: "2026-06-23",
    status: "active",
    description: "Six-year affidavit of use filing for XPONANCE name",
    subtasks: []
  },
  {
    task_id: "task-015",
    task_category: "Compliance Reminders Management",
    task_short_description: "Affidavit of Use for - YOUR SUCCESS OUR PASSION",
    frequency: "Once in six years",
    task_due_date: "2026-06-23",
    status: "active",
    description: "Six-year affidavit of use filing for company slogan",
    subtasks: []
  },
  {
    task_id: "task-016",
    task_category: "Compliance Reminders Management",
    task_short_description: "Annual desk audit",
    frequency: "Annual",
    task_due_date: "2025-06-15",
    status: "active",
    description: "Annual desk audit review",
    subtasks: []
  },
  {
    task_id: "task-017",
    task_category: "Compliance Reminders Management",
    task_short_description: "Board/ Shareholder Meetings",
    frequency: "Quarterly",
    task_due_date: "2025-07-15",
    status: "active",
    description: "Quarterly board and shareholder meetings",
    subtasks: []
  },
  {
    task_id: "task-018",
    task_category: "Compliance Reminders Management",
    task_short_description: "CFA - GIPS",
    frequency: "Annual",
    task_due_date: "2025-05-01",
    status: "active",
    description: "Annual CFA GIPS compliance review",
    subtasks: []
  },
  {
    task_id: "task-055",
    task_category: "Compliance Reminders Management",
    task_short_description: "Compliance Manual distribution",
    frequency: "Annual",
    task_due_date: "2025-12-31",
    status: "active",
    description: "Annual compliance manual distribution",
    subtasks: []
  },
  {
    task_id: "task-058",
    task_category: "Compliance Reminders Management",
    task_short_description: "Compliance Program Review Report - To the Board of Directors",
    frequency: "Annual",
    task_due_date: "2025-06-30",
    status: "active",
    description: "Annual compliance program review report for Board of Directors",
    subtasks: []
  },
  {
    task_id: "task-021",
    task_category: "Compliance Reminders Management",
    task_short_description: "COR Meeting",
    frequency: "Quarterly",
    task_due_date: "2025-08-15",
    status: "active",
    description: "Quarterly COR meeting",
    subtasks: []
  },
  {
    task_id: "task-064",
    task_category: "Compliance Reminders Management",
    task_short_description: "Delivery of Audited Financials",
    frequency: "Annual",
    task_due_date: "2025-05-01",
    status: "active",
    description: "Annual delivery of audited financial statements",
    subtasks: []
  },
  {
    task_id: "task-067",
    task_category: "Compliance Reminders Management",
    task_short_description: "Email Alert & Monitoring",
    frequency: "Monthly",
    task_due_date: "2025-08-15",
    status: "active",
    description: "Monthly email alert and monitoring review",
    subtasks: []
  },
  {
    task_id: "task-070",
    task_category: "Compliance Reminders Management",
    task_short_description: "Executed contracts - Client and Sub-managers",
    frequency: "Annual",
    task_due_date: "2025-11-15",
    status: "active",
    description: "Annual review of executed contracts with clients and sub-managers",
    subtasks: []
  },
  {
    task_id: "task-073",
    task_category: "Compliance Reminders Management",
    task_short_description: "FINRA registration fees",
    frequency: "Annual",
    task_due_date: "2025-12-31",
    status: "active",
    description: "Annual FINRA registration fee payment",
    subtasks: []
  },
  {
    task_id: "task-026",
    task_category: "Compliance Reminders Management",
    task_short_description: "Fixed Income Factsheets Review",
    frequency: "Quarterly",
    task_due_date: "2025-07-15",
    status: "active",
    description: "Quarterly fixed income factsheets review",
    subtasks: []
  },
  {
    task_id: "task-027",
    task_category: "Compliance Reminders Management",
    task_short_description: "Global Equities Factsheets Review",
    frequency: "Quarterly",
    task_due_date: "2025-07-30",
    status: "active",
    description: "Quarterly global equities factsheets review",
    subtasks: []
  },
  {
    task_id: "task-082",
    task_category: "Compliance Reminders Management",
    task_short_description: "Mass Prim - 3rd Party Disclosure",
    frequency: "Annual",
    task_due_date: "2025-04-08",
    status: "active",
    description: "Annual Mass PRIM third party disclosure",
    subtasks: []
  },
  {
    task_id: "task-085",
    task_category: "Compliance Reminders Management",
    task_short_description: "NYS Teachers Contract renewal letter",
    frequency: "Annual",
    task_due_date: "2025-04-01",
    status: "active",
    description: "Annual NYS Teachers contract renewal letter",
    subtasks: []
  },
  {
    task_id: "task-088",
    task_category: "Compliance Reminders Management",
    task_short_description: "On-site Visit Report Review",
    frequency: "Monthly",
    task_due_date: "2025-08-05",
    status: "active",
    description: "Monthly on-site visit report review",
    subtasks: []
  },
  {
    task_id: "task-031",
    task_category: "Compliance Reminders Management",
    task_short_description: "Privacy Notice Clients",
    frequency: "Annual",
    task_due_date: "2025-03-31",
    status: "active",
    description: "Annual privacy notice distribution to clients",
    subtasks: []
  },
  {
    task_id: "task-094",
    task_category: "Compliance Reminders Management",
    task_short_description: "Renewal Fees for Investment Adviser Rep",
    frequency: "Annual",
    task_due_date: "2025-11-30",
    status: "active",
    description: "Annual investment adviser representative renewal fees",
    subtasks: []
  },
  {
    task_id: "task-033",
    task_category: "Compliance Reminders Management",
    task_short_description: "SOC Reports",
    frequency: "Annual",
    task_due_date: "2025-03-31",
    status: "active",
    description: "Annual SOC reports review",
    subtasks: []
  },
  {
    task_id: "task-034",
    task_category: "Compliance Reminders Management",
    task_short_description: "Staff Declarations",
    frequency: "Quarterly",
    task_due_date: "2025-07-10",
    status: "active",
    description: "Quarterly staff declarations collection",
    subtasks: []
  },
  {
    task_id: "task-035",
    task_category: "Compliance Reminders Management",
    task_short_description: "Staff Declarations",
    frequency: "Annual",
    task_due_date: "2025-12-31",
    status: "active",
    description: "Annual staff declarations collection",
    subtasks: []
  },
  {
    task_id: "task-106",
    task_category: "Compliance Reminders Management",
    task_short_description: "Sub-Advisors Declarations",
    frequency: "Annual",
    task_due_date: "2025-05-16",
    status: "active",
    description: "Annual sub-advisors declarations collection",
    subtasks: []
  },
  {
    task_id: "task-112",
    task_category: "Compliance Reminders Management",
    task_short_description: "IL SURS - Compliance Certification - Sub-Advisors",
    frequency: "Annual",
    task_due_date: "2025-08-18",
    status: "active",
    description: "Annual IL SURS compliance certification for sub-advisors",
    subtasks: []
  },
  {
    task_id: "task-115",
    task_category: "Compliance Reminders Management",
    task_short_description: "Maryland State - Compliance Questionnaire and Certificate",
    frequency: "Annual",
    task_due_date: "2025-07-30",
    status: "active",
    description: "Annual Maryland State compliance questionnaire and certification",
    subtasks: []
  },
  {
    task_id: "task-118",
    task_category: "Compliance Reminders Management",
    task_short_description: "Sub-Manager's Proxy Voting Policies to the CIT Client",
    frequency: "Annual",
    task_due_date: "2025-10-18",
    status: "active",
    description: "Annual sub-manager's proxy voting policies submission to CIT client",
    subtasks: []
  },
  {
    task_id: "task-041",
    task_category: "Compliance Reminders Management",
    task_short_description: "Systematic Equities Factsheets Review",
    frequency: "Quarterly",
    task_due_date: "2025-07-15",
    status: "active",
    description: "Quarterly systematic equities factsheets review",
    subtasks: []
  },
  {
    task_id: "task-042",
    task_category: "Compliance Reminders Management",
    task_short_description: "Trademark Registration - FIS Globe Logo",
    frequency: "Once in six years",
    task_due_date: "2029-03-31",
    status: "active",
    description: "Six-year trademark registration renewal for FIS Globe Logo",
    subtasks: []
  },
  {
    task_id: "task-043",
    task_category: "Compliance Reminders Management",
    task_short_description: "Vendor Declarations",
    frequency: "Quarterly",
    task_due_date: "2025-07-10",
    status: "active",
    description: "Quarterly vendor declarations collection",
    subtasks: []
  },
  {
    task_id: "task-004",
    task_category: "Compliance Client Declarations",
    task_short_description: "Baltimore ERS - Compliance with MFN Provisions",
    frequency: "Annual",
    task_due_date: "2025-07-01",
    status: "active",
    description: "Annual Baltimore ERS compliance with MFN provisions",
    subtasks: [
      {
        subtask_id: "subtask-ERISAclientsNoticeasperDOLRegulation-2025",
        subtask_short_description: "ERISA clients - Notice as per DOL Regulation - 2025",
        subtask_description: "ERISA clients - Notice as per DOL Regulation for 2025",
        due_date: "2025-04-15",
        task_id: "task-004",
        status: "due",
        last_status_change_date: "2025-07-17",
        subtask_create_date: "2025-07-01"
      }
    ]
  },
  {
    task_id: "task-007",
    task_category: "Compliance Client Declarations",
    task_short_description: "ERISA clients - Notice as per DOL Regulation",
    frequency: "Annual",
    task_due_date: "2025-07-01",
    status: "active",
    description: "Annual ERISA clients DOL regulation notice",
    subtasks: []
  },
  {
    task_id: "task-007",
    task_category: "Compliance Client Declarations",
    task_short_description: "ERISA clients - Notice as per DOL Regulation",
    frequency: "Annual",
    task_due_date: "2025-07-01",
    status: "active",
    description: "Annual ERISA clients DOL regulation notice",
    subtasks: []
  },
  {
    task_id: "task-013",
    task_category: "Compliance Client Declarations",
    task_short_description: "IMRF Compliance Questionnaire",
    frequency: "Annual",
    task_due_date: "2025-05-12",
    status: "active",
    description: "Annual IMRF compliance questionnaire submission",
    subtasks: []
  },
  {
    task_id: "task-016",
    task_category: "Compliance Client Declarations",
    task_short_description: "Mass PRIM - Disclosure regarding 3rd party individuals who receive fees",
    frequency: "Annual",
    task_due_date: "2025-09-15",
    status: "active",
    description: "Annual Mass PRIM third party fee disclosure",
    subtasks: []
  },
  {
    task_id: "task-007",
    task_category: "Compliance Client Declarations",
    task_short_description: "NYC SYS - Compliance Letter",
    frequency: "Quarterly",
    task_due_date: "2025-07-31",
    status: "active",
    description: "Quarterly NYC SYS compliance letter submission",
    subtasks: []
  },
  {
    task_id: "task-022",
    task_category: "Compliance Client Declarations",
    task_short_description: "NYC Systems - Ethics and Compliance Questionnaire",
    frequency: "Annual",
    task_due_date: "2025-04-30",
    status: "active",
    description: "Annual NYC Systems ethics and compliance questionnaire",
    subtasks: []
  },
  {
    task_id: "task-025",
    task_category: "Compliance Client Declarations",
    task_short_description: "NYS Common - Compliance Manual",
    frequency: "Annual",
    task_due_date: "2025-06-30",
    status: "active",
    description: "Annual NYS Common compliance manual review",
    subtasks: []
  },
  {
    task_id: "task-028",
    task_category: "Compliance Client Declarations",
    task_short_description: "NYSCRF - Compliance Questionnaire",
    frequency: "Annual",
    task_due_date: "2025-01-31",
    status: "active",
    description: "Annual NYSCRF compliance questionnaire submission",
    subtasks: []
  },
  {
    task_id: "task-031",
    task_category: "Compliance Client Declarations",
    task_short_description: "NYSTR - ESG Questionnaire",
    frequency: "Annual",
    task_due_date: "2025-08-14",
    status: "active",
    description: "Annual NYSTR ESG questionnaire submission",
    subtasks: []
  },
  {
    task_id: "task-001",
    task_category: "Alerts & Monitoring - Compliance",
    task_short_description: "Website Review",
    frequency: "Quarterly",
    task_due_date: "2025-07-21",
    status: "active",
    description: "Quarterly review of website for compliance monitoring",
    subtasks: [
      {
        subtask_id: "subtask-WebsiteReviewAlert-Quarter1",
        subtask_short_description: "Website Review Alert - Quarter1",
        subtask_description: "Website Review Alert for Quarter1",
        due_date: "2025-01-21",
        task_id: "task-001",
        status: "due",
        last_status_change_date: "2025-07-17",
        subtask_create_date: "2025-07-01"
      },
      {
        subtask_id: "subtask-WebsiteReviewAlert-Quarter2",
        subtask_short_description: "Website Review Alert - Quarter2",
        subtask_description: "Website Review Alert for Quarter2",
        due_date: "2025-04-21",
        task_id: "task-001",
        status: "due",
        last_status_change_date: "2025-07-17",
        subtask_create_date: "2025-07-01"
      },
      {
        subtask_id: "subtask-WebsiteReviewAlert-Quarter3",
        subtask_short_description: "Website Review Alert - Quarter3",
        subtask_description: "Website Review Alert for Quarter3",
        due_date: "2025-07-21",
        task_id: "task-001",
        status: "due",
        last_status_change_date: "2025-07-17",
        subtask_create_date: "2025-07-01"
      },
      {
        subtask_id: "subtask-WebsiteReviewAlert-Quarter4",
        subtask_short_description: "Website Review Alert - Quarter4",
        subtask_description: "Website Review Alert for Quarter4",
        due_date: "2025-10-21",
        task_id: "task-001",
        status: "due",
        last_status_change_date: "2025-07-17",
        subtask_create_date: "2025-07-01"
      }
    ],
    last_run_date: "2023-12-15",
    next_run_date: "2024-01-15",
    renewal_date: "2024-04-01",
    cadence: "Quarterly" as const,
    actions: [
      {
        action_id: "action-WebsiteReviewAlert-Quarter1",
        // action_short_description: "Website Review Alert - Quarter1",
        instructions: "Political Contribution Check",
        tools_used: ["Send Email", "Send Reminder", "Block Calendar"],
      },
      {
        action_id: "action-WebsiteReviewAlert-Quarter1",
        // action_short_description: "Website Review Alert - Quarter1",
        instructions: "Contribution Alert System",
        tools_used: ["Send Email", "Send Reminder", "Block Calendar","Write Report"],
      }
    ]
  },
  {
    task_id: "task-050",
    task_category: "Document Analysis and Information Gathering",
    task_short_description: "Multiple Standard Documents Reviewed by Compliance",
    frequency: "Monthly",
    task_due_date: "2025-12-31",
    status: "active",
    description: "Regular monitoring and analysis of industry trends and regulatory updates",
    subtasks: []
  },
  // --- 8 tasks for each of the 8 categories ---
  // ...[...Array(8)].map((_, i) => ({
  //   task_id: `alerts-monitoring-${i + 1}`,
  //   task_category: "Alerts & Monitoring - Compliance",
  //   task_short_description: `Alerts & Monitoring Task ${i + 1}`,
  //   frequency: "Daily" as const,
  //   last_run_date: "2023-12-15",
  //   next_run_date: "2024-01-15",
  //   renewal_date: "2024-04-01",
  //   cadence: "Quarterly" as const,
  //   task_due_date: `2025-02-${(i + 1).toString().padStart(2, "0")}`,
  //   status: "active" as const,
  //   description: `Monitor and respond to alerts for system ${i + 1}.`,
  //   subtasks: [...Array(5)].map((_, j) => ({
  //     subtask_id: `alerts-monitoring-${i + 1}-subtask-${j + 1}`,
  //     subtask_short_description: `Subtask ${
  //       j + 1
  //     } for Alerts & Monitoring Task ${i + 1}`,
  //     status: "due" as const,
  //     period_considered: `Feb ${i + 1}, 2025`,
  //     employees_analyzed: j + 1,
  //     employee_contributions: mockEmployeeContributions.slice(0, 2),
  //     instructions: `Instructions for subtask ${
  //       j + 1
  //     } of Alerts & Monitoring Task ${i + 1}`,
  //   })),
  //   //add a key below namely actions which will contain 1) instructions and 2) tools used like 'Send Email', 'Send Reminder', 'Block Calendar'
  //   actions: [
  //     {
  //       action_id: `alerts-monitoring-${i + 1}`,
  //       instructions: ``,
  //       tools_used: ["Send Email", "Send Reminder", "Block Calendar"],
  //     },
  //   ],
  // })),
  // ...[...Array(8)].map((_, i) => ({
  //   task_id: `compliance-declaration-${i + 1}`,
  //   task_category: "Compliance Client Declarations",
  //   task_short_description: `Compliance Declaration Task ${i + 1}`,
  //   frequency: "One-Time" as const,
  //   task_due_date: `2025-03-${(i + 1).toString().padStart(2, "0")}`,
  //   status: "active" as const,
  //   description: `Collect and review compliance declarations for group ${
  //     i + 1
  //   }.`,
  //   subtasks: [...Array(5)].map((_, j) => ({
  //     subtask_id: `compliance-declaration-${i + 1}-subtask-${j + 1}`,
  //     subtask_short_description: `Subtask ${
  //       j + 1
  //     } for Compliance Declaration Task ${i + 1}`,
  //     status: "due" as const,
  //     period_considered: `Mar ${i + 1}, 2025`,
  //     employees_analyzed: j + 2,
  //     employee_contributions: mockEmployeeContributions.slice(0, 2),
  //     instructions: `Instructions for subtask ${
  //       j + 1
  //     } of Compliance Declaration Task ${i + 1}`,
  //   })),
  // })),
  // ...[...Array(8)].map((_, i) => ({
  //   task_id: `compliance-reviews-${i + 1}`,
  //   task_category: "Compliance Reviews",
  //   task_short_description: `Compliance Review Task ${i + 1}`,
  //   frequency: "Quarterly" as const,
  //   task_due_date: `2025-04-${(i + 1).toString().padStart(2, "0")}`,
  //   status: "active" as const,
  //   description: `Conduct compliance review for department ${i + 1}.`,
  //   subtasks: [...Array(5)].map((_, j) => ({
  //     subtask_id: `compliance-reviews-${i + 1}-subtask-${j + 1}`,
  //     subtask_short_description: `Subtask ${j + 1} for Compliance Review Task ${
  //       i + 1
  //     }`,
  //     status: "due" as const,
  //     period_considered: `Apr ${i + 1}, 2025`,
  //     employees_analyzed: j + 3,
  //     employee_contributions: mockEmployeeContributions.slice(0, 2),
  //     instructions: `Instructions for subtask ${
  //       j + 1
  //     } of Compliance Review Task ${i + 1}`,
  //   })),
  // })),
  // ...[...Array(8)].map((_, i) => ({
  //   task_id: `compliance-training-${i + 1}`,
  //   task_category: "Compliance Reminders Management",
  //   task_short_description: `Compliance Training Task ${i + 1}`,
  //   frequency: "One-Time" as const,
  //   task_due_date: `2025-05-${(i + 1).toString().padStart(2, "0")}`,
  //   status: "active" as const,
  //   description: `Organize compliance training session ${i + 1}.`,
  //   subtasks: [...Array(5)].map((_, j) => ({
  //     subtask_id: `compliance-training-${i + 1}-subtask-${j + 1}`,
  //     subtask_short_description: `Subtask ${
  //       j + 1
  //     } for Compliance Training Task ${i + 1}`,
  //     status: "due" as const,
  //     period_considered: `May ${i + 1}, 2025`,
  //     employees_analyzed: j + 4,
  //     employee_contributions: mockEmployeeContributions.slice(0, 2),
  //     instructions: `Instructions for subtask ${
  //       j + 1
  //     } of Compliance Training Task ${i + 1}`,
  //   })),
  // })),
  // ...[...Array(8)].map((_, i) => ({
  //   task_id: `contract-renewals-${i + 1}`,
  //   task_category: "Document Analysis and Information Gathering",
  //   task_short_description: `Contract Renewal Task ${i + 1}`,
  //   frequency: "One-Time" as const,
  //   task_due_date: `2025-06-${(i + 1).toString().padStart(2, "0")}`,
  //   status: "active" as const,
  //   description: `Renew contract for vendor ${i + 1}.`,
  //   subtasks: [...Array(5)].map((_, j) => ({
  //     subtask_id: `contract-renewals-${i + 1}-subtask-${j + 1}`,
  //     subtask_short_description: `Subtask ${j + 1} for Contract Renewal Task ${
  //       i + 1
  //     }`,
  //     status: "due" as const,
  //     period_considered: `Jun ${i + 1}, 2025`,
  //     employees_analyzed: j + 5,
  //     employee_contributions: mockEmployeeContributions.slice(0, 2),
  //     instructions: `Instructions for subtask ${
  //       j + 1
  //     } of Contract Renewal Task ${i + 1}`,
  //   })),
  // })),
  // ...[...Array(8)].map((_, i) => ({
  //   task_id: `declarations-${i + 1}`,
  //   task_category: "Industry Trend Analysis & Updates",
  //   task_short_description: `Declarations Task ${i + 1}`,
  //   frequency: "Monthly" as const,
  //   task_due_date: `2025-07-${(i + 1).toString().padStart(2, "0")}`,
  //   status: "active" as const,
  //   description: `Collect declarations from staff group ${i + 1}.`,
  //   subtasks: [...Array(5)].map((_, j) => ({
  //     subtask_id: `declarations-${i + 1}-subtask-${j + 1}`,
  //     subtask_short_description: `Subtask ${j + 1} for Declarations Task ${
  //       i + 1
  //     }`,
  //     status: "due" as const,
  //     period_considered: `Jul ${i + 1}, 2025`,
  //     employees_analyzed: j + 6,
  //     employee_contributions: mockEmployeeContributions.slice(0, 2),
  //     instructions: `Instructions for subtask ${j + 1} of Declarations Task ${
  //       i + 1
  //     }`,
  //   })),
  // })),
  // ...[...Array(8)].map((_, i) => ({
  //   task_id: `meetings-${i + 1}`,
  //   task_category: "Meetings",
  //   task_short_description: `Meetings Task ${i + 1}`,
  //   frequency: "Quarterly" as const,
  //   task_due_date: `2025-08-${(i + 1).toString().padStart(2, "0")}`,
  //   status: "active" as const,
  //   description: `Organize meeting for group ${i + 1}.`,
  //   subtasks: [...Array(5)].map((_, j) => ({
  //     subtask_id: `meetings-${i + 1}-subtask-${j + 1}`,
  //     subtask_short_description: `Subtask ${j + 1} for Meetings Task ${i + 1}`,
  //     status: "due" as const,
  //     period_considered: `Aug ${i + 1}, 2025`,
  //     employees_analyzed: j + 7,
  //     employee_contributions: mockEmployeeContributions.slice(0, 2),
  //     instructions: `Instructions for subtask ${j + 1} of Meetings Task ${
  //       i + 1
  //     }`,
  //   })),
  // })),
  // ...[...Array(8)].map((_, i) => ({
  //   task_id: `regulatory-form-${i + 1}`,
  //   task_category: "Regulatory Form Filing",
  //   task_short_description: `Regulatory Form Filing Task ${i + 1}`,
  //   frequency: "Monthly" as const,
  //   task_due_date: `2025-09-${(i + 1).toString().padStart(2, "0")}`,
  //   status: "active" as const,
  //   description: `Prepare regulatory form for department ${i + 1}.`,
  //   subtasks: [...Array(5)].map((_, j) => ({
  //     subtask_id: `regulatory-form-${i + 1}-subtask-${j + 1}`,
  //     subtask_short_description: `Subtask ${j + 1} for Regulatory Form Filing Task ${
  //       i + 1
  //     }`,
  //     status: "due" as const,
  //     period_considered: `Sep ${i + 1}, 2025`,
  //     employees_analyzed: j + 8,
  //     employee_contributions: mockEmployeeContributions.slice(0, 2),
  //     instructions: `Instructions for subtask ${
  //       j + 1
  //     } of Regulatory Form Filing Task ${i + 1}`,
  //   })),
  // })),
  // 1. Alerts & Monitoring
  {
    task_id: "cat-1",
    task_category: "Alerts & Monitoring",
    task_short_description: "Monitor Social Media Alerts",
    frequency: "Daily" as const,
    task_due_date: "2025-02-01",
    status: "active" as const,
    description:
      "Monitor social media channels for compliance-related alerts and escalate as needed.",
    subtasks: [
      {
        subtask_id: "cat-1-1",
        subtask_short_description: "Check Twitter alerts",
        status: "due" as const,
        period_considered: "Feb 1, 2025",
        employees_analyzed: 2,
        employee_contributions: mockEmployeeContributions.slice(0, 2),
        instructions: "Monitor Twitter for compliance mentions.",
      },
      {
        subtask_id: "cat-1-2",
        subtask_short_description: "Check LinkedIn alerts",
        status: "due" as const,
        period_considered: "Feb 1, 2025",
        employees_analyzed: 1,
        employee_contributions: mockEmployeeContributions.slice(0, 1),
        instructions: "Monitor LinkedIn for compliance mentions.",
      },
      {
        subtask_id: "cat-1-3",
        subtask_short_description: "Review email alerts",
        status: "due" as const,
        period_considered: "Feb 1, 2025",
        employees_analyzed: 1,
        employee_contributions: mockEmployeeContributions.slice(0, 1),
        instructions: "Review compliance-related email alerts.",
      },
      {
        subtask_id: "cat-1-4",
        subtask_short_description: "Website monitoring",
        status: "due" as const,
        period_considered: "Feb 1, 2025",
        employees_analyzed: 1,
        employee_contributions: mockEmployeeContributions.slice(0, 1),
        instructions: "Monitor website for compliance issues.",
      },
      {
        subtask_id: "cat-1-5",
        subtask_short_description: "Escalate critical alerts",
        status: "due" as const,
        period_considered: "Feb 1, 2025",
        employees_analyzed: 1,
        employee_contributions: mockEmployeeContributions.slice(0, 1),
        instructions: "Escalate critical alerts to compliance team.",
      },
    ],
  },
  // 2. Compliance Declaration
  {
    task_id: "cat-2",
    task_category: "Compliance Declaration",
    task_short_description: "Annual Compliance Declaration",
    frequency: "One-Time" as const,
    task_due_date: "2025-03-01",
    status: "active" as const,
    description:
      "Collect and review annual compliance declarations from all sub-managers and provide to clients.",
    subtasks: [
      {
        subtask_id: "cat-2-1",
        subtask_short_description: "Request declarations from sub-managers",
        status: "due" as const,
        period_considered: "Feb 2025",
        employees_analyzed: 5,
        employee_contributions: mockEmployeeContributions.slice(0, 2),
        instructions: "Send request emails to all sub-managers.",
      },
      {
        subtask_id: "cat-2-2",
        subtask_short_description: "Receive declarations",
        status: "due" as const,
        period_considered: "Feb 2025",
        employees_analyzed: 5,
        employee_contributions: mockEmployeeContributions.slice(0, 2),
        instructions: "Track received declarations.",
      },
      {
        subtask_id: "cat-2-3",
        subtask_short_description: "Review declarations",
        status: "due" as const,
        period_considered: "Feb 2025",
        employees_analyzed: 5,
        employee_contributions: mockEmployeeContributions.slice(0, 2),
        instructions: "Review for completeness and compliance.",
      },
      {
        subtask_id: "cat-2-4",
        subtask_short_description: "Compile report for client",
        status: "due" as const,
        period_considered: "Feb 2025",
        employees_analyzed: 5,
        employee_contributions: mockEmployeeContributions.slice(0, 2),
        instructions: "Compile all declarations into a report.",
      },
      {
        subtask_id: "cat-2-5",
        subtask_short_description: "Send report to client",
        status: "due" as const,
        period_considered: "Feb 2025",
        employees_analyzed: 5,
        employee_contributions: mockEmployeeContributions.slice(0, 2),
        instructions: "Send compiled report to client.",
      },
    ],
  },
  // 3. Compliance Reviews
  {
    task_id: "cat-3",
    task_category: "Compliance Reviews",
    task_short_description: "Internal Compliance Review",
    frequency: "Quarterly" as const,
    task_due_date: "2025-04-01",
    status: "active" as const,
    description:
      "Conduct quarterly internal compliance review and document findings.",
    subtasks: [
      {
        subtask_id: "cat-3-1",
        subtask_short_description: "Prepare review checklist",
        status: "due" as const,
        period_considered: "Mar 2025",
        employees_analyzed: 3,
        employee_contributions: mockEmployeeContributions.slice(0, 2),
        instructions: "Draft checklist for review.",
      },
      {
        subtask_id: "cat-3-2",
        subtask_short_description: "Conduct interviews",
        status: "due" as const,
        period_considered: "Mar 2025",
        employees_analyzed: 3,
        employee_contributions: mockEmployeeContributions.slice(0, 2),
        instructions: "Interview key staff.",
      },
      {
        subtask_id: "cat-3-3",
        subtask_short_description: "Review documentation",
        status: "due" as const,
        period_considered: "Mar 2025",
        employees_analyzed: 3,
        employee_contributions: mockEmployeeContributions.slice(0, 2),
        instructions: "Review compliance documents.",
      },
      {
        subtask_id: "cat-3-4",
        subtask_short_description: "Draft findings",
        status: "due" as const,
        period_considered: "Mar 2025",
        employees_analyzed: 3,
        employee_contributions: mockEmployeeContributions.slice(0, 2),
        instructions: "Draft findings and recommendations.",
      },
      {
        subtask_id: "cat-3-5",
        subtask_short_description: "Present review to management",
        status: "due" as const,
        period_considered: "Mar 2025",
        employees_analyzed: 3,
        employee_contributions: mockEmployeeContributions.slice(0, 2),
        instructions: "Present findings to management.",
      },
    ],
  },
  // 4. Compliance Training
  {
    task_id: "cat-4",
    task_category: "Compliance Training",
    task_short_description: "Annual Compliance Training",
    frequency: "One-Time" as const,
    task_due_date: "2025-05-01",
    status: "active" as const,
    description:
      "Organize and track annual compliance training for all employees.",
    subtasks: [
      {
        subtask_id: "cat-4-1",
        subtask_short_description: "Schedule training sessions",
        status: "due" as const,
        period_considered: "Apr 2025",
        employees_analyzed: 10,
        employee_contributions: mockEmployeeContributions.slice(0, 2),
        instructions: "Schedule sessions for all departments.",
      },
      {
        subtask_id: "cat-4-2",
        subtask_short_description: "Send training invites",
        status: "due" as const,
        period_considered: "Apr 2025",
        employees_analyzed: 10,
        employee_contributions: mockEmployeeContributions.slice(0, 2),
        instructions: "Send calendar invites.",
      },
      {
        subtask_id: "cat-4-3",
        subtask_short_description: "Conduct training",
        status: "due" as const,
        period_considered: "Apr 2025",
        employees_analyzed: 10,
        employee_contributions: mockEmployeeContributions.slice(0, 2),
        instructions: "Conduct training sessions.",
      },
      {
        subtask_id: "cat-4-4",
        subtask_short_description: "Collect attendance",
        status: "due" as const,
        period_considered: "Apr 2025",
        employees_analyzed: 10,
        employee_contributions: mockEmployeeContributions.slice(0, 2),
        instructions: "Collect attendance records.",
      },
      {
        subtask_id: "cat-4-5",
        subtask_short_description: "Report completion",
        status: "due" as const,
        period_considered: "Apr 2025",
        employees_analyzed: 10,
        employee_contributions: mockEmployeeContributions.slice(0, 2),
        instructions: "Report training completion.",
      },
    ],
  },
  // 5. Contract Renewals
  {
    task_id: "cat-5",
    task_category: "Contract Renewals",
    task_short_description: "Vendor Contract Renewal",
    frequency: "One-Time" as const,
    task_due_date: "2025-06-01",
    status: "active" as const,
    description:
      "Track and renew contracts with key vendors before expiration.",
    subtasks: [
      {
        subtask_id: "cat-5-1",
        subtask_short_description: "Identify expiring contracts",
        status: "due" as const,
        period_considered: "May 2025",
        employees_analyzed: 2,
        employee_contributions: mockEmployeeContributions.slice(0, 2),
        instructions: "List contracts expiring soon.",
      },
      {
        subtask_id: "cat-5-2",
        subtask_short_description: "Contact vendors",
        status: "due" as const,
        period_considered: "May 2025",
        employees_analyzed: 2,
        employee_contributions: mockEmployeeContributions.slice(0, 2),
        instructions: "Reach out to vendors for renewal.",
      },
      {
        subtask_id: "cat-5-3",
        subtask_short_description: "Negotiate terms",
        status: "due" as const,
        period_considered: "May 2025",
        employees_analyzed: 2,
        employee_contributions: mockEmployeeContributions.slice(0, 2),
        instructions: "Negotiate contract terms.",
      },
      {
        subtask_id: "cat-5-4",
        subtask_short_description: "Sign contracts",
        status: "due" as const,
        period_considered: "May 2025",
        employees_analyzed: 2,
        employee_contributions: mockEmployeeContributions.slice(0, 2),
        instructions: "Sign renewed contracts.",
      },
      {
        subtask_id: "cat-5-5",
        subtask_short_description: "Update contract records",
        status: "due" as const,
        period_considered: "May 2025",
        employees_analyzed: 2,
        employee_contributions: mockEmployeeContributions.slice(0, 2),
        instructions: "Update records with new contracts.",
      },
    ],
  },
  // 6. Declarations
  {
    task_id: "cat-6",
    task_category: "Declarations",
    task_short_description: "Staff Declarations Collection",
    frequency: "Monthly" as const,
    task_due_date: "2025-02-10",
    status: "active" as const,
    description:
      "Collect monthly declarations from staff and send non-compliance notices as needed.",
    subtasks: [
      {
        subtask_id: "cat-6-1",
        subtask_short_description: "Send declaration forms",
        status: "due" as const,
        period_considered: "Feb 2025",
        employees_analyzed: 8,
        employee_contributions: mockEmployeeContributions.slice(0, 2),
        instructions: "Send forms to all staff.",
      },
      {
        subtask_id: "cat-6-2",
        subtask_short_description: "Receive completed forms",
        status: "due" as const,
        period_considered: "Feb 2025",
        employees_analyzed: 8,
        employee_contributions: mockEmployeeContributions.slice(0, 2),
        instructions: "Track received forms.",
      },
      {
        subtask_id: "cat-6-3",
        subtask_short_description: "Review for compliance",
        status: "due" as const,
        period_considered: "Feb 2025",
        employees_analyzed: 8,
        employee_contributions: mockEmployeeContributions.slice(0, 2),
        instructions: "Review forms for compliance.",
      },
      {
        subtask_id: "cat-6-4",
        subtask_short_description: "Send non-compliance notices",
        status: "due" as const,
        period_considered: "Feb 2025",
        employees_analyzed: 8,
        employee_contributions: mockEmployeeContributions.slice(0, 2),
        instructions: "Send notices to non-compliant staff.",
      },
      {
        subtask_id: "cat-6-5",
        subtask_short_description: "Report to management",
        status: "due" as const,
        period_considered: "Feb 2025",
        employees_analyzed: 8,
        employee_contributions: mockEmployeeContributions.slice(0, 2),
        instructions: "Report declaration status to management.",
      },
    ],
  },
  // 7. Meetings
  {
    task_id: "cat-7",
    task_category: "Meetings",
    task_short_description: "Quarterly CORS Meeting",
    frequency: "Quarterly" as const,
    task_due_date: "2025-03-20",
    status: "active" as const,
    description:
      "Organize and document quarterly CORS meetings and follow up on action items.",
    subtasks: [
      {
        subtask_id: "cat-7-1",
        subtask_short_description: "Schedule meeting",
        status: "due" as const,
        period_considered: "Mar 2025",
        employees_analyzed: 6,
        employee_contributions: mockEmployeeContributions.slice(0, 2),
        instructions: "Schedule CORS meeting.",
      },
      {
        subtask_id: "cat-7-2",
        subtask_short_description: "Prepare agenda",
        status: "due" as const,
        period_considered: "Mar 2025",
        employees_analyzed: 6,
        employee_contributions: mockEmployeeContributions.slice(0, 2),
        instructions: "Prepare meeting agenda.",
      },
      {
        subtask_id: "cat-7-3",
        subtask_short_description: "Send invites",
        status: "due" as const,
        period_considered: "Mar 2025",
        employees_analyzed: 6,
        employee_contributions: mockEmployeeContributions.slice(0, 2),
        instructions: "Send calendar invites.",
      },
      {
        subtask_id: "cat-7-4",
        subtask_short_description: "Document meeting minutes",
        status: "due" as const,
        period_considered: "Mar 2025",
        employees_analyzed: 6,
        employee_contributions: mockEmployeeContributions.slice(0, 2),
        instructions: "Document minutes and action items.",
      },
      {
        subtask_id: "cat-7-5",
        subtask_short_description: "Follow up on action items",
        status: "due" as const,
        period_considered: "Mar 2025",
        employees_analyzed: 6,
        employee_contributions: mockEmployeeContributions.slice(0, 2),
        instructions: "Follow up on assigned actions.",
      },
    ],
  },
  // 8. Regulatory Form Filing
  {
    task_id: "cat-8",
    task_category: "Regulatory Form Filing",
    task_short_description: "Regulatory Filing Preparation",
    frequency: "Monthly" as const,
    task_due_date: "2025-02-15",
    status: "active" as const,
    description: "Prepare and review regulatory forms before filing deadlines.",
    subtasks: [
      {
        subtask_id: "cat-8-1",
        subtask_short_description: "Identify required forms",
        status: "due" as const,
        period_considered: "Feb 2025",
        employees_analyzed: 4,
        employee_contributions: mockEmployeeContributions.slice(0, 2),
        instructions: "List all forms due this month.",
      },
      {
        subtask_id: "cat-8-2",
        subtask_short_description: "Assign form preparation",
        status: "due" as const,
        period_considered: "Feb 2025",
        employees_analyzed: 4,
        employee_contributions: mockEmployeeContributions.slice(0, 2),
        instructions: "Assign forms to responsible staff.",
      },
      {
        subtask_id: "cat-8-3",
        subtask_short_description: "Review completed forms",
        status: "due" as const,
        period_considered: "Feb 2025",
        employees_analyzed: 4,
        employee_contributions: mockEmployeeContributions.slice(0, 2),
        instructions: "Review forms for accuracy.",
      },
      {
        subtask_id: "cat-8-4",
        subtask_short_description: "Submit forms",
        status: "due" as const,
        period_considered: "Feb 2025",
        employees_analyzed: 4,
        employee_contributions: mockEmployeeContributions.slice(0, 2),
        instructions: "Submit forms to regulators.",
      },
      {
        subtask_id: "cat-8-5",
        subtask_short_description: "Confirm submission",
        status: "due" as const,
        period_considered: "Feb 2025",
        employees_analyzed: 4,
        employee_contributions: mockEmployeeContributions.slice(0, 2),
        instructions: "Confirm all forms were submitted.",
      },
    ],
  },
  // Alerts & Monitoring tasks
  {
    task_id: "alerts-001",
    task_category: "Alerts & Monitoring",
    task_short_description: "Daily Transaction Monitoring",
    frequency: "Daily" as const,
    task_due_date: "2025-01-25",
    status: "active" as const,
    description:
      "Monitor daily transactions for suspicious activities and ensure AML compliance protocols are followed.",
    subtasks: [
      {
        subtask_id: "alerts-001-01",
        subtask_short_description:
          "Initial scan of all transactions for red flags and anomalies.",
        status: "completed" as const,
        started_at: "2025-01-24 08:00",
        completed_at: "2025-01-24 10:30",
        duration: "2 hours 30 min",
        period_considered: "Jan 24, 2025",
        employees_analyzed: 8,
        employee_contributions: mockEmployeeContributions.slice(0, 3),
        instructions: `GOAL\nScan all transactions for red flags and anomalies. Ensure findings are documented and escalated as needed.\n\nWHAT SHOULD SOPHIA MONITOR OR LOOK FOR\n- System scan logs\n- Email alerts for flagged transactions\n- Worklist for escalation status\n⚠️ Adjust for weekends and Xponance holidays.`,
      },
      {
        subtask_id: "alerts-001-02",
        subtask_short_description:
          "Review flagged transactions for potential false positives.",
        status: "in-progress" as const,
        started_at: "2025-01-24 11:00",
        period_considered: "Jan 24, 2025",
        employees_analyzed: 5,
        employee_contributions: mockEmployeeContributions.slice(0, 2),
        instructions: `GOAL\nReview flagged transactions for potential false positives. Ensure accurate categorization and documentation.\n\nWHAT SHOULD SOPHIA MONITOR OR LOOK FOR\n- Analyst review notes\n- Email updates on review status\n- Worklist for documentation\n⚠️ Adjust for weekends and Xponance holidays.`,
      },
      {
        subtask_id: "alerts-001-03",
        subtask_short_description:
          "Escalate suspicious cases to compliance team for further investigation.",
        status: "due" as const,
        period_considered: "Jan 24, 2025",
        employees_analyzed: 2,
        employee_contributions: mockEmployeeContributions.slice(0, 1),
        instructions: `GOAL\nEscalate suspicious cases to the compliance team for further investigation. Track escalation and resolution status.\n\nWHAT SHOULD SOPHIA MONITOR OR LOOK FOR\n- Worklist for escalation entries\n- Email notifications to compliance team\n- Calendar for follow-up deadlines\n⚠️ Adjust for weekends and Xponance holidays.`,
      },
      {
        subtask_id: "alerts-001-04",
        subtask_short_description:
          "Document findings and update monitoring logs.",
        status: "due" as const,
        period_considered: "Jan 24, 2025",
        employees_analyzed: 1,
        employee_contributions: mockEmployeeContributions.slice(0, 1),
        instructions: `GOAL\nDocument findings from transaction monitoring and update logs. Ensure all actions are recorded.\n\nWHAT SHOULD SOPHIA MONITOR OR LOOK FOR\n- Monitoring logs for documentation\n- Email confirmations of updates\n- Worklist for completed actions\n⚠️ Adjust for weekends and Xponance holidays.`,
      },
      {
        subtask_id: "alerts-001-05",
        subtask_short_description:
          "Prepare daily summary report for management review.",
        status: "due" as const,
        period_considered: "Jan 24, 2025",
        employees_analyzed: 1,
        employee_contributions: mockEmployeeContributions.slice(0, 1),
        instructions: `GOAL\nPrepare and submit daily summary report for management review. Ensure report accuracy and timely delivery.\n\nWHAT SHOULD SOPHIA MONITOR OR LOOK FOR\n- Email sent status for report\n- Worklist for report submission\n- Calendar for daily deadlines\n⚠️ Adjust for weekends and Xponance holidays.`,
      },
    ],
  },
  {
    task_id: "alerts-002",
    task_category: "Alerts & Monitoring",
    task_short_description: "Weekly Suspicious Activity Review",
    frequency: "Weekly" as const,
    task_due_date: "2025-01-28",
    status: "active" as const,
    description:
      "Conduct weekly review of suspicious activity alerts and ensure timely resolution.",
    subtasks: [
      {
        subtask_id: "alerts-002-01",
        subtask_short_description:
          "Aggregate all suspicious activity alerts generated during the week.",
        status: "completed" as const,
        started_at: "2025-01-21 09:00",
        completed_at: "2025-01-21 10:00",
        duration: "1 hour",
        period_considered: "Jan 15, 2025 - Jan 21, 2025",
        employees_analyzed: 6,
        employee_contributions: mockEmployeeContributions.slice(0, 4),
      },
      {
        subtask_id: "alerts-002-02",
        subtask_short_description:
          "Categorize alerts by risk level and assign to analysts.",
        status: "in-progress" as const,
        started_at: "2025-01-21 10:15",
        period_considered: "Jan 21, 2025",
        employees_analyzed: 3,
        employee_contributions: mockEmployeeContributions.slice(0, 2),
      },
      {
        subtask_id: "alerts-002-03",
        subtask_short_description:
          "Review high-risk alerts for immediate action.",
        status: "due" as const,
        period_considered: "Jan 21, 2025",
        employees_analyzed: 2,
        employee_contributions: mockEmployeeContributions.slice(0, 1),
      },
      {
        subtask_id: "alerts-002-04",
        subtask_short_description:
          "Document actions taken and update alert status.",
        status: "due" as const,
        period_considered: "Jan 21, 2025",
        employees_analyzed: 1,
        employee_contributions: mockEmployeeContributions.slice(0, 1),
      },
      {
        subtask_id: "alerts-002-05",
        subtask_short_description:
          "Prepare weekly summary report for compliance.",
        status: "due" as const,
        period_considered: "Jan 21, 2025",
        employees_analyzed: 1,
        employee_contributions: mockEmployeeContributions.slice(0, 1),
      },
    ],
  },
  {
    task_id: "alerts-003",
    task_category: "Alerts & Monitoring",
    task_short_description: "Monthly AML System Check",
    frequency: "Monthly" as const,
    task_due_date: "2025-02-01",
    status: "active" as const,
    description:
      "Perform monthly anti-money laundering system checks and validations.",
    subtasks: [
      {
        subtask_id: "alerts-003-01",
        subtask_short_description:
          "Run system diagnostics and check for anomalies.",
        status: "completed" as const,
        started_at: "2025-01-31 08:00",
        completed_at: "2025-01-31 09:00",
        duration: "1 hour",
        period_considered: "Jan 31, 2025",
        employees_analyzed: 4,
        employee_contributions: mockEmployeeContributions.slice(0, 2),
      },
      {
        subtask_id: "alerts-003-02",
        subtask_short_description:
          "Validate system rules and update as needed.",
        status: "in-progress" as const,
        started_at: "2025-01-31 09:15",
        period_considered: "Jan 31, 2025",
        employees_analyzed: 2,
        employee_contributions: mockEmployeeContributions.slice(0, 1),
      },
      {
        subtask_id: "alerts-003-03",
        subtask_short_description:
          "Test alert generation and escalation protocols.",
        status: "due" as const,
        period_considered: "Jan 31, 2025",
        employees_analyzed: 2,
        employee_contributions: mockEmployeeContributions.slice(0, 1),
      },
      {
        subtask_id: "alerts-003-04",
        subtask_short_description:
          "Document system performance and issues found.",
        status: "due" as const,
        period_considered: "Jan 31, 2025",
        employees_analyzed: 1,
        employee_contributions: mockEmployeeContributions.slice(0, 1),
      },
      {
        subtask_id: "alerts-003-05",
        subtask_short_description: "Prepare monthly AML system check report.",
        status: "due" as const,
        period_considered: "Jan 31, 2025",
        employees_analyzed: 1,
        employee_contributions: mockEmployeeContributions.slice(0, 1),
      },
    ],
  },
  {
    task_id: "alerts-004",
    task_category: "Alerts & Monitoring",
    task_short_description: "Quarterly System Audit",
    frequency: "Quarterly" as const,
    task_due_date: "2025-03-31",
    status: "active" as const,
    description: "Conduct quarterly audit of all alert and monitoring systems.",
    subtasks: [
      {
        subtask_id: "alerts-004-01",
        subtask_short_description:
          "Audit system logs for completeness and accuracy.",
        status: "completed" as const,
        started_at: "2025-03-01 10:00",
        completed_at: "2025-03-01 12:00",
        duration: "2 hours",
        period_considered: "Mar 1, 2025",
        employees_analyzed: 3,
        employee_contributions: mockEmployeeContributions.slice(0, 2),
      },
      {
        subtask_id: "alerts-004-02",
        subtask_short_description:
          "Review audit findings and assign remediation tasks.",
        status: "in-progress" as const,
        started_at: "2025-03-01 12:15",
        period_considered: "Mar 1, 2025",
        employees_analyzed: 2,
        employee_contributions: mockEmployeeContributions.slice(0, 1),
      },
      {
        subtask_id: "alerts-004-03",
        subtask_short_description:
          "Remediate identified issues and document actions taken.",
        status: "due" as const,
        period_considered: "Mar 1, 2025",
        employees_analyzed: 2,
        employee_contributions: mockEmployeeContributions.slice(0, 1),
      },
      {
        subtask_id: "alerts-004-04",
        subtask_short_description:
          "Verify remediation effectiveness and close audit.",
        status: "due" as const,
        period_considered: "Mar 1, 2025",
        employees_analyzed: 1,
        employee_contributions: mockEmployeeContributions.slice(0, 1),
      },
      {
        subtask_id: "alerts-004-05",
        subtask_short_description:
          "Prepare quarterly audit summary for management.",
        status: "due" as const,
        period_considered: "Mar 1, 2025",
        employees_analyzed: 1,
        employee_contributions: mockEmployeeContributions.slice(0, 1),
      },
    ],
  },
  {
    task_id: "alerts-005",
    task_category: "Alerts & Monitoring",
    task_short_description: "Real-Time Alert Response",
    frequency: "Daily" as const,
    task_due_date: "2025-01-30",
    status: "active" as const,
    description:
      "Respond to real-time alerts and ensure immediate action is taken.",
    subtasks: [
      {
        subtask_id: "alerts-005-01",
        subtask_short_description:
          "Monitor real-time alert dashboard for new incidents.",
        status: "completed" as const,
        started_at: "2025-01-29 08:00",
        completed_at: "2025-01-29 09:00",
        duration: "1 hour",
        period_considered: "Jan 29, 2025",
        employees_analyzed: 4,
        employee_contributions: mockEmployeeContributions.slice(0, 2),
      },
      {
        subtask_id: "alerts-005-02",
        subtask_short_description:
          "Acknowledge and assign alerts to response team.",
        status: "in-progress" as const,
        started_at: "2025-01-29 09:15",
        period_considered: "Jan 29, 2025",
        employees_analyzed: 2,
        employee_contributions: mockEmployeeContributions.slice(0, 1),
      },
      {
        subtask_id: "alerts-005-03",
        subtask_short_description:
          "Investigate alert details and determine severity.",
        status: "due" as const,
        period_considered: "Jan 29, 2025",
        employees_analyzed: 2,
        employee_contributions: mockEmployeeContributions.slice(0, 1),
      },
      {
        subtask_id: "alerts-005-04",
        subtask_short_description: "Escalate critical alerts to management.",
        status: "due" as const,
        period_considered: "Jan 29, 2025",
        employees_analyzed: 1,
        employee_contributions: mockEmployeeContributions.slice(0, 1),
      },
      {
        subtask_id: "alerts-005-05",
        subtask_short_description: "Document response actions and close alert.",
        status: "due" as const,
        period_considered: "Jan 29, 2025",
        employees_analyzed: 1,
        employee_contributions: mockEmployeeContributions.slice(0, 1),
      },
    ],
  },
  {
    task_id: "alerts-006",
    task_category: "Alerts & Monitoring",
    task_short_description: "Automated Alert Testing",
    frequency: "Weekly" as const,
    task_due_date: "2025-02-05",
    status: "active" as const,
    description: "Test automated alert generation and escalation workflows.",
    subtasks: [
      {
        subtask_id: "alerts-006-01",
        subtask_short_description: "Run automated alert test scripts.",
        status: "completed" as const,
        started_at: "2025-02-04 10:00",
        completed_at: "2025-02-04 11:00",
        duration: "1 hour",
        period_considered: "Feb 4, 2025",
        employees_analyzed: 3,
        employee_contributions: mockEmployeeContributions.slice(0, 2),
      },
      {
        subtask_id: "alerts-006-02",
        subtask_short_description: "Review test results and identify failures.",
        status: "in-progress" as const,
        started_at: "2025-02-04 11:15",
        period_considered: "Feb 4, 2025",
        employees_analyzed: 2,
        employee_contributions: mockEmployeeContributions.slice(0, 1),
      },
      {
        subtask_id: "alerts-006-03",
        subtask_short_description: "Fix issues found during testing.",
        status: "due" as const,
        period_considered: "Feb 4, 2025",
        employees_analyzed: 2,
        employee_contributions: mockEmployeeContributions.slice(0, 1),
      },
      {
        subtask_id: "alerts-006-04",
        subtask_short_description: "Re-run tests to confirm fixes.",
        status: "due" as const,
        period_considered: "Feb 4, 2025",
        employees_analyzed: 1,
        employee_contributions: mockEmployeeContributions.slice(0, 1),
      },
      {
        subtask_id: "alerts-006-05",
        subtask_short_description:
          "Document test results and update procedures.",
        status: "due" as const,
        period_considered: "Feb 4, 2025",
        employees_analyzed: 1,
        employee_contributions: mockEmployeeContributions.slice(0, 1),
      },
    ],
  },
  {
    task_id: "alerts-007",
    task_category: "Alerts & Monitoring",
    task_short_description: "Alert System Maintenance",
    frequency: "Monthly" as const,
    task_due_date: "2025-02-10",
    status: "active" as const,
    description:
      "Perform regular maintenance on alert systems to ensure reliability.",
    subtasks: [
      {
        subtask_id: "alerts-007-01",
        subtask_short_description: "Check system health and update software.",
        status: "completed" as const,
        started_at: "2025-02-09 09:00",
        completed_at: "2025-02-09 10:00",
        duration: "1 hour",
        period_considered: "Feb 9, 2025",
        employees_analyzed: 3,
        employee_contributions: mockEmployeeContributions.slice(0, 2),
      },
      {
        subtask_id: "alerts-007-02",
        subtask_short_description:
          "Test alert delivery and notification systems.",
        status: "in-progress" as const,
        started_at: "2025-02-09 10:15",
        period_considered: "Feb 9, 2025",
        employees_analyzed: 2,
        employee_contributions: mockEmployeeContributions.slice(0, 1),
      },
      {
        subtask_id: "alerts-007-03",
        subtask_short_description:
          "Review maintenance logs and resolve issues.",
        status: "due" as const,
        period_considered: "Feb 9, 2025",
        employees_analyzed: 2,
        employee_contributions: mockEmployeeContributions.slice(0, 1),
      },
      {
        subtask_id: "alerts-007-04",
        subtask_short_description:
          "Update documentation and maintenance schedules.",
        status: "due" as const,
        period_considered: "Feb 9, 2025",
        employees_analyzed: 1,
        employee_contributions: mockEmployeeContributions.slice(0, 1),
      },
      {
        subtask_id: "alerts-007-05",
        subtask_short_description:
          "Report maintenance completion to management.",
        status: "due" as const,
        period_considered: "Feb 9, 2025",
        employees_analyzed: 1,
        employee_contributions: mockEmployeeContributions.slice(0, 1),
      },
    ],
  },
  {
    task_id: "alerts-008",
    task_category: "Alerts & Monitoring",
    task_short_description: "Incident Response Drill",
    frequency: "Quarterly" as const,
    task_due_date: "2025-03-15",
    status: "active" as const,
    description:
      "Conduct quarterly incident response drills to test alert handling procedures.",
    subtasks: [
      {
        subtask_id: "alerts-008-01",
        subtask_short_description: "Plan and schedule incident response drill.",
        status: "completed" as const,
        started_at: "2025-03-10 14:00",
        completed_at: "2025-03-10 15:00",
        duration: "1 hour",
        period_considered: "Mar 10, 2025",
        employees_analyzed: 4,
        employee_contributions: mockEmployeeContributions.slice(0, 2),
      },
      {
        subtask_id: "alerts-008-02",
        subtask_short_description:
          "Simulate alert scenario and initiate response.",
        status: "in-progress" as const,
        started_at: "2025-03-10 15:15",
        period_considered: "Mar 10, 2025",
        employees_analyzed: 2,
        employee_contributions: mockEmployeeContributions.slice(0, 1),
      },
      {
        subtask_id: "alerts-008-03",
        subtask_short_description:
          "Evaluate team response and identify improvement areas.",
        status: "due" as const,
        period_considered: "Mar 10, 2025",
        employees_analyzed: 2,
        employee_contributions: mockEmployeeContributions.slice(0, 1),
      },
      {
        subtask_id: "alerts-008-04",
        subtask_short_description:
          "Document drill results and lessons learned.",
        status: "due" as const,
        period_considered: "Mar 10, 2025",
        employees_analyzed: 1,
        employee_contributions: mockEmployeeContributions.slice(0, 1),
      },
      {
        subtask_id: "alerts-008-05",
        subtask_short_description:
          "Update incident response plan based on drill outcomes.",
        status: "due" as const,
        period_considered: "Mar 10, 2025",
        employees_analyzed: 1,
        employee_contributions: mockEmployeeContributions.slice(0, 1),
      },
    ],
  },
];

export const mockDashboardMetrics: DashboardMetrics = {
  active_tasks: 12,
  due_this_week: 5,
  completed: 28,
  actions_pending: 7,
};
