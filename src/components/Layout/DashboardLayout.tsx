import { useCallback, useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { motion } from 'framer-motion';
export default function DashboardLayout({
  children,
  activeSection,
  onSectionChange,
  allowFullWidth = false,
  notesSlot,
}: {
  children: React.ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
  allowFullWidth?: boolean;
  notesSlot?: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = useCallback(() => setSidebarOpen((open) => !open), []);

  return (
    <div className="min-h-screen relative">
      <Header isOpen={sidebarOpen} onToggle={toggleSidebar} />

      <Sidebar activeSection={activeSection} onSectionChange={onSectionChange} isOpen={sidebarOpen} onToggle={toggleSidebar} />

      <div className="pt-14">
        {/* lg:pe-72 is reserved here, before centering, on every page (not just
            full-width ones) so content never sits under NotesPanel's fixed
            lg:w-72 side column. Centering the max-w-7xl page within this
            already-narrowed area (rather than centering first and padding
            after) keeps it flush against the reserved column instead of
            leaving a dead gap on very wide screens. */}
        <div className="lg:pe-72">
          <div className={`lg:flex lg:gap-8 lg:p-8 ${allowFullWidth ? 'lg:w-full' : 'lg:max-w-7xl lg:mx-auto'}`}>
            <main id="main-content" className="flex-1 min-w-0 p-5 md:p-8 lg:p-0 relative">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              {children}
            </motion.div>
            {notesSlot}
          </main>
          </div>
        </div>
      </div>
    </div>
  );
}
