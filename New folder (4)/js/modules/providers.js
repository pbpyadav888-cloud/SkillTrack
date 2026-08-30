/**
 * SkillTrack - Training Provider Performance & Benchmark Comparison
 * Side-by-side comparative dashboard, radar chart benchmarking, and provider scorecards.
 */

const ProvidersModule = {
  selectedP1: 'PROV-001',
  selectedP2: 'PROV-002',

  render(state) {
    const providers = state.providers;
    const p1 = providers.find(p => p.id === this.selectedP1) || providers[0];
    const p2 = providers.find(p => p.id === this.selectedP2) || providers[1];

    return `
      <div class="space-y-8 max-w-7xl mx-auto py-6">
        
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900">Training Provider Performance & Benchmarking</h1>
            <p class="text-sm text-slate-500 mt-1">Evaluate and compare accredited vocational institutes on longitudinal employment outcomes.</p>
          </div>
          <span class="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            5 Accredited Providers
          </span>
        </div>

        <!-- Provider Head-to-Head Comparison Tool -->
        <div class="glass-card p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 mb-6">
            <div>
              <h2 class="text-lg font-bold text-slate-900 flex items-center gap-2">
                <i data-lucide="scale" class="w-5 h-5 text-blue-600"></i> Side-by-Side Provider Benchmark Comparison
              </h2>
              <p class="text-xs text-slate-500">Select two providers to compare completion, placement, retention, and salary impact.</p>
            </div>

            <!-- Provider Selectors -->
            <div class="flex flex-wrap items-center gap-3">
              <div class="flex items-center gap-1.5">
                <span class="w-3 h-3 rounded-full bg-blue-600"></span>
                <select onchange="ProvidersModule.handleP1Change(this.value)" class="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold bg-white">
                  ${providers.map(p => `<option value="${p.id}" ${p.id === p1.id ? 'selected' : ''}>${p.name}</option>`).join('')}
                </select>
              </div>
              <span class="text-xs font-bold text-slate-400">VS</span>
              <div class="flex items-center gap-1.5">
                <span class="w-3 h-3 rounded-full bg-emerald-600"></span>
                <select onchange="ProvidersModule.handleP2Change(this.value)" class="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold bg-white">
                  ${providers.map(p => `<option value="${p.id}" ${p.id === p2.id ? 'selected' : ''}>${p.name}</option>`).join('')}
                </select>
              </div>
            </div>
          </div>

          <!-- Comparison Grid -->
          <div class="grid lg:grid-cols-12 gap-6 items-center">
            
            <!-- Radar Chart (5 cols) -->
            <div class="lg:col-span-5 h-72 relative">
              <canvas id="chart-provider-radar"></canvas>
            </div>

            <!-- Head to Head Metrics Table (7 cols) -->
            <div class="lg:col-span-7 overflow-x-auto">
              <table class="w-full text-left text-xs">
                <thead>
                  <tr class="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-bold">
                    <th class="py-2.5">Key Performance Indicator</th>
                    <th class="py-2.5 text-blue-600">${p1.name}</th>
                    <th class="py-2.5 text-emerald-600">${p2.name}</th>
                    <th class="py-2.5 text-right">Variance</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td class="py-2.5 font-semibold">Total Trainees Tracked</td>
                    <td class="py-2.5 font-bold">${p1.totalTrainees.toLocaleString()}</td>
                    <td class="py-2.5 font-bold">${p2.totalTrainees.toLocaleString()}</td>
                    <td class="py-2.5 text-right font-mono">${p1.totalTrainees > p2.totalTrainees ? `+${p1.totalTrainees - p2.totalTrainees}` : `-${p2.totalTrainees - p1.totalTrainees}`}</td>
                  </tr>
                  <tr>
                    <td class="py-2.5 font-semibold">Course Completion Rate</td>
                    <td class="py-2.5 font-bold">${p1.completionRate}%</td>
                    <td class="py-2.5 font-bold">${p2.completionRate}%</td>
                    <td class="py-2.5 text-right font-mono text-emerald-600 font-bold">${(p1.completionRate - p2.completionRate).toFixed(1)}%</td>
                  </tr>
                  <tr>
                    <td class="py-2.5 font-semibold">Overall Employment Rate</td>
                    <td class="py-2.5 font-bold">${p1.employmentRate}%</td>
                    <td class="py-2.5 font-bold">${p2.employmentRate}%</td>
                    <td class="py-2.5 text-right font-mono text-blue-600 font-bold">${(p1.employmentRate - p2.employmentRate).toFixed(1)}%</td>
                  </tr>
                  <tr>
                    <td class="py-2.5 font-semibold">Self-Employment / Freelance</td>
                    <td class="py-2.5 font-bold">${p1.selfEmploymentRate}%</td>
                    <td class="py-2.5 font-bold">${p2.selfEmploymentRate}%</td>
                    <td class="py-2.5 text-right font-mono">${(p1.selfEmploymentRate - p2.selfEmploymentRate).toFixed(1)}%</td>
                  </tr>
                  <tr>
                    <td class="py-2.5 font-semibold">Average Post-Training Salary</td>
                    <td class="py-2.5 font-bold">₹${p1.avgSalary.toLocaleString('en-IN')}</td>
                    <td class="py-2.5 font-bold">₹${p2.avgSalary.toLocaleString('en-IN')}</td>
                    <td class="py-2.5 text-right font-mono text-emerald-600 font-bold">+₹${(p1.avgSalary - p2.avgSalary).toLocaleString('en-IN')}</td>
                  </tr>
                  <tr>
                    <td class="py-2.5 font-semibold">6-Month Job Retention</td>
                    <td class="py-2.5 font-bold">${p1.retention6m}%</td>
                    <td class="py-2.5 font-bold">${p2.retention6m}%</td>
                    <td class="py-2.5 text-right font-mono">${(p1.retention6m - p2.retention6m).toFixed(1)}%</td>
                  </tr>
                  <tr>
                    <td class="py-2.5 font-semibold">12-Month Job Retention</td>
                    <td class="py-2.5 font-bold text-purple-600">${p1.retention12m}%</td>
                    <td class="py-2.5 font-bold text-purple-600">${p2.retention12m}%</td>
                    <td class="py-2.5 text-right font-mono text-purple-600 font-bold">${(p1.retention12m - p2.retention12m).toFixed(1)}%</td>
                  </tr>
                  <tr>
                    <td class="py-2.5 font-semibold">Skill Utilization Rate</td>
                    <td class="py-2.5 font-bold">${p1.skillUtilization}%</td>
                    <td class="py-2.5 font-bold">${p2.skillUtilization}%</td>
                    <td class="py-2.5 text-right font-mono">${(p1.skillUtilization - p2.skillUtilization).toFixed(1)}%</td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        </div>

        <!-- All 5 Providers Scorecards (EXACT REQUIREMENT) -->
        <div>
          <h2 class="text-lg font-bold text-slate-900 mb-4">All Accredited Training Providers</h2>
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${providers.map(prov => `
              <div class="glass-card p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                <div>
                  <div class="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <span class="text-[10px] font-mono font-bold text-blue-600 uppercase tracking-wider">${prov.code}</span>
                      <h3 class="text-base font-extrabold text-slate-900">${prov.name}</h3>
                      <p class="text-xs text-slate-500">${prov.location}</p>
                    </div>
                    <span class="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold flex items-center gap-1 shrink-0">
                      ★ ${prov.rating}
                    </span>
                  </div>

                  <p class="text-[11px] text-slate-600 mb-4 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
                    <strong>Accreditation:</strong> ${prov.accreditation}
                  </p>

                  <div class="grid grid-cols-2 gap-2.5 text-xs mb-4">
                    <div class="p-2 bg-slate-50 rounded-lg">
                      <span class="text-[10px] text-slate-400 block">Completion Rate</span>
                      <span class="font-bold text-slate-900">${prov.completionRate}%</span>
                    </div>
                    <div class="p-2 bg-slate-50 rounded-lg">
                      <span class="text-[10px] text-slate-400 block">Employment Rate</span>
                      <span class="font-bold text-blue-600">${prov.employmentRate}%</span>
                    </div>
                    <div class="p-2 bg-slate-50 rounded-lg">
                      <span class="text-[10px] text-slate-400 block">12m Retention</span>
                      <span class="font-bold text-purple-600">${prov.retention12m}%</span>
                    </div>
                    <div class="p-2 bg-slate-50 rounded-lg">
                      <span class="text-[10px] text-slate-400 block">Avg Wage</span>
                      <span class="font-bold text-emerald-600">₹${(prov.avgSalary / 1000).toFixed(0)}k/mo</span>
                    </div>
                  </div>

                  <div class="text-[11px] text-slate-500">
                    <span class="font-semibold block mb-1">Top Programs:</span>
                    <div class="flex flex-wrap gap-1">
                      ${prov.topCourses.map(tc => `<span class="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-medium">${tc}</span>`).join('')}
                    </div>
                  </div>
                </div>

                <div class="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span class="text-xs text-slate-500">${prov.totalTrainees.toLocaleString()} Trainees</span>
                  <button onclick="ProvidersModule.handleP1Change('${prov.id}')" class="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                    Select in Benchmark <i data-lucide="chevron-right" class="w-3 h-3"></i>
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

      </div>
    `;
  },

  handleP1Change(id) {
    this.selectedP1 = id;
    window.appState.notify();
  },

  handleP2Change(id) {
    this.selectedP2 = id;
    window.appState.notify();
  },

  initCharts(state) {
    const p1 = state.providers.find(p => p.id === this.selectedP1) || state.providers[0];
    const p2 = state.providers.find(p => p.id === this.selectedP2) || state.providers[1];
    window.ChartManager.renderProviderComparisonChart('chart-provider-radar', p1, p2);
  }
};

window.ProvidersModule = ProvidersModule;
