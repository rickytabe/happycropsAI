import { ReactNode, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';

interface DashboardLayoutProps {
  children: ReactNode;
  isOffline: boolean;
  onLogout: () => void;
}

export const DashboardLayout = ({ children, isOffline, onLogout }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { name: "Intelligence", icon: "analytics", path: "/dashboard", end: true },
    { name: "Diagnostics", icon: "biotech", path: "/dashboard/diagnostics", end: false },
    { name: "Activity", icon: "history", path: "/dashboard/activity", end: false },
    { name: "Settings", icon: "settings", path: "/dashboard/settings", end: false },
  ];

  const isActive = (item: typeof navItems[0]) =>
    item.name === "Diagnostics"
      ? location.pathname.startsWith('/dashboard/diagnostic')
      : item.end
        ? location.pathname === item.path
        : location.pathname.startsWith(item.path);

  return (
    <div className="bg-background text-on-surface font-body min-h-screen selection:bg-primary/30 selection:text-primary">

      {/* ── Top App Bar ─────────────────────────────────────────── */}
      <header className="fixed top-0 right-0 w-full md:w-[calc(100%-16rem)] z-30 bg-background/50 md:bg-transparent backdrop-blur-md md:backdrop-blur-lg flex justify-between items-center px-4 md:px-10 h-16 md:h-20 border-b border-white/5 md:border-none transition-all">
        <div className="flex items-center gap-3">
          {/* Hamburger — mobile only */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 -ml-1 text-slate-300 hover:text-primary transition-colors"
            aria-label="Open menu"
          >
            <span className="material-symbols-outlined text-2xl">menu</span>
          </button>
          <span className="md:hidden font-headline italic text-xl text-primary font-bold tracking-tighter">HappyCrops AI</span>

          {/* Online badge — desktop only */}
          <div className="hidden md:flex items-center gap-2 ml-4 px-3 py-1 bg-surface-container-lowest rounded-full border border-outline-variant/15">
            <span className={cn("w-2 h-2 rounded-full animate-pulse", isOffline ? "bg-amber-500" : "bg-primary")}></span>
            <span className={cn("text-xs font-label uppercase tracking-widest", isOffline ? "text-amber-500" : "text-on-surface-variant")}>
              {isOffline ? "Offline Mode" : "Live AI Network Active"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <button className="text-slate-300 hover:text-primary transition-colors">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>notifications</span>
          </button>
          <button onClick={onLogout} title="Log Out" className="text-slate-300 hover:text-red-400 transition-colors">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>logout</span>
          </button>
        </div>
      </header>

      {/* ── Mobile Sidebar Overlay ───────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 flex"
          onClick={() => setSidebarOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Drawer panel */}
          <nav
            className="relative w-72 max-w-[85vw] h-full bg-[#0c1512] border-r border-white/10 flex flex-col py-8 gap-6 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Close + Branding */}
            <div className="px-6 flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center border border-outline-variant/15 overflow-hidden">
                  <img alt="HappyCrops AI" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVltvsmDoV3tZLLyVyhcNXyIN7tDNAW_v1ODAVK5ubsPO0R_EaqpaNr3ghWRZ7VLSXAdqRc_qa37yM_6vqHZAjaEMMWgYpmz7BNZ-EAQKblKk37PnxjA3tzIkHCi9MyxaRUWa1Zcy2wcZoo6Bs973loIxGoGC10r08UzjTAizJ5TaSWM07d-HkcxlH5esQMt_RbYlTv6v50E77SjwW_G1u_vQ8gtUNC6-ZDfpPk16wvCCEZYpY97lT5_r-6Z6DO-wour7gaxpf8zVt" />
                </div>
                <div>
                  <span className="font-headline text-lg font-bold text-primary italic leading-tight block">HappyCrops AI</span>
                  <span className="text-[10px] text-on-surface-variant font-label uppercase tracking-widest">Digital Crop Expert</span>
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white p-1">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Nav Links */}
            <div className="flex flex-col px-4 gap-1 flex-grow">
              {navItems.map(item => {
                const active = isActive(item);
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 text-sm font-medium",
                      active ? "text-primary bg-primary/10 font-bold" : "text-slate-400 hover:text-primary hover:bg-primary/5"
                    )}
                  >
                    <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}>{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* New Diagnostic CTA */}
            <div className="px-5">
              <button
                onClick={() => { navigate('/dashboard'); setSidebarOpen(false); }}
                className="w-full bg-primary text-black py-3 rounded-full font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_20px_rgba(166,215,0,0.15)]"
              >
                <span className="material-symbols-outlined text-xl">add</span>
                New Diagnostic
              </button>
            </div>
          </nav>
        </div>
      )}

      {/* ── Desktop Sidebar ──────────────────────────────────────── */}
      <nav className="hidden md:flex flex-col w-64 fixed left-0 top-0 z-40 bg-[#0c1512] border-r border-[#ffffff0a] shadow-[20px_0_40px_-15px_rgba(7,16,13,0.5)] h-full py-8 gap-6 font-medium tracking-tight">
        <div className="px-8 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center overflow-hidden border border-outline-variant/15">
              <img alt="User profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVltvsmDoV3tZLLyVyhcNXyIN7tDNAW_v1ODAVK5ubsPO0R_EaqpaNr3ghWRZ7VLSXAdqRc_qa37yM_6vqHZAjaEMMWgYpmz7BNZ-EAQKblKk37PnxjA3tzIkHCi9MyxaRUWa1Zcy2wcZoo6Bs973loIxGoGC10r08UzjTAizJ5TaSWM07d-HkcxlH5esQMt_RbYlTv6v50E77SjwW_G1u_vQ8gtUNC6-ZDfpPk16wvCCEZYpY97lT5_r-6Z6DO-wour7gaxpf8zVt"/>
            </div>
            <div className="flex flex-col">
              <span className="font-headline text-xl font-bold text-primary italic leading-tight">HappyCrops AI</span>
              <span className="text-xs text-on-surface-variant font-label uppercase tracking-widest mt-1">Digital Crop Expert</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col px-4 gap-2 flex-grow mt-4">
          {navItems.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-r-full transition-all duration-300",
                  active ? "text-primary bg-primary/10 font-bold" : "text-slate-400 hover:text-primary hover:bg-primary/5"
                )}
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
        <div className="px-6 mt-auto">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-primary text-black py-3 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-primary-fixed transition-colors shadow-[0_0_20px_rgba(166,215,0,0.15)] hover:scale-105 active:scale-95"
          >
            <span className="material-symbols-outlined text-xl">add</span>
            New Diagnostic
          </button>
        </div>
      </nav>

      {/* ── Main Content ─────────────────────────────────────────── */}
      <main className="md:ml-64 pt-16 md:pt-20 pb-8 md:pb-20 min-h-screen relative">
        <div className="relative z-10 w-full mx-auto px-3 md:px-10 pt-7">
          {children}
        </div>
      </main>
    </div>
  );
};
