/**
 * SkillTrack - Main Application Controller & Router
 * Coordinates view rendering, navigation state, role switching, notifications, and toasts.
 */

const App = {
  init() {
    // Subscribe to state changes
    window.appState.subscribe((state) => {
      this.render();
    });

    // Initial render
    this.render();
  },

  render() {
    const state = window.appState;
    const view = state.currentView;

    // 1. Update Sidebar Active States
    document.querySelectorAll('.nav-link').forEach(link => {
      const linkView = link.getAttribute('data-view');
      if (linkView === view) {
        link.classList.add('bg-blue-50', 'text-blue-700', 'font-bold');
        link.classList.remove('text-slate-600', 'hover:bg-slate-50');
      } else {
        link.classList.remove('bg-blue-50', 'text-blue-700', 'font-bold');
        link.classList.add('text-slate-600', 'hover:bg-slate-50');
      }
    });

    // 2. Update Role Badge in Topbar
    const roleBadge = document.getElementById('current-role-badge');
    if (roleBadge) {
      const roleNames = {
        admin: 'Admin / Policymaker',
        trainee: `Trainee (${state.getTraineeById(state.currentTraineeId).name.split(' ')[0]})`,
        provider: 'Provider (Apex Tech)',
        employer: 'Employer / Recruiter'
      };
      roleBadge.innerText = roleNames[state.currentRole] || 'Admin';
    }

    // 3. Render View Content into Main Container
    const mainContainer = document.getElementById('app-main-content');
    if (!mainContainer) return;

    let htmlContent = '';
    switch (view) {
      case 'landing':
        htmlContent = LandingModule.render(state);
        break;
      case 'dashboard':
        htmlContent = DashboardModule.render(state);
        break;
      case 'trainees':
        htmlContent = TraineesModule.render(state);
        break;
      case 'profile':
        htmlContent = ProfileModule.render(state);
        break;
      case 'programs':
        htmlContent = ProgramsModule.render(state);
        break;
      case 'followups':
        htmlContent = FollowupsModule.render(state);
        break;
      case 'outcomes':
        htmlContent = OutcomesModule.render(state);
        break;
      case 'skillgap':
        htmlContent = SkillGapModule.render(state);
        break;
      case 'providers':
        htmlContent = ProvidersModule.render(state);
        break;
      case 'regional':
        htmlContent = RegionalModule.render(state);
        break;
      case 'dataquality':
        htmlContent = DataQualityModule.render(state);
        break;
      case 'privacy':
        htmlContent = PrivacyModule.render(state);
        break;
      case 'reports':
        htmlContent = ReportsModule.render(state);
        break;
      case 'registration':
        htmlContent = RegistrationModule.render(state);
        break;
      case 'settings':
        htmlContent = this.renderSettings(state);
        break;
      default:
        htmlContent = LandingModule.render(state);
    }

    mainContainer.innerHTML = htmlContent;

    // 4. Initialize dynamic components (Chart.js, Icons, Registration sub-elements)
    if (window.lucide) {
      lucide.createIcons();
    }

    if (view === 'registration') {
      RegistrationModule.initSkills();
    }

    // Delay chart initialization slightly to ensure canvas is in DOM
    setTimeout(() => {
      if (view === 'dashboard') {
        DashboardModule.initCharts(state);
      } else if (view === 'outcomes') {
        OutcomesModule.initCharts(state);
      } else if (view === 'skillgap') {
        SkillGapModule.initCharts(state);
      } else if (view === 'providers') {
        ProvidersModule.initCharts(state);
      } else if (view === 'regional') {
        RegionalModule.initCharts(state);
      }
    }, 50);
  },

  renderSettings(state) {
    return `
      <div class="space-y-8 max-w-4xl mx-auto py-6">
        <div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900">Prototype Settings & Role Switcher</h1>
          <p class="text-sm text-slate-500 mt-1">Configure prototype runtime parameters, simulate stakeholder roles, or reset demo data.</p>
        </div>

        <!-- Role Selector Card -->
        <div class="glass-card p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 class="text-base font-bold text-slate-900 flex items-center gap-2">
            <i data-lucide="users" class="w-5 h-5 text-blue-600"></i> Active Role Emulation
          </h3>
          <p class="text-xs text-slate-500">Switch role to test distinct permissions and UI capabilities across user personas:</p>

          <div class="grid sm:grid-cols-2 gap-4 pt-2">
            <button onclick="appState.setRole('admin')" class="p-4 rounded-xl border ${state.currentRole === 'admin' ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200'} text-left hover:bg-slate-50 transition">
              <span class="font-bold text-sm text-slate-900 block">1. Policymaker / Administrator</span>
              <span class="text-xs text-slate-500">Full system access, macro analytics, and policy recommendations.</span>
            </button>

            <button onclick="appState.setRole('trainee', 'TRN-1001')" class="p-4 rounded-xl border ${state.currentRole === 'trainee' ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200'} text-left hover:bg-slate-50 transition">
              <span class="font-bold text-sm text-slate-900 block">2. Trainee (Priya Sharma)</span>
              <span class="text-xs text-slate-500">Longitudinal journey timeline, survey questionnaire, consent controls.</span>
            </button>

            <button onclick="appState.setRole('provider', 'PROV-001')" class="p-4 rounded-xl border ${state.currentRole === 'provider' ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200'} text-left hover:bg-slate-50 transition">
              <span class="font-bold text-sm text-slate-900 block">3. Training Provider (Apex Tech)</span>
              <span class="text-xs text-slate-500">Cohort placement analytics, course completion benchmarks.</span>
            </button>

            <button onclick="appState.setRole('employer')" class="p-4 rounded-xl border ${state.currentRole === 'employer' ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200'} text-left hover:bg-slate-50 transition">
              <span class="font-bold text-sm text-slate-900 block">4. Employer / Recruiter</span>
              <span class="text-xs text-slate-500">Skill demand mapping and talent competency verification.</span>
            </button>
          </div>
        </div>

        <!-- Demo Data Controls Card -->
        <div class="glass-card p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 class="text-base font-bold text-slate-900 flex items-center gap-2">
            <i data-lucide="database" class="w-5 h-5 text-amber-600"></i> Demo Dataset Controls
          </h3>
          <p class="text-xs text-slate-500">Current dataset contains <strong>${state.trainees.length} Trainees</strong>, <strong>5 Providers</strong>, and <strong>6 Courses</strong>.</p>

          <div class="flex flex-wrap items-center gap-3 pt-2">
            <button onclick="appState.resetDemoData(); App.showToast('Demo dataset reset to initial pristine state!', 'success')" class="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-2">
              <i data-lucide="rotate-ccw" class="w-4 h-4"></i> Reset to Factory Demo Data
            </button>
            <button onclick="ReportsModule.exportJSON()" class="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-2">
              <i data-lucide="download" class="w-4 h-4"></i> Backup Complete JSON State
            </button>
          </div>
        </div>
      </div>
    `;
  },

  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    let bg = 'bg-slate-900 text-white border-slate-700';
    let icon = 'info';
    if (type === 'success') {
      bg = 'bg-emerald-900 text-white border-emerald-700';
      icon = 'check-circle';
    } else if (type === 'warning') {
      bg = 'bg-amber-900 text-white border-amber-700';
      icon = 'alert-triangle';
    }

    const toast = document.createElement('div');
    toast.className = `p-4 rounded-xl shadow-xl border flex items-center gap-3 text-xs font-medium ${bg} animate-fade-in-up`;
    toast.innerHTML = `
      <i data-lucide="${icon}" class="w-4 h-4 shrink-0"></i>
      <span class="flex-1">${message}</span>
      <button onclick="this.parentElement.remove()" class="text-slate-400 hover:text-white">
        <i data-lucide="x" class="w-3.5 h-3.5"></i>
      </button>
    `;

    container.appendChild(toast);
    if (window.lucide) lucide.createIcons();

    setTimeout(() => {
      if (toast.parentElement) {
        toast.remove();
      }
    }, 4500);
  },

  toggleNotifications() {
    const drawer = document.getElementById('notification-drawer');
    if (drawer) {
      drawer.classList.toggle('hidden');
    }
  },

  toggleMobileSidebar() {
    const sidebar = document.getElementById('app-sidebar');
    if (sidebar) {
      sidebar.classList.toggle('-translate-x-full');
    }
  }
};

window.App = App;

// Bootstrap on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
