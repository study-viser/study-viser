'use client';

import { Form, Button, Col, Container, Card, Row, Image } from 'react-bootstrap';
import { useState } from 'react';
import { enrollStudent } from '@/lib/dbActions';
import { useSession } from 'next-auth/react';
import '@/styles/forms.css';

const JoinCourseForm = () => {
  const { data: session } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const secret = formData.get('courseSecret') as string;

    if (!session?.user?.id) {
      setError('You must be signed in to join a course.');
      return;
    }

    try {
      // enrollStudent looks up course by secret, then connects the student
      await enrollStudent(secret, session.user.id);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join course.');
    }
  };

  return (
    <Container className="course-page">
      <p className="back-link">← Back to Dashboard</p>

      <Card className="course-card">
        <Card.Body>

        <Image src="/courseaddicon.png" className="two-user-icon" alt="Join Course" />
          <h1 className="course-title">Join a Course</h1>

          <p className="course-subtitle">
            Enter the course enrollment code provided by your instructor to enroll in a course.
          </p>

          <hr />

          {error && <p className="text-danger">{error}</p>}
          {success && <p className="text-success">Successfully joined the course!</p>}

          <Form onSubmit={handleSubmit}>
            <Form.Group as={Row} className="mb-4" controlId="courseSecret">
              <Form.Label column sm={12} className="course-label">
                Course Enrollment Code
              </Form.Label>

              <Col sm={12}>
                <Form.Control
                  name="courseSecret"
                  type="text"
                  placeholder="Enter the enrollment code from your instructor"
                  required
                />
              </Col>
            </Form.Group>

            <Row className="mb-4">
              <Col>
                <Form.Text className="course-info-text">
                  <Image src="/info-icon.png" className="course-code-icon" alt="Course Code" />
                  The course enrollment code is provided by your instructor. Contact them if you
                  don&#39;t have it.
                </Form.Text>
              </Col>
            </Row>

            <div className="text-center">
              <Button type="submit" className="submit-button">
                Join Course
              </Button>
            </div>
          </Form>

          <Row className="or-divider">
            <Col><hr /></Col>
            <Col xs="auto">OR</Col>
            <Col><hr /></Col>
          </Row>

          <div className="text-center">
            <Button variant="link" className="browse-link">
              Browse Available Courses
            </Button>
          </div>
        </Card.Body>
      </Card>

      <Card className="help-card">
        <Card.Body>
          <h5>Need help?</h5>
          <p>Contact your instructor if you don&#39;t have a course enrollment code.</p>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default JoinCourseForm;