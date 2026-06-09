import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
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
    if (section === 'life') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(`section-${section}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen relative">
      <Header
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <Sidebar
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="pt-14">
        <div className="lg:flex lg:max-w-7xl lg:mx-auto lg:gap-8 lg:p-8">
          <div className="hidden lg:block lg:w-60 shrink-0">
            <div className="sticky top-24">
              <NavCard
                activeSection={activeSection}
                onSectionChange={handleSectionChange}
              />
            </div>
          </div>

          <main id="main-content" className="flex-1 min-w-0 p-5 md:p-8 lg:p-0 relative">
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
    </div>
  );
}
