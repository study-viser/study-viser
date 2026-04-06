/**
 * Seed script – populates the database with demo users and courses.
 * Run with:  npx prisma db seed
 */

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Role } from "../src/generated/prisma/client";

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
  // ── Users ──────────────────────────────────────────────────────────────
  const instructor = await prisma.user.upsert({
    where: { email: "instructor@studyviser.dev" },
    update: {},
    create: {
      name: "Alice Instructor",
      email: "instructor@studyviser.dev",
      // NOTE: In production always store a hashed password (e.g. bcrypt).
      // This is a demo-only value and must NOT be used in production.
      password: "DEMO_PASSWORD_NOT_FOR_PRODUCTION",
    },
  });

  const ta = await prisma.user.upsert({
    where: { email: "ta@studyviser.dev" },
    update: {},
    create: {
      name: "Bob TA",
      email: "ta@studyviser.dev",
      password: "DEMO_PASSWORD_NOT_FOR_PRODUCTION",
      role: Role.TA,
    },
  });

  const student = await prisma.user.upsert({
    where: { email: "student@studyviser.dev" },
    update: {},
    create: {
      name: "Carol Student",
      email: "student@studyviser.dev",
      password: "DEMO_PASSWORD_NOT_FOR_PRODUCTION",
      role: Role.STUDENT,
    },
  });

  // ── Courses ────────────────────────────────────────────────────────────
  const cs101 = await prisma.course.upsert({
    where: { code: "CS101" },
    update: {},
    create: {
      code: "CS101",
      title: "Introduction to Computer Science",
      description: "Foundational concepts in computer science.",
      instructorId: instructor.id,
    },
  });

  const cs201 = await prisma.course.upsert({
    where: { code: "CS201" },
    update: {},
    create: {
      code: "CS201",
      title: "Data Structures",
      description: "Arrays, linked lists, trees, graphs, and more.",
      instructorId: instructor.id,
    },
  });

  // ── Enrollments ────────────────────────────────────────────────────────
  await prisma.enrollment.upsert({
    where: { userId_courseId: { userId: student.id, courseId: cs101.id } },
    update: {},
    create: { userId: student.id, courseId: cs101.id, role: Role.STUDENT },
  });

  await prisma.enrollment.upsert({
    where: { userId_courseId: { userId: ta.id, courseId: cs101.id } },
    update: {},
    create: { userId: ta.id, courseId: cs101.id, role: Role.TA },
  });

  await prisma.enrollment.upsert({
    where: { userId_courseId: { userId: student.id, courseId: cs201.id } },
    update: {},
    create: { userId: student.id, courseId: cs201.id, role: Role.STUDENT },
  });

  console.log("✅ Seed complete.");
  console.log(`   Users: ${instructor.name}, ${ta.name}, ${student.name}`);
  console.log(`   Courses: ${cs101.code}, ${cs201.code}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
