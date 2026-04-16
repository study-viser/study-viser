'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Col, Container, Row, Button, Image } from 'react-bootstrap';
import '@/styles/auth.css';

const SignUpRole = () => {
  const [selectedRole, setSelectedRole] = useState('');
  const router = useRouter();

  const handleContinue = () => {
    if (!selectedRole) return;

    localStorage.setItem('role', selectedRole);
    router.push('/auth/signup/details');
  };

  return (
    <main className="login-page">
        
      <Image src="/top-left-shape.png" alt="" className="bg-shape top-left" />
      <Image src="/bottom-left-shape.png" alt="" className="bg-shape bottom-left" />
      <Image src="/bottom-right-shape.png" alt="" className="bg-shape bottom-right" />

      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6} xl={5}>
            <Card className="login-card">
              <Card.Body className="login-card-body text-center">
              <div className="card-content">

                {/* LOGO */}
                <Image
                  src="/studyviserlogotxt.png"
                  alt="Logo"
                  className="card-logo"
                  width={200}
                />
                <h1>Create an Account</h1>
                <p>Select your Role</p>

                <Row className="mt-4 mb-4">

                  {/* STUDENT */}
                  <Col>
                    <div
                      className={`role-card ${selectedRole === 'STUDENT' ? 'selected' : ''}`}
                      onClick={() => setSelectedRole('STUDENT')}
                    >
                      <Image src="/student-icon.png" width={60} alt="Student" />
                      <p>Student</p>
                    </div>
                  </Col>

                  {/* TA */}
                  <Col>
                    <div
                      className={`role-card ${selectedRole === 'TA' ? 'selected' : ''}`}
                      onClick={() => setSelectedRole('TA')}
                    >
                      <Image src="/ta-icon.png" width={60} alt="Teacher Assistant" />
                      <p>Teacher Assistant</p>
                    </div>
                  </Col>

                  {/* INSTRUCTOR */}
                  <Col>
                    <div
                      className={`role-card ${selectedRole === 'INSTRUCTOR' ? 'selected' : ''}`}
                      onClick={() => setSelectedRole('INSTRUCTOR')}
                    >
                      <Image src="/instructor-icon.png" width={60} alt="Instructor" />
                      <p>Instructor</p>
                    </div>
                  </Col>

                </Row>

                <Button
                  className="login-button"
                  onClick={handleContinue}
                  disabled={!selectedRole}
                >
                  Continue
                </Button>

                <div className="text-center mt-3">
                  <p>
                    Existing User? <a href="/auth/signin">Login</a>
                  </p>
                </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default SignUpRole;