import React, { useState } from "react";
import { CREATE_PROGRAM } from "../../GraphQL/Mutations";
import { regBankAcc } from "../../util/regex";
import { useMutation } from "@apollo/client";
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

const Program = () => {
  const [show, setShow] = useState(true);
  const [showSuccess, setShowSuccess] = useState(true);
  const handleClose = () => {
    setShow(false);
    history.go(0);
  };
  const handleCloseSuccess = () => {
    setShowSuccess(false);
    history.push({
      pathname: "/organizationDashboard",
    });
  };

  const [type, setType] = useState("text");
  const [errors, setErrors] = useState({});
  const [values, setValues] = useState({
    title: "",
    description: "",
    duration: "",
    date: "",
    itemNeeded: "",
    qtyNeeded: "",
    bankAcc: "",
    picName: "",
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

    if (!title || title === "")
      newErrors.title = "Please enter a title for the program.";

    if (!description || description === "")
      newErrors.description = "Please enter description for the program.";

    if (!duration || duration === "")
      newErrors.duration = "Please enter duration for the program.";

    if (!date || date === "")
      newErrors.date = "Please enter date for the program.";

    if (!itemNeeded || itemNeeded === "")
      newErrors.itemNeeded = "Please enter item needed for the program.";

    if (!qtyNeeded || qtyNeeded === "")
      newErrors.qtyNeeded =
        "Please enter quantity item needed for the program.";

    if (!bankAcc || bankAcc === "")
      newErrors.bankAcc = "Please enter bank account number for the program.";
    else if (!regBankAcc.test(bankAcc))
      newErrors.bankAcc = "Invalid bank account number format.";

    if (!picName || picName === "")
      newErrors.picName =
        "Please enter person in charge (PIC) name for the program.";
    return newErrors;
  };

  const [addProgram, { data, loading, error }] = useMutation(CREATE_PROGRAM, {
    variables: values,
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

  if (data)
    return (
      <Modal show={showSuccess} backdrop="static" keyboard={false}>
        <Alert variant="success" className="mb-0">
          <Alert.Heading>Program created successfully</Alert.Heading>
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
      addProgram();
      setValues({
        title: "",
        description: "",
        duration: "",
        date: "",
        itemNeeded: "",
        qtyNeeded: "",
        bankAcc: "",
        picName: "",
      });
    }
  };

  return (
    <Container>
      <h1 className="font-weight-light text-center mt-4">Create program</h1>
      <h5 className="text-center font-weight-light">
        Request for food donation
      </h5>
      <Row className="justify-content-sm-center mt-4 mb-5">
        <Col lg="5">
          <Form onSubmit={onSubmit} noValidate>
            <Form.Group controlId="formTitle">
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
                {errors.title}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formDescription">
              <Form.Control
                required
                as="textarea"
                style={{ height: "100px" }}
                placeholder="Description"
                name="description"
                value={values.description}
                onChange={onChange}
                isInvalid={!!errors.description}
              />
              <Form.Control.Feedback type="invalid">
                {errors.description}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formDuration">
              <Form.Control
                required
                type="text"
                placeholder="Duration. Eg: 1 week, etc."
                name="duration"
                value={values.duration}
                onChange={onChange}
                isInvalid={!!errors.duration}
              />
              <Form.Control.Feedback type="invalid">
                {errors.duration}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formDate">
              <Form.Control
                required
                type={type}
                onFocus={() => setType("date")}
                placeholder="Date"
                name="date"
                value={values.date}
                onChange={onChange}
                isInvalid={!!errors.date}
              />
              <Form.Control.Feedback type="invalid">
                {errors.date}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formItemNeeded">
              <Form.Control
                required
                type="text"
                placeholder="Item needed"
                name="itemNeeded"
                value={values.itemNeeded}
                onChange={onChange}
                isInvalid={!!errors.itemNeeded}
              />
              <Form.Control.Feedback type="invalid">
                {errors.itemNeeded}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formQtyNeeded">
              <Form.Control
                required
                type="text"
                placeholder="Quantity needed"
                name="qtyNeeded"
                value={values.qtyNeeded}
                onChange={onChange}
                isInvalid={!!errors.qtyNeeded}
              />
              <Form.Control.Feedback type="invalid">
                {errors.qtyNeeded}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formBankAcc">
              <Form.Control
                required
                type="text"
                placeholder="Bank account number"
                name="bankAcc"
                value={values.bankAcc}
                onChange={onChange}
                isInvalid={!!errors.bankAcc}
              />
              <Form.Control.Feedback type="invalid">
                {errors.bankAcc}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formPicName">
              <Form.Control
                required
                type="text"
                placeholder="Person in Charge name"
                name="picName"
                value={values.picName}
                onChange={onChange}
                isInvalid={!!errors.picName}
              />
              <Form.Control.Feedback type="invalid">
                {errors.picName}
              </Form.Control.Feedback>
            </Form.Group>

            <Button className="btn-block" variant="primary" type="submit">
              Add
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Program;
