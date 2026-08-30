/**
 * SkillTrack - Automated Longitudinal Follow-up Simulator
 * Simulates 3-month, 6-month, and 12-month survey dispatches and interactive questionnaires.
 */

const FollowupsModule = {
  render(state) {
    const trainees = state.trainees;
    const pending6m = trainees.filter(t => !t.surveys || !t.surveys['6m'] || !t.surveys['6m'].completed);
    const pending12m = trainees.filter(t => !t.surveys || !t.surveys['12m'] || !t.surveys['12m'].completed);

    return `
      <div class="space-y-8 max-w-6xl mx-auto py-6">
        
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900">Automated Follow-up Survey System</h1>
            <p class="text-sm text-slate-500 mt-1">Periodic longitudinal surveys at 3-month, 6-month, and 12-month post-training milestones.</p>
          </div>
          <div class="flex items-center gap-2">
            <button onclick="FollowupsModule.simulateBatchDispatch()" class="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-2">
              <i data-lucide="send" class="w-4 h-4"></i> Simulate Automated Batch Dispatch
            </button>
          </div>
        </div>

        <!-- Metric Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div class="glass-card p-5 rounded-2xl border-l-4 border-l-blue-500 shadow-sm">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-bold text-slate-500 uppercase">3-Month Follow-Up</span>
              <span class="p-2 bg-blue-50 text-blue-600 rounded-lg"><i data-lucide="check-circle" class="w-4 h-4"></i></span>
            </div>
            <p class="text-2xl font-extrabold text-slate-900">96.2%</p>
            <p class="text-xs text-slate-500 mt-1">Response Completion Rate</p>
          </div>

          <div class="glass-card p-5 rounded-2xl border-l-4 border-l-emerald-500 shadow-sm">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-bold text-slate-500 uppercase">6-Month Follow-Up</span>
              <span class="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><i data-lucide="activity" class="w-4 h-4"></i></span>
            </div>
            <p class="text-2xl font-extrabold text-slate-900">89.4%</p>
            <p class="text-xs text-slate-500 mt-1">${pending6m.length} surveys pending response</p>
          </div>

          <div class="glass-card p-5 rounded-2xl border-l-4 border-l-purple-500 shadow-sm">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-bold text-slate-500 uppercase">12-Month Retention</span>
              <span class="p-2 bg-purple-50 text-purple-600 rounded-lg"><i data-lucide="shield-check" class="w-4 h-4"></i></span>
            </div>
            <p class="text-2xl font-extrabold text-slate-900">84.8%</p>
            <p class="text-xs text-slate-500 mt-1">${pending12m.length} trainees in active cycle</p>
          </div>
        </div>

        <!-- Simulation Channel Preview (SMS / WhatsApp / Email) -->
        <div class="glass-card p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <i data-lucide="smartphone" class="w-4 h-4 text-blue-600"></i> Simulated Multi-Channel Notification Preview
          </h3>
          <div class="grid md:grid-cols-2 gap-6">
            
            <!-- SMS / WhatsApp Preview Card -->
            <div class="bg-slate-900 text-white p-5 rounded-2xl shadow-inner font-mono text-xs space-y-3 relative overflow-hidden">
              <div class="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800">
                <span class="flex items-center gap-1.5"><i data-lucide="message-square" class="w-3.5 h-3.5 text-emerald-400"></i> WhatsApp / SMS Gateway</span>
                <span class="text-[10px]">Auto-Trigger: Day 180</span>
              </div>
              <div class="p-3.5 bg-slate-800/90 rounded-xl text-slate-200 leading-relaxed text-[11px] border border-slate-700">
                <p class="font-bold text-emerald-400 mb-1">SkillTrack Outcomes Survey (6-Month Milestone)</p>
                <p>Hello Priya Sharma! You completed Data Analytics & AI 6 months ago. As part of your verified career record, please take 60 seconds to confirm your current job status and salary progression:</p>
                <p class="text-blue-400 underline mt-2">https://skilltrack.gov.in/survey/6m/TRN-1001</p>
              </div>
              <div class="flex justify-between items-center text-[10px] text-slate-400 pt-1">
                <span>Status: Simulated Delivery (Mock)</span>
                <span class="text-emerald-400">Delivered</span>
              </div>
            </div>

            <!-- Email Notification Preview Card -->
            <div class="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm text-xs space-y-3">
              <div class="flex items-center justify-between text-slate-500 pb-2 border-b border-slate-100">
                <span class="flex items-center gap-1.5"><i data-lucide="mail" class="w-3.5 h-3.5 text-blue-600"></i> Email Delivery Template</span>
                <span class="font-mono text-[10px]">automated-outcomes@skilltrack.gov</span>
              </div>
              <div class="space-y-1.5">
                <p class="font-bold text-slate-900 text-sm">Action Required: Your 6-Month Career Milestone Follow-up</p>
                <p class="text-slate-600 text-[11px] leading-relaxed">
                  Congratulations on your recent career milestones. Help us evaluate training impact and keep your skills credentials up to date.
                </p>
                <button onclick="FollowupsModule.openSurveyModal('TRN-1001', '6m')" class="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm">
                  Launch Interactive Survey Modal
                </button>
              </div>
            </div>

          </div>
        </div>

        <!-- Trainee Longitudinal Survey Management Table -->
        <div class="glass-card rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div class="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 class="text-base font-bold text-slate-900">Trainee Survey Cohort Tracker</h3>
              <p class="text-xs text-slate-500">Track individual submission status and trigger interactive mock surveys.</p>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-medium text-slate-500">Showing 10 of ${trainees.length}</span>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs text-slate-700">
              <thead class="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th class="px-5 py-3.5">Trainee</th>
                  <th class="px-4 py-3.5">Course & Provider</th>
                  <th class="px-4 py-3.5 text-center">3-Month Survey</th>
                  <th class="px-4 py-3.5 text-center">6-Month Survey</th>
                  <th class="px-4 py-3.5 text-center">12-Month Survey</th>
                  <th class="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                ${trainees.slice(0, 10).map(t => {
                  const s3 = t.surveys && t.surveys['3m'] && t.surveys['3m'].completed;
                  const s6 = t.surveys && t.surveys['6m'] && t.surveys['6m'].completed;
                  const s12 = t.surveys && t.surveys['12m'] && t.surveys['12m'].completed;

                  return `
                    <tr class="hover:bg-slate-50/80 transition">
                      <td class="px-5 py-4">
                        <div class="font-bold text-slate-900">${t.name}</div>
                        <div class="text-[11px] text-slate-500 font-mono">${t.id} • ${t.employmentStatus}</div>
                      </td>
                      <td class="px-4 py-4">
                        <div class="font-medium text-slate-800">${t.courseTitle}</div>
                        <div class="text-[11px] text-slate-500">${t.providerName}</div>
                      </td>
                      <td class="px-4 py-4 text-center">
                        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${s3 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
                          ${s3 ? 'Completed' : 'Pending'}
                        </span>
                      </td>
                      <td class="px-4 py-4 text-center">
                        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${s6 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
                          ${s6 ? 'Completed' : 'Pending'}
                        </span>
                      </td>
                      <td class="px-4 py-4 text-center">
                        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${s12 ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-600'}">
                          ${s12 ? 'Completed' : 'Upcoming'}
                        </span>
                      </td>
                      <td class="px-5 py-4 text-right">
                        <button onclick="FollowupsModule.openSurveyModal('${t.id}', '${!s6 ? '6m' : '12m'}')" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-[11px] font-semibold transition">
                          Take Survey
                        </button>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    `;
  },

  openSurveyModal(traineeId, surveyType = '6m') {
    const trainee = window.appState.getTraineeById(traineeId);
    if (!trainee) return;

    const modalContainer = document.getElementById('global-modal-container');
    if (!modalContainer) return;

    modalContainer.innerHTML = `
      <div class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="glass-card bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-fade-in-up">
          
          <!-- Modal Header -->
          <div class="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
            <div>
              <span class="px-2.5 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[11px] font-bold uppercase tracking-wider">
                ${surveyType.toUpperCase()} Periodic Outcome Survey
              </span>
              <h3 class="text-xl font-extrabold text-slate-900 mt-1">Survey for ${trainee.name}</h3>
              <p class="text-xs text-slate-500">${trainee.courseTitle} • ${trainee.providerName}</p>
            </div>
            <button onclick="FollowupsModule.closeModal()" class="p-2 text-slate-400 hover:text-slate-700 rounded-lg">
              <i data-lucide="x" class="w-5 h-5"></i>
            </button>
          </div>

          <!-- Survey Form (EXACT REQUIRED QUESTIONS) -->
          <form id="followup-survey-form" onsubmit="FollowupsModule.handleSurveySubmit(event, '${trainee.id}', '${surveyType}')" class="space-y-5 text-xs text-slate-700">
            
            <!-- Question 1: Are you currently employed? -->
            <div class="space-y-2">
              <label class="block font-bold text-slate-900 text-sm">1. Are you currently employed?</label>
              <div class="flex gap-4">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="employed" value="true" checked class="text-blue-600 focus:ring-blue-500" />
                  <span class="font-medium text-slate-800">Yes, employed</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="employed" value="false" class="text-blue-600 focus:ring-blue-500" />
                  <span class="font-medium text-slate-800">No, currently seeking employment</span>
                </label>
              </div>
            </div>

            <!-- Question 2: Are you self-employed? -->
            <div class="space-y-2">
              <label class="block font-bold text-slate-900 text-sm">2. Are you self-employed or running an enterprise?</label>
              <div class="flex gap-4">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="isSelfEmployed" value="true" ${trainee.isSelfEmployed ? 'checked' : ''} class="text-blue-600 focus:ring-blue-500" />
                  <span class="font-medium text-slate-800">Yes (Self-Employed / Vendor / Freelancer)</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="isSelfEmployed" value="false" ${!trainee.isSelfEmployed ? 'checked' : ''} class="text-blue-600 focus:ring-blue-500" />
                  <span class="font-medium text-slate-800">No (Salaried Employee or Not working)</span>
                </label>
              </div>
            </div>

            <!-- Question 3: Current Job & Employer -->
            <div class="grid sm:grid-cols-2 gap-4">
              <div>
                <label class="block font-bold text-slate-900 mb-1">3. What is your current job / occupation?</label>
                <input type="text" name="jobTitle" value="${trainee.occupation}" required class="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs" />
              </div>
              <div>
                <label class="block font-bold text-slate-900 mb-1">Employer / Company Name</label>
                <input type="text" name="employer" value="${trainee.employer}" required class="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs" />
              </div>
            </div>

            <!-- Question 4: Current Salary/Income -->
            <div>
              <label class="block font-bold text-slate-900 mb-1">4. What is your current monthly salary/income (₹)?</label>
              <input type="number" name="salary" value="${trainee.currentSalary || 45000}" min="0" step="500" required class="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs" />
            </div>

            <!-- Question 5: Skill Utilization -->
            <div class="space-y-2">
              <label class="block font-bold text-slate-900 text-sm">5. Are you actively using the skills learned during training in your daily work?</label>
              <div class="flex gap-4">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="usingSkills" value="true" checked class="text-blue-600 focus:ring-blue-500" />
                  <span class="font-medium text-slate-800">Yes, daily or weekly</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="usingSkills" value="false" class="text-blue-600 focus:ring-blue-500" />
                  <span class="font-medium text-slate-800">No, job uses different skills</span>
                </label>
              </div>
            </div>

            <!-- Question 6: Did you change jobs? -->
            <div class="space-y-2">
              <label class="block font-bold text-slate-900 text-sm">6. Did you change jobs or receive a promotion since last survey?</label>
              <div class="flex gap-4">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="changedJobs" value="true" class="text-blue-600 focus:ring-blue-500" />
                  <span class="font-medium text-slate-800">Yes (New job / Promotion with higher wage)</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="changedJobs" value="false" checked class="text-blue-600 focus:ring-blue-500" />
                  <span class="font-medium text-slate-800">No (Retained same role)</span>
                </label>
              </div>
            </div>

            <!-- Question 7: Additional skills needed -->
            <div>
              <label class="block font-bold text-slate-900 mb-1">7. What additional skills or certifications do you need now?</label>
              <input type="text" name="missingSkills" placeholder="e.g. AWS Cloud, Advanced SQL, Generative AI, Leadership" class="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs" />
            </div>

            <!-- Actions -->
            <div class="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button type="button" onclick="FollowupsModule.closeModal()" class="px-4 py-2 text-slate-600 hover:bg-slate-50 font-semibold rounded-lg">
                Cancel
              </button>
              <button type="submit" class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-md shadow-blue-500/20">
                Submit Survey Response
              </button>
            </div>
          </form>

        </div>
      </div>
    `;

    if (window.lucide) lucide.createIcons();
  },

  closeModal() {
    const modalContainer = document.getElementById('global-modal-container');
    if (modalContainer) modalContainer.innerHTML = '';
  },

  handleSurveySubmit(e, traineeId, surveyType) {
    e.preventDefault();
    const formData = new FormData(e.target);

    const surveyData = {
      employed: formData.get('employed') === 'true',
      isSelfEmployed: formData.get('isSelfEmployed') === 'true',
      jobTitle: formData.get('jobTitle'),
      employer: formData.get('employer'),
      salary: formData.get('salary'),
      usingSkills: formData.get('usingSkills') === 'true',
      changedJobs: formData.get('changedJobs') === 'true',
      missingSkills: formData.get('missingSkills') ? [formData.get('missingSkills')] : ['Advanced Tooling'],
      satisfaction: 5
    };

    window.appState.submitSurvey(traineeId, surveyType, surveyData);
    this.closeModal();

    if (window.App) {
      window.App.showToast(`Survey response recorded! Trainee profile & longitudinal metrics updated.`, 'success');
    }
  },

  simulateBatchDispatch() {
    if (window.App) {
      window.App.showToast(`Simulated dispatch of 48 SMS & WhatsApp survey invitations across cohorts!`, 'info');
    }
  }
};

window.FollowupsModule = FollowupsModule;
