import { 
  LayoutDashboard, Users, BookOpen, FileQuestion, 
  ListChecks, Activity, Award, Settings 
} from 'lucide-react';

export const getMenuItems = (role) => {
  const adminMenu = [
    { title: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { title: 'User Management', path: '/admin/users', icon: Users },
    { title: 'Quiz Management', path: '/admin/quizzes', icon: BookOpen },
    { title: 'Question Bank', path: '/admin/questions', icon: FileQuestion },
    { title: 'Options Config', path: '/admin/options', icon: ListChecks },
    { title: 'Quiz Attempts', path: '/admin/attempts', icon: Activity },
    { title: 'Results & Scoring', path: '/admin/results', icon: Award },
    { title: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const authorMenu = [
    { title: 'Dashboard', path: '/author/dashboard', icon: LayoutDashboard },
    { title: 'My Quizzes', path: '/author/quizzes', icon: BookOpen },
    { title: 'Question Bank', path: '/author/questions', icon: FileQuestion },
    { title: 'Attempts History', path: '/author/attempts', icon: Activity },
    { title: 'Analytics', path: '/author/analytics', icon: Award },
    { title: 'Profile Settings', path: '/author/settings', icon: Settings },
  ];

  return role === 'ADMIN' ? adminMenu : authorMenu;
};