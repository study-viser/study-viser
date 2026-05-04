import { hash, compare } from 'bcrypt';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function changePassword(credentials: {
  currentPassword: string;
  newPassword: string;
}) {
  const session = await auth();

  if (!session?.user?.email) {
    throw new Error('You must be logged in to change your password.');
  }

  if (!credentials.currentPassword || !credentials.newPassword) {
    throw new Error('Please fill out all password fields.');
  }

  if (credentials.newPassword.length < 6) {
    throw new Error('New password must be at least 6 characters.');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    throw new Error('User not found.');
  }

  const currentPasswordIsCorrect = await compare(
    credentials.currentPassword,
    user.password,
  );

  if (!currentPasswordIsCorrect) {
    throw new Error('Current password is incorrect.');
  }

  const isSamePassword = await compare(credentials.newPassword, user.password);

  if (isSamePassword) {
    throw new Error('New password must be different from your current password.');
  }

  const hashedPassword = await hash(credentials.newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });

  return { success: true };
}