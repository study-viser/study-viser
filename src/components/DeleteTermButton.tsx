'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';

type Props = {
  termId: string;
  termWord: string;
};

export default function DeleteTermButton({ termId, termWord }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/terms/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ termId }),
      });

      if (!res.ok) throw new Error('Failed to delete term.');
      router.refresh();
    } catch (err) {
      console.error(err);
      alert('Could not delete term. Please try again.');
    } finally {
      setLoading(false);
      setConfirming(false);
    }
  };

  if (confirming) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ fontSize: '12px', color: '#6B7280' }}>Delete &ldquo;{termWord}&rdquo;?</span>
        <button
          onClick={handleDelete}
          disabled={loading}
          style={{
            background: '#DC2626', color: '#fff', border: 'none',
            borderRadius: '6px', padding: '4px 10px',
            fontSize: '12px', fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? 'Deleting…' : 'Yes, delete'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          disabled={loading}
          style={{
            background: 'transparent', border: '1px solid #E5E7EB',
            borderRadius: '6px', padding: '4px 10px',
            fontSize: '12px', color: '#6B7280', cursor: 'pointer',
          }}
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      title={`Delete "${termWord}"`}
      style={{
        background: 'transparent', border: 'none', cursor: 'pointer',
        color: '#9CA3AF', display: 'flex', alignItems: 'center',
        padding: '4px', borderRadius: '6px', transition: 'color 0.15s',
      }}
      onMouseEnter={e => (e.currentTarget.style.color = '#DC2626')}
      onMouseLeave={e => (e.currentTarget.style.color = '#9CA3AF')}
    >
      <Trash2 size={15} />
    </button>
  );
}