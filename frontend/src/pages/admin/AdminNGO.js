import React from "react";
import { GET_ORGANIZATIONS } from "../../GraphQL/Queries";
import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Container,
  Card,
  Spinner,
  ListGroup,
  Table,
  Button,
} from "react-bootstrap";
import {
  ClockFill,
  CheckSquareFill,
  XSquareFill,
  ArchiveFill,
} from "react-bootstrap-icons";
import ReactTooltip from "react-tooltip";

const AdminNGOPage = () => {
  function refreshPage() {
    if (!window.location.hash) {
      window.location = window.location + "#loaded";
      window.location.reload();
    }
  }
  const { loading, error, data } = useQuery(GET_ORGANIZATIONS);

  const getColor = (verified) => {
    if (verified === "Pending") return "#fab603";
    if (verified === "Verified") return "#00cc00";
    if (verified === "Rejected") return "#f7040b";
    return "";
  };

  const getDisplayPending = (verified) => {
    if (verified === "Pending") return "inline";
    if (verified === "Verified") return "none";
    if (verified === "Rejected") return "none";
    return "";
  };

  const getDisplayApproved = (verified) => {
    if (verified === "Pending") return "none";
    if (verified === "Verified") return "inline";
    if (verified === "Rejected") return "none";
    return "";
  };

  const getDisplayRejected = (verified) => {
    if (verified === "Pending") return "none";
    if (verified === "Verified") return "none";
    if (verified === "Rejected") return "inline";
    return "";
  };

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
    <Container
      fluid="true"
      className="vh-100 d-flex flex-column"
      onLoad={refreshPage()}
    >
      <Row className="h-100 w-100 d-flex">
        <Col sm={2} style={{ background: "#f3f3f3" }}>
          <Row>
            <Col>
              <ListGroup className="row" defaultActiveKey="adminNGO">
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
                    <b>List of Organizations</b>
                  </h2>
                </Card.Title>
                <Card.Body>
                  <Row>
                    <Table striped bordered responsive>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>NGO Name</th>
                          <th>Email</th>
                          <th>Bank Account Number</th>
                          <th>Contact Person</th>
                          <th>Phone Number</th>
                          <th>Verified</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      {data.organizations.length > 0 ? (
                        data.organizations.map((organization, index) => (
                          <tbody>
                            <tr>
                              <td>{index + 1}</td>
                              <td>{organization.name}</td>
                              <td>{organization.email}</td>
                              <td>{organization.bankAcc}</td>
                              <td>{organization.contactPerson}</td>
                              <td>{organization.phone}</td>
                              <td className="text-center">
                                <ReactTooltip />
                                <p
                                  data-html="true"
                                  data-tip={`${organization.verified}`}
                                  data-place="bottom"
                                  data-effect="solid"
                                >
                                  <ClockFill
                                    style={{
                                      color: getColor(organization.verified),
                                      display: getDisplayPending(
                                        organization.verified
                                      ),
                                    }}
                                  ></ClockFill>
                                  <XSquareFill
                                    style={{
                                      color: getColor(organization.verified),
                                      display: getDisplayRejected(
                                        organization.verified
                                      ),
                                    }}
                                  ></XSquareFill>
                                  <CheckSquareFill
                                    style={{
                                      color: getColor(organization.verified),
                                      display: getDisplayApproved(
                                        organization.verified
                                      ),
                                    }}
                                  ></CheckSquareFill>
                                </p>
                              </td>
                              <td>
                                <Link
                                  to={`/ngoDetails/${organization._id}`}
                                  style={{ textDecoration: "none" }}
                                >
                                  <Button
                                    className="float-right"
                                    variant="primary"
                                    type="submit"
                                  >
                                    View
                                  </Button>
                                </Link>
                              </td>
                            </tr>
                          </tbody>
                        ))
                      ) : (
                        <tbody>
                          <tr>
                            <td colSpan={8}>
                              <div className="text-center">
                                <ArchiveFill
                                  style={{ fontSize: "9rem", color: "#d9d9d9" }}
                                ></ArchiveFill>
                                <br></br>
                                <h4>
                                  <b>It's empty here</b>
                                </h4>
                                <p>No organizations yet.</p>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      )}
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

export default AdminNGOPage;
