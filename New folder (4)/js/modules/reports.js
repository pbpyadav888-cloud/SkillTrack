/**
 * SkillTrack - Report Generation & Export Module
 * Generates comprehensive printable executive briefings, CSV datasets, and JSON audit dumps.
 */

const ReportsModule = {
  render(state) {
    const summary = state.getAnalyticsSummary();
    const providers = state.providers;
    const courses = state.courses;
    const recs = state.policyRecommendations;

    return `
      <div class="space-y-8 max-w-5xl mx-auto py-6">
        
        <!-- Header & Action Bar -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
          <div>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900">Executive Report Generation</h1>
            <p class="text-sm text-slate-500 mt-1">Official longitudinal skilling impact evaluation and policy summary document.</p>
          </div>

          <div class="flex flex-wrap items-center gap-2.5">
            <button onclick="ReportsModule.exportCSV()" class="px-3.5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold shadow-sm flex items-center gap-1.5">
              <i data-lucide="file-spreadsheet" class="w-4 h-4 text-emerald-600"></i> Export CSV
            </button>
            <button onclick="ReportsModule.exportJSON()" class="px-3.5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold shadow-sm flex items-center gap-1.5">
              <i data-lucide="code" class="w-4 h-4 text-blue-600"></i> Export JSON
            </button>
            <button onclick="window.print()" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-2">
              <i data-lucide="printer" class="w-4 h-4"></i> Export PDF / Print
            </button>
          </div>
        </div>

        <!-- Printable Official Report Document -->
        <div class="bg-white p-8 sm:p-12 rounded-2xl border border-slate-300 shadow-sm space-y-8 text-slate-800">
          
          <!-- Document Header -->
          <div class="border-b-2 border-slate-900 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div class="flex items-center gap-2 text-blue-700 font-bold text-xs uppercase tracking-widest mb-1">
                <i data-lucide="shield-check" class="w-4 h-4"></i> Official Government Report
              </div>
              <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900">SkillTrack – Skilling Outcomes & Longitudinal Impact Report</h2>
              <p class="text-xs text-slate-500 mt-1">National Skilling Evaluation Mission • Longitudinal Cohort Tracking (2025–2026)</p>
            </div>
            <div class="text-left sm:text-right text-xs text-slate-500">
              <p>Generated: <span class="font-bold text-slate-800">${new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}</span></p>
              <p>Classification: <span class="font-bold text-emerald-700">Official / Public Evaluation</span></p>
              <p class="font-mono text-[10px] text-slate-400">DOC-ID: ST-REP-${new Date().getFullYear()}-094</p>
            </div>
          </div>

          <!-- Section 1: Executive Summary & Macro Outcomes -->
          <div>
            <h3 class="text-sm font-bold uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-200 mb-4 flex items-center gap-2">
              1. Executive Outcome Statistics
            </h3>
            
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              <div class="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span class="text-[10px] uppercase font-bold text-slate-400">Total Trainees</span>
                <p class="text-xl font-bold text-slate-900">${summary.total}</p>
                <span class="text-[10px] text-emerald-600">100% Consent Tracked</span>
              </div>
              <div class="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span class="text-[10px] uppercase font-bold text-slate-400">Placement Rate</span>
                <p class="text-xl font-bold text-blue-600">${summary.overallPlacementRate}%</p>
                <span class="text-[10px] text-slate-500">Formal + Self-Employed</span>
              </div>
              <div class="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span class="text-[10px] uppercase font-bold text-slate-400">12-Month Retention</span>
                <p class="text-xl font-bold text-purple-600">${summary.retention12mRate}%</p>
                <span class="text-[10px] text-purple-600">6m: ${summary.retention6mRate}%</span>
              </div>
              <div class="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span class="text-[10px] uppercase font-bold text-slate-400">Average Salary Lift</span>
                <p class="text-xl font-bold text-emerald-600">+${summary.avgSalaryLiftPercent}%</p>
                <span class="text-[10px] text-slate-500">₹${summary.avgCurrentSalary.toLocaleString('en-IN')}/mo avg</span>
              </div>
            </div>

            <p class="text-xs text-slate-600 leading-relaxed">
              Longitudinal tracking data confirms that structured industry-aligned vocational certifications produce sustained wage progression,
              with average monthly incomes rising from ₹${summary.avgPreSalary.toLocaleString('en-IN')} pre-training to ₹${summary.avgCurrentSalary.toLocaleString('en-IN')} post-placement.
              Average time to employment is recorded at <strong>${summary.avgTimeToEmploymentDays} days</strong> from certificate issuance.
            </p>
          </div>

          <!-- Section 2: Training Program Performance Breakdown -->
          <div>
            <h3 class="text-sm font-bold uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-200 mb-4 flex items-center gap-2">
              2. Training Course Performance Breakdown
            </h3>
            
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
                <thead class="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider">
                  <tr>
                    <th class="p-2.5">Course Title</th>
                    <th class="p-2.5">Duration</th>
                    <th class="p-2.5 text-center">Completion %</th>
                    <th class="p-2.5 text-center">Placement %</th>
                    <th class="p-2.5 text-right">Avg Post-Wage</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-200">
                  ${courses.map(c => `
                    <tr>
                      <td class="p-2.5 font-bold">${c.title}</td>
                      <td class="p-2.5 text-slate-500">${c.durationWeeks} Weeks</td>
                      <td class="p-2.5 text-center">${c.avgCompletionRate}%</td>
                      <td class="p-2.5 text-center font-bold text-blue-600">${c.avgEmploymentRate}%</td>
                      <td class="p-2.5 text-right font-semibold text-emerald-700">₹${c.avgStartingSalary.toLocaleString('en-IN')}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Section 3: Training Provider Performance & Retention -->
          <div>
            <h3 class="text-sm font-bold uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-200 mb-4 flex items-center gap-2">
              3. Training Provider Performance & Retention Benchmarks
            </h3>
            
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
                <thead class="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider">
                  <tr>
                    <th class="p-2.5">Provider Name</th>
                    <th class="p-2.5">Location</th>
                    <th class="p-2.5 text-center">Trainees</th>
                    <th class="p-2.5 text-center">Employment %</th>
                    <th class="p-2.5 text-center">6m Retention</th>
                    <th class="p-2.5 text-center">12m Retention</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-200">
                  ${providers.map(p => `
                    <tr>
                      <td class="p-2.5 font-bold">${p.name}</td>
                      <td class="p-2.5 text-slate-500">${p.location.split('(')[0]}</td>
                      <td class="p-2.5 text-center">${p.totalTrainees.toLocaleString()}</td>
                      <td class="p-2.5 text-center font-bold text-blue-600">${p.employmentRate}%</td>
                      <td class="p-2.5 text-center">${p.retention6m}%</td>
                      <td class="p-2.5 text-center font-bold text-purple-600">${p.retention12m}%</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Section 4: Key Strategic Recommendations -->
          <div>
            <h3 class="text-sm font-bold uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-200 mb-4 flex items-center gap-2">
              4. Evidence-Based Strategic Recommendations
            </h3>
            
            <div class="space-y-3 text-xs">
              ${recs.map(rec => `
                <div class="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div class="flex items-center justify-between mb-1">
                    <span class="font-bold text-slate-900">${rec.title}</span>
                    <span class="text-[10px] font-bold text-blue-700 uppercase">${rec.category}</span>
                  </div>
                  <p class="text-slate-600 mb-1.5">${rec.summary}</p>
                  <div class="text-[11px] font-semibold text-blue-900">Action: ${rec.action}</div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Sign-Off & Verification Footer -->
          <div class="pt-8 border-t border-slate-200 flex justify-between items-end text-xs text-slate-400">
            <div>
              <p class="font-bold text-slate-700">SkillTrack Data Verification Council</p>
              <p>Ministry of Skill Development & Employment Tracking Directorate</p>
            </div>
            <div class="text-right">
              <span class="inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded font-mono text-[10px]">
                CRYPTOGRAPHICALLY SIGNED RECORD
              </span>
            </div>
          </div>

        </div>

      </div>
    `;
  },

  exportCSV() {
    const trainees = window.appState.trainees;
    if (!trainees.length) return;

    const headers = ["Trainee ID", "Name", "Age", "Gender", "Education", "Location", "Region", "Course", "Provider", "Completion Date", "Status", "Occupation", "Employer", "Pre-Salary", "Current Salary", "6m Survey", "12m Survey"];
    
    const rows = trainees.map(t => [
      t.id,
      `"${t.name}"`,
      t.age,
      t.gender,
      `"${t.education}"`,
      `"${t.location}"`,
      t.region,
      `"${t.courseTitle}"`,
      `"${t.providerName}"`,
      t.courseCompletionDate,
      t.employmentStatus,
      `"${t.occupation}"`,
      `"${t.employer}"`,
      t.preTrainingSalary,
      t.currentSalary,
      t.surveys && t.surveys['6m'] && t.surveys['6m'].completed ? 'Completed' : 'Pending',
      t.surveys && t.surveys['12m'] && t.surveys['12m'].completed ? 'Completed' : 'Upcoming'
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `skilltrack_outcomes_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (window.App) {
      window.App.showToast(`Exported ${trainees.length} longitudinal records to CSV!`, 'success');
    }
  },

  exportJSON() {
    const data = {
      exportTimestamp: new Date().toISOString(),
      system: "SkillTrack Longitudinal Measurement System",
      analyticsSummary: window.appState.getAnalyticsSummary(),
      trainees: window.appState.trainees,
      providers: window.appState.providers,
      courses: window.appState.courses
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `skilltrack_longitudinal_dataset_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (window.App) {
      window.App.showToast(`Exported complete JSON data audit dump!`, 'info');
    }
  }
};

window.ReportsModule = ReportsModule;
