import { NextResponse } from 'next/server';
import { createSubmission } from '@/lib/dbActions';

export async function POST(req: Request) {
  try {
    const { creatorId, termId, definition } = await req.json();

    await createSubmission({
      creatorId,
      termId,
      definition,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to submit definition.' },
      { status: 400 },
    );
  }
}