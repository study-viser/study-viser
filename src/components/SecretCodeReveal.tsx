'use client';

import { useState } from 'react';
import '@/styles/course-forms.css';

export default function SecretCodeToggle({ secret }: { secret: string | null | undefined }) {
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!secret) return;
    navigator.clipboard.writeText(secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="secret-toggle-wrapper">
      {!isVisible ? (
        <button onClick={() => setIsVisible(true)} className="secret-toggle-outline">
          Show Enrollment Code
        </button>
      ) : (
        <div className="secret-field">
          <button onClick={() => setIsVisible(false)} className="secret-copy-btn">
            Hide
          </button>
          <span className="secret-value">{secret ?? 'No code found'}</span>
          <button onClick={handleCopy} className="secret-copy-btn">
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      )}
    </div>
  );
}
