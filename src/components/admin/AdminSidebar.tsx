'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, User, FolderKanban, Wrench, Briefcase, Award,
  FileText, Share2, MessageSquare, Settings, LogOut, ChevronLeft, Menu,
} from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { signOut } from '@/lib/firebase/auth';
import { cn } from '@/lib/utils';

const ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  LayoutDashboard, User, FolderKanban, Wrench, Briefcase, Award,
  FileText, Share2, MessageSquare, Settings,
};

import { ADMIN_NAV_ITEMS } from '@/lib/constants';

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text)] shadow-lg cursor-pointer"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed md:static z-50 md:z-auto h-screen bg-[var(--color-surface-elevated)] border-r border-[var(--color-border)] transition-all duration-300 flex flex-col',
          collapsed ? 'w-[72px]' : 'w-64',
          mobileOpen ? 'left-0' : '-left-64 md:left-0'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-[var(--color-border)]">
            <div className="flex items-center justify-between">
              {!collapsed && <h2 className="text-lg font-bold gradient-text">Admin Panel</h2>}
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="hidden md:flex p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-colors cursor-pointer"
              >
                <ChevronLeft size={18} className={cn('transition-transform', collapsed && 'rotate-180')} />
              </button>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 py-4 space-y-1 px-3 overflow-y-auto">
            {ADMIN_NAV_ITEMS.map((item) => {
              const Icon = ICONS[item.icon];
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-[var(--color-primary)] text-white shadow-md shadow-[var(--color-primary)]/20'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)]'
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  {Icon && <Icon size={18} />}
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* User / Logout */}
          <div className="p-3 border-t border-[var(--color-border)]">
            {!collapsed && user && (
              <p className="text-xs text-[var(--color-text-muted)] mb-2 px-3 truncate">
                {user.email}
              </p>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
              title={collapsed ? 'Logout' : undefined}
            >
              <LogOut size={18} />
              {!collapsed && 'Logout'}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
