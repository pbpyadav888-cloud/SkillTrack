/**
 * SkillTrack - Admin & Policymaker Executive Dashboard
 * Macro ecosystem insights, top-performing courses/providers, and automated policy recommendations.
 */

const AdminModule = {
  render(state) {
    const summary = state.getAnalyticsSummary();
    const providers = state.providers;
    const courses = state.courses;
    const recommendations = state.policyRecommendations;

    // Top performing courses by employment rate
    const sortedCourses = [...courses].sort((a, b) => b.avgEmploymentRate - a.avgEmploymentRate);
    // Top performing providers by retention
    const sortedProviders = [...providers].sort((a, b) => b.retention12m - a.retention12m);

    return `
      <div class="space-y-8 max-w-7xl mx-auto py-6">
        
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold uppercase tracking-wider">
                Executive Portal
              </span>
              <span class="text-xs text-slate-400 font-mono">Live Longitudinal Feed</span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900">Policymaker & Administrator Command Center</h1>
            <p class="text-sm text-slate-500 mt-1">Holistic strategic intelligence across skilling programs, providers, and employment retention.</p>
          </div>

          <div class="flex flex-wrap items-center gap-2.5">
            <button onclick="appState.setView('reports')" class="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-2">
              <i data-lucide="printer" class="w-4 h-4"></i> Generate Executive Briefing
            </button>
          </div>
        </div>

        <!-- Macro Outcome Metric Cards -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="glass-card p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Trainees Tracked</span>
            <p class="text-3xl font-extrabold text-slate-900 mt-1">${summary.total}</p>
            <p class="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <i data-lucide="check-circle" class="w-3.5 h-3.5"></i> Longitudinal active
            </p>
          </div>

          <div class="glass-card p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Overall Employment Rate</span>
            <p class="text-3xl font-extrabold text-blue-600 mt-1">${summary.overallPlacementRate}%</p>
            <p class="text-xs text-slate-500 mt-1">Formal + Self-Employment</p>
          </div>

          <div class="glass-card p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">12-Month Job Retention</span>
            <p class="text-3xl font-extrabold text-purple-600 mt-1">${summary.retention12mRate}%</p>
            <p class="text-xs text-purple-600 font-semibold mt-1">6m Retention: ${summary.retention6mRate}%</p>
          </div>

          <div class="glass-card p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Monthly Wage Lift</span>
            <p class="text-3xl font-extrabold text-emerald-600 mt-1">+${summary.avgSalaryLiftPercent}%</p>
            <p class="text-xs text-slate-500 mt-1">From ₹${summary.avgPreSalary.toLocaleString('en-IN')} to ₹${summary.avgCurrentSalary.toLocaleString('en-IN')}</p>
          </div>
        </div>

        <!-- Automated Insights & Policy Recommendations Engine (CORE REQUIREMENT) -->
        <div class="glass-card p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div class="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
            <div class="flex items-center gap-3">
              <div class="p-2.5 bg-gradient-to-tr from-amber-500 to-orange-500 text-white rounded-xl shadow-md shadow-amber-500/20">
                <i data-lucide="sparkles" class="w-6 h-6"></i>
              </div>
              <div>
                <h2 class="text-lg font-bold text-slate-900">Automated Insights & Strategic Policy Engine</h2>
                <p class="text-xs text-slate-500">AI-generated evidence alerts based on longitudinal data trends.</p>
              </div>
            </div>
            <span class="px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-xs font-bold font-mono">
              4 Active Policy Directives
            </span>
          </div>

          <div class="grid md:grid-cols-2 gap-5">
            ${recommendations.map(rec => `
              <div class="p-5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-blue-300 hover:shadow-sm transition flex flex-col justify-between space-y-3">
                <div>
                  <div class="flex items-center justify-between gap-2 mb-2">
                    <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">${rec.category}</span>
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold ${rec.badgeColor === 'red' ? 'bg-red-100 text-red-700' : (rec.badgeColor === 'emerald' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700')}">
                      ${rec.badge}
                    </span>
                  </div>
                  <h3 class="text-sm font-extrabold text-slate-900">${rec.title}</h3>
                  <p class="text-xs text-slate-600 mt-1 leading-relaxed">${rec.summary}</p>
                </div>

                <div class="pt-3 border-t border-slate-200/60 text-xs space-y-1.5 bg-white p-3 rounded-lg border border-slate-200">
                  <div class="text-blue-900 font-bold flex items-start gap-1.5">
                    <i data-lucide="arrow-right-circle" class="w-4 h-4 text-blue-600 shrink-0 mt-0.5"></i>
                    <span><strong>Policy Action:</strong> ${rec.action}</span>
                  </div>
                  <div class="text-emerald-700 text-[11px] font-semibold pl-5.5">
                    Expected ROI: ${rec.expectedOutcome}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Top Performing Courses vs Top Performing Providers Grid -->
        <div class="grid lg:grid-cols-2 gap-6">
          
          <!-- Top Performing Courses -->
          <div class="glass-card p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <i data-lucide="book-open" class="w-4 h-4 text-blue-600"></i> Top-Performing Training Programs
              </h3>
              <span class="text-xs text-slate-400">By Employment Rate</span>
            </div>

            <div class="space-y-3">
              ${sortedCourses.slice(0, 4).map((c, idx) => `
                <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                  <div class="flex items-center gap-3">
                    <span class="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
                      #${idx + 1}
                    </span>
                    <div>
                      <h4 class="font-bold text-xs text-slate-900">${c.title}</h4>
                      <span class="text-[10px] text-slate-500">${c.category} • ${c.durationWeeks} wks</span>
                    </div>
                  </div>
                  <div class="text-right">
                    <span class="text-xs font-extrabold text-blue-600 block">${c.avgEmploymentRate}% Placement</span>
                    <span class="text-[10px] text-emerald-600 font-semibold">₹${(c.avgStartingSalary / 1000).toFixed(0)}k/mo avg</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Top Performing Providers -->
          <div class="glass-card p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <i data-lucide="award" class="w-4 h-4 text-emerald-600"></i> Top-Performing Training Providers
              </h3>
              <span class="text-xs text-slate-400">By 12-Month Retention</span>
            </div>

            <div class="space-y-3">
              ${sortedProviders.slice(0, 4).map((p, idx) => `
                <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                  <div class="flex items-center gap-3">
                    <span class="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center">
                      #${idx + 1}
                    </span>
                    <div>
                      <h4 class="font-bold text-xs text-slate-900">${p.name}</h4>
                      <span class="text-[10px] text-slate-500">${p.location.split(',')[0]} • Grade A+</span>
                    </div>
                  </div>
                  <div class="text-right">
                    <span class="text-xs font-extrabold text-purple-600 block">${p.retention12m}% Retention</span>
                    <span class="text-[10px] text-blue-600 font-semibold">${p.employmentRate}% Placed</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

        </div>

      </div>
    `;
  }
};

window.AdminModule = AdminModule;
