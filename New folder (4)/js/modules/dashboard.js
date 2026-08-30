/**
 * SkillTrack - Unified Adaptive Dashboard Module
 * Automatically renders tailored interfaces based on active role (Admin, Trainee, Provider, Employer).
 */

const DashboardModule = {
  render(state) {
    if (state.currentRole === 'trainee') {
      return ProfileModule.render(state);
    }
    if (state.currentRole === 'provider') {
      return ProvidersModule.render(state);
    }
    if (state.currentRole === 'employer') {
      return SkillGapModule.render(state);
    }
    // Default: Admin / Policymaker Dashboard
    return AdminModule.render(state);
  },

  initCharts(state) {
    if (state.currentRole === 'provider') {
      ProvidersModule.initCharts(state);
    } else if (state.currentRole === 'employer') {
      SkillGapModule.initCharts(state);
    } else if (state.currentRole === 'admin') {
      // Outcomes / Admin charts
      if (document.getElementById('chart-outcomes-donut')) {
        OutcomesModule.initCharts(state);
      }
    }
  }
};

window.DashboardModule = DashboardModule;
