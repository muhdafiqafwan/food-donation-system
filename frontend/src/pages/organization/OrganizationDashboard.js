import React from "react";
import { GET_MEORGANIZATION } from "../../GraphQL/Queries";
import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Container,
  Card,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";
import { ArchiveFill } from "react-bootstrap-icons";
import "../Form.css";

const Dashboard = () => {
  function refreshPage() {
    if (!window.location.hash) {
      window.location = window.location + "#loaded";
      window.location.reload();
    }
  }
  const { loading, error, data } = useQuery(GET_MEORGANIZATION);

  if (loading)
    return (
      <Spinner
        style={{
          position: "fixed",
          top: "15%",
          left: "50%",
        }}
        animation="border"
      />
    );

  return (
    <Container onLoad={refreshPage()}>
      <h2 className="font-weight-medium text-center mt-3">Program List</h2>
      <Row className="justify-content-sm-center mt-4 mb-5">
        <Col lg="10">
          <Row xs={1} md={3} className="g-4">
            {data.meOrganization.createdPrograms.length > 0 ? (
              data.meOrganization.createdPrograms.map((programs) => (
                <Col>
                  <Link className="link-ngo" to={`/details/${programs._id}`}>
                    <Card key={programs._id}>
                      <Card.Body className="card-ngo">
                        <Card.Title>{programs.title}</Card.Title>
                        <Card.Text className="font-weight-light">
                          {programs.description}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Link>
                  <br></br>
                </Col>
              ))
            ) : (
              <Col lg="12">
                <Alert key={error} variant="warning" className="text-center">
                  <ArchiveFill
                    style={{ fontSize: "9rem", color: "#837448" }}
                  ></ArchiveFill>
                  <br></br>
                  <h4>
                    <b>It's empty here</b>
                  </h4>
                  <p>No programs yet.</p>
                </Alert>
              </Col>
            )}
          </Row>
          <br></br>
          <Link to="/program" style={{ textDecoration: "none" }}>
            <Button className="btn-block mt-2" variant="success" type="submit">
              Add new program
            </Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
