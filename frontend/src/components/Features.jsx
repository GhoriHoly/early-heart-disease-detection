import { Container, Row, Col, Card } from "react-bootstrap";

function Features() {
  return (
    <Container className="my-5">
      <Row className="text-center mb-4">
        <h2>System Features</h2>
      </Row>

      <Row>
        <Col md={4}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title>AI Prediction</Card.Title>
              <Card.Text>
                Uses a trained machine learning model to predict
                early risk of heart disease.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title>Medical Data</Card.Title>
              <Card.Text>
                Works with real clinical features such as blood pressure,
                cholesterol, and ECG results.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title>Secure Backend</Card.Title>
              <Card.Text>
                FastAPI backend with MySQL database for storing
                patient data and predictions.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Features;
