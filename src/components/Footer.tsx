import { Container, Row, Col } from 'react-bootstrap';

/** The Footer appears at the bottom of every page. */
const Footer = () => (
  <footer className="mt-auto py-3 footer-bar">
    <Container>
      <Row className="justify-content-center text-center">
        <Col>
          <p className="footer-university">
            University <em>of</em> Hawai&#x02BB;i&#174; <em>at </em> M&#x101;noa
          </p>
          <p className="footer-subtitle">
            Ke Kulanui o Hawai&#x02BB;i ma M&#x101;noa
          </p>
        </Col>
      </Row>
    </Container>
  </footer>
);

export default Footer;