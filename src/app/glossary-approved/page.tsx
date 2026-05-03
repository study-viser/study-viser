import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import BackButton from '@/components/BackButton';

export default async function GlossaryApprovedPage() {
  const session = await auth();

  const terms = await prisma.term.findMany({
    where: {
      course: {
        students: {
          some: {
            id: session?.user?.id,
          },
        },
      },
      submissions: {
        some: {
          wasReviewed: true,
          points: {
            gt: 0,
          },
        },
      },
    },
    include: {
      course: true,
      submissions: {
        where: {
          wasReviewed: true,
          points: {
            gt: 0,
          },
        },
        include: {
          creator: true,
        },
      },
    },
    orderBy: [
      {
        course: {
          code: 'asc',
        },
      },
      {
        word: 'asc',
      },
    ],
  });

  return (
    <main className="page-container">
      <BackButton />

      <section className="section">
        <div className="card">
          <h1 className="card-title">Official Glossary</h1>
          <p>
            Study approved definitions from your enrolled courses.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="card">
          {terms.length === 0 ? (
            <p>No approved glossary terms yet.</p>
          ) : (
            <div className="term-grid">
              {terms.map((term) => {
                const approvedSubmission = term.submissions[0];

                return (
                  <div key={term.id} className="term-card">
                    <p className="term-submissions">
                      {term.course.code}
                    </p>

                    <h3 className="term-name">{term.word}</h3>

                    <p>
                      {approvedSubmission.definition}
                    </p>

                    <span className={`term-difficulty difficulty-${term.difficulty.toLowerCase()}`}>
                      {term.difficulty}
                    </span>

                    <div className="term-card-actions">
                      <Link
                        href={`/courses/${term.course.crn}/terms/${term.id}`}
                        className="btn-view-term"
                      >
                        View Term →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}