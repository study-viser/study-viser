'use client';

/** import { signIn } from 'next-auth/react';
import Link from 'next/link'; */
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Button, Card, Col, Container, Form, Image, Row } from 'react-bootstrap';
import { createUser } from '@/lib/dbActions';
import '@/styles/auth.css';
import { useRouter } from 'next/navigation';

type SignUpForm = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role?: string | null;
};

const SignUpDetails = () => {
  const router = useRouter();
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().required('Email is required').email('Email is invalid'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters')
      .max(40, 'Password must not exceed 40 characters'),
    confirmPassword: Yup.string()
      .required('Confirm Password is required')
      .oneOf([Yup.ref('password')], 'Confirm Password does not match'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpForm>({
    resolver: yupResolver(validationSchema),
  });

const onSubmit = async (data: SignUpForm) => {
  const role = localStorage.getItem('role');

  if (!role) {
    alert('Please select a role first');
    return;
  }

  await createUser({
    ...data,
    role: role as 'STUDENT' | 'TA' | 'INSTRUCTOR',
  });
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
                <div className="back-arrow" onClick={() => router.push('/auth/signup')}>
                ←
                </div>
                  <Image
                    src="/studyviserlogotxt.png"
                    alt="Logo"
                    className="card-logo"
                    width={200}
                  />

                  <h1>Create an Account</h1>
                  <p>Please enter your account details</p>

                  <div className="form-container">
                    <Form onSubmit={handleSubmit(onSubmit)}>
                      <Form.Group controlId="signupName" className="mb-4">
                        <div className="input-wrapper">
                          <Image
                            src="/user-icon.png"
                            alt="Name icon"
                            className="input-icon"
                          />
                          <Form.Control
                            type="text"
                            placeholder="Name"
                            className={`login-input ${errors.name ? 'is-invalid' : ''}`}
                            {...register('name')}
                          />
                          <div className="invalid-feedback text-start">
                            {errors.name?.message}
                          </div>
                        </div>
                      </Form.Group>

                      <Form.Group controlId="signupEmail" className="mb-4">
                        <div className="input-wrapper">
                          <Image
                            src="/user-icon.png"
                            alt="Email icon"
                            className="input-icon"
                          />
                          <Form.Control
                            type="email"
                            placeholder="Email"
                            className={`login-input ${errors.email ? 'is-invalid' : ''}`}
                            {...register('email')}
                          />
                          <div className="invalid-feedback text-start">
                            {errors.email?.message}
                          </div>
                        </div>
                      </Form.Group>

                      <Form.Group controlId="signupPassword" className="mb-4">
                        <div className="input-wrapper">
                          <Image
                            src="/lock-icon.png"
                            alt="Password icon"
                            className="input-icon"
                          />
                          <Form.Control
                            type="password"
                            placeholder="Password"
                            className={`login-input ${errors.password ? 'is-invalid' : ''}`}
                            {...register('password')}
                          />
                          <div className="invalid-feedback text-start">
                            {errors.password?.message}
                          </div>
                        </div>
                      </Form.Group>

                      <Form.Group controlId="signupConfirmPassword" className="mb-4">
                        <div className="input-wrapper">
                          <Image
                            src="/lock-icon.png"
                            alt="Confirm password icon"
                            className="input-icon"
                          />
                          <Form.Control
                            type="password"
                            placeholder="Confirm Password"
                            className={`login-input ${errors.confirmPassword ? 'is-invalid' : ''}`}
                            {...register('confirmPassword')}
                          />
                          <div className="invalid-feedback text-start">
                            {errors.confirmPassword?.message}
                          </div>
                        </div>
                      </Form.Group>

                      <Button type="submit" className="login-button d-block mx-auto">
                        Register
                      </Button>

                    </Form>
                  </div>
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

export default SignUpDetails;