import { Col, Container, Row, Table } from 'react-bootstrap';
import { prisma } from '@/lib/prisma';
import UserItem from '@/components/UserItem';
import CourseItem from '@/components/CourseItem';

/** Render a list of users and courses. */
const TestPage = async () => {
  
  const users = await prisma.user.findMany({
    include: { courses: true }, // Include related courses for each user
  });
  const courses = await prisma.course.findMany({
    include: { user: true }, // Include related user for each course
  });

  return (
    <main>
      <Container id="testDB">
        <Row className="justify-content-center">
          <Col xs={12} md={11} lg={10}>
            <h1>Users</h1>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Courses</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <UserItem key={user.id} {...user} />
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col xs={12} md={11} lg={10}>
            <h1>Courses</h1>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>    
                    <th>ID</th>
                    <th>Code</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Instructor/TA</th>
                    <th>External URLs</th>
                  </tr>
                </thead>
                <tbody>
                {courses.map((course) => (
                  <CourseItem key={course.id} {...course} />
                ))}
              </tbody>
                </Table>
            </Col>
        </Row>
      </Container>
    </main>
  );
};

export default TestPage;
