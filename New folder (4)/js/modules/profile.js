/**
 * SkillTrack - Trainee Profile & Longitudinal Journey Timeline
 * Detailed longitudinal profile with 6-stage milestone tracker, salary lift, and survey logs.
 */

const ProfileModule = {
  render(state) {
    const trainee = state.getTraineeById(state.currentTraineeId);
    if (!trainee) {
      return `<div class="p-8 text-center text-slate-500">Trainee record not found.</div>`;
    }

    const salaryGrowth = trainee.preTrainingSalary > 0
      ? Math.round(((trainee.currentSalary - trainee.preTrainingSalary) / trainee.preTrainingSalary) * 100)
      : (trainee.currentSalary > 0 ? 100 : 0);

    const isEmployed = trainee.employmentStatus === 'Employed' || trainee.employmentStatus === 'Self-Employed';

    // Status badge style
    let statusBg = 'bg-blue-100 text-blue-800 border-blue-200';
    if (trainee.employmentStatus === 'Self-Employed') statusBg = 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (trainee.employmentStatus === 'Unemployed') statusBg = 'bg-amber-100 text-amber-800 border-amber-200';

    return `
      <div class="space-y-8 max-w-6xl mx-auto py-6">
        
        <!-- Header & Trainee Quick Switcher -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div class="flex items-center gap-3">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-xl font-bold shadow-md shadow-blue-500/20">
              ${trainee.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h1 class="text-2xl font-extrabold text-slate-900">${trainee.name}</h1>
                <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusBg}">
                  ${trainee.employmentStatus}
                </span>
              </div>
              <p class="text-xs text-slate-500 mt-0.5">
                ID: <span class="font-mono font-medium text-slate-700">${trainee.id}</span> • ${trainee.location} (${trainee.tier})
              </p>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <!-- Trainee Selector for Prototype Convenience -->
            <div class="flex items-center gap-2">
              <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:block">View Trainee:</label>
              <select onchange="appState.setView('profile', { currentTraineeId: this.value })" class="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                ${state.trainees.slice(0, 20).map(t => `<option value="${t.id}" ${t.id === trainee.id ? 'selected' : ''}>${t.name} (${t.courseTitle.split('&')[0]})</option>`).join('')}
              </select>
            </div>

            <button onclick="FollowupsModule.openSurveyModal('${trainee.id}', '6m')" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5">
              <i data-lucide="clipboard-check" class="w-4 h-4"></i> Take Follow-Up Survey
            </button>
          </div>
        </div>

        <!-- 6-Stage Longitudinal Journey Timeline (CORE REQUIREMENT) -->
        <div class="glass-card rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h2 class="text-lg font-bold text-slate-900 flex items-center gap-2">
                <i data-lucide="git-commit" class="w-5 h-5 text-blue-600"></i>
                Longitudinal Career Progression Journey
              </h2>
              <p class="text-xs text-slate-500 mt-0.5">Verifiable milestone checkpoints from program enrollment to wage retention</p>
            </div>
            <span class="text-xs font-mono px-2.5 py-1 bg-slate-100 rounded-md text-slate-600">
              Tracking Duration: ${trainee.employmentDurationMonths > 0 ? trainee.employmentDurationMonths + ' Months' : 'Active'}
            </span>
          </div>

          <!-- Horizontal Visual Flow -->
          <div class="relative py-4 overflow-x-auto">
            <div class="min-w-[680px]">
              <div class="grid grid-cols-6 gap-2 relative">
                
                <!-- Stage 1: Training -->
                <div class="flex flex-col items-center text-center group">
                  <div class="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shadow-md shadow-blue-500/30 z-10">
                    <i data-lucide="book-open" class="w-5 h-5"></i>
                  </div>
                  <span class="text-xs font-bold text-slate-900 mt-3">1. Training</span>
                  <span class="text-[11px] text-slate-500 mt-0.5">${trainee.courseTitle.split('&')[0]}</span>
                  <span class="text-[10px] font-mono text-emerald-600 mt-1 font-semibold">Enrolled</span>
                </div>

                <!-- Stage 2: Course Completion -->
                <div class="flex flex-col items-center text-center group">
                  <div class="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shadow-md shadow-blue-500/30 z-10">
                    <i data-lucide="award" class="w-5 h-5"></i>
                  </div>
                  <span class="text-xs font-bold text-slate-900 mt-3">2. Completion</span>
                  <span class="text-[11px] text-slate-500 mt-0.5">${trainee.courseCompletionDate}</span>
                  <span class="text-[10px] font-mono text-emerald-600 mt-1 font-semibold">Certified</span>
                </div>

                <!-- Stage 3: Job Search -->
                <div class="flex flex-col items-center text-center group">
                  <div class="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shadow-md shadow-blue-500/30 z-10">
                    <i data-lucide="compass" class="w-5 h-5"></i>
                  </div>
                  <span class="text-xs font-bold text-slate-900 mt-3">3. Job Search</span>
                  <span class="text-[11px] text-slate-500 mt-0.5">${trainee.timeToEmploymentDays ? trainee.timeToEmploymentDays + ' Days' : 'In Pipeline'}</span>
                  <span class="text-[10px] font-mono text-blue-600 mt-1 font-semibold">Placed</span>
                </div>

                <!-- Stage 4: Employment / Self-Employment -->
                <div class="flex flex-col items-center text-center group">
                  <div class="w-10 h-10 rounded-full ${isEmployed ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'} flex items-center justify-center text-sm font-bold shadow-md z-10">
                    <i data-lucide="briefcase" class="w-5 h-5"></i>
                  </div>
                  <span class="text-xs font-bold text-slate-900 mt-3">4. Employment</span>
                  <span class="text-[11px] text-slate-500 mt-0.5 truncate max-w-[100px]">${trainee.employer}</span>
                  <span class="text-[10px] font-mono ${isEmployed ? 'text-emerald-600' : 'text-slate-400'} mt-1 font-semibold">
                    ${trainee.employmentStatus}
                  </span>
                </div>

                <!-- Stage 5: Salary Progression -->
                <div class="flex flex-col items-center text-center group">
                  <div class="w-10 h-10 rounded-full ${trainee.currentSalary > 0 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'} flex items-center justify-center text-sm font-bold shadow-md z-10">
                    <i data-lucide="trending-up" class="w-5 h-5"></i>
                  </div>
                  <span class="text-xs font-bold text-slate-900 mt-3">5. Wage Lift</span>
                  <span class="text-[11px] font-semibold text-slate-900 mt-0.5">₹${trainee.currentSalary.toLocaleString('en-IN')}/mo</span>
                  <span class="text-[10px] font-mono text-emerald-600 mt-1 font-semibold">
                    ${salaryGrowth > 0 ? `+${salaryGrowth}% Lift` : 'Baseline'}
                  </span>
                </div>

                <!-- Stage 6: Retention Milestone -->
                <div class="flex flex-col items-center text-center group">
                  <div class="w-10 h-10 rounded-full ${trainee.surveys && trainee.surveys['12m'] && trainee.surveys['12m'].completed ? 'bg-purple-600 text-white' : (isEmployed ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500')} flex items-center justify-center text-sm font-bold shadow-md z-10">
                    <i data-lucide="shield-check" class="w-5 h-5"></i>
                  </div>
                  <span class="text-xs font-bold text-slate-900 mt-3">6. Retention</span>
                  <span class="text-[11px] text-slate-500 mt-0.5">6m & 12m Check</span>
                  <span class="text-[10px] font-mono text-purple-600 mt-1 font-semibold">
                    ${trainee.surveys && trainee.surveys['12m'] && trainee.surveys['12m'].completed ? '12m Verified' : '6m Verified'}
                  </span>
                </div>

              </div>
            </div>
          </div>
        </div>

        <!-- 3-Column Profile Breakdown Grid -->
        <div class="grid lg:grid-cols-3 gap-6">
          
          <!-- Column 1: Personal & Educational Profile -->
          <div class="glass-card rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">
            <div>
              <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-3">
                <i data-lucide="user" class="w-4 h-4 text-blue-600"></i> Personal Information
              </h3>
              <div class="space-y-2.5 text-xs">
                <div class="flex justify-between py-1.5 border-b border-slate-100">
                  <span class="text-slate-500">Age & Gender</span>
                  <span class="font-semibold text-slate-900">${trainee.age} Years • ${trainee.gender}</span>
                </div>
                <div class="flex justify-between py-1.5 border-b border-slate-100">
                  <span class="text-slate-500">Education</span>
                  <span class="font-semibold text-slate-900">${trainee.education}</span>
                </div>
                <div class="flex justify-between py-1.5 border-b border-slate-100">
                  <span class="text-slate-500">Location</span>
                  <span class="font-semibold text-slate-900">${trainee.location}</span>
                </div>
                <div class="flex justify-between py-1.5 border-b border-slate-100">
                  <span class="text-slate-500">Email</span>
                  <span class="font-semibold text-slate-900">${trainee.contact.email}</span>
                </div>
                <div class="flex justify-between py-1.5">
                  <span class="text-slate-500">Phone</span>
                  <span class="font-semibold text-slate-900">${trainee.contact.phone}</span>
                </div>
              </div>
            </div>

            <!-- Training Details -->
            <div class="pt-4 border-t border-slate-100">
              <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-3">
                <i data-lucide="graduation-cap" class="w-4 h-4 text-blue-600"></i> Training Credentials
              </h3>
              <div class="p-3.5 bg-blue-50/60 rounded-xl border border-blue-100 space-y-2 text-xs">
                <div>
                  <span class="text-slate-500 block">Training Course:</span>
                  <span class="font-bold text-slate-900">${trainee.courseTitle}</span>
                </div>
                <div>
                  <span class="text-slate-500 block">Training Provider:</span>
                  <span class="font-bold text-slate-900">${trainee.providerName}</span>
                </div>
                <div class="flex justify-between pt-1">
                  <span class="text-slate-500">Completion:</span>
                  <span class="font-semibold text-slate-900">${trainee.courseCompletionDate}</span>
                </div>
              </div>
            </div>

            <!-- Skills Acquired -->
            <div class="pt-4 border-t border-slate-100">
              <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-3">
                <i data-lucide="sparkles" class="w-4 h-4 text-blue-600"></i> Skills Acquired (${trainee.skillsAcquired.length})
              </h3>
              <div class="flex flex-wrap gap-1.5">
                ${trainee.skillsAcquired.map(skill => `
                  <span class="px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 text-xs font-semibold">
                    ${skill}
                  </span>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Column 2: Current Employment & Income Progression -->
          <div class="glass-card rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">
            <div>
              <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-3">
                <i data-lucide="briefcase" class="w-4 h-4 text-emerald-600"></i> Current Employment Status
              </h3>
              
              <div class="p-4 rounded-xl ${isEmployed ? 'bg-emerald-50/50 border border-emerald-200' : 'bg-amber-50/50 border border-amber-200'}">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs uppercase font-bold text-slate-500">Current Role</span>
                  <span class="px-2 py-0.5 rounded text-[11px] font-bold ${statusBg}">${trainee.employmentStatus}</span>
                </div>
                <h4 class="text-base font-extrabold text-slate-900">${trainee.occupation}</h4>
                <p class="text-xs text-slate-600 mt-0.5">${trainee.employer} (${trainee.employerSector || 'Sector'})</p>

                <div class="mt-4 pt-3 border-t border-emerald-200/60 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span class="text-slate-500 block">Start Date</span>
                    <span class="font-bold text-slate-900">${trainee.employmentStartDate || 'N/A'}</span>
                  </div>
                  <div>
                    <span class="text-slate-500 block">Skill Utilization</span>
                    <span class="font-bold text-emerald-700">${trainee.skillUtilizationRate}% On-the-job</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Wage Lift Indicator Card -->
            <div class="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-blue-950 text-white shadow-md">
              <div class="flex justify-between items-start mb-3">
                <div>
                  <span class="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Monthly Income Lift</span>
                  <h4 class="text-2xl font-extrabold mt-0.5 text-white">
                    ₹${trainee.currentSalary.toLocaleString('en-IN')}<span class="text-xs text-slate-300 font-normal">/mo</span>
                  </h4>
                </div>
                <span class="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
                  +${salaryGrowth}% Jump
                </span>
              </div>
              <div class="flex justify-between text-xs text-slate-300 pt-2 border-t border-slate-800">
                <span>Pre-Training: ₹${trainee.preTrainingSalary.toLocaleString('en-IN')}/mo</span>
                <span>Net Lift: +₹${(trainee.currentSalary - trainee.preTrainingSalary).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <!-- Self-Employment Badge (if applicable) -->
            ${trainee.isSelfEmployed ? `
              <div class="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
                <i data-lucide="store" class="w-4 h-4 text-amber-700 shrink-0"></i>
                <span><strong>Self-Employed / Independent Contractor:</strong> Generates direct freelance and client service revenue.</span>
              </div>
            ` : ''}
          </div>

          <!-- Column 3: Automated Longitudinal Follow-up History -->
          <div class="glass-card rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <i data-lucide="clock" class="w-4 h-4 text-purple-600"></i> Follow-up Surveys
              </h3>
              <span class="text-xs text-slate-500 font-mono">3m / 6m / 12m</span>
            </div>

            <!-- 3-Month Survey -->
            <div class="p-3.5 rounded-xl border ${trainee.surveys && trainee.surveys['3m'] && trainee.surveys['3m'].completed ? 'bg-emerald-50/40 border-emerald-200' : 'bg-slate-50 border-slate-200'} text-xs space-y-1.5">
              <div class="flex items-center justify-between">
                <span class="font-bold text-slate-900 flex items-center gap-1.5">
                  <i data-lucide="check-circle-2" class="w-3.5 h-3.5 text-emerald-600"></i>
                  3-Month Periodic Survey
                </span>
                <span class="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Verified</span>
              </div>
              <p class="text-slate-600 text-[11px]">Employed: ${trainee.surveys['3m'].employed ? 'Yes' : 'No'} • Salary: ₹${trainee.surveys['3m'].salary.toLocaleString('en-IN')}</p>
              <span class="text-[10px] text-slate-400 block font-mono">Date: ${trainee.surveys['3m'].date}</span>
            </div>

            <!-- 6-Month Survey -->
            <div class="p-3.5 rounded-xl border ${trainee.surveys && trainee.surveys['6m'] && trainee.surveys['6m'].completed ? 'bg-emerald-50/40 border-emerald-200' : 'bg-amber-50/40 border-amber-200'} text-xs space-y-1.5">
              <div class="flex items-center justify-between">
                <span class="font-bold text-slate-900 flex items-center gap-1.5">
                  <i data-lucide="${trainee.surveys && trainee.surveys['6m'] && trainee.surveys['6m'].completed ? 'check-circle-2' : 'clock'}" class="w-3.5 h-3.5 ${trainee.surveys && trainee.surveys['6m'] && trainee.surveys['6m'].completed ? 'text-emerald-600' : 'text-amber-600'}"></i>
                  6-Month Periodic Survey
                </span>
                <span class="text-[10px] font-semibold ${trainee.surveys && trainee.surveys['6m'] && trainee.surveys['6m'].completed ? 'text-emerald-700 bg-emerald-100' : 'text-amber-700 bg-amber-100'} px-2 py-0.5 rounded">
                  ${trainee.surveys && trainee.surveys['6m'] && trainee.surveys['6m'].completed ? 'Verified' : 'Pending'}
                </span>
              </div>
              ${trainee.surveys && trainee.surveys['6m'] && trainee.surveys['6m'].completed ? `
                <p class="text-slate-600 text-[11px]">Salary: ₹${trainee.surveys['6m'].salary.toLocaleString('en-IN')} • Using Skills: ${trainee.surveys['6m'].usingSkills ? 'Yes' : 'No'}</p>
                <span class="text-[10px] text-slate-400 block font-mono">Date: ${trainee.surveys['6m'].date}</span>
              ` : `
                <button onclick="FollowupsModule.openSurveyModal('${trainee.id}', '6m')" class="w-full mt-2 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-xs">
                  Trigger 6-Month Survey Now
                </button>
              `}
            </div>

            <!-- 12-Month Survey -->
            <div class="p-3.5 rounded-xl border ${trainee.surveys && trainee.surveys['12m'] && trainee.surveys['12m'].completed ? 'bg-purple-50/40 border-purple-200' : 'bg-slate-50 border-slate-200'} text-xs space-y-1.5">
              <div class="flex items-center justify-between">
                <span class="font-bold text-slate-900 flex items-center gap-1.5">
                  <i data-lucide="${trainee.surveys && trainee.surveys['12m'] && trainee.surveys['12m'].completed ? 'check-circle-2' : 'calendar'}" class="w-3.5 h-3.5 ${trainee.surveys && trainee.surveys['12m'] && trainee.surveys['12m'].completed ? 'text-purple-600' : 'text-slate-400'}"></i>
                  12-Month Retention Survey
                </span>
                <span class="text-[10px] font-semibold ${trainee.surveys && trainee.surveys['12m'] && trainee.surveys['12m'].completed ? 'text-purple-700 bg-purple-100' : 'text-slate-600 bg-slate-200'} px-2 py-0.5 rounded">
                  ${trainee.surveys && trainee.surveys['12m'] && trainee.surveys['12m'].completed ? 'Completed' : 'Upcoming'}
                </span>
              </div>
              ${trainee.surveys && trainee.surveys['12m'] && trainee.surveys['12m'].completed ? `
                <p class="text-slate-600 text-[11px]">12-Month Verified Income: ₹${trainee.surveys['12m'].salary.toLocaleString('en-IN')}</p>
                <span class="text-[10px] text-slate-400 block font-mono">Date: ${trainee.surveys['12m'].date}</span>
              ` : `
                <button onclick="FollowupsModule.openSurveyModal('${trainee.id}', '12m')" class="w-full mt-2 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold text-xs">
                  Simulate 12-Month Check
                </button>
              `}
            </div>

            <!-- Privacy Consent Status -->
            <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div class="flex items-center justify-between text-slate-700 font-semibold mb-1">
                <span>Privacy & Consent:</span>
                <span class="text-emerald-600 flex items-center gap-1 font-bold">
                  <i data-lucide="shield-check" class="w-3 h-3"></i> Active
                </span>
              </div>
              <p class="text-[11px] text-slate-500">Explicit consent granted for longitudinal surveys and anonymized policy analysis.</p>
            </div>

          </div>
        </div>

      </div>
    `;
  }
};

window.ProfileModule = ProfileModule;
