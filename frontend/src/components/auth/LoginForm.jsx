import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { authService } from '../../services/auth.service';

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});

  const handleValidation = async (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!formData.username.trim()) newErrors.username = 'Username wajib diisi.';
    if (!formData.password) newErrors.password = 'Password wajib diisi.';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await authService.login({
          username: formData.username,
          password: formData.password
        });

        const token = response.token;
        const user = response.data; 

        if (!user || !user.username) {
          throw new Error("Gagal membaca profil pengguna dari respons server.");
        }

        localStorage.setItem('qurio_token', token);
        localStorage.setItem('qurio_user', JSON.stringify(user));

        console.log('Login berhasil:', user.username);

        if (user.role === 'ADMIN') {
          window.location.href = '/admin/dashboard';
        } else if (user.role === 'AUTHOR') {
          window.location.href = '/author/dashboard';
        } else {
          window.location.href = '/'; 
        }

      } catch (error) {
        setErrors({ ...newErrors, password: error.message || 'Login gagal. Periksa kembali kredensial Anda.' });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-50 px-4">
      <motion.div 
        animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-10 md:left-1/4 w-72 h-72 bg-brand-400/20 rounded-full blur-[80px] -z-10"
      />
      <motion.div 
        animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 right-10 md:right-1/4 w-80 h-80 bg-teal-400/20 rounded-full blur-[100px] -z-10"
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-100" 
      >
        <div className="relative p-7 md:p-9 rounded-4dl shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-white/60 bg-white/40 backdrop-blur-xl overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-white/60 to-white/10 pointer-events-none -z-10"></div>

          <div className="text-center mb-8">
            <img src="/qurio.png" alt="Qurio Logo" className="h-14 w-auto mx-auto mb-5 object-contain" />
            <h2 className="text-2xl font-bold text-slate-900 mb-1">Selamat Datang</h2>
            <p className="text-slate-500 text-sm">Masuk untuk melanjutkan ke dashboard.</p>
          </div>

          <form className="space-y-4" onSubmit={handleValidation}>
            <div>
              <label className="block text-[13px] font-semibold text-slate-700 mb-0.5 ml-1">Username</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-500 transition-colors">
                  <User className="w-4.5 h-4.5" />
                </div>
                <input 
                  type="text" 
                  value={formData.username}
                  onChange={(e) => {
                    setFormData({...formData, username: e.target.value});
                    if (errors.username) setErrors({...errors, username: ''});
                  }}
                  placeholder="Masukkan username" 
                  className={`w-full pl-10 pr-4 py-2.5 bg-white/60 border ${errors.username ? 'border-red-400 focus:ring-red-400' : 'border-slate-200/80 focus:border-brand-500 focus:ring-brand-500'} rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-[0.5px] focus:bg-white transition-all shadow-sm`}
                />
              </div>
              <AnimatePresence>
                {errors.username && (
                  <motion.p 
                    initial={{ opacity: 0, y: -5, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -5, height: 0 }}
                    className="text-red-500 text-xs mt-1.5 ml-1"
                  >
                    {errors.username}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-slate-700 mb-0.5 ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-500 transition-colors">
                  <Lock className="w-4.5 h-4.5" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({...formData, password: e.target.value});
                    if (errors.password) setErrors({...errors, password: ''});
                  }}
                  placeholder="••••••••" 
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
                {errors.password && (
                  <motion.p 
                    initial={{ opacity: 0, y: -5, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -5, height: 0 }}
                    className="text-red-500 text-xs mt-1.5 ml-1"
                  >
                    {errors.password}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ backfaceVisibility: "hidden", transformOrigin: "center" }}
              className="pt-2"
            >
              <button 
                type="submit"
                className="w-full py-3 bg-brand-500 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 group transition-shadow hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Masuk <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </motion.div>
          </form>

          <p className="text-center text-[13px] text-slate-500 mt-7">
            Belum punya akun?{' '}
            <a href="/auth/register" className="font-bold text-brand-600 hover:text-brand-500 transition-colors">
              Daftar sekarang
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}