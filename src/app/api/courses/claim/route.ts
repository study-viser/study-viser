import { NextResponse } from 'next/server';
import { teachCourse } from '@/lib/dbActions';

export async function POST(req: Request) {
  try {
    const { crn, instructorId } = await req.json();

    await teachCourse(crn, instructorId);

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to claim course.' },
      { status: 400 },
    );
  }
}