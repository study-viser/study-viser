'use client';

import { Form, Button, Col, Container, Card, Row, Image } from 'react-bootstrap';
import '@/styles/forms.css';

const JoinCourseForm = () => {
  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    console.log({
      courseCode: formData.get('courseCode'),
    });

    alert('Joined course!');
  };

  return (
    <Container className="course-page">
      <p className="back-link">← Back to Dashboard</p>

      <Card className="course-card">
        <Card.Body>

        <Image src="/courseaddicon.png" className="two-user-icon" alt="Join Course" />
          <h1 className="course-title">Join a Course</h1>

          <p className="course-subtitle">
            Enter the course code provided by your instructor to enroll in a course.
          </p>

          <hr />

          <Form onSubmit={handleSubmit}>
            <Form.Group as={Row} className="mb-4" controlId="courseCode">
              <Form.Label column sm={12} className="course-label">
                Course Code
              </Form.Label>

              <Col sm={12}>
                <Form.Control
                  name="courseCode"
                  type="text"
                  placeholder="e.g. PHYL141 or ICS314-SP26"
                  required
                />
              </Col>
            </Form.Group>

            <Row className="mb-4">
              <Col>
                <Form.Text className="course-info-text">
                  <Image src="/info-icon.png" className="course-code-icon" alt="Course Code" />
                  Course codes are case-insensitive and may include letters,
                  numbers, and dashes.
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
          <p>Contact your instructor if you don&#39;t have a course code.</p>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default JoinCourseForm;