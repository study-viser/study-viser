'use client';

import { Form, Button, Col, Container, Card, Row } from 'react-bootstrap';
import '@/styles/adddefinitionform.css';
import '@/app/globals.css';
  
const AddDefinitionForm = () => {
  return (
    <Container>
      <h1 className="text-center py-1">Add Definition for *Term* </h1>
      <Card className="add-definition-card">
        <Card.Body>
          <Form>
            <Form.Group as={Row} className="py-2" controlId="formDefinition">
              <Form.Label column sm={3}>
                Definition:
                <Form.Text style={{ color: 'red' }}> *</Form.Text>
              </Form.Label>

              <Col sm={9}>
                <Form.Control
                    as="textarea"
                    rows={10}
                  placeholder="Write the definition in your own words"
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="py-2" controlId="formFile">
              <Form.Label column sm={3}>
                Image Upload:
                <Form.Text style={{ color: 'red' }}> *</Form.Text>
              </Form.Label>

              <Col sm={6}>
                <Form.Control type="file" />
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