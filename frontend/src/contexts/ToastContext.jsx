"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, X } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-6 right-6 sm:top-8 sm:right-8 z-200 flex flex-col items-end gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              className={`pointer-events-auto flex items-center gap-3 px-4 py-3 w-auto min-w-[320px] max-w-112.5 rounded-xl shadow-xl backdrop-blur-xl border ${
                toast.type === 'success' 
                  ? 'bg-emerald-50/90 border-emerald-200/50 shadow-emerald-500/10' 
                  : 'bg-red-50/90 border-red-200/50 shadow-red-500/10'
              }`}
            >
              {toast.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500 shrink-0" />
              )}
              
              <div className="flex flex-row items-center gap-2 flex-1 overflow-hidden">
                <span className={`text-[13px] font-medium leading-tight line-clamp-2 ${toast.type === 'success' ? 'text-emerald-600' : 'text-red-600'}`}>
                  {toast.message}
                </span>
              </div>
              
              <button 
                onClick={() => removeToast(toast.id)}
                className={`p-1.5 rounded-lg shrink-0 transition-colors ${
                  toast.type === 'success' 
                    ? 'hover:bg-emerald-100 text-emerald-500/70 hover:text-emerald-600' 
                    : 'hover:bg-red-100 text-red-500/70 hover:text-red-600'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};