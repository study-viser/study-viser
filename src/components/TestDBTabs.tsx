'use client';

import { useState } from 'react';
import { Col, Container, Nav, Row, Table } from 'react-bootstrap';
import UserItem from '@/components/UserItem';
import CourseItem from '@/components/CourseItem';
import TermItem from '@/components/TermItem';
import SubmissionItem from '@/components/SubmissionItem';
import { Prisma } from '@/generated/prisma/client';

type Props = {
  users: Prisma.UserGetPayload<{
    include: { taughtCourses: true; enrolledCourses: true; submissions: true };
  }>[];
  courses: Prisma.CourseGetPayload<{
    include: { instructor: true; students: true; listing: true; terms: true };
  }>[];
  terms: Prisma.TermGetPayload<{
    include: { course: true; submissions: true; bestSubmission: true };
  }>[];
  submissions: Prisma.SubmissionGetPayload<{
    include: { creator: true; term: true };
  }>[];
};

type Tab = 'users' | 'courses' | 'terms' | 'submissions';

const TABS: { key: Tab; label: string }[] = [
  { key: 'users',       label: 'Users' },
  { key: 'courses',     label: 'Courses' },
  { key: 'terms',       label: 'Terms' },
  { key: 'submissions', label: 'Submissions' },
];

const TestDBTabs = ({ users, courses, terms, submissions }: Props) => {
  const [active, setActive] = useState<Tab>('users');

  return (
    <Container id="testDB" className="py-4">
      <Nav variant="tabs" className="mb-4">
        {TABS.map(({ key, label }) => (
          <Nav.Item key={key}>
            <Nav.Link
              active={active === key}
              onClick={() => setActive(key)}
              style={{ cursor: 'pointer' }}
            >
              {label}
              <span className="ms-2 badge bg-secondary">
                {key === 'users'       ? users.length
                  : key === 'courses'  ? courses.length
                  : key === 'terms'    ? terms.length
                  : submissions.length}
              </span>
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>

      <Row className="justify-content-center">
        <Col xs={12}>

          {/* Users */}
          {active === 'users' && (
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
          )}

          {/* Courses */}
          {active === 'courses' && (
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
          )}

          {/* Terms */}
          {active === 'terms' && (
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
          )}

          {/* Submissions */}
          {active === 'submissions' && (
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
          )}

        </Col>
      </Row>
    </Container>
  );
};

export default TestDBTabs;
