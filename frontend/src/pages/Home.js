import React from "react";
import { Link } from "react-router-dom";
import { Row, Col, Container, Button } from "react-bootstrap";
import "./Home.css";

const HomePage = () => {
  return (
    <div className="home">
      <h1 className="h1">
        Let's unite together in the fight against the hunger
      </h1>
      <h2 className="h2">Share food. Save lives.</h2>
      <Container>
        <Row className="justify-content-sm-center">
          <Col md="12" style={{ textAlign: "center" }}>
            <Link to="/adminLogin">
              <Button className="mr-2" variant="dark">
                Admin
              </Button>
            </Link>
            <Link to="/donorLogin">
              <Button className="mr-2" variant="dark">
                Donor
              </Button>
            </Link>
            <Link to="/organizationLogin">
              <Button variant="dark">Organization</Button>
            </Link>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HomePage;
