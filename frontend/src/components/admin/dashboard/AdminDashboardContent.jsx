"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, BookOpen, Activity, Award, Loader2, TrendingUp, BarChart3, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { adminService } from '../../../services/admin.service';

export default function AdminDashboardContent() {
  const [dashboardData, setDashboardData] = useState({
    summary: {
      totalUsers: 0, totalAuthors: 0, totalQuizzes: 0, activeQuizzes: 0,
      totalAttempts: 0, globalAverageScore: 0, passRatePercentage: 0, avgDurationMinutes: 0
    },
    charts: { popularQuizzes: [], engagementTrend: [] },
    recentActivity: []
  });
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await adminService.getDashboardStats();
      if (response.success) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error("Gagal mengambil data dashboard:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Utility format waktu ("2 jam yang lalu", "5 menit yang lalu", dll)
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.round((now - date) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);

    if (seconds < 60) return `${seconds} detik yang lalu`;
    if (minutes < 60) return `${minutes} menit yang lalu`;
    if (hours < 24) return `${hours} jam yang lalu`;
    if (days === 1) return `Kemarin`;
    return `${days} hari yang lalu`;
  };

  const { summary, charts, recentActivity } = dashboardData;

  // Tampilan Loading Spinner
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-brand-500 animate-spin mb-4" />
        <p className="text-slate-500 font-medium animate-pulse">Menyiapkan analitik global...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Ikhtisar Global Sistem</h2>
          <p className="text-slate-500 text-sm">Pantau metrik utama, tren, dan aktivitas platform secara real-time.</p>
        </div>
        <div className="flex items-center gap-2 bg-white/40 backdrop-blur-md border border-white/60 px-4 py-2 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
          <Clock className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-semibold text-slate-600">Rata-rata durasi kuis: <span className="text-brand-600">{summary.avgDurationMinutes} mnt</span></span>
        </div>
      </div>

      {/* 1. Quick Stats Cards (Deep Glassmorphism) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Pengguna */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="bg-white/40 backdrop-blur-xl p-6 rounded-[1.5rem] border border-white/60 flex items-start justify-between group hover:-translate-y-1 transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_48px_rgba(16,185,129,0.08)]">
          <div>
            <p className="text-sm font-semibold text-slate-500 mb-1">Total Pengguna</p>
            <h3 className="text-3xl font-black text-slate-800 tracking-tight">{summary.totalUsers}</h3>
            <p className="text-xs font-medium text-emerald-600 mt-2 flex items-center gap-1">
              <span className="bg-emerald-500/10 px-1.5 py-0.5 rounded-md border border-emerald-500/20">{summary.totalAuthors} Instruktur</span>
            </p>
          </div>
          <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm border border-brand-100">
             <Users className="w-6 h-6" /> 
          </div>
        </motion.div>

        {/* Total Kuis */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="bg-white/40 backdrop-blur-xl p-6 rounded-[1.5rem] border border-white/60 flex items-start justify-between group hover:-translate-y-1 transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_48px_rgba(14,165,233,0.08)]">
          <div>
            <p className="text-sm font-semibold text-slate-500 mb-1">Total Kuis</p>
            <h3 className="text-3xl font-black text-slate-800 tracking-tight">{summary.totalQuizzes}</h3>
            <p className="text-xs font-medium text-sky-600 mt-2 flex items-center gap-1">
              <span className="bg-sky-500/10 px-1.5 py-0.5 rounded-md border border-sky-500/20">{summary.activeQuizzes} Aktif (Publish)</span>
            </p>
          </div>
          <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm border border-sky-100">
             <BookOpen className="w-6 h-6" /> 
          </div>
        </motion.div>

        {/* Total Pengerjaan */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }} className="bg-white/40 backdrop-blur-xl p-6 rounded-[1.5rem] border border-white/60 flex items-start justify-between group hover:-translate-y-1 transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_48px_rgba(99,102,241,0.08)]">
          <div>
            <p className="text-sm font-semibold text-slate-500 mb-1">Total Percobaan</p>
            <h3 className="text-3xl font-black text-slate-800 tracking-tight">{summary.totalAttempts}</h3>
            <p className="text-xs font-medium text-indigo-600 mt-2 flex items-center gap-1">
              <span className="bg-indigo-500/10 px-1.5 py-0.5 rounded-md border border-indigo-500/20">Seluruh Platform</span>
            </p>
          </div>
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm border border-indigo-100">
             <Activity className="w-6 h-6" /> 
          </div>
        </motion.div>

        {/* Tingkat Kelulusan */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }} className="bg-white/40 backdrop-blur-xl p-6 rounded-[1.5rem] border border-white/60 flex items-start justify-between group hover:-translate-y-1 transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_48px_rgba(249,115,22,0.08)]">
          <div>
            <p className="text-sm font-semibold text-slate-500 mb-1">Rata-rata Kelulusan</p>
            <h3 className="text-3xl font-black text-slate-800 tracking-tight">{summary.passRatePercentage}%</h3>
            <p className="text-xs font-medium text-orange-600 mt-2 flex items-center gap-1">
              <span className="bg-orange-500/10 px-1.5 py-0.5 rounded-md border border-orange-500/20">Skor rata-rata: {summary.globalAverageScore}</span>
            </p>
          </div>
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm border border-orange-100">
             <Award className="w-6 h-6" /> 
          </div>
        </motion.div>

      </div>

      {/* 2. Area Grafik Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.5 }} className="lg:col-span-2 bg-white/40 backdrop-blur-xl border border-white/60 rounded-[2rem] p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.04)] relative overflow-hidden flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-2">Tren Partisipasi (7 Hari Terakhir)</h3>
          <p className="text-sm text-slate-500 mb-6">Tingkat pengerjaan kuis dari waktu ke waktu secara global.</p>
          <div className="flex-1 min-h-[250px] bg-white/50 rounded-xl border border-dashed border-brand-200 flex flex-col items-center justify-center text-center p-6 shadow-inner">
             <TrendingUp className="w-10 h-10 text-brand-300 mb-3" />
             <p className="text-slate-600 font-medium">Area Integrasi Line Chart</p>
             <p className="text-slate-400 text-xs mt-1">Data: <code className="bg-white/80 px-1 rounded text-pink-500">charts.engagementTrend</code></p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.6 }} className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[2rem] p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.04)] relative overflow-hidden flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-2">Kuis Teratas</h3>
          <p className="text-sm text-slate-500 mb-6">Berdasarkan volume partisipasi tertinggi.</p>
          <div className="flex-1 min-h-[250px] bg-white/50 rounded-xl border border-dashed border-sky-200 flex flex-col items-center justify-center text-center p-6 shadow-inner">
             <BarChart3 className="w-10 h-10 text-sky-300 mb-3" />
             <p className="text-slate-600 font-medium">Area Integrasi Bar Chart</p>
             <p className="text-slate-400 text-xs mt-1">Data: <code className="bg-white/80 px-1 rounded text-pink-500">charts.popularQuizzes</code></p>
          </div>
        </motion.div>
      </div>

      {/* 3. RECENT ACTIVITY TABLE */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.7 }} className="mt-6 bg-white/40 backdrop-blur-xl border border-white/60 rounded-[2rem] p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.04)] overflow-hidden relative">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Aktivitas Pengerjaan Terbaru</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-200/50 bg-slate-50/40 text-[12px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-4 pl-6 font-semibold">Peserta</th>
                <th className="py-4 px-4 font-semibold">Kuis</th>
                <th className="py-4 px-4 text-center font-semibold">Skor</th>
                <th className="py-4 px-4 font-semibold">Status</th>
                <th className="py-4 pr-6 text-right font-semibold">Waktu</th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <tr key={activity.attemptId} className="border-b border-slate-100/50 hover:bg-white/60 transition-colors group">
                    <td className="py-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center text-xs font-bold border border-brand-100 shadow-sm">
                          {activity.participantName.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="font-semibold text-slate-800 text-[13px] group-hover:text-brand-600 transition-colors">{activity.participantName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-600 text-[13px]">{activity.quizTitle}</td>
                    <td className="py-4 px-4 text-center">
                      <span className="font-bold text-slate-800 text-[14px]">{activity.score}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[12px] font-bold ${activity.status === 'Lulus' ? 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20' : 'bg-red-500/10 text-red-700 border border-red-500/20'}`}>
                        {activity.status === 'Lulus' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        {activity.status}
                      </div>
                    </td>
                    <td className="py-4 pr-6 text-right text-[12px] font-medium text-slate-400">
                      {formatTimeAgo(activity.timeAgo)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-500 text-sm">Belum ada aktivitas pengerjaan kuis.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

    </div>
  );
}