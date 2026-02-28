"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, ChevronLeft, ChevronRight, LogOut, Bell } from "lucide-react";
import { getMenuItems } from "../../../utils/navigation";

export default function DashboardShell({ children, role = "ADMIN", currentPath = "/admin/dashboard" }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const menuItems = getMenuItems(role);

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined" && window.innerWidth >= 1024) {
        setIsMobileOpen(false);
      }
    };
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
          onClick={() => setIsCollapsed(!isCollapsed)}
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
        <header className="h-15 bg-white/50 backdrop-blur-lg border-b border-slate-200/60 shadow-[0_4px_24px_rgba(0,0,0,0.02)] z-30 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileOpen(true)} className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors" aria-label="Open menu">
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold text-slate-800 capitalize hidden sm:block">{currentPath.split("/").pop().replace("-", " ")}</h1>
          </div>

          <div className="flex items-center gap-5">
            <button className="relative p-2 text-slate-400 hover:text-brand-500 transition-colors" aria-label="Notifications">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="flex items-center gap-3 pl-5 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-[13px] font-bold text-slate-800">Admin Qurio</p>
                <p className="text-[11px] text-slate-500 font-medium tracking-wide">Administrator</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-brand-400 to-teal-500 p-0.5 shadow-sm">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <span className="text-brand-600 font-bold text-sm">AQ</span>
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
            transition={{ 
              duration: 0.5, 
              ease: [0.25, 0.1, 0.25, 1],  
              delay: 0.1 
            }}
            className="w-full h-full"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}