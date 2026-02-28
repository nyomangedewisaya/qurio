import { 
  LayoutDashboard, Users, BookOpen, FileQuestion, 
  ListChecks, Activity, Award, Settings 
} from 'lucide-react';

export const getMenuItems = (role) => {
  const adminMenu = [
    { title: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { title: 'Manajemen User', path: '/admin/users', icon: Users },
    { title: 'Manajemen Kuis', path: '/admin/quizzes/quiz', icon: BookOpen },
    { title: 'Bank Soal', path: '/admin/questions', icon: FileQuestion },
    { title: 'Konfigurasi Opsi', path: '/admin/options', icon: ListChecks },
    { title: 'Riwayat Pengerjaan', path: '/admin/attempts', icon: Activity },
    { title: 'Hasil & Penilaian', path: '/admin/results', icon: Award },
    { title: 'Pengaturan', path: '/admin/settings', icon: Settings },
  ];

  const authorMenu = [
    { title: 'Dashboard', path: '/author/dashboard', icon: LayoutDashboard },
    { title: 'Kuis Saya', path: '/author/quizzes', icon: BookOpen },
    { title: 'Bank Soal', path: '/author/questions', icon: FileQuestion },
    { title: 'Riwayat Pengerjaan', path: '/author/attempts', icon: Activity },
    { title: 'Analitik', path: '/author/analytics', icon: Award },
    { title: 'Pengaturan Profil', path: '/author/settings', icon: Settings },
  ];

  return role === 'ADMIN' ? adminMenu : authorMenu;
};