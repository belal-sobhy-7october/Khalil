import { useState, useEffect } from 'react';
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

  const handleSectionChange = (section: string) => {
    onSectionChange(section);

    setTimeout(() => {
      const el = document.getElementById(`section-${section}`);
      if (el) {
        const headerOffset = 90;
        const elementPosition = el.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    }, 50);
  };

  useEffect(() => {
    const sections = ['todo', 'life', 'bookmarks'];
    const observers = sections.map((sectionId) => {
      const el = document.getElementById(`section-${sectionId}`);
      if (!el) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.2) {
            onSectionChange(sectionId);
          }
        },
        {
          rootMargin: '-10% 0px -60% 0px',
          threshold: [0.2],
        }
      );

      observer.observe(el);
      return { observer, el };
    });

    return () => {
      observers.forEach((obs) => {
        if (obs) obs.observer.unobserve(obs.el);
      });
    };
  }, [onSectionChange]);

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
