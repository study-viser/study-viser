import { Col, Container, Row, Table } from 'react-bootstrap';
import { prisma } from '@/lib/prisma';
import StuffItem from '@/components/StuffItem';

/** Render a list of users and courses. */
const TestPage = async () => {
  
  // console.log(stuff);
  return (
    <main>
      <Container id="list" fluid className="py-3">
        <Row>
          <Col>
            <h1>Users</h1>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Courses</th>
                </tr>
              </thead>
              <tbody>
                {stuff.map((item) => (
                  <StuffItem key={item.id} {...item} />
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
        <Row>
          <Col>
            <h1>Courses</h1>
              <Table striped bordered hover>
                <thead>
                  <tr>    
                    <th>Name</th>
                    <th>Code</th>
                    <th>Instructor</th>
                  </tr>
                </thead>
                <tbody>
                {stuff.map((item) => (
                  <StuffItem key={item.id} {...item} />
                ))}
              </tbody>
                </Table>
            </Col>
        </Row>
      </Container>
    </main>
  );
};

export default TestPage;
