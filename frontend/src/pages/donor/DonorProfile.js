import React from "react";
import { GET_ONE_DONOR } from "../../GraphQL/Queries";
import { useQuery } from "@apollo/client";
import {
  Row,
  Col,
  Container,
  Card,
  Spinner,
  Badge,
  Button,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  EnvelopeFill,
  PersonCircle,
  TelephoneFill,
} from "react-bootstrap-icons";

const DonorProfile = ({ match }) => {
  function refreshPage() {
    if (!window.location.hash) {
      window.location = window.location + "#loaded";
      window.location.reload();
    }
  }
  const {
    params: { id },
  } = match;
  const { loading, error, data } = useQuery(GET_ONE_DONOR, {
    variables: { donorId: id },
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
                <b>
                  {data.oneDonor.firstName} {data.oneDonor.lastName}
                </b>
              </Card.Title>
              <hr></hr>
              <Card.Text className="text-center">
                <Badge variant="dark">
                  <EnvelopeFill style={{ fontSize: "1.1rem" }}></EnvelopeFill>{" "}
                  {data.oneDonor.email}
                </Badge>{" "}
                <Badge variant="dark">
                  <TelephoneFill style={{ fontSize: "1.1rem" }}></TelephoneFill>{" "}
                  {data.oneDonor.phone}
                </Badge>
              </Card.Text>
              <br></br>
              <Link
                to={`/donorUpdateProfile/${data.oneDonor._id}`}
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

export default DonorProfile;
