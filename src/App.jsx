import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  CreditCard,
  Download,
  Filter,
  LayoutDashboard,
  Menu,
  MoreHorizontal,
  Search,
  Settings,
  Users,
  X,
} from "lucide-react";
import { getDashboardData } from "./data/dashboardData";
import { filterAndSortActivities } from "./utils/tableUtils";
import "./App.css";

const navItems = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Analytics", icon: BarChart3 },
  { label: "Customers", icon: Users },
  { label: "Billing", icon: CreditCard },
];
const pageSize = 5;

function Sidebar({ open, onClose, activePage, onNavigate }) {
  return (
    <aside className={`sidebar ${open ? "is-open" : ""}`}>
      <div className="brand">
        <span className="brand-mark">
          <Activity size={18} />
        </span>
        <span>
          Pulse<span className="brand-accent">UI</span>
        </span>
        <button
          className="mobile-close"
          onClick={onClose}
          aria-label="Close menu"
        >
          <X size={19} />
        </button>
      </div>
      <div className="workspace">
        <span className="workspace-logo">P</span>
        <span>
          <small>Workspace</small>
          <strong>Acme Inc.</strong>
        </span>
        <ChevronDown size={15} />
      </div>
      <nav aria-label="Main navigation">
        <span className="nav-label">Workspace</span>
        {navItems.map(({ label, icon: Icon }) => (
          <button
            className={`nav-item ${label === activePage ? "active" : ""}`}
            key={label}
            onClick={() => onNavigate(label)}
          >
            <Icon size={18} />
            {label}
            {label === "Analytics" && <span className="nav-dot" />}
          </button>
        ))}
        <span className="nav-label settings-label">Manage</span>
        <button className="nav-item" onClick={() => onNavigate("Settings")}>
          <Settings size={18} />
          Settings
        </button>
        <button className="nav-item" onClick={() => onNavigate("Help center")}>
          <CircleHelp size={18} />
          Help center
        </button>
      </nav>
      <div className="sidebar-footer">
        <div className="avatar">JD</div>
        <div>
          <strong>Jordan Davis</strong>
          <small>jordan@acme.co</small>
        </div>
        <MoreHorizontal size={18} />
      </div>
    </aside>
  );
}

function Header({ onMenu, dateRange, onDateRangeChange }) {
  return (
    <header className="topbar">
      <button className="menu-button" onClick={onMenu} aria-label="Open menu">
        <Menu size={21} />
      </button>
      <div>
        <p className="eyebrow">Monday, October 21, 2024</p>
        <h1>
          Good morning, Jordan <span>✦</span>
        </h1>
      </div>
      <div className="header-actions">
        <button className="icon-button" aria-label="Notifications">
          <Bell size={19} />
          <span className="notification-dot" />
        </button>
        <label className="date-control">
          <span className="sr-only">Dashboard date range</span>
          <select value={dateRange} onChange={(event) => onDateRangeChange(event.target.value)}>
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>This quarter</option>
          </select>
          <ChevronDown size={16} aria-hidden="true" />
        </label>
        <button className="avatar mobile-avatar">JD</button>
      </div>
    </header>
  );
}

function KpiCard({ label, value, change, positive, icon: Icon, tone }) {
  return (
    <article className="kpi-card">
      <div className={`kpi-icon ${tone}`}>
        <Icon size={19} />
      </div>
      <div className="kpi-more">
        <MoreHorizontal size={18} />
      </div>
      <p>{label}</p>
      <strong>{value}</strong>
      <span className={positive ? "change positive" : "change negative"}>
        {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {change}
        <em>vs last month</em>
      </span>
    </article>
  );
}

function ChartCard({ title, subtitle, children, action }) {
  return (
    <section className="card chart-card">
      <div className="card-heading">
        <div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
        {action || (
          <button className="small-select">
            Last 30 days <ChevronDown size={14} />
          </button>
        )}
      </div>
      {children}
    </section>
  );
}

function ActivityTable({ activities }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All status");
  const [sort, setSort] = useState({ key: "date", direction: "desc" });
  const [page, setPage] = useState(1);
  const filtered = useMemo(
    () => filterAndSortActivities(activities, query, status, sort),
    [activities, query, status, sort],
  );
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const rows = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  const sortBy = (key) =>
    setSort((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  return (
    <section className="card activity-card">
      <div className="table-heading">
        <div>
          <h2>Recent activity</h2>
          <p>Track your team's latest updates</p>
        </div>
        <button className="export-button" onClick={() => downloadCsv(filtered)}>
          <Download size={15} /> Export
        </button>
      </div>
      <div className="table-tools">
        <label className="search-box">
          <Search size={17} />
          <input
            aria-label="Search activity"
            placeholder="Search activity..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <label className="filter-select">
          <Filter size={15} />
          <select
            aria-label="Filter by status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option>All status</option>
            <option>Completed</option>
            <option>Pending</option>
            <option>Failed</option>
          </select>
          <ChevronDown size={14} />
        </label>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Activity</th>
              <th>Customer</th>
              <th>
                <button onClick={() => sortBy("date")} aria-label="Sort by date" aria-sort={sort.key === "date" ? sort.direction : "none"}>
                  Date <span aria-hidden="true">↕</span>
                </button>
              </th>
              <th>
                <button onClick={() => sortBy("amount")} aria-label="Sort by amount" aria-sort={sort.key === "amount" ? sort.direction : "none"}>
                  Amount <span aria-hidden="true">↕</span>
                </button>
              </th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>
                  <span className={`activity-avatar ${row.avatarTone}`}>
                    {row.initials}
                  </span>
                  <div>
                    <strong>{row.activity}</strong>
                    <small>{row.type}</small>
                  </div>
                </td>
                <td>{row.customer}</td>
                <td>{row.date}</td>
                <td className="amount">{row.amount}</td>
                <td>
                  <span className={`status ${row.status.toLowerCase()}`}>
                    {row.status}
                  </span>
                </td>
                <td>
                  <button
                    className="row-more"
                    aria-label={`More actions for ${row.activity}`}
                  >
                    <MoreHorizontal size={17} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length === 0 && (
        <div className="empty-state">
          <Search size={23} />
          <strong>No activity found</strong>
          <span>Try adjusting your search or filters.</span>
        </div>
      )}
      <div className="pagination">
        <span>
          Showing {filtered.length ? (safePage - 1) * pageSize + 1 : 0}–
          {Math.min(safePage * pageSize, filtered.length)} of {filtered.length}{" "}
          results
        </span>
        <div>
          <button
            disabled={safePage === 1}
            onClick={() => setPage((p) => p - 1)}
            aria-label="Previous page"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="page-number">
            {safePage} / {pageCount}
          </span>
          <button
            disabled={safePage === pageCount}
            onClick={() => setPage((p) => p + 1)}
            aria-label="Next page"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}

function downloadCsv(rows) {
  const header = ["Activity", "Customer", "Date", "Amount", "Status"];
  const content = [
    header,
    ...rows.map((row) => [row.activity, row.customer, row.date, row.amount, row.status]),
  ]
    .map((line) => line.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","))
    .join("\n");
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([content], { type: "text/csv" }));
  link.download = "pulseui-activity.csv";
  link.click();
  URL.revokeObjectURL(link.href);
}

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dashboard, setDashboard] = useState(null);
  const [dateRange, setDateRange] = useState("Last 30 days");
  const [activePage, setActivePage] = useState("Overview");
  useEffect(() => {
    getDashboardData()
      .then((data) => {
        setDashboard(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);
  if (loading)
    return (
      <div className="loading-screen">
        <div className="loader" />
        <p>Loading your workspace...</p>
      </div>
    );
  if (error)
    return (
      <div className="loading-screen">
        <strong>We couldn't load your dashboard.</strong>
        <button onClick={() => window.location.reload()}>Try again</button>
      </div>
    );
  return (
    <div className="app-shell">
      <Sidebar
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        activePage={activePage}
        onNavigate={(page) => {
          setActivePage(page);
          setMenuOpen(false);
        }}
      />
      <main className="main-content">
        <Header
          onMenu={() => setMenuOpen(true)}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />
        <div className="content">
          <div className="section-intro">
            <div>
              <h2>Overview</h2>
              <p>Here's what's happening with your business today.</p>
            </div>
            <button className="date-button desktop-date">
              {dateRange} <ChevronDown size={16} />
            </button>
          </div>
          <div className="kpi-grid">
            {(() => {
              const activities = dashboard.activityData.rows;
              const revenue = dashboard.categoryData.reduce((sum, item) => sum + item.revenue, 0);
              const completed = activities.filter((item) => item.status === "Completed").length;
              const averageOrder = activities.filter((item) => item.amount > 0).reduce((sum, item) => sum + item.amount, 0) / activities.filter((item) => item.amount > 0).length;
              return (
                <>
            <KpiCard
              label="Total revenue"
              value={`$${revenue.toLocaleString()}`}
              change="12.5%"
              positive
              icon={CreditCard}
              tone="purple"
            />
            <KpiCard
              label="Active users"
              value={activities.length.toLocaleString()}
              change="8.2%"
              positive
              icon={Users}
              tone="blue"
            />
            <KpiCard
              label="Conversion rate"
              value={`${((completed / activities.length) * 100).toFixed(2)}%`}
              change="2.4%"
              positive
              icon={Activity}
              tone="green"
            />
            <KpiCard
              label="Avg. order value"
              value={`$${averageOrder.toFixed(2)}`}
              change="3.1%"
              positive={false}
              icon={BarChart3}
              tone="orange"
            />
                </>
              );
            })()}
          </div>
          <div className="charts-grid">
            <ChartCard
              title="Activity overview"
              subtitle="Unique visitors and sessions over time"
            >
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={dashboard.activityData.chart}>
                  <defs>
                    <linearGradient
                      id="visitorFill"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#6758d9" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#6758d9" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="#eef0f5" />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#8b93a6", fontSize: 11 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#8b93a6", fontSize: 11 }}
                    tickFormatter={(v) => `${v / 1000}k`}
                  />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="visitors"
                    stroke="#6758d9"
                    strokeWidth={2.5}
                    fill="url(#visitorFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
              <div className="chart-legend">
                <span>
                  <i className="legend-purple" /> Visitors
                </span>
                <span>
                  <i className="legend-gray" /> Sessions
                </span>
              </div>
            </ChartCard>
            <ChartCard
              title="Performance by category"
              subtitle="Revenue generated by product category"
              action={
                <button className="small-select">
                  Revenue <ChevronDown size={14} />
                </button>
              }
            >
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={dashboard.categoryData} barGap={10}>
                  <CartesianGrid vertical={false} stroke="#eef0f5" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#8b93a6", fontSize: 11 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#8b93a6", fontSize: 11 }}
                    tickFormatter={(v) => `$${v / 1000}k`}
                  />
                  <Tooltip formatter={(v) => `$${v.toLocaleString()}`} />
                  <Bar
                    dataKey="revenue"
                    fill="#9d91ef"
                    radius={[5, 5, 0, 0]}
                    barSize={28}
                  />
                </BarChart>
              </ResponsiveContainer>
              <p className="chart-note">
                <span className="up-note">
                  <ArrowUpRight size={14} /> 18.4%
                </span>{" "}
                increase in revenue this month
              </p>
            </ChartCard>
          </div>
          <ActivityTable activities={dashboard.activityData.rows} />
        </div>
      </main>
    </div>
  );
}

export default App;
