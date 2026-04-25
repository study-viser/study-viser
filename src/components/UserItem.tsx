import { Prisma } from '@/generated/prisma/client';

type UserWithRelations = Prisma.UserGetPayload<{
  include: {
    taughtCourses: true;
    enrolledCourses: true;
    submissions: true;
  };
}>;

const UserItem = ({ id, name, email, role, taughtCourses, enrolledCourses, submissions }: UserWithRelations) => (
  <tr>
    <td>...{id.slice(-4)}</td>
    <td>{name}</td>
    <td>{email}</td>
    <td><span className="badge bg-secondary">{role}</span></td>
    <td>
      {taughtCourses.length > 0 ? (
        <ul style={{ paddingLeft: '20px', marginBottom: 0 }}>
          {taughtCourses.map((c) => <li key={c.id}><strong>{c.code}</strong> — {c.title}</li>)}
        </ul>
      ) : <span className="text-muted">None</span>}
    </td>
    <td>
      {enrolledCourses.length > 0 ? (
        <ul style={{ paddingLeft: '20px', marginBottom: 0 }}>
          {enrolledCourses.map((c) => <li key={c.id}><strong>{c.code}</strong> — {c.title}</li>)}
        </ul>
      ) : <span className="text-muted">None</span>}
    </td>
    <td>{submissions.length > 0 ? submissions.length : <span className="text-muted">0</span>}</td>
  </tr>
);

export default UserItem;