'use client';

import { Form, Button, Col, Container, Card, Row, Image } from 'react-bootstrap';
import '@/styles/forms.css';

const ClaimCourseForm = () => {
  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    console.log({
      courseCode: formData.get('courseCode'),
      instructorEmail: formData.get('instructorEmail'),
    });

    alert('Course claim submitted!');
  };

  return (
    <Container className="course-page">
      <Card className="course-card">
        <Card.Body>
          <Image src="/claim-icon.png" className="two-user-icon" alt="Claim Course" />
          <h1 className="course-title">Claim a Course</h1>

          <p className="course-subtitle">
            Enter the course information below to request ownership of an existing course.
          </p>

          <hr />

          <Form onSubmit={handleSubmit}>
            <Form.Group as={Row} className="mb-4 align-items-center" controlId="courseCode">
              <Form.Label column sm={4} className="course-label">
                Course Code:
              </Form.Label>

              <Col sm={8}>
                <Form.Control
                  name="courseCode"
                  type="text"
                  placeholder="e.g. ICS314-SP26"
                  required
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-4 align-items-center" controlId="instructorEmail">
              <Form.Label column sm={4} className="course-label">
                Instructor Email:
              </Form.Label>

              <Col sm={8}>
                <Form.Control
                  name="instructorEmail"
                  type="email"
                  placeholder="your.email@example.com"
                  required
                />
              </Col>
            </Form.Group>

            <Row className="mb-4">
              <Col>
                <Form.Text className="course-info-text">
                  <Image src="/info-icon.png" alt="Course Code" className="course-code-icon" />
                  Claiming a course means requesting instructor access to manage an existing course.
                  If the course is already owned, your request may need approval.
                </Form.Text>
              </Col>
            </Row>

            <Row>
              <Col className="text-center">
                <Button type="submit" className="submit-button">
                  Claim Course
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ClaimCourseForm;