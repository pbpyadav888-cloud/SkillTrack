/**
 * SkillTrack - Employment Outcome Dashboard
 * Comprehensive analytics engine with interactive KPI cards, Chart.js graphs, and search filters.
 */

const OutcomesModule = {
  render(state) {
    const summary = state.getAnalyticsSummary();
    const filteredTrainees = state.getFilteredTrainees();

    return `
      <div class="space-y-8 max-w-7xl mx-auto py-6">
        
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900">Employment Outcome Analytics</h1>
            <p class="text-sm text-slate-500 mt-1">Real-time longitudinal performance metrics, wage trajectories, and retention data.</p>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <button onclick="ReportsModule.exportCSV()" class="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold shadow-sm flex items-center gap-1.5">
              <i data-lucide="file-spreadsheet" class="w-4 h-4 text-emerald-600"></i> Export CSV
            </button>
            <button onclick="appState.setView('reports')" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-1.5">
              <i data-lucide="file-text" class="w-4 h-4"></i> Executive Report
            </button>
          </div>
        </div>

        <!-- 8 Core KPI Cards (EXACT REQUIREMENTS) -->
        <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3.5">
          
          <!-- KPI 1: Total Trainees -->
          <div class="glass-card p-3.5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Trainees</span>
              <p class="text-xl font-extrabold text-slate-900 mt-1">${summary.total}</p>
            </div>
            <span class="text-[10px] text-slate-500 font-medium">100% Enrolled</span>
          </div>

          <!-- KPI 2: Employment Rate -->
          <div class="glass-card p-3.5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Formal Hire</span>
              <p class="text-xl font-extrabold text-blue-600 mt-1">${summary.employmentRate}%</p>
            </div>
            <span class="text-[10px] text-emerald-600 font-medium">${summary.employedCount} Placed</span>
          </div>

          <!-- KPI 3: Self-Employment -->
          <div class="glass-card p-3.5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Self-Employed</span>
              <p class="text-xl font-extrabold text-emerald-600 mt-1">${summary.selfEmploymentRate}%</p>
            </div>
            <span class="text-[10px] text-emerald-600 font-medium">${summary.selfEmployedCount} Freelance</span>
          </div>

          <!-- KPI 4: Unemployment Rate -->
          <div class="glass-card p-3.5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Seeking Work</span>
              <p class="text-xl font-extrabold text-amber-600 mt-1">${summary.unemploymentRate}%</p>
            </div>
            <span class="text-[10px] text-amber-600 font-medium">${summary.unemployedCount} Active</span>
          </div>

          <!-- KPI 5: Average Salary -->
          <div class="glass-card p-3.5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Avg Salary</span>
              <p class="text-xl font-extrabold text-slate-900 mt-1">₹${(summary.avgCurrentSalary / 1000).toFixed(1)}k</p>
            </div>
            <span class="text-[10px] text-emerald-600 font-bold">+${summary.avgSalaryLiftPercent}% Lift</span>
          </div>

          <!-- KPI 6: 6m & 12m Retention -->
          <div class="glass-card p-3.5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">12m Retention</span>
              <p class="text-xl font-extrabold text-purple-600 mt-1">${summary.retention12mRate}%</p>
            </div>
            <span class="text-[10px] text-purple-600 font-medium">6m: ${summary.retention6mRate}%</span>
          </div>

          <!-- KPI 7: Avg Time to Employment -->
          <div class="glass-card p-3.5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Time to Hire</span>
              <p class="text-xl font-extrabold text-slate-900 mt-1">${summary.avgTimeToEmploymentDays}d</p>
            </div>
            <span class="text-[10px] text-slate-500 font-medium">From graduation</span>
          </div>

          <!-- KPI 8: Skill Utilization -->
          <div class="glass-card p-3.5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Skill Use</span>
              <p class="text-xl font-extrabold text-cyan-600 mt-1">${summary.avgSkillUtilization}%</p>
            </div>
            <span class="text-[10px] text-cyan-600 font-medium">On-the-job</span>
          </div>

        </div>

        <!-- Charts Grid -->
        <div class="grid lg:grid-cols-12 gap-6">
          
          <!-- Donut Chart: Employment Status Breakdown (4 cols) -->
          <div class="lg:col-span-4 glass-card p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-2">
                <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider">Employment Breakdown</h3>
                <span class="text-xs text-slate-400">Status</span>
              </div>
              <p class="text-xs text-slate-500 mb-4">Placement proportion across formal, self-employed, and job search cohorts.</p>
            </div>
            <div class="h-60 relative">
              <canvas id="chart-outcomes-donut"></canvas>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-100 flex justify-around text-center text-xs">
              <div>
                <span class="text-slate-400 block text-[10px]">Employed</span>
                <span class="font-bold text-blue-600">${summary.employedCount}</span>
              </div>
              <div>
                <span class="text-slate-400 block text-[10px]">Self-Employed</span>
                <span class="font-bold text-emerald-600">${summary.selfEmployedCount}</span>
              </div>
              <div>
                <span class="text-slate-400 block text-[10px]">Unemployed</span>
                <span class="font-bold text-amber-600">${summary.unemployedCount}</span>
              </div>
            </div>
          </div>

          <!-- Line Chart: Longitudinal Salary Progression Trajectory (8 cols) -->
          <div class="lg:col-span-8 glass-card p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div class="flex items-center justify-between mb-2">
              <div>
                <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider">Longitudinal Wage Progression Trajectory</h3>
                <p class="text-xs text-slate-500 mt-0.5">Average monthly earnings tracked at 0m, 3m, 6m, 12m, and 24m milestones.</p>
              </div>
              <span class="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold">
                +${summary.avgSalaryLiftPercent}% Net Jump
              </span>
            </div>
            <div class="h-64 relative mt-2">
              <canvas id="chart-wage-growth"></canvas>
            </div>
          </div>

          <!-- Bar Chart: Placement & Completion Rate by Course (12 cols) -->
          <div class="lg:col-span-12 glass-card p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider">Course-Level Skilling Outcomes & Placement</h3>
                <p class="text-xs text-slate-500 mt-0.5">Comparing course completion rates against actual job placement rates.</p>
              </div>
              <span class="text-xs text-slate-500">6 Core Training Programs</span>
            </div>
            <div class="h-64 relative">
              <canvas id="chart-course-placement"></canvas>
            </div>
          </div>

        </div>

      </div>
    `;
  },

  initCharts(state) {
    const summary = state.getAnalyticsSummary();
    const filteredTrainees = state.getFilteredTrainees();

    window.ChartManager.renderEmploymentStatusChart('chart-outcomes-donut', summary);
    window.ChartManager.renderWageGrowthChart('chart-wage-growth', filteredTrainees);
    window.ChartManager.renderCoursePlacementChart('chart-course-placement', state.courses, filteredTrainees);
  }
};

window.OutcomesModule = OutcomesModule;
