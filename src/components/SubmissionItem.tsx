import { Prisma } from '@/generated/prisma/client';

type SubmissionWithRelations = Prisma.SubmissionGetPayload<{
  include: {
    creator: true;
    term: true;
  };
}>;

const SubmissionItem = ({ id, creator, term, definition, points, wasReviewed, createdAt }: SubmissionWithRelations) => (
  <tr>
    <td>...{id.slice(-4)}</td>
    <td>{creator.name} <small className="text-muted">({creator.email})</small></td>
    <td>
      {term ? (
        <span>
          <strong>{term.word}</strong>{term.week ? ` — Week ${term.week}` : ''}
          <small className="text-muted d-block">CRN {term.courseCRN}</small>
        </span>
      ) : (
        <span className="text-muted">No term</span>
      )}
    </td>
    <td style={{ maxWidth: '300px', wordBreak: 'break-word' }}>{definition}</td>
    <td>{points}</td>
    <td>
      {wasReviewed ? (
        <span className="badge bg-success">Reviewed</span>
      ) : (
        <span className="badge bg-warning text-dark">Pending</span>
      )}
    </td>
    <td>{new Date(createdAt).toLocaleDateString()}</td>
  </tr>
);

export default SubmissionItem;
