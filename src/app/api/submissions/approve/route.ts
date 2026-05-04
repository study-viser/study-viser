import { NextResponse } from 'next/server';
import { approveSubmission } from '@/lib/dbActions';

export async function POST(req: Request) {
  try {
    const { termId, submissionId } = await req.json();

    await approveSubmission(termId, submissionId);

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to approve submission.' },
      { status: 400 },
    );
  }
}