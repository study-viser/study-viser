import { NextResponse } from 'next/server';
import { createUser } from '@/lib/dbActions';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    await createUser({
      name: body.name,
      email: body.email,
      password: body.password,
      role: body.role,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to create user.' },
      { status: 400 },
    );
  }
}