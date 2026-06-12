'use client';

import { useEffect, useState } from 'react';
import { Mail, Trash2, CheckCircle, Circle } from 'lucide-react';
import { getDocuments, updateDocument, deleteDocument } from '@/lib/firebase/firestore';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import type { ContactMessage } from '@/lib/types';
import { formatFullDate } from '@/lib/utils';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<(ContactMessage & { id: string })[]>([]);
  const [selected, setSelected] = useState<(ContactMessage & { id: string }) | null>(null);

  const fetchData = async () => {
    const data = await getDocuments<ContactMessage>('contactMessages');
    setMessages(data.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
  };
  useEffect(() => { fetchData(); }, []);

  const toggleRead = async (id: string, isRead: boolean) => {
    await updateDocument('contactMessages', id, { isRead: !isRead });
    await fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    await deleteDocument('contactMessages', id);
    if (selected?.id === id) setSelected(null);
    await fetchData();
  };

  const unreadCount = messages.filter(m => !m.isRead).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text)]">Messages</h1>
          <p className="text-[var(--color-text-secondary)] mt-1">
            {unreadCount > 0 ? `${unreadCount} unread message${unreadCount > 1 ? 's' : ''}` : 'All messages read'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-2 space-y-2 max-h-[70vh] overflow-y-auto">
          {messages.map((msg) => (
            <div
              key={msg.id}
              onClick={() => { setSelected(msg); if (!msg.isRead) toggleRead(msg.id, false); }}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selected?.id === msg.id
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
                  : 'border-[var(--color-border)] bg-[var(--color-surface-elevated)] hover:border-[var(--color-primary)]/30'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {!msg.isRead && <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] flex-shrink-0" />}
                <p className={`text-sm font-medium text-[var(--color-text)] truncate ${!msg.isRead ? 'font-semibold' : ''}`}>{msg.name}</p>
              </div>
              <p className="text-xs text-[var(--color-primary)] truncate">{msg.subject}</p>
              <p className="text-xs text-[var(--color-text-muted)] truncate mt-1">{msg.message}</p>
            </div>
          ))}
          {messages.length === 0 && (
            <Card hover={false}><p className="text-center text-[var(--color-text-muted)] py-8">No messages yet.</p></Card>
          )}
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-3">
          {selected ? (
            <Card hover={false}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-[var(--color-text)]">{selected.subject}</h3>
                  <p className="text-sm text-[var(--color-primary)]">{selected.name} &lt;{selected.email}&gt;</p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">{formatFullDate(selected.createdAt)}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => toggleRead(selected.id, selected.isRead)} className="p-1.5 rounded-lg hover:bg-[var(--color-surface)] text-[var(--color-text-muted)] transition-colors cursor-pointer" title={selected.isRead ? 'Mark unread' : 'Mark read'}>
                    {selected.isRead ? <CheckCircle size={16} className="text-emerald-500" /> : <Circle size={16} />}
                  </button>
                  <button onClick={() => handleDelete(selected.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-[var(--color-text-muted)] hover:text-red-500 transition-colors cursor-pointer">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="border-t border-[var(--color-border)] pt-4">
                <p className="text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-line">{selected.message}</p>
              </div>
              <div className="mt-6">
                <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}>
                  <Button><Mail size={16} /> Reply via Email</Button>
                </a>
              </div>
            </Card>
          ) : (
            <Card hover={false}>
              <div className="text-center py-16 text-[var(--color-text-muted)]">
                <Mail size={40} className="mx-auto mb-3 opacity-50" />
                <p>Select a message to read</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
