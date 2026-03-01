"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Save, ShieldCheck, Loader2, KeyRound, Mail, Eye, EyeOff } from 'lucide-react';
import { adminService } from '../../../services/admin.service';
import { ToastProvider, useToast } from '../../../contexts/ToastContext';

function AdminSettingsContent() {
  const { showToast } = useToast();
  
  const [profile, setProfile] = useState({ name: '', username: '' });
  const [isAdminRole, setIsAdminRole] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [isProfileSaving, setIsProfileSaving] = useState(false);

  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await adminService.getAdminProfile();
      setProfile({ name: res.data.name, username: res.data.username });
      setIsAdminRole(res.data.role === 'ADMIN');
    } catch (error) {
      showToast("Gagal memuat profil admin.", "error");
    } finally {
      setIsProfileLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profile.name || !profile.username) return showToast("Nama dan Username wajib diisi!", "error");
    
    setIsProfileSaving(true);
    try {
      await adminService.updateAdminProfile(profile);
      showToast("Profil berhasil diperbarui!", "success");
    } catch (error) {
      showToast(error.message || "Gagal memperbarui profil.", "error");
    } finally {
      setIsProfileSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
      return showToast("Semua kolom password wajib diisi!", "error");
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      return showToast("Password baru dan konfirmasi tidak cocok!", "error");
    }
    if (passwords.newPassword.length < 6) {
      return showToast("Password baru minimal 6 karakter!", "error");
    }

    setIsPasswordSaving(true);
    try {
      await adminService.updateAdminPassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });
      showToast("Password berhasil diperbarui!", "success");
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' }); 
      setShowCurrent(false); setShowNew(false); setShowConfirm(false);
    } catch (error) {
      showToast(error.message || "Gagal memperbarui password.", "error");
    } finally {
      setIsPasswordSaving(false);
    }
  };

  const PasswordInput = ({ value, onChange, placeholder, show, onToggle, id }) => (
    <div className="relative group">
      <input 
        id={id}
        type={show ? "text" : "password"} 
        value={value} 
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-4 pr-11 py-3 bg-white/60 border border-slate-200 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all text-sm shadow-inner placeholder:text-slate-400 font-mono tracking-wide"
      />
      <button 
        type="button" 
        onClick={onToggle}
        aria-label={show ? "Sembunyikan password" : "Tampilkan password"}
        className="absolute inset-y-0 right-0 px-3.5 flex items-center text-slate-400 hover:text-amber-600 transition-colors rounded-r-xl"
      >
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );

  if (isProfileLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-3">
        <Loader2 className="w-10 h-10 animate-spin text-brand-500" />
        <p className="text-sm font-medium text-slate-500 animate-pulse">Memuat pengaturan...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      <div className="mb-6 px-1">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">Pengaturan Akun</h2>
        <p className="text-slate-500 text-sm">Kelola informasi profil dan keamanan akun Administrator Anda.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-4xl p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.03)] hover:border-brand-200 transition-all flex flex-col justify-between h-full">
          
          <div>
            <div className="flex items-center gap-3.5 mb-6">
              <div className="p-3 bg-brand-50 text-brand-600 rounded-2xl border border-brand-100/60 shadow-inner"><User className="w-5.5 h-5.5" /></div>
              <h3 className="text-lg font-bold text-slate-800">Informasi Profil</h3>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-brand-400" /> Nama Lengkap</label>
                <input 
                  type="text" 
                  value={profile.name} 
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="Masukkan nama lengkap Anda"
                  className="w-full px-4 py-3 bg-white/60 border border-slate-200 rounded-xl focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all text-sm font-medium shadow-inner placeholder:text-slate-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1 flex items-center gap-1.5"><KeyRound className="w-3.5 h-3.5 text-brand-400" /> Username</label>
                <input 
                  type="text" 
                  value={profile.username} 
                  onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                  placeholder="Contoh: admin_qurio"
                  className="w-full px-4 py-3 bg-white/60 border border-slate-200 rounded-xl focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all text-sm font-bold shadow-inner placeholder:text-slate-400 text-brand-700"
                />
              </div>
              
              <div className="pt-2">
                <button disabled={isProfileSaving} type="submit" className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20 disabled:opacity-70 active:scale-[0.98]">
                  {isProfileSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>

          {isAdminRole && (
            <div className="mt-6 p-4 bg-slate-50/70 rounded-xl border border-slate-100 flex items-center gap-4 transition-all">
              <div className="w-12 h-12 rounded-xl bg-white border flex items-center justify-center font-bold text-sm text-brand-600 shadow-sm">
                AQ
              </div>
              <div>
                 <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Role Akses</p>
                 <p className="text-sm font-extrabold text-slate-700 flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-500"/> Administrator Global</p>
              </div>
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-4xl p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.03)] hover:border-amber-200 transition-all flex flex-col justify-between h-full">
          
          <div>
            <div className="flex items-center gap-3.5 mb-6">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl border border-amber-100/60 shadow-inner"><KeyRound className="w-5.5 h-5.5" /></div>
              <h3 className="text-lg font-bold text-slate-800">Keamanan & Password</h3>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label htmlFor="curr_p" className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Password Saat Ini</label>
                <PasswordInput 
                  id="curr_p"
                  value={passwords.currentPassword}
                  onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                  placeholder="Masukkan password Anda saat ini"
                  show={showCurrent}
                  onToggle={() => setShowCurrent(!showCurrent)}
                />
              </div>
              <div>
                <label htmlFor="new_p" className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Password Baru</label>
                <PasswordInput 
                  id="new_p"
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                  placeholder="Minimal 6 karakter"
                  show={showNew}
                  onToggle={() => setShowNew(!showNew)}
                />
              </div>
              <div>
                <label htmlFor="conf_p" className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Konfirmasi Password Baru</label>
                <PasswordInput 
                  id="conf_p"
                  value={passwords.confirmPassword}
                  onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                  placeholder="Ulangi password baru Anda"
                  show={showConfirm}
                  onToggle={() => setShowConfirm(!showConfirm)}
                />
              </div>
              
              <div className="pt-2">
                <button disabled={isPasswordSaving} type="submit" className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-70 active:scale-[0.98]">
                  {isPasswordSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                  Perbarui Password
                </button>
              </div>
            </form>
          </div>
        </motion.div>

      </div>
    </div>
  );
}

export default function AdminSettings() {
  return (
    <ToastProvider>
      <AdminSettingsContent />
    </ToastProvider>
  );
}