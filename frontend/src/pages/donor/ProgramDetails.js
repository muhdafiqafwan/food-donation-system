import React from "react";
import { GET_ONE_PROGRAM } from "../../GraphQL/Queries";
import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import moment from "moment";
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
  BagCheckFill,
  Calendar2WeekFill,
  CalendarDateFill,
  ListOl,
} from "react-bootstrap-icons";

const ProgramDetails = ({ match }) => {
  const {
    params: { id },
  } = match;

  const { loading, error, data } = useQuery(GET_ONE_PROGRAM, {
    variables: { programId: id },
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

              <Link
                to={`/donate/${data.oneProgram._id}`}
                style={{ textDecoration: "none" }}
              >
                <Button className="float-right" variant="primary" type="submit">
                  Donate
                </Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProgramDetails;
