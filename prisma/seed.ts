/**
 * Seed script – populates the database with demo users and courses.
 *    - Default data in config/settings.development.json
 * Run with:  npx prisma db seed
 */

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Role } from "../src/generated/prisma/client";
import { hash } from 'bcrypt';
import * as config from '../config/settings.development.json';
import { parse } from 'csv-parse/sync'
import * as fs from 'fs'
import * as path from 'path'
import type { ListingRow } from '../src/lib/types';

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

  // ── Courses ────────────────────────────────────────────────────────────
  // Upload coure listings from CSV file
  const csvPath = path.join(__dirname, 'uh_manoa_courses.csv')
  const content = fs.readFileSync(csvPath, 'utf-8')

  const records = parse(content, {
    columns: true,
    skip_empty_lines: true,
  }) as ListingRow[];

  await prisma.listing.createMany({
  data: records.map((row) => ({
    code: row.code,
        subject: row.subject,
        title: row.title,
        credits: row.credits,
        description: row.description || null,
        prerequisites: row.prerequisites || null,
        corequisites: row.corequisites || null,
        genEd: row.gen_ed || null,
        gradeOption: row.grade_option || null,
        repeatable: row.repeatable || null,
        majorRestrictions: row.major_restrictions || null,
        classStanding: row.class_standing || null,
        crossListed: row.cross_listed || null,
    })),
    skipDuplicates: true,
  })

  console.log(`Seeded ${records.length} courses`)

  for (const course of config.defaultCourses) {
    console.log(`  Creating course: ${course.code} - ${course.title}`);
      
  const listing = await prisma.listing.findUnique({
    where: { code: course.code },
  });

  await prisma.course.upsert({
    where: { code: course.code },
    update: {},
    create: {
      code: course.code,
      title: listing?.title ?? course.title,
      description: listing?.description ?? course.description,
      listing: {
        connect: { code: course.code },
      },
    },
    });
  }

  // ── Users ──────────────────────────────────────────────────────────────
  const password = await hash('changeme', 10);
  for (const user of config.defaultUsers) {
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
        courses: {
          connect: user.courses?.map((code: string) => ({ code })) || [],
        }
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
