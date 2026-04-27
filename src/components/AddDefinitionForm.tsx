'use client';

import { Form, Button, Col, Container, Card, Row } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { getTermById, createSubmission } from '@/lib/dbActions';
import '@/styles/forms.css';

const AddDefinitionForm = () => {
  const searchParams = useSearchParams();
  const termId = searchParams.get('termId');
  const { data: session } = useSession();

  const [word, setWord] = useState('');
  const [difficulty, setDifficulty] = useState<string>('');
  // imageRequired is driven by Term.imageRequired — not a user toggle
  const [imageRequired, setImageRequired] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch term data on mount using dbActions
  useEffect(() => {
    const fetchTerm = async () => {
      if (!termId) {
        setError('No term ID provided.');
        setLoading(false);
        return;
      }

      try {
        // getTermById returns the full term including difficulty and imageRequired
        const term = await getTermById(termId);
        if (!term) {
          setError('Term not found.');
          return;
        }
        setWord(term.word);
        setDifficulty(term.difficulty);
        setImageRequired(term.imageRequired);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load term.');
      } finally {
        setLoading(false);
      }
    };

    fetchTerm();
  }, [termId]);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!session?.user?.id) {
      setError('You must be signed in to submit a definition.');
      return;
    }

    if (!termId) {
      setError('No term ID provided.');
      return;
    }

    const formData = new FormData(e.currentTarget);
    const definition = formData.get('definition') as string;

    // TODO: if image is provided, upload to storage and append URL to definition
    // const image = formData.get('image') as File | null;
    // const imageUrl = image ? await uploadImage(image) : null;
    // const fullDefinition = imageUrl ? `${definition}\n${imageUrl}` : definition;

    try {
      // createSubmission saves the definition — points default to 0 until reviewed
      await createSubmission({
        creatorId: session.user.id,
        termId,
        definition,
      });

      alert('Submitted!');
      window.location.href = '/student-dashboard';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    }
  };

  if (loading) return <p className="text-center mt-4">Loading term...</p>;
  if (error)   return <p className="text-danger text-center mt-4">{error}</p>;

  return (
  <Container>
    <div className="form-heading-wrap">
      <h1 className="form-title py-1">
        Add Definition for <em>{word}</em>
      </h1>
    </div>

      {/* Difficulty badge — read from Term.difficulty, not user-editable */}
      <p className="form-meta-text text-muted mb-1">
        Difficulty:&nbsp;
        <span className={`badge ${
          difficulty === 'Basic'    ? 'bg-success'
          : difficulty === 'Moderate' ? 'bg-warning text-dark'
          : 'bg-danger'
        }`}>
          {difficulty}
        </span>
      </p>

      <Card className="add-definition-card">
        <Card.Body>
          <Form onSubmit={handleSubmit}>

            {error && <p className="text-danger">{error}</p>}

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
                {/* required marker driven by Term.imageRequired */}
                {imageRequired && (
                  <Form.Text style={{ color: 'red' }}> *</Form.Text>
                )}
              </Form.Label>

              <Col sm={6}>
                <Form.Control
                  type="file"
                  name="image"
                  // required is set by Term.imageRequired, not a user toggle
                  required={imageRequired}
                />
              </Col>
            </Form.Group>

            <div className="text-center mt-3">
              <Button variant="primary" type="submit" className="submit-form-button">
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
