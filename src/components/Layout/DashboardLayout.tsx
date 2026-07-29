import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import NavCard from './NavCard';
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
