"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';import { ChevronLeft, BookOpen, Users, FileQuestion, Calendar, CheckCircle2, Loader2, AlertCircle, Timer, Repeat, Settings } from 'lucide-react';
import { adminService } from '../../../services/admin.service';
import { ToastProvider, useToast } from '../../../contexts/ToastContext';

function QuizDetailContent({ slug }) {
  const { showToast } = useToast();
  const [quiz, setQuiz] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchQuizDetail();
  }, [slug]);

  const fetchQuizDetail = async () => {
    try {
      setIsLoading(true);
      const result = await adminService.getQuizBySlug(slug);
      setQuiz(result.data);
    } catch (error) {
      showToast(error.message || "Gagal memuat detail kuis.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'PUBLISHED': return <span className="px-3 py-1 text-xs font-extrabold uppercase tracking-wider rounded-lg border bg-emerald-50 text-emerald-600 border-emerald-200/50">PUBLISHED</span>;
      case 'DRAFT': return <span className="px-3 py-1 text-xs font-extrabold uppercase tracking-wider rounded-lg border bg-slate-100 text-slate-500 border-slate-200/60">DRAFT</span>;
      case 'INACTIVE': return <span className="px-3 py-1 text-xs font-extrabold uppercase tracking-wider rounded-lg border bg-amber-50 text-amber-600 border-amber-200/50">INACTIVE</span>;
      case 'ARCHIVED': return <span className="px-3 py-1 text-xs font-extrabold uppercase tracking-wider rounded-lg border bg-purple-50 text-purple-600 border-purple-200/50">ARCHIVED</span>;
      default: return <span className="px-3 py-1 text-xs font-extrabold uppercase tracking-wider rounded-lg border bg-slate-100 text-slate-500">{status}</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-brand-500 animate-spin mb-4" />
        <p className="text-slate-500 font-medium animate-pulse">Memuat detail kuis...</p>
      </div>
    );
  }

  if (!quiz && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white/40 backdrop-blur-xl rounded-4xl border border-white/60">
        <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
        <h2 className="text-xl font-bold text-slate-800">Kuis Tidak Ditemukan</h2>
        <p className="text-slate-500 mt-2 mb-6">Kuis mungkin sudah dihapus atau ID tidak valid.</p>
        <a href="/admin/quizzes" className="px-6 py-2.5 bg-brand-500 text-white font-bold rounded-xl hover:bg-brand-600 transition-colors shadow-lg shadow-brand-500/20">Kembali ke Daftar Kuis</a>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto space-y-6 pb-12">
      
      <div className="flex items-center gap-4 mb-4 lg:mb-6">
        <a href="/admin/quizzes" className="p-2.5 bg-white/60 hover:bg-white border border-slate-200/80 rounded-xl text-slate-600 hover:text-brand-600 transition-all shadow-sm group">
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        </a>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 leading-tight">Detail Kuis</h2>
          <p className="text-slate-500 text-sm">Inspeksi informasi dan butir soal.</p>
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-2xl border border-white/80 rounded-4xl p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.04)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-5">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-3">
                {getStatusBadge(quiz.status)}
                <span className="px-3 py-1 bg-brand-50 text-brand-600 text-xs font-mono font-bold rounded-lg border border-brand-100/50 uppercase tracking-widest">
                  KODE: {quiz.quizCode}
                </span>
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 leading-tight">{quiz.title}</h1>
              <p className="text-slate-600 mt-3 leading-relaxed text-[15px]">{quiz.description || <span className="italic opacity-60">Tidak ada deskripsi.</span>}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-y border-slate-200/50">
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Jadwal Pelaksanaan</p>
                <div className="text-[13px] text-slate-700 font-medium bg-white/40 px-3 py-2 rounded-xl border border-white/80">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-12 text-slate-400 text-xs">Mulai:</span> 
                    <span className={quiz.startDate ? "text-slate-800" : "text-emerald-600"}>{quiz.startDate ? formatDate(quiz.startDate) : 'Kapan saja (Tidak dibatasi)'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-12 text-slate-400 text-xs">Selesai:</span> 
                    <span className={quiz.endDate ? "text-slate-800" : "text-slate-500"}>{quiz.endDate ? formatDate(quiz.endDate) : 'Tidak ada batas akhir'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><Settings className="w-3.5 h-3.5" /> Pengaturan Ujian</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className={`px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-lg border ${quiz.showScore ? 'bg-sky-50 text-sky-600 border-sky-200/50' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                    {quiz.showScore ? 'Tampilkan Nilai' : 'Sembunyikan Nilai'}
                  </span>
                  <span className={`px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-lg border ${quiz.randomizeQuestions ? 'bg-indigo-50 text-indigo-600 border-indigo-200/50' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                    {quiz.randomizeQuestions ? 'Soal Diacak' : 'Soal Berurutan'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-fit pt-2">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200">
                {quiz.author?.name?.substring(0, 2).toUpperCase() || 'U'}
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Dibuat Oleh</p>
                <p className="text-sm font-bold text-slate-800">{quiz.author?.name || 'Author Dihapus'}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:w-[320px] shrink-0">
            <div className="p-4 bg-white/40 rounded-2xl border border-slate-100/50 flex flex-col gap-1 justify-center">
              <FileQuestion className="w-5 h-5 text-brand-500 mb-1" />
              <p className="text-2xl font-black text-slate-800">{quiz.questions?.length || 0}</p>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-1">Total Soal</p>
            </div>
            
            <div className="p-4 bg-white/40 rounded-2xl border border-slate-100/50 flex flex-col gap-1 justify-center">
              <Users className="w-5 h-5 text-sky-500 mb-1" />
              <p className="text-2xl font-black text-slate-800">{quiz._count?.attempts || 0}</p>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-1">Percobaan</p>
            </div>

            <div className="p-4 bg-white/40 rounded-2xl border border-slate-100/50 flex flex-col gap-1 justify-center">
              <Timer className="w-5 h-5 text-amber-500 mb-1" />
              <div className="flex items-baseline gap-1">
                <p className="text-2xl font-black text-slate-800">{quiz.timeLimit ? quiz.timeLimit : '∞'}</p>
                <p className="text-sm font-bold text-slate-500">{quiz.timeLimit ? 'mnt' : ''}</p>
              </div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-1">Batas Waktu</p>
            </div>

            <div className="p-4 bg-white/40 rounded-2xl border border-slate-100/50 flex flex-col gap-1 justify-center">
              <Repeat className="w-5 h-5 text-purple-500 mb-1" />
              <div className="flex items-baseline gap-1">
                <p className="text-2xl font-black text-slate-800">{quiz.maxAttempts ? quiz.maxAttempts : '∞'}</p>
                <p className="text-sm font-bold text-slate-500">{quiz.maxAttempts ? 'x' : ''}</p>
              </div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-1">Maks. Mencoba</p>
            </div>

            <div className="col-span-2 text-center pt-2">
               <p className="text-[10px] font-semibold text-slate-400">Dibuat pada: {formatDate(quiz.createdAt)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center gap-3 px-2 pt-4 mb-4">
          <div className="p-2 bg-brand-100 text-brand-600 rounded-lg"><BookOpen className="w-5 h-5" /></div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">Daftar Pertanyaan ({quiz.questions?.length || 0})</h3>
            <p className="text-[13px] text-slate-500">Rincian soal dan opsi yang dibuat instruktur</p>
          </div>
        </div>

        <div className="space-y-4">
          {quiz.questions && quiz.questions.length > 0 ? (
            quiz.questions.map((question, index) => (
              <motion.div 
                key={question.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/40 backdrop-blur-xl border border-white/80 rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden"
              >
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-8 h-8 shrink-0 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-[15px] font-semibold text-slate-800 leading-relaxed whitespace-pre-wrap">
                      {question.content}
                    </p>
                    {question.imageUrl && (
                      <img src={question.imageUrl} alt="Lampiran Soal" className="mt-3 max-w-sm rounded-xl border border-slate-200" />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-12">
                  {question.options?.map((option, optIdx) => {
                    const isCorrect = option.isCorrect === true;
                    const letters = ['A', 'B', 'C', 'D', 'E'];

                    return (
                      <div 
                        key={option.id} 
                        className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all ${
                          isCorrect 
                            ? 'bg-emerald-50/80 border-emerald-200 shadow-[0_2px_10px_rgba(16,185,129,0.05)]' 
                            : 'bg-white/60 border-slate-100 text-slate-600'
                        }`}
                      >
                        <div className={`w-6 h-6 shrink-0 rounded-md flex items-center justify-center text-[11px] font-bold ${
                          isCorrect ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {letters[optIdx] || '-'}
                        </div>
                        <p className={`text-[14px] flex-1 pt-0.5 ${isCorrect ? 'font-bold text-emerald-800' : 'font-medium'}`}>
                          {option.content} 
                        </p>
                        {isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))
          ) : (
             <div className="text-center py-12 bg-white/30 rounded-4xl border border-white/50 border-dashed">
                <p className="text-slate-500 font-medium">Belum ada butir soal yang ditambahkan pada kuis ini.</p>
             </div>
          )}
        </div>
      </div>
      
    </motion.div>
  );
}

export default function QuizDetail({ slug }) {
  return (
    <ToastProvider>
      <QuizDetailContent slug={slug} />
    </ToastProvider>
  );
}