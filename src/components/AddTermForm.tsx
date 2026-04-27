'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Form, Button, Col, Container, Card, Row, Alert } from 'react-bootstrap';
import { createTerm } from '@/lib/dbActions';
import '@/styles/forms.css';

const AddTermForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const crnParam = searchParams.get('crn');
  const crn = crnParam ? parseInt(crnParam, 10) : NaN;

  const [requiresImage, setRequiresImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!crn || Number.isNaN(crn)) {
      setError('Missing course CRN. Open this form from a course page.');
      return;
    }

    const formData = new FormData(e.currentTarget);
    const word = (formData.get('termName') as string)?.trim();
    const referenceDefinition = (formData.get('referenceDefinition') as string)?.trim();
    const difficulty = formData.get('difficultyLevel') as 'Basic' | 'Moderate' | 'Advanced';
    const week = parseInt(formData.get('week') as string, 10);
    const maxSubmissions = parseInt(formData.get('maxSubmissions') as string, 10);

    if (!word) {
      setError('Term name is required.');
      return;
    }
    if (Number.isNaN(maxSubmissions) || maxSubmissions < 1) {
      setError('Max submissions must be at least 1.');
      return;
    }

    setSubmitting(true);
    try {
      await createTerm({
        courseCRN: crn,
        word,
        referenceDefinition: referenceDefinition || undefined,
        maxSubmissions,
        week,
        difficulty,
        imageRequired: requiresImage,
      });
      router.push(`/instructor-dashboard/courses/${crn}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create term.');
      setSubmitting(false);
    }
  };

  return (
    <Container className="add-term-page">
      <h1 className="add-term-title">Add Glossary Term</h1>

      <Card className="add-term-card">
        <Card.Body>
          <Row>
            <Col className="px-3">
              <Form onSubmit={handleSubmit}>
                {error && <Alert variant="danger">{error}</Alert>}

                <Form.Group as={Row} className="mb-3 align-items-center" controlId="termName">
                  <Form.Label column sm={4} className="add-term-label">
                    Term Name:
                  </Form.Label>
                  <Col sm={8}>
                    <Form.Control
                      name="termName"
                      type="text"
                      placeholder="Add your Term"
                      required
                    />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-4 py-3 align-items-center" controlId="referenceDefinition">
                  <Form.Label column sm={4} className="add-term-label">
                    Reference Definition:
                  </Form.Label>
                  <Col sm={8}>
                    <Form.Control
                      as="textarea"
                      name="referenceDefinition"
                      rows={6}
                      placeholder="References / Context"
                      required
                    />
                  </Col>
                </Form.Group>

                <Row className="meta-row mb-5">
                  <Col md={4} className="meta-col">
                    <Form.Label className="add-term-label meta-label">Difficulty Level:</Form.Label>
                    <Form.Select name="difficultyLevel" required className="difficulty-select">
                      <option value="Basic">Basic</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Advanced">Advanced</option>
                    </Form.Select>
                  </Col>

                  <Col md={2} className="meta-col">
                    <Form.Label className="add-term-label meta-label">Week:</Form.Label>
                    <Form.Select name="week" required className="week-select">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17].map((w) => (
                        <option key={w} value={w}>{w}</option>
                      ))}
                    </Form.Select>
                  </Col>

                  <Col md={3} className="meta-col">
                    <Form.Label className="add-term-label meta-label">Max Submissions:</Form.Label>
                    <Form.Control
                      type="number"
                      name="maxSubmissions"
                      min={1}
                      defaultValue={3}
                      required
                      className="max-submissions-input"
                    />
                  </Col>

                  <Col md={3} className="meta-col">
                    <span className="add-term-label meta-label">Requires Image:</span>
                    <Form.Check
                      type="switch"
                      id="requires-image"
                      checked={requiresImage}
                      onChange={(e) => setRequiresImage(e.target.checked)}
                      label={requiresImage ? 'ON' : 'OFF'}
                      className="requires-image-switch"
                    />
                  </Col>
                </Row>

                <div className="text-center">
                  <Button type="submit" className="submit-button" disabled={submitting}>
                    {submitting ? 'Saving...' : 'Submit'}
                  </Button>
                </div>
              </Form>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AddTermForm;