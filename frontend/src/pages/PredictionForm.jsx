import { useState } from "react";
import { Container, Row, Col, Form, Button, Alert, Card, Spinner } from "react-bootstrap";

function PredictionForm() {

  const [formData, setFormData] = useState({
    age: "",
    sex: "",
    cp: "",
    trestbps: "",
    chol: "",
    thalach: "",
    exang: "",
    oldpeak: "",
    slope: "",
    ca: "",
    thal: "",
    fbs: "",
    restecg: ""
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // NEW
  const token = localStorage.getItem("token");

  const requiredFields = [
    "age","sex","cp","trestbps","chol","thalach",
    "exang","oldpeak","slope","ca","thal"
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    setError("");
    setResult(null);

    for (let field of requiredFields) {
      if (!formData[field]) {
        setError("Please fill all required fields (*)");
        return;
      }
    }

    try {

      setLoading(true);

      const formattedData = {
        age: Number(formData.age),
        sex: Number(formData.sex),
        cp: Number(formData.cp),
        trestbps: Number(formData.trestbps),
        chol: Number(formData.chol),
        thalach: Number(formData.thalach),
        exang: Number(formData.exang),
        oldpeak: Number(formData.oldpeak),
        slope: Number(formData.slope),
        ca: Number(formData.ca),
        thal: Number(formData.thal),
        fbs: formData.fbs ? Number(formData.fbs) : 0,
        restecg: formData.restecg ? Number(formData.restecg) : 0
      };

      // MODIFIED
      const response = await fetch("http://localhost:8000/", {
        method: "POST",
        mode: 'cors',
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify(formattedData) 
      });

      const data = await response.json();

      setResult(data.prediction);

    } catch (err) {

      setError("Failed to connect to backend server");

    } finally {

      setLoading(false);

    }

  };

  return (

    <Container className="my-5">

      <Row className="justify-content-center">

        <Col md={8}>

          <Card className="shadow-lg">

            <Card.Body>

              <Card.Title className="text-center mb-4">
                AI Heart Disease Prediction
              </Card.Title>

              {error && <Alert variant="danger">{error}</Alert>}

              {result !== null && (
                <Alert variant={result === 0 ? "danger" : "success"}>
                  {result === 0
                    ? "⚠ High Risk of Heart Disease"
                    : "✓ Low Risk of Heart Disease"}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>

                <Row>

                  <Col md={6} className="mb-3">
                    <Form.Label>Age *</Form.Label>
                    <Form.Control
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                    />
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Label>Sex *</Form.Label>
                    <Form.Select
                      name="sex"
                      value={formData.sex}
                      onChange={handleChange}
                    >
                      <option value="">Select</option>
                      <option value="1">Male</option>
                      <option value="0">Female</option>
                    </Form.Select>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Label>Chest Pain Type *</Form.Label>
                    <Form.Control
                      type="number"
                      name="cp"
                      value={formData.cp}
                      onChange={handleChange}
                    />
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Label>Resting Blood Pressure *</Form.Label>
                    <Form.Control
                      type="number"
                      name="trestbps"
                      value={formData.trestbps}
                      onChange={handleChange}
                    />
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Label>Cholesterol *</Form.Label>
                    <Form.Control
                      type="number"
                      name="chol"
                      value={formData.chol}
                      onChange={handleChange}
                    />
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Label>Max Heart Rate *</Form.Label>
                    <Form.Control
                      type="number"
                      name="thalach"
                      value={formData.thalach}
                      onChange={handleChange}
                    />
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Label>Exercise Induced Angina *</Form.Label>
                    <Form.Select
                      name="exang"
                      value={formData.exang}
                      onChange={handleChange}
                    >
                      <option value="">Select</option>
                      <option value="1">Yes</option>
                      <option value="0">No</option>
                    </Form.Select>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Label>Oldpeak *</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.1"
                      name="oldpeak"
                      value={formData.oldpeak}
                      onChange={handleChange}
                    />
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Label>Slope *</Form.Label>
                    <Form.Control
                      type="number"
                      name="slope"
                      value={formData.slope}
                      onChange={handleChange}
                    />
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Label>Major Vessels *</Form.Label>
                    <Form.Control
                      type="number"
                      name="ca"
                      value={formData.ca}
                      onChange={handleChange}
                    />
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Label>Thal *</Form.Label>
                    <Form.Control
                      type="number"
                      name="thal"
                      value={formData.thal}
                      onChange={handleChange}
                    />
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Label>Fasting Blood Sugar (Optional)</Form.Label>
                    <Form.Control
                      type="number"
                      name="fbs"
                      value={formData.fbs}
                      onChange={handleChange}
                    />
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Label>Rest ECG (Optional)</Form.Label>
                    <Form.Control
                      type="number"
                      name="restecg"
                      value={formData.restecg}
                      onChange={handleChange}
                    />
                  </Col>

                </Row>

                <div className="text-center mt-4">

                  <Button variant="danger" type="submit" size="lg" disabled={loading}>

                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" /> Predicting...
                      </>
                    ) : (
                      "Predict Heart Disease"
                    )}

                  </Button>

                </div>

              </Form>

            </Card.Body>

          </Card>

        </Col>

      </Row>

    </Container>

  );
}

export default PredictionForm;