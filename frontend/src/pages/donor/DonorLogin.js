import React, { useContext, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { LOGIN_DONOR } from "../../GraphQL/Queries";
import { useLazyQuery } from "@apollo/client";
import { AuthContext } from "../../context/auth";

import {
  Row,
  Col,
  Container,
  Form,
  Button,
  Alert,
  Modal,
} from "react-bootstrap";
import "../Form.css";

const DonorLoginPage = (props) => {
  const context = useContext(AuthContext);
  const [show, setShow] = useState(true);
  const handleClose = () => {
    setShow(false);
    history.go(0);
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

  const [loginDonor, { error, loading, data }] = useLazyQuery(LOGIN_DONOR, {
    onCompleted() {
      context.login(data);
      console.log(data.loginDonor.accessToken);
      props.history.push("/donorHomepage");
    },
    variables: values,
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

  if (data) console.log(data);

  const onSubmit = (event) => {
    event.preventDefault();
    const newErrors = findFormErrors();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      loginDonor();
    }
  };

  return (
    <Container>
      <h1 className="font-weight-light text-center mt-4">Log In</h1>
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

            <Button className="btn-block mb-4" variant="primary" type="submit">
              Login
            </Button>
          </Form>
          <hr />
          <h6 className="text-center font-weight-light mt-4">
            Don't have an account? Become a donor.
          </h6>
          <Link to="/donorRegister" style={{ textDecoration: "none" }}>
            <Button className="btn-block mt-2" variant="success" type="submit">
              Register
            </Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default DonorLoginPage;
