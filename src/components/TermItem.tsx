import { Prisma } from '@/generated/prisma/client';

type TermWithRelations = Prisma.TermGetPayload<{
  include: {
    course: true;
    submissions: true;
    bestSubmission: true;
  };
}>;

const TermItem = ({ id, word, week, coveredOn, maxSubmissions, courseCRN, course, submissions, bestSubmission }: TermWithRelations) => (
  <tr>
    <td>...{id.slice(-4)}</td>
    <td><strong>{word}</strong></td>
    <td>
      <strong>{courseCRN}</strong>
      <small className="text-muted d-block">{course.code} — {course.title}</small>
    </td>
    <td>{week ?? <span className="text-muted">N/A</span>}</td>
    <td>{new Date(coveredOn).toLocaleDateString()}</td>
    <td>{submissions.length} / {maxSubmissions}</td>
    <td>
      {bestSubmission ? (
        <span>
          ...{bestSubmission.id.slice(-4)}
          <small className="text-muted d-block">{bestSubmission.points} pts</small>
        </span>
      ) : (
        <span className="text-muted">Not selected</span>
      )}
    </td>
  </tr>
);

export default TermItem;
