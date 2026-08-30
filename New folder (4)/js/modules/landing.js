/**
 * SkillTrack - Landing Page Module
 * Problem statement, solution benefits, role gateways, and interactive metrics.
 */

const LandingModule = {
  render(state) {
    const summary = state.getAnalyticsSummary();

    return `
      <!-- Hero Section -->
      <section class="relative overflow-hidden bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 text-white pt-20 pb-24 px-4 sm:px-6 lg:px-8 -mt-6 -mx-4 sm:-mx-6 lg:-mx-8 rounded-b-3xl shadow-2xl">
        <!-- Background Grid Pattern -->
        <div class="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px]"></div>
        
        <div class="max-w-6xl mx-auto relative z-10 text-center">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-6 animate-pulse-subtle">
            <i data-lucide="shield-check" class="w-3.5 h-3.5"></i>
            National Longitudinal Skilling Outcomes System
          </div>

          <h1 class="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6">
            Track Skills. Measure Outcomes. <br/>
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400">
              Build Better Careers.
            </span>
          </h1>

          <p class="max-w-3xl mx-auto text-lg sm:text-xl text-slate-300 mb-10 leading-relaxed font-light">
            A consent-based longitudinal platform tracking trainees from training completion through employment, 
            self-employment, wage progression, and retention. Transform training initiatives with verifiable, data-driven outcomes.
          </p>

          <!-- Call to Action Buttons -->
          <div class="flex flex-wrap items-center justify-center gap-4 mb-16">
            <button onclick="appState.setView('dashboard')" class="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white text-base font-bold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all transform hover:-translate-y-0.5 flex items-center gap-2">
              <i data-lucide="layout-dashboard" class="w-5 h-5"></i>
              Explore Demo Dashboard
            </button>
            <button onclick="appState.setView('registration')" class="px-7 py-4 bg-slate-800/80 hover:bg-slate-700/90 text-white text-base font-semibold rounded-xl border border-slate-700 backdrop-blur-sm transition-all flex items-center gap-2">
              <i data-lucide="user-plus" class="w-5 h-5"></i>
              Register Trainee (Consent Form)
            </button>
            <button onclick="appState.setView('skillgap')" class="px-7 py-4 bg-slate-800/80 hover:bg-slate-700/90 text-cyan-300 hover:text-white text-base font-semibold rounded-xl border border-cyan-500/30 backdrop-blur-sm transition-all flex items-center gap-2">
              <i data-lucide="sparkles" class="w-5 h-5"></i>
              Skill-Gap Analyzer
            </button>
          </div>

          <!-- Live Macro KPI Strip -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-slate-800/80 text-left">
            <div class="p-4 rounded-xl bg-slate-800/40 border border-slate-800">
              <p class="text-xs text-slate-400 uppercase font-medium tracking-wider">Total Trainees Tracked</p>
              <p class="text-3xl font-extrabold text-white mt-1">${summary.total}+</p>
              <span class="text-xs text-emerald-400 flex items-center gap-1 mt-1">
                <i data-lucide="check-circle-2" class="w-3 h-3"></i> 100% Consent Verified
              </span>
            </div>
            <div class="p-4 rounded-xl bg-slate-800/40 border border-slate-800">
              <p class="text-xs text-slate-400 uppercase font-medium tracking-wider">Employment Placement</p>
              <p class="text-3xl font-extrabold text-blue-400 mt-1">${summary.overallPlacementRate}%</p>
              <span class="text-xs text-slate-400 flex items-center gap-1 mt-1">
                Avg time: ${summary.avgTimeToEmploymentDays} days
              </span>
            </div>
            <div class="p-4 rounded-xl bg-slate-800/40 border border-slate-800">
              <p class="text-xs text-slate-400 uppercase font-medium tracking-wider">12-Month Retention</p>
              <p class="text-3xl font-extrabold text-emerald-400 mt-1">${summary.retention12mRate}%</p>
              <span class="text-xs text-slate-400 flex items-center gap-1 mt-1">
                Longitudinal Follow-up
              </span>
            </div>
            <div class="p-4 rounded-xl bg-slate-800/40 border border-slate-800">
              <p class="text-xs text-slate-400 uppercase font-medium tracking-wider">Average Wage Lift</p>
              <p class="text-3xl font-extrabold text-amber-400 mt-1">+${summary.avgSalaryLiftPercent}%</p>
              <span class="text-xs text-slate-400 flex items-center gap-1 mt-1">
                ₹${summary.avgCurrentSalary.toLocaleString('en-IN')}/mo avg
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- Problem vs Solution Breakdown -->
      <section class="max-w-6xl mx-auto py-16 px-4 sm:px-6">
        <div class="text-center max-w-3xl mx-auto mb-12">
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">The Core Problem We Solve</h2>
          <p class="mt-3 text-slate-600">Skilling initiatives often struggle with lack of post-training visibility. SkillTrack establishes continuous, consent-driven evidence of real workforce impact.</p>
        </div>

        <div class="grid md:grid-cols-2 gap-8">
          <!-- The Challenge -->
          <div class="glass-card p-8 rounded-2xl border-l-4 border-l-red-500 bg-red-50/30">
            <div class="flex items-center gap-3 mb-4">
              <div class="p-3 bg-red-100 text-red-600 rounded-xl">
                <i data-lucide="alert-triangle" class="w-6 h-6"></i>
              </div>
              <h3 class="text-xl font-bold text-slate-900">Traditional Skilling Pitfalls</h3>
            </div>
            <ul class="space-y-3 text-sm text-slate-700">
              <li class="flex items-start gap-2">
                <i data-lucide="x" class="w-4 h-4 text-red-500 mt-0.5 shrink-0"></i>
                <span><strong>No Longitudinal Visibility:</strong> Tracking ends immediately upon graduation, losing sight of whether trainees retain jobs or drop out after 3–6 months.</span>
              </li>
              <li class="flex items-start gap-2">
                <i data-lucide="x" class="w-4 h-4 text-red-500 mt-0.5 shrink-0"></i>
                <span><strong>Undefined Skill Gaps:</strong> Training curriculum remains disconnected from employer demand, resulting in certified trainees lacking critical market tools.</span>
              </li>
              <li class="flex items-start gap-2">
                <i data-lucide="x" class="w-4 h-4 text-red-500 mt-0.5 shrink-0"></i>
                <span><strong>Inconsistent Provider Accountability:</strong> Policymakers cannot objectively compare training providers on retention, wage progression, or skill utilization.</span>
              </li>
            </ul>
          </div>

          <!-- The SkillTrack Solution -->
          <div class="glass-card p-8 rounded-2xl border-l-4 border-l-emerald-500 bg-emerald-50/30">
            <div class="flex items-center gap-3 mb-4">
              <div class="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
                <i data-lucide="check-check" class="w-6 h-6"></i>
              </div>
              <h3 class="text-xl font-bold text-slate-900">The SkillTrack System</h3>
            </div>
            <ul class="space-y-3 text-sm text-slate-700">
              <li class="flex items-start gap-2">
                <i data-lucide="check" class="w-4 h-4 text-emerald-600 mt-0.5 shrink-0"></i>
                <span><strong>Consent-Based Longitudinal Tracking:</strong> Automated 3m, 6m, and 12m periodic surveys verify retention, job changes, and career advancement.</span>
              </li>
              <li class="flex items-start gap-2">
                <i data-lucide="check" class="w-4 h-4 text-emerald-600 mt-0.5 shrink-0"></i>
                <span><strong>Dynamic Skill Gap Matrix:</strong> Real-time comparison between trainee competencies and employer demand highlights missing curriculum skills.</span>
              </li>
              <li class="flex items-start gap-2">
                <i data-lucide="check" class="w-4 h-4 text-emerald-600 mt-0.5 shrink-0"></i>
                <span><strong>Evidence-Driven Policy Levers:</strong> Provider benchmark ratings and automated policy recommendations empower data-backed resource allocation.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Key Benefits (5 Pillars) -->
      <section class="max-w-6xl mx-auto py-12 px-4 sm:px-6 bg-slate-50 rounded-3xl border border-slate-200/80 mb-16">
        <div class="text-center max-w-2xl mx-auto mb-10">
          <h2 class="text-2xl font-bold text-slate-900">5 Key Pillars of Impact</h2>
          <p class="text-sm text-slate-500 mt-1">Engineered for all four key stakeholders in the skilling ecosystem</p>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
            <div class="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
              <i data-lucide="trending-up" class="w-5 h-5"></i>
            </div>
            <h4 class="font-bold text-slate-900 mb-1">1. Employment Tracking</h4>
            <p class="text-sm text-slate-600">Track placement rates, formal employment, freelance self-employment, and starting wages across all sectors.</p>
          </div>

          <div class="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
            <div class="w-10 h-10 rounded-lg bg-cyan-100 text-cyan-600 flex items-center justify-center mb-4">
              <i data-lucide="split" class="w-5 h-5"></i>
            </div>
            <h4 class="font-bold text-slate-900 mb-1">2. Skill-Gap Identification</h4>
            <p class="text-sm text-slate-600">Compare curriculum outcomes with employer job descriptions to pinpoint surplus and deficit skill areas.</p>
          </div>

          <div class="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
            <div class="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
              <i data-lucide="bar-chart-3" class="w-5 h-5"></i>
            </div>
            <h4 class="font-bold text-slate-900 mb-1">3. Training Impact Measurement</h4>
            <p class="text-sm text-slate-600">Quantify salary jump percentages, career trajectory lifts, and on-the-job skill utilization scores.</p>
          </div>

          <div class="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
            <div class="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
              <i data-lucide="clock" class="w-5 h-5"></i>
            </div>
            <h4 class="font-bold text-slate-900 mb-1">4. Longitudinal Follow-up</h4>
            <p class="text-sm text-slate-600">Simulate periodic automated follow-ups at 3, 6, and 12 months with privacy-first consent protections.</p>
          </div>

          <div class="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
            <div class="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
              <i data-lucide="award" class="w-5 h-5"></i>
            </div>
            <h4 class="font-bold text-slate-900 mb-1">5. Data-Driven Decisions</h4>
            <p class="text-sm text-slate-600">Empower administrators, training providers, and policymakers to optimize funding and scale top programs.</p>
          </div>

          <div class="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-xl text-white shadow-md flex flex-col justify-between">
            <div>
              <span class="text-xs uppercase font-bold tracking-widest text-blue-200">Interactive Demo</span>
              <h4 class="font-bold text-lg mt-1">Ready to Test Drive?</h4>
              <p class="text-xs text-blue-100 mt-2">Switch between different user roles or generate comprehensive exportable reports.</p>
            </div>
            <button onclick="appState.setView('dashboard')" class="mt-4 px-4 py-2.5 bg-white text-blue-700 hover:bg-blue-50 font-bold rounded-lg text-sm transition text-center flex items-center justify-center gap-2">
              Launch Dashboard <i data-lucide="arrow-right" class="w-4 h-4"></i>
            </button>
          </div>
        </div>
      </section>

      <!-- Role-Based Gateway Selector -->
      <section class="max-w-6xl mx-auto py-12 px-4 sm:px-6">
        <div class="text-center max-w-2xl mx-auto mb-10">
          <h2 class="text-2xl font-bold text-slate-900">Experience SkillTrack by Role</h2>
          <p class="text-sm text-slate-500 mt-1">Select a persona to test the specialized workflows and tailored analytics:</p>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <!-- Role 1: Admin / Policymaker -->
          <div class="glass-card p-6 rounded-2xl hover:border-blue-500 hover:shadow-lg transition cursor-pointer flex flex-col justify-between group" onclick="appState.setRole('admin')">
            <div>
              <div class="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition">
                <i data-lucide="landmark" class="w-6 h-6"></i>
              </div>
              <h4 class="font-bold text-slate-900 text-base">Policymaker / Admin</h4>
              <p class="text-xs text-slate-500 mt-1">High-level outcome dashboards, provider benchmarks, regional parity, automated policy recommendations.</p>
            </div>
            <div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
              <span>Enter as Admin</span>
              <i data-lucide="arrow-right" class="w-4 h-4"></i>
            </div>
          </div>

          <!-- Role 2: Trainee -->
          <div class="glass-card p-6 rounded-2xl hover:border-emerald-500 hover:shadow-lg transition cursor-pointer flex flex-col justify-between group" onclick="appState.setRole('trainee', 'TRN-1001')">
            <div>
              <div class="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition">
                <i data-lucide="user" class="w-6 h-6"></i>
              </div>
              <h4 class="font-bold text-slate-900 text-base">Trainee (Priya Sharma)</h4>
              <p class="text-xs text-slate-500 mt-1">Personal profile, 6-stage longitudinal journey timeline, survey questionnaire, consent settings.</p>
            </div>
            <div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-600">
              <span>View Trainee Portal</span>
              <i data-lucide="arrow-right" class="w-4 h-4"></i>
            </div>
          </div>

          <!-- Role 3: Training Provider -->
          <div class="glass-card p-6 rounded-2xl hover:border-amber-500 hover:shadow-lg transition cursor-pointer flex flex-col justify-between group" onclick="appState.setRole('provider', 'PROV-001')">
            <div>
              <div class="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4 group-hover:bg-amber-600 group-hover:text-white transition">
                <i data-lucide="graduation-cap" class="w-6 h-6"></i>
              </div>
              <h4 class="font-bold text-slate-900 text-base">Training Provider (Apex Tech)</h4>
              <p class="text-xs text-slate-500 mt-1">Cohort performance analytics, course completion metrics, graduate placement & retention scorecards.</p>
            </div>
            <div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-amber-600">
              <span>View Provider Dashboard</span>
              <i data-lucide="arrow-right" class="w-4 h-4"></i>
            </div>
          </div>

          <!-- Role 4: Employer -->
          <div class="glass-card p-6 rounded-2xl hover:border-purple-500 hover:shadow-lg transition cursor-pointer flex flex-col justify-between group" onclick="appState.setRole('employer')">
            <div>
              <div class="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition">
                <i data-lucide="building-2" class="w-6 h-6"></i>
              </div>
              <h4 class="font-bold text-slate-900 text-base">Employer / Recruiter</h4>
              <p class="text-xs text-slate-500 mt-1">Skill demand mapping, talent supply vs demand gaps, direct skill competency verification.</p>
            </div>
            <div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-purple-600">
              <span>View Employer Hub</span>
              <i data-lucide="arrow-right" class="w-4 h-4"></i>
            </div>
          </div>
        </div>
      </section>
    `;
  }
};

window.LandingModule = LandingModule;
