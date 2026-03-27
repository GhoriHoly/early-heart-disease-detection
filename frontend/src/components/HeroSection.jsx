import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function HeroSection() {
  return (
    <div className="bg-light min-vh-100 d-flex align-items-center">
      <Container className="text-center">
        <h1 className="mb-3">Early Heart Disease Prediction</h1>
        <p className="lead">
          AI-powered system for early detection of heart disease.
        </p>

        <Button as={Link} to="/predict" variant="danger" size="lg">
          Start Prediction
        </Button>
      </Container>
    </div>
  );
}

export default HeroSection;

