const { useState, useEffect, useContext, createContext, useMemo } = React;
const { HashRouter, Routes, Route, Link, useLocation, useNavigate } = window.ReactRouterDOM;
// --- SVGs ---
const IconSvg = ({ children, size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {children}
    </svg>
);
const Target = ({ size }) => <IconSvg size={size}><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></IconSvg>;
const Settings = ({ size }) => <IconSvg size={size}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></IconSvg>;
const Shield = ({ size }) => <IconSvg size={size}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></IconSvg>;
const CloudLightning = ({ size }) => <IconSvg size={size}><path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9" /><polyline points="13 11 9 17 15 17 11 23" /></IconSvg>;
const Map = ({ size }) => <IconSvg size={size}><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" /><line x1="9" y1="3" x2="9" y2="18" /><line x1="15" y1="6" x2="15" y2="21" /></IconSvg>;
const ClipboardList = ({ size }) => <IconSvg size={size}><rect x="8" y="2" width="8" height="4" rx="1" ry="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="M12 11h4" /><path d="M12 16h4" /><path d="M8 11h.01" /><path d="M8 16h.01" /></IconSvg>;
const BarChart2 = ({ size }) => <IconSvg size={size}><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></IconSvg>;
const Layers = ({ size }) => <IconSvg size={size}><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 12 12 17 22 12" /><polyline points="2 17 12 22 22 17" /></IconSvg>;
const ChevronDown = ({ size }) => <IconSvg size={size}><polyline points="6 9 12 15 18 9" /></IconSvg>;
const ChevronRight = ({ size }) => <IconSvg size={size}><polyline points="9 18 15 12 9 6" /></IconSvg>;
const X = ({ size }) => <IconSvg size={size}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></IconSvg>;
const LayoutDashboard = ({ size }) => <IconSvg size={size}><rect x="3" y="3" width="7" height="9" /><rect x="14" y="3" width="7" height="5" /><rect x="14" y="12" width="7" height="9" /><rect x="3" y="16" width="7" height="5" /></IconSvg>;
const Activity = ({ size }) => <IconSvg size={size}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></IconSvg>;
const Users = ({ size }) => <IconSvg size={size}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></IconSvg>;

// -----------------------------------------------------------------------------
// Global Context / State Management
// -----------------------------------------------------------------------------
const AppContext = createContext();

const AppProvider = ({ children }) => {
    const [activePage, setActivePage] = useState("Dashboard Home");
    const [activePillar, setActivePillar] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [activeGlobalApp, setActiveGlobalApp] = useState(null);

    const openApp = (appId) => {
        setActiveGlobalApp(appId);
        setDrawerOpen(true);
    };

    const closeDrawer = () => {
        setDrawerOpen(false);
        setTimeout(() => setActiveGlobalApp(null), 400); // Wait for transition
    };

    const value = {
        activePage, setActivePage,
        activePillar, setActivePillar,
        drawerOpen, openApp, closeDrawer, activeGlobalApp
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// -----------------------------------------------------------------------------
// Data Structure
// -----------------------------------------------------------------------------
const NAVIGATION = {
    Pillars: [
        {
            id: "A",
            title: "Purpose & Mission",
            icon: <Target size={20} />,
            items: [
                { id: "A1", path: "/a1", label: "Service Delivery" },
                { id: "A2", path: "/a2", label: "Inputs" },
                { id: "A3", path: "/a3", label: "Outputs" },
                { id: "A4", path: "/a4", label: "Outcomes" },
                { id: "A5", path: "/a5", label: "Impact" }
            ]
        },
        {
            id: "B",
            title: "Operations",
            icon: <Settings size={20} />,
            items: [
                { id: "B1", path: "/b1", label: "Finance & Grants" },
                { id: "B2", path: "/b2", label: "Fund Raising" },
                { id: "B3", path: "/b3", label: "Volunteer Management" },
                { id: "B4", path: "/b4", label: "Marketing & Communications" },
                { id: "B5", path: "/b5", label: "Human Resource" }
            ]
        },
        {
            id: "C",
            title: "Governance",
            icon: <Shield size={20} />,
            items: [
                { id: "C1", path: "/c1", label: "Charity Governance Code" },
                { id: "C2", path: "/c2", label: "Governance Evaluation Checklist" },
                { id: "C3", path: "/c3", label: "Standard Operating Procedures" },
                { id: "C4", path: "/c4", label: "Constitution" },
                { id: "C5", path: "/c5", label: "Terms of Reference" },
                { id: "C6", path: "/c6", label: "Strategic Plans" }
            ]
        }
    ],
    GlobalApps: [
        { id: "D1", label: "Question Stormer", icon: <CloudLightning size={20} strokeWidth={2.5} /> },
        { id: "D2", label: "Wayfinder", icon: <Map size={20} strokeWidth={2.5} /> },
        { id: "D3", label: "Survey", icon: <ClipboardList size={20} strokeWidth={2.5} /> },
        { id: "D4", label: "Analyser", icon: <BarChart2 size={20} strokeWidth={2.5} /> }
    ]
};

// Helper Icon Mapper
const getIconForPath = (path) => {
    if (path.startsWith('/a')) return <Activity size={32} />;
    if (path.startsWith('/b')) return <Users size={32} />;
    if (path.startsWith('/c')) return <Shield size={32} />;
    return <LayoutDashboard size={32} />;
};

// -----------------------------------------------------------------------------
// Components
// -----------------------------------------------------------------------------

const Sidebar = () => {
    const { activePillar, setActivePillar } = useContext(AppContext);
    const location = useLocation();

    const toggleAccordion = (id) => {
        setActivePillar(activePillar === id ? null : id);
    };

    // Auto-expand pillar based on current route
    useEffect(() => {
        NAVIGATION.Pillars.forEach(pillar => {
            const match = pillar.items.find(item => item.path === location.pathname);
            if (match) {
                setActivePillar(pillar.id);
            }
        });
    }, [location.pathname]);

    return (
        <aside className="sidebar">
            <div className="brand">
                <div className="brand-icon"><Layers size={24} /></div>
                Charity<span style={{ color: "var(--accent-emerald)" }}>Portal</span>
            </div>

            <div className="nav-scroll">
                {NAVIGATION.Pillars.map((pillar) => {
                    const isOpen = activePillar === pillar.id;
                    return (
                        <div key={pillar.id} className="nav-pillar">
                            <div
                                className={`pillar-header ${isOpen ? 'active' : ''}`}
                                onClick={() => toggleAccordion(pillar.id)}
                            >
                                <div className="pillar-title">
                                    <i>{pillar.icon}</i>
                                    {pillar.title}
                                </div>
                                {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </div>

                            <div className={`nav-items ${isOpen ? 'open' : ''}`}>
                                {pillar.items.map(item => {
                                    const isActive = location.pathname === item.path;
                                    return (
                                        <Link
                                            key={item.id}
                                            to={item.path}
                                            className={`nav-item ${isActive ? 'active' : ''}`}
                                        >
                                            {item.label}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </aside>
    );
};

const TopBar = () => {
    const { activePage, openApp } = useContext(AppContext);

    return (
        <header className="top-bar">
            <div className="context-badge">
                <div className="pulse-dot"></div>
                ACTIVE_CONTEXT // {activePage.toUpperCase()}
            </div>

            <div className="global-dock">
                {NAVIGATION.GlobalApps.map(app => (
                    <button
                        key={app.id}
                        className="dock-btn"
                        data-tip={app.label}
                        onClick={() => openApp(app.id)}
                    >
                        {app.icon}
                    </button>
                ))}
            </div>
        </header>
    );
};

// Context-Aware Sliding Drawer Output
const AppDrawer = () => {
    const { drawerOpen, closeDrawer, activeGlobalApp, activePage } = useContext(AppContext);
    const appData = NAVIGATION.GlobalApps.find(app => app.id === activeGlobalApp);

    return (
        <>
            <div className={`drawer-overlay ${drawerOpen ? 'open' : ''}`} onClick={closeDrawer}></div>
            <div className={`drawer ${drawerOpen ? 'open' : ''}`}>

                {appData && (
                    <div className="drawer-header">
                        <div className="drawer-title-group">
                            <h3 style={{ color: "var(--accent-cyan)" }}>
                                {appData.icon} {appData.label}
                            </h3>
                            <div className="drawer-subtitle">Complementary Application Plugin</div>
                        </div>
                        <button className="close-btn" onClick={closeDrawer}>
                            <X size={20} />
                        </button>
                    </div>
                )}

                <div className="drawer-content">
                    {appData ? (
                        <div className="system-card">
                            <div className="system-card-header">
                                <span>System Analytics</span>
                                <span>Context Ready</span>
                            </div>
                            <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem", fontSize: "0.95rem", lineHeight: 1.6 }}>
                                This is a structural placeholder for the <b>{appData.label}</b> application shell.
                                In Phase 2, this will load the functional app capable of deeply analyzing context.
                            </p>

                            <div className="code-block">
                                {`{
  "request": "${appData.label.toUpperCase()}_INIT",
  "status": "AWAITING_PHASE_2",
  "injected_context": {
    "current_module": "${activePage}",
    "timestamp": "${new Date().toISOString()}"
  },
  "action": "RENDER_PLACEHOLDER"
}`}
                            </div>

                            <div className="status-badge" style={{ marginTop: "2rem", width: "100%", justifyContent: "center" }}>
                                <span>Cross-Pollination Engine Standing By</span>
                            </div>
                        </div>
                    ) : (
                        <div>Loading Context...</div>
                    )}
                </div>
            </div>
        </>
    );
};

// Represents pages A1-C6
const PlaceholderView = ({ title, pillarName }) => {
    const { setActivePage } = useContext(AppContext);
    const location = useLocation();

    useEffect(() => {
        setActivePage(title);
    }, [title, setActivePage]);

    return (
        <div className="placeholder-card" key={location.pathname}>
            <div className="glow-circle"></div>
            <div className="placeholder-icon">
                {getIconForPath(location.pathname)}
            </div>
            <h2 className="placeholder-title">{title}</h2>
            <p className="placeholder-subtitle">
                Architectural shell verified. This interface route is stabilized and reserved for Phase 2 functional development of the {pillarName} module.
            </p>

            <div className="context-badge" style={{ marginTop: "3rem", background: "transparent", border: "1px solid var(--border-active)" }}>
                <span className="pulse-dot"></span>
                Route Node Established
            </div>
        </div>
    );
};

const DashboardHome = () => {
    const { setActivePage } = useContext(AppContext);

    useEffect(() => {
        setActivePage("Global Overview");
    }, [setActivePage]);

    return (
        <div className="hero-welcome">
            <div className="context-badge" style={{ marginBottom: "2rem" }}>
                System Online
            </div>
            <h1>
                Welcome to the <br />
                <span>Charity Portal OS</span>
            </h1>
            <p>
                Phase 1 constraints acknowledged. The dashboard architectural shell, strict routing,
                and fluid UI navigation frameworks have been fully established. Zero complex logic exists here yet.
                Select a pillar from the sidebar or access global apps via the utility dock to explore the wireframes.
            </p>
        </div>
    );
};

// Main Layout
const Layout = () => {
    return (
        <div className="app-container">
            <Sidebar />
            <main className="main-wrapper">
                <TopBar />
                <div className="content-area">
                    <Routes>
                        <Route path="/" element={<DashboardHome />} />
                        {NAVIGATION.Pillars.flatMap(pillar =>
                            pillar.items.map(item => (
                                <Route
                                    key={item.id}
                                    path={item.path}
                                    element={<PlaceholderView title={item.label} pillarName={pillar.title} />}
                                />
                            ))
                        )}
                    </Routes>
                </div>
                <AppDrawer />
            </main>
        </div>
    );
};

const App = () => (
    <AppProvider>
        <HashRouter>
            <Layout />
        </HashRouter>
    </AppProvider>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
