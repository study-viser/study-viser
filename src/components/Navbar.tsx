'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Container, Nav, Navbar } from 'react-bootstrap';

const NavBar: React.FC = () => {
  const { data: session, status } = useSession();
  const pathName = usePathname();

  if (status === 'loading') return null;

  const currentUser = session?.user?.name;
  const role = session?.user?.role;

  return (
    <Navbar expand="lg" bg="white" className="py-3 border-bottom">
      <Container>
        <Navbar.Brand as={Link} href="/" className="d-flex align-items-center gap-2 text-decoration-none">
          <Image
            src="/studyviserlogo.png"
            alt="StudyViser Logo"
            width={44}
            height={44}
          />
          <span
            style={{
              fontWeight: 700,
              fontSize: '1.5rem',
              color: '#024731',
              letterSpacing: '-0.5px',
            }}
          >
            StudyViser
          </span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar-nav" />

        <Navbar.Collapse id="main-navbar-nav">
          <Nav className="mx-auto d-flex align-items-lg-center gap-lg-4">
            <Nav.Link
              as={Link}
              href="/"
              active={pathName === '/'}
              className="fw-medium"
              style={{ color: '#024731' }}
            >
              Home
            </Nav.Link>

            <Nav.Link
              as={Link}
              href="/about"
              active={pathName === '/about'}
              className="fw-medium"
              style={{ color: '#024731' }}
            >
              About
            </Nav.Link>

            <Nav.Link
              as={Link}
              href="/courses"
              active={pathName === '/courses'}
              className="fw-medium"
              style={{ color: '#024731' }}
            >
              Courses
            </Nav.Link>

            <Nav.Link
              as={Link}
              href="/contact"
              active={pathName === '/contact'}
              className="fw-medium"
              style={{ color: '#024731' }}
            >
              Contact
            </Nav.Link>

            {currentUser && role === 'STUDENT' && (
              <Nav.Link
                as={Link}
                href="/student-dashboard"
                active={pathName.startsWith('/student-dashboard')}
                className="fw-medium"
                style={{ color: '#024731' }}
              >
                Dashboard
              </Nav.Link>
            )}
            {currentUser && role === 'INSTRUCTOR' && (
              <Nav.Link
                as={Link}
                href="/instructor-dashboard"
                active={pathName.startsWith('/instructor-dashboard')}
                className="fw-medium"
                style={{ color: '#024731' }}
              >
                Dashboard
              </Nav.Link>
            )}
            {currentUser && role === 'TA' && (
              <Nav.Link
                as={Link}
                href="/ta-dashboard"
                active={pathName.startsWith('/ta-dashboard')}
                className="fw-medium"
                style={{ color: '#024731' }}
              >
                Dashboard
              </Nav.Link>
            )}

            {currentUser && role === 'ADMIN' && (
              <Nav.Link
                as={Link}
                href="/admin"
                active={pathName === '/admin'}
                className="fw-medium"
                style={{ color: '#024731' }}
              >
                Admin
              </Nav.Link>
            )}
          </Nav>

          <Nav className="d-flex align-items-lg-center gap-2 ms-lg-auto">
            {session ? (
              <>
                <Navbar.Text
                  className="fw-medium me-2"
                  style={{ color: '#024731' }}
                >
                  {currentUser}
                </Navbar.Text>

                <Nav.Link
                  as={Link}
                  href="/auth/change-password"
                  className="fw-semibold"
                  style={{
                    color: '#024731',
                    textDecoration: 'underline',
                    textUnderlineOffset: '3px',
                  }}
                >
                  Change Password
                </Nav.Link>

                <Nav.Link
                  href="/api/auth/signout"
                  className="fw-semibold"
                  style={{
                    color: 'white',
                    backgroundColor: '#024731',
                    borderRadius: '8px',
                    padding: '10px 20px',
                  }}
                >
                  Sign Out
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link
                  as={Link}
                  href="/auth/signin"
                  className="fw-semibold"
                  style={{
                    color: '#024731',
                    textDecoration: 'underline',
                    textUnderlineOffset: '3px',
                  }}
                >
                  Login
                </Nav.Link>

                <Nav.Link
                  as={Link}
                  href="/auth/signup"
                  className="fw-semibold"
                  style={{
                    color: 'white',
                    backgroundColor: '#024731',
                    borderRadius: '8px',
                    padding: '10px 20px',
                  }}
                >
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;