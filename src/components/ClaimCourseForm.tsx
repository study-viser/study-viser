'use client';

import { Form, Button, Col, Container, Card, Row, Image } from 'react-bootstrap';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { teachCourse } from '@/lib/dbActions';
import BackButton from '@/components/BackButton';

import '@/styles/forms.css';
import '@/styles/course-forms.css';

const ClaimCourseForm = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    if (!session?.user?.id) {
      setError('You must be signed in to claim a course.');
      setSubmitting(false);
      return;
    }

    if (session.user.role !== 'INSTRUCTOR') {
      setError('Only instructors can claim a course.');
      setSubmitting(false);
      return;
    }

    const formData = new FormData(e.currentTarget);
    const crn = parseInt(formData.get('crn') as string, 10);

    if (Number.isNaN(crn)) {
      setError('Please enter a valid CRN.');
      setSubmitting(false);
      return;
    }

    try {
      await teachCourse(crn, session.user.id);
      router.push('/instructor-dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to claim course.');
      setSubmitting(false);
    }
  };

  return (
    <Container className="course-form-page">
      <div className="form-heading-wrap">
        <BackButton />
      </div>
      <Card className="course-form-card">
        <Card.Body>
          <Image src="/claim-icon.png" className="two-user-icon" alt="Claim Course" />
          <h1 className="course-form-title">Claim a Course</h1>

          <p className="course-form-subtitle">
            Enter the CRN of the course you want to claim as instructor.
          </p>

          <hr />

          {error && <p className="text-danger">{error}</p>}

          <Form onSubmit={handleSubmit}>
            <Form.Group as={Row} className="mb-4 align-items-center" controlId="crn">
              <Form.Label column sm={4} className="course-form-label">
                Course CRN:
              </Form.Label>

              <Col sm={8}>
                <Form.Control
                  name="crn"
                  type="number"
                  placeholder="e.g. 12345"
                  required
                />
              </Col>
            </Form.Group>

            <Row className="mb-4">
              <Col>
                <Form.Text className="course-info-text">
                  <Image src="/info-icon.png" alt="Info" className="course-code-icon" />
                  Claiming a course assigns you as the instructor. You can find your course CRN
                  on Lamakū.
                </Form.Text>
              </Col>
            </Row>

            <Row>
              <Col className="text-center">
                <Button type="submit" className="submit-form-button" disabled={submitting}>
                  {submitting ? 'Claiming...' : 'Claim Course'}
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