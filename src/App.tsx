import { useEffect, useState } from 'react';
import { useAppStore } from './store/appStore';
import { useTranslation } from './i18n/useTranslation';
import DashboardLayout from './components/Layout/DashboardLayout';
import DailyFocus from './components/DailyFocus/DailyFocus';
import DailyTodo from './components/Todo/DailyTodo';
import WeeklyTodo from './components/Todo/WeeklyTodo';
import BacklogTodo from './components/Todo/BacklogTodo';
import LifePillars from './components/LifePillars/LifePillars';
import BookmarksVault from './components/Bookmarks/BookmarksVault';

function App() {
  const language = useAppStore((s) => s.language);
  const theme = useAppStore((s) => s.theme);
  const { isRTL } = useTranslation();
  const [activeSection, setActiveSection] = useState('dashboard');

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, isRTL]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  return (
    <DashboardLayout activeSection={activeSection} onSectionChange={handleSectionChange}>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Top Row: Life Pillars + Weekly Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8">
            <LifePillars />
          </div>
          <div className="lg:col-span-4">
            <WeeklyTodo />
          </div>
        </div>

        {/* Below: Daily Focus, Daily To-Do, Backlog, Bookmarks */}
        <DailyFocus />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <DailyTodo />
          <BacklogTodo />
        </div>

        <BookmarksVault />
      </div>
    </DashboardLayout>
  );
}

export default App;
