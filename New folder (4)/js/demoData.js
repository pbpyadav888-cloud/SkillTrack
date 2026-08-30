/**
 * SkillTrack - Comprehensive Synthetic Demo Data
 * Contains 50+ diverse trainees, 5 training providers, 6 core training courses,
 * industry skill demand maps, and longitudinal survey histories.
 * Clearly labeled as DEMO DATA.
 */

const DEMO_PROVIDERS = [
  {
    id: "PROV-001",
    name: "Apex Tech Institute",
    code: "ATI-IND",
    type: "Technical Institute",
    location: "Bengaluru, Karnataka (South)",
    rating: 4.8,
    accreditation: "National Skill Development Council (NSDC) - Grade A+",
    totalTrainees: 1840,
    completionRate: 94.2,
    employmentRate: 88.5,
    selfEmploymentRate: 6.2,
    avgSalary: 42500,
    retention6m: 91.4,
    retention12m: 86.8,
    skillUtilization: 89.2,
    topCourses: ["Cloud & DevOps Engineering", "Full Stack Web Development", "Data Analytics & AI"]
  },
  {
    id: "PROV-002",
    name: "FutureSkills Academy",
    code: "FSA-DEL",
    type: "Vocational Academy",
    location: "New Delhi, Delhi NCR (North)",
    rating: 4.6,
    accreditation: "State Skilling Mission - Grade A",
    totalTrainees: 1420,
    completionRate: 91.0,
    employmentRate: 83.4,
    selfEmploymentRate: 9.8,
    avgSalary: 38200,
    retention6m: 87.5,
    retention12m: 82.1,
    skillUtilization: 84.6,
    topCourses: ["Data Analytics & AI", "Digital Marketing & E-Commerce"]
  },
  {
    id: "PROV-003",
    name: "National Skill Center",
    code: "NSC-HYD",
    type: "Public-Private Skilling Center",
    location: "Hyderabad, Telangana (South)",
    rating: 4.5,
    accreditation: "Ministry of Skill Development & Entrepreneurship",
    totalTrainees: 2150,
    completionRate: 89.4,
    employmentRate: 79.2,
    selfEmploymentRate: 11.5,
    avgSalary: 34800,
    retention6m: 84.0,
    retention12m: 78.5,
    skillUtilization: 81.3,
    topCourses: ["Advanced Manufacturing & IoT", "Healthcare Support & Nursing"]
  },
  {
    id: "PROV-004",
    name: "Horizon Vocational Institute",
    code: "HVI-PUN",
    type: "Industry Consortium",
    location: "Pune, Maharashtra (West)",
    rating: 4.7,
    accreditation: "Sector Skill Council (SSC) Certified",
    totalTrainees: 1280,
    completionRate: 92.8,
    employmentRate: 85.6,
    selfEmploymentRate: 7.4,
    avgSalary: 39600,
    retention6m: 89.2,
    retention12m: 84.3,
    skillUtilization: 87.0,
    topCourses: ["Cloud & DevOps Engineering", "Advanced Manufacturing & IoT"]
  },
  {
    id: "PROV-005",
    name: "TechBridge Foundation",
    code: "TBF-KOL",
    type: "Non-Profit Skilling Foundation",
    location: "Kolkata, West Bengal (East)",
    rating: 4.4,
    accreditation: "National Skill Mission Partner",
    totalTrainees: 980,
    completionRate: 86.5,
    employmentRate: 74.8,
    selfEmploymentRate: 14.2,
    avgSalary: 31500,
    retention6m: 79.6,
    retention12m: 73.2,
    skillUtilization: 77.8,
    topCourses: ["Digital Marketing & E-Commerce", "Healthcare Support & Nursing"]
  }
];

const DEMO_COURSES = [
  {
    id: "CRS-101",
    title: "Data Analytics & AI",
    category: "Information Technology",
    durationWeeks: 24,
    skillsTaught: ["Python", "SQL", "Tableau", "Power BI", "Data Modeling", "Machine Learning Basics", "Excel"],
    industryDemandIndex: 94,
    avgCompletionRate: 91.5,
    avgEmploymentRate: 86.2,
    avgStartingSalary: 45000,
    targetIndustries: ["FinTech", "E-commerce", "SaaS", "Consulting", "Healthcare Tech"]
  },
  {
    id: "CRS-102",
    title: "Cloud & DevOps Engineering",
    category: "Information Technology",
    durationWeeks: 20,
    skillsTaught: ["Linux", "AWS", "Docker", "CI/CD Pipelines", "Git", "Terraform", "Bash Scripting"],
    industryDemandIndex: 98,
    avgCompletionRate: 93.0,
    avgEmploymentRate: 90.4,
    avgStartingSalary: 52000,
    targetIndustries: ["Cloud Infrastructure", "Enterprise Tech", "Telecommunications", "Banking"]
  },
  {
    id: "CRS-103",
    title: "Full Stack Web Development",
    category: "Software Engineering",
    durationWeeks: 26,
    skillsTaught: ["HTML5/CSS3", "JavaScript (ES6+)", "React.js", "Node.js", "Express", "MongoDB", "PostgreSQL", "REST APIs"],
    industryDemandIndex: 91,
    avgCompletionRate: 89.8,
    avgEmploymentRate: 84.0,
    avgStartingSalary: 42000,
    targetIndustries: ["Software Services", "Product Startups", "Digital Agencies", "EdTech"]
  },
  {
    id: "CRS-104",
    title: "Healthcare Support & Nursing",
    category: "Healthcare & Life Sciences",
    durationWeeks: 32,
    skillsTaught: ["Patient Care", "Vital Signs Monitoring", "First Aid & CPR", "Medical Records (EHR)", "Infection Control", "Pharmacology Basics"],
    industryDemandIndex: 88,
    avgCompletionRate: 94.0,
    avgEmploymentRate: 87.5,
    avgStartingSalary: 28000,
    targetIndustries: ["Hospitals", "Diagnostic Clinics", "Home Healthcare", "Elder Care Facilities"]
  },
  {
    id: "CRS-105",
    title: "Digital Marketing & E-Commerce",
    category: "Marketing & Growth",
    durationWeeks: 16,
    skillsTaught: ["Search Engine Optimization (SEO)", "Google Ads", "Meta Ads", "Content Strategy", "Email Marketing", "Shopify Setup", "Google Analytics 4"],
    industryDemandIndex: 82,
    avgCompletionRate: 87.2,
    avgEmploymentRate: 77.8,
    avgStartingSalary: 30000,
    targetIndustries: ["D2C Brands", "Digital Agencies", "Retail Companies", "Media Houses"]
  },
  {
    id: "CRS-106",
    title: "Advanced Manufacturing & IoT",
    category: "Industrial Automation",
    durationWeeks: 28,
    skillsTaught: ["PLC Programming", "SCADA", "IoT Sensor Networks", "Quality Control", "AutoCAD Basics", "Industrial Robotics"],
    industryDemandIndex: 89,
    avgCompletionRate: 90.1,
    avgEmploymentRate: 82.3,
    avgStartingSalary: 36000,
    targetIndustries: ["Automotive", "Electronics Manufacturing", "Renewable Energy", "Aerospace Ancillaries"]
  }
];

const DEMO_INDUSTRY_DEMAND = {
  "Data Analytics & AI": {
    demandedSkills: ["Python", "SQL", "Power BI", "Tableau", "Machine Learning Basics", "Data Modeling", "Cloud Data Warehousing (Snowflake)", "Generative AI Prompting"],
    emergingSkills: ["Generative AI Prompting", "Snowflake", "dbt", "Vector DBs"],
    hiringDemandGrowth: "+32% YoY",
    avgMarketSalary: 48000
  },
  "Cloud & DevOps Engineering": {
    demandedSkills: ["AWS", "Docker", "Kubernetes", "CI/CD Pipelines", "Terraform", "Linux", "Git", "Cloud Security", "Observability (Prometheus)"],
    emergingSkills: ["Kubernetes", "Cloud Security", "FinOps", "IaC"],
    hiringDemandGrowth: "+41% YoY",
    avgMarketSalary: 55000
  },
  "Full Stack Web Development": {
    demandedSkills: ["JavaScript (ES6+)", "React.js", "Node.js", "TypeScript", "Next.js", "REST APIs", "PostgreSQL", "Tailwind CSS"],
    emergingSkills: ["TypeScript", "Next.js", "GraphQL", "Tailwind CSS"],
    hiringDemandGrowth: "+24% YoY",
    avgMarketSalary: 46000
  },
  "Healthcare Support & Nursing": {
    demandedSkills: ["Patient Care", "Vital Signs Monitoring", "EHR Software", "Infection Control", "Emergency Triage", "Geriatric Care", "Basic Life Support (BLS)"],
    emergingSkills: ["Telehealth Operations", "Digital EHR", "Geriatric Specialization"],
    hiringDemandGrowth: "+28% YoY",
    avgMarketSalary: 31000
  },
  "Digital Marketing & E-Commerce": {
    demandedSkills: ["SEO", "Google Ads", "Meta Ads", "Google Analytics 4", "Performance Marketing", "Shopify", "AI Copywriting Tools"],
    emergingSkills: ["Performance Marketing", "AI Copywriting Tools", "Omnichannel Attribution"],
    hiringDemandGrowth: "+19% YoY",
    avgMarketSalary: 34000
  },
  "Advanced Manufacturing & IoT": {
    demandedSkills: ["PLC Programming", "SCADA", "IoT Sensor Networks", "Predictive Maintenance", "Industrial Robotics", "AutoCAD", "Six Sigma Basics"],
    emergingSkills: ["Predictive Maintenance", "Industrial Robotics", "Digital Twin"],
    hiringDemandGrowth: "+27% YoY",
    avgMarketSalary: 39000
  }
};

const DEMO_TRAINEES = [
  {
    id: "TRN-1001",
    name: "Priya Sharma",
    age: 23,
    gender: "Female",
    education: "Bachelor's Degree",
    location: "Bengaluru, Karnataka",
    region: "South",
    tier: "Tier-1 Metro",
    contact: {
      email: "priya.sharma@example.com",
      phone: "+91 98765 43210"
    },
    courseId: "CRS-101",
    courseTitle: "Data Analytics & AI",
    providerId: "PROV-001",
    providerName: "Apex Tech Institute",
    courseCompletionDate: "2025-06-15",
    skillsAcquired: ["Python", "SQL", "Tableau", "Power BI", "Excel", "Data Modeling"],
    consent: {
      granted: true,
      timestamp: "2025-01-10T09:30:00Z",
      shareWithEmployers: true,
      participateLongitudinalSurveys: true,
      anonymizedResearchConsent: true
    },
    employmentStatus: "Employed",
    occupation: "Junior Data Analyst",
    employer: "Flipkart Tech Services",
    employerSector: "E-Commerce",
    preTrainingSalary: 12000,
    currentSalary: 45000,
    employmentStartDate: "2025-07-20",
    employmentDurationMonths: 14,
    isSelfEmployed: false,
    skillUtilizationRate: 92,
    timeToEmploymentDays: 35,
    journey: [
      { step: "Training Enrolled", date: "2025-01-15", status: "completed", note: "Enrolled in Data Analytics & AI cohort." },
      { step: "Course Completion", date: "2025-06-15", status: "completed", note: "Graduated with Distinction (92% Score)." },
      { step: "Job Search", date: "2025-06-20", status: "completed", note: "Applied to 8 partner employers via Career Cell." },
      { step: "Employment", date: "2025-07-20", status: "completed", note: "Hired as Junior Data Analyst at ₹45,000/mo." },
      { step: "Salary Progression", date: "2026-01-15", status: "completed", note: "Promoted to Associate Analyst, salary revised to ₹52,000/mo." },
      { step: "Retention Milestone", date: "2026-07-20", status: "completed", note: "12-month employment milestone achieved successfully." }
    ],
    surveys: {
      "3m": { completed: true, date: "2025-10-20", employed: true, jobTitle: "Junior Data Analyst", salary: 45000, usingSkills: true, satisfaction: 5, missingSkills: ["Snowflake"] },
      "6m": { completed: true, date: "2026-01-20", employed: true, jobTitle: "Associate Analyst", salary: 52000, usingSkills: true, satisfaction: 5, missingSkills: ["AWS Redshift"] },
      "12m": { completed: true, date: "2026-07-20", employed: true, jobTitle: "Associate Analyst", salary: 54000, usingSkills: true, satisfaction: 5, missingSkills: ["dbt"] }
    }
  },
  {
    id: "TRN-1002",
    name: "Rahul Verma",
    age: 25,
    gender: "Male",
    education: "Diploma in CS",
    location: "Pune, Maharashtra",
    region: "West",
    tier: "Tier-2",
    contact: {
      email: "rahul.verma@example.com",
      phone: "+91 98234 11223"
    },
    courseId: "CRS-102",
    courseTitle: "Cloud & DevOps Engineering",
    providerId: "PROV-004",
    providerName: "Horizon Vocational Institute",
    courseCompletionDate: "2025-05-10",
    skillsAcquired: ["Linux", "AWS", "Docker", "CI/CD Pipelines", "Git", "Bash Scripting"],
    consent: {
      granted: true,
      timestamp: "2024-12-01T10:15:00Z",
      shareWithEmployers: true,
      participateLongitudinalSurveys: true,
      anonymizedResearchConsent: true
    },
    employmentStatus: "Employed",
    occupation: "DevOps Associate",
    employer: "Persistent Systems",
    employerSector: "Enterprise IT",
    preTrainingSalary: 0,
    currentSalary: 52000,
    employmentStartDate: "2025-06-15",
    employmentDurationMonths: 15,
    isSelfEmployed: false,
    skillUtilizationRate: 95,
    timeToEmploymentDays: 36,
    journey: [
      { step: "Training Enrolled", date: "2024-12-10", status: "completed", note: "Enrolled in Cloud & DevOps program." },
      { step: "Course Completion", date: "2025-05-10", status: "completed", note: "Completed AWS Certified Cloud Practitioner." },
      { step: "Job Search", date: "2025-05-18", status: "completed", note: "Interviewed at 3 enterprise partners." },
      { step: "Employment", date: "2025-06-15", status: "completed", note: "Joined Persistent Systems as DevOps Associate." },
      { step: "Salary Progression", date: "2026-03-01", status: "completed", note: "Performance appraisal: +15% increment to ₹60,000/mo." },
      { step: "Retention Milestone", date: "2026-06-15", status: "completed", note: "12-month retention verified." }
    ],
    surveys: {
      "3m": { completed: true, date: "2025-09-15", employed: true, jobTitle: "DevOps Associate", salary: 52000, usingSkills: true, satisfaction: 5, missingSkills: ["Kubernetes"] },
      "6m": { completed: true, date: "2025-12-15", employed: true, jobTitle: "DevOps Associate", salary: 52000, usingSkills: true, satisfaction: 4, missingSkills: ["Terraform Advanced"] },
      "12m": { completed: true, date: "2026-06-15", employed: true, jobTitle: "Senior DevOps Engineer", salary: 60000, usingSkills: true, satisfaction: 5, missingSkills: ["FinOps"] }
    }
  },
  {
    id: "TRN-1003",
    name: "Ananya Mukherjee",
    age: 22,
    gender: "Female",
    education: "Bachelor's Degree",
    location: "Kolkata, West Bengal",
    region: "East",
    tier: "Tier-1 Metro",
    contact: {
      email: "ananya.m@example.com",
      phone: "+91 97481 99887"
    },
    courseId: "CRS-103",
    courseTitle: "Full Stack Web Development",
    providerId: "PROV-005",
    providerName: "TechBridge Foundation",
    courseCompletionDate: "2025-07-30",
    skillsAcquired: ["HTML5/CSS3", "JavaScript (ES6+)", "React.js", "Node.js", "REST APIs"],
    consent: {
      granted: true,
      timestamp: "2025-01-20T11:00:00Z",
      shareWithEmployers: true,
      participateLongitudinalSurveys: true,
      anonymizedResearchConsent: true
    },
    employmentStatus: "Employed",
    occupation: "Frontend Developer",
    employer: "Wipro Digital",
    employerSector: "Software Consulting",
    preTrainingSalary: 0,
    currentSalary: 40000,
    employmentStartDate: "2025-09-10",
    employmentDurationMonths: 12,
    isSelfEmployed: false,
    skillUtilizationRate: 88,
    timeToEmploymentDays: 42,
    journey: [
      { step: "Training Enrolled", date: "2025-02-01", status: "completed", note: "Commenced full stack intensive bootcamp." },
      { step: "Course Completion", date: "2025-07-30", status: "completed", note: "Built capstone e-commerce portal project." },
      { step: "Job Search", date: "2025-08-05", status: "completed", note: "Attended campus recruitment drive." },
      { step: "Employment", date: "2025-09-10", status: "completed", note: "Accepted offer from Wipro Digital." },
      { step: "Salary Progression", date: "2026-04-01", status: "completed", note: "Wage progression to ₹46,000/mo." },
      { step: "Retention Milestone", date: "2026-09-10", status: "in_progress", note: "Approaching 12-month follow-up window." }
    ],
    surveys: {
      "3m": { completed: true, date: "2025-12-10", employed: true, jobTitle: "Frontend Developer", salary: 40000, usingSkills: true, satisfaction: 4, missingSkills: ["TypeScript"] },
      "6m": { completed: true, date: "2026-03-10", employed: true, jobTitle: "Frontend Developer", salary: 44000, usingSkills: true, satisfaction: 4, missingSkills: ["Next.js"] },
      "12m": { completed: false, date: "2026-09-10", employed: null, jobTitle: null, salary: null, usingSkills: null, satisfaction: null, missingSkills: [] }
    }
  },
  {
    id: "TRN-1004",
    name: "Vikramaditya Rao",
    age: 28,
    gender: "Male",
    education: "Diploma in Mechanical",
    location: "Hyderabad, Telangana",
    region: "South",
    tier: "Tier-1 Metro",
    contact: {
      email: "vikram.rao@example.com",
      phone: "+91 99490 88776"
    },
    courseId: "CRS-106",
    courseTitle: "Advanced Manufacturing & IoT",
    providerId: "PROV-003",
    providerName: "National Skill Center",
    courseCompletionDate: "2025-04-20",
    skillsAcquired: ["PLC Programming", "SCADA", "IoT Sensor Networks", "Quality Control"],
    consent: {
      granted: true,
      timestamp: "2024-09-15T14:20:00Z",
      shareWithEmployers: true,
      participateLongitudinalSurveys: true,
      anonymizedResearchConsent: true
    },
    employmentStatus: "Self-Employed",
    occupation: "Industrial Automation Consultant",
    employer: "V-Rao Automation Labs (Freelance/Sole Proprietor)",
    employerSector: "Manufacturing Consulting",
    preTrainingSalary: 14000,
    currentSalary: 48000,
    employmentStartDate: "2025-06-01",
    employmentDurationMonths: 15,
    isSelfEmployed: true,
    skillUtilizationRate: 90,
    timeToEmploymentDays: 41,
    journey: [
      { step: "Training Enrolled", date: "2024-10-01", status: "completed", note: "Enrolled in smart factory IoT technician track." },
      { step: "Course Completion", date: "2025-04-20", status: "completed", note: "Certified in Siemens S7 PLC & Node-RED IoT." },
      { step: "Job Search", date: "2025-05-01", status: "completed", note: "Launched independent automation consultancy." },
      { step: "Employment", date: "2025-06-01", status: "completed", note: "Secured first 3 SME manufacturing plant contracts." },
      { step: "Salary Progression", date: "2026-01-01", status: "completed", note: "Monthly average client billing expanded to ₹48,000." },
      { step: "Retention Milestone", date: "2026-06-01", status: "completed", note: "Sustained profitable self-employment past 12 months." }
    ],
    surveys: {
      "3m": { completed: true, date: "2025-09-01", employed: true, jobTitle: "Automation Consultant", salary: 38000, usingSkills: true, satisfaction: 5, missingSkills: ["Robotics Arm Programming"] },
      "6m": { completed: true, date: "2025-12-01", employed: true, jobTitle: "Automation Consultant", salary: 44000, usingSkills: true, satisfaction: 5, missingSkills: ["Industrial Cybersecurity"] },
      "12m": { completed: true, date: "2026-06-01", employed: true, jobTitle: "Automation Consultant", salary: 48000, usingSkills: true, satisfaction: 5, missingSkills: ["Predictive Maintenance AI"] }
    }
  },
  {
    id: "TRN-1005",
    name: "Sunita Kumari",
    age: 26,
    gender: "Female",
    education: "Senior Secondary (12th)",
    location: "Ranchi, Jharkhand",
    region: "East",
    tier: "Tier-3",
    contact: {
      email: "sunita.k@example.com",
      phone: "+91 94311 22334"
    },
    courseId: "CRS-104",
    courseTitle: "Healthcare Support & Nursing",
    providerId: "PROV-003",
    providerName: "National Skill Center",
    courseCompletionDate: "2025-05-30",
    skillsAcquired: ["Patient Care", "Vital Signs Monitoring", "First Aid & CPR", "Infection Control"],
    consent: {
      granted: true,
      timestamp: "2024-09-28T08:45:00Z",
      shareWithEmployers: true,
      participateLongitudinalSurveys: true,
      anonymizedResearchConsent: true
    },
    employmentStatus: "Employed",
    occupation: "Patient Care Coordinator",
    employer: "Apollo Clinic Regional Center",
    employerSector: "Healthcare",
    preTrainingSalary: 0,
    currentSalary: 28500,
    employmentStartDate: "2025-07-01",
    employmentDurationMonths: 14,
    isSelfEmployed: false,
    skillUtilizationRate: 94,
    timeToEmploymentDays: 31,
    journey: [
      { step: "Training Enrolled", date: "2024-10-15", status: "completed", note: "Vocational healthcare certification." },
      { step: "Course Completion", date: "2025-05-30", status: "completed", note: "Completed clinical internship with honors." },
      { step: "Job Search", date: "2025-06-05", status: "completed", note: "Hospital placement drive interview." },
      { step: "Employment", date: "2025-07-01", status: "completed", note: "Full-time placement at Apollo Clinic." },
      { step: "Salary Progression", date: "2026-02-15", status: "completed", note: "Shift allowance & increment to ₹31,000/mo." },
      { step: "Retention Milestone", date: "2026-07-01", status: "completed", note: "12-month retention verified." }
    ],
    surveys: {
      "3m": { completed: true, date: "2025-10-01", employed: true, jobTitle: "Patient Care Coordinator", salary: 28500, usingSkills: true, satisfaction: 5, missingSkills: ["Advanced EHR Systems"] },
      "6m": { completed: true, date: "2026-01-01", employed: true, jobTitle: "Patient Care Coordinator", salary: 30000, usingSkills: true, satisfaction: 5, missingSkills: ["Telemedicine Triaging"] },
      "12m": { completed: true, date: "2026-07-01", employed: true, jobTitle: "Senior Care Coordinator", salary: 31000, usingSkills: true, satisfaction: 5, missingSkills: ["Geriatric Specialized Care"] }
    }
  },
  {
    id: "TRN-1006",
    name: "Mohammad Farhan",
    age: 24,
    gender: "Male",
    education: "Bachelor of Commerce",
    location: "Lucknow, Uttar Pradesh",
    region: "North",
    tier: "Tier-2",
    contact: {
      email: "farhan.m@example.com",
      phone: "+91 94150 77665"
    },
    courseId: "CRS-105",
    courseTitle: "Digital Marketing & E-Commerce",
    providerId: "PROV-002",
    providerName: "FutureSkills Academy",
    courseCompletionDate: "2025-08-15",
    skillsAcquired: ["SEO", "Google Ads", "Meta Ads", "Content Strategy", "Google Analytics 4"],
    consent: {
      granted: true,
      timestamp: "2025-04-10T12:00:00Z",
      shareWithEmployers: true,
      participateLongitudinalSurveys: true,
      anonymizedResearchConsent: true
    },
    employmentStatus: "Employed",
    occupation: "Performance Marketing Executive",
    employer: "Zomato Partner Agency",
    employerSector: "Digital Media",
    preTrainingSalary: 8000,
    currentSalary: 32000,
    employmentStartDate: "2025-09-25",
    employmentDurationMonths: 11,
    isSelfEmployed: false,
    skillUtilizationRate: 85,
    timeToEmploymentDays: 41,
    journey: [
      { step: "Training Enrolled", date: "2025-04-20", status: "completed", note: "Registered for Digital Growth Track." },
      { step: "Course Completion", date: "2025-08-15", status: "completed", note: "Passed Google Ads & GA4 certifications." },
      { step: "Job Search", date: "2025-08-20", status: "completed", note: "Created live portfolio campaign." },
      { step: "Employment", date: "2025-09-25", status: "completed", note: "Hired as Performance Marketing Executive." },
      { step: "Salary Progression", date: "2026-03-15", status: "completed", note: "Commission bonus lifted monthly income." },
      { step: "Retention Milestone", date: "2026-09-25", status: "in_progress", note: "11 months completed." }
    ],
    surveys: {
      "3m": { completed: true, date: "2025-12-25", employed: true, jobTitle: "Performance Marketing Exec", salary: 32000, usingSkills: true, satisfaction: 4, missingSkills: ["Shopify Liquid Scripting"] },
      "6m": { completed: true, date: "2026-03-25", employed: true, jobTitle: "Performance Marketing Exec", salary: 36000, usingSkills: true, satisfaction: 4, missingSkills: ["AI Creative Generation"] },
      "12m": { completed: false, date: "2026-09-25", employed: null, jobTitle: null, salary: null, usingSkills: null, satisfaction: null, missingSkills: [] }
    }
  },
  {
    id: "TRN-1007",
    name: "Deepak Choudhary",
    age: 27,
    gender: "Male",
    education: "Senior Secondary (12th)",
    location: "Jaipur, Rajasthan",
    region: "North",
    tier: "Tier-2",
    contact: {
      email: "deepak.c@example.com",
      phone: "+91 98290 33445"
    },
    courseId: "CRS-101",
    courseTitle: "Data Analytics & AI",
    providerId: "PROV-002",
    providerName: "FutureSkills Academy",
    courseCompletionDate: "2025-07-10",
    skillsAcquired: ["Python", "Excel", "SQL"],
    consent: {
      granted: true,
      timestamp: "2025-01-15T09:00:00Z",
      shareWithEmployers: true,
      participateLongitudinalSurveys: true,
      anonymizedResearchConsent: true
    },
    employmentStatus: "Unemployed",
    occupation: "Job Seeking",
    employer: "None",
    employerSector: "None",
    preTrainingSalary: 0,
    currentSalary: 0,
    employmentStartDate: null,
    employmentDurationMonths: 0,
    isSelfEmployed: false,
    skillUtilizationRate: 0,
    timeToEmploymentDays: null,
    journey: [
      { step: "Training Enrolled", date: "2025-01-20", status: "completed", note: "Enrolled in Foundation Data Analytics." },
      { step: "Course Completion", date: "2025-07-10", status: "completed", note: "Completed course curriculum." },
      { step: "Job Search", date: "2025-07-25", status: "in_progress", note: "Actively applying; needs project portfolio mentoring." },
      { step: "Employment", date: null, status: "pending", note: "Pending placement." },
      { step: "Salary Progression", date: null, status: "pending", note: "Awaiting employment." },
      { step: "Retention Milestone", date: null, status: "pending", note: "Awaiting employment." }
    ],
    surveys: {
      "3m": { completed: true, date: "2025-10-10", employed: false, jobTitle: "Seeking work", salary: 0, usingSkills: false, satisfaction: 2, missingSkills: ["Power BI", "Tableau", "Interview Prep"] },
      "6m": { completed: true, date: "2026-01-10", employed: false, jobTitle: "Seeking work / Upskilling", salary: 0, usingSkills: false, satisfaction: 2, missingSkills: ["Cloud DBs", "Resume Workshop"] },
      "12m": { completed: false, date: "2026-07-10", employed: null, jobTitle: null, salary: null, usingSkills: null, satisfaction: null, missingSkills: [] }
    }
  },
  {
    id: "TRN-1008",
    name: "Kavita Patel",
    age: 25,
    gender: "Female",
    education: "Bachelor of Engineering",
    location: "Ahmedabad, Gujarat",
    region: "West",
    tier: "Tier-2",
    contact: {
      email: "kavita.patel@example.com",
      phone: "+91 98795 66778"
    },
    courseId: "CRS-102",
    courseTitle: "Cloud & DevOps Engineering",
    providerId: "PROV-001",
    providerName: "Apex Tech Institute",
    courseCompletionDate: "2025-04-15",
    skillsAcquired: ["AWS", "Docker", "CI/CD Pipelines", "Linux", "Git", "Terraform"],
    consent: {
      granted: true,
      timestamp: "2024-11-05T10:00:00Z",
      shareWithEmployers: true,
      participateLongitudinalSurveys: true,
      anonymizedResearchConsent: true
    },
    employmentStatus: "Employed",
    occupation: "Cloud Operations Engineer",
    employer: "Tata Consultancy Services",
    employerSector: "Enterprise IT",
    preTrainingSalary: 15000,
    currentSalary: 55000,
    employmentStartDate: "2025-05-20",
    employmentDurationMonths: 15,
    isSelfEmployed: false,
    skillUtilizationRate: 96,
    timeToEmploymentDays: 35,
    journey: [
      { step: "Training Enrolled", date: "2024-11-15", status: "completed", note: "Joined Cloud DevOps fast-track." },
      { step: "Course Completion", date: "2025-04-15", status: "completed", note: "Ranked #1 in capstone cloud migration." },
      { step: "Job Search", date: "2025-04-20", status: "completed", note: "Fast-tracked by TCS Cloud Practice." },
      { step: "Employment", date: "2025-05-20", status: "completed", note: "Joined TCS Cloud COE." },
      { step: "Salary Progression", date: "2026-02-01", status: "completed", note: "Salary increased to ₹62,000/mo." },
      { step: "Retention Milestone", date: "2026-05-20", status: "completed", note: "12-month retention verified." }
    ],
    surveys: {
      "3m": { completed: true, date: "2025-08-20", employed: true, jobTitle: "Cloud Ops Engineer", salary: 55000, usingSkills: true, satisfaction: 5, missingSkills: ["Kubernetes (EKS)"] },
      "6m": { completed: true, date: "2025-11-20", employed: true, jobTitle: "Cloud Ops Engineer", salary: 55000, usingSkills: true, satisfaction: 5, missingSkills: ["Azure Architecture"] },
      "12m": { completed: true, date: "2026-05-20", employed: true, jobTitle: "Senior Cloud Engineer", salary: 62000, usingSkills: true, satisfaction: 5, missingSkills: ["Cloud Security / DevSecOps"] }
    }
  }
];

// Helper to synthetically generate remaining 45 trainees to ensure a robust, realistic 53+ trainee dataset
(function generateFullSyntheticTrainees() {
  const firstNamesM = ["Aarav", "Amit", "Arjun", "Aditya", "Dev", "Gaurav", "Harsh", "Karan", "Manish", "Naveen", "Nikhil", "Pranav", "Rohan", "Sandeep", "Shivam", "Tanmay", "Utkarsh", "Varun", "Yash", "Zubair", "Balaji", "Chetan", "Dinesh", "Girish", "Karthik"];
  const firstNamesF = ["Aishwarya", "Bhavna", "Divya", "Geeta", "Isha", "Kiran", "Meera", "Neha", "Pooja", "Ritu", "Sakshi", "Sneha", "Tanya", "Vaishali", "Vidya", "Shruti", "Swati", "Rashmi", "Deepa", "Monika"];
  const lastNames = ["Sharma", "Verma", "Patel", "Reddy", "Iyer", "Nair", "Das", "Ghosh", "Singh", "Yadav", "Gupta", "Mishra", "Joshi", "Bose", "Menon", "Chauhan", "Mehta", "Bhat", "Rathore", "Kulkarni", "Deshmukh", "Pillai", "Choudhury", "Roy", "Banerjee"];

  const cities = [
    { city: "Bengaluru, Karnataka", region: "South", tier: "Tier-1 Metro" },
    { city: "Hyderabad, Telangana", region: "South", tier: "Tier-1 Metro" },
    { city: "Chennai, Tamil Nadu", region: "South", tier: "Tier-1 Metro" },
    { city: "Coimbatore, Tamil Nadu", region: "South", tier: "Tier-2" },
    { city: "New Delhi, Delhi NCR", region: "North", tier: "Tier-1 Metro" },
    { city: "Noida, Uttar Pradesh", region: "North", tier: "Tier-2" },
    { city: "Chandigarh, Punjab", region: "North", tier: "Tier-2" },
    { city: "Varanasi, Uttar Pradesh", region: "North", tier: "Tier-3" },
    { city: "Prayagraj, Uttar Pradesh", region: "North", tier: "Tier-3" },
    { city: "Mumbai, Maharashtra", region: "West", tier: "Tier-1 Metro" },
    { city: "Pune, Maharashtra", region: "West", tier: "Tier-2" },
    { city: "Nagpur, Maharashtra", region: "West", tier: "Tier-2" },
    { city: "Surat, Gujarat", region: "West", tier: "Tier-2" },
    { city: "Kolkata, West Bengal", region: "East", tier: "Tier-1 Metro" },
    { city: "Bhubaneswar, Odisha", region: "East", tier: "Tier-2" },
    { city: "Patna, Bihar", region: "East", tier: "Tier-3" },
    { city: "Guwahati, Assam", region: "East", tier: "Tier-3" },
    { city: "Indore, Madhya Pradesh", region: "Central", tier: "Tier-2" },
    { city: "Bhopal, Madhya Pradesh", region: "Central", tier: "Tier-2" },
    { city: "Raipur, Chhattisgarh", region: "Central", tier: "Tier-3" },
    { city: "Rural Shimoga, Karnataka", region: "South", tier: "Rural" },
    { city: "Rural Alwar, Rajasthan", region: "North", tier: "Rural" },
    { city: "Rural Medinipur, West Bengal", region: "East", tier: "Rural" }
  ];

  const educations = ["High School / 10th", "Senior Secondary / 12th", "Diploma (Polytechnic)", "Bachelor's Degree", "Master's Degree"];
  const employers = [
    { name: "Infosys BPM", sector: "IT Services" },
    { name: "Tech Mahindra", sector: "Telecom & IT" },
    { name: "Apollo Hospitals", sector: "Healthcare" },
    { name: "Max Healthcare", sector: "Healthcare" },
    { name: "Larsen & Toubro (L&T)", sector: "Manufacturing" },
    { name: "Tata Motors Auto Plant", sector: "Automotive" },
    { name: "Swiggy Delivery Partner Ops", sector: "Logistics / Tech" },
    { name: "Amazon India Logistics", sector: "E-Commerce" },
    { name: "Nykaa Digital Marketing", sector: "D2C Brands" },
    { name: "Cognizant Technology", sector: "Software Services" },
    { name: "HCL Technologies", sector: "Enterprise Cloud" },
    { name: "Fortis Health Centers", sector: "Healthcare" },
    { name: "Reliance Retail Digital", sector: "Retail Tech" },
    { name: "Hero MotoCorp Smart Plant", sector: "Industrial Automation" }
  ];

  const startId = 1009;
  const countToGenerate = 45;

  for (let i = 0; i < countToGenerate; i++) {
    const isFemale = i % 2 === 0;
    const fName = isFemale ? firstNamesF[i % firstNamesF.length] : firstNamesM[i % firstNamesM.length];
    const lName = lastNames[(i * 3 + 2) % lastNames.length];
    const fullName = `${fName} ${lName}`;
    const age = 20 + (i % 14);
    const loc = cities[i % cities.length];
    const edu = educations[(i * 2 + 1) % educations.length];
    const course = DEMO_COURSES[i % DEMO_COURSES.length];
    const provider = DEMO_PROVIDERS[i % DEMO_PROVIDERS.length];

    // Status probability: 78% Employed, 9% Self-Employed, 13% Unemployed/Upskilling
    let status = "Employed";
    let isSelf = false;
    let occupation = "Associate Professional";
    let employerName = employers[i % employers.length].name;
    let employerSector = employers[i % employers.length].sector;
    let currentSalary = Math.round((course.avgStartingSalary * (0.8 + ((i % 5) * 0.1))) / 500) * 500;
    let preSalary = i % 3 === 0 ? 0 : Math.round((currentSalary * 0.3) / 500) * 500;
    let utilization = 75 + (i % 24);
    let timeToEmp = 25 + (i % 45);

    if (i % 8 === 0) {
      status = "Self-Employed";
      isSelf = true;
      occupation = "Freelance Specialist / Enterprise Vendor";
      employerName = `${fullName} Independent Services`;
      employerSector = "Freelance / Services";
      currentSalary = Math.round((course.avgStartingSalary * 0.95) / 500) * 500;
    } else if (i % 7 === 0) {
      status = "Unemployed";
      isSelf = false;
      occupation = "Actively Seeking Placement";
      employerName = "None";
      employerSector = "None";
      currentSalary = 0;
      utilization = 0;
      timeToEmp = null;
    }

    const compDate = `2025-${String((i % 7) + 1).padStart(2, '0')}-15`;
    const empStartDate = status !== "Unemployed" ? `2025-${String((i % 7) + 2).padStart(2, '0')}-20` : null;

    DEMO_TRAINEES.push({
      id: `TRN-${startId + i}`,
      name: fullName,
      age: age,
      gender: isFemale ? "Female" : "Male",
      education: edu,
      location: loc.city,
      region: loc.region,
      tier: loc.tier,
      contact: {
        email: `${fName.toLowerCase()}.${lName.toLowerCase()}${i + 10}@example.com`,
        phone: `+91 ${98000 + i * 17} ${10000 + i * 19}`
      },
      courseId: course.id,
      courseTitle: course.title,
      providerId: provider.id,
      providerName: provider.name,
      courseCompletionDate: compDate,
      skillsAcquired: course.skillsTaught.slice(0, 4 + (i % 3)),
      consent: {
        granted: true,
        timestamp: "2024-10-01T08:00:00Z",
        shareWithEmployers: true,
        participateLongitudinalSurveys: true,
        anonymizedResearchConsent: true
      },
      employmentStatus: status,
      occupation: status === "Employed" ? `${course.title.split('&')[0].trim()} Associate` : occupation,
      employer: employerName,
      employerSector: employerSector,
      preTrainingSalary: preSalary,
      currentSalary: currentSalary,
      employmentStartDate: empStartDate,
      employmentDurationMonths: status !== "Unemployed" ? 8 + (i % 10) : 0,
      isSelfEmployed: isSelf,
      skillUtilizationRate: utilization,
      timeToEmploymentDays: timeToEmp,
      journey: [
        { step: "Training Enrolled", date: "2024-11-01", status: "completed", note: `Enrolled in ${course.title}` },
        { step: "Course Completion", date: compDate, status: "completed", note: "Certified successfully." },
        { step: "Job Search", date: compDate, status: "completed", note: "Partner interviews & portfolio prep." },
        { step: "Employment", date: empStartDate, status: status !== "Unemployed" ? "completed" : "in_progress", note: status !== "Unemployed" ? `Placed at ${employerName}` : "Active placement support." },
        { step: "Salary Progression", date: "2026-02-01", status: status !== "Unemployed" ? "completed" : "pending", note: status !== "Unemployed" ? "Salary growth tracked." : "Pending." },
        { step: "Retention Milestone", date: "2026-06-01", status: status !== "Unemployed" ? "completed" : "pending", note: status !== "Unemployed" ? "Longitudinal retention verified." : "Pending." }
      ],
      surveys: {
        "3m": {
          completed: true,
          date: "2025-08-20",
          employed: status !== "Unemployed",
          jobTitle: status !== "Unemployed" ? occupation : "Seeking Work",
          salary: currentSalary,
          usingSkills: status !== "Unemployed",
          satisfaction: status !== "Unemployed" ? 4 + (i % 2) : 2,
          missingSkills: ["Advanced Tooling", "Domain Projects"]
        },
        "6m": {
          completed: true,
          date: "2025-11-20",
          employed: status !== "Unemployed",
          jobTitle: status !== "Unemployed" ? occupation : "Seeking Work",
          salary: currentSalary > 0 ? currentSalary + 2000 : 0,
          usingSkills: status !== "Unemployed",
          satisfaction: status !== "Unemployed" ? 4 + (i % 2) : 2,
          missingSkills: ["Cloud Certification", "Leadership"]
        },
        "12m": {
          completed: i % 2 === 0,
          date: "2026-05-20",
          employed: status !== "Unemployed",
          jobTitle: status !== "Unemployed" ? occupation : "Seeking Work",
          salary: currentSalary > 0 ? currentSalary + 4500 : 0,
          usingSkills: status !== "Unemployed",
          satisfaction: 5,
          missingSkills: ["Architecture & System Design"]
        }
      }
    });
  }
})();

// Data Quality Issues Sample Set
const DEMO_DATA_QUALITY_ISSUES = [
  {
    id: "DQ-001",
    traineeId: "TRN-1015",
    traineeName: "Aarav Sharma",
    type: "Missing Information",
    field: "Contact Phone",
    severity: "Medium",
    description: "Phone number format contains placeholder prefix.",
    suggestedFix: "Send automated SMS verification update."
  },
  {
    id: "DQ-002",
    traineeId: "TRN-1022",
    traineeName: "Kiran Joshi",
    type: "Outdated Record",
    field: "6-Month Follow-Up",
    severity: "High",
    description: "Last survey response received > 7 months ago.",
    suggestedFix: "Trigger automated follow-up survey invitation."
  },
  {
    id: "DQ-003",
    traineeId: "TRN-1031",
    traineeName: "Neha Pillai",
    type: "Unverified Salary",
    field: "Current Salary",
    severity: "Low",
    description: "Reported salary surge (+240%) exceeds automated variance threshold.",
    suggestedFix: "Request employer confirmation pay stub verification."
  },
  {
    id: "DQ-004",
    traineeId: "TRN-1044",
    traineeName: "Dinesh Roy",
    type: "Potential Duplicate",
    field: "National ID / Email",
    severity: "Medium",
    description: "Matched duplicate name and birth year in legacy NSDC repository.",
    suggestedFix: "Merge duplicate records with ID confirmation."
  }
];

// Automated Policy Recommendations
const DEMO_POLICY_RECOMMENDATIONS = [
  {
    id: "REC-01",
    category: "Curriculum & Skill Gaps",
    badge: "High Impact",
    badgeColor: "red",
    title: "Cloud & AI Skilling Bottleneck",
    summary: "Cloud Computing and Generative AI skills exhibit a 41% surge in employer hiring demand, yet only 18% of trainees in standard IT courses are certified in AWS/Docker.",
    action: "Incorporate mandatory 40-hour Cloud & AI micro-credential modules across all regional IT training centers.",
    expectedOutcome: "+14% higher starting salary and faster placement (under 28 days)."
  },
  {
    id: "REC-02",
    category: "Provider Benchmarking",
    badge: "Best Practice",
    badgeColor: "emerald",
    title: "Replicate Apex Tech's 12-Month Retention Model",
    summary: "Apex Tech Institute maintains an 86.8% 12-month job retention rate compared to the 76.5% sector average due to their mandatory 90-day post-hire mentorship program.",
    action: "Standardize the 90-day post-placement employer check-in protocol across all 5 accredited training providers.",
    expectedOutcome: "Reduce post-placement attrition by an estimated 9.2% statewide."
  },
  {
    id: "REC-03",
    category: "Intervention Alert",
    badge: "Action Required",
    badgeColor: "amber",
    title: "Longitudinal Survey Drop-off in Tier-3 & Rural Regions",
    summary: "Trainees in Tier-3 and Rural areas show a 32% lower response rate to 12-month digital follow-ups compared to Metro peers.",
    action: "Deploy automated WhatsApp & IVR voice call survey triggers with vernacular language support.",
    expectedOutcome: "Increase longitudinal tracking data fidelity to over 95% across all regions."
  },
  {
    id: "REC-04",
    category: "Self-Employment Support",
    badge: "Growth Trend",
    badgeColor: "blue",
    title: "High Self-Employment in Advanced IoT & Healthcare",
    summary: "Over 14% of IoT and Healthcare trainees successfully launch independent consulting and regional service practices with an average income of ₹44,000/mo.",
    action: "Launch micro-grant linkages and GST/invoicing toolkits directly into vocational exit curricula.",
    expectedOutcome: "Accelerate formalization of micro-enterprises and sustainable self-employment."
  }
];
