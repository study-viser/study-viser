import TermView from '@/components/TermView';

interface TermPageProps {
  params: { termId: string };
}

export default function TermPage({ params }: TermPageProps) {
  return <TermView termId={Number(params.termId)} />;
}