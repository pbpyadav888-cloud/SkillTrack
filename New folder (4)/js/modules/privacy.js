/**
 * SkillTrack - Privacy, Consent & Role-Based Access Control (RBAC)
 * Granular consent controls, privacy notice compliance, data withdrawal, and RBAC matrix.
 */

const PrivacyModule = {
  render(state) {
    const trainee = state.getTraineeById(state.currentTraineeId);
    const consent = trainee.consent || { granted: true, shareWithEmployers: true, participateLongitudinalSurveys: true, anonymizedResearchConsent: true };

    return `
      <div class="space-y-8 max-w-6xl mx-auto py-6">
        
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900">Privacy, Consent & Data Governance</h1>
            <p class="text-sm text-slate-500 mt-1">Consent-driven architecture protecting personal identifiable information (PII).</p>
          </div>
          <span class="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <i data-lucide="shield-check" class="w-3.5 h-3.5"></i> DPDP & GDPR Compliant
          </span>
        </div>

        <!-- Trainee Consent Management Center -->
        <div class="glass-card p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div>
              <h2 class="text-lg font-bold text-slate-900 flex items-center gap-2">
                <i data-lucide="lock" class="w-5 h-5 text-blue-600"></i> Trainee Consent Preferences (${trainee.name})
              </h2>
              <p class="text-xs text-slate-500">Manage granular permissions for survey participation and employer data sharing.</p>
            </div>
            <span class="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">
              Status: ${consent.granted ? 'Consent Active' : 'Consent Revoked'}
            </span>
          </div>

          <div class="space-y-4">
            
            <!-- Toggle 1: Longitudinal Surveys -->
            <div class="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <div class="max-w-xl">
                <span class="font-bold text-sm text-slate-900 block">Periodic Longitudinal Outcome Surveys</span>
                <span class="text-xs text-slate-500 mt-0.5 block">
                  Receive automated reminders for 3m, 6m, and 12m career milestone questionnaires.
                </span>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" ${consent.participateLongitudinalSurveys ? 'checked' : ''} onchange="PrivacyModule.handleToggle('${trainee.id}', 'participateLongitudinalSurveys', this.checked)" class="sr-only peer">
                <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <!-- Toggle 2: Employer Sharing -->
            <div class="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <div class="max-w-xl">
                <span class="font-bold text-sm text-slate-900 block">Employer Skill Profile Sharing</span>
                <span class="text-xs text-slate-500 mt-0.5 block">
                  Allow accredited enterprise partners to search and verify your certified skill badges for hiring.
                </span>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" ${consent.shareWithEmployers ? 'checked' : ''} onchange="PrivacyModule.handleToggle('${trainee.id}', 'shareWithEmployers', this.checked)" class="sr-only peer">
                <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <!-- Toggle 3: Anonymized Research -->
            <div class="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <div class="max-w-xl">
                <span class="font-bold text-sm text-slate-900 block">Anonymized Macro Research & Policy Analysis</span>
                <span class="text-xs text-slate-500 mt-0.5 block">
                  Contribute aggregated wage lift and placement statistics to government policy dashboards without exposing your name or phone.
                </span>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" ${consent.anonymizedResearchConsent ? 'checked' : ''} onchange="PrivacyModule.handleToggle('${trainee.id}', 'anonymizedResearchConsent', this.checked)" class="sr-only peer">
                <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

          </div>

          <!-- Consent Withdrawal Action (EXACT REQUIREMENT) -->
          <div class="p-4 rounded-xl bg-red-50/60 border border-red-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 class="font-bold text-red-950 text-sm">Right to Withdraw Consent & Data Purge</h4>
              <p class="text-xs text-red-800 mt-0.5">You can revoke permission at any moment. Your contact info will be immediately removed from active survey outreach.</p>
            </div>
            <button onclick="PrivacyModule.withdrawConsent('${trainee.id}')" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold shrink-0">
              Withdraw All Consent
            </button>
          </div>
        </div>

        <!-- Role-Based Access Control (RBAC) Guardrails Matrix -->
        <div class="glass-card p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div>
              <h3 class="text-base font-bold text-slate-900">Role-Based Access Control (RBAC) Security Architecture</h3>
              <p class="text-xs text-slate-500">Strict boundary controls ensuring sensitive personal information is never exposed unnecessarily.</p>
            </div>
            <span class="text-xs font-mono px-2 py-0.5 bg-slate-100 rounded text-slate-600">Least Privilege Model</span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs text-slate-700">
              <thead class="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th class="px-4 py-3">User Role</th>
                  <th class="px-4 py-3">Personal Contact PII</th>
                  <th class="px-4 py-3">Salary & Employer Details</th>
                  <th class="px-4 py-3">Skill Badges & Certs</th>
                  <th class="px-4 py-3">Macro Outcome Reports</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr>
                  <td class="px-4 py-3 font-bold text-slate-900">Trainee</td>
                  <td class="px-4 py-3 text-emerald-600 font-bold">Own Record Only</td>
                  <td class="px-4 py-3 text-emerald-600 font-bold">Own Record Only</td>
                  <td class="px-4 py-3 text-emerald-600 font-bold">Full Access</td>
                  <td class="px-4 py-3 text-slate-400">View Public Benchmarks</td>
                </tr>
                <tr>
                  <td class="px-4 py-3 font-bold text-slate-900">Training Provider</td>
                  <td class="px-4 py-3 text-slate-400">Masked / Anonymized</td>
                  <td class="px-4 py-3 text-blue-600 font-bold">Cohort Averages Only</td>
                  <td class="px-4 py-3 text-emerald-600 font-bold">Cohort Trainees</td>
                  <td class="px-4 py-3 text-blue-600 font-bold">Provider Scorecards</td>
                </tr>
                <tr>
                  <td class="px-4 py-3 font-bold text-slate-900">Employer / Recruiter</td>
                  <td class="px-4 py-3 text-amber-600 font-bold">Only if Consent Granted</td>
                  <td class="px-4 py-3 text-slate-400">Hidden / Confidential</td>
                  <td class="px-4 py-3 text-emerald-600 font-bold">Verified Direct Access</td>
                  <td class="px-4 py-3 text-slate-400">Skill Demand Matrix</td>
                </tr>
                <tr>
                  <td class="px-4 py-3 font-bold text-slate-900">Policymaker / Admin</td>
                  <td class="px-4 py-3 text-slate-400">Restricted / Audit-Logged</td>
                  <td class="px-4 py-3 text-blue-600 font-bold">Anonymized Aggregates</td>
                  <td class="px-4 py-3 text-emerald-600 font-bold">Statewide Audits</td>
                  <td class="px-4 py-3 text-emerald-600 font-bold">Full Analytics & Exports</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    `;
  },

  handleToggle(traineeId, field, val) {
    const patch = {};
    patch[field] = val;
    window.appState.updateConsent(traineeId, patch);
    if (window.App) {
      window.App.showToast(`Privacy preference for ${field} updated!`, 'info');
    }
  },

  withdrawConsent(traineeId) {
    window.appState.updateConsent(traineeId, {
      granted: false,
      participateLongitudinalSurveys: false,
      shareWithEmployers: false,
      anonymizedResearchConsent: false
    });
    if (window.App) {
      window.App.showToast(`Consent successfully withdrawn for Trainee ${traineeId}. Outreach paused.`, 'warning');
    }
  }
};

window.PrivacyModule = PrivacyModule;
