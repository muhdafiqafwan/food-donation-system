import React, { useState } from "react";
import { UPDATE_ITEM } from "../../GraphQL/Mutations";
import { GET_ONEUPDATE_ITEM } from "../../GraphQL/Queries";
import { useMutation, useQuery } from "@apollo/client";
import { useHistory } from "react-router-dom";
import {
  Row,
  Col,
  Container,
  Button,
  Form,
  Alert,
  Modal,
} from "react-bootstrap";
import "../Form.css";

const DonationReject = ({ match }) => {
  const {
    params: { id },
  } = match;

  const { data } = useQuery(GET_ONEUPDATE_ITEM, {
    variables: { itemId: id },
  });

  const [show, setShow] = useState(true);
  const [showSuccess, setShowSuccess] = useState(true);
  const handleClose = () => {
    setShow(false);
    history.go(0);
  };
  const handleCloseSuccess = () => {
    setShowSuccess(false);
    history.push({
      pathname: `/details/${data.oneItem.program._id}`,
    });
  };

  const [errors, setErrors] = useState({});
  const [values, setValues] = useState({
    remarks: "",
    status: "Rejected",
  });

  const onChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
    if (!!errors[event.target.name])
      setErrors({
        ...errors,
        [event.target.name]: null,
      });
  };

  const findFormErrors = () => {
    const { remarks } = values;
    const newErrors = {};

    if (!remarks || remarks === "") newErrors.remarks = "cannot be blank!";
    return newErrors;
  };

  const [updateItem, { data: dataUpdate, loading, error }] = useMutation(
    UPDATE_ITEM,
    {
      variables: {
        itemId: id,
        item: values,
      },
      errorPolicy: "all",
      onError(ApolloError) {
        console.log(ApolloError.message);
      },
    }
  );

  const history = useHistory();

  if (loading)
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border mt-5"></div>
      </div>
    );

  const gqlErrorMessage = window.gqlErrorMessage;

  if (error)
    return (
      <Modal show={show} backdrop="static" keyboard={false}>
        <Alert variant="danger" className="mb-0">
          <Alert.Heading>Oops, something is wrong</Alert.Heading>
          <p>{gqlErrorMessage}</p>
          <hr />
          <div className="d-flex justify-content-end">
            <Button onClick={handleClose} variant="outline-danger">
              Try again
            </Button>
          </div>
        </Alert>
      </Modal>
    );

  if (dataUpdate)
    return (
      <Modal show={showSuccess} backdrop="static" keyboard={false}>
        <Alert variant="success" className="mb-0">
          <Alert.Heading>Food donation rejected</Alert.Heading>
          <hr />
          <div className="d-flex justify-content-end">
            <Button onClick={handleCloseSuccess} variant="outline-success">
              Continue
            </Button>
          </div>
        </Alert>
      </Modal>
    );

  const onSubmit = (event) => {
    event.preventDefault();
    const newErrors = findFormErrors();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      updateItem();
    }
  };

  return (
    <Container>
      <h1 className="font-weight-light text-center mt-4">Reject Donation</h1>
      <h5 className="text-center font-weight-light">
        Enter remarks or reasons for rejection
      </h5>
      <Row className="justify-content-sm-center mt-4 mb-5">
        <Col lg="5">
          <Form onSubmit={onSubmit} noValidate>
            <Form.Group controlId="formStatus">
              <Form.Control
                required
                type="text"
                placeholder="Remarks"
                name="remarks"
                value={values.remarks}
                onChange={onChange}
                isInvalid={!!errors.remarks}
              />
              <Form.Control.Feedback type="invalid">
                Please enter remarks for the rejection
              </Form.Control.Feedback>
            </Form.Group>
            <Button className="btn-block" variant="success" type="submit">
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default DonationReject;
