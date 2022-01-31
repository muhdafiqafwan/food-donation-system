import React from "react";
import { GET_ONE_ORGANIZATION } from "../../GraphQL/Queries";
import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Container,
  Card,
  Spinner,
  Badge,
  Button,
} from "react-bootstrap";

import {
  EnvelopeFill,
  PersonCircle,
  TelephoneFill,
} from "react-bootstrap-icons";

const OrganizationProfile = ({ match }) => {
  function refreshPage() {
    if (!window.location.hash) {
      window.location = window.location + "#loaded";
      window.location.reload();
    }
  }
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
    <Container onLoad={refreshPage()}>
      <Row className="justify-content-sm-center mt-4 mb-5">
        <Col lg="10">
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="text-center">
                <PersonCircle
                  style={{ fontSize: "9rem", color: "#cccccc" }}
                ></PersonCircle>
                <br></br>
                <b>{data.oneOrganization.name}</b>
              </Card.Title>
              <Card.Text className="text-center">
                {data.oneOrganization.description}
              </Card.Text>
              <hr></hr>
              <Card.Text className="text-center">
                <Badge variant="dark">
                  <EnvelopeFill style={{ fontSize: "1.1rem" }}></EnvelopeFill>{" "}
                  {data.oneOrganization.email}
                </Badge>{" "}
                <Badge variant="dark">
                  <TelephoneFill style={{ fontSize: "1.1rem" }}></TelephoneFill>{" "}
                  {data.oneOrganization.phone}
                </Badge>
              </Card.Text>
              <br></br>
              <Card.Text>
                <b>Bank Account Number</b>
                <br></br>
                {data.oneOrganization.bankAcc}
              </Card.Text>

              <Card.Text>
                <b>Contact Person</b>
                <br></br>
                {data.oneOrganization.contactPerson}
              </Card.Text>
              <Link
                to={`/organizationUpdateProfile/${data.oneOrganization._id}`}
                style={{ textDecoration: "none" }}
              >
                <Button
                  style={{ marginRight: 10 }}
                  className="float-right"
                  variant="primary"
                  type="submit"
                >
                  Edit
                </Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default OrganizationProfile;
