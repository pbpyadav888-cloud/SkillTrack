/**
 * SkillTrack - Trainee Registration & Consent Engine
 * Form with multi-field validation, course selection, skill tags, and privacy consent message.
 */

const RegistrationModule = {
  render(state) {
    const courses = state.courses;
    const providers = state.providers;

    return `
      <div class="max-w-4xl mx-auto py-8">
        <!-- Header -->
        <div class="mb-8">
          <button onclick="appState.setView('trainees')" class="text-sm font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1.5 mb-3">
            <i data-lucide="arrow-left" class="w-4 h-4"></i> Back to Trainee Directory
          </button>
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900">Trainee Intake & Registration</h1>
              <p class="text-sm text-slate-500 mt-1">Enroll a new trainee into the longitudinal outcome tracking system.</p>
            </div>
            <span class="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-wider">
              Consent-Based Intake
            </span>
          </div>
        </div>

        <!-- Form Card -->
        <div class="glass-card rounded-2xl p-6 sm:p-10 shadow-sm border border-slate-200">
          <form id="trainee-registration-form" onsubmit="RegistrationModule.handleSubmit(event)">
            
            <!-- Step 1: Personal & Demographics -->
            <div class="mb-8">
              <h3 class="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
                <span class="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">1</span>
                Personal Information & Demographics
              </h3>
              
              <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <div>
                  <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Full Name *</label>
                  <input type="text" name="name" required placeholder="e.g. Aditi Rao" class="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                </div>

                <div>
                  <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Age *</label>
                  <input type="number" name="age" min="18" max="65" required placeholder="e.g. 23" class="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                </div>

                <div>
                  <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Gender *</label>
                  <select name="gender" required class="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white">
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Non-Binary">Non-Binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Highest Education *</label>
                  <select name="education" required class="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white">
                    <option value="Bachelor's Degree">Bachelor's Degree</option>
                    <option value="Diploma (Polytechnic)">Diploma (Polytechnic)</option>
                    <option value="Senior Secondary / 12th">Senior Secondary / 12th</option>
                    <option value="High School / 10th">High School / 10th</option>
                    <option value="Master's Degree">Master's Degree</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Email Contact *</label>
                  <input type="email" name="email" required placeholder="aditi.rao@example.com" class="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                </div>

                <div>
                  <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Phone Contact *</label>
                  <input type="tel" name="phone" required placeholder="+91 98765 43210" class="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                </div>

                <div>
                  <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">City & State *</label>
                  <input type="text" name="location" required placeholder="e.g. Bengaluru, Karnataka" class="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                </div>

                <div>
                  <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Geographic Region *</label>
                  <select name="region" required class="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white">
                    <option value="South">South Zone</option>
                    <option value="North">North Zone</option>
                    <option value="West">West Zone</option>
                    <option value="East">East Zone</option>
                    <option value="Central">Central Zone</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Location Tier *</label>
                  <select name="tier" required class="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white">
                    <option value="Tier-1 Metro">Tier-1 Metro</option>
                    <option value="Tier-2">Tier-2 City</option>
                    <option value="Tier-3">Tier-3 Town</option>
                    <option value="Rural">Rural Area</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Step 2: Training Program Details -->
            <div class="mb-8">
              <h3 class="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
                <span class="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">2</span>
                Training Program & Provider
              </h3>
              
              <div class="grid sm:grid-cols-2 gap-5 mb-5">
                <div>
                  <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Training Course *</label>
                  <select name="courseId" id="reg-course-select" onchange="RegistrationModule.handleCourseChange()" required class="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white">
                    ${courses.map(c => `<option value="${c.id}">${c.title} (${c.durationWeeks} weeks)</option>`).join('')}
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Training Provider *</label>
                  <select name="providerId" required class="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white">
                    ${providers.map(p => `<option value="${p.id}">${p.name} - ${p.location}</option>`).join('')}
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Course Completion Date *</label>
                  <input type="date" name="courseCompletionDate" value="2025-06-30" required class="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                </div>

                <div>
                  <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Monthly Income Prior to Training (₹)</label>
                  <input type="number" name="preTrainingSalary" min="0" step="500" value="0" placeholder="e.g. 0 if unemployed, or previous wage" class="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                </div>
              </div>

              <!-- Skills Acquired Tags Input -->
              <div>
                <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Skills Acquired During Program</label>
                <div id="skills-badge-container" class="flex flex-wrap gap-2 mb-2 p-3 bg-slate-50 border border-slate-200 rounded-lg min-h-[46px]">
                  <!-- Injected dynamically -->
                </div>
                <div class="flex gap-2">
                  <input type="text" id="new-skill-input" placeholder="Type a skill & press Add (e.g. Python, AWS, Docker)" class="flex-1 px-3.5 py-2 rounded-lg border border-slate-300 text-xs" />
                  <button type="button" onclick="RegistrationModule.addCustomSkill()" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold">
                    Add Skill
                  </button>
                </div>
              </div>
            </div>

            <!-- Step 3: Current Employment Status (Initial) -->
            <div class="mb-8">
              <h3 class="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
                <span class="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">3</span>
                Current Employment Outcome
              </h3>
              
              <div class="grid sm:grid-cols-3 gap-4 mb-4">
                <label class="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 hover:bg-blue-50/50 cursor-pointer">
                  <input type="radio" name="employmentStatus" value="Employed" checked onchange="RegistrationModule.toggleEmploymentFields(true)" class="text-blue-600 focus:ring-blue-500" />
                  <div>
                    <span class="font-bold text-sm text-slate-900 block">Employed</span>
                    <span class="text-xs text-slate-500">Formal company hire</span>
                  </div>
                </label>

                <label class="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 hover:bg-blue-50/50 cursor-pointer">
                  <input type="radio" name="employmentStatus" value="Self-Employed" onchange="RegistrationModule.toggleEmploymentFields(true)" class="text-blue-600 focus:ring-blue-500" />
                  <div>
                    <span class="font-bold text-sm text-slate-900 block">Self-Employed</span>
                    <span class="text-xs text-slate-500">Freelancer / Micro-enterprise</span>
                  </div>
                </label>

                <label class="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 hover:bg-blue-50/50 cursor-pointer">
                  <input type="radio" name="employmentStatus" value="Unemployed" onchange="RegistrationModule.toggleEmploymentFields(false)" class="text-blue-600 focus:ring-blue-500" />
                  <div>
                    <span class="font-bold text-sm text-slate-900 block">Seeking Work</span>
                    <span class="text-xs text-slate-500">In job search pipeline</span>
                  </div>
                </label>
              </div>

              <div id="employed-extra-fields" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 p-4 rounded-xl bg-blue-50/40 border border-blue-100">
                <div>
                  <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Current Job Title / Occupation</label>
                  <input type="text" name="occupation" placeholder="e.g. Junior Cloud Engineer" class="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm bg-white" />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Employer / Business Name</label>
                  <input type="text" name="employer" placeholder="e.g. TechCorp Solutions" class="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm bg-white" />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Current Monthly Salary (₹)</label>
                  <input type="number" name="currentSalary" min="0" step="500" placeholder="e.g. 42000" class="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm bg-white" />
                </div>
              </div>
            </div>

            <!-- Step 4: Consent & Privacy Notice (Important Requirement) -->
            <div class="mb-8 p-6 rounded-2xl bg-amber-50/60 border border-amber-200">
              <div class="flex items-start gap-3 mb-4">
                <div class="p-2 bg-amber-100 text-amber-800 rounded-lg shrink-0 mt-0.5">
                  <i data-lucide="shield-alert" class="w-5 h-5"></i>
                </div>
                <div>
                  <h4 class="font-bold text-amber-950 text-base">Privacy Notice & Explicit Data Consent</h4>
                  <p class="text-xs text-amber-900 mt-1 leading-relaxed">
                    Under the SkillTrack Longitudinal Measurement Framework, personal contact data and salary records are strictly protected.
                    Your responses will be securely stored to measure program effectiveness, identify training gaps, and notify you of periodic 3m/6m/12m follow-up surveys.
                  </p>
                </div>
              </div>

              <div class="space-y-3 pt-3 border-t border-amber-200/80">
                <label class="flex items-start gap-2.5 cursor-pointer">
                  <input type="checkbox" name="participateLongitudinalSurveys" checked required class="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
                  <span class="text-xs text-slate-800 font-medium">
                    I consent to participate in periodic 3-month, 6-month, and 12-month follow-up outcome surveys. <strong class="text-red-600">*</strong>
                  </span>
                </label>

                <label class="flex items-start gap-2.5 cursor-pointer">
                  <input type="checkbox" name="shareWithEmployers" checked class="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
                  <span class="text-xs text-slate-800 font-medium">
                    I consent to sharing verified skill credentials with accredited hiring partners and prospective employers.
                  </span>
                </label>

                <label class="flex items-start gap-2.5 cursor-pointer">
                  <input type="checkbox" name="anonymizedResearchConsent" checked class="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
                  <span class="text-xs text-slate-800 font-medium">
                    I agree to allow anonymized longitudinal outcome reporting for government and policymaker skilling impact research.
                  </span>
                </label>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button type="button" onclick="appState.setView('trainees')" class="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-semibold">
                Cancel
              </button>
              <button type="submit" class="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-md shadow-blue-500/20 flex items-center gap-2">
                <i data-lucide="check-circle" class="w-4 h-4"></i>
                Complete Registration & Create Profile
              </button>
            </div>

          </form>
        </div>
      </div>
    `;
  },

  activeSkills: [],

  initSkills() {
    const courseSelect = document.getElementById('reg-course-select');
    if (!courseSelect) return;
    const courseId = courseSelect.value;
    const course = window.appState.courses.find(c => c.id === courseId) || window.appState.courses[0];
    this.activeSkills = [...(course ? course.skillsTaught : ['Python', 'SQL', 'Data Modeling'])];
    this.renderSkillBadges();
  },

  handleCourseChange() {
    const courseSelect = document.getElementById('reg-course-select');
    if (!courseSelect) return;
    const course = window.appState.courses.find(c => c.id === courseSelect.value);
    if (course) {
      this.activeSkills = [...course.skillsTaught];
      this.renderSkillBadges();
    }
  },

  renderSkillBadges() {
    const container = document.getElementById('skills-badge-container');
    if (!container) return;
    if (this.activeSkills.length === 0) {
      container.innerHTML = `<span class="text-xs text-slate-400">No skills added yet.</span>`;
      return;
    }
    container.innerHTML = this.activeSkills.map((skill, index) => `
      <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-100 text-blue-800 text-xs font-medium">
        ${skill}
        <button type="button" onclick="RegistrationModule.removeSkill(${index})" class="hover:text-red-600 focus:outline-none">
          <i data-lucide="x" class="w-3 h-3"></i>
        </button>
      </span>
    `).join('');
    if (window.lucide) lucide.createIcons();
  },

  addCustomSkill() {
    const input = document.getElementById('new-skill-input');
    if (!input || !input.value.trim()) return;
    const val = input.value.trim();
    if (!this.activeSkills.includes(val)) {
      this.activeSkills.push(val);
      this.renderSkillBadges();
    }
    input.value = '';
  },

  removeSkill(idx) {
    this.activeSkills.splice(idx, 1);
    this.renderSkillBadges();
  },

  toggleEmploymentFields(isEmployed) {
    const el = document.getElementById('employed-extra-fields');
    if (el) {
      el.style.display = isEmployed ? 'grid' : 'none';
    }
  },

  handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    const traineePayload = {
      name: formData.get('name'),
      age: formData.get('age'),
      gender: formData.get('gender'),
      education: formData.get('education'),
      location: formData.get('location'),
      region: formData.get('region'),
      tier: formData.get('tier'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      courseId: formData.get('courseId'),
      providerId: formData.get('providerId'),
      courseCompletionDate: formData.get('courseCompletionDate'),
      preTrainingSalary: formData.get('preTrainingSalary'),
      employmentStatus: formData.get('employmentStatus'),
      occupation: formData.get('occupation'),
      employer: formData.get('employer'),
      currentSalary: formData.get('currentSalary'),
      skillsAcquired: this.activeSkills,
      participateLongitudinalSurveys: formData.get('participateLongitudinalSurveys') === 'on',
      shareWithEmployers: formData.get('shareWithEmployers') === 'on',
      anonymizedResearchConsent: formData.get('anonymizedResearchConsent') === 'on'
    };

    const newTrainee = window.appState.addTrainee(traineePayload);
    
    // Switch view to their newly minted profile
    window.appState.setView('profile', { currentTraineeId: newTrainee.id });

    // Show toast
    if (window.App) {
      window.App.showToast(`Trainee ${newTrainee.name} registered successfully with ID ${newTrainee.id}!`, 'success');
    }
  }
};

window.RegistrationModule = RegistrationModule;
