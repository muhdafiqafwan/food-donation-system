import React, { useContext, useRef, useEffect, useState } from "react";
import { AuthContext } from "../../context/auth";
import { GET_COUNT_USERS } from "../../GraphQL/Queries";
import { useQuery } from "@apollo/client";
import { Row, Col, Container, Card, Spinner, ListGroup } from "react-bootstrap";
import { Building, PeopleFill } from "react-bootstrap-icons";

const AdminDashboardPage = () => {
  const { user } = useContext(AuthContext);
  if (!window.location.hash) {
    window.location = window.location + "#loaded";
    window.location.reload();
  }

  const { loading, error, data } = useQuery(GET_COUNT_USERS);

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
  if (error) return `Error! ${error.message}`;

  return (
    <Container fluid="true" className="vh-100 d-flex flex-column">
      <Row className="h-100 w-100 d-flex">
        <Col sm={2} style={{ background: "#f3f3f3" }}>
          <Row>
            <Col>
              <ListGroup className="row">
                <ListGroup.Item action href="adminNGO">
                  Organizations
                </ListGroup.Item>
                <ListGroup.Item action href="#link2">
                  Donors
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </Col>
        <Col>
          <h2 className="font-weight-light text-center mt-3">
            Admin Dashboard
          </h2>
          <Row className="justify-content-sm-center mt-4 mb-5">
            <Col lg="10">
              <Row xs={1} md={2} className="g-4">
                <Col>
                  <Card className="shadow-sm">
                    <Card.Body>
                      <Card.Title>Organizations</Card.Title>
                      <Card.Text style={{ textAlign: "justify" }}>
                        <Building
                          className="mr-3"
                          style={{ fontSize: "4rem", color: "#3366cc" }}
                        ></Building>
                        <b style={{ fontSize: "25px" }}>
                          {data.countUsers.countOrg}
                        </b>{" "}
                        Registered
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card className="shadow-sm">
                    <Card.Body>
                      <Card.Title>Donors</Card.Title>
                      <Card.Text style={{ textAlign: "justify" }}>
                        <PeopleFill
                          className="mr-3"
                          style={{ fontSize: "4rem", color: "#cf3048" }}
                        ></PeopleFill>
                        <b style={{ fontSize: "25px" }}>
                          {data.countUsers.countDonor}
                        </b>{" "}
                        Registered
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboardPage;
