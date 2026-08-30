/**
 * SkillTrack - Chart.js Visualizations & Analytics Renderers
 * Clean, responsive, interactive charts with custom gradients, tooltips, and themes.
 */

const ChartManager = {
  instances: {},

  destroy(canvasId) {
    if (this.instances[canvasId]) {
      this.instances[canvasId].destroy();
      delete this.instances[canvasId];
    }
  },

  destroyAll() {
    Object.keys(this.instances).forEach(id => {
      if (this.instances[id]) {
        this.instances[id].destroy();
      }
    });
    this.instances = {};
  },

  // 1. Employment Status Donut Chart
  renderEmploymentStatusChart(canvasId, summary) {
    this.destroy(canvasId);
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    this.instances[canvasId] = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Employed (Formal)', 'Self-Employed / Vendor', 'Unemployed / Upskilling'],
        datasets: [{
          data: [summary.employedCount, summary.selfEmployedCount, summary.unemployedCount],
          backgroundColor: ['#2563eb', '#10b981', '#f59e0b'],
          borderWidth: 2,
          borderColor: '#ffffff',
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              usePointStyle: true,
              padding: 16,
              font: { family: "'Plus Jakarta Sans', sans-serif", size: 12, weight: '500' }
            }
          },
          tooltip: {
            backgroundColor: '#0f172a',
            padding: 12,
            titleFont: { size: 13, weight: '600' },
            bodyFont: { size: 12 },
            callbacks: {
              label: function(context) {
                const val = context.raw || 0;
                const total = summary.total || 1;
                const pct = Math.round((val / total) * 100);
                return ` ${context.label}: ${val} Trainees (${pct}%)`;
              }
            }
          }
        }
      }
    });
  },

  // 2. Wage Growth & Salary Progression Trajectory (Line Chart)
  renderWageGrowthChart(canvasId, trainees) {
    this.destroy(canvasId);
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const milestones = ['Pre-Training', '3 Months', '6 Months', '12 Months', '24 Months (Est.)'];
    
    // Calculate average wage progression across cohorts
    const placed = trainees.filter(t => t.employmentStatus === 'Employed' || t.employmentStatus === 'Self-Employed');
    const avgPre = placed.length ? Math.round(placed.reduce((acc, t) => acc + (t.preTrainingSalary || 0), 0) / placed.length) : 8000;
    const avgCurrent = placed.length ? Math.round(placed.reduce((acc, t) => acc + (t.currentSalary || 0), 0) / placed.length) : 38000;

    const dataHighTech = [avgPre * 1.2, avgCurrent * 1.05, avgCurrent * 1.18, avgCurrent * 1.35, avgCurrent * 1.6];
    const dataAvgAll = [avgPre, avgCurrent * 0.95, avgCurrent, avgCurrent * 1.12, avgCurrent * 1.3];
    const dataVocational = [avgPre * 0.8, avgCurrent * 0.8, avgCurrent * 0.88, avgCurrent * 0.98, avgCurrent * 1.15];

    const ctx = canvas.getContext('2d');
    this.instances[canvasId] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: milestones,
        datasets: [
          {
            label: 'Tech / AI & Cloud Cohorts (₹/mo)',
            data: dataHighTech,
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37, 99, 235, 0.08)',
            borderWidth: 3,
            fill: true,
            tension: 0.35,
            pointRadius: 5,
            pointHoverRadius: 7
          },
          {
            label: 'Overall Aggregate Average (₹/mo)',
            data: dataAvgAll,
            borderColor: '#10b981',
            backgroundColor: 'transparent',
            borderWidth: 2.5,
            borderDash: [5, 5],
            tension: 0.35,
            pointRadius: 4
          },
          {
            label: 'Healthcare & Manufacturing (₹/mo)',
            data: dataVocational,
            borderColor: '#f59e0b',
            backgroundColor: 'transparent',
            borderWidth: 2,
            tension: 0.35,
            pointRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: '#f1f5f9' },
            ticks: {
              font: { family: "'Plus Jakarta Sans', sans-serif", size: 11 },
              callback: value => '₹' + (value / 1000) + 'k'
            }
          },
          x: {
            grid: { display: false },
            ticks: { font: { family: "'Plus Jakarta Sans', sans-serif", size: 12 } }
          }
        },
        plugins: {
          legend: {
            position: 'top',
            labels: { usePointStyle: true, padding: 14, font: { size: 12, weight: '500' } }
          },
          tooltip: {
            backgroundColor: '#0f172a',
            padding: 12,
            callbacks: {
              label: ctx => ` ${ctx.dataset.label}: ₹${Math.round(ctx.raw).toLocaleString('en-IN')}/month`
            }
          }
        }
      }
    });
  },

  // 3. Course Placement & Employment Rate Bar Chart
  renderCoursePlacementChart(canvasId, courses, trainees) {
    this.destroy(canvasId);
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const labels = courses.map(c => c.title.length > 20 ? c.title.substring(0, 18) + '...' : c.title);
    const employmentRates = courses.map(c => {
      const match = trainees.filter(t => t.courseId === c.id);
      if (!match.length) return c.avgEmploymentRate;
      const placed = match.filter(t => t.employmentStatus === 'Employed' || t.employmentStatus === 'Self-Employed');
      return Math.round((placed.length / match.length) * 100);
    });

    const completionRates = courses.map(c => c.avgCompletionRate);

    const ctx = canvas.getContext('2d');
    this.instances[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Employment Rate (%)',
            data: employmentRates,
            backgroundColor: '#2563eb',
            borderRadius: 6
          },
          {
            label: 'Course Completion Rate (%)',
            data: completionRates,
            backgroundColor: '#93c5fd',
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            max: 100,
            beginAtZero: true,
            ticks: { callback: v => v + '%' }
          },
          x: {
            grid: { display: false },
            ticks: { font: { size: 11 } }
          }
        },
        plugins: {
          legend: { position: 'bottom' },
          tooltip: {
            backgroundColor: '#0f172a',
            callbacks: { label: ctx => ` ${ctx.dataset.label}: ${ctx.raw}%` }
          }
        }
      }
    });
  },

  // 4. Provider Head-to-Head Benchmark Radar / Bar Chart
  renderProviderComparisonChart(canvasId, p1, p2) {
    this.destroy(canvasId);
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const metrics = ['Completion Rate', 'Employment Rate', '6m Retention', '12m Retention', 'Skill Utilization', 'Salary Index (Scaled)'];
    const p1Values = [
      p1.completionRate,
      p1.employmentRate,
      p1.retention6m,
      p1.retention12m,
      p1.skillUtilization,
      Math.min(100, Math.round((p1.avgSalary / 50000) * 100))
    ];
    const p2Values = [
      p2.completionRate,
      p2.employmentRate,
      p2.retention6m,
      p2.retention12m,
      p2.skillUtilization,
      Math.min(100, Math.round((p2.avgSalary / 50000) * 100))
    ];

    const ctx = canvas.getContext('2d');
    this.instances[canvasId] = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: metrics,
        datasets: [
          {
            label: p1.name,
            data: p1Values,
            backgroundColor: 'rgba(37, 99, 235, 0.25)',
            borderColor: '#2563eb',
            pointBackgroundColor: '#2563eb',
            borderWidth: 2
          },
          {
            label: p2.name,
            data: p2Values,
            backgroundColor: 'rgba(16, 185, 129, 0.25)',
            borderColor: '#10b981',
            pointBackgroundColor: '#10b981',
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            min: 50,
            max: 100,
            ticks: { stepSize: 10, backdropColor: 'transparent' },
            pointLabels: { font: { size: 11, weight: '600' } }
          }
        },
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  },

  // 5. Skill Supply vs Demand Gap Chart
  renderSkillDemandSupplyChart(canvasId, courseTitle, demandInfo) {
    this.destroy(canvasId);
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const skills = demandInfo ? demandInfo.demandedSkills.slice(0, 8) : ['Python', 'SQL', 'React', 'Docker', 'Kubernetes', 'Cloud Security'];
    
    // Synthetic supply vs demand scores (0 to 100)
    const demandScores = [96, 92, 88, 85, 94, 90, 82, 78].slice(0, skills.length);
    const supplyScores = [90, 86, 75, 45, 24, 30, 70, 40].slice(0, skills.length);

    const ctx = canvas.getContext('2d');
    this.instances[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: skills,
        datasets: [
          {
            label: 'Employer Industry Demand Score',
            data: demandScores,
            backgroundColor: '#ef4444',
            borderRadius: 4
          },
          {
            label: 'Trainee Supply / Proficiency Level',
            data: supplyScores,
            backgroundColor: '#3b82f6',
            borderRadius: 4
          }
        ]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { max: 100, beginAtZero: true, ticks: { callback: v => v + '/100' } }
        },
        plugins: {
          legend: { position: 'top' },
          tooltip: {
            callbacks: {
              afterBody: function(items) {
                const idx = items[0].dataIndex;
                const gap = demandScores[idx] - supplyScores[idx];
                return gap > 25 ? `⚠️ High Skill Deficit: -${gap} pts gap` : `✅ Adequate Talent Balance`;
              }
            }
          }
        }
      }
    });
  },

  // 6. Regional Outcome Breakdown Chart
  renderRegionalDistributionChart(canvasId, trainees) {
    this.destroy(canvasId);
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const regions = ['South', 'North', 'West', 'East', 'Central', 'Rural'];
    const counts = regions.map(reg => {
      return trainees.filter(t => reg === 'Rural' ? t.tier === 'Rural' : t.region === reg).length;
    });

    const empRates = regions.map(reg => {
      const subset = trainees.filter(t => reg === 'Rural' ? t.tier === 'Rural' : t.region === reg);
      if (!subset.length) return 75;
      const placed = subset.filter(t => t.employmentStatus === 'Employed' || t.employmentStatus === 'Self-Employed');
      return Math.round((placed.length / subset.length) * 100);
    });

    const ctx = canvas.getContext('2d');
    this.instances[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: regions,
        datasets: [
          {
            type: 'bar',
            label: 'Trainee Count',
            data: counts,
            backgroundColor: '#93c5fd',
            yAxisID: 'yCount',
            borderRadius: 4
          },
          {
            type: 'line',
            label: 'Employment Rate (%)',
            data: empRates,
            borderColor: '#10b981',
            backgroundColor: '#10b981',
            borderWidth: 3,
            yAxisID: 'yRate',
            pointRadius: 5
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yCount: {
            type: 'linear',
            position: 'left',
            beginAtZero: true,
            title: { display: true, text: 'Trainees Enrolled' }
          },
          yRate: {
            type: 'linear',
            position: 'right',
            max: 100,
            beginAtZero: true,
            grid: { drawOnChartArea: false },
            ticks: { callback: v => v + '%' },
            title: { display: true, text: 'Employment %' }
          },
          x: { grid: { display: false } }
        },
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  }
};

window.ChartManager = ChartManager;
