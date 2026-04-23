'use server';

import { Role } from '../generated/prisma/client';
import { hash } from 'bcrypt';
import { prisma } from './prisma';

/**
 * Creates a new user in the database.
 * @param credentials, an object with the following properties: name, email, password, role.
 */
export async function createUser(credentials: {
  name: string;
  email: string;
  password: string;
  role: 'STUDENT' | 'TA' | 'INSTRUCTOR';
}) {
  const password = await hash(credentials.password, 10);

  await prisma.user.create({
    data: {
      name: credentials.name,
      email: credentials.email,
      password,
      role: credentials.role as Role,
    },
  });
}
