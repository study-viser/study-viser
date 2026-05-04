import { NextResponse } from 'next/server';
import { enrollStudent } from '@/lib/dbActions';

export async function POST(req: Request) {
  try {
    const { secret, userId } = await req.json();

    await enrollStudent(secret, userId);

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to join course.' },
      { status: 400 },
    );
  }
}