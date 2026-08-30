/**
 * SkillTrack - Trainee Directory & Management Module
 * Searchable, filterable list of all longitudinal trainees with status badges and quick actions.
 */

const TraineesModule = {
  render(state) {
    const trainees = state.getFilteredTrainees();
    const allCount = state.trainees.length;

    return `
      <div class="space-y-8 max-w-7xl mx-auto py-6">
        
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900">Trainee Longitudinal Directory</h1>
            <p class="text-sm text-slate-500 mt-1">Directory of certified trainees enrolled in longitudinal outcome tracking.</p>
          </div>

          <div class="flex flex-wrap items-center gap-2.5">
            <button onclick="appState.setView('registration')" class="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-2">
              <i data-lucide="user-plus" class="w-4 h-4"></i> Register New Trainee
            </button>
            <button onclick="ReportsModule.exportCSV()" class="px-3.5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold shadow-sm flex items-center gap-1.5">
              <i data-lucide="download" class="w-4 h-4 text-emerald-600"></i> Export CSV
            </button>
          </div>
        </div>

        <!-- Search & Filter Ribbon -->
        <div class="glass-card p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="relative w-full md:w-96">
            <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"></i>
            <input 
              type="text" 
              placeholder="Search by name, ID, skill, or employer..." 
              value="${state.filters.search}" 
              oninput="appState.setFilter('search', this.value)"
              class="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div class="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <select onchange="appState.setFilter('employmentStatus', this.value)" class="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white">
              <option value="all" ${state.filters.employmentStatus === 'all' ? 'selected' : ''}>All Statuses</option>
              <option value="Employed" ${state.filters.employmentStatus === 'Employed' ? 'selected' : ''}>Employed</option>
              <option value="Self-Employed" ${state.filters.employmentStatus === 'Self-Employed' ? 'selected' : ''}>Self-Employed</option>
              <option value="Unemployed" ${state.filters.employmentStatus === 'Unemployed' ? 'selected' : ''}>Seeking Work</option>
            </select>

            <select onchange="appState.setFilter('courseId', this.value)" class="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white max-w-[180px] truncate">
              <option value="all" ${state.filters.courseId === 'all' ? 'selected' : ''}>All Courses</option>
              ${state.courses.map(c => `<option value="${c.id}" ${state.filters.courseId === c.id ? 'selected' : ''}>${c.title}</option>`).join('')}
            </select>

            <span class="text-xs text-slate-500 font-bold ml-auto sm:ml-0">
              Showing ${trainees.length} of ${allCount}
            </span>
          </div>
        </div>

        <!-- Trainee Table -->
        <div class="glass-card rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs text-slate-700">
              <thead class="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th class="px-5 py-3.5">Trainee</th>
                  <th class="px-4 py-3.5">Demographics</th>
                  <th class="px-4 py-3.5">Course & Provider</th>
                  <th class="px-4 py-3.5">Employment Status</th>
                  <th class="px-4 py-3.5">Monthly Income</th>
                  <th class="px-4 py-3.5 text-center">Longitudinal Retention</th>
                  <th class="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                ${trainees.length === 0 ? `
                  <tr>
                    <td colspan="7" class="px-5 py-12 text-center text-slate-400">
                      No trainees found matching the selected filter criteria.
                    </td>
                  </tr>
                ` : trainees.map(t => {
                  let statusBg = 'bg-blue-100 text-blue-800';
                  if (t.employmentStatus === 'Self-Employed') statusBg = 'bg-emerald-100 text-emerald-800';
                  if (t.employmentStatus === 'Unemployed') statusBg = 'bg-amber-100 text-amber-800';

                  const s6 = t.surveys && t.surveys['6m'] && t.surveys['6m'].completed;
                  const s12 = t.surveys && t.surveys['12m'] && t.surveys['12m'].completed;

                  return `
                    <tr class="hover:bg-slate-50/80 transition cursor-pointer" onclick="appState.setView('profile', { currentTraineeId: '${t.id}' })">
                      <td class="px-5 py-4">
                        <div class="font-bold text-slate-900">${t.name}</div>
                        <div class="text-[10px] text-slate-400 font-mono">${t.id} • ${t.contact.email}</div>
                      </td>
                      <td class="px-4 py-4">
                        <div class="text-slate-800 font-medium">${t.age}y • ${t.gender}</div>
                        <div class="text-[10px] text-slate-500">${t.location.split(',')[0]} (${t.tier})</div>
                      </td>
                      <td class="px-4 py-4">
                        <div class="font-medium text-slate-900">${t.courseTitle.split('&')[0]}</div>
                        <div class="text-[10px] text-slate-500">${t.providerName.split(' ')[0]}</div>
                      </td>
                      <td class="px-4 py-4">
                        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${statusBg}">
                          ${t.employmentStatus}
                        </span>
                        <div class="text-[10px] text-slate-500 mt-0.5 truncate max-w-[120px]">${t.employer}</div>
                      </td>
                      <td class="px-4 py-4 font-mono font-bold text-slate-900">
                        ${t.currentSalary > 0 ? `₹${t.currentSalary.toLocaleString('en-IN')}` : '<span class="text-slate-400 font-normal">--</span>'}
                      </td>
                      <td class="px-4 py-4 text-center">
                        <div class="flex items-center justify-center gap-1">
                          <span class="px-1.5 py-0.5 rounded text-[9px] font-bold ${s6 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}">6M</span>
                          <span class="px-1.5 py-0.5 rounded text-[9px] font-bold ${s12 ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-400'}">12M</span>
                        </div>
                      </td>
                      <td class="px-5 py-4 text-right" onclick="event.stopPropagation()">
                        <button onclick="appState.setView('profile', { currentTraineeId: '${t.id}' })" class="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="View Profile">
                          <i data-lucide="eye" class="w-4 h-4"></i>
                        </button>
                        <button onclick="FollowupsModule.openSurveyModal('${t.id}', '6m')" class="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition ml-1" title="Take Follow-up Survey">
                          <i data-lucide="clipboard-check" class="w-4 h-4"></i>
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
  }
};

window.TraineesModule = TraineesModule;
