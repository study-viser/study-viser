import { NextResponse } from 'next/server';
import { createTerm } from '@/lib/dbActions';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    await createTerm({
      courseCRN: body.courseCRN,
      word: body.word,
      maxSubmissions: body.maxSubmissions,
      referenceDefinition: body.referenceDefinition,
      week: body.week,
      coveredOn: body.coveredOn ? new Date(body.coveredOn) : undefined,
      difficulty: body.difficulty,
      imageRequired: body.imageRequired,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to create term.' },
      { status: 400 },
    );
  }
}