'use client';

import { Button, Card, Col, Container, Form, Image, Row } from 'react-bootstrap';
import { useState } from 'react';
import '@/styles/auth.css';

const ChangePasswordPage = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    const currentPassword = formData.get('currentPassword') as string;
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }
      setSuccess('Password changed successfully.');
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="login-page">
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6} xl={5}>
            <Card className="login-card">
              <Card.Body className="login-card-body">
                <h1 className="text-center">Change Password</h1>
                <p className="text-center">Enter your current password and create a new one.</p>

                <div className="form-container">
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-4">
                      <div className="input-wrapper">
                        <Image src="/lock-icon.png" alt="" className="input-icon" />
                        <Form.Control
                          name="currentPassword"
                          type="password"
                          placeholder="Current Password"
                          className="login-input"
                          required
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <div className="input-wrapper">
                        <Image src="/lock-icon.png" alt="" className="input-icon" />
                        <Form.Control
                          name="newPassword"
                          type="password"
                          placeholder="New Password"
                          className="login-input"
                          minLength={6}
                          required
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <div className="input-wrapper">
                        <Image src="/lock-icon.png" alt="" className="input-icon" />
                        <Form.Control
                          name="confirmPassword"
                          type="password"
                          placeholder="Confirm New Password"
                          className="login-input"
                          minLength={6}
                          required
                        />
                      </div>
                    </Form.Group>

                    {error && <p className="text-danger text-center mb-3">{error}</p>}
                    {success && <p className="text-success text-center mb-3">{success}</p>}

                    <Button type="submit" className="login-button d-block mx-auto" disabled={submitting}>
                      {submitting ? 'Changing...' : 'Change Password'}
                    </Button>
                  </Form>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default ChangePasswordPage;