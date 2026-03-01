"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { Calendar } from "lucide-react";
import { getMenuItems } from "../../../utils/navigation";

export default function DashboardShell({ children, role = "ADMIN", currentPath = "/admin/dashboard" }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const menuItems = getMenuItems(role);
  const [userData, setUserData] = useState({ name: 'Memuat...', role: role });
  const [greeting, setGreeting] = useState('Selamat Datang');
  const [currentDate, setCurrentDate] = useState('');
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const getInitials = (name) => {
    if (!name || name === 'Memuat...') return 'U';
    const words = name.split(' ');
    if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      const savedState = localStorage.getItem("qurio_sidebar_collapsed");
      return savedState === "true"; 
    }
    return false;
  });

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const newState = !prev;
      if (typeof window !== "undefined") {
        localStorage.setItem("qurio_sidebar_collapsed", String(newState));
      }
      return newState;
    });
  };

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };
  
  const confirmLogout = () => {
    localStorage.removeItem('token'); 
    localStorage.removeItem('user');
    window.location.href = '/auth/login'; 
  };
  
  useEffect(() => {
    const initDashboard = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) setGreeting('Selamat Pagi');
      else if (hour >= 12 && hour < 15) setGreeting('Selamat Siang');
      else if (hour >= 15 && hour < 18) setGreeting('Selamat Sore');
      else setGreeting('Selamat Malam');

      setCurrentDate(new Date().toLocaleDateString('id-ID', { 
        weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' 
      }));

      try {
        const storedUser = localStorage.getItem('qurio_user'); 
        if (storedUser) {
          setUserData(JSON.parse(storedUser));
        }
      } catch (e) {
        console.error("Gagal mengambil data user", e);
      }
    };

    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsMobileOpen(false);
    };

    initDashboard();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const renderSidebar = (collapsed, prefix) => (
    <div className="flex flex-col h-full">
      <div className={`h-15 flex items-center justify-center border-b border-slate-200/50 transition-all duration-300`}>
        <img
          src="/qurio.png"
          alt="Qurio Logo"
          className={`transition-all duration-300 object-contain ${collapsed ? "h-15 w-15" : "h-15 w-auto"}`}
        />
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1.5 scrollbar-hide">
        {menuItems.map((item) => {
          const normalizedCurrent = currentPath.replace(/\/$/, "");
          const normalizedMenu = item.path.replace(/\/$/, "");
          const isQuizSection = normalizedMenu.includes('/admin/quizzes') && normalizedCurrent.includes('/admin/quizzes');
          const isDashboard = normalizedMenu === '/admin/dashboard' || normalizedMenu === '/author/dashboard';

          const isActive = 
            normalizedCurrent === normalizedMenu || 
            isQuizSection || 
            (!isDashboard && normalizedCurrent.startsWith(normalizedMenu));

          const Icon = item.icon;

          return (
            <a
              key={item.path}
              href={item.path}
              className={`relative flex items-center py-3 rounded-xl transition-all duration-300 group ${
                collapsed ? "justify-center px-0" : "px-3"
              } ${
                isActive ? "text-brand-600 bg-brand-50/80 font-semibold" : "text-slate-500 hover:bg-slate-100/50 hover:text-slate-800"
              }`}
              title={collapsed ? item.title : ""}
              aria-current={isActive ? "page" : undefined}
            >
              {isActive && (
                <motion.span
                  layoutId={`indicator-${prefix}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-brand-500 rounded-r-full"
                />
              )}

              <Icon 
                className={`w-5 h-5 shrink-0 transition-all duration-300 ${isActive ? "text-brand-500" : "text-slate-400 group-hover:text-slate-600"}`} 
                aria-hidden 
              />
              
              <span 
                className={`text-[14px] whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${
                  collapsed ? "w-0 opacity-0 ml-0" : "w-35 opacity-100 ml-3"
                }`}
              >
                {item.title}
              </span>
            </a>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-200/50">
        <button 
          onClick={handleLogoutClick} 
          className={`w-full flex items-center py-2.5 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300 group ${
            collapsed ? "justify-center px-0" : "px-3"
          }`}
        >
          <LogOut className={`w-5 h-5 shrink-0 group-hover:text-red-500 transition-colors`} />
          <span 
            className={`text-[14px] font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${
              collapsed ? "w-0 opacity-0 ml-0" : "w-35 opacity-100 ml-3"
            }`}
          >
            Keluar
          </span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">
      
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 88 : 260 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="hidden lg:block z-40 bg-white/60 backdrop-blur-xl border-r border-slate-200/60 shadow-[4px_0_24px_rgba(0,0,0,0.02)] relative"
        aria-hidden={false}
      >
        {renderSidebar(isCollapsed, "desktop")}

        <button
          onClick={toggleSidebar}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="absolute -right-3 top-24 bg-white border border-slate-200 text-slate-400 hover:text-brand-500 rounded-full p-1.5 shadow-sm transition-colors z-50 flex items-center justify-center"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </motion.aside>

      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsMobileOpen(false)} 
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden" 
            />
            <motion.aside 
              initial={{ x: "-100%" }} 
              animate={{ x: 0 }} 
              exit={{ x: "-100%" }} 
              transition={{ type: "spring", stiffness: 300, damping: 30 }} 
              className="fixed inset-y-0 left-0 w-65 bg-white/80 backdrop-blur-2xl border-r border-slate-200/60 shadow-2xl z-50 lg:hidden"
            >
              {renderSidebar(false, "mobile")}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="h-16 bg-white/50 backdrop-blur-lg border-b border-slate-200/60 shadow-[0_4px_24px_rgba(0,0,0,0.02)] z-30 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0">
          
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileOpen(true)} className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors" aria-label="Open menu">
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-slate-800 capitalize leading-tight">
                {currentPath.split("/").pop().replace("-", " ")}
              </h1>
              <p className="text-[12px] text-slate-500 font-medium mt-0.5">
                {greeting}, siap untuk hari ini?
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-50/80 rounded-lg border border-slate-200/60 shadow-inner">
               <Calendar className="w-4 h-4 text-brand-500" />
               <span className="text-[12px] font-semibold text-slate-600">
                 {currentDate}
               </span>
            </div>

            <div className="flex items-center gap-3 pl-0 md:pl-6 md:border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-[13px] font-bold text-slate-800 max-w-30 truncate">{userData.name}</p>
                <p className="text-[11px] text-brand-600 font-bold tracking-wider uppercase">
                  {userData.role === 'ADMIN' ? 'Administrator' : userData.role === 'AUTHOR' ? 'Instruktur' : 'Siswa'}
                </p>
              </div>
              
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-brand-400 to-teal-500 p-0.5 shadow-sm shrink-0 hover:scale-105 transition-transform cursor-pointer">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <span className="text-brand-600 font-bold text-sm">
                    {getInitials(userData.name)}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative">
          <div className="absolute top-0 right-0 w-125 h-125 bg-brand-50/50 rounded-full blur-[120px] pointer-events-none -z-10 mix-blend-multiply"></div>
          
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 }}
            className="w-full h-full"
          >
            {children}
          </motion.div>
        </main>
      </div>

      <AnimatePresence>
        {isLogoutModalOpen && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLogoutModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm cursor-pointer"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-100 bg-white/90 backdrop-blur-2xl border border-white/80 rounded-4xl p-8 shadow-2xl overflow-hidden"
            >
               <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

               <div className="flex flex-col items-center text-center relative z-10">
                  <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-5 shadow-sm border border-red-100">
                     <LogOut className="w-7 h-7 ml-1" />
                  </div>
                  
                  <h3 className="text-xl font-black text-slate-800 mb-2">Keluar dari Dashboard?</h3>
                  <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                    Sesi Anda akan diakhiri. Anda harus memasukkan username dan password kembali untuk mengakses panel ini.
                  </p>

                  <div className="flex items-center w-full gap-3">
                     <button
                       onClick={() => setIsLogoutModalOpen(false)}
                       className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-colors"
                     >
                       Batal
                     </button>
                     <button
                       onClick={confirmLogout}
                       className="flex-1 py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors shadow-lg shadow-red-500/20"
                     >
                       Ya, Keluar
                     </button>
                  </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}