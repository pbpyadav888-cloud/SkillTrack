/**
 * SkillTrack - State Store & Business Logic
 * Reactive centralized state with LocalStorage persistence and event emitter.
 */

class AppState {
  constructor() {
    this.listeners = [];
    this.currentView = 'landing'; // 'landing', 'dashboard', 'trainees', 'profile', 'programs', 'followups', 'outcomes', 'skillgap', 'providers', 'regional', 'dataquality', 'privacy', 'reports', 'settings'
    this.currentRole = 'admin'; // 'admin', 'trainee', 'provider', 'employer'
    this.currentTraineeId = 'TRN-1001';
    this.currentProviderId = 'PROV-001';
    this.selectedTraineeIdForModal = null;
    this.selectedProviderIdForCompare = 'PROV-002';
    
    this.filters = {
      search: '',
      ageGroup: 'all',
      gender: 'all',
      education: 'all',
      region: 'all',
      courseId: 'all',
      providerId: 'all',
      employmentStatus: 'all'
    };

    this.notifications = [
      { id: 'notif-1', time: '10m ago', title: 'Survey Milestone Due', text: '12-month follow-up survey ready for Priya Sharma and 14 other trainees.', unread: true, type: 'survey' },
      { id: 'notif-2', time: '1h ago', title: 'New Skill Demand Surge', text: 'Cloud & AI hiring demand surged +41% across partner employers.', unread: true, type: 'alert' },
      { id: 'notif-3', time: '3h ago', title: 'Consent Update Log', text: 'Trainee TRN-1004 confirmed data-sharing preferences.', unread: false, type: 'privacy' }
    ];

    this.init();
  }

  init() {
    try {
      const savedTrainees = localStorage.getItem('skilltrack_trainees');
      const savedProviders = localStorage.getItem('skilltrack_providers');
      const savedCourses = localStorage.getItem('skilltrack_courses');
      const savedIssues = localStorage.getItem('skilltrack_dq_issues');

      this.trainees = savedTrainees ? JSON.parse(savedTrainees) : JSON.parse(JSON.stringify(DEMO_TRAINEES));
      this.providers = savedProviders ? JSON.parse(savedProviders) : JSON.parse(JSON.stringify(DEMO_PROVIDERS));
      this.courses = savedCourses ? JSON.parse(savedCourses) : JSON.parse(JSON.stringify(DEMO_COURSES));
      this.dqIssues = savedIssues ? JSON.parse(savedIssues) : JSON.parse(JSON.stringify(DEMO_DATA_QUALITY_ISSUES));
      this.industryDemand = DEMO_INDUSTRY_DEMAND;
      this.policyRecommendations = DEMO_POLICY_RECOMMENDATIONS;
    } catch (e) {
      console.warn("Error loading from localStorage, fallback to defaults", e);
      this.trainees = JSON.parse(JSON.stringify(DEMO_TRAINEES));
      this.providers = JSON.parse(JSON.stringify(DEMO_PROVIDERS));
      this.courses = JSON.parse(JSON.stringify(DEMO_COURSES));
      this.dqIssues = JSON.parse(JSON.stringify(DEMO_DATA_QUALITY_ISSUES));
      this.industryDemand = DEMO_INDUSTRY_DEMAND;
      this.policyRecommendations = DEMO_POLICY_RECOMMENDATIONS;
    }
  }

  save() {
    try {
      localStorage.setItem('skilltrack_trainees', JSON.stringify(this.trainees));
      localStorage.setItem('skilltrack_providers', JSON.stringify(this.providers));
      localStorage.setItem('skilltrack_courses', JSON.stringify(this.courses));
      localStorage.setItem('skilltrack_dq_issues', JSON.stringify(this.dqIssues));
    } catch (e) {
      console.error("Failed to save to localStorage", e);
    }
  }

  resetDemoData() {
    localStorage.removeItem('skilltrack_trainees');
    localStorage.removeItem('skilltrack_providers');
    localStorage.removeItem('skilltrack_courses');
    localStorage.removeItem('skilltrack_dq_issues');
    this.init();
    this.notify();
  }

  subscribe(fn) {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  }

  notify() {
    this.listeners.forEach(fn => fn(this));
  }

  setView(view, extraState = {}) {
    this.currentView = view;
    Object.assign(this, extraState);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.notify();
  }

  setRole(role, id = null) {
    this.currentRole = role;
    if (role === 'trainee') {
      this.currentTraineeId = id || 'TRN-1001';
      this.currentView = 'profile';
    } else if (role === 'provider') {
      this.currentProviderId = id || 'PROV-001';
      this.currentView = 'providers';
    } else if (role === 'employer') {
      this.currentView = 'skillgap';
    } else {
      this.currentView = 'dashboard';
    }
    this.notify();
  }

  setFilter(key, value) {
    this.filters[key] = value;
    this.notify();
  }

  resetFilters() {
    this.filters = {
      search: '',
      ageGroup: 'all',
      gender: 'all',
      education: 'all',
      region: 'all',
      courseId: 'all',
      providerId: 'all',
      employmentStatus: 'all'
    };
    this.notify();
  }

  getFilteredTrainees() {
    return this.trainees.filter(t => {
      // Role scoping
      if (this.currentRole === 'provider' && t.providerId !== this.currentProviderId) {
        return false;
      }

      // Search
      if (this.filters.search) {
        const q = this.filters.search.toLowerCase();
        const matchName = t.name.toLowerCase().includes(q);
        const matchId = t.id.toLowerCase().includes(q);
        const matchCourse = t.courseTitle.toLowerCase().includes(q);
        const matchEmployer = (t.employer || '').toLowerCase().includes(q);
        const matchSkills = (t.skillsAcquired || []).some(s => s.toLowerCase().includes(q));
        if (!matchName && !matchId && !matchCourse && !matchEmployer && !matchSkills) {
          return false;
        }
      }

      // Age group
      if (this.filters.ageGroup !== 'all') {
        if (this.filters.ageGroup === '18-24' && (t.age < 18 || t.age > 24)) return false;
        if (this.filters.ageGroup === '25-34' && (t.age < 25 || t.age > 34)) return false;
        if (this.filters.ageGroup === '35+' && t.age < 35) return false;
      }

      // Gender
      if (this.filters.gender !== 'all' && t.gender !== this.filters.gender) {
        return false;
      }

      // Education
      if (this.filters.education !== 'all' && t.education !== this.filters.education) {
        return false;
      }

      // Region
      if (this.filters.region !== 'all') {
        if (this.filters.region === 'Rural' && t.tier !== 'Rural') return false;
        if (this.filters.region !== 'Rural' && t.region !== this.filters.region) return false;
      }

      // Course
      if (this.filters.courseId !== 'all' && t.courseId !== this.filters.courseId) {
        return false;
      }

      // Provider
      if (this.filters.providerId !== 'all' && t.providerId !== this.filters.providerId) {
        return false;
      }

      // Employment Status
      if (this.filters.employmentStatus !== 'all' && t.employmentStatus !== this.filters.employmentStatus) {
        return false;
      }

      return true;
    });
  }

  getAnalyticsSummary() {
    const list = this.getFilteredTrainees();
    const total = list.length;
    if (total === 0) {
      return {
        total: 0,
        employedCount: 0,
        selfEmployedCount: 0,
        unemployedCount: 0,
        employmentRate: 0,
        selfEmploymentRate: 0,
        unemploymentRate: 0,
        overallPlacementRate: 0,
        avgPreSalary: 0,
        avgCurrentSalary: 0,
        avgSalaryLiftPercent: 0,
        avgTimeToEmploymentDays: 0,
        avgSkillUtilization: 0,
        retention6mRate: 0,
        retention12mRate: 0,
        healthScore: 94
      };
    }

    const employed = list.filter(t => t.employmentStatus === 'Employed');
    const selfEmployed = list.filter(t => t.employmentStatus === 'Self-Employed');
    const unemployed = list.filter(t => t.employmentStatus === 'Unemployed');
    const placed = list.filter(t => t.employmentStatus === 'Employed' || t.employmentStatus === 'Self-Employed');

    const totalCurrentSalary = placed.reduce((acc, t) => acc + (t.currentSalary || 0), 0);
    const avgCurrentSalary = placed.length ? Math.round(totalCurrentSalary / placed.length) : 0;

    const totalPreSalary = placed.reduce((acc, t) => acc + (t.preTrainingSalary || 0), 0);
    const avgPreSalary = placed.length ? Math.round(totalPreSalary / placed.length) : 0;

    const salaryLift = avgPreSalary > 0 ? Math.round(((avgCurrentSalary - avgPreSalary) / avgPreSalary) * 100) : 100;

    const placedWithTimeToEmp = placed.filter(t => t.timeToEmploymentDays);
    const avgTimeToEmploymentDays = placedWithTimeToEmp.length
      ? Math.round(placedWithTimeToEmp.reduce((acc, t) => acc + t.timeToEmploymentDays, 0) / placedWithTimeToEmp.length)
      : 36;

    const avgSkillUtilization = placed.length
      ? Math.round(placed.reduce((acc, t) => acc + (t.skillUtilizationRate || 0), 0) / placed.length)
      : 0;

    // Longitudinal retention metrics
    const eligible6m = list.filter(t => t.surveys && t.surveys['6m'] && t.surveys['6m'].completed);
    const retained6m = eligible6m.filter(t => t.surveys['6m'].employed);
    const retention6mRate = eligible6m.length ? Math.round((retained6m.length / eligible6m.length) * 100) : 89;

    const eligible12m = list.filter(t => t.surveys && t.surveys['12m'] && t.surveys['12m'].completed);
    const retained12m = eligible12m.filter(t => t.surveys['12m'].employed);
    const retention12mRate = eligible12m.length ? Math.round((retained12m.length / eligible12m.length) * 100) : 84;

    return {
      total,
      employedCount: employed.length,
      selfEmployedCount: selfEmployed.length,
      unemployedCount: unemployed.length,
      employmentRate: Math.round((employed.length / total) * 100),
      selfEmploymentRate: Math.round((selfEmployed.length / total) * 100),
      unemploymentRate: Math.round((unemployed.length / total) * 100),
      overallPlacementRate: Math.round((placed.length / total) * 100),
      avgPreSalary,
      avgCurrentSalary,
      avgSalaryLiftPercent: salaryLift,
      avgTimeToEmploymentDays,
      avgSkillUtilization,
      retention6mRate,
      retention12mRate,
      healthScore: Math.max(70, 100 - this.dqIssues.length * 3)
    };
  }

  addTrainee(traineeData) {
    const newId = `TRN-${1000 + this.trainees.length + 1}`;
    const course = this.courses.find(c => c.id === traineeData.courseId) || this.courses[0];
    const provider = this.providers.find(p => p.id === traineeData.providerId) || this.providers[0];

    const isEmployed = traineeData.employmentStatus === 'Employed';
    const isSelf = traineeData.employmentStatus === 'Self-Employed';
    const hasJob = isEmployed || isSelf;

    const newTrainee = {
      id: newId,
      name: traineeData.name,
      age: parseInt(traineeData.age) || 24,
      gender: traineeData.gender || 'Female',
      education: traineeData.education || "Bachelor's Degree",
      location: traineeData.location || "Bengaluru, Karnataka",
      region: traineeData.region || "South",
      tier: traineeData.tier || "Tier-1 Metro",
      contact: {
        email: traineeData.email,
        phone: traineeData.phone
      },
      courseId: course.id,
      courseTitle: course.title,
      providerId: provider.id,
      providerName: provider.name,
      courseCompletionDate: traineeData.courseCompletionDate || new Date().toISOString().split('T')[0],
      skillsAcquired: traineeData.skillsAcquired || course.skillsTaught.slice(0, 4),
      consent: {
        granted: true,
        timestamp: new Date().toISOString(),
        shareWithEmployers: !!traineeData.shareWithEmployers,
        participateLongitudinalSurveys: !!traineeData.participateLongitudinalSurveys,
        anonymizedResearchConsent: !!traineeData.anonymizedResearchConsent
      },
      employmentStatus: traineeData.employmentStatus || 'Employed',
      occupation: traineeData.occupation || (hasJob ? `${course.title.split('&')[0]} Specialist` : 'Job Seeking'),
      employer: traineeData.employer || (hasJob ? 'Enterprise Partner' : 'None'),
      employerSector: traineeData.employerSector || (hasJob ? 'Technology' : 'None'),
      preTrainingSalary: parseInt(traineeData.preTrainingSalary) || 0,
      currentSalary: parseInt(traineeData.currentSalary) || (hasJob ? course.avgStartingSalary : 0),
      employmentStartDate: hasJob ? traineeData.employmentStartDate || new Date().toISOString().split('T')[0] : null,
      employmentDurationMonths: hasJob ? 3 : 0,
      isSelfEmployed: isSelf,
      skillUtilizationRate: hasJob ? 88 : 0,
      timeToEmploymentDays: hasJob ? 32 : null,
      journey: [
        { step: "Training Enrolled", date: "2025-01-01", status: "completed", note: `Enrolled in ${course.title}` },
        { step: "Course Completion", date: traineeData.courseCompletionDate || "2025-06-01", status: "completed", note: "Graduation certified." },
        { step: "Job Search", date: "2025-06-15", status: "completed", note: "Portfolio & mock interviews completed." },
        { step: "Employment", date: hasJob ? traineeData.employmentStartDate : null, status: hasJob ? "completed" : "in_progress", note: hasJob ? `Employed at ${traineeData.employer || 'Partner'}` : 'Actively searching.' },
        { step: "Salary Progression", date: null, status: hasJob ? "in_progress" : "pending", note: "Tracking upcoming wage milestones." },
        { step: "Retention Milestone", date: null, status: "pending", note: "Longitudinal 6m & 12m surveys scheduled." }
      ],
      surveys: {
        "3m": {
          completed: hasJob,
          date: new Date().toISOString().split('T')[0],
          employed: hasJob,
          jobTitle: traineeData.occupation || 'Associate',
          salary: parseInt(traineeData.currentSalary) || course.avgStartingSalary,
          usingSkills: hasJob,
          satisfaction: 5,
          missingSkills: []
        },
        "6m": { completed: false, date: null, employed: null, jobTitle: null, salary: null, usingSkills: null, satisfaction: null, missingSkills: [] },
        "12m": { completed: false, date: null, employed: null, jobTitle: null, salary: null, usingSkills: null, satisfaction: null, missingSkills: [] }
      }
    };

    this.trainees.unshift(newTrainee);
    this.save();
    this.notify();
    return newTrainee;
  }

  submitSurvey(traineeId, surveyType, surveyData) {
    const trainee = this.trainees.find(t => t.id === traineeId);
    if (!trainee) return false;

    if (!trainee.surveys) trainee.surveys = {};
    
    trainee.surveys[surveyType] = {
      completed: true,
      date: new Date().toISOString().split('T')[0],
      employed: surveyData.employed === true || surveyData.employed === 'true',
      jobTitle: surveyData.jobTitle || trainee.occupation,
      salary: parseInt(surveyData.salary) || trainee.currentSalary,
      usingSkills: surveyData.usingSkills === true || surveyData.usingSkills === 'true',
      satisfaction: parseInt(surveyData.satisfaction) || 5,
      missingSkills: Array.isArray(surveyData.missingSkills) ? surveyData.missingSkills : [surveyData.missingSkills || 'Advanced Domain Tools']
    };

    // Update live profile details
    if (surveyData.employed === true || surveyData.employed === 'true') {
      trainee.employmentStatus = surveyData.isSelfEmployed ? 'Self-Employed' : 'Employed';
      trainee.isSelfEmployed = !!surveyData.isSelfEmployed;
      if (surveyData.jobTitle) trainee.occupation = surveyData.jobTitle;
      if (surveyData.employer) trainee.employer = surveyData.employer;
      if (surveyData.salary) trainee.currentSalary = parseInt(surveyData.salary);
    } else {
      trainee.employmentStatus = 'Unemployed';
      trainee.currentSalary = 0;
    }

    // Add journey log
    trainee.journey.push({
      step: `${surveyType.toUpperCase()} Follow-Up Survey`,
      date: new Date().toISOString().split('T')[0],
      status: "completed",
      note: `Survey completed. Employment status verified: ${trainee.employmentStatus}. Current Income: ₹${trainee.currentSalary.toLocaleString('en-IN')}/mo.`
    });

    this.save();
    this.notify();
    return true;
  }

  updateConsent(traineeId, consentData) {
    const trainee = this.trainees.find(t => t.id === traineeId);
    if (!trainee) return false;

    trainee.consent = Object.assign(trainee.consent || {}, consentData, {
      lastUpdated: new Date().toISOString()
    });

    this.save();
    this.notify();
    return true;
  }

  resolveDataQualityIssue(issueId) {
    this.dqIssues = this.dqIssues.filter(i => i.id !== issueId);
    this.save();
    this.notify();
  }

  getTraineeById(id) {
    return this.trainees.find(t => t.id === id) || this.trainees[0];
  }

  getProviderById(id) {
    return this.providers.find(p => p.id === id) || this.providers[0];
  }
}

// Global App State Instance
window.appState = new AppState();
