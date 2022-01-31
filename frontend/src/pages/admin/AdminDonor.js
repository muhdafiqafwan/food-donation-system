import React, { useContext } from "react";
import { AuthContext } from "../../context/auth";
import { GET_DONORS } from "../../GraphQL/Queries";
import { useQuery } from "@apollo/client";
import {
  Row,
  Col,
  Container,
  Card,
  Spinner,
  ListGroup,
  Table,
} from "react-bootstrap";

const AdminDonorPage = () => {
  const { user } = useContext(AuthContext);
  const { loading, error, data } = useQuery(GET_DONORS);

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
              <ListGroup className="row" defaultActiveKey="adminDonor">
                <ListGroup.Item action href="adminNGO">
                  Organizations
                </ListGroup.Item>
                <ListGroup.Item action href="adminDonor">
                  Donors
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </Col>
        <Col>
          <Row className="justify-content-sm-center mt-4 mb-5">
            <Col lg="10">
              <Card>
                <Card.Title>
                  <h2 className="font-weight-light text-center mt-3">
                    <b>List of Donors</b>
                  </h2>
                </Card.Title>
                <Card.Body>
                  <Row>
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Donor Name</th>
                          <th>Email</th>
                          <th>Phone Number</th>
                        </tr>
                      </thead>
                      {data.donors.map((donor, index) => (
                        <tbody>
                          <tr>
                            <td>{index + 1}</td>
                            <td>
                              {donor.firstName} {donor.lastName}
                            </td>
                            <td>{donor.email}</td>
                            <td>{donor.phone}</td>
                          </tr>
                        </tbody>
                      ))}
                    </Table>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDonorPage;
