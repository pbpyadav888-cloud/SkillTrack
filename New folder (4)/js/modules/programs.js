/**
 * SkillTrack - Training Programs Catalog & Curriculum Impact Module
 * Comprehensive catalog of accredited skilling courses and their market alignment.
 */

const ProgramsModule = {
  render(state) {
    const courses = state.courses;

    return `
      <div class="space-y-8 max-w-7xl mx-auto py-6">
        
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900">Training Programs & Curriculum Impact</h1>
            <p class="text-sm text-slate-500 mt-1">Accredited vocational certification programs, curriculum competencies, and graduate outcomes.</p>
          </div>
          <button onclick="appState.setView('skillgap')" class="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-2">
            <i data-lucide="sparkles" class="w-4 h-4"></i> View Skill-Gap Engine
          </button>
        </div>

        <!-- 6 Programs Cards Grid -->
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${courses.map(c => `
            <div class="glass-card p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
              <div>
                <div class="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span class="text-[10px] font-mono font-bold text-blue-600 uppercase tracking-wider">${c.id} • ${c.category}</span>
                    <h3 class="text-base font-extrabold text-slate-900">${c.title}</h3>
                  </div>
                  <span class="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold shrink-0">
                    ${c.durationWeeks} Wks
                  </span>
                </div>

                <!-- Stats Strip -->
                <div class="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200/60 mb-4 text-center">
                  <div>
                    <span class="text-[10px] text-slate-400 block">Placement</span>
                    <span class="font-extrabold text-xs text-blue-600">${c.avgEmploymentRate}%</span>
                  </div>
                  <div>
                    <span class="text-[10px] text-slate-400 block">Completion</span>
                    <span class="font-extrabold text-xs text-slate-900">${c.avgCompletionRate}%</span>
                  </div>
                  <div>
                    <span class="text-[10px] text-slate-400 block">Avg Wage</span>
                    <span class="font-extrabold text-xs text-emerald-600">₹${(c.avgStartingSalary / 1000).toFixed(0)}k</span>
                  </div>
                </div>

                <!-- Curriculum Skills Tags -->
                <div class="mb-4">
                  <span class="text-xs font-bold text-slate-700 block mb-2">Core Skills Taught:</span>
                  <div class="flex flex-wrap gap-1.5">
                    ${c.skillsTaught.map(s => `<span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[11px] font-medium">${s}</span>`).join('')}
                  </div>
                </div>

                <!-- Target Industries -->
                <div>
                  <span class="text-xs font-bold text-slate-700 block mb-1">Target Hiring Sectors:</span>
                  <p class="text-xs text-slate-500">${c.targetIndustries.join(' • ')}</p>
                </div>
              </div>

              <!-- Card Footer -->
              <div class="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span class="text-xs font-bold text-slate-600">Demand Index: <span class="text-blue-600">${c.industryDemandIndex}/100</span></span>
                <button onclick="SkillGapModule.selectedCourseId = '${c.id}'; appState.setView('skillgap')" class="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                  Analyze Gaps <i data-lucide="chevron-right" class="w-3 h-3"></i>
                </button>
              </div>
            </div>
          `).join('')}
        </div>

      </div>
    `;
  }
};

window.ProgramsModule = ProgramsModule;
