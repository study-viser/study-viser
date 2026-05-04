import { NextResponse } from 'next/server';
import { unenrollStudent } from '@/lib/dbActions';

export async function POST(req: Request) {
  try {
    const { crn, userId } = await req.json();

    await unenrollStudent(crn, userId);

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to exit course.' },
      { status: 400 },
    );
  }
}