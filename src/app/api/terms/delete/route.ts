import { NextResponse } from 'next/server';
import { deleteTerm } from '@/lib/dbActions';

export async function POST(req: Request) {
  try {
    const { termId } = await req.json();

    if (!termId) {
      return NextResponse.json({ error: 'Missing termId.' }, { status: 400 });
    }

    await deleteTerm(termId);

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to delete term.' },
      { status: 400 },
    );
  }
}