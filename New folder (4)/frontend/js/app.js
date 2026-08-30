const { useState, useEffect, useRef } = React;

// API Base URL
const API_BASE = window.location.origin;

function App() {
    // Current User & Active Tab
    const [user, setUser] = useState({
        id: "USR-ADMIN-01",
        username: "admin",
        role: "Admin",
        name: "Dr. Rajeshwari Sharma",
        organization: "MSDE / NITI Aayog Mission Directorate"
    });
    const [activeTab, setActiveTab] = useState("dashboard"); // dashboard, onboarding, followup, employer, selfemp, ai, audit
    
    // Core Data
    const [analytics, setAnalytics] = useState(null);
    const [trainees, setTrainees] = useState([]);
    const [totalTrainees, setTotalTrainees] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);

    // Filters
    const [filters, setFilters] = useState({
        course: "",
        provider: "",
        district: "",
        gender: "",
        status: "",
        remedial_only: false,
        search: ""
    });

    // Modals
    const [selectedTrainee, setSelectedTrainee] = useState(null);
    const [remedialModalTrainee, setRemedialModalTrainee] = useState(null);
    const [remedialForm, setRemedialForm] = useState({ action_type: "Upskilling Referral", notes: "" });
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportData, setReportData] = useState(null);

    // Chart Refs
    const courseChartRef = useRef(null);
    const wageChartRef = useRef(null);
    const statusChartRef = useRef(null);
    const districtChartRef = useRef(null);
    const chartInstances = useRef({});

    // Show Toast Notification
    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    // Load Dashboard Analytics
    const loadAnalytics = async () => {
        try {
            const query = new URLSearchParams();
            if (filters.course) query.append("course", filters.course);
            if (filters.provider && user.role !== "Training Provider") query.append("provider", filters.provider);
            if (filters.district) query.append("district", filters.district);
            if (filters.gender) query.append("gender", filters.gender);
            if (filters.status) query.append("status", filters.status);

            const res = await fetch(`${API_BASE}/api/analytics/dashboard?${query.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setAnalytics(data);
            }
        } catch (err) {
            console.error("Failed to load analytics:", err);
        }
    };

    // Load Trainees List
    const loadTrainees = async (page = 1) => {
        setLoading(true);
        try {
            const query = new URLSearchParams({
                page: page,
                limit: 25
            });
            if (filters.course) query.append("course", filters.course);
            if (filters.provider && user.role !== "Training Provider") query.append("provider", filters.provider);
            if (filters.district) query.append("district", filters.district);
            if (filters.gender) query.append("gender", filters.gender);
            if (filters.status) query.append("status", filters.status);
            if (filters.remedial_only) query.append("remedial_only", "true");
            if (filters.search) query.append("search", filters.search);

            const res = await fetch(`${API_BASE}/api/trainees?${query.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setTrainees(data.items);
                setTotalTrainees(data.total);
                setCurrentPage(data.page);
            }
        } catch (err) {
            console.error("Failed to load trainees:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAnalytics();
        loadTrainees(1);
    }, [filters, user]);

    // Render / Update Charts
    useEffect(() => {
        if (!analytics || activeTab !== "dashboard") return;

        // 1. Placement by Course Chart
        if (courseChartRef.current) {
            if (chartInstances.current.course) chartInstances.current.course.destroy();
            const ctx = courseChartRef.current.getContext("2d");
            chartInstances.current.course = new Chart(ctx, {
                type: "bar",
                data: {
                    labels: analytics.placement_by_course.map(c => c.course),
                    datasets: [
                        {
                            label: "Placement Rate (%)",
                            data: analytics.placement_by_course.map(c => c.placement_rate_pct),
                            backgroundColor: "#2563eb",
                            borderRadius: 6
                        },
                        {
                            label: "NSDC Benchmark (70%)",
                            data: analytics.placement_by_course.map(() => 70),
                            type: "line",
                            borderColor: "#f59e0b",
                            borderDash: [5, 5],
                            borderWidth: 2,
                            pointRadius: 0,
                            fill: false
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: { beginAtZero: true, max: 100, ticks: { callback: v => v + "%" } }
                    },
                    plugins: { legend: { position: "top" } }
                }
            });
        }

        // 2. Longitudinal Wage Progression Chart
        if (wageChartRef.current) {
            if (chartInstances.current.wage) chartInstances.current.wage.destroy();
            const ctx = wageChartRef.current.getContext("2d");
            const labels = ["Month 0 (Baseline)", "Month 3", "Month 6", "Month 12"];
            chartInstances.current.wage = new Chart(ctx, {
                type: "line",
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: "Overall Cohort Average (₹/mo)",
                            data: analytics.wage_progression.map(w => w.overall_avg),
                            borderColor: "#2563eb",
                            backgroundColor: "rgba(37, 99, 235, 0.1)",
                            fill: true,
                            tension: 0.3,
                            borderWidth: 3,
                            pointRadius: 5
                        },
                        {
                            label: "Healthcare Assistant",
                            data: analytics.wage_progression.map(w => w["Healthcare Assistant"] || 0),
                            borderColor: "#10b981",
                            borderDash: [3, 3],
                            tension: 0.3,
                            fill: false
                        },
                        {
                            label: "Electrician",
                            data: analytics.wage_progression.map(w => w["Electrician"] || 0),
                            borderColor: "#8b5cf6",
                            tension: 0.3,
                            fill: false
                        },
                        {
                            label: "Data Entry Operator",
                            data: analytics.wage_progression.map(w => w["Data Entry Operator"] || 0),
                            borderColor: "#f59e0b",
                            tension: 0.3,
                            fill: false
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: { beginAtZero: false, ticks: { callback: v => "₹" + v.toLocaleString() } }
                    },
                    plugins: { legend: { position: "top" } }
                }
            });
        }

        // 3. Status Distribution Chart
        if (statusChartRef.current) {
            if (chartInstances.current.status) chartInstances.current.status.destroy();
            const ctx = statusChartRef.current.getContext("2d");
            chartInstances.current.status = new Chart(ctx, {
                type: "doughnut",
                data: {
                    labels: analytics.status_distribution.map(s => `${s.name} (${s.pct}%)`),
                    datasets: [{
                        data: analytics.status_distribution.map(s => s.value),
                        backgroundColor: ["#2563eb", "#10b981", "#ef4444"],
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: "bottom" } }
                }
            });
        }

        // 4. District Performance Chart
        if (districtChartRef.current) {
            if (chartInstances.current.district) chartInstances.current.district.destroy();
            const ctx = districtChartRef.current.getContext("2d");
            chartInstances.current.district = new Chart(ctx, {
                type: "bar",
                data: {
                    labels: analytics.district_heatmap.map(d => d.district),
                    datasets: [
                        {
                            label: "Placement Rate (%)",
                            data: analytics.district_heatmap.map(d => d.placement_rate_pct),
                            backgroundColor: "#3b82f6",
                            borderRadius: 4
                        },
                        {
                            label: "Avg Salary (₹/mo)",
                            data: analytics.district_heatmap.map(d => d.avg_wage),
                            type: "line",
                            borderColor: "#10b981",
                            yAxisID: 'y1',
                            tension: 0.2
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: { beginAtZero: true, max: 100, ticks: { callback: v => v + "%" } },
                        y1: { beginAtZero: true, position: 'right', grid: { drawOnChartArea: false }, ticks: { callback: v => "₹" + v } }
                    }
                }
            });
        }

        // Cleanup on unmount or tab change
        return () => {
            Object.values(chartInstances.current).forEach(c => c && c.destroy());
        };
    }, [analytics, activeTab]);

    // View Trainee Detail
    const handleViewTrainee = async (id) => {
        try {
            const res = await fetch(`${API_BASE}/api/trainees/${id}`);
            if (res.ok) {
                const data = await res.json();
                setSelectedTrainee(data);
            }
        } catch (err) {
            showToast("Failed to fetch trainee record", "error");
        }
    };

    // Apply Remedial Action
    const handleApplyRemedial = async (e) => {
        e.preventDefault();
        if (!remedialModalTrainee) return;
        try {
            const res = await fetch(`${API_BASE}/api/trainees/${remedialModalTrainee.id}/remedial`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    trainee_id: remedialModalTrainee.id,
                    action_type: remedialForm.action_type,
                    notes: remedialForm.notes || "Assigned for bridge upskilling and district job counseling.",
                    resolved: true
                })
            });
            if (res.ok) {
                showToast(`Remedial action applied for ${remedialModalTrainee.id}`);
                setRemedialModalTrainee(null);
                loadTrainees(currentPage);
                loadAnalytics();
            }
        } catch (err) {
            showToast("Failed to record remedial intervention", "error");
        }
    };

    // Open Cohort Report
    const handleOpenReport = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/analytics/report/summary`);
            if (res.ok) {
                const data = await res.json();
                setReportData(data);
                setShowReportModal(true);
            }
        } catch (err) {
            showToast("Failed to generate cohort report", "error");
        }
    };

    // Switch Role
    const handleRoleChange = (newRole) => {
        if (newRole === "Admin") {
            setUser({
                id: "USR-ADMIN-01",
                username: "admin",
                role: "Admin",
                name: "Dr. Rajeshwari Sharma",
                organization: "MSDE / NITI Aayog Mission Directorate"
            });
        } else if (newRole === "Training Provider") {
            setUser({
                id: "USR-PROV-01",
                username: "provider",
                role: "Training Provider",
                name: "K. Ramanathan",
                organization: "Apex Skills Academy"
            });
        } else if (newRole === "Employer") {
            setUser({
                id: "USR-EMP-01",
                username: "employer",
                role: "Employer",
                name: "Venkatesh Rao",
                organization: "TechVolt Electricals & Power Ltd"
            });
        } else {
            setUser({
                id: "USR-TRN-01",
                username: "trainee",
                role: "Trainee",
                name: "Sai Rahul Reddy",
                organization: "Cohort Graduate (SKILL-2026-10005)"
            });
        }
        showToast(`Switched active view to ${newRole}`);
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
            {/* TOAST NOTIFICATION */}
            {toast && (
                <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-lg shadow-xl text-white font-medium flex items-center gap-3 transition-all ${
                    toast.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'
                }`}>
                    <span>{toast.type === 'error' ? '⚠️' : '✅'}</span>
                    <span>{toast.message}</span>
                </div>
            )}

            {/* TOP GOVERNMENT BRAND HEADER */}
            <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg text-lg">
                            ST
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="font-bold text-lg text-white tracking-tight">SkillTrack</h1>
                                <span className="text-xs bg-blue-900/80 text-blue-300 font-medium px-2 py-0.5 rounded border border-blue-700">
                                    MSDE • NSDC • NITI Aayog
                                </span>
                                <span className="text-xs bg-emerald-950 text-emerald-300 font-medium px-2 py-0.5 rounded border border-emerald-800 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                    DPDP Act 2023 Compliant
                                </span>
                            </div>
                            <p className="text-xs text-slate-400">Longitudinal Trainee Outcome & Impact Measurement System</p>
                        </div>
                    </div>

                    {/* Quick Role Switcher & Actions */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700 text-xs">
                            <span className="text-slate-400 px-2 font-medium">Role:</span>
                            {["Admin", "Training Provider", "Employer", "Trainee"].map(r => (
                                <button
                                    key={r}
                                    onClick={() => handleRoleChange(r)}
                                    className={`px-2.5 py-1 rounded font-medium transition-all ${
                                        user.role === r ? "bg-blue-600 text-white shadow" : "text-slate-300 hover:text-white"
                                    }`}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>

                        {/* Export CSV Button */}
                        <a
                            href={`${API_BASE}/api/analytics/export/csv`}
                            className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-3 py-2 rounded-lg border border-slate-700 flex items-center gap-1.5 transition-all"
                            download
                        >
                            <span>📥</span> Export CSV
                        </a>

                        {/* Executive PDF Report Button */}
                        <button
                            onClick={handleOpenReport}
                            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-sm flex items-center gap-1.5 transition-all"
                        >
                            <span>📄</span> Cohort PDF Report
                        </button>
                    </div>
                </div>

                {/* NAVIGATION TABS */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto gap-1 text-sm border-t border-slate-800/80">
                    {[
                        { id: "dashboard", label: "📊 Outcome Dashboard", icon: "📊" },
                        { id: "onboarding", label: "📝 Trainee Onboarding & DPDP", icon: "📝" },
                        { id: "followup", label: "🤖 WhatsApp / SMS Follow-up Bot", icon: "🤖" },
                        { id: "employer", label: "🏢 Employer & Self-Employment", icon: "🏢" },
                        { id: "ai", label: "🧠 AI Attrition & Skill Gaps", icon: "🧠" },
                        { id: "audit", label: "🛡️ DPDP Audit Vault", icon: "🛡️" }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2.5 font-medium whitespace-nowrap border-b-2 transition-all text-xs sm:text-sm ${
                                activeTab === tab.id
                                    ? "border-blue-500 text-blue-400 bg-slate-800/50"
                                    : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </header>

            {/* MAIN CONTENT CONTAINER */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
                
                {/* TAB 1: DASHBOARD */}
                {activeTab === "dashboard" && (
                    <div className="space-y-6">
                        {/* Executive KPI Ribbon */}
                        {analytics && (
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 stat-card">
                                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Trainees</div>
                                    <div className="text-2xl font-bold text-slate-900 mt-1">{analytics.kpis.total_trainees}</div>
                                    <div className="text-xs text-blue-600 font-medium mt-1">100% 12-Month Audited</div>
                                </div>
                                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 stat-card">
                                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Overall Placement Rate</div>
                                    <div className="text-2xl font-bold text-blue-600 mt-1">{analytics.kpis.placement_rate}%</div>
                                    <div className="text-xs text-emerald-600 font-medium mt-1">Target 70% (+10.0% benchmark)</div>
                                </div>
                                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 stat-card">
                                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg 12M Wage Growth</div>
                                    <div className="text-2xl font-bold text-emerald-600 mt-1">+{analytics.kpis.avg_wage_growth_pct}%</div>
                                    <div className="text-xs text-slate-500 mt-1">₹{analytics.kpis.avg_baseline_wage} → ₹{analytics.kpis.avg_current_wage}/mo</div>
                                </div>
                                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 stat-card">
                                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">12M Job Retention</div>
                                    <div className="text-2xl font-bold text-indigo-600 mt-1">{analytics.kpis.retention_rate_12m}%</div>
                                    <div className="text-xs text-slate-500 mt-1">Continuously Employed</div>
                                </div>
                                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 stat-card">
                                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Remedial Triage Queue</div>
                                    <div className="text-2xl font-bold text-amber-600 mt-1">{analytics.kpis.remedial_count}</div>
                                    <div className="text-xs text-amber-600 font-medium mt-1">Action Required (Dropouts)</div>
                                </div>
                            </div>
                        )}

                        {/* Filter Bar */}
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-wrap items-center gap-3 text-sm">
                            <div className="font-semibold text-slate-700 flex items-center gap-1.5">
                                <span>🔍</span> Filters:
                            </div>

                            {/* Course Filter */}
                            <select
                                value={filters.course}
                                onChange={e => setFilters({ ...filters, course: e.target.value })}
                                className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="">All Courses</option>
                                <option value="Electrician">Electrician</option>
                                <option value="Welder">Welder</option>
                                <option value="Data Entry Operator">Data Entry Operator</option>
                                <option value="Retail Associate">Retail Associate</option>
                                <option value="Healthcare Assistant">Healthcare Assistant</option>
                            </select>

                            {/* District Filter */}
                            <select
                                value={filters.district}
                                onChange={e => setFilters({ ...filters, district: e.target.value })}
                                className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="">All Districts</option>
                                <option value="Hyderabad">Hyderabad</option>
                                <option value="Visakhapatnam">Visakhapatnam</option>
                                <option value="Vijayawada">Vijayawada</option>
                                <option value="Guntur">Guntur</option>
                                <option value="Warangal">Warangal</option>
                            </select>

                            {/* Status Filter */}
                            <select
                                value={filters.status}
                                onChange={e => setFilters({ ...filters, status: e.target.value })}
                                className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="">All Employment Status</option>
                                <option value="Placed">Placed (Wage)</option>
                                <option value="Self-Employed">Self-Employed</option>
                                <option value="Unemployed">Unemployed / Attrited</option>
                            </select>

                            {/* Gender Filter */}
                            <select
                                value={filters.gender}
                                onChange={e => setFilters({ ...filters, gender: e.target.value })}
                                className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="">All Genders</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>

                            {/* Remedial Flag Toggle */}
                            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
                                <input
                                    type="checkbox"
                                    checked={filters.remedial_only}
                                    onChange={e => setFilters({ ...filters, remedial_only: e.target.checked })}
                                    className="rounded text-amber-600 focus:ring-amber-500"
                                />
                                Flagged for Remedial Support Only
                            </label>

                            {/* Search */}
                            <div className="flex-1 min-w-[200px] ml-auto">
                                <input
                                    type="text"
                                    placeholder="Search trainee name, ID (SKILL-2026-XXXXX), employer..."
                                    value={filters.search}
                                    onChange={e => setFilters({ ...filters, search: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            {/* Clear Filters */}
                            {(filters.course || filters.district || filters.status || filters.gender || filters.remedial_only || filters.search) && (
                                <button
                                    onClick={() => setFilters({ course: "", provider: "", district: "", gender: "", status: "", remedial_only: false, search: "" })}
                                    className="text-xs text-slate-500 hover:text-slate-800 underline"
                                >
                                    Reset
                                </button>
                            )}
                        </div>

                        {/* Interactive Visualizations Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Chart 1: Placement by Course */}
                            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                                        <span>📊</span> Placement Rate by Course vs Target (70%)
                                    </h3>
                                    <span className="text-xs text-slate-500">Benchmark Aligned</span>
                                </div>
                                <div className="h-64">
                                    <canvas ref={courseChartRef}></canvas>
                                </div>
                            </div>

                            {/* Chart 2: Longitudinal Wage Progression */}
                            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                                        <span>📈</span> Longitudinal Wage Progression (Month 0 → 12)
                                    </h3>
                                    <span className="text-xs text-emerald-600 font-medium">Real-time Wage Audit</span>
                                </div>
                                <div className="h-64">
                                    <canvas ref={wageChartRef}></canvas>
                                </div>
                            </div>

                            {/* Chart 3: Status Distribution */}
                            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                                        <span>🍩</span> Employment Status Split
                                    </h3>
                                    <span className="text-xs text-slate-500">Placed vs Self vs Attrition</span>
                                </div>
                                <div className="h-64">
                                    <canvas ref={statusChartRef}></canvas>
                                </div>
                            </div>

                            {/* Chart 4: District Heatmap */}
                            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                                        <span>🗺️</span> District-wise Placement & Avg Wage
                                    </h3>
                                    <span className="text-xs text-slate-500">Regional Absorption</span>
                                </div>
                                <div className="h-64">
                                    <canvas ref={districtChartRef}></canvas>
                                </div>
                            </div>
                        </div>

                        {/* Trainee Longitudinal Roster Table */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
                                <div>
                                    <h3 className="font-bold text-slate-800">Trainee Longitudinal Outcome Roster</h3>
                                    <p className="text-xs text-slate-500 mt-0.5">Showing {trainees.length} of {totalTrainees} verified records</p>
                                </div>
                                <div className="text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg border border-blue-200 font-medium">
                                    🔒 DPDP Encrypted at Rest (AES-256)
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs sm:text-sm">
                                    <thead className="bg-slate-100/80 text-slate-700 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
                                        <tr>
                                            <th className="px-4 py-3">Trainee ID & Name</th>
                                            <th className="px-4 py-3">Masked Aadhaar / Mobile</th>
                                            <th className="px-4 py-3">Course & District</th>
                                            <th className="px-4 py-3">Longitudinal Wages (M0 → M12)</th>
                                            <th className="px-4 py-3">Current Status</th>
                                            <th className="px-4 py-3">12M Retention</th>
                                            <th className="px-4 py-3">AI Risk</th>
                                            <th className="px-4 py-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {loading ? (
                                            <tr>
                                                <td colSpan="8" className="text-center py-8 text-slate-400">
                                                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent mr-2"></div>
                                                    Loading cohort records...
                                                </td>
                                            </tr>
                                        ) : trainees.length === 0 ? (
                                            <tr>
                                                <td colSpan="8" className="text-center py-8 text-slate-500">
                                                    No trainees found matching current filters.
                                                </td>
                                            </tr>
                                        ) : (
                                            trainees.map(t => (
                                                <tr key={t.id} className="hover:bg-slate-50/80 transition-all">
                                                    <td className="px-4 py-3">
                                                        <div className="font-semibold text-slate-900">{t.name}</div>
                                                        <div className="text-xs text-blue-600 font-mono">{t.id}</div>
                                                    </td>
                                                    <td className="px-4 py-3 font-mono text-xs text-slate-600">
                                                        <div>{t.masked_aadhaar}</div>
                                                        <div className="text-slate-400">{t.masked_mobile}</div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="font-medium text-slate-800">{t.course}</div>
                                                        <div className="text-xs text-slate-500">{t.district}</div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-1.5 text-xs">
                                                            <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-mono">₹{t.baseline_wage}</span>
                                                            <span className="text-slate-400">→</span>
                                                            <span className={`px-1.5 py-0.5 rounded font-mono font-medium ${
                                                                t.current_wage >= t.baseline_wage ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                                                            }`}>
                                                                ₹{t.current_wage}
                                                            </span>
                                                        </div>
                                                        <div className="text-[11px] text-slate-400 mt-0.5 truncate max-w-[150px]">
                                                            {t.current_employer || "Not Employed"}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                                            t.current_status === 'Placed' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                                                            t.current_status === 'Self-Employed' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                                                            'bg-red-100 text-red-800 border border-red-200'
                                                        }`}>
                                                            {t.current_status}
                                                        </span>
                                                        {t.remedial_action_flag && (
                                                            <span className="block mt-1 text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 font-medium">
                                                                ⚠️ Remedial Flag
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {t.is_retained ? (
                                                            <span className="text-emerald-600 font-medium text-xs flex items-center gap-1">
                                                                <span>✓</span> Retained
                                                            </span>
                                                        ) : (
                                                            <span className="text-red-500 font-medium text-xs flex items-center gap-1">
                                                                <span>✕</span> Attrited
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                                                            t.ai_risk_category === 'High' ? 'bg-red-100 text-red-700' :
                                                            t.ai_risk_category === 'Medium' ? 'bg-amber-100 text-amber-700' :
                                                            'bg-emerald-100 text-emerald-700'
                                                        }`}>
                                                            {t.ai_risk_category} ({(t.ai_attrition_risk * 100).toFixed(0)}%)
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-right whitespace-nowrap">
                                                        <button
                                                            onClick={() => handleViewTrainee(t.id)}
                                                            className="text-xs bg-slate-100 hover:bg-blue-50 text-blue-700 font-medium px-2.5 py-1 rounded border border-slate-300 mr-1.5 transition-all"
                                                        >
                                                            Timeline
                                                        </button>
                                                        {t.remedial_action_flag && (
                                                            <button
                                                                onClick={() => setRemedialModalTrainee(t)}
                                                                className="text-xs bg-amber-500 hover:bg-amber-600 text-white font-medium px-2 py-1 rounded shadow-sm transition-all"
                                                            >
                                                                Triage
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="px-5 py-3 border-t border-slate-200 flex items-center justify-between bg-slate-50">
                                <div className="text-xs text-slate-500">
                                    Page {currentPage} of {Math.max(1, Math.ceil(totalTrainees / 25))}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        disabled={currentPage <= 1}
                                        onClick={() => loadTrainees(currentPage - 1)}
                                        className="px-3 py-1 bg-white border border-slate-300 rounded text-xs font-medium text-slate-700 disabled:opacity-40"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        disabled={currentPage >= Math.ceil(totalTrainees / 25)}
                                        onClick={() => loadTrainees(currentPage + 1)}
                                        className="px-3 py-1 bg-white border border-slate-300 rounded text-xs font-medium text-slate-700 disabled:opacity-40"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 2: TRAINEE ONBOARDING & DPDP CONSENT */}
                {activeTab === "onboarding" && <OnboardingTab showToast={showToast} loadTrainees={loadTrainees} loadAnalytics={loadAnalytics} />}

                {/* TAB 3: AUTOMATED WHATSAPP / SMS FOLLOW-UP BOT */}
                {activeTab === "followup" && <FollowUpBotTab trainees={trainees} showToast={showToast} loadTrainees={loadTrainees} loadAnalytics={loadAnalytics} />}

                {/* TAB 4: EMPLOYER & SELF-EMPLOYMENT */}
                {activeTab === "employer" && <EmployerTab showToast={showToast} trainees={trainees} loadTrainees={loadTrainees} loadAnalytics={loadAnalytics} />}

                {/* TAB 5: AI ATTRITION & SKILL GAPS */}
                {activeTab === "ai" && <AIInsightsTab />}

                {/* TAB 6: DPDP AUDIT VAULT */}
                {activeTab === "audit" && <AuditLogsTab showToast={showToast} />}

            </main>

            {/* TRAINEE LONGITUDINAL PROFILE MODAL */}
            {selectedTrainee && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-slate-200">
                        <div className="p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h2 className="text-xl font-bold text-slate-900">{selectedTrainee.name}</h2>
                                    <span className="text-xs bg-blue-100 text-blue-800 font-mono px-2 py-0.5 rounded font-semibold">{selectedTrainee.id}</span>
                                </div>
                                <p className="text-xs text-slate-500 mt-1">{selectedTrainee.course} • {selectedTrainee.district} • {selectedTrainee.training_provider}</p>
                            </div>
                            <button
                                onClick={() => setSelectedTrainee(null)}
                                className="text-slate-400 hover:text-slate-700 text-2xl font-light"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* DPDP Consent Seal Box */}
                            {selectedTrainee.consents && selectedTrainee.consents.length > 0 && (
                                <div className="bg-blue-50/70 border border-blue-200 p-4 rounded-xl">
                                    <div className="flex items-center justify-between text-xs font-semibold text-blue-900 mb-1">
                                        <span className="flex items-center gap-1.5">
                                            <span>🛡️</span> DPDP Act 2023 Consent Artifact Sealed
                                        </span>
                                        <span className="bg-blue-200 text-blue-900 px-2 py-0.5 rounded">STATUS: {selectedTrainee.consents[0].status}</span>
                                    </div>
                                    <p className="text-xs text-blue-800 italic">"{selectedTrainee.consents[0].consent_text}"</p>
                                    <div className="mt-2 pt-2 border-t border-blue-200 flex flex-wrap justify-between text-[11px] font-mono text-blue-700">
                                        <span>Timestamp: {selectedTrainee.consents[0].timestamp}</span>
                                        <span>SHA-256 Seal: {selectedTrainee.consents[0].verification_hash.substring(0, 18)}...</span>
                                    </div>
                                </div>
                            )}

                            {/* Longitudinal Outcome Milestones Timeline */}
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
                                    <span>⏱️</span> 12-Month Longitudinal Milestones Track
                                </h4>
                                <div className="relative border-l-2 border-blue-200 ml-4 space-y-6">
                                    {selectedTrainee.outcomes.map((m, idx) => (
                                        <div key={idx} className="relative pl-6">
                                            <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow"></div>
                                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-bold text-sm text-slate-900">{m.milestone}</span>
                                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                                                        m.status === 'Placed' ? 'bg-blue-100 text-blue-800' :
                                                        m.status === 'Self-Employed' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {m.status}
                                                    </span>
                                                </div>
                                                <div className="mt-2 text-xs grid grid-cols-2 gap-2 text-slate-600">
                                                    <div><strong>Monthly Wage/Revenue:</strong> ₹{m.monthly_wage.toLocaleString()}</div>
                                                    <div><strong>Data Source:</strong> {m.data_source}</div>
                                                    <div><strong>Employer / Role:</strong> {m.employer_name || "N/A"} ({m.job_role || "N/A"})</div>
                                                    <div><strong>Verified Date:</strong> {m.logged_at ? m.logged_at.split('T')[0] : 'N/A'}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Self-Employment Proof if available */}
                            {selectedTrainee.self_employment && (
                                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
                                    <h4 className="font-bold text-emerald-900 text-sm mb-2">🏢 Verified Micro-Enterprise Details</h4>
                                    <div className="grid grid-cols-2 gap-2 text-xs text-emerald-800">
                                        <div><strong>Enterprise:</strong> {selectedTrainee.self_employment.enterprise_name}</div>
                                        <div><strong>Udyam Reg:</strong> {selectedTrainee.self_employment.udyam_no}</div>
                                        <div><strong>Monthly Revenue:</strong> ₹{selectedTrainee.self_employment.monthly_revenue.toLocaleString()}</div>
                                        <div><strong>Monthly Net Profit:</strong> ₹{selectedTrainee.self_employment.monthly_profit.toLocaleString()}</div>
                                    </div>
                                </div>
                            )}

                            {/* Remedial Notes if Flagged */}
                            {selectedTrainee.remedial_action_flag && (
                                <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl">
                                    <h4 className="font-bold text-amber-900 text-sm mb-1">⚠️ Remedial Triage Active</h4>
                                    <p className="text-xs text-amber-800">{selectedTrainee.remedial_notes}</p>
                                </div>
                            )}
                        </div>

                        <div className="p-4 border-t border-slate-200 flex justify-end bg-slate-50">
                            <button
                                onClick={() => setSelectedTrainee(null)}
                                className="px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-700"
                            >
                                Close Profile
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* REMEDIAL TRIAGE MODAL */}
            {remedialModalTrainee && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200">
                        <h3 className="text-lg font-bold text-slate-900 mb-1">Remedial Triage & Counseling</h3>
                        <p className="text-xs text-slate-500 mb-4">Intervention for {remedialModalTrainee.name} ({remedialModalTrainee.id})</p>

                        <form onSubmit={handleApplyRemedial} className="space-y-4 text-xs">
                            <div>
                                <label className="font-semibold text-slate-700 block mb-1">Intervention Type</label>
                                <select
                                    value={remedialForm.action_type}
                                    onChange={e => setRemedialForm({ ...remedialForm, action_type: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-amber-500"
                                >
                                    <option value="Upskilling Referral">Upskilling & Skill Bridge Course</option>
                                    <option value="Placement Re-attempt">Direct Placement Re-attempt (District Job Fair)</option>
                                    <option value="Apprenticeship Match">NAPS Apprenticeship Matching</option>
                                    <option value="Career Counseling">One-on-One Career & Wage Counseling</option>
                                    <option value="Self-Employment Grant">Mudra / Standup India Credit Referral</option>
                                </select>
                            </div>

                            <div>
                                <label className="font-semibold text-slate-700 block mb-1">Counselor / Officer Notes</label>
                                <textarea
                                    rows="3"
                                    placeholder="Enter intervention details, mentor assigned, and resolution plan..."
                                    value={remedialForm.notes}
                                    onChange={e => setRemedialForm({ ...remedialForm, notes: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-amber-500"
                                    required
                                ></textarea>
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setRemedialModalTrainee(null)}
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-semibold"
                                >
                                    Save & Resolve Flag
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* COHORT SUMMARY PDF REPORT MODAL */}
            {showReportModal && reportData && (
                <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8 border border-slate-200">
                        <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4 mb-6">
                            <div>
                                <span className="text-xs uppercase tracking-widest text-blue-600 font-bold">Government of India • MSDE</span>
                                <h2 className="text-xl font-bold text-slate-900 mt-1">{reportData.report_metadata.title}</h2>
                                <p className="text-xs text-slate-500 mt-0.5">{reportData.report_metadata.cohort_batch} • {reportData.report_metadata.generated_at}</p>
                            </div>
                            <div className="text-right">
                                <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded border border-slate-300 block mb-2">
                                    DOC-ID: NITI-SKILL-2026-X8
                                </span>
                                <button
                                    onClick={() => window.print()}
                                    className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded shadow hover:bg-blue-500 no-print"
                                >
                                    🖨️ Print / Save as PDF
                                </button>
                            </div>
                        </div>

                        {/* Executive KPIs */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                                <div className="text-[11px] font-semibold text-slate-500 uppercase">Overall Placement</div>
                                <div className="text-xl font-bold text-blue-700">{reportData.executive_summary.overall_employment_rate}</div>
                            </div>
                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                                <div className="text-[11px] font-semibold text-slate-500 uppercase">Wage Progression Growth</div>
                                <div className="text-xl font-bold text-emerald-700">{reportData.executive_summary.wage_progression_growth}</div>
                            </div>
                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                                <div className="text-[11px] font-semibold text-slate-500 uppercase">12M Job Retention</div>
                                <div className="text-xl font-bold text-indigo-700">{reportData.executive_summary.twelve_month_job_retention}</div>
                            </div>
                        </div>

                        {/* Summary Table */}
                        <table className="w-full text-xs text-left mb-6 border border-slate-200">
                            <thead className="bg-slate-100 font-bold text-slate-800">
                                <tr>
                                    <th className="p-2 border">Evaluation Metric</th>
                                    <th className="p-2 border">Cohort Value</th>
                                    <th className="p-2 border">Evaluation Standard</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="p-2 border font-medium">Total Certified Trainees Audited</td>
                                    <td className="p-2 border">{reportData.executive_summary.total_certified_trainees} Candidates</td>
                                    <td className="p-2 border">100% 12-Month Audit</td>
                                </tr>
                                <tr>
                                    <td className="p-2 border font-medium">Wage Employment (Placed)</td>
                                    <td className="p-2 border">{reportData.executive_summary.wage_employment_placed}</td>
                                    <td className="p-2 border">Formal Sector EPF/Employer Linkage</td>
                                </tr>
                                <tr>
                                    <td className="p-2 border font-medium">Self-Employment (Micro Enterprises)</td>
                                    <td className="p-2 border">{reportData.executive_summary.self_employment_enterprises}</td>
                                    <td className="p-2 border">Udyam Registration Verified</td>
                                </tr>
                                <tr>
                                    <td className="p-2 border font-medium">Unemployed / Attrited</td>
                                    <td className="p-2 border text-red-600 font-bold">{reportData.executive_summary.unemployment_attrition}</td>
                                    <td className="p-2 border">Remedial Triage Applied</td>
                                </tr>
                                <tr>
                                    <td className="p-2 border font-medium">Average Longitudinal Wage Delta</td>
                                    <td className="p-2 border font-bold text-emerald-700">{reportData.executive_summary.average_baseline_wage} → {reportData.executive_summary.average_12m_wage}</td>
                                    <td className="p-2 border">Positive Real Income Increase</td>
                                </tr>
                            </tbody>
                        </table>

                        {/* Strategic Recommendations */}
                        <div className="mb-6">
                            <h4 className="font-bold text-slate-900 text-sm mb-2">Strategic Recommendations for Mission Directorate</h4>
                            <ul className="list-disc list-inside text-xs text-slate-700 space-y-1 bg-slate-50 p-4 rounded-lg border border-slate-200">
                                {reportData.strategic_recommendations.map((rec, idx) => (
                                    <li key={idx}>{rec}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="flex justify-between items-center text-[11px] text-slate-400 border-t pt-4">
                            <span>Compliance: DPDP Act 2023 Section 6 Compliant</span>
                            <button
                                onClick={() => setShowReportModal(false)}
                                className="px-4 py-1.5 bg-slate-800 text-white rounded text-xs font-semibold no-print"
                            >
                                Close Report
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ----------------------------------------------------
// TAB 2: TRAINEE ONBOARDING & DPDP CONSENT COMPONENT
// ----------------------------------------------------
function OnboardingTab({ showToast, loadTrainees, loadAnalytics }) {
    const [form, setForm] = useState({
        name: "",
        aadhaar_number: "",
        mobile_number: "",
        course: "Electrician",
        training_provider: "Apex Skills Academy",
        district: "Hyderabad",
        gender: "Male",
        age: 22,
        socio_economic_category: "OBC",
        cohort_batch: "Batch 2025-Q2",
        baseline_wage: 12000,
        initial_status: "Placed",
        initial_wage: 15000,
        employer_name: "TechVolt Electricals & Power Ltd",
        job_role: "Junior Electrician",
        consent_given: true
    });

    const [kycStep, setKycStep] = useState("input"); // input, otp_sent, verified
    const [otpInput, setOtpInput] = useState("");
    const [loadingKyc, setLoadingKyc] = useState(false);
    const [createdId, setCreatedId] = useState(null);

    // Mock Send OTP
    const handleSendOtp = async () => {
        if (!form.aadhaar_number || form.aadhaar_number.length !== 12) {
            showToast("Please enter a valid 12-digit Aadhaar number", "error");
            return;
        }
        setLoadingKyc(true);
        try {
            const res = await fetch(`${API_BASE}/api/auth/mock-aadhaar-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ aadhaar_number: form.aadhaar_number })
            });
            const data = await res.json();
            if (res.ok) {
                setKycStep("otp_sent");
                setOtpInput(data.simulated_otp); // Auto-fill sandbox OTP for convenience
                showToast("Simulated OTP dispatched (789123)");
            } else {
                showToast(data.detail || "Failed to send OTP", "error");
            }
        } catch (err) {
            showToast("e-KYC Gateway unreachable", "error");
        } finally {
            setLoadingKyc(false);
        }
    };

    // Mock Verify OTP
    const handleVerifyOtp = async () => {
        setLoadingKyc(true);
        try {
            const res = await fetch(`${API_BASE}/api/auth/mock-aadhaar-verify`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ aadhaar_number: form.aadhaar_number, otp: otpInput })
            });
            const data = await res.json();
            if (res.ok) {
                setKycStep("verified");
                showToast("UIDAI e-KYC Verified Successfully!");
            } else {
                showToast(data.detail || "Invalid OTP", "error");
            }
        } catch (err) {
            showToast("OTP Verification error", "error");
        } finally {
            setLoadingKyc(false);
        }
    };

    // Submit Onboarding Form
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (kycStep !== "verified") {
            showToast("Please complete Aadhaar e-KYC verification before registering", "error");
            return;
        }
        if (!form.consent_given) {
            showToast("DPDP Act explicit consent checkbox is mandatory", "error");
            return;
        }

        try {
            const res = await fetch(`${API_BASE}/api/trainees`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });
            const data = await res.json();
            if (res.ok) {
                setCreatedId(data.trainee_id);
                showToast(`Trainee registered! Trainee ID: ${data.trainee_id}`);
                loadTrainees();
                loadAnalytics();
            } else {
                showToast(data.detail || "Registration failed", "error");
            }
        } catch (err) {
            showToast("Server error during registration", "error");
        }
    };

    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <div className="border-b border-slate-200 pb-4 mb-6">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <span>📝</span> Trainee Onboarding & DPDP Consent Enrollment
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                    Direct enrollment with Aadhaar e-KYC verification and Section 6 DPDP Act (2023) immutable consent vault.
                </p>
            </div>

            {createdId ? (
                <div className="bg-emerald-50 border border-emerald-300 p-6 rounded-xl text-center space-y-4">
                    <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center text-3xl mx-auto">
                        ✓
                    </div>
                    <h3 className="text-lg font-bold text-emerald-900">Trainee Successfully Enrolled!</h3>
                    <p className="text-sm text-emerald-800">
                        Assigned Trainee ID: <strong className="font-mono bg-white px-2 py-1 rounded border border-emerald-300">{createdId}</strong>
                    </p>
                    <p className="text-xs text-emerald-700">
                        Longitudinal 12-month follow-up schedule initialized. DPDP consent token cryptographically sealed.
                    </p>
                    <button
                        onClick={() => { setCreatedId(null); setKycStep("input"); }}
                        className="px-6 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold"
                    >
                        Onboard Another Trainee
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6 text-xs sm:text-sm">
                    {/* SECTION 1: PERSONAL & CONTACT */}
                    <div>
                        <h4 className="font-bold text-slate-800 mb-3 text-xs uppercase tracking-wider text-blue-600">
                            1. Trainee Demographic Information
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-slate-700 font-medium mb-1">Full Name (As per Aadhaar)</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Ananya Reddy"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-700 font-medium mb-1">Mobile Number (WhatsApp Enabled)</label>
                                <input
                                    type="text"
                                    required
                                    maxLength="10"
                                    placeholder="9848012345"
                                    value={form.mobile_number}
                                    onChange={e => setForm({ ...form, mobile_number: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-700 font-medium mb-1">Gender</label>
                                <select
                                    value={form.gender}
                                    onChange={e => setForm({ ...form, gender: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: AADHAAR E-KYC SANDBOX */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <h4 className="font-bold text-slate-800 mb-2 text-xs uppercase tracking-wider text-indigo-600 flex items-center justify-between">
                            <span>2. Aadhaar e-KYC Verification (UIDAI Sandbox)</span>
                            {kycStep === 'verified' && (
                                <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-xs">
                                    ✓ Verified e-KYC
                                </span>
                            )}
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                            <div>
                                <label className="block text-slate-700 font-medium mb-1">12-Digit Aadhaar Number</label>
                                <input
                                    type="text"
                                    maxLength="12"
                                    placeholder="123456789012"
                                    disabled={kycStep === 'verified'}
                                    value={form.aadhaar_number}
                                    onChange={e => setForm({ ...form, aadhaar_number: e.target.value })}
                                    className="w-full bg-white border border-slate-300 rounded-lg p-2.5 font-mono text-sm"
                                />
                            </div>

                            {kycStep === 'input' && (
                                <div>
                                    <button
                                        type="button"
                                        onClick={handleSendOtp}
                                        disabled={loadingKyc}
                                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold text-xs transition-all"
                                    >
                                        {loadingKyc ? "Dispatching OTP..." : "📲 Send e-KYC OTP"}
                                    </button>
                                </div>
                            )}

                            {kycStep === 'otp_sent' && (
                                <>
                                    <div>
                                        <label className="block text-slate-700 font-medium mb-1">Enter 6-Digit OTP</label>
                                        <input
                                            type="text"
                                            maxLength="6"
                                            value={otpInput}
                                            onChange={e => setOtpInput(e.target.value)}
                                            className="w-full bg-white border border-slate-300 rounded-lg p-2.5 font-mono text-sm"
                                        />
                                    </div>
                                    <div>
                                        <button
                                            type="button"
                                            onClick={handleVerifyOtp}
                                            disabled={loadingKyc}
                                            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold text-xs transition-all"
                                        >
                                            {loadingKyc ? "Verifying..." : "✓ Confirm OTP"}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* SECTION 3: VOCATIONAL COURSE & OUTCOME */}
                    <div>
                        <h4 className="font-bold text-slate-800 mb-3 text-xs uppercase tracking-wider text-blue-600">
                            3. Vocational Course & Initial Placement
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-slate-700 font-medium mb-1">Skill Course</label>
                                <select
                                    value={form.course}
                                    onChange={e => setForm({ ...form, course: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5"
                                >
                                    <option value="Electrician">Electrician</option>
                                    <option value="Welder">Welder</option>
                                    <option value="Data Entry Operator">Data Entry Operator</option>
                                    <option value="Retail Associate">Retail Associate</option>
                                    <option value="Healthcare Assistant">Healthcare Assistant</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-slate-700 font-medium mb-1">Training Provider</label>
                                <select
                                    value={form.training_provider}
                                    onChange={e => setForm({ ...form, training_provider: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5"
                                >
                                    <option value="Apex Skills Academy">Apex Skills Academy</option>
                                    <option value="SkillCraft National Institute">SkillCraft National Institute</option>
                                    <option value="TechVikas Foundation">TechVikas Foundation</option>
                                    <option value="Andhra MedSkills Training Hub">Andhra MedSkills Training Hub</option>
                                    <option value="Bharat Industrial Institute">Bharat Industrial Institute</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-slate-700 font-medium mb-1">District</label>
                                <select
                                    value={form.district}
                                    onChange={e => setForm({ ...form, district: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5"
                                >
                                    <option value="Hyderabad">Hyderabad</option>
                                    <option value="Visakhapatnam">Visakhapatnam</option>
                                    <option value="Vijayawada">Vijayawada</option>
                                    <option value="Guntur">Guntur</option>
                                    <option value="Warangal">Warangal</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-slate-700 font-medium mb-1">Initial Status</label>
                                <select
                                    value={form.initial_status}
                                    onChange={e => setForm({ ...form, initial_status: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5"
                                >
                                    <option value="Placed">Placed (Wage Employment)</option>
                                    <option value="Self-Employed">Self-Employed (Micro Enterprise)</option>
                                    <option value="Unemployed">Unemployed / Inactive</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-slate-700 font-medium mb-1">Starting Monthly Wage (₹)</label>
                                <input
                                    type="number"
                                    value={form.initial_wage}
                                    onChange={e => setForm({ ...form, initial_wage: parseFloat(e.target.value) || 0 })}
                                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-mono"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-700 font-medium mb-1">Employer / Enterprise Name</label>
                                <input
                                    type="text"
                                    value={form.employer_name}
                                    onChange={e => setForm({ ...form, employer_name: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5"
                                />
                            </div>
                        </div>
                    </div>

                    {/* SECTION 4: DPDP ACT 2023 CONSENT */}
                    <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-200">
                        <h4 className="font-bold text-blue-900 mb-2 text-xs uppercase tracking-wider flex items-center gap-1.5">
                            <span>🛡️</span> 4. DPDP Act 2023 Mandatory Consent & Purpose Notice
                        </h4>
                        <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                            Under Section 6 of the Digital Personal Data Protection Act, 2023, the data principal explicitly consents
                            to the Ministry of Skill Development & Entrepreneurship (MSDE) and NSDC capturing longitudinal wage,
                            employment milestones, and follow-up survey responses for a duration of 12 months post-training certification.
                        </p>

                        <label className="flex items-start gap-3 cursor-pointer bg-white p-3 rounded-lg border border-blue-300">
                            <input
                                type="checkbox"
                                required
                                checked={form.consent_given}
                                onChange={e => setForm({ ...form, consent_given: e.target.checked })}
                                className="mt-1 text-blue-600 focus:ring-blue-500 rounded"
                            />
                            <span className="text-xs text-slate-800 font-medium">
                                "I hereby grant explicit, informed, and verifiable consent for my training and longitudinal employment records to be linked and tracked for 12 months for impact measurement, retention audit, and remedial skilling support."
                            </span>
                        </label>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 text-sm transition-all"
                        >
                            Complete Registration & Seal Consent →
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

// ----------------------------------------------------
// TAB 3: AUTOMATED WHATSAPP / SMS FOLLOW-UP BOT COMPONENT
// ----------------------------------------------------
function FollowUpBotTab({ trainees, showToast, loadTrainees, loadAnalytics }) {
    const [selectedId, setSelectedId] = useState(trainees.length > 0 ? trainees[0].id : "SKILL-2026-10001");
    const [milestone, setMilestone] = useState("Month 6");
    const [channel, setChannel] = useState("WhatsApp");
    const [customReply, setCustomReply] = useState("");
    const [chatLogs, setChatLogs] = useState([]);
    const [remedials, setRemedials] = useState([]);
    const [loadingBot, setLoadingBot] = useState(false);

    const loadMessages = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/followup/messages?trainee_id=${selectedId}`);
            if (res.ok) {
                const data = await res.json();
                setChatLogs(data);
            }
        } catch (err) {
            console.error("Failed to load messages:", err);
        }
    };

    const loadRemedialQueue = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/followup/remedial-queue`);
            if (res.ok) {
                const data = await res.json();
                setRemedials(data);
            }
        } catch (err) {
            console.error("Failed to load remedial queue:", err);
        }
    };

    useEffect(() => {
        loadMessages();
        loadRemedialQueue();
    }, [selectedId]);

    // Send Simulated Follow-up Response
    const handleSendResponse = async (replyText, isEmployed = true, wage = 18000, reason = null) => {
        setLoadingBot(true);
        try {
            const res = await fetch(`${API_BASE}/api/followup/simulate-response`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    trainee_id: selectedId,
                    milestone: milestone,
                    channel: channel,
                    is_employed: isEmployed,
                    current_wage: wage,
                    attrition_reason: reason,
                    raw_reply_text: replyText
                })
            });
            const data = await res.json();
            if (res.ok) {
                showToast(`Response logged! ${data.remedial_flag ? '⚠️ Remedial Flag Triggered' : '✓ Wage Recorded'}`);
                setCustomReply("");
                loadMessages();
                loadRemedialQueue();
                loadTrainees();
                loadAnalytics();
            }
        } catch (err) {
            showToast("Failed to simulate reply", "error");
        } finally {
            setLoadingBot(false);
        }
    };

    // Trigger Batch Follow-up Broadcast
    const handleBatchBroadcast = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/followup/send-batch?milestone=${milestone}&channel=${channel}`, {
                method: "POST"
            });
            const data = await res.json();
            if (res.ok) {
                showToast(`Batch broadcast dispatched to ${data.dispatched_count} cohort trainees!`);
                loadMessages();
            }
        } catch (err) {
            showToast("Failed to dispatch batch follow-ups", "error");
        }
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* LEFT 2 COLUMNS: INTERACTIVE SMARTPHONE / WHATSAPP BOT */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <div className="flex flex-wrap items-center justify-between border-b border-slate-200 pb-4 mb-4 gap-3">
                        <div>
                            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                                <span>🤖</span> Automated WhatsApp & SMS Follow-Up Engine
                            </h3>
                            <p className="text-xs text-slate-500">Automated check-ins at 3, 6, and 12-month post-training milestones</p>
                        </div>

                        {/* Batch Broadcast Button */}
                        <button
                            onClick={handleBatchBroadcast}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow flex items-center gap-1.5 transition-all"
                        >
                            <span>📢</span> Dispatch Batch {milestone} Survey
                        </button>
                    </div>

                    {/* Trainee & Milestone Controls */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 text-xs">
                        <div>
                            <label className="block text-slate-700 font-medium mb-1">Select Trainee to Simulate</label>
                            <select
                                value={selectedId}
                                onChange={e => setSelectedId(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono"
                            >
                                {trainees.map(t => (
                                    <option key={t.id} value={t.id}>
                                        {t.id} - {t.name} ({t.course})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-slate-700 font-medium mb-1">Survey Milestone Cycle</label>
                            <select
                                value={milestone}
                                onChange={e => setMilestone(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                            >
                                <option value="Month 3">Month 3 Post-Cert</option>
                                <option value="Month 6">Month 6 Post-Cert</option>
                                <option value="Month 12">Month 12 Post-Cert</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-slate-700 font-medium mb-1">Communication Channel</label>
                            <select
                                value={channel}
                                onChange={e => setChannel(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                            >
                                <option value="WhatsApp">WhatsApp Business API</option>
                                <option value="SMS">Twilio SMS Gateway</option>
                            </select>
                        </div>
                    </div>

                    {/* SMARTPHONE CHAT SCREEN MOCKUP */}
                    <div className="bg-[#efeae2] rounded-xl p-4 border border-slate-300 min-h-[350px] max-h-[420px] overflow-y-auto space-y-3 flex flex-col justify-end">
                        {chatLogs.length === 0 ? (
                            <div className="text-center py-12 text-slate-500 text-xs">
                                <div className="text-2xl mb-1">💬</div>
                                No active messages for {selectedId}. Click below to dispatch initial follow-up survey.
                            </div>
                        ) : (
                            chatLogs.slice().reverse().map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex flex-col ${msg.direction === 'OUTBOUND' ? 'items-start' : 'items-end'}`}
                                >
                                    <div className={`p-3 max-w-[80%] text-xs shadow-sm ${
                                        msg.direction === 'OUTBOUND'
                                            ? 'bg-white text-slate-800 rounded-2xl rounded-tl-sm border border-slate-200'
                                            : 'bg-[#dcf8c6] text-slate-900 rounded-2xl rounded-tr-sm'
                                    }`}>
                                        <div className="font-semibold text-[10px] text-slate-400 mb-0.5">
                                            {msg.direction === 'OUTBOUND' ? '🤖 SkillTrack Bot' : '👤 Trainee Reply'} • {msg.milestone}
                                        </div>
                                        <div>{msg.message_text}</div>
                                        <div className="text-[9px] text-slate-400 text-right mt-1 font-mono">
                                            {msg.sent_at ? msg.sent_at.split('T')[1].substring(0, 5) : '12:00'}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* SIMULATED REPLY ACTION CHIPS */}
                    <div className="mt-4 pt-3 border-t border-slate-200">
                        <div className="text-xs font-semibold text-slate-700 mb-2">Simulate Quick Responses:</div>
                        <div className="flex flex-wrap gap-2 text-xs">
                            <button
                                onClick={() => handleSendResponse("Y, working at TechVolt with salary ₹24,000", true, 24000)}
                                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg border border-emerald-300 font-medium"
                            >
                                ✅ "Y, Placed with ₹24,000/mo" (Promoted)
                            </button>
                            <button
                                onClick={() => handleSendResponse("Y, salary ₹14,000", true, 14000)}
                                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-lg border border-blue-300 font-medium"
                            >
                                💼 "Y, Retained with ₹14,000/mo"
                            </button>
                            <button
                                onClick={() => handleSendResponse("N, quit due to low salary and shift hours", false, 0, "Low salary / Inadequate compensation")}
                                className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-800 rounded-lg border border-red-300 font-medium"
                            >
                                ⚠️ "N, Left job (Low salary)" (Triggers Alert)
                            </button>
                            <button
                                onClick={() => handleSendResponse("N, health and medical issues", false, 0, "Health and personal family obligations")}
                                className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg border border-amber-300 font-medium"
                            >
                                🏥 "N, Health problem"
                            </button>
                        </div>

                        {/* Free-form reply input */}
                        <div className="mt-3 flex gap-2">
                            <input
                                type="text"
                                placeholder="Or type a custom free-text WhatsApp reply (e.g. 'Y 22000' or 'N left job')..."
                                value={customReply}
                                onChange={e => setCustomReply(e.target.value)}
                                className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                onClick={() => customReply && handleSendResponse(customReply)}
                                disabled={!customReply || loadingBot}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-500 disabled:opacity-50"
                            >
                                Send Reply
                            </button>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: REMEDIAL TRIAGE QUEUE */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col">
                    <div className="border-b border-slate-200 pb-3 mb-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                                <span>⚠️</span> Remedial Triage Queue
                            </h3>
                            <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-xs">
                                {remedials.length} Flagged
                            </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">Trainees reporting wage loss or attrition during bot check-ins</p>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3 max-h-[500px]">
                        {remedials.length === 0 ? (
                            <div className="text-center py-8 text-slate-400 text-xs">
                                All trainee follow-ups healthy! No active remedial flags.
                            </div>
                        ) : (
                            remedials.map(t => (
                                <div key={t.id} className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="font-semibold text-slate-900 text-xs">{t.name}</div>
                                            <div className="text-[11px] font-mono text-blue-600">{t.id}</div>
                                        </div>
                                        <span className="text-[10px] bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded">
                                            {t.ai_risk_category} Risk
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-amber-900">{t.remedial_notes}</p>
                                    <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1 border-t border-amber-200">
                                        <span>{t.course} • {t.district}</span>
                                        <button
                                            onClick={() => setSelectedId(t.id)}
                                            className="text-blue-700 font-semibold hover:underline"
                                        >
                                            View in Bot →
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}

// ----------------------------------------------------
// TAB 4: EMPLOYER & SELF-EMPLOYMENT VALIDATION COMPONENT
// ----------------------------------------------------
function EmployerTab({ showToast, trainees, loadTrainees, loadAnalytics }) {
    const [subTab, setSubTab] = useState("employers"); // employers, placement_verify, self_employment
    const [employers, setEmployers] = useState([]);
    const [selfEmpRecords, setSelfEmpRecords] = useState([]);
    
    // Registry Validator State
    const [registryInput, setRegistryInput] = useState({ type: "GSTIN", number: "36AABCT1234F1Z8" });
    const [registryResult, setRegistryResult] = useState(null);
    const [loadingVerify, setLoadingVerify] = useState(false);

    // Placement Proof State
    const [selectedEmpId, setSelectedEmpId] = useState(1);
    const [candidateId, setCandidateId] = useState(trainees[0]?.id || "");
    const [verifyWage, setVerifyWage] = useState(18000);
    const [verifyRole, setVerifyRole] = useState("Junior Technician");

    const loadData = async () => {
        try {
            const res1 = await fetch(`${API_BASE}/api/employers`);
            if (res1.ok) setEmployers(await res1.json());

            const res2 = await fetch(`${API_BASE}/api/self-employment`);
            if (res2.ok) setSelfEmpRecords(await res2.json());
        } catch (err) {
            console.error("Failed to load employer data:", err);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // Live GST / Udyam Registry Lookup
    const handleVerifyRegistry = async () => {
        setLoadingVerify(true);
        setRegistryResult(null);
        try {
            const res = await fetch(`${API_BASE}/api/employers/verify-registry`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(registryInput)
            });
            const data = await res.json();
            if (res.ok) {
                setRegistryResult(data);
                showToast(`${registryInput.type} verified with Govt Registry!`);
            } else {
                showToast(data.detail || "Validation failed", "error");
            }
        } catch (err) {
            showToast("Registry lookup timeout", "error");
        } finally {
            setLoadingVerify(false);
        }
    };

    // Confirm Placement Proof
    const handleConfirmPlacement = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE}/api/employers/${selectedEmpId}/verify-placement?trainee_id=${candidateId}&monthly_wage=${verifyWage}&job_role=${encodeURIComponent(verifyRole)}`, {
                method: "POST"
            });
            const data = await res.json();
            if (res.ok) {
                showToast(`Placement proof verified for candidate ${candidateId}!`);
                loadData();
                loadTrainees();
                loadAnalytics();
            } else {
                showToast(data.detail || "Verification failed", "error");
            }
        } catch (err) {
            showToast("Server error", "error");
        }
    };

    return (
        <div className="space-y-6">
            {/* Sub-navigation */}
            <div className="flex gap-2 border-b border-slate-200 pb-3 text-xs sm:text-sm">
                <button
                    onClick={() => setSubTab("employers")}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        subTab === "employers" ? "bg-blue-600 text-white shadow" : "bg-white text-slate-700 border border-slate-200"
                    }`}
                >
                    🏢 Registered Employers & GST Checker
                </button>
                <button
                    onClick={() => setSubTab("placement_verify")}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        subTab === "placement_verify" ? "bg-blue-600 text-white shadow" : "bg-white text-slate-700 border border-slate-200"
                    }`}
                >
                    📄 Placement Proof Verification Workflow
                </button>
                <button
                    onClick={() => setSubTab("self_employment")}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        subTab === "self_employment" ? "bg-blue-600 text-white shadow" : "bg-white text-slate-700 border border-slate-200"
                    }`}
                >
                    💼 Self-Employment & Udyam Enterprise Registry
                </button>
            </div>

            {/* VIEW 1: EMPLOYER DIRECTORY & GST/UDYAM CHECKER */}
            {subTab === "employers" && (
                <div className="space-y-6">
                    {/* GST / Udyam Live Sandbox Lookup Tool */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <h3 className="font-bold text-slate-900 text-sm mb-1 flex items-center gap-2">
                            <span>🔍</span> Live GSTIN & Udyam Portal Verification Sandbox
                        </h3>
                        <p className="text-xs text-slate-500 mb-4">Validate employer tax registration and MSME credentials against national registry</p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                                <label className="block text-slate-700 text-xs font-medium mb-1">Identifier Type</label>
                                <select
                                    value={registryInput.type}
                                    onChange={e => setRegistryInput({ ...registryInput, type: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                                >
                                    <option value="GSTIN">GSTIN (15-Digit Tax Number)</option>
                                    <option value="UDYAM">UDYAM Registration Number</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-slate-700 text-xs font-medium mb-1">Registration Identifier</label>
                                <input
                                    type="text"
                                    value={registryInput.number}
                                    onChange={e => setRegistryInput({ ...registryInput, number: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-mono uppercase"
                                />
                            </div>

                            <div className="flex items-end">
                                <button
                                    onClick={handleVerifyRegistry}
                                    disabled={loadingVerify}
                                    className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold text-xs transition-all"
                                >
                                    {loadingVerify ? "Querying Registry..." : "✓ Run Verification Check"}
                                </button>
                            </div>
                        </div>

                        {/* Result Display */}
                        {registryResult && (
                            <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-1">
                                <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                                    <span>✓</span> VALID GOVERNMENT REGISTRY RECORD FOUND
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-emerald-800 pt-1">
                                    <div><strong>Identifier:</strong> {registryResult.identifier}</div>
                                    <div><strong>Entity:</strong> {registryResult.registered_legal_name || registryResult.enterprise_type}</div>
                                    <div><strong>State Jurisdiction:</strong> {registryResult.state_jurisdiction || "Andhra Pradesh"}</div>
                                    <div><strong>Validation Source:</strong> {registryResult.verified_by}</div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Employers Table */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                            <h3 className="font-bold text-slate-800 text-sm">Verified Partner Employers</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs sm:text-sm">
                                <thead className="bg-slate-100 text-slate-700 text-xs font-semibold uppercase">
                                    <tr>
                                        <th className="px-4 py-3">Company Name</th>
                                        <th className="px-4 py-3">GSTIN / Udyam</th>
                                        <th className="px-4 py-3">Sector & District</th>
                                        <th className="px-4 py-3">Contact Person</th>
                                        <th className="px-4 py-3">Placements Linked</th>
                                        <th className="px-4 py-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {employers.map(e => (
                                        <tr key={e.id} className="hover:bg-slate-50">
                                            <td className="px-4 py-3 font-semibold text-slate-900">{e.company_name}</td>
                                            <td className="px-4 py-3 font-mono text-xs text-slate-600">
                                                <div>{e.gstin}</div>
                                                <div className="text-slate-400">{e.udyam_no || "N/A"}</div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div>{e.sector}</div>
                                                <div className="text-xs text-slate-500">{e.district}</div>
                                            </td>
                                            <td className="px-4 py-3 text-slate-700">
                                                <div>{e.contact_person}</div>
                                                <div className="text-xs text-slate-400">{e.contact_email}</div>
                                            </td>
                                            <td className="px-4 py-3 font-bold text-blue-700">
                                                {e.linked_placements_count} Trainees
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-xs font-medium">
                                                    ✓ Verified
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* VIEW 2: PLACEMENT PROOF WORKFLOW */}
            {subTab === "placement_verify" && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 max-w-2xl mx-auto">
                    <h3 className="font-bold text-slate-900 text-base mb-1">Employer Placement Proof Verification</h3>
                    <p className="text-xs text-slate-500 mb-6">Upload or verify candidate offer letters, join dates, and audited wage rates.</p>

                    <form onSubmit={handleConfirmPlacement} className="space-y-4 text-xs sm:text-sm">
                        <div>
                            <label className="block text-slate-700 font-medium mb-1">Select Employer Organization</label>
                            <select
                                value={selectedEmpId}
                                onChange={e => setSelectedEmpId(parseInt(e.target.value))}
                                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5"
                            >
                                {employers.map(e => (
                                    <option key={e.id} value={e.id}>{e.company_name} ({e.sector})</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-slate-700 font-medium mb-1">Trainee ID to Verify</label>
                            <select
                                value={candidateId}
                                onChange={e => setCandidateId(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-mono"
                            >
                                {trainees.map(t => (
                                    <option key={t.id} value={t.id}>{t.id} - {t.name} ({t.course})</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-slate-700 font-medium mb-1">Verified Monthly Wage (₹)</label>
                                <input
                                    type="number"
                                    value={verifyWage}
                                    onChange={e => setVerifyWage(parseFloat(e.target.value) || 0)}
                                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-mono"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-slate-700 font-medium mb-1">Job Designation</label>
                                <input
                                    type="text"
                                    value={verifyRole}
                                    onChange={e => setVerifyRole(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-slate-700 font-medium mb-1">Attach Appointment / Offer Letter (Mock Upload)</label>
                            <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center text-xs text-slate-500 bg-slate-50">
                                <span>📎 Offer_Letter_Signed_2026.pdf (1.2 MB) attached</span>
                            </div>
                        </div>

                        <div className="flex justify-end pt-3">
                            <button
                                type="submit"
                                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow text-xs transition-all"
                            >
                                ✓ Confirm & Authenticate Placement
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* VIEW 3: SELF-EMPLOYMENT & UDYAM ENTERPRISES */}
            {subTab === "self_employment" && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-slate-800 text-sm">Self-Employment & Micro-Enterprises Registry</h3>
                            <p className="text-xs text-slate-500 mt-0.5">Capturing self-employed graduates and Udyam MSME revenue validation</p>
                        </div>
                        <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-lg">
                            {selfEmpRecords.length} Active Enterprises
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs sm:text-sm">
                            <thead className="bg-slate-100 text-slate-700 text-xs font-semibold uppercase">
                                <tr>
                                    <th className="px-4 py-3">Trainee / Enterprise Name</th>
                                    <th className="px-4 py-3">Trade / Course</th>
                                    <th className="px-4 py-3">Udyam Registration</th>
                                    <th className="px-4 py-3">Monthly Revenue</th>
                                    <th className="px-4 py-3">Net Profit / Wage</th>
                                    <th className="px-4 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {selfEmpRecords.map(s => (
                                    <tr key={s.id} className="hover:bg-slate-50">
                                        <td className="px-4 py-3">
                                            <div className="font-semibold text-slate-900">{s.enterprise_name}</div>
                                            <div className="text-xs text-slate-500">Owner: {s.trainee_name} ({s.trainee_id})</div>
                                        </td>
                                        <td className="px-4 py-3 font-medium text-slate-800">{s.course}</td>
                                        <td className="px-4 py-3 font-mono text-xs text-slate-600">{s.udyam_no}</td>
                                        <td className="px-4 py-3 font-mono text-blue-700 font-semibold">₹{s.monthly_revenue.toLocaleString()}</td>
                                        <td className="px-4 py-3 font-mono text-emerald-700 font-bold">₹{s.monthly_profit.toLocaleString()}</td>
                                        <td className="px-4 py-3">
                                            <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-xs font-medium">
                                                ✓ Udyam Verified
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

// ----------------------------------------------------
// TAB 5: AI ATTRITION & SKILL GAPS COMPONENT
// ----------------------------------------------------
function AIInsightsTab() {
    const [highRiskCohort, setHighRiskCohort] = useState([]);
    const [skillMatrix, setSkillMatrix] = useState([]);
    const [simInput, setSimInput] = useState({
        course: "Retail Associate",
        district: "Warangal",
        baseline_wage: 11000,
        current_wage: 11500,
        current_status: "Placed"
    });
    const [simResult, setSimResult] = useState(null);
    const [nlpText, setNlpText] = useState("Left because salary is low and shift hours are exhausting in night retail.");
    const [nlpResult, setNlpResult] = useState(null);

    useEffect(() => {
        fetch(`${API_BASE}/api/ai/high-risk-cohort`).then(r => r.json()).then(setHighRiskCohort);
        fetch(`${API_BASE}/api/ai/skill-gap-matrix`).then(r => r.json()).then(setSkillMatrix);
    }, []);

    const handleRunPrediction = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/ai/predict-risk`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(simInput)
            });
            if (res.ok) setSimResult(await res.json());
        } catch (err) {
            console.error(err);
        }
    };

    const handleRunNlp = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/ai/analyze-feedback`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: nlpText })
            });
            if (res.ok) setNlpResult(await res.json());
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-6">
            {/* AI SIMULATION & PREDICTION ENGINE */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-900 text-sm mb-1 flex items-center gap-2">
                        <span>🧠</span> AI Attrition Risk Inference Simulator
                    </h3>
                    <p className="text-xs text-slate-500 mb-4">Logistic regression & multi-factor heuristic scoring on candidate trajectory</p>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                            <label className="font-medium text-slate-700 block mb-1">Course Sector</label>
                            <select
                                value={simInput.course}
                                onChange={e => setSimInput({ ...simInput, course: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-300 rounded p-2"
                            >
                                <option value="Electrician">Electrician</option>
                                <option value="Welder">Welder</option>
                                <option value="Data Entry Operator">Data Entry Operator</option>
                                <option value="Retail Associate">Retail Associate</option>
                                <option value="Healthcare Assistant">Healthcare Assistant</option>
                            </select>
                        </div>
                        <div>
                            <label className="font-medium text-slate-700 block mb-1">District Placement</label>
                            <select
                                value={simInput.district}
                                onChange={e => setSimInput({ ...simInput, district: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-300 rounded p-2"
                            >
                                <option value="Hyderabad">Hyderabad</option>
                                <option value="Visakhapatnam">Visakhapatnam</option>
                                <option value="Vijayawada">Vijayawada</option>
                                <option value="Guntur">Guntur</option>
                                <option value="Warangal">Warangal</option>
                            </select>
                        </div>
                        <div>
                            <label className="font-medium text-slate-700 block mb-1">Baseline Wage (₹)</label>
                            <input
                                type="number"
                                value={simInput.baseline_wage}
                                onChange={e => setSimInput({ ...simInput, baseline_wage: parseFloat(e.target.value) || 0 })}
                                className="w-full bg-slate-50 border border-slate-300 rounded p-2 font-mono"
                            />
                        </div>
                        <div>
                            <label className="font-medium text-slate-700 block mb-1">Current Month 6 Wage (₹)</label>
                            <input
                                type="number"
                                value={simInput.current_wage}
                                onChange={e => setSimInput({ ...simInput, current_wage: parseFloat(e.target.value) || 0 })}
                                className="w-full bg-slate-50 border border-slate-300 rounded p-2 font-mono"
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleRunPrediction}
                        className="mt-4 w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all"
                    >
                        ⚡ Run Predictive Risk Analysis
                    </button>

                    {simResult && (
                        <div className={`mt-4 p-4 rounded-xl text-xs space-y-2 border ${
                            simResult.risk_category === 'High' ? 'bg-red-50 border-red-200' :
                            simResult.risk_category === 'Medium' ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'
                        }`}>
                            <div className="flex justify-between items-center font-bold">
                                <span>Predicted Attrition Risk:</span>
                                <span className={`text-sm ${
                                    simResult.risk_category === 'High' ? 'text-red-700' :
                                    simResult.risk_category === 'Medium' ? 'text-amber-700' : 'text-emerald-700'
                                }`}>
                                    {simResult.risk_category} Risk ({(simResult.risk_score * 100).toFixed(1)}%)
                                </span>
                            </div>
                            <div className="text-slate-700">
                                <strong>Identified Risk Factors:</strong>
                                <ul className="list-disc list-inside mt-0.5">
                                    {simResult.risk_factors.map((f, i) => <li key={i}>{f}</li>)}
                                </ul>
                            </div>
                            <div className="text-blue-900 font-semibold pt-1 border-t border-slate-200">
                                Recommended Action: {simResult.recommended_action}
                            </div>
                        </div>
                    )}
                </div>

                {/* NLP FEEDBACK TOPIC & SENTIMENT ANALYZER */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-900 text-sm mb-1 flex items-center gap-2">
                        <span>💬</span> NLP Trainee Exit Feedback & Sentiment Extractor
                    </h3>
                    <p className="text-xs text-slate-500 mb-4">Semantic parsing of WhatsApp text messages for root-cause classification</p>

                    <div>
                        <label className="font-medium text-slate-700 text-xs block mb-1">Trainee Open-Ended Response</label>
                        <textarea
                            rows="3"
                            value={nlpText}
                            onChange={e => setNlpText(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                        ></textarea>
                    </div>

                    <button
                        onClick={handleRunNlp}
                        className="mt-3 w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all"
                    >
                        🔍 Run NLP Classification
                    </button>

                    {nlpResult && (
                        <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1.5">
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-slate-800">Primary Root Cause:</span>
                                <span className="bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded">{nlpResult.primary_topic}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-600">Sentiment Polarity:</span>
                                <span className="font-semibold text-slate-800">{nlpResult.sentiment}</span>
                            </div>
                            <div className="text-slate-600">
                                <span>Detected Keywords: </span>
                                <span className="font-mono text-blue-700">{nlpResult.detected_keywords.join(", ") || "None"}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* SKILL GAP MATRIX TABLE FOR POLICY MAKERS */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                    <h3 className="font-bold text-slate-900 text-sm">MSDE / NSDC Skill-Gap Matrix & Curriculum Upgrades</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Strategic curriculum adjustments derived from longitudinal attrition analytics</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm">
                        <thead className="bg-slate-100 text-slate-700 text-xs font-semibold uppercase">
                            <tr>
                                <th className="px-4 py-3">Course Sector</th>
                                <th className="px-4 py-3">Total Audited</th>
                                <th className="px-4 py-3">Attrition Rate</th>
                                <th className="px-4 py-3">Primary Attrition Driver</th>
                                <th className="px-4 py-3">Strategic Curriculum Intervention</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {skillMatrix.map((m, i) => (
                                <tr key={i} className="hover:bg-slate-50">
                                    <td className="px-4 py-3 font-semibold text-slate-900">{m.course}</td>
                                    <td className="px-4 py-3">{m.total_cohort} Trainees</td>
                                    <td className="px-4 py-3 font-bold text-red-600">{m.attrition_rate_pct}%</td>
                                    <td className="px-4 py-3 text-slate-700">{m.primary_attrition_driver}</td>
                                    <td className="px-4 py-3 text-blue-800 font-medium">{m.strategic_curriculum_intervention}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// ----------------------------------------------------
// TAB 6: DPDP AUDIT VAULT COMPONENT
// ----------------------------------------------------
function AuditLogsTab({ showToast }) {
    const [logs, setLogs] = useState([]);
    const [dpdpStatus, setDpdpStatus] = useState(null);
    const [revokeId, setRevokeId] = useState("SKILL-2026-10010");

    const loadAudit = async () => {
        try {
            const res1 = await fetch(`${API_BASE}/api/audit/logs`);
            if (res1.ok) setLogs(await res1.json());

            const res2 = await fetch(`${API_BASE}/api/audit/dpdp-status`);
            if (res2.ok) setDpdpStatus(await res2.json());
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        loadAudit();
    }, []);

    const handleRevokeConsent = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/trainees/${revokeId}/revoke-consent`, {
                method: "POST"
            });
            const data = await res.json();
            if (res.ok) {
                showToast(`DPDP Section 6(4) Executed: Consent revoked for ${revokeId}`);
                loadAudit();
            } else {
                showToast(data.detail || "Revocation failed", "error");
            }
        } catch (err) {
            showToast("Server error", "error");
        }
    };

    return (
        <div className="space-y-6">
            {/* DPDP STATUS CARDS */}
            {dpdpStatus && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="text-xs font-semibold text-slate-500 uppercase">DPDP Act Compliance</div>
                        <div className="text-xl font-bold text-emerald-600 mt-1">{dpdpStatus.compliance_grade}</div>
                        <div className="text-[11px] text-slate-500 mt-1">Act No. 22 of 2023</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="text-xs font-semibold text-slate-500 uppercase">Consent Artifact Coverage</div>
                        <div className="text-xl font-bold text-blue-600 mt-1">{dpdpStatus.consent_coverage_pct}%</div>
                        <div className="text-[11px] text-blue-600 font-medium mt-1">{dpdpStatus.active_valid_consents} Valid Consents Active</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="text-xs font-semibold text-slate-500 uppercase">Field-Level Encryption</div>
                        <div className="text-xl font-bold text-indigo-600 mt-1">AES-256 GCM</div>
                        <div className="text-[11px] text-slate-500 mt-1">Aadhaar & Mobile Vault</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="text-xs font-semibold text-slate-500 uppercase">Data Subject Rights</div>
                        <div className="text-xl font-bold text-slate-800 mt-1">Section 6(4) Active</div>
                        <div className="text-[11px] text-slate-500 mt-1">Withdrawal Rights Enabled</div>
                    </div>
                </div>
            )}

            {/* CONSENT REVOCATION SANDBOX */}
            <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-sm border border-slate-800">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h4 className="font-bold text-white text-sm flex items-center gap-2">
                            <span>🛡️</span> DPDP Act Data Subject Consent Withdrawal Simulator
                        </h4>
                        <p className="text-xs text-slate-400 mt-1">
                            Simulates a candidate requesting removal from automated longitudinal follow-ups under DPDP Act 2023.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={revokeId}
                            onChange={e => setRevokeId(e.target.value)}
                            className="bg-slate-800 border border-slate-700 text-white px-3 py-1.5 rounded-lg text-xs font-mono"
                            placeholder="SKILL-2026-XXXXX"
                        />
                        <button
                            onClick={handleRevokeConsent}
                            className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold shadow"
                        >
                            Withdraw Consent
                        </button>
                    </div>
                </div>
            </div>

            {/* AUDIT LOGS TABLE */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-slate-800 text-sm">Immutable Security & Access Audit Log</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Real-time log of data access, export, and consent modifications</p>
                    </div>
                    <button
                        onClick={loadAudit}
                        className="text-xs bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded font-medium text-slate-700"
                    >
                        🔄 Refresh Log
                    </button>
                </div>

                <div className="overflow-x-auto max-h-[500px]">
                    <table className="w-full text-left text-xs sm:text-sm">
                        <thead className="bg-slate-100 text-slate-700 text-xs font-semibold uppercase sticky top-0">
                            <tr>
                                <th className="px-4 py-3">Timestamp (UTC)</th>
                                <th className="px-4 py-3">User & Role</th>
                                <th className="px-4 py-3">Action Event</th>
                                <th className="px-4 py-3">Resource Target</th>
                                <th className="px-4 py-3">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 font-mono text-xs">
                            {logs.map(l => (
                                <tr key={l.id} className="hover:bg-slate-50">
                                    <td className="px-4 py-2.5 text-slate-500 whitespace-nowrap">
                                        {l.timestamp ? l.timestamp.replace('T', ' ').substring(0, 19) : ''}
                                    </td>
                                    <td className="px-4 py-2.5 whitespace-nowrap">
                                        <div className="font-semibold text-slate-800 font-sans">{l.user_name}</div>
                                        <div className="text-[10px] text-slate-400 font-sans">Role: {l.user_role}</div>
                                    </td>
                                    <td className="px-4 py-2.5">
                                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                                            l.action.includes('REVOKE') ? 'bg-red-100 text-red-800' :
                                            l.action.includes('EXPORT') ? 'bg-indigo-100 text-indigo-800' :
                                            l.action.includes('ONBOARD') ? 'bg-emerald-100 text-emerald-800' :
                                            'bg-blue-100 text-blue-800'
                                        }`}>
                                            {l.action}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2.5 text-slate-600">{l.resource_type} ({l.resource_id})</td>
                                    <td className="px-4 py-2.5 text-slate-700 font-sans text-xs">{l.details}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// Render Root
ReactDOM.render(<App />, document.getElementById("root"));
