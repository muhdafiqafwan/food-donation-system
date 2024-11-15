import React, { useState } from "react";
import { GET_ONE_PROGRAM } from "../../GraphQL/Queries";
import { DELETE_PROGRAM } from "../../GraphQL/Mutations";
import { useQuery, useMutation } from "@apollo/client";
import { Link, useHistory } from "react-router-dom";
import moment from "moment";
import {
  Row,
  Col,
  Container,
  Card,
  Button,
  Badge,
  Modal,
  Spinner,
  Alert,
} from "react-bootstrap";
import {
  BagCheckFill,
  Calendar2WeekFill,
  CalendarDateFill,
  ListOl,
  TelephoneFill,
  ArchiveFill,
  ClockFill,
  CheckSquareFill,
  XSquareFill,
} from "react-bootstrap-icons";
import ReactTooltip from "react-tooltip";

const Details = ({ match }) => {
  const history = useHistory();
  function refreshPage() {
    if (!window.location.hash) {
      window.location = window.location + "#loaded";
      window.location.reload();
    }
  }
  const {
    params: { id },
  } = match;

  const [show, setShow] = useState(false);
  const [showSuccess, setShowSuccess] = useState(true);
  const handleCloseSuccess = () => {
    setShowSuccess(false);
    history.push({
      pathname: "/organizationDashboard",
    });
  };

  const { loading, error, data } = useQuery(GET_ONE_PROGRAM, {
    variables: { programId: id },
  });

  const [deleteProgram, { data: dataDelete }] = useMutation(DELETE_PROGRAM, {
    variables: {
      programId: id,
    },
    errorPolicy: "all",
    onError(ApolloError) {
      console.log(ApolloError.message);
    },
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
  if (dataDelete)
    return (
      <Modal show={showSuccess} backdrop="static" keyboard={false}>
        <Alert variant="success" className="mb-0">
          <Alert.Heading>Program deleted</Alert.Heading>
          <hr />
          <div className="d-flex justify-content-end">
            <Button onClick={handleCloseSuccess} variant="outline-success">
              Continue
            </Button>
          </div>
        </Alert>
      </Modal>
    );

  const getColor = (status) => {
    if (status === "Pending") return "#fab603";
    if (status === "Approved") return "#00cc00";
    if (status === "Rejected") return "#f7040b";
    return "";
  };

  const getDisplayPending = (status) => {
    if (status === "Pending") return "inline";
    if (status === "Approved") return "none";
    if (status === "Rejected") return "none";
    return "";
  };

  const getDisplayApproved = (status) => {
    if (status === "Pending") return "none";
    if (status === "Approved") return "inline";
    if (status === "Rejected") return "none";
    return "";
  };

  const getDisplayRejected = (status) => {
    if (status === "Pending") return "none";
    if (status === "Approved") return "none";
    if (status === "Rejected") return "inline";
    return "";
  };

  const getDisplayButton = (status) => {
    if (status === "Pending") return "inline";
    if (status === "Approved") return "none";
    if (status === "Rejected") return "none";
    return "";
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleYes = () => {
    deleteProgram();
  };

  return (
    <Container onLoad={refreshPage()}>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete program</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this program?</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            No
          </Button>
          <Button variant="success" onClick={handleYes}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>

      <Row className="justify-content-sm-center mt-4 mb-5">
        <Col lg="10">
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="text-center">
                <b>{data.oneProgram.title}</b>
              </Card.Title>
              <hr></hr>

              <Card.Text>
                <b>Description</b>
              </Card.Text>
              <Card.Text>{data.oneProgram.description}</Card.Text>
              <hr></hr>

              <Card.Text>
                <b>Details</b>
              </Card.Text>
              <h5>
                <Badge variant="dark">
                  <CalendarDateFill />{" "}
                  {moment(data.oneProgram.date).format("DD/MM/YYYY")}
                </Badge>{" "}
                <Badge variant="dark">
                  <Calendar2WeekFill /> {data.oneProgram.duration} duration
                </Badge>{" "}
                <Badge variant="dark">
                  <BagCheckFill /> {data.oneProgram.itemNeeded}
                </Badge>{" "}
                <Badge variant="dark">
                  <ListOl /> {data.oneProgram.qtyNeeded}
                </Badge>
              </h5>
              <hr></hr>

              <Card.Text>
                <b>Bank Account</b>
              </Card.Text>
              <Card.Text>{data.oneProgram.bankAcc}</Card.Text>
              <hr></hr>

              <Card.Text>
                <b>Person in Charge (PIC)</b>
              </Card.Text>
              <Card.Text>{data.oneProgram.picName}</Card.Text>
              <Button
                className="float-right"
                variant="danger"
                onClick={handleShow}
              >
                Delete
              </Button>
              <Link
                to={`/programUpdate/${data.oneProgram._id}`}
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

      <Row className="justify-content-sm-center mt-4 mb-5">
        <Col lg="10">
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="text-center">
                <b>List of Donations</b>
              </Card.Title>
              <hr></hr>

              <Row className="justify-content-sm-center mt-4">
                <Col>
                  {data.oneProgram.items.length > 0 ? (
                    data.oneProgram.items.map((item, index) => (
                      <Card
                        className="shadow-sm"
                        key={index}
                        style={{ height: "auto", marginBottom: 40 }}
                      >
                        <Card.Body>
                          <div>
                            <p style={{ float: "left" }}>
                              <b>Donation #{index + 1}</b>
                            </p>
                            <p style={{ float: "right" }}>
                              <b>Status:</b>
                              <ReactTooltip />
                              <p
                                data-html="true"
                                data-tip={`<b>Remarks</b>: ${item.remarks}`}
                                data-place="bottom"
                                data-effect="solid"
                                style={{ float: "right", marginLeft: "3px" }}
                              >
                                <ClockFill
                                  style={{
                                    color: getColor(item.status),
                                    display: getDisplayPending(item.status),
                                  }}
                                ></ClockFill>
                                <XSquareFill
                                  style={{
                                    color: getColor(item.status),
                                    display: getDisplayRejected(item.status),
                                  }}
                                ></XSquareFill>
                                <CheckSquareFill
                                  style={{
                                    color: getColor(item.status),
                                    display: getDisplayApproved(item.status),
                                  }}
                                ></CheckSquareFill>{" "}
                                {item.status}
                              </p>
                            </p>
                            <br></br>

                            <br></br>
                            <p>
                              <b>Donor:</b>{" "}
                              <Badge variant="dark">
                                {item.donor.firstName} {item.donor.lastName}
                              </Badge>{" "}
                              <Badge variant="dark">{item.donor.email}</Badge>{" "}
                              <Badge variant="dark">
                                <TelephoneFill style={{ fontSize: "10px" }} />{" "}
                                {item.donor.phone}
                              </Badge>
                            </p>
                          </div>

                          <hr></hr>
                          <h6>
                            <ListOl /> <b>Food list: </b>
                          </h6>
                          {item.food.map((foods, index) => (
                            <p key={index}>
                              <b>{foods.name}</b>
                              <br></br>
                              {foods.description}
                              <br></br>
                              {foods.quantity} quantity
                            </p>
                          ))}
                          <hr></hr>
                          <Link
                            to={`/donationReject/${item._id}`}
                            style={{
                              textDecoration: "none",
                              display: getDisplayButton(item.status),
                            }}
                          >
                            <Button
                              className="float-right"
                              variant="danger"
                              type="submit"
                            >
                              Reject
                            </Button>
                          </Link>
                          <Link
                            to={`/donationApprove/${item._id}`}
                            style={{
                              textDecoration: "none",
                              display: getDisplayButton(item.status),
                            }}
                          >
                            <Button
                              style={{ marginRight: 10 }}
                              className="float-right"
                              variant="success"
                              type="submit"
                            >
                              Approve
                            </Button>
                          </Link>
                        </Card.Body>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center">
                      <ArchiveFill
                        style={{ fontSize: "9rem", color: "#d9d9d9" }}
                      ></ArchiveFill>
                      <br></br>
                      <h4>
                        <b>It's empty here</b>
                      </h4>
                      <p>No donations yet.</p>
                    </div>
                  )}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Details;
