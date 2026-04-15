import { Prisma } from '@/generated/prisma/client';

// This creates a type that exactly matches a User with its Courses included
type UserWithCourses = Prisma.UserGetPayload<{
  include: { courses: true }
}>

/* Renders a single row in the List Users table. See testDB/page.tsx. */
const UserItem = ({id, name, email, role, courses}: UserWithCourses) => (
  <tr>
    <td>...{id.slice(-8)}</td>
    <td>{name}</td>
    <td>{email}</td>
    <td>{role}</td>
    <td>
      {/* Map the course codes into a comma-separated string */}
      {courses && courses.length > 0 
        ? courses.map((course) => course.code).join(', ') 
        : 'No courses'}
    </td>
  </tr>
);

export default UserItem;
