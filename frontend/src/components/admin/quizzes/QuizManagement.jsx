"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Trash2, Filter, BookOpen, Clock, Users, FileQuestion, AlertTriangle, Eye, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { adminService } from '../../../services/admin.service';
import { ToastProvider, useToast } from '../../../contexts/ToastContext';

function QuizManagementContent() {
  const { showToast } = useToast();

  const [quizzes, setQuizzes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Pagination State
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; 

  // Filter & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState(null);

  // Debounce Search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 800);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => { setCurrentPage(1); }, [statusFilter]);
  useEffect(() => { fetchQuizzes(); }, [currentPage, debouncedSearch, statusFilter]);

  const fetchQuizzes = async () => {
    setIsLoading(true);
    try {
      const result = await adminService.getQuizzes(currentPage, itemsPerPage, debouncedSearch, statusFilter);
      setQuizzes(result.data);
      setTotalPages(result.pagination.totalPages);
      setTotalItems(result.pagination.totalItems);
    } catch (error) {
      showToast(error.message || "Gagal memuat daftar kuis.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!quizToDelete) return;
    try {
      await adminService.forceDeleteQuiz(quizToDelete.id);
      showToast(`Kuis "${quizToDelete.title}" berhasil dihapus paksa.`, 'success');
      setIsDeleteModalOpen(false);
      setQuizToDelete(null);
      if (quizzes.length === 1 && currentPage > 1) setCurrentPage(p => p - 1);
      else fetchQuizzes();
    } catch (error) {
      showToast(`Gagal menghapus kuis: ${error.message}`, 'error');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const words = name.trim().split(/\s+/);
    if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'PUBLISHED': 
        return <span className="px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider rounded-lg border bg-emerald-50 text-emerald-600 border-emerald-200/50">PUBLISHED</span>;
      case 'DRAFT': 
        return <span className="px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider rounded-lg border bg-slate-100 text-slate-500 border-slate-200/60">DRAFT</span>;
      case 'INACTIVE': 
        return <span className="px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider rounded-lg border bg-amber-50 text-amber-600 border-amber-200/50">INACTIVE</span>;
      case 'ARCHIVED': 
        return <span className="px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider rounded-lg border bg-purple-50 text-purple-600 border-purple-200/50">ARCHIVED</span>;
      default: 
        return <span className="px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider rounded-lg border bg-slate-100 text-slate-500 border-slate-200/60">{status}</span>;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">Manajemen Kuis Global</h2>
          <p className="text-slate-500 text-sm">Pantau dan kelola seluruh kuis yang dibuat oleh instruktur.</p>
        </div>
      </div>

      <div className="bg-white/40 backdrop-blur-xl p-4 rounded-3xl border border-white/60 flex flex-col md:flex-row gap-4 shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
        <div className="relative flex-1 group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-500 transition-colors">
            <Search className="w-4 h-4" />
          </div>
          <input type="text" placeholder="Cari judul atau kode kuis..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white/60 border border-slate-200/80 rounded-xl text-sm focus:border-brand-500 outline-none transition-all shadow-sm" />
        </div>
        <div className="relative group min-w-50">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-500 transition-colors">
            <Filter className="w-4 h-4" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full pl-10 pr-8 py-2.5 bg-white/60 border border-slate-200/80 rounded-xl text-sm focus:border-brand-500 outline-none appearance-none font-semibold cursor-pointer shadow-sm text-slate-700">
            <option value="ALL">Semua Status</option>
            <option value="PUBLISHED">Aktif (Published)</option>
            <option value="DRAFT">Konsep (Draft)</option>
            <option value="INACTIVE">Nonaktif (Inactive)</option>
            <option value="ARCHIVED">Diarsipkan (Archived)</option>
          </select>
        </div>
      </div>

      <div className="relative min-h-100">
        <AnimatePresence>
          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-10 bg-white/30 backdrop-blur-sm flex items-center justify-center rounded-4xl">
              <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
            </motion.div>
          )}
        </AnimatePresence>

        {!isLoading && quizzes.length > 0 ? (
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <motion.div key={quiz.id} variants={itemVariants} className="bg-white/50 backdrop-blur-xl border border-white/80 rounded-3xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(16,185,129,0.1)] hover:-translate-y-1 hover:border-brand-200/50 transition-all duration-300 flex flex-col group">
                
                <div className="flex justify-between items-start mb-4">
                  {getStatusBadge(quiz.status)}
                  
                  <div className="relative">
                    <button onClick={() => { setQuizToDelete(quiz); setIsDeleteModalOpen(true); }} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100" title="Hapus Paksa Kuis">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="font-bold text-slate-800 text-lg mb-2 line-clamp-2 leading-tight group-hover:text-brand-600 transition-colors">
                    {quiz.title}
                  </h3>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100/80 border border-slate-200/80 rounded-lg shadow-sm">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">KODE:</span>
                    <span className="text-[12px] font-mono font-bold text-brand-600 tracking-wide">{quiz.quizCode}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-5 p-3 bg-white/40 rounded-xl border border-white/60">
                  <div className="w-8 h-8 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center text-[11px] font-bold shadow-sm">
                    {getInitials(quiz?.author?.name || 'Unknown')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-slate-700 truncate">{quiz?.author?.name || 'Author Dihapus'}</p>
                    <p className="text-[11px] text-slate-500 truncate">@{quiz?.author?.username || 'unknown'}</p>
                  </div>
                </div>

                <div className="mt-auto">
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="flex flex-col gap-1 p-2.5 bg-slate-50/80 rounded-lg border border-slate-100/50">
                      <div className="flex items-center gap-1.5 text-slate-400"><FileQuestion className="w-3.5 h-3.5" /><span className="text-[11px] font-semibold">Soal</span></div>
                      <span className="text-sm font-bold text-slate-700">{quiz?._count?.questions || 0} Item</span>
                    </div>
                    <div className="flex flex-col gap-1 p-2.5 bg-slate-50/80 rounded-lg border border-slate-100/50">
                      <div className="flex items-center gap-1.5 text-slate-400"><Users className="w-3.5 h-3.5" /><span className="text-[11px] font-semibold">Percobaan</span></div>
                      <span className="text-sm font-bold text-slate-700">{quiz?._count?.attempts || 0} Kali</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-200/50">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-[11px] font-semibold">{formatDate(quiz.createdAt)}</span>
                    </div>
                    <a href={`/admin/quizzes/${quiz.slug}`}
                      className="flex items-center gap-1.5 text-[12px] font-bold text-brand-600 hover:text-brand-700 hover:bg-brand-50 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" /> Detail
                    </a>
                  </div>
                </div>

              </motion.div>
            ))}
          </motion.div>
        ) : !isLoading && quizzes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white/40 backdrop-blur-xl border border-white/60 rounded-4xl shadow-sm">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-300">
              <BookOpen className="w-8 h-8" />
            </div>
            <p className="font-bold text-slate-700 text-lg">Tidak ada kuis ditemukan</p>
            <p className="text-sm text-slate-500 mt-1">Belum ada instruktur yang membuat kuis atau kriteria pencarian tidak cocok.</p>
          </div>
        ) : null}
      </div>

      {!isLoading && totalItems > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)] mt-6">
           <span className="text-[13px] text-slate-500 font-semibold">Menampilkan <span className="text-slate-800">{((currentPage - 1) * itemsPerPage) + 1}</span> - <span className="text-slate-800">{Math.min(currentPage * itemsPerPage, totalItems)}</span> dari <span className="text-slate-800">{totalItems}</span> kuis</span>
           <div className="flex items-center gap-2">
             <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-1.5 rounded-lg text-slate-500 hover:bg-white/60 hover:text-brand-600 disabled:opacity-40 disabled:hover:bg-transparent"><ChevronLeft className="w-5 h-5" /></button>
             <div className="flex items-center gap-1">
               {Array.from({ length: totalPages }).map((_, i) => (
                 <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-8 h-8 rounded-lg text-[13px] font-bold transition-all ${currentPage === i + 1 ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20' : 'text-slate-500 hover:bg-white/60 hover:text-slate-800'}`}>{i + 1}</button>
               ))}
             </div>
             <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0} className="p-1.5 rounded-lg text-slate-500 hover:bg-white/60 hover:text-brand-600 disabled:opacity-40 disabled:hover:bg-transparent"><ChevronRight className="w-5 h-5" /></button>
           </div>
        </div>
      )}

      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-100 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-red-900/10 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-sm bg-white/95 backdrop-blur-2xl rounded-4xl p-7 shadow-2xl border border-red-100 text-center">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100 shadow-sm"><AlertTriangle className="w-8 h-8" /></div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Hapus Paksa Kuis?</h3>
              <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                Tindakan ini akan menghapus kuis <span className="font-bold text-slate-800">"{quizToDelete?.title}"</span> dan seluruh data pengerjaan pesertanya secara permanen.
              </p>
              <div className="flex flex-col gap-2">
                <button onClick={handleDeleteConfirm} className="w-full py-3 bg-red-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-red-500/20 hover:bg-red-600 transition-colors">Ya, Hapus Permanen</button>
                <button onClick={() => setIsDeleteModalOpen(false)} className="w-full py-3 text-slate-600 text-sm font-bold hover:bg-slate-100 rounded-xl transition-colors">Batal</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function QuizManagement() {
  return (
    <ToastProvider>
      <QuizManagementContent />
    </ToastProvider>
  );
}