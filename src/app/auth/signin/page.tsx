'use client';

import { signIn } from 'next-auth/react'; // v5 compatible
import { Button, Card, Col, Container, Form, Row, Image } from 'react-bootstrap';
import '@/styles/auth.css';

/** The sign in page. */
const SignIn = () => {
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      email: { value: string };
      password: { value: string };
    };
    const email = target.email.value;
    const password = target.password.value;

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result?.error) return;

    const{getSession} = await import('next-auth/react');
    const session = await getSession();
    const role = (session?.user as {role?: string})?.role;

    if (role === 'INSTRUCTOR') {
      window.location.href = '/instructor-dashboard';
    } else if (role === 'TA') {
      window.location.href = '/ta-dashboard';
    } else {
      window.location.href = '/student-dashboard';
    }
  };

  return (
    <main className="login-page">

      <Image src="/top-left-shape.png"  alt="" className="bg-shape top-left" />
      <Image src="/bottom-left-shape.png"  alt="" className="bg-shape bottom-left" />
      <Image src="/bottom-right-shape.png" alt="" className="bg-shape bottom-right" />

        <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6} xl={5}>
            <Card className="login-card">
              <Card.Body className="login-card-body">
                <Image 
                  src="/studyviserlogotxt.png" 
                  alt="Logo Image"       
                  className="d-block mx-auto"
                  width={300}
                  />

                <h1 className="text-center">Login</h1>
                <p className="text-center">Please enter your Email and Password</p>

                <div className="form-container">
                <Form method="post" onSubmit={handleSubmit}>
                  <Form.Group controlId="formBasicEmail" className="mb-4">
                    <div className="input-wrapper">
                      <Image
                        src="/user-icon.png" 
                        alt="icon" 
                        className="input-icon"
                      />
                  <Form.Control
                      name="email"
                      type="text"
                      placeholder="Email"
                      className="login-input"
                      />
                    </div>
                  </Form.Group>
                  
                  <Form.Group controlId="formBasicPassword" className="mb-4">
                    <div className="input-wrapper">
                    <Image
                        src="/lock-icon.png" 
                        alt="icon" 
                        className="input-icon"
                      />
                    <Form.Control
                      name="password" 
                      type="password" 
                      placeholder="Password"
                      className="login-input" 
                      />
                    </div>
                  </Form.Group>

                  <Button type="submit" className="login-button d-block mx-auto">
                    Login
                  </Button>
                </Form>
              </div>
              <div className="text-center mt-3">
                <p>
                  New user? &nbsp;
                  <a href="/auth/signup">Register</a>
                </p>
              </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default SignIn;
