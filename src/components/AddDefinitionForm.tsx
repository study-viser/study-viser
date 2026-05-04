'use client';

import { Form, Button, Col, Container, Card, Row } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import BackButton from '@/components/BackButton';

import '@/styles/forms.css';

const AddDefinitionForm = () => {
  const searchParams = useSearchParams();
  const termId = searchParams.get('termId');
  const { data: session } = useSession();

  const [word, setWord] = useState('');
  const [difficulty, setDifficulty] = useState<string>('');
  const [referenceDefinition, setReferenceDefinition] = useState<string>('');
  const [imageRequired, setImageRequired] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTerm = async () => {
      if (!termId) {
        setError('No term ID provided.');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/terms/${termId}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error);

        const term = data;

        setWord(term.word);
        setDifficulty(term.difficulty);
        setImageRequired(term.imageRequired);
        setReferenceDefinition(term.referenceDefinition ?? '');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load term.');
      } finally {
        setLoading(false);
      }
    };

    fetchTerm();
  }, [termId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!session?.user?.id) {
      setError('You must be signed in.');
      return;
    }

    if (!termId) {
      setError('No term ID.');
      return;
    }

    const formData = new FormData(e.currentTarget);
    const definition = formData.get('definition') as string;

    try {
      const res = await fetch('/api/submissions/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creatorId: session.user.id,
          termId,
          definition,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      alert('Submitted!');
      window.location.href = '/student-dashboard';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <Container>
      <div className="form-heading-wrap">
        <BackButton />
        <h1 className="form-title">Add Definition for {word}</h1>
      </div>
      <p className="form-meta-text text-muted mb-1">
        Difficulty:&nbsp;
        <span className={`badge ${
          difficulty === 'Basic'
            ? 'bg-success'
            : difficulty === 'Moderate'
              ? 'bg-warning text-dark'
              : 'bg-danger'
        }`}>
          {difficulty}
        </span>
      </p>

      {referenceDefinition && (
        <div className="reference-box reference-wrapper">
          <p className="reference-title">Instructor Reference / Context</p>
          <p className="reference-text">{referenceDefinition}</p>
        </div>
      )}
      
      <Card className="add-definition-card">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group as={Row}>
              <Form.Label column sm={3}>Definition</Form.Label>
              <Col sm={9}>
                <Form.Control as="textarea" name="definition" required />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="py-2" controlId="formFile">
              <Form.Label column sm={3}>
                Image Upload:
                {imageRequired && <Form.Text style={{ color: 'red' }}> *</Form.Text>}
              </Form.Label>

              <Col sm={6}>
                <Form.Control type="file" name="image" required={imageRequired} />
              </Col>
            </Form.Group>
            <div className="text-center mt-3">
              <Button type="submit" className="submit-form-button">
                Submit
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AddDefinitionForm;