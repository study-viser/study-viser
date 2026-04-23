import { Prisma } from '@/generated/prisma/client';

// This creates a type that includes the related user
type CourseWithUser = Prisma.CourseGetPayload<{
  include: { user: true }
}>

/* Renders a single row in the List Courses table. */
const CourseItem = ({ id, code, title, description, user, externalURLs }: CourseWithUser) => (
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
    <td>
      {externalURLs && externalURLs.length > 0 ? (
          <ul style={{ paddingLeft: '20px', marginBottom: '0' }}>
            {externalURLs.map((url: string, index: number) => (
              <li key={index}>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  {url}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          "None"
        )}
    </td>
  </tr>
);

export default CourseItem;