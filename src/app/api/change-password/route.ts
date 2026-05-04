import { NextResponse } from 'next/server';
import { changePassword } from '@/lib/changePassword';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    await changePassword({
      currentPassword: body.currentPassword,
      newPassword: body.newPassword,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to change password.' },
      { status: 400 },
    );
  }
}