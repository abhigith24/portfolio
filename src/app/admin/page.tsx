'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FolderKanban, Wrench, MessageSquare, Eye, Award, Briefcase } from 'lucide-react';
import { getDocuments, getDocument } from '@/lib/firebase/firestore';
import Card from '@/components/ui/Card';
import type { GeneralSettings, ContactMessage } from '@/lib/types';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    experiences: 0,
    certifications: 0,
    messages: 0,
    unreadMessages: 0,
    visitors: 0,
  });
  const [recentMessages, setRecentMessages] = useState<(ContactMessage & { id: string })[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projectsData, skillsData, experiencesData, certsData, messagesData, settings] = await Promise.all([
          getDocuments('projects'),
          getDocuments('skills'),
          getDocuments('experiences'),
          getDocuments('certifications'),
          getDocuments<ContactMessage>('contactMessages'),
          getDocument<GeneralSettings>('settings', 'general'),
        ]);

        setStats({
          projects: projectsData.length,
          skills: skillsData.length,
          experiences: experiencesData.length,
          certifications: certsData.length,
          messages: messagesData.length,
          unreadMessages: messagesData.filter(m => !m.isRead).length,
          visitors: settings?.visitorCount || 0,
        });

        setRecentMessages(
          messagesData
            .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
            .slice(0, 5)
        );
      } catch (err) {
        console.error('Dashboard error:', err);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Projects', value: stats.projects, icon: FolderKanban, color: 'text-violet-500 bg-violet-500/10' },
    { label: 'Skills', value: stats.skills, icon: Wrench, color: 'text-blue-500 bg-blue-500/10' },
    { label: 'Experience', value: stats.experiences, icon: Briefcase, color: 'text-emerald-500 bg-emerald-500/10' },
    { label: 'Certifications', value: stats.certifications, icon: Award, color: 'text-amber-500 bg-amber-500/10' },
    { label: 'Messages', value: stats.messages, icon: MessageSquare, color: 'text-pink-500 bg-pink-500/10', extra: stats.unreadMessages > 0 ? `${stats.unreadMessages} unread` : undefined },
    { label: 'Visitors', value: stats.visitors, icon: Eye, color: 'text-cyan-500 bg-cyan-500/10' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-text)]">Dashboard</h1>
        <p className="text-[var(--color-text-secondary)] mt-1">Welcome to your portfolio admin panel.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {statCards.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
          >
            <Card hover={false}>
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <stat.icon size={22} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[var(--color-text)]">{stat.value}</p>
                  <p className="text-sm text-[var(--color-text-secondary)]">{stat.label}</p>
                  {stat.extra && (
                    <p className="text-xs text-[var(--color-primary)] font-medium">{stat.extra}</p>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Messages */}
      <div>
        <h2 className="text-xl font-semibold text-[var(--color-text)] mb-4">Recent Messages</h2>
        {recentMessages.length === 0 ? (
          <Card hover={false}>
            <p className="text-center text-[var(--color-text-muted)] py-8">No messages yet.</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {recentMessages.map((msg) => (
              <Card key={msg.id} hover={false}>
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-[var(--color-text)] truncate">{msg.name}</p>
                      {!msg.isRead && (
                        <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-[var(--color-primary)] truncate">{msg.subject}</p>
                    <p className="text-sm text-[var(--color-text-secondary)] truncate mt-1">{msg.message}</p>
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)] flex-shrink-0">
                    {msg.email}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
