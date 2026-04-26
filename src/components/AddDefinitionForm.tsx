'use client';

import { Form, Button, Col, Container, Card, Row } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import '@/styles/forms.css';

const AddDefinitionForm = () => {
  const searchParams = useSearchParams();
  const termId = searchParams.get('termId');

  const [word, setWord] = useState('');
  const [isImageRequired, setIsImageRequired] = useState(false);

  useEffect(() => {
    const fetchTerm = async () => {
      if (!termId) return;

      const res = await fetch(`/api/terms/${termId}`);
      const data = await res.json();

      setWord(data.word);
    };

    fetchTerm();
  }, [termId]);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const res = await fetch('/api/submissions', {
      method: 'POST',
       credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        termId,
        definition: formData.get('definition'),
      }),
    });
    if (!res.ok) {
      const errorText = await res.text();
      alert(errorText || 'Something went wrong.');
      return;
    }

  alert('Submitted!');
  window.location.href = '/student-dashboard';
};

  return (
    <Container>
    {/* Toggle switch to require image upload */}
    <Form.Check
        type="switch"
        label="Require image upload"
        checked={isImageRequired}
        onChange={(e) => setIsImageRequired(e.target.checked)}
        className="mb-3"
      />

      <h1 className="text-center py-1">
        Add Definition for {word || '...'}
      </h1>
      <Card className="add-definition-card">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group as={Row} className="py-2" controlId="formDefinition">
              <Form.Label column sm={3}>
                Definition:
                <Form.Text style={{ color: 'red' }}> *</Form.Text>
              </Form.Label>

              <Col sm={9}>
                <Form.Control
                  as="textarea"
                  name="definition"
                  rows={10}
                  placeholder="Write the definition in your own words"
                  required
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="py-2" controlId="formFile">
              <Form.Label column sm={3}>
                Image Upload:
                  {isImageRequired && (
                    <Form.Text style={{ color: 'red' }}> *</Form.Text>
                  )}
              </Form.Label>

              <Col sm={6}>
                <Form.Control 
                  type="file" 
                  name="image"
                  required={isImageRequired} 
                />
              </Col>
            </Form.Group>

            <div className="text-center mt-3">
              <Button variant="primary" type="submit" className="submit-button">
                Submit
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  )
};

export default AddDefinitionForm;