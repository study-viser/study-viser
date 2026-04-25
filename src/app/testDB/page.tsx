import { Col, Container, Row, Table } from 'react-bootstrap';
import { prisma } from '@/lib/prisma';
import UserItem from '@/components/UserItem';
import CourseItem from '@/components/CourseItem';
import TermItem from '@/components/TermItem';
import SubmissionItem from '@/components/SubmissionItem';

/** Render a list of users, courses, terms, and submissions. */
const TestPage = async () => {

  const users = await prisma.user.findMany({
    include: {
      taughtCourses: true,
      enrolledCourses: true,
      submissions: true,
    },
  });

  const courses = await prisma.course.findMany({
    include: {
      instructor: true,
      students: true,
      listing: true,
      terms: true,
    },
  });

  const terms = await prisma.term.findMany({
    include: {
      course: true,
      submissions: true,
      bestSubmission: true,
    },
  });

  const submissions = await prisma.submission.findMany({
    include: {
      creator: true,
      term: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <main>
      <Container id="testDB">

        {/* Users */}
        <Row className="justify-content-center">
          <Col xs={12} md={11} lg={10}>
            <h1>Users</h1>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Taught Courses</th>
                  <th>Enrolled Courses</th>
                  <th>Submissions</th>
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

        {/* Courses */}
        <Row className="justify-content-center">
          <Col xs={12} md={11} lg={10}>
            <h1>Courses</h1>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>CRN</th>
                  <th>Code</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Location</th>
                  <th>Instructor</th>
                  <th>Students</th>
                  <th>Listing</th>
                  <th>External URLs</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <CourseItem key={course.crn} {...course} />
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>

        {/* Terms */}
        <Row className="justify-content-center">
          <Col xs={12} md={11} lg={10}>
            <h1>Terms</h1>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Word</th>
                  <th>Course</th>
                  <th>Week</th>
                  <th>Covered On</th>
                  <th>Submissions</th>
                  <th>Best Submission</th>
                </tr>
              </thead>
              <tbody>
                {terms.map((term) => (
                  <TermItem key={term.id} {...term} />
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>

        {/* Submissions */}
        <Row className="justify-content-center">
          <Col xs={12} md={11} lg={10}>
            <h1>Submissions</h1>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Creator</th>
                  <th>Term</th>
                  <th>Definition</th>
                  <th>Points</th>
                  <th>Reviewed</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission) => (
                  <SubmissionItem key={submission.id} {...submission} />
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
