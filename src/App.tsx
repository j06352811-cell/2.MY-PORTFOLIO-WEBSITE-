import { useDeferredValue, useState, type FormEvent } from 'react'
import {
  Activity, ArrowDown, ArrowDownLeft, ArrowDownRight,
  ArrowUp, ArrowUpRight, Bell, Check, ChevronDown, ChevronLeft, ChevronRight,
  CircleHelp, CreditCard, Download, Ellipsis, LayoutDashboard, Menu, Plus,
  Search, Settings, UserRound, Users, X,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import {
  Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer,
  Tooltip, XAxis, YAxis,
} from 'recharts'

type Range = '7 days' | '30 days' | '90 days'
type Status = 'Active' | 'Past due' | 'Canceled'
type Subscription = {
  id: string
  name: string
  email: string
  initials: string
  color: string
  plan: string
  amount: number
  status: Status
  joined: string
}

function dateDaysAgo(daysAgo: number) {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).format(date)
}

const initialSubscriptions: Subscription[] = [
  { id: 'CUS-1048', name: 'Olivia Rhye', email: 'olivia@linear.co', initials: 'OR', color: 'coral', plan: 'Enterprise', amount: 249, status: 'Active', joined: dateDaysAgo(1) },
  { id: 'CUS-1047', name: 'Phoenix Baker', email: 'phoenix@figma.com', initials: 'PB', color: 'blue', plan: 'Pro', amount: 79, status: 'Active', joined: dateDaysAgo(2) },
  { id: 'CUS-1046', name: 'Lana Steiner', email: 'lana@loom.com', initials: 'LS', color: 'lilac', plan: 'Pro', amount: 79, status: 'Past due', joined: dateDaysAgo(3) },
  { id: 'CUS-1045', name: 'Demi Wilkinson', email: 'demi@webflow.com', initials: 'DW', color: 'gold', plan: 'Starter', amount: 29, status: 'Active', joined: dateDaysAgo(4) },
  { id: 'CUS-1044', name: 'Candice Wu', email: 'candice@stripe.com', initials: 'CW', color: 'mint', plan: 'Enterprise', amount: 249, status: 'Active', joined: dateDaysAgo(5) },
  { id: 'CUS-1043', name: 'Natali Craig', email: 'natali@notion.so', initials: 'NC', color: 'rose', plan: 'Pro', amount: 79, status: 'Canceled', joined: dateDaysAgo(6) },
  { id: 'CUS-1042', name: 'Drew Cano', email: 'drew@asana.com', initials: 'DC', color: 'blue', plan: 'Starter', amount: 29, status: 'Active', joined: dateDaysAgo(7) },
  { id: 'CUS-1041', name: 'Andi Lane', email: 'andi@framer.com', initials: 'AL', color: 'coral', plan: 'Pro', amount: 79, status: 'Past due', joined: dateDaysAgo(8) },
  { id: 'CUS-1040', name: 'Riley Smith', email: 'riley@vercel.com', initials: 'RS', color: 'lilac', plan: 'Enterprise', amount: 249, status: 'Active', joined: dateDaysAgo(9) },
  { id: 'CUS-1039', name: 'Jordan Lee', email: 'jordan@loom.com', initials: 'JL', color: 'gold', plan: 'Starter', amount: 29, status: 'Canceled', joined: dateDaysAgo(10) },
  { id: 'CUS-1038', name: 'Taylor Kim', email: 'taylor@figma.com', initials: 'TK', color: 'mint', plan: 'Pro', amount: 79, status: 'Active', joined: dateDaysAgo(11) },
  { id: 'CUS-1037', name: 'Morgan Chen', email: 'morgan@linear.app', initials: 'MC', color: 'rose', plan: 'Pro', amount: 79, status: 'Past due', joined: dateDaysAgo(12) },
]

const chartData: Record<Range, { label: string; current: number; previous: number }[]> = {
  '7 days': [
    { label: 'Mon', current: 31, previous: 27 }, { label: 'Tue', current: 34, previous: 28 },
    { label: 'Wed', current: 32, previous: 29 }, { label: 'Thu', current: 39, previous: 31 },
    { label: 'Fri', current: 37, previous: 30 }, { label: 'Sat', current: 43, previous: 33 },
    { label: 'Sun', current: 46, previous: 35 },
  ],
  '30 days': [
    { label: 'Sep 01', current: 24, previous: 22 }, { label: 'Sep 05', current: 28, previous: 23 },
    { label: 'Sep 09', current: 27, previous: 24 }, { label: 'Sep 13', current: 34, previous: 25 },
    { label: 'Sep 17', current: 32, previous: 26 }, { label: 'Sep 21', current: 39, previous: 28 },
    { label: 'Sep 25', current: 37, previous: 29 }, { label: 'Sep 30', current: 46, previous: 31 },
  ],
  '90 days': [
    { label: 'Jul', current: 21, previous: 18 }, { label: 'Jul 12', current: 24, previous: 20 },
    { label: 'Jul 24', current: 23, previous: 19 }, { label: 'Aug 05', current: 29, previous: 21 },
    { label: 'Aug 17', current: 31, previous: 22 }, { label: 'Aug 29', current: 34, previous: 24 },
    { label: 'Sep 10', current: 38, previous: 26 }, { label: 'Sep 22', current: 46, previous: 29 },
  ],
}

const plans = [
  { name: 'Pro', count: '2,408', value: 2408, share: '54%', color: '#b7e56b' },
  { name: 'Starter', count: '1,246', value: 1246, share: '28%', color: '#f2a78d' },
  { name: 'Enterprise', count: '802', value: 802, share: '18%', color: '#79b9b1' },
]

const navigation: { label: string; icon: LucideIcon }[] = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Customers', icon: Users },
  { label: 'Subscriptions', icon: CreditCard },
  { label: 'Reports', icon: Activity },
]

function MetricCard({
  label, value, change, detail, icon: Icon, tone = 'green', down = false,
}: {
  label: string
  value: string
  change: string
  detail: string
  icon: LucideIcon
  tone?: 'green' | 'coral' | 'blue' | 'yellow'
  down?: boolean
}) {
  return (
    <article className="metric-card">
      <div className="metric-topline">
        <span>{label}</span>
        <span className={`metric-icon ${tone}`}><Icon size={17} strokeWidth={1.9} /></span>
      </div>
      <div className="metric-value">{value}</div>
      <div className="metric-foot">
          <span className="change-pill">
          {down ? <ArrowDownRight size={13} /> : <ArrowUpRight size={13} />}{change}
        </span>
        <span className="metric-detail">{detail}</span>
      </div>
    </article>
  )
}

function App() {
  const today = new Date()
  const todayLabel = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(today).toUpperCase()
  const joinedToday = new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).format(today)
  const [range, setRange] = useState<Range>('30 days')
  const [subscriptions, setSubscriptions] = useState(initialSubscriptions)
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)
  const [statusFilter, setStatusFilter] = useState('All statuses')
  const [sortBy, setSortBy] = useState<keyof Subscription>('joined')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [activeNav, setActiveNav] = useState('Overview')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Subscription | null>(null)
  const [notice, setNotice] = useState('')

  const filteredSubscriptions = subscriptions
    .filter((customer) => {
      const search = deferredQuery.trim().toLowerCase()
      const matchesSearch = !search || [customer.name, customer.email, customer.id, customer.plan]
        .some((value) => value.toLowerCase().includes(search))
      return matchesSearch && (statusFilter === 'All statuses' || customer.status === statusFilter)
    })
    .sort((first, second) => {
      const firstValue = first[sortBy]
      const secondValue = second[sortBy]
      const comparison = typeof firstValue === 'number' && typeof secondValue === 'number'
        ? firstValue - secondValue
        : sortBy === 'joined'
          ? Date.parse(String(firstValue)) - Date.parse(String(secondValue))
          : String(firstValue).localeCompare(String(secondValue))
      return sortDirection === 'asc' ? comparison : -comparison
    })
  const pageSize = 10
  const pageCount = Math.max(1, Math.ceil(filteredSubscriptions.length / pageSize))
  const safePage = Math.min(currentPage, pageCount)
  const visibleSubscriptions = filteredSubscriptions.slice((safePage - 1) * pageSize, safePage * pageSize)
  const resultStart = filteredSubscriptions.length ? (safePage - 1) * pageSize + 1 : 0
  const resultEnd = Math.min(safePage * pageSize, filteredSubscriptions.length)

  function toggleSort(column: keyof Subscription) {
    if (sortBy === column) {
      setSortDirection((direction) => direction === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortDirection('asc')
    }
  }

  function exportCsv() {
    const columns = ['Customer', 'Email', 'Plan', 'Monthly amount', 'Status', 'Joined', 'Customer ID']
    const rows = filteredSubscriptions.map((customer) => [
      customer.name, customer.email, customer.plan, String(customer.amount), customer.status, customer.joined, customer.id,
    ])
    const csv = [columns, ...rows].map((row) => row.map((value) => `"${value.replace(/"/g, '""')}"`).join(',')).join('\n')
    const link = document.createElement('a')
    link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    link.download = 'orbit-subscriptions.csv'
    link.click()
    const objectUrl = link.href
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000)
    setNotice(`Exported ${filteredSubscriptions.length} subscription records`)
  }

  function addCustomer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const name = String(formData.get('name') ?? '').trim()
    const email = String(formData.get('email') ?? '').trim()
    const plan = String(formData.get('plan') ?? 'Pro')
    if (!name || !email) return
    const initials = name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()
    setSubscriptions((current) => [{
      id: `CUS-${1050 + current.length}`,
      name,
      email,
      initials,
      color: 'mint',
      plan,
      amount: plan === 'Enterprise' ? 249 : plan === 'Starter' ? 29 : 79,
      status: 'Active',
      joined: joinedToday,
    }, ...current])
    setCurrentPage(1)
    setDialogOpen(false)
    setNotice(`${name} added to subscriptions`)
    event.currentTarget.reset()
  }

  return (
    <div className="app-shell">
      {mobileNavOpen && <button className="nav-scrim" aria-label="Close navigation" onClick={() => setMobileNavOpen(false)} />}
      <aside className={`sidebar ${mobileNavOpen ? 'sidebar-open' : ''}`}>
        <a className="brand" href="#overview" aria-label="Orbit home">
          <span className="brand-mark"><span /></span><span>orbit<span className="brand-period">.</span></span>
        </a>
        <div className="workspace-switcher">
          <span className="workspace-avatar">S</span>
          <span className="workspace-copy"><strong>Studio North</strong><small>Pro workspace</small></span>
          <ChevronDown size={15} />
        </div>
        <div className="nav-label">WORKSPACE</div>
        <nav className="main-nav" aria-label="Main navigation">
          {navigation.map(({ label, icon: Icon }) => (
            <a
              className={`nav-link ${activeNav === label ? 'selected' : ''}`}
              href={label === 'Overview' ? '#overview' : label === 'Reports' ? '#analytics' : '#subscriptions'}
              key={label}
              aria-current={activeNav === label ? 'page' : undefined}
              onClick={() => { setActiveNav(label); setMobileNavOpen(false) }}
            >
              <Icon size={17} strokeWidth={1.8} /><span>{label}</span>
              {label === 'Subscriptions' && <span className="nav-count">{subscriptions.length}</span>}
            </a>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <a className="nav-link" href="#settings"><Settings size={17} strokeWidth={1.8} /><span>Settings</span></a>
          <a className="nav-link" href="#help"><CircleHelp size={17} strokeWidth={1.8} /><span>Help center</span></a>
          <div className="sidebar-profile">
            <div className="profile-avatar">AM</div>
            <div className="profile-copy"><strong>Amira Moore</strong><small>amira@orbit.so</small></div>
            <Ellipsis size={18} />
          </div>
        </div>
      </aside>

      <main className="main-content" id="overview">
        <header className="topbar">
          <button className="icon-button mobile-menu" aria-label="Open navigation" onClick={() => setMobileNavOpen(true)}><Menu size={20} /></button>
          <div className="breadcrumbs"><span>Workspace</span><ChevronRight size={14} /><strong>{activeNav}</strong></div>
          <div className="topbar-actions">
            <button className="icon-button notification-button" aria-label="Notifications"><Bell size={18} /><span /></button>
            <div className="top-avatar" aria-label="Amira Moore">AM</div>
          </div>
        </header>

        <div className="page-wrap">
          <section className="page-heading">
            <div>
              <p className="eyebrow"><span className="live-dot" /> {todayLabel}</p>
              <h1>Good morning, Amira<span>.</span></h1>
              <p className="heading-subtitle">Here&apos;s what&apos;s happening with your business today.</p>
            </div>
            <button className="button button-dark" onClick={exportCsv}><Download size={15} /> Export report</button>
          </section>

          <section className="metrics-grid" aria-label="Key business metrics">
            <MetricCard label="Monthly recurring revenue" value="$48,294" change="12.8%" detail="vs. last month" icon={CreditCard} />
            <MetricCard label="Active subscribers" value="4,456" change="8.2%" detail="vs. last month" icon={Users} tone="blue" />
            <MetricCard label="Net revenue retention" value="108.6%" change="2.4%" detail="vs. last month" icon={Activity} tone="yellow" />
            <MetricCard label="Monthly churn rate" value="2.14%" change="0.6%" detail="vs. last month" icon={ArrowDownLeft} tone="coral" down />
          </section>

          <section className="analytics-grid" id="analytics" aria-label="Revenue analytics">
            <article className="panel revenue-panel">
              <div className="panel-heading">
                <div>
                  <div className="panel-kicker">REVENUE OVERVIEW</div>
                  <h2>Recurring revenue</h2>
                </div>
                <div className="range-switch" role="group" aria-label="Revenue chart time range">
                  {(['7 days', '30 days', '90 days'] as Range[]).map((item) => (
                    <button key={item} className={range === item ? 'range-active' : ''} onClick={() => setRange(item)} aria-pressed={range === item}>{item}</button>
                  ))}
                </div>
              </div>
              <div className="chart-summary">
                <strong>$48,294</strong><span className="change-pill"><ArrowUpRight size={13} />12.8%</span><span>vs previous period</span>
              </div>
              <div className="revenue-chart" role="img" aria-label={`Recurring revenue trend for the last ${range}`}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData[range]} margin={{ top: 10, right: 5, left: -18, bottom: 0 }}>
                    <defs>
                      <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#9acb55" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#9acb55" stopOpacity={0.01} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke="#e9ece4" strokeDasharray="3 5" />
                    <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#92988d', fontSize: 11 }} dy={11} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#92988d', fontSize: 11 }} tickFormatter={(value: number) => `$${value}k`} />
                    <Tooltip content={<RevenueTooltip />} />
                    <Area type="monotone" dataKey="previous" name="Previous period" stroke="#cbd0c5" strokeWidth={1.6} strokeDasharray="5 5" fill="transparent" activeDot={false} />
                    <Area type="monotone" dataKey="current" name="This period" stroke="#537c36" strokeWidth={2.5} fill="url(#revenueFill)" activeDot={{ r: 4, fill: '#537c36', stroke: '#fff', strokeWidth: 2 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="chart-legend"><span><i className="legend-current" />This period</span><span><i className="legend-previous" />Previous period</span></div>
            </article>

            <article className="panel plan-panel">
              <div className="panel-heading">
                <div><div className="panel-kicker">CUSTOMER MIX</div><h2>Plans breakdown</h2></div>
                <button className="icon-button subtle" aria-label="More plan breakdown options"><Ellipsis size={19} /></button>
              </div>
              <div className="plan-chart-wrap">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={plans} dataKey="value" nameKey="name" innerRadius="69%" outerRadius="91%" paddingAngle={3} stroke="none" startAngle={90} endAngle={-270}>
                      {plans.map((plan) => <Cell key={plan.name} fill={plan.color} />)}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} subscribers`, 'Customers']} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="donut-center"><strong>4,456</strong><span>customers</span></div>
              </div>
              <div className="plan-legend">
                {plans.map((plan, index) => (
                  <div className="plan-row" key={plan.name}>
                    <span className="plan-name"><i style={{ backgroundColor: plan.color }} />{plan.name}</span>
                    <span className="plan-count">{plan.count}</span>
                    <span className="plan-share">{plan.share}</span>
                    {index === 0 && <span className="sr-only">Largest plan segment</span>}
                  </div>
                ))}
              </div>
              <div className="plan-note"><span className="note-spark">✳</span><span><strong>Pro is your sweet spot.</strong> It drives over half of your active subscriptions.</span></div>
            </article>
          </section>

          <section className="panel subscriptions-panel" id="subscriptions">
            <div className="table-heading">
              <div><div className="panel-kicker">YOUR PEOPLE</div><h2>{activeNav === 'Customers' ? 'Customer directory' : 'Recent subscriptions'} <span className="table-count">{filteredSubscriptions.length}</span></h2></div>
              <div className="table-actions">
                <label className="table-search"><Search size={15} /><input aria-label="Search subscriptions" placeholder="Search customers..." value={query} onChange={(event) => { setQuery(event.target.value); setCurrentPage(1) }} /></label>
                <label className="filter-select-wrap">
                  <span className="sr-only">Filter by subscription status</span>
                  <select value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setCurrentPage(1) }}>
                    <option>All statuses</option><option>Active</option><option>Past due</option><option>Canceled</option>
                  </select><ChevronDown size={14} />
                </label>
                <button className="button button-light add-button" onClick={() => setDialogOpen(true)}><Plus size={15} /> Add customer</button>
              </div>
            </div>
            <div className="table-scroll">
              <table>
                <thead><tr>
                  <th aria-sort={sortBy === 'name' ? sortDirection === 'asc' ? 'ascending' : 'descending' : 'none'}><button onClick={() => toggleSort('name')}>Customer <SortIcon active={sortBy === 'name'} direction={sortDirection} /></button></th>
                  <th aria-sort={sortBy === 'plan' ? sortDirection === 'asc' ? 'ascending' : 'descending' : 'none'}><button onClick={() => toggleSort('plan')}>Plan <SortIcon active={sortBy === 'plan'} direction={sortDirection} /></button></th>
                  <th aria-sort={sortBy === 'amount' ? sortDirection === 'asc' ? 'ascending' : 'descending' : 'none'}><button onClick={() => toggleSort('amount')}>Amount <SortIcon active={sortBy === 'amount'} direction={sortDirection} /></button></th>
                  <th aria-sort={sortBy === 'status' ? sortDirection === 'asc' ? 'ascending' : 'descending' : 'none'}><button onClick={() => toggleSort('status')}>Status <SortIcon active={sortBy === 'status'} direction={sortDirection} /></button></th>
                  <th aria-sort={sortBy === 'joined' ? sortDirection === 'asc' ? 'ascending' : 'descending' : 'none'}><button onClick={() => toggleSort('joined')}>Date added <SortIcon active={sortBy === 'joined'} direction={sortDirection} /></button></th>
                  <th><span className="sr-only">Actions</span></th>
                </tr></thead>
                <tbody>
                  {visibleSubscriptions.map((customer) => (
                    <tr key={customer.id}>
                      <td><div className="customer-cell"><span className={`customer-avatar ${customer.color}`}>{customer.initials}</span><span className="customer-info"><strong>{customer.name}</strong><small>{customer.email}</small></span></div></td>
                      <td><span className={`plan-tag ${customer.plan.toLowerCase()}`}>{customer.plan}</span></td>
                      <td className="amount-cell">${customer.amount}<span>/mo</span></td>
                      <td><span className={`status-badge ${customer.status.toLowerCase().replace(' ', '-')}`}><i />{customer.status}</span></td>
                      <td className="date-cell">{customer.joined}</td>
                      <td><button className="row-more" aria-label={`View details for ${customer.name}`} onClick={() => setSelectedCustomer(customer)}><UserRound size={16} /></button></td>
                    </tr>
                  ))}
                  {filteredSubscriptions.length === 0 && <tr><td className="empty-state" colSpan={6}>No customers match your search. Try another name or status.</td></tr>}
                </tbody>
              </table>
            </div>
            <div className="table-footer">
              <span>Showing <strong>{resultStart}-{resultEnd}</strong> of <strong>{filteredSubscriptions.length}</strong> customers</span>
              <div className="pagination">
                <button disabled={safePage === 1} aria-label="Previous page" onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}><ChevronLeft size={16} /></button>
                <span>Page {safePage} of {pageCount}</span>
                <button disabled={safePage === pageCount} aria-label="Next page" onClick={() => setCurrentPage((page) => Math.min(pageCount, page + 1))}><ChevronRight size={16} /></button>
              </div>
            </div>
          </section>
          <footer className="page-footer"><span>Orbit analytics <span className="footer-dot">/</span> Demo workspace</span><span>Last synced just now <span className="sync-dot" /></span></footer>
        </div>
      </main>

      {dialogOpen && <div className="dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setDialogOpen(false) }}>
        <section className="customer-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
          <div className="dialog-heading"><div><div className="panel-kicker">NEW SUBSCRIPTION</div><h2 id="dialog-title">Add a customer</h2></div><button className="icon-button subtle" aria-label="Close dialog" onClick={() => setDialogOpen(false)}><X size={18} /></button></div>
          <form onSubmit={addCustomer}>
            <label>Full name<input name="name" autoFocus required placeholder="e.g. Alex Morgan" /></label>
            <label>Email address<input name="email" type="email" required placeholder="alex@company.com" /></label>
            <label>Plan<select name="plan"><option>Pro</option><option>Starter</option><option>Enterprise</option></select></label>
            <div className="dialog-actions"><button type="button" className="button button-light" onClick={() => setDialogOpen(false)}>Cancel</button><button type="submit" className="button button-dark"><Plus size={15} /> Add customer</button></div>
          </form>
        </section>
      </div>}

      {selectedCustomer && <div className="dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedCustomer(null) }}>
        <section className="customer-dialog" role="dialog" aria-modal="true" aria-labelledby="customer-detail-title">
          <div className="dialog-heading"><div><div className="panel-kicker">CUSTOMER PROFILE</div><h2 id="customer-detail-title">{selectedCustomer.name}</h2></div><button className="icon-button subtle" aria-label="Close customer details" onClick={() => setSelectedCustomer(null)}><X size={18} /></button></div>
          <div className="customer-detail-grid">
            <div><span>Email</span><strong>{selectedCustomer.email}</strong></div>
            <div><span>Customer ID</span><strong>{selectedCustomer.id}</strong></div>
            <div><span>Subscription</span><strong>{selectedCustomer.plan} · ${selectedCustomer.amount}/mo</strong></div>
            <div><span>Status</span><strong className={`status-badge ${selectedCustomer.status.toLowerCase().replace(' ', '-')}`}><i />{selectedCustomer.status}</strong></div>
            <div><span>Customer since</span><strong>{selectedCustomer.joined}</strong></div>
          </div>
          <div className="dialog-actions"><button className="button button-dark" onClick={() => setSelectedCustomer(null)}>Done</button></div>
        </section>
      </div>}

      {notice && <div className="toast" role="status"><Check size={16} />{notice}<button aria-label="Dismiss notification" onClick={() => setNotice('')}><X size={15} /></button></div>}
    </div>
  )
}

function SortIcon({ active, direction }: { active: boolean; direction: 'asc' | 'desc' }) {
  if (!active) return <ArrowDown size={12} className="sort-idle" />
  return direction === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />
}

function RevenueTooltip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null
  return <div className="chart-tooltip"><strong>{label}</strong>{payload.map((item) => <span key={item.name}><i style={{ backgroundColor: item.color }} />{item.name}<b>${item.value},000</b></span>)}</div>
}

export default App