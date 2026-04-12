/**
 * Seed script – populates the database with demo users and courses.
 *    - Default data in config/settings.development.json
 * Run with:  npx prisma db seed
 */

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Role } from "../src/generated/prisma/client";
import { hash } from 'bcrypt';
import * as config from '../config/settings.development.json';

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set.");
  }
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

const prisma = createPrismaClient();

async function main() {
  // Seeding database
  console.log('Seeding the database');
  // ── Users ──────────────────────────────────────────────────────────────
  const password = await hash('changeme', 10);
  config.defaultUsers.forEach(async (user) => {
    const role = user.role as Role || Role.STUDENT;
    console.log(`  Creating user: ${user.email} with role: ${role}`);
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        name: user.name,
        email: user.email,
        password,
        role,
      },
    });
  });

  // ── Courses ────────────────────────────────────────────────────────────
  for (const course of config.defaultCourses) {
    console.log(`  Creating course: ${course.code} - ${course.title}`);
    await prisma.course.upsert({
      where: { code: course.code },
      update: {},
      create: {
        code: course.code,
        title: course.title,
        description: course.description,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
