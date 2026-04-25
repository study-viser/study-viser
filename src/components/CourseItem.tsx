import { Prisma } from '@/generated/prisma/client';

type CourseWithRelations = Prisma.CourseGetPayload<{
  include: {
    instructor: true;
    students: true;
    listing: true;
    terms: true;
  };
}>;

const CourseItem = ({ crn, code, title, description, location, instructor, students, listing, externalURLs }: CourseWithRelations) => (
  <tr>
    <td><strong>{crn}</strong></td>
    <td>{code}</td>
    <td>{title}</td>
    <td>{description || <span className="text-muted">None</span>}</td>
    <td>{location || <span className="text-muted">TBD</span>}</td>
    <td>
      {instructor ? (
        <span>{instructor.name} <small className="text-muted">({instructor.email})</small></span>
      ) : (
        <span className="text-muted">Unassigned</span>
      )}
    </td>
    <td>{students.length > 0 ? students.length : <span className="text-muted">0</span>}</td>
    <td>{listing ? <strong>{listing.code}</strong> : <span className="text-muted">None</span>}</td>
    <td>
      {externalURLs.length > 0 ? (
        <ul style={{ paddingLeft: '20px', marginBottom: 0 }}>
          {externalURLs.map((url, i) => (
            <li key={i}>
              <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
            </li>
          ))}
        </ul>
      ) : 'None'}
    </td>
  </tr>
);

export default CourseItem;
