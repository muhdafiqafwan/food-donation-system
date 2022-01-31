import React from "react";
import { GET_MEDONOR_ITEMS } from "../../GraphQL/Queries";
import { useQuery } from "@apollo/client";
import { Row, Col, Container, Card, Badge, Spinner } from "react-bootstrap";
import {
  TelephoneFill,
  ListOl,
  ArchiveFill,
  ClockFill,
  CheckSquareFill,
  XSquareFill,
} from "react-bootstrap-icons";
import ReactTooltip from "react-tooltip";

const DonateHistory = () => {
  function refreshPage() {
    if (!window.location.hash) {
      window.location = window.location + "#loaded";
      window.location.reload();
    }
  }
  const { loading, error, data } = useQuery(GET_MEDONOR_ITEMS);
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

  return (
    <Container onLoad={refreshPage()}>
      <Row className="justify-content-sm-center mt-4 mb-5">
        <Col lg="10">
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="text-center">
                <b>Donation History</b>
              </Card.Title>
              <hr></hr>

              <Row className="justify-content-sm-center mt-4">
                <Col>
                  {data.meDonor.itemDonated.length > 0 ? (
                    data.meDonor.itemDonated.map((items, index) => (
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
                              <b>Status:</b> <ReactTooltip />
                              <p
                                data-html="true"
                                data-tip={`<b>Remarks</b>: ${items.remarks}`}
                                data-place="bottom"
                                data-effect="solid"
                                style={{ float: "right", marginLeft: "3px" }}
                              >
                                <ClockFill
                                  style={{
                                    color: getColor(items.status),
                                    display: getDisplayPending(items.status),
                                  }}
                                ></ClockFill>
                                <XSquareFill
                                  style={{
                                    color: getColor(items.status),
                                    display: getDisplayRejected(items.status),
                                  }}
                                ></XSquareFill>
                                <CheckSquareFill
                                  style={{
                                    color: getColor(items.status),
                                    display: getDisplayApproved(items.status),
                                  }}
                                ></CheckSquareFill>{" "}
                                {items.status}
                              </p>
                            </p>
                            <br></br>
                            <br></br>
                          </div>

                          <hr></hr>
                          <h6>
                            <ListOl /> <b>Food list: </b>
                          </h6>
                          {items.food.map((foods, index) => (
                            <p key={index}>
                              <b>{foods.name}</b>
                              <br></br>
                              {foods.description}
                              <br></br>
                              {foods.quantity} quantity
                            </p>
                          ))}
                          <hr></hr>
                          <h6 className="text-center">
                            <b>Program Details </b>
                          </h6>
                          <div
                            className="text-center"
                            style={{ fontSize: "1.1rem" }}
                          >
                            <Badge variant="dark">{items.program.title}</Badge>{" "}
                            <Badge variant="dark">
                              {items.program.organization.name}
                            </Badge>{" "}
                            <Badge variant="dark">
                              <TelephoneFill style={{ fontSize: "10px" }} />{" "}
                              {items.program.organization.phone}
                            </Badge>
                          </div>
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

export default DonateHistory;
