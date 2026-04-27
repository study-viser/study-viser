import TermView from '@/components/TermView';
import { use } from 'react';

interface TermPageProps {
  params: Promise<{ termId: string }>;
}

export default function TermPage({ params }: TermPageProps) {
  const { termId } = use(params);
  return <TermView termId={Number(termId)} />;
}