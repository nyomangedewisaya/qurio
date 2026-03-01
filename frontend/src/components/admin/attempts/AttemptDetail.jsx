"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Award, Calendar, CheckCircle2, XCircle, Target, Timer, BarChart3, Loader2 } from 'lucide-react';
import { adminService } from '../../../services/admin.service';
import { ToastProvider, useToast } from '../../../contexts/ToastContext';

function AttemptDetailContent({ attemptId }) {
  const { showToast } = useToast();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDetail();
  }, [attemptId]);

  const fetchDetail = async () => {
    try {
      const result = await adminService.getAttemptDetail(attemptId);
      setData(result.data);
    } catch (error) {
      showToast("Gagal memuat detail hasil.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (d) => {
    if (!d) return '-';
    return new Date(d).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const getScoreStyle = (score) => {
    if (score === null || score === undefined) return { text: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-200', icon: 'text-slate-400' };
    if (score >= 80) return { text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: 'text-emerald-500' };
    if (score >= 60) return { text: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', icon: 'text-yellow-500' };
    if (score >= 40) return { text: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', icon: 'text-orange-500' };
    return { text: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200', icon: 'text-rose-500' };
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-brand-500"/>
        <p className="text-slate-500 font-medium animate-pulse">Memuat lembar jawaban...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20 text-slate-500 bg-white/40 rounded-4xl border border-white/60 backdrop-blur-xl">
        Data hasil ujian tidak ditemukan.
      </div>
    );
  }

  const totalQuestions = data.answers?.length || 0;
  const correctAnswers = data.answers?.filter(a => a.isCorrect).length || 0;
  const incorrectAnswers = totalQuestions - correctAnswers;
  const scoreStyle = getScoreStyle(data.score);

  let durationStr = '-';
  if (data.startedAt && data.completedAt) {
    const diffMins = Math.round((new Date(data.completedAt) - new Date(data.startedAt)) / 60000);
    durationStr = diffMins === 0 ? '< 1 Menit' : `${diffMins} Menit`;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto pb-12 space-y-6">
      
      <div className="flex items-center gap-4 mb-4 lg:mb-6">
        <a href="/admin/attempts" className="p-2.5 bg-white/60 hover:bg-white border border-slate-200/60 rounded-xl text-slate-500 hover:text-brand-600 transition-all shadow-sm">
          <ChevronLeft className="w-5 h-5" />
        </a>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 leading-tight">Detail Hasil Ujian</h2>
          <p className="text-sm text-slate-500">Inspeksi lembar jawaban peserta</p>
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-2xl border border-white/80 rounded-4xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.04)] relative overflow-hidden">
        <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2 opacity-30 ${scoreStyle.bg.replace('bg-', 'bg-').replace('50', '400')}`}></div>
        
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-5">
            <div className="flex items-center gap-4 p-4 bg-white/40 border border-slate-100/50 rounded-2xl">
              <div className="w-14 h-14 rounded-full bg-brand-50 flex items-center justify-center font-bold text-xl text-brand-600 border border-brand-100 shadow-inner">
                {data.participant?.name?.substring(0, 2).toUpperCase() || 'U'}
              </div>
              <div>
                <p className="font-extrabold text-slate-800 text-lg leading-tight group-hover:text-brand-600 transition-colors">{data.participant?.name}</p>
                <p className="text-sm font-medium text-slate-500">@{data.participant?.username}</p>
              </div>
            </div>

            <div className="px-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold font-mono rounded border border-slate-200 uppercase tracking-widest">
                  {data.quiz?.quizCode}
                </span>
              </div>
              <p className="text-lg font-bold text-slate-700">{data.quiz?.title}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3 px-2 pt-2 border-t border-slate-200/50">
               <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1"><Calendar className="w-3.5 h-3.5" /> Waktu Mulai</p>
                  <p className="text-[13px] font-semibold text-slate-700">{formatDate(data.startedAt)}</p>
               </div>
               <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1"><CheckCircle2 className="w-3.5 h-3.5" /> Waktu Selesai</p>
                  <p className="text-[13px] font-semibold text-slate-700">{data.completedAt ? formatDate(data.completedAt) : <span className="text-amber-500 italic">Belum Selesai</span>}</p>
               </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-3 lg:w-70 shrink-0">
            <div className={`flex-1 p-5 rounded-2xl border flex flex-col items-center justify-center text-center shadow-sm ${scoreStyle.bg} ${scoreStyle.border}`}>
              <Award className={`w-8 h-8 mb-2 ${scoreStyle.icon}`} />
              <p className={`text-5xl font-black ${scoreStyle.text}`}>{data.score !== null ? data.score : '-'}</p>
              <p className={`text-[11px] font-bold uppercase tracking-widest mt-2 ${scoreStyle.text} opacity-80`}>Skor Akhir</p>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
               <div className="bg-white/50 border border-slate-100 rounded-xl p-2.5 text-center flex flex-col items-center justify-center">
                 <Target className="w-4 h-4 text-emerald-500 mb-1"/>
                 <p className="text-sm font-bold text-slate-700">{correctAnswers}</p>
                 <p className="text-[9px] font-bold text-slate-400 uppercase">Benar</p>
               </div>
               <div className="bg-white/50 border border-slate-100 rounded-xl p-2.5 text-center flex flex-col items-center justify-center">
                 <XCircle className="w-4 h-4 text-rose-500 mb-1"/>
                 <p className="text-sm font-bold text-slate-700">{incorrectAnswers}</p>
                 <p className="text-[9px] font-bold text-slate-400 uppercase">Salah</p>
               </div>
               <div className="bg-white/50 border border-slate-100 rounded-xl p-2.5 text-center flex flex-col items-center justify-center">
                 <Timer className="w-4 h-4 text-brand-500 mb-1"/>
                 <p className="text-sm font-bold text-slate-700">{durationStr.split(' ')[0]}</p>
                 <p className="text-[9px] font-bold text-slate-400 uppercase">Menit</p>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 px-2 pt-4">
        <div className="p-2 bg-brand-100 text-brand-600 rounded-lg"><BarChart3 className="w-5 h-5" /></div>
        <div>
           <h3 className="text-lg font-bold text-slate-800">Analisis Jawaban</h3>
           <p className="text-[13px] text-slate-500">Rincian soal dan opsi yang dipilih peserta</p>
        </div>
      </div>
      
      <div className="space-y-4">
        {data.answers?.map((ans, idx) => {
          const isCorrect = ans.isCorrect;
          
          return (
            <motion.div 
              key={ans.id} 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: idx * 0.1 }}
              className={`bg-white/70 backdrop-blur-xl border rounded-3xl p-5 sm:p-6 shadow-[0_4px_15px_rgba(0,0,0,0.02)] transition-all ${isCorrect ? 'border-slate-200/80' : 'border-rose-100'}`}
            >
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
                <div className="flex items-center sm:items-start sm:flex-col gap-3 shrink-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm text-white shadow-sm ${isCorrect ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-rose-500 shadow-rose-500/20'}`}>
                    {idx + 1}
                  </div>
                  <div className="sm:hidden text-sm font-bold text-slate-400">Soal No. {idx + 1}</div>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[15px] sm:text-base font-semibold text-slate-800 mb-4 leading-relaxed whitespace-pre-wrap">{ans.question?.content}</p>
                  
                  <div className="space-y-3">
                    <div className={`p-3.5 sm:p-4 rounded-xl border flex items-start gap-3 transition-colors ${isCorrect ? 'bg-emerald-50/70 border-emerald-200/60' : 'bg-rose-50/70 border-rose-200/60'}`}>
                      {isCorrect ? <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500 shrink-0 mt-0.5"/> : <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-rose-500 shrink-0 mt-0.5"/>}
                      <div>
                        <p className={`text-[10px] sm:text-[11px] font-bold uppercase tracking-wider mb-1 ${isCorrect ? 'text-emerald-600/70' : 'text-rose-600/70'}`}>
                          Jawaban Peserta:
                        </p>
                        <p className={`text-sm sm:text-[15px] font-semibold ${isCorrect ? 'text-emerald-800' : 'text-rose-800'}`}>
                          {ans.option?.content || <i className="font-normal opacity-60">Kosong (Tidak Menjawab)</i>}
                        </p>
                      </div>
                    </div>

                    {!isCorrect && (
                      <div className="p-3.5 sm:p-4 rounded-xl border border-sky-100 bg-sky-50/50 flex items-start gap-3 mt-2">
                         <Target className="w-5 h-5 sm:w-6 sm:h-6 text-sky-500 shrink-0 mt-0.5"/>
                         <div>
                           <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider mb-1 text-sky-600/70">
                             Kunci Jawaban Benar:
                           </p>
                           <p className="text-sm sm:text-[15px] font-bold text-sky-900">
                             {ans.question?.options?.find(opt => opt.isCorrect)?.content || 'Tidak ada kunci jawaban'}
                           </p>
                         </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}

        {data.answers?.length === 0 && (
          <div className="text-center py-12 bg-white/40 border border-white/60 rounded-3xl text-slate-500">
            Tidak ada data jawaban untuk ditampilkan.
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function AttemptDetail({ attemptId }) { 
  return (
    <ToastProvider>
      <AttemptDetailContent attemptId={attemptId} />
    </ToastProvider>
  ); 
}