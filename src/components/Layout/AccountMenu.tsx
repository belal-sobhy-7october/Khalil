import { useState, useRef } from 'react';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { useAppStore } from '../../store/appStore';
import { supabase } from '../../lib/supabase';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
} from '@floating-ui/react';

export default function AccountMenu() {
  const { t, isRTL } = useTranslation();
  const session = useAppStore((s) => s.session);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const listRef = useRef<Array<HTMLButtonElement | null>>([]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setActiveIndex(null);
    }
  };

  const { refs, floatingStyles, context } = useFloating({
    placement: isRTL ? 'left-start' : 'right-start',
    middleware: [offset(8), flip({ padding: 8 }), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
    open: isOpen,
    onOpenChange: handleOpenChange,
  });
  const { setReference, setFloating } = refs;

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'menu' });
  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
    click,
    dismiss,
    role,
  ]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleOpenChange(false);
      return;
    }

    if (!isOpen) return;

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const items = listRef.current.filter(Boolean);
      if (items.length === 0) return;

      const currentIndex = activeIndex ?? -1;
      const nextIndex = e.key === 'ArrowDown'
        ? (currentIndex + 1) % items.length
        : (currentIndex - 1 + items.length) % items.length;

      setActiveIndex(nextIndex);
      items[nextIndex]?.focus();
    }

    if (e.key === 'Enter' && activeIndex !== null) {
      e.preventDefault();
      listRef.current[activeIndex]?.click();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    handleOpenChange(false);
  };

  // Get user display name and email from Supabase session
  const userEmail = session?.user?.email;
  const userMetadata = session?.user?.user_metadata;
  const userName = userMetadata?.full_name || userMetadata?.name || userEmail?.split('@')[0] || t('auth.defaultUserName');

  const menuItems = [
    {
      id: 'settings',
      label: t('auth.accountSettings'),
      icon: Settings,
      onClick: () => {
        // TODO: Navigate to account settings page when implemented
        handleOpenChange(false);
      },
    },
    {
      id: 'logout',
      label: t('auth.logout'),
      icon: LogOut,
      onClick: handleLogout,
      destructive: true,
    },
  ];

  return (
    <>
      <button
        ref={setReference}
        // eslint-disable-next-line react-hooks/refs -- floating-ui's getReferenceProps only stores onKeyDown to invoke from real DOM events, it never calls it during render, so reading listRef.current inside it is safe
        {...getReferenceProps({
          onClick: () => handleOpenChange(!isOpen),
          onKeyDown: handleKeyDown,
        })}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-ink-light hover:text-ink border border-transparent hover:border-border-subtle transition-all focus:outline-none focus:ring-2 focus:ring-clay-soft/50"
        aria-label="Account menu"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-clay-soft/10 text-clay-soft">
          <User size={14} />
        </div>
        <span className="hidden sm:inline font-medium">{userName}</span>
        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          ref={setFloating}
          style={floatingStyles}
          // eslint-disable-next-line react-hooks/refs -- floating-ui's getFloatingProps only stores onKeyDown to invoke from real DOM events, it never calls it during render, so reading listRef.current inside it is safe
          {...getFloatingProps({
            onKeyDown: handleKeyDown,
          })}
          className="z-50 min-w-[240px] bg-card border border-border-subtle rounded-xl shadow-lg overflow-hidden"
        >
          {/* User Info Section */}
          <div className="px-4 py-3 border-b border-border-subtle">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-clay-soft/10 text-clay-soft">
                <User size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink truncate">{userName}</p>
                <p className="text-xs text-ink-light truncate">{userEmail || t('auth.currentAccount')}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  ref={(el) => {
                    listRef.current[index] = el;
                  }}
                  {...getItemProps({
                    onClick: item.onClick,
                  })}
                  className={`flex items-center gap-3 w-full px-4 py-2 text-sm transition-colors focus:outline-none focus:bg-ink/5 ${
                    item.destructive
                      ? 'text-red-600 dark:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-950/20'
                      : 'text-ink hover:bg-ink/5'
                  }`}
                  role="menuitem"
                  tabIndex={activeIndex === index ? 0 : -1}
                >
                  <Icon size={15} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
