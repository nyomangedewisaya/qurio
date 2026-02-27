import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, Eye, EyeOff, ArrowRight, Phone, BookOpen, PenTool } from 'lucide-react';

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('PARTICIPANT');
  const [formData, setFormData] = useState({ name: '', username: '', phone: '', password: '' });
  const [errors, setErrors] = useState({});

  const handleValidation = (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Nama lengkap wajib diisi.';
    if (!formData.username.trim()) newErrors.username = 'Username wajib diisi.';
    if (role === 'AUTHOR' && !formData.phone.trim()) {
      newErrors.phone = 'Nomor WhatsApp wajib diisi untuk Instruktur.';
    }
    if (!formData.password) {
      newErrors.password = 'Password wajib diisi.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log('Register diproses...', { ...formData, role });
      // TODO: Panggil fungsi fetch() API Register
    }
  };

  const handleInput = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: '' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-50 px-4 py-10">
      <div className="absolute top-0 right-0 w-full h-full -z-10 overflow-hidden">
        <div className="absolute top-[-5%] right-[-5%] w-140 h-140 bg-brand-50/50 rounded-full blur-3xl" />
        <div className="absolute bottom-[-5%] left-[-5%] w-100 h-100 bg-teal-50/50 rounded-full blur-3xl" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-110"
      >
        <div className="relative p-7 md:p-9 rounded-4xl shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-white/60 bg-white/40 backdrop-blur-xl overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-white/60 to-white/10 pointer-events-none -z-10"></div>

          <div className="text-center mb-7">
            <img src="/qurio.png" alt="Qurio Logo" className="h-12 w-auto mx-auto mb-4 object-contain" />
            <h2 className="text-xl font-bold text-slate-900 mb-1">Buat Akun Baru</h2>
            <p className="text-slate-500 text-[13px]">Pilih peran Anda untuk memulai.</p>
          </div>

          <form className="space-y-3.5" onSubmit={handleValidation}>
            
            <div className="bg-white/60 border border-slate-200/80 p-1 rounded-xl flex relative mb-5 shadow-sm">
              {['PARTICIPANT', 'AUTHOR'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    setRole(r);
                    if (r === 'PARTICIPANT') handleInput('phone', ''); 
                  }}
                  className={`relative flex-1 py-2 text-[13px] font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors z-10 ${
                    role === r ? 'text-brand-600' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {r === 'PARTICIPANT' ? <BookOpen className="w-4 h-4" /> : <PenTool className="w-4 h-4" />}
                  {r === 'PARTICIPANT' ? 'Siswa' : 'Instruktur'}
                  
                  {role === r && (
                    <motion.div 
                      layoutId="activeRole" 
                      className="absolute inset-0 bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100 -z-10"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>

            <div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-500 transition-colors">
                  <User className="w-4.5 h-4.5" />
                </div>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => handleInput('name', e.target.value)}
                  placeholder="Nama Lengkap" 
                  className={`w-full pl-10 pr-4 py-2.5 bg-white/60 border ${errors.name ? 'border-red-400 focus:ring-red-400' : 'border-slate-200/80 focus:border-brand-500 focus:ring-brand-500'} rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-[0.5px] focus:bg-white transition-all shadow-sm`}
                />
              </div>
              <AnimatePresence>
                {errors.name && <motion.p initial={{ opacity: 0, y: -5, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, y: -5, height: 0 }} className="text-red-500 text-xs mt-1.5 ml-1">{errors.name}</motion.p>}
              </AnimatePresence>
            </div>

            <div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-500 transition-colors">
                  <span className="font-bold text-base">@</span>
                </div>
                <input 
                  type="text" 
                  value={formData.username}
                  onChange={(e) => handleInput('username', e.target.value)}
                  placeholder="Username" 
                  className={`w-full pl-10 pr-4 py-2.5 bg-white/60 border ${errors.username ? 'border-red-400 focus:ring-red-400' : 'border-slate-200/80 focus:border-brand-500 focus:ring-brand-500'} rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-[0.5px] focus:bg-white transition-all shadow-sm`}
                />
              </div>
              <AnimatePresence>
                {errors.username && <motion.p initial={{ opacity: 0, y: -5, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, y: -5, height: 0 }} className="text-red-500 text-xs mt-1.5 ml-1">{errors.username}</motion.p>}
              </AnimatePresence>
            </div>

            <AnimatePresence>
              {role === 'AUTHOR' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-1">
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-500 transition-colors">
                        <Phone className="w-4.5 h-4.5" />
                      </div>
                      <input 
                        type="tel" 
                        value={formData.phone}
                        onChange={(e) => handleInput('phone', e.target.value)}
                        placeholder="Nomor WhatsApp" 
                        className={`w-full pl-10 pr-4 py-2.5 bg-white/60 border ${errors.phone ? 'border-red-400 focus:ring-red-400' : 'border-slate-200/80 focus:border-brand-500 focus:ring-brand-500'} rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-[0.5px] focus:bg-white transition-all shadow-sm`}
                      />
                    </div>
                    <AnimatePresence>
                      {errors.phone && <motion.p initial={{ opacity: 0, y: -5, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, y: -5, height: 0 }} className="text-red-500 text-xs mt-1.5 ml-1">{errors.phone}</motion.p>}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-500 transition-colors">
                  <Lock className="w-4.5 h-4.5" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={formData.password}
                  onChange={(e) => handleInput('password', e.target.value)}
                  placeholder="Buat Password" 
                  className={`w-full pl-10 pr-10 py-2.5 bg-white/60 border ${errors.password ? 'border-red-400 focus:ring-red-400' : 'border-slate-200/80 focus:border-brand-500 focus:ring-brand-500'} rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-[0.5px] focus:bg-white transition-all shadow-sm`}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-brand-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
              <AnimatePresence>
                {errors.password && <motion.p initial={{ opacity: 0, y: -5, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, y: -5, height: 0 }} className="text-red-500 text-xs mt-1.5 ml-1">{errors.password}</motion.p>}
              </AnimatePresence>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ backfaceVisibility: "hidden", transformOrigin: "center" }}
              className="pt-3"
            >
              <button 
                type="submit"
                className="w-full py-3 bg-brand-500 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 group transition-shadow hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Daftar Sekarang <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </motion.div>
          </form>

          <p className="text-center text-[13px] text-slate-500 mt-6">
            Sudah memiliki akun?{' '}
            <a href="/auth/login" className="font-bold text-brand-600 hover:text-brand-500 transition-colors">
              Masuk di sini
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}