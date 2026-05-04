import { NextResponse } from 'next/server';
import { reviewSubmission } from '@/lib/dbActions';

export async function POST(req: Request) {
  try {
    const { submissionId } = await req.json();

    await reviewSubmission(submissionId);

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to review submission.' },
      { status: 400 },
    );
  }
}