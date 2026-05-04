import { NextResponse } from 'next/server';
import { clearTermApproval } from '@/lib/dbActions';

export async function POST(req: Request) {
  try {
    const { termId, submissionId } = await req.json();

    await clearTermApproval(termId, submissionId);

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to clear approval.' },
      { status: 400 },
    );
  }
}