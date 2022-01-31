import React, { useState } from "react";
import { GET_ONE_ORGANIZATION } from "../../GraphQL/Queries";
import { VERIFY_ORGANIZATION } from "../../GraphQL/Mutations";
import { useQuery, useMutation } from "@apollo/client";
import { Link, useHistory } from "react-router-dom";
import {
  Row,
  Col,
  Container,
  Card,
  Button,
  Badge,
  Spinner,
  Modal,
  Alert,
} from "react-bootstrap";
import {
  CurrencyDollar,
  PersonCircle,
  TelephoneFill,
} from "react-bootstrap-icons";

const AdminNGODetails = ({ match }) => {
  const {
    params: { id },
  } = match;
  const history = useHistory();

  const [showReject, setShowReject] = useState(false);
  const [showApprove, setShowApprove] = useState(false);
  const [showSuccess, setShowSuccess] = useState(true);
  const [values, setValues] = useState("");

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    history.push({
      pathname: "/adminNGO",
    });
  };

  const { loading, error, data } = useQuery(GET_ONE_ORGANIZATION, {
    variables: { organizationId: id },
  });

  const [verifyOrganization, { data: dataVerify }] = useMutation(
    VERIFY_ORGANIZATION,
    {
      variables: {
        organizationId: id,
        verified: values,
      },
      errorPolicy: "all",
      onError(ApolloError) {
        console.log(ApolloError.message);
      },
    }
  );

  const handleCloseApprove = () => {
    setShowApprove(false);
    setValues("");
  };
  const handleShowApprove = () => {
    setShowApprove(true);
    setValues("Verified");
  };
  const handleYesApprove = () => {
    verifyOrganization();
  };

  const handleCloseReject = () => {
    setShowReject(false);
    setValues("");
  };
  const handleShowReject = () => {
    setShowReject(true);
    setValues("Rejected");
  };
  const handleYesReject = () => {
    verifyOrganization();
  };

  const getDisplayButton = (verified) => {
    if (verified === "Pending") return "inline";
    if (verified === "Verified") return "none";
    if (verified === "Rejected") return "none";
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
  if (dataVerify)
    return (
      <Modal show={showSuccess} backdrop="static" keyboard={false}>
        <Alert variant="success" className="mb-0">
          <Alert.Heading>Verify successful</Alert.Heading>
          <hr />
          <div className="d-flex justify-content-end">
            <Button onClick={handleCloseSuccess} variant="outline-success">
              Continue
            </Button>
          </div>
        </Alert>
      </Modal>
    );

  return (
    <Container>
      <Modal
        show={showApprove}
        onHide={handleCloseApprove}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Verify NGO</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to verify this NGO?</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleCloseApprove}>
            No
          </Button>
          <Button variant="success" onClick={handleYesApprove}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showReject}
        onHide={handleCloseReject}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Reject NGO</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to reject this NGO?</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleCloseReject}>
            No
          </Button>
          <Button variant="success" onClick={handleYesReject}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
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
                <br></br>
                <Button
                  style={{
                    display: getDisplayButton(data.oneOrganization.verified),
                  }}
                  className="float-right"
                  variant="danger"
                  onClick={handleShowReject}
                >
                  Reject
                </Button>
                <Button
                  style={{
                    marginRight: 10,
                    display: getDisplayButton(data.oneOrganization.verified),
                  }}
                  className="float-right"
                  variant="success"
                  onClick={handleShowApprove}
                >
                  Verify
                </Button>
              </div>
              <br></br>
              <br></br>
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
                                  to={`/adminProgramDetails/${organizations._id}`}
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

export default AdminNGODetails;
