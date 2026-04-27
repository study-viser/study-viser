'use server';

import { hash } from 'bcrypt';
import { prisma } from './prisma';
import { Prisma } from '@/generated/prisma/client';

// ---------------------------------------------------------------------------
// Available Actions
// ---------------------------------------------------------------------------
//
// User
//   createUser(credentials)          — create a new user (hashes password)
//   getUserById(id)                  — find user by ID, includes courses & submissions
//   getUserByEmail(email)            — find user by email
//   getAllUsers()                    — list all users
//   updateUser(id, data)             — update user fields (re-hashes password if changed)
//   deleteUser(id)                   — delete user by ID
//
// Course
//   createCourse(data)               — create a new course
//   getCourseBycrn(crn)              — find course by CRN, includes instructor/students/terms
//   getCourseByCode(code)            — find course by code, includes instructor/students/terms
//   getAllCourses()                  — list all courses with instructor and listing
//   updateCourse(crn, data)          — update course fields
//   deleteCourse(crn)                — delete course by CRN
//   enrollStudent(crn, userId)       — add a student to a course
//   unenrollStudent(crn, userId)     — remove a student from a course
//
// Listing
//   createListing(data)              — create a new course listing
//   getListingByCode(code)           — find listing by code, includes courses
//   getAllListings()                 — list all listings
//   updateListing(code, data)        — update listing fields
//   deleteListing(code)              — delete listing by code
//
// Term
//   createTerm(data)                 — create a new term under a course
//   getTermById(id)                  — find term by ID, includes submissions
//   getTermsByCourse(courseCRN)      — list all terms for a course, ordered by date
//   updateTerm(id, data)             — update term fields
//   deleteTerm(id)                   — delete term by ID
//
// Submission
//   createSubmission(data)           — create a submission with definition (wasReviewed defaults false, points defaults 0)
//   getSubmissionById(id)            — find submission by ID, includes creator and term
//   getSubmissionsByTerm(termId)     — list all submissions for a term
//   getSubmissionsByUser(creatorId)  — list all submissions by a user
//   reviewSubmission(id, points)     — mark submission reviewed and assign points
//   updateSubmission(id, data)       — update submission fields
//   deleteSubmission(id)             — delete submission by ID
//   reviewSubmission(id)             — mark a submission as reviewed, grants 1 participation point
//   approveSubmission(termId, subId) — set the winning submission, grants 4 bonus points
//   clearTermApproval(termId, subId) — remove the winning submission, drops winner back to 1 point
//   getExtraCreditByUser(userId)     — total points + breakdown for a user
//   getExtraCreditByCourse(courseCRN)— per-student extra credit totals for a course
// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function handlePrismaError(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        throw new Error(`A record with that unique value already exists.`);
      case 'P2025':
        throw new Error(`Record not found.`);
      default:
        throw new Error(`Database error: ${error.code}`);
    }
  }
  throw error;
}

// ---------------------------------------------------------------------------
// User
// ---------------------------------------------------------------------------

export async function createUser(credentials: {
  name: string;
  email: string;
  password: string;
  // ADMIN role is intentionally included — guard this at the call site
  role: 'STUDENT' | 'TA' | 'INSTRUCTOR' | 'ADMIN';
}) {
  try {
    const password = await hash(credentials.password, 10);
    await prisma.user.create({
      data: {
        name: credentials.name,
        email: credentials.email,
        password,
        role: credentials.role,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new Error('A user with that email already exists.');
    }
    throw error;
  }
  return { success: true, email: credentials.email };
}

export async function getUserById(id: string) {
  try {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        taughtCourses: true,
        enrolledCourses: true,
        submissions: true,
      },
    });
  } catch (error) {
    handlePrismaError(error);
  }
}

export async function getUserByEmail(email: string) {
  try {
    return await prisma.user.findUnique({ where: { email } });
  } catch (error) {
    handlePrismaError(error);
  }
}

export async function getAllUsers() {
  try {
    return await prisma.user.findMany();
  } catch (error) {
    handlePrismaError(error);
  }
}

export async function updateUser(
  id: string,
  data: Partial<{
    name: string;
    email: string;
    password: string;
    role: 'STUDENT' | 'TA' | 'INSTRUCTOR' | 'ADMIN';
  }>
) {
  try {
    if (data.password) {
      data.password = await hash(data.password, 10);
    }
    return await prisma.user.update({ where: { id }, data });
  } catch (error) {
    handlePrismaError(error);
  }
}

export async function deleteUser(id: string) {
  try {
    await prisma.user.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    handlePrismaError(error);
  }
}

// ---------------------------------------------------------------------------
// Course
// ---------------------------------------------------------------------------

export async function createCourse(data: {
  crn: number;
  code: string;
  title: string;
  description?: string;
  location: string;
  instructorId?: string;
  listingId?: string;
  externalURLs?: string[];
}) {
  try {
    return await prisma.course.create({ data });
  } catch (error) {
    handlePrismaError(error);
  }
}

export async function getCourseBycrn(crn: number) {
  try {
    return await prisma.course.findUnique({
      where: { crn },
      include: {
        instructor: true,
        students: true,
        listing: true,
        terms: true,
      },
    });
  } catch (error) {
    handlePrismaError(error);
  }
}

export async function getCourseByCode(code: string) {
  try {
    return await prisma.course.findUnique({
      where: { code },
      include: {
        instructor: true,
        students: true,
        listing: true,
        terms: true,
      },
    });
  } catch (error) {
    handlePrismaError(error);
  }
}

export async function getAllCourses() {
  try {
    return await prisma.course.findMany({
      include: { instructor: true, listing: true },
    });
  } catch (error) {
    handlePrismaError(error);
  }
}

export async function updateCourse(
  crn: number,
  data: Partial<{
    code: string;
    title: string;
    description: string;
    location: string;
    instructorId: string;
    listingId: string;
    externalURLs: string[];
  }>
) {
  try {
    return await prisma.course.update({ where: { crn }, data });
  } catch (error) {
    handlePrismaError(error);
  }
}

export async function deleteCourse(crn: number) {
  try {
    await prisma.course.delete({ where: { crn } });
    return { success: true };
  } catch (error) {
    handlePrismaError(error);
  }
}

/** Enroll a student in a course */
export async function enrollStudent(crn: number, studentId: string) {
  try {
    return await prisma.course.update({
      where: { crn },
      data: { students: { connect: { id: studentId } } },
    });
  } catch (error) {
    handlePrismaError(error);
  }
}

/** Remove a student from a course */
export async function unenrollStudent(crn: number, studentId: string) {
  try {
    return await prisma.course.update({
      where: { crn },
      data: { students: { disconnect: { id: studentId } } },
    });
  } catch (error) {
    handlePrismaError(error);
  }
}

// ---------------------------------------------------------------------------
// Listing
// ---------------------------------------------------------------------------

export async function createListing(data: {
  code: string;
  subject: string;
  title: string;
  credits: string;
  description?: string;
  prerequisites?: string;
  corequisites?: string;
  genEd?: string;
  gradeOption?: string;
  repeatable?: string;
  majorRestrictions?: string;
  classStanding?: string;
  crossListed?: string;
  externalURLs?: string[];
}) {
  try {
    return await prisma.listing.create({ data });
  } catch (error) {
    handlePrismaError(error);
  }
}

export async function getListingByCode(code: string) {
  try {
    return await prisma.listing.findUnique({
      where: { code },
      include: { courses: true },
    });
  } catch (error) {
    handlePrismaError(error);
  }
}

export async function getAllListings() {
  try {
    return await prisma.listing.findMany();
  } catch (error) {
    handlePrismaError(error);
  }
}

export async function updateListing(
  code: string,
  data: Partial<{
    subject: string;
    title: string;
    credits: string;
    description: string;
    prerequisites: string;
    corequisites: string;
    genEd: string;
    gradeOption: string;
    repeatable: string;
    majorRestrictions: string;
    classStanding: string;
    crossListed: string;
    externalURLs: string[];
  }>
) {
  try {
    return await prisma.listing.update({ where: { code }, data });
  } catch (error) {
    handlePrismaError(error);
  }
}

export async function deleteListing(code: string) {
  try {
    await prisma.listing.delete({ where: { code } });
    return { success: true };
  } catch (error) {
    handlePrismaError(error);
  }
}

// ---------------------------------------------------------------------------
// Term
// ---------------------------------------------------------------------------

export async function createTerm(data: {
  courseCRN: number;
  word: string;
  maxSubmissions: number;
  week?: number;
  coveredOn?: Date;
}) {
  try {
    return await prisma.term.create({ data });
  } catch (error) {
    handlePrismaError(error);
  }
}

export async function getTermById(id: string) {
  try {
    return await prisma.term.findUnique({
      where: { id },
      include: {
        course: true,
        submissions: true,
        bestSubmission: true,
      },
    });
  } catch (error) {
    handlePrismaError(error);
  }
}

export async function getTermsByCourse(courseCRN: number) {
  try {
    return await prisma.term.findMany({
      where: { courseCRN },
      include: { submissions: true, bestSubmission: true },
      orderBy: { coveredOn: 'asc' },
    });
  } catch (error) {
    handlePrismaError(error);
  }
}

export async function updateTerm(
  id: string,
  data: Partial<{
    maxSubmissions: number;
    week: number;
    coveredOn: Date;
  }>
) {
  try {
    return await prisma.term.update({ where: { id }, data });
  } catch (error) {
    handlePrismaError(error);
  }
}

export async function deleteTerm(id: string) {
  try {
    await prisma.term.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    handlePrismaError(error);
  }
}

// ---------------------------------------------------------------------------
// Submission
// ---------------------------------------------------------------------------

export async function createSubmission(data: {
  creatorId: string;
  termId: string;
  definition: string; // written text, URL, or file reference
  points?: number;
}) {
  try {
    return await prisma.submission.create({
      data: {
        creatorId: data.creatorId,
        termId: data.termId,
        definition: data.definition,
        points: data.points ?? 0,
        wasReviewed: false,
      },
    });
  } catch (error) {
    handlePrismaError(error);
  }
}

export async function getSubmissionById(id: string) {
  try {
    return await prisma.submission.findUnique({
      where: { id },
      include: { creator: true, term: true },
    });
  } catch (error) {
    handlePrismaError(error);
  }
}

export async function getSubmissionsByTerm(termId: string) {
  try {
    return await prisma.submission.findMany({
      where: { termId },
      include: { creator: true },
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    handlePrismaError(error);
  }
}

export async function getSubmissionsByUser(creatorId: string) {
  try {
    return await prisma.submission.findMany({
      where: { creatorId },
      include: { term: true },
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    handlePrismaError(error);
  }
}

/** Mark a submission as reviewed by the instructor, grants 1 participation point */
export async function reviewSubmission(id: string) {
  try {
    return await prisma.submission.update({
      where: { id },
      data: { wasReviewed: true, points: 1 },
    });
  } catch (error) {
    handlePrismaError(error);
  }
}

export async function updateSubmission(
  id: string,
  data: Partial<{
    definition: string;
    points: number;
    wasReviewed: boolean;
    termId: string;
  }>
) {
  try {
    return await prisma.submission.update({ where: { id }, data });
  } catch (error) {
    handlePrismaError(error);
  }
}

export async function deleteSubmission(id: string) {
  try {
    await prisma.submission.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    handlePrismaError(error);
  }
}

// ---------------------------------------------------------------------------
// Approval Flow
// ---------------------------------------------------------------------------

/** Set the winning submission for a term, grants 4 bonus points on top of the participation point */
export async function approveSubmission(termId: string, submissionId: string) {
  try {
    return await prisma.$transaction(async (tx) => {
      // 1. Set the winner on the term
      await tx.term.update({
        where: { id: termId },
        data: { bestSubmissionId: submissionId },
      });

      // 2. Reset all OTHER submissions in this term back to 1 point
      await tx.submission.updateMany({
        where: {
          termId,
          id: { not: submissionId },
        },
        data: {
          points: 1,
        },
      });

      // 3. Set winner to 5 points (1 + 4 bonus)
      await tx.submission.update({
        where: { id: submissionId },
        data: {
          wasReviewed: true,
          points: 5,
        },
      });
    });
  } catch (error) {
    handlePrismaError(error);
  }
}

/** Remove the winning submission from a term, drops winner back to 1 participation point */
export async function clearTermApproval(termId: string, submissionId: string) {
  try {
    return await prisma.$transaction(async (tx) => {
      await tx.term.update({
        where: { id: termId },
        data: { bestSubmissionId: null },
      });
      await tx.submission.update({
        where: { id: submissionId },
        data: { points: 1 },
      });
    });
  } catch (error) {
    handlePrismaError(error);
  }
}

// ---------------------------------------------------------------------------
// Extra Credit Tracking
// ---------------------------------------------------------------------------

/** Get total extra credit earned by a user, with a per-submission breakdown */
export async function getExtraCreditByUser(userId: string) {
  try {
    const submissions = await prisma.submission.findMany({
      where: { creatorId: userId, wasReviewed: true, points: { gt: 0 } },
      include: { term: true },
    });

    const total = submissions.reduce((sum, s) => sum + s.points, 0);
    return { total, breakdown: submissions };
  } catch (error) {
    handlePrismaError(error);
  }
}

/** Get extra credit totals for all students in a course */
export async function getExtraCreditByCourse(courseCRN: number) {
  try {
    const course = await prisma.course.findUnique({
      where: { crn: courseCRN },
      include: {
        students: {
          include: {
            submissions: {
              where: { wasReviewed: true, points: { gt: 0 } },
              include: { term: true },
            },
          },
        },
      },
    });

    if (!course) return null;

    return course.students.map((student) => ({
      student: { id: student.id, name: student.name, email: student.email },
      total: student.submissions.reduce((sum, s) => sum + s.points, 0),
      breakdown: student.submissions,
    }));
  } catch (error) {
    handlePrismaError(error);
  }
}