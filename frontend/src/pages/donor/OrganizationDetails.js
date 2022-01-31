import React from "react";
import { GET_ONE_ORGANIZATION } from "../../GraphQL/Queries";
import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Container,
  Card,
  Button,
  Badge,
  Spinner,
} from "react-bootstrap";
import {
  CurrencyDollar,
  PersonCircle,
  TelephoneFill,
} from "react-bootstrap-icons";

const OrganizationDetails = ({ match }) => {
  const {
    params: { id },
  } = match;

  const { loading, error, data } = useQuery(GET_ONE_ORGANIZATION, {
    variables: { organizationId: id },
  });

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
    <Container>
      <Row className="justify-content-sm-center mt-4 mb-5">
        <Col lg="10">
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="text-center">
                <b>{data.oneOrganization.name}</b>
              </Card.Title>
              <Card.Text className="text-center">
                {data.oneOrganization.description}
              </Card.Text>
              <br></br>
              <div className="text-center">
                <Badge variant="dark">
                  <CurrencyDollar style={{ fontSize: "15px" }} />{" "}
                  {data.oneOrganization.bankAcc}
                </Badge>{" "}
                <Badge variant="dark">
                  <PersonCircle style={{ fontSize: "15px" }} />
                  {"  "}
                  {data.oneOrganization.contactPerson}
                </Badge>{" "}
                <Badge variant="dark">
                  <TelephoneFill style={{ fontSize: "15px" }} />{" "}
                  {data.oneOrganization.phone}
                </Badge>
              </div>
              <hr></hr>
              <p>
                <b>Program List</b>
              </p>

              <Row className="justify-content-sm-center mt-4 mb-5">
                <Col>
                  <Row xs={1} md={3}>
                    {data.oneOrganization.createdPrograms.length > 0 ? (
                      data.oneOrganization.createdPrograms.map(
                        (organizations) => (
                          <Col>
                            <Card
                              className="shadow-sm"
                              style={{ height: "auto" }}
                            >
                              <Card.Body>
                                <h6>
                                  <b>{organizations.title}</b>
                                </h6>
                                <p>{organizations.description}</p>
                                <br></br>
                                <Link
                                  to={`/programDetails/${organizations._id}`}
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
                              </Card.Body>
                            </Card>
                          </Col>
                        )
                      )
                    ) : (
                      <p className="ml-3"> No program available</p>
                    )}
                  </Row>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default OrganizationDetails;
