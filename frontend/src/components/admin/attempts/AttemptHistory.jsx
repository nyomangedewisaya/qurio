"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Clock, CheckCircle2, Loader2, Eye, ChevronLeft, ChevronRight, Award } from 'lucide-react';
import { adminService } from '../../../services/admin.service';
import { ToastProvider, useToast } from '../../../contexts/ToastContext';

function AttemptHistoryContent() {
  const { showToast } = useToast();
  const [attempts, setAttempts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 1000);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => { setCurrentPage(1); }, [statusFilter]);
  useEffect(() => { fetchAttempts(); }, [currentPage, debouncedSearch, statusFilter]);

  const fetchAttempts = async () => {
    setIsLoading(true);
    try {
      const result = await adminService.getAttempts(currentPage, itemsPerPage, debouncedSearch, statusFilter);
      setAttempts(result.data);
      setTotalPages(result.pagination.totalPages);
      setTotalItems(result.pagination.totalItems);
    } catch (error) {
      showToast(error.message || "Gagal memuat riwayat.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'COMPLETED') {
      return <span className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold uppercase rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200/50"><CheckCircle2 className="w-3.5 h-3.5"/> Selesai</span>;
    }
    return <span className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold uppercase rounded-lg bg-amber-50 text-amber-600 border border-amber-200/50"><Clock className="w-3.5 h-3.5"/> Mengerjakan</span>;
  };

  const getScoreStyle = (score) => {
    if (score === null || score === undefined) return { text: 'text-slate-400', bg: 'bg-slate-50', border: 'border-slate-200' };
    if (score >= 80) return { text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' };
    if (score >= 60) return { text: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-200' };
    if (score >= 40) return { text: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200' };
    return { text: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200' };
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">Riwayat & Hasil Ujian</h2>
          <p className="text-slate-500 text-sm">Pantau aktivitas pengerjaan kuis seluruh pengguna secara real-time.</p>
        </div>
      </div>

      <div className="bg-white/40 backdrop-blur-xl p-4 rounded-3xl border border-white/60 flex flex-col md:flex-row gap-4 shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
        <div className="relative flex-1 group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-500 transition-colors">
            <Search className="w-4 h-4" />
          </div>
          <input type="text" placeholder="Cari nama siswa atau judul kuis..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white/60 border border-slate-200/80 rounded-xl text-sm focus:border-brand-500 outline-none transition-all shadow-sm" />
        </div>
        <div className="relative min-w-50 group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-500 transition-colors">
            <Filter className="w-4 h-4" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full pl-10 pr-8 py-2.5 bg-white/60 border border-slate-200/80 rounded-xl text-sm outline-none appearance-none font-semibold cursor-pointer text-slate-700 shadow-sm focus:border-brand-500">
            <option value="ALL">Semua Status</option>
            <option value="COMPLETED">Selesai (Completed)</option>
            <option value="IN_PROGRESS">Sedang Mengerjakan</option>
          </select>
        </div>
      </div>

      <div className="space-y-3 relative min-h-100">
        <AnimatePresence>
          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-10 bg-white/30 backdrop-blur-sm flex items-center justify-center rounded-4xl">
              <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
            </motion.div>
          )}
        </AnimatePresence>

        {!isLoading && attempts.length > 0 ? (
          attempts.map((attempt, idx) => {
            const status = attempt.completedAt ? 'COMPLETED' : 'IN_PROGRESS';

            return (
              <motion.div key={attempt.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-[1.25rem] p-4 sm:p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-brand-200/60 transition-all flex flex-col sm:flex-row items-start sm:items-center group">
                
                <div className="flex items-start justify-between w-full sm:w-62.5 shrink-0 sm:pr-5">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center font-bold border border-brand-100 shrink-0">
                      {attempt.participant?.name?.substring(0, 2).toUpperCase() || 'U'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate group-hover:text-brand-600 transition-colors">{attempt.participant?.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">@{attempt.participant?.username}</p>
                    </div>
                  </div>
                  <div className="sm:hidden mt-0.5">
                    {getStatusBadge(status)}
                  </div>
                </div>

                <div className="h-px w-full bg-slate-200/60 sm:hidden my-3"></div>

                <div className="flex-1 min-w-0 w-full sm:border-l border-slate-200/60 sm:px-5">
                  <p className="text-[11px] font-bold text-slate-400 uppercase mb-0.5 tracking-wider">KODE: {attempt.quiz?.quizCode}</p>
                  <p className="text-sm font-semibold text-slate-700 line-clamp-2 sm:truncate">{attempt.quiz?.title}</p>
                  <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-500">
                    <Clock className="w-3.5 h-3.5" /> {formatDate(attempt.startedAt)}
                  </div>
                </div>

                <div className="h-px w-full bg-slate-200/60 sm:hidden my-3"></div>

                <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                  <div className="hidden sm:block mr-2">
                    {getStatusBadge(status)}
                  </div>
                  
                  {status === 'COMPLETED' ? (
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-bold shadow-sm ${getScoreStyle(attempt.score).bg} ${getScoreStyle(attempt.score).border} ${getScoreStyle(attempt.score).text}`}>
                      <Award className="w-4 h-4" />
                      <span className="text-base">{attempt.score !== null ? attempt.score : 0}</span>
                    </div>
                  ) : (
                    <div className="text-[12px] font-medium text-slate-400 italic px-2">
                      Belum dinilai
                    </div>
                  )}
                  
                  <a href={`/admin/attempts/${attempt.id}`} className="px-4 py-2 bg-slate-50 hover:bg-brand-50 border border-slate-200 hover:border-brand-200 text-slate-600 hover:text-brand-600 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm font-bold shrink-0">
                    <span>Detail</span>
                    <Eye className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            )
          })
        ) : !isLoading && attempts.length === 0 ? (
          <div className="text-center py-16 bg-white/40 backdrop-blur-xl rounded-4xl border border-white/60">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <Clock className="w-8 h-8" />
            </div>
            <p className="text-slate-700 font-bold text-lg">Tidak ada riwayat</p>
            <p className="text-slate-500 text-sm mt-1">Belum ada peserta yang mengerjakan kuis atau tidak ada yang cocok dengan filter.</p>
          </div>
        ) : null}
      </div>

      {!isLoading && totalItems > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)] mt-6">
           <span className="text-[13px] text-slate-500 font-semibold">
             Menampilkan <span className="text-slate-800">{((currentPage - 1) * itemsPerPage) + 1}</span> - <span className="text-slate-800">{Math.min(currentPage * itemsPerPage, totalItems)}</span> dari <span className="text-slate-800">{totalItems}</span> riwayat
           </span>
           <div className="flex items-center gap-2">
             <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-1.5 rounded-lg text-slate-500 hover:bg-white/60 hover:text-brand-600 disabled:opacity-40 disabled:hover:bg-transparent">
               <ChevronLeft className="w-5 h-5" />
             </button>
             <div className="flex items-center gap-1">
               {Array.from({ length: totalPages }).map((_, i) => (
                 <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-8 h-8 rounded-lg text-[13px] font-bold transition-all ${currentPage === i + 1 ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20' : 'text-slate-500 hover:bg-white/60 hover:text-slate-800'}`}>
                   {i + 1}
                 </button>
               ))}
             </div>
             <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0} className="p-1.5 rounded-lg text-slate-500 hover:bg-white/60 hover:text-brand-600 disabled:opacity-40 disabled:hover:bg-transparent">
               <ChevronRight className="w-5 h-5" />
             </button>
           </div>
        </div>
      )}

    </div>
  );
}

export default function AttemptHistory() {
  return (
    <ToastProvider>
      <AttemptHistoryContent />
    </ToastProvider>
  );
}