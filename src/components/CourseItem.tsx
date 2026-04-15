import { Prisma } from '@/generated/prisma/client';

// This creates a type that includes the related user
type CourseWithUser = Prisma.CourseGetPayload<{
  include: { user: true }
}>

/* Renders a single row in the List Courses table. */
const CourseItem = ({ id, code, title, description, user }: CourseWithUser) => (
  <tr>
    <td>...{id.slice(-4)}</td>
    <td><strong>{code}</strong></td>
    <td>{title}</td>
    <td>{description || 'No description provided'}</td>
    <td>
      {user ? (
        <span>{user.name} <small className="text-muted">({user.email})</small></span>
      ) : (
        <span className="text-muted italic">Unassigned</span>
      )}
    </td>
  </tr>
);

export default CourseItem;