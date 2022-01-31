import React, { useState } from "react";
import { UPDATE_PROGRAM } from "../../GraphQL/Mutations";
import { GET_ONE_PROGRAM } from "../../GraphQL/Queries";
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

const ProgramDelete = ({ match }) => {
  const {
    params: { id },
  } = match;

  const { data } = useQuery(GET_ONE_PROGRAM, {
    variables: { programId: id },
  });
  const [show, setShow] = useState(true);
  const handleClose = () => {
    setShow(false);
    history.go(0);
  };

  const [errors, setErrors] = useState({});
  const [values, setValues] = useState({
    title: data.oneProgram.title,
    description: data.oneProgram.description,
    duration: data.oneProgram.duration,
    date: data.oneProgram.date,
    itemNeeded: data.oneProgram.itemNeeded,
    qtyNeeded: data.oneProgram.qtyNeeded,
    bankAcc: data.oneProgram.bankAcc,
    picName: data.oneProgram.picName,
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
    const {
      title,
      description,
      duration,
      date,
      itemNeeded,
      qtyNeeded,
      bankAcc,
      picName,
    } = values;
    const newErrors = {};

    if (!title || title === "") newErrors.title = "cannot be blank!";
    if (!description || description === "")
      newErrors.description = "cannot be blank!";
    if (!duration || duration === "") newErrors.duration = "cannot be blank!";
    if (!date || date === "") newErrors.date = "cannot be blank!";
    if (!itemNeeded || itemNeeded === "")
      newErrors.itemNeeded = "cannot be blank!";
    if (!qtyNeeded || qtyNeeded === "")
      newErrors.qtyNeeded = "cannot be blank!";
    if (!bankAcc || bankAcc === "") newErrors.bankAcc = "cannot be blank!";
    if (!picName || picName === "") newErrors.picName = "cannot be blank!";
    return newErrors;
  };

  const [updateProgram, { loading, error }] = useMutation(UPDATE_PROGRAM, {
    variables: {
      programId: id,
      program: values,
    },
    errorPolicy: "all",
    onError(ApolloError) {
      console.log(ApolloError.message);
    },
  });

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

  const onSubmit = async (event) => {
    event.preventDefault();
    const newErrors = findFormErrors();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      await updateProgram();
      history.push(`/details/${id}`);
    }
  };

  return (
    <Container>
      <h1 className="font-weight-light text-center mt-4">Update program</h1>
      <h5 className="text-center font-weight-light">
        Request for food donation
      </h5>
      <Row className="justify-content-sm-center mt-4 mb-5">
        <Col lg="5">
          <Form onSubmit={onSubmit} noValidate>
            <Form.Group controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Program title"
                name="title"
                value={values.title}
                onChange={onChange}
                isInvalid={!!errors.title}
              />
              <Form.Control.Feedback type="invalid">
                Please enter a title for the program.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Description"
                name="description"
                value={values.description}
                onChange={onChange}
                isInvalid={!!errors.description}
              />
              <Form.Control.Feedback type="invalid">
                Please enter description for the program
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formDuration">
              <Form.Label>Duration</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Duration"
                name="duration"
                value={values.duration}
                onChange={onChange}
                isInvalid={!!errors.duration}
              />
              <Form.Control.Feedback type="invalid">
                Please enter duration for the program
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formDate">
              <Form.Label>Date of Program</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Date"
                name="date"
                value={values.date}
                onChange={onChange}
                isInvalid={!!errors.date}
              />
              <Form.Control.Feedback type="invalid">
                Please enter date for the program
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formItemNeeded">
              <Form.Label>Item Needed</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="ItemNeeded"
                name="itemNeeded"
                value={values.itemNeeded}
                onChange={onChange}
                isInvalid={!!errors.itemNeeded}
              />
              <Form.Control.Feedback type="invalid">
                Please enter item needed for the program
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formQtyNeeded">
              <Form.Label>Quantity Needed</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="QtyNeeded"
                name="qtyNeeded"
                value={values.qtyNeeded}
                onChange={onChange}
                isInvalid={!!errors.qtyNeeded}
              />
              <Form.Control.Feedback type="invalid">
                Please enter quantity item needed for the program
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formBankAcc">
              <Form.Label>Bank Account</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="BankAcc"
                name="bankAcc"
                value={values.bankAcc}
                onChange={onChange}
                isInvalid={!!errors.bankAcc}
              />
              <Form.Control.Feedback type="invalid">
                Please enter bank account number for the program
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formPicName">
              <Form.Label>Person In Charge Name</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="PicName"
                name="picName"
                value={values.picName}
                onChange={onChange}
                isInvalid={!!errors.picName}
              />
              <Form.Control.Feedback type="invalid">
                Please enter person in charge (PIC) name for the program
              </Form.Control.Feedback>
            </Form.Group>

            <Button className="btn-block" variant="success" type="submit">
              Update
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ProgramDelete;