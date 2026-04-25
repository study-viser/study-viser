'use client';

import { useState } from 'react';
import { Form, Button, Col, Container, Card, Row } from 'react-bootstrap';
import '@/styles/addtermform.css';
import '@/app/globals.css';

const AddTermForm = () => {
  const [requiresImage, setRequiresImage] = useState(true);

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    console.log({
      termName: formData.get('termName'),
      referenceDefinition: formData.get('referenceDefinition'),
      difficultyLevel: formData.get('difficultyLevel'),
      week: formData.get('week'),
      requiresImage,
    });

    // TODO: connect to createGlossaryTerm() once backend is ready
    alert('Glossary term submitted!');
  };

  return (
    <Container className="add-term-page">
      <h1 className="add-term-title">Add Glossary Term</h1>

      <Card className="add-term-card">
        <Card.Body>
            <Row>
                <Col className="px-3">
          <Form onSubmit={handleSubmit}>
            <Form.Group as={Row} className="" controlId="termName">
              <Form.Label column sm={3} className="add-term-label">
                Term Name:
              </Form.Label>

              <Col sm={9}>
                <Form.Control
                  name="termName"
                  type="text"
                  placeholder="Add your Term"
                  required
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-4 py-3" controlId="referenceDefinition">
              <Form.Label column sm={3} className="add-term-label">
                Reference Definition:
              </Form.Label>

              <Col sm={9}>
                <Form.Control
                  as="textarea"
                  name="referenceDefinition"
                  rows={6}
                  placeholder="References / Context"
                  required
                />
              </Col>
            </Form.Group>

            <Row className="meta-row align-items-start mb-5">
              <Col md={5}>
                <Form.Group as={Row} className="meta-field" controlId="difficultyLevel">
                  <Form.Label column sm={5} className="add-term-label">
                    Difficulty Level:
                  </Form.Label>

                  <Col sm={6}>
                    <Form.Select name="difficultyLevel" required>
                      <option value="BEGINNER">Beginner</option>
                      <option value="INTERMEDIATE">Intermediate</option>
                      <option value="ADVANCED">Advanced</option>
                    </Form.Select>
                    <Form.Text className="p-2">Select one</Form.Text>
                  </Col>
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group as={Row} className="meta-field" controlId="week">
  <Form.Label column sm={5} className="add-term-label">
    Week:
  </Form.Label>

  <Col sm={6}>
    <Form.Select name="week" required>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17].map((week) => (
        <option key={week} value={week}>
          {week}
        </option>
      ))}
    </Form.Select>
    <Form.Text className="p-2">Select one</Form.Text>
  </Col>
</Form.Group>
              </Col>

              <Col md={4}>
                <div className="requires-image-row">
                  <span className="add-term-label">Requires Image:</span>

                  <Form.Check
                    type="switch"
                    id="requires-image"
                    checked={requiresImage}
                    onChange={(e) => setRequiresImage(e.target.checked)}
                    label={requiresImage ? 'ON' : 'OFF'}
                    className="requires-image-switch"
                  />
                </div>
              </Col>
            </Row>

            <div className="text-center">
              <Button type="submit" className="submit-button">
                SUBMIT
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