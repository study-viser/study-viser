import { Prisma } from '@/generated/prisma/client';

type SubmissionWithRelations = Prisma.SubmissionGetPayload<{
  include: {
    creator: true;
    term: true;
  };
}>;

const SubmissionItem = ({ id, creator, term, points, wasReviewed, createdAt }: SubmissionWithRelations) => (
  <tr>
    <td>...{id.slice(-4)}</td>
    <td>{creator.name} <small className="text-muted">({creator.email})</small></td>
    <td>
      {term ? (
        <span>...{term.id.slice(-4)} {term.week ? `— Week ${term.week}` : ''}</span>
      ) : (
        <span className="text-muted">No term</span>
      )}
    </td>
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