'use client';
import { useRouter } from 'next/navigation';

export default function BackButton() {
  const router = useRouter();

  return (
    <button className="back-link-btn" onClick={() => router.back()}>
      ← Back
    </button>
  );
}