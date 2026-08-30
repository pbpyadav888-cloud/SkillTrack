/**
 * SkillTrack - Skill-Gap Analysis Module
 * Compares trainee skills acquired with live employer industry demand,
 * highlights missing critical skills, and provides automated recommendations.
 */

const SkillGapModule = {
  selectedCourseId: 'CRS-101',

  render(state) {
    const course = state.courses.find(c => c.id === this.selectedCourseId) || state.courses[0];
    const demandInfo = state.industryDemand[course.title] || state.industryDemand["Data Analytics & AI"];

    // Trainee skills acquired vs Employer demand skills
    const traineeSkills = course.skillsTaught;
    const demandedSkills = demandInfo.demandedSkills;

    const matchingSkills = traineeSkills.filter(s => demandedSkills.some(d => d.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(d.toLowerCase())));
    const missingCriticalSkills = demandedSkills.filter(d => !traineeSkills.some(s => s.toLowerCase().includes(d.toLowerCase()) || d.toLowerCase().includes(s.toLowerCase())));
    const surplusSkills = traineeSkills.filter(s => !demandedSkills.some(d => d.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(d.toLowerCase())));

    return `
      <div class="space-y-8 max-w-6xl mx-auto py-6">
        
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900">Skill-Gap Analysis & Demand Engine</h1>
            <p class="text-sm text-slate-500 mt-1">Cross-referencing trainee competencies with current industry job requirements.</p>
          </div>

          <!-- Course Selector -->
          <div class="flex items-center gap-2">
            <label class="text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:block">Select Sector / Course:</label>
            <select onchange="SkillGapModule.handleCourseChange(this.value)" class="px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm">
              ${state.courses.map(c => `<option value="${c.id}" ${c.id === course.id ? 'selected' : ''}>${c.title}</option>`).join('')}
            </select>
          </div>
        </div>

        <!-- Demand Metrics Strip -->
        <div class="grid sm:grid-cols-3 gap-5">
          <div class="glass-card p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Industry Hiring Growth</span>
            <p class="text-2xl font-extrabold text-emerald-600 mt-1">${demandInfo.hiringDemandGrowth}</p>
            <p class="text-xs text-slate-500 mt-0.5">Annualized partner hiring surge</p>
          </div>

          <div class="glass-card p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Market Median Wage</span>
            <p class="text-2xl font-extrabold text-slate-900 mt-1">₹${demandInfo.avgMarketSalary.toLocaleString('en-IN')}<span class="text-xs font-normal text-slate-400">/mo</span></p>
            <p class="text-xs text-slate-500 mt-0.5">For certified professionals</p>
          </div>

          <div class="glass-card p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Industry Demand Index</span>
            <p class="text-2xl font-extrabold text-blue-600 mt-1">${course.industryDemandIndex}/100</p>
            <p class="text-xs text-slate-500 mt-0.5">High employer absorption rate</p>
          </div>
        </div>

        <!-- The Core Comparison Matrix (EXACT REQUIRED EXAMPLE WORKFLOW) -->
        <div class="grid lg:grid-cols-2 gap-6">
          
          <!-- Column A: Skills Trainees Have -->
          <div class="glass-card p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div class="flex items-center gap-2">
                  <div class="p-2 bg-blue-100 text-blue-700 rounded-lg">
                    <i data-lucide="graduation-cap" class="w-5 h-5"></i>
                  </div>
                  <div>
                    <h3 class="font-bold text-slate-900 text-base">Skills Trainees Acquire</h3>
                    <p class="text-xs text-slate-500">Taught in ${course.title} curriculum</p>
                  </div>
                </div>
                <span class="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                  ${traineeSkills.length} Skills
                </span>
              </div>

              <div class="space-y-2 mb-4">
                ${traineeSkills.map(skill => {
                  const isMatch = matchingSkills.includes(skill);
                  return `
                    <div class="flex items-center justify-between p-2.5 rounded-lg border ${isMatch ? 'bg-emerald-50/50 border-emerald-200' : 'bg-slate-50 border-slate-200'}">
                      <span class="text-xs font-bold text-slate-800">${skill}</span>
                      <span class="text-[10px] font-semibold ${isMatch ? 'text-emerald-700 bg-emerald-100' : 'text-slate-600 bg-slate-200'} px-2 py-0.5 rounded">
                        ${isMatch ? 'Industry Match' : 'Foundational'}
                      </span>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
            
            <p class="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
              Curriculum refreshed semi-annually with accredited Sector Skill Council.
            </p>
          </div>

          <!-- Column B: Skills Employers Demand -->
          <div class="glass-card p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div class="flex items-center gap-2">
                  <div class="p-2 bg-purple-100 text-purple-700 rounded-lg">
                    <i data-lucide="building" class="w-5 h-5"></i>
                  </div>
                  <div>
                    <h3 class="font-bold text-slate-900 text-base">Skills Employers Demand</h3>
                    <p class="text-xs text-slate-500">Active hiring specifications across partners</p>
                  </div>
                </div>
                <span class="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs font-bold">
                  ${demandedSkills.length} Skills
                </span>
              </div>

              <div class="space-y-2 mb-4">
                ${demandedSkills.map(skill => {
                  const isMissing = missingCriticalSkills.includes(skill);
                  return `
                    <div class="flex items-center justify-between p-2.5 rounded-lg border ${isMissing ? 'bg-red-50/50 border-red-200' : 'bg-emerald-50/50 border-emerald-200'}">
                      <span class="text-xs font-bold text-slate-800">${skill}</span>
                      <span class="text-[10px] font-semibold ${isMissing ? 'text-red-700 bg-red-100' : 'text-emerald-700 bg-emerald-100'} px-2 py-0.5 rounded">
                        ${isMissing ? 'Missing Deficit' : 'Covered in Course'}
                      </span>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>

            <p class="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
              Aggregated from 14+ partner job postings and employer surveys.
            </p>
          </div>

        </div>

        <!-- Highlight Missing Critical Skills Card -->
        <div class="p-6 rounded-2xl bg-gradient-to-r from-red-50 via-amber-50 to-orange-50 border border-red-200 shadow-sm">
          <div class="flex items-start gap-3 mb-4">
            <div class="p-2.5 bg-red-100 text-red-600 rounded-xl shrink-0">
              <i data-lucide="alert-circle" class="w-6 h-6"></i>
            </div>
            <div>
              <h3 class="text-base font-extrabold text-slate-900">Critical Skill Gaps Identified</h3>
              <p class="text-xs text-slate-600 mt-0.5">The following high-demand industry skills are currently missing or underrepresented in the ${course.title} curriculum:</p>
            </div>
          </div>

          <div class="flex flex-wrap gap-2.5 mb-5 pl-11">
            ${missingCriticalSkills.map(skill => `
              <span class="px-3.5 py-1.5 rounded-xl bg-red-100 border border-red-200 text-red-800 text-xs font-bold flex items-center gap-1.5 shadow-sm">
                <i data-lucide="x-circle" class="w-3.5 h-3.5 text-red-600"></i>
                ${skill}
              </span>
            `).join('')}
          </div>

          <!-- Automated Policy Recommendation (EXACT REQUIREMENT) -->
          <div class="p-4 rounded-xl bg-white border border-amber-300/80 shadow-sm ml-11">
            <div class="flex items-center gap-2 mb-1">
              <i data-lucide="sparkles" class="w-4 h-4 text-amber-600"></i>
              <span class="text-xs uppercase font-bold text-amber-900">Automated Policy & Curriculum Recommendation</span>
            </div>
            <p class="text-xs text-slate-700 font-medium leading-relaxed">
              “High employer market demand detected for <strong>${missingCriticalSkills.slice(0, 3).join(', ')}</strong>. 
              Consider adding a dedicated 30-hour elective module to boost graduate placement rate by an estimated +12%.”
            </p>
          </div>
        </div>

        <!-- Horizontal Supply vs Demand Chart -->
        <div class="glass-card p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div class="flex items-center justify-between mb-2">
            <div>
              <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider">Skill Supply vs Employer Demand Index</h3>
              <p class="text-xs text-slate-500 mt-0.5">Visualizing proficiency balance across primary technical domains.</p>
            </div>
            <span class="text-xs text-slate-400 font-mono">0-100 Score Scale</span>
          </div>
          <div class="h-64 relative mt-3">
            <canvas id="chart-skill-demand-supply"></canvas>
          </div>
        </div>

      </div>
    `;
  },

  handleCourseChange(courseId) {
    this.selectedCourseId = courseId;
    window.appState.notify();
  },

  initCharts(state) {
    const course = state.courses.find(c => c.id === this.selectedCourseId) || state.courses[0];
    const demandInfo = state.industryDemand[course.title] || state.industryDemand["Data Analytics & AI"];
    window.ChartManager.renderSkillDemandSupplyChart('chart-skill-demand-supply', course.title, demandInfo);
  }
};

window.SkillGapModule = SkillGapModule;
