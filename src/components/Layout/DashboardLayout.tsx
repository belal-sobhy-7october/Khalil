import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import NavCard from './NavCard';
import { useTranslation } from '../../i18n/useTranslation';
import { motion } from 'framer-motion';

export default function DashboardLayout({
  children,
  activeSection,
  onSectionChange,
}: {
  children: React.ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { language } = useTranslation();

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const handleSectionChange = (section: string) => {
    onSectionChange(section);
    const targetId = section === 'dashboard' ? 'main-content' : `section-${section}`;
    const el = document.getElementById(targetId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen geometric-bg">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="lg:flex lg:max-w-7xl lg:mx-auto lg:gap-6 lg:p-8">
        <div className="hidden lg:block lg:w-64 shrink-0">
          <div className="sticky top-6">
            <NavCard
              activeSection={activeSection}
              onSectionChange={handleSectionChange}
            />
          </div>
        </div>

        <main id="main-content" className="flex-1 min-w-0 p-4 md:p-6 lg:p-0 pt-16 lg:pt-0">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
