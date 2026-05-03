import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import BackButton from '@/components/BackButton';
import Flashcard from '@/components/Flashcard';

export default async function StudyGuidePage() {
  const session = await auth();
  const userId = session?.user?.id;

  const terms = await prisma.term.findMany({
    where: {
      course: {
        students: {
          some: {
            id: userId,
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
          <h1 className="card-title">Study Guide</h1>
          <p>Practice approved glossary terms as flashcards.</p>
        </div>
      </section>

      <section className="section">
        <div className="card">
          {terms.length === 0 ? (
            <p>No approved flashcards yet.</p>
          ) : (
            <div className="term-grid">
              {terms.map((term) => {
                const approvedSubmission = term.submissions[0];

                return (
                  <Flashcard
                    key={term.id}
                    term={term.word}
                    definition={approvedSubmission.definition}
                    courseCode={term.course.code}
                  />
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}