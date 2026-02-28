"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Trash2, Edit2, Filter, BookOpen, User, Phone, ChevronLeft, ChevronRight, Loader2, AlertTriangle } from 'lucide-react';

import { adminService } from '../../../services/admin.service';
import { authService } from '../../../services/auth.service';

import { ToastProvider, useToast } from '../../../contexts/ToastContext';

function UserManagementContent() {
  const { showToast } = useToast(); 

  // State API Data & Pagination
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [stats, setStats] = useState({ totalAuthors: 0, totalParticipants: 0 });
  const itemsPerPage = 10;

  // State Filter & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  
  // State Modal Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('ADD'); 
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [formData, setFormData] = useState({ name: '', username: '', role: 'PARTICIPANT', phone: '', password: '' });
  const [errors, setErrors] = useState({});

  // State Delete Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 800); 
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => { setCurrentPage(1); }, [roleFilter]);
  useEffect(() => { fetchUsers(); }, [currentPage, debouncedSearch, roleFilter]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const result = await adminService.getUsers(currentPage, itemsPerPage, debouncedSearch, roleFilter);
      setUsers(result.data);
      setTotalPages(result.pagination.totalPages);
      setTotalItems(result.pagination.totalItems);
      
      if (result.stats) {
        setStats(result.stats);
      }

    } catch (error) {
      showToast(error.message || "Gagal mengambil data dari server.", 'error');
      setUsers([]); 
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    
    return date.toLocaleDateString('id-ID', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const getInitials = (name) => {
    if (!name) return 'U'; 
    const words = name.trim().split(/\s+/); 
    
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    } else {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
  };

  const handleOpenAddModal = () => {
    setModalMode('ADD');
    setFormData({ name: '', username: '', role: 'PARTICIPANT', phone: '', password: '' });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user) => {
    setModalMode('EDIT');
    setSelectedUserId(user.id);
    setFormData({ name: user.name, username: user.username, role: user.role, phone: user.phone || '', password: '' });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleValidation = async (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Nama lengkap wajib diisi.';
    if (!formData.username.trim()) newErrors.username = 'Username wajib diisi.';
    if (formData.role === 'AUTHOR' && !formData.phone.trim()) {
      newErrors.phone = 'Nomor kontak wajib diisi untuk Instruktur.';
    }
    if (modalMode === 'ADD') {
      if (!formData.password) {
        newErrors.password = 'Password sementara wajib diisi.';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password minimal 6 karakter.';
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        if (modalMode === 'ADD') {
          await authService.register({
            name: formData.name, username: formData.username, password: formData.password, role: formData.role, phone: formData.role === 'AUTHOR' ? formData.phone : undefined
          });
          showToast('Pengguna baru berhasil ditambahkan ke sistem!', 'success');
        } else {
          await adminService.updateUser(selectedUserId, {
            name: formData.name, username: formData.username, phone: formData.role === 'AUTHOR' ? formData.phone : null
          });
          showToast('Data pengguna berhasil diperbarui!', 'success');
        }

        setIsModalOpen(false);
        fetchUsers(); 
      } catch (error) {
         showToast(error.message, 'error');
      }
    }
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    try {
      await adminService.deleteUser(userToDelete.id);
      showToast(`Akun @${userToDelete.username} berhasil dihapus permanen.`, 'success');
      
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
      if (users.length === 1 && currentPage > 1) setCurrentPage(prev => prev - 1);
      else fetchUsers();
    } catch (error) {
      showToast(`Gagal menghapus: ${error.message}`, 'error');
    }
  };

  const handleInput = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: '' });
  };

  const getRoleBadge = (role) => {
    switch(role) {
      case 'AUTHOR': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-sky-500/10 text-sky-700 border border-sky-500/20"><BookOpen className="w-3.5 h-3.5" /> Instruktur</span>;
      default: return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-500/10 text-slate-700 border border-slate-500/20"><User className="w-3.5 h-3.5" /> Partisipan</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">Manajemen User</h2>
          <p className="text-slate-500 text-sm">Kelola akses, peran, dan data seluruh pengguna sistem (Kecuali Admin).</p>
          
          <div className="flex items-center gap-3 mt-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-sky-50/80 border border-sky-200/60 rounded-lg shadow-sm backdrop-blur-sm">
              <BookOpen className="w-4 h-4 text-sky-500" />
              <span className="text-xs font-bold text-sky-700">{stats.totalAuthors} Instruktur</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 border border-slate-200/60 rounded-lg shadow-sm backdrop-blur-sm">
              <User className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-bold text-slate-700">{stats.totalParticipants} Partisipan</span>
            </div>
          </div>

        </div>
        
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ backfaceVisibility: "hidden" }}>
          <button onClick={handleOpenAddModal} className="bg-brand-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-brand-500/25 hover:bg-brand-600 transition-all flex items-center justify-center gap-2">
            <Plus className="w-4.5 h-4.5" /> Tambah Pengguna
          </button>
        </motion.div>
      </div>

      <div className="bg-white/40 backdrop-blur-xl p-4 rounded-3xl border border-white/60 flex flex-col md:flex-row gap-4 shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
        <div className="relative flex-1 group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-500 transition-colors">
            <Search className="w-4 h-4" />
          </div>
          <input type="text" placeholder="Cari nama atau username..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white/60 border border-slate-200/80 rounded-xl text-sm focus:border-brand-500 outline-none transition-all shadow-sm" />
        </div>
        <div className="relative group min-w-50">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-500 transition-colors">
            <Filter className="w-4 h-4" />
          </div>
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="w-full pl-10 pr-8 py-2.5 bg-white/60 border border-slate-200/80 rounded-xl text-sm focus:border-brand-500 outline-none appearance-none font-semibold cursor-pointer shadow-sm text-slate-700">
            <option value="ALL">Semua Peran</option>
            <option value="AUTHOR">Instruktur</option>
            <option value="PARTICIPANT">Partisipan</option>
          </select>
        </div>
      </div>

      <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.04)] overflow-hidden relative flex flex-col min-h-100">
        <div className="absolute inset-0 bg-linear-to-br from-white/60 to-white/10 pointer-events-none -z-10"></div>
        <AnimatePresence>
          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-10 bg-white/50 backdrop-blur-sm flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="overflow-x-auto flex-1 pb-4">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-200/50 bg-slate-50/40 text-[12px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-4 pl-6 font-semibold">Pengguna</th>
                <th className="py-4 px-4 font-semibold">Peran</th>
                <th className="py-4 px-4 font-semibold">Kontak</th>
                <th className="py-4 px-4 font-semibold">Tgl Daftar</th>
                <th className="py-4 pr-6 text-center font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {!isLoading && users.length > 0 ? (
                  users.map((user) => (
                    <motion.tr key={user.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="border-b border-slate-100/50 hover:bg-white/60 transition-colors">
                      <td className="py-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center border border-brand-100 text-brand-600 font-bold text-sm shadow-sm">
                            {getInitials(user.name)}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 text-[14px]">{user.name}</p>
                            <p className="text-slate-500 text-[12px] font-medium">@{user.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">{getRoleBadge(user.role)}</td>
                      <td className="py-4 px-4">
                        {user.phone ? <span className="text-[13px] text-slate-600 font-medium flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400" /> {user.phone}</span> : <span className="text-[13px] text-slate-400">-</span>}
                      </td>
                      <td className="py-4 px-4 text-[13px] text-slate-500 font-medium">{formatDate(user.createdAt)}</td>
                      <td className="py-4 pr-6">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => handleOpenEditModal(user)} className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 text-brand-600 hover:bg-brand-500 hover:text-white rounded-lg transition-colors border border-brand-200 hover:border-brand-500 text-xs font-bold">
                            <Edit2 className="w-3.5 h-3.5" /> 
                          </button>
                          <button onClick={() => handleOpenDeleteModal(user)} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white rounded-lg transition-colors border border-red-200 hover:border-red-500 text-xs font-bold">
                            <Trash2 className="w-3.5 h-3.5" /> 
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : !isLoading && users.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center">
                        <Search className="w-10 h-10 text-slate-300 mb-3" />
                        <p className="font-semibold text-slate-700">Tidak ada pengguna ditemukan</p>
                      </div>
                    </td>
                  </tr>
                ) : null}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {!isLoading && totalItems > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-slate-200/50 bg-white/20 gap-4 mt-auto">
             <span className="text-[13px] text-slate-500 font-semibold">Menampilkan <span className="text-slate-800">{((currentPage - 1) * itemsPerPage) + 1}</span> - <span className="text-slate-800">{Math.min(currentPage * itemsPerPage, totalItems)}</span> dari <span className="text-slate-800">{totalItems}</span> pengguna</span>
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
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-100 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-900/20 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-md bg-white/90 backdrop-blur-2xl rounded-4xl p-7 shadow-2xl border border-white/60 overflow-hidden">
              <h3 className="text-xl font-bold text-slate-900 mb-1">{modalMode === 'ADD' ? 'Tambah Pengguna' : 'Edit Pengguna'}</h3>
              <p className="text-slate-500 text-[13px] mb-6">{modalMode === 'ADD' ? 'Buat akun akses ke dalam sistem Qurio.' : 'Perbarui data pengguna ini.'}</p>
              
              <form className="space-y-3.5" onSubmit={handleValidation}>
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-1.5 ml-1">Nama Lengkap</label>
                  <input type="text" value={formData.name} onChange={(e) => handleInput('name', e.target.value)} className={`w-full px-4 py-2.5 bg-white/60 border ${errors.name ? 'border-red-400' : 'border-slate-200/80 focus:border-brand-500'} rounded-xl text-sm outline-none transition-all shadow-sm`} placeholder="Masukkan nama" />
                  {errors.name && <p className="text-red-500 text-xs mt-1 ml-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-1.5 ml-1">Username</label>
                  <input type="text" value={formData.username} onChange={(e) => handleInput('username', e.target.value)} className={`w-full px-4 py-2.5 bg-white/60 border ${errors.username ? 'border-red-400' : 'border-slate-200/80 focus:border-brand-500'} rounded-xl text-sm outline-none transition-all shadow-sm disabled:opacity-60 disabled:bg-slate-100 disabled:cursor-not-allowed`} placeholder="username_unik" />
                  {errors.username && <p className="text-red-500 text-xs mt-1 ml-1">{errors.username}</p>}
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-1.5 ml-1">Peran Akses</label>
                  <select value={formData.role} onChange={(e) => { handleInput('role', e.target.value); if(e.target.value !== 'AUTHOR') handleInput('phone', ''); }} disabled={modalMode === 'EDIT'} className={`w-full px-4 py-2.5 border rounded-xl text-sm outline-none appearance-none transition-all shadow-sm font-semibold text-slate-700 ${modalMode === 'EDIT' ? 'bg-slate-100 border-slate-200 opacity-70 cursor-not-allowed' : 'bg-white/60 border-slate-200/80 focus:border-brand-500'}`}>
                    <option value="PARTICIPANT">Siswa</option>
                    <option value="AUTHOR">Instruktur</option>
                  </select>
                </div>
                <AnimatePresence>
                  {formData.role === 'AUTHOR' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <div className="pt-1">
                        <label className="block text-[12px] font-bold text-slate-700 mb-1.5 ml-1">Nomor Kontak</label>
                        <input type="tel" value={formData.phone} onChange={(e) => handleInput('phone', e.target.value)} className={`w-full px-4 py-2.5 bg-white/60 border ${errors.phone ? 'border-red-400' : 'border-slate-200/80 focus:border-brand-500'} rounded-xl text-sm outline-none transition-all shadow-sm`} placeholder="08xxxxxxxxxx" />
                        {errors.phone && <p className="text-red-500 text-xs mt-1 ml-1">{errors.phone}</p>}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                {modalMode === 'ADD' && (
                  <div className="pt-1">
                    <label className="block text-[12px] font-bold text-slate-700 mb-1.5 ml-1">Password Sementara</label>
                    <input type="text" value={formData.password} onChange={(e) => handleInput('password', e.target.value)} className={`w-full px-4 py-2.5 bg-white/60 border ${errors.password ? 'border-red-400' : 'border-slate-200/80 focus:border-brand-500'} rounded-xl text-sm outline-none transition-all shadow-sm`} placeholder="Minimal 6 karakter" />
                    {errors.password && <p className="text-red-500 text-xs mt-1 ml-1">{errors.password}</p>}
                  </div>
                )}
                
                <div className="flex justify-end gap-2 pt-4 mt-6 border-t border-slate-200/60">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 text-sm font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100/50 rounded-xl transition-colors">Batal</button>
                  <button type="submit" className="px-5 py-2 bg-brand-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-brand-500/20 hover:bg-brand-600 transition-colors">
                    {modalMode === 'ADD' ? 'Simpan' : 'Perbarui'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-100 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-red-900/10 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-sm bg-white/95 backdrop-blur-2xl rounded-4xl p-7 shadow-2xl border border-red-100 text-center">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100 shadow-sm"><AlertTriangle className="w-8 h-8" /></div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Hapus Pengguna?</h3>
              <p className="text-slate-500 text-sm mb-6 leading-relaxed">Tindakan ini akan menghapus akun <span className="font-bold text-slate-800">@{userToDelete?.username}</span> secara permanen.</p>
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

export default function App() {
  return (
    <ToastProvider>
      <UserManagementContent />
    </ToastProvider>
  );
}