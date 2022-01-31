import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { CREATE_ADMIN } from "../../GraphQL/Mutations";
import { useMutation } from "@apollo/client";

import {
  Row,
  Col,
  Container,
  Form,
  Button,
  Alert,
  Modal,
  Figure,
} from "react-bootstrap";
import "../Form.css";

const AdminRegisterPage = () => {
  const [show, setShow] = useState(true);
  const [show1, setShow1] = useState(true);
  const handleClose = () => {
    setShow(false);
    history.go(0);
  };
  const handleClose1 = () => {
    setShow1(false);
    history.push({
      pathname: "/adminLogin",
    });
  };

  const [errors, setErrors] = useState({});
  const [values, setValues] = useState({
    email: "",
    password: "",
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
    const { email, password } = values;
    const newErrors = {};

    if (!email || email === "") newErrors.email = "cannot be blank!";
    if (!password || password === "") newErrors.password = "cannot be blank!";
    return newErrors;
  };

  const [addAdmin, { data, loading, error }] = useMutation(CREATE_ADMIN, {
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
          <Alert.Heading>Ops, something is wrong</Alert.Heading>
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
      <Modal show={show1} backdrop="static" keyboard={false}>
        <Alert variant="success" className="mb-0">
          <Alert.Heading>Registration success</Alert.Heading>
          <p>Please go to Login page to proceed</p>
          <hr />
          <div className="d-flex justify-content-end">
            <Button onClick={handleClose1} variant="outline-success">
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
      addAdmin();
      setValues({
        email: "",
        password: "",
      });
    }
  };

  return (
    <Container>
      <h1 className="font-weight-light text-center mt-4">Join as Admin</h1>
      <h5 className="text-center font-weight-light">Create your account</h5>
      <Row className="justify-content-sm-center mt-4 mb-5">
        <Col lg="5">
          <Form onSubmit={onSubmit} noValidate>
            <Form.Group controlId="formEmail">
              <Form.Control
                required
                type="email"
                placeholder="Email"
                name="email"
                value={values.email}
                onChange={onChange}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">
                Please enter your email address.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formPassword">
              <Form.Control
                required
                type="password"
                placeholder="Password"
                name="password"
                value={values.password}
                onChange={onChange}
                isInvalid={!!errors.password}
              />
              <Form.Control.Feedback type="invalid">
                Please enter your password.
              </Form.Control.Feedback>
            </Form.Group>
            <Button className="btn-block" variant="primary" type="submit">
              Register
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminRegisterPage;
