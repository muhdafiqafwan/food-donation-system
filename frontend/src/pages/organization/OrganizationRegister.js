import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { CREATE_ORGANIZATION } from "../../GraphQL/Mutations";
import { regEmail, regPhone, regPass } from "../../util/regex";
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

const OrganizationRegisterPage = () => {
  const [show, setShow] = useState(true);
  const [showSuccess, setShowSuccess] = useState(true);
  const handleClose = () => {
    setShow(false);
    history.go(0);
  };
  const handleCloseSuccess = () => {
    setShowSuccess(false);
    history.push({
      pathname: "/organizationLogin",
    });
  };

  const [errors, setErrors] = useState({});
  const [values, setValues] = useState({
    name: "",
    description: "",
    phone: "",
    longLat: "",
    email: "",
    password: "",
    contactPerson: "",
    bankAcc: "",
  });
  const [loc, setLoc] = useState({
    long: "",
    lat: "",
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
      name,
      description,
      phone,
      longLat,
      email,
      password,
      contactPerson,
      bankAcc,
    } = values;
    const newErrors = {};

    if (!name || name === "")
      newErrors.name = "Please enter your organization name.";

    if (!description || description === "")
      newErrors.description = "Please enter your organization description.";

    if (!phone || phone === "")
      newErrors.phone = "Please enter your phone number.";
    else if (!regPhone.test(phone))
      newErrors.phone = "Invalid phone number format. Eg: 01XXXXXXXX";

    if (!longLat || longLat === "")
      newErrors.longLat = "Please enter your location.";

    if (!email || email === "")
      newErrors.email = "Please enter your email address.";
    else if (!regEmail.test(email)) newErrors.email = "Invalid email format.";

    if (!password || password === "")
      newErrors.password = "Please enter your password.";
    else if (!regPass.test(password))
      newErrors.password =
        "Must have at least 8 characters, must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number.";

    if (!contactPerson || contactPerson === "")
      newErrors.contactPerson = "Please enter contact person name.";

    if (!bankAcc || bankAcc === "")
      newErrors.bankAcc = "Please enter bank account number.";
    return newErrors;
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        getCoordinates,
        handleLocationError
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const getCoordinates = (position) => {
    setValues({
      name: values.name,
      description: values.description,
      phone: values.phone,
      longLat: position.coords.longitude + "," + position.coords.latitude,
    });

    setLoc({
      long: position.coords.longitude,
      lat: position.coords.latitude,
    });
  };

  const handleLocationError = (error) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        alert("User denied the request for Geolocation.");
        break;
      case error.POSITION_UNAVAILABLE:
        alert("Location information is unavailable.");
        break;
      case error.TIMEOUT:
        alert("The request to get user location timed out.");
        break;
      case error.UNKNOWN_ERROR:
        alert("An unknown error occurred.");
        break;
    }
  };

  const [addOrganization, { data, loading, error }] = useMutation(
    CREATE_ORGANIZATION,
    {
      variables: values,
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
      <Modal show={showSuccess} backdrop="static" keyboard={false}>
        <Alert variant="success" className="mb-0">
          <Alert.Heading>Registration success</Alert.Heading>
          <p>Please go to Login page to proceed</p>
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
      addOrganization();
      setValues({
        name: "",
        description: "",
        phone: "",
        latLong: "",
        email: "",
        password: "",
        contactPerson: "",
        bankAcc: "",
      });
    }
  };

  return (
    <Container>
      <h1 className="font-weight-light text-center mt-4">
        Join as Organization
      </h1>
      <h5 className="text-center font-weight-light">Create your account</h5>
      <Row className="justify-content-sm-center mt-4 mb-5">
        <Col lg="5">
          <Form onSubmit={onSubmit} noValidate>
            <Form.Group controlId="formName">
              <Form.Control
                required
                type="text"
                placeholder="Organization name"
                name="name"
                value={values.name}
                onChange={onChange}
                isInvalid={!!errors.name}
              />
              <Form.Control.Feedback type="invalid">
                {errors.name}
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

            <Form.Group controlId="formPhone">
              <Form.Control
                required
                type="text"
                placeholder="Phone number. Eg: 01XXXXXXXX / 03XXXXXXXX"
                name="phone"
                value={values.phone}
                onChange={onChange}
                isInvalid={!!errors.phone}
              />
              <Form.Control.Feedback type="invalid">
                {errors.phone}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formLonglat">
              <Row>
                <Col xl="8">
                  <Form.Control
                    required
                    disabled
                    className="mb-2"
                    type="text"
                    placeholder="Location (Longitude,Latitude)"
                    name="longLat"
                    value={values.longLat}
                    onChange={onChange}
                    isInvalid={!!errors.longLat}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.longLat}
                  </Form.Control.Feedback>
                </Col>
                <Col xl="auto">
                  <Button
                    className="mb-2"
                    variant="primary"
                    onClick={getLocation}
                  >
                    Get Location
                  </Button>
                </Col>
              </Row>
            </Form.Group>

            {loc.long && loc.lat ? (
              <Figure>
                <Figure.Image
                  alt="171x180"
                  src={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-l-circle+f74e4e(${loc.long},${loc.lat})/${loc.long},${loc.lat},15,0/600x300?access_token=${process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}`}
                />
              </Figure>
            ) : null}

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
                {errors.email}
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
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formContact">
              <Form.Control
                required
                type="text"
                placeholder="Contact person name"
                name="contactPerson"
                value={values.contactPerson}
                onChange={onChange}
                isInvalid={!!errors.contactPerson}
              />
              <Form.Control.Feedback type="invalid">
                {errors.contactPerson}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formBank">
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

            <Button className="btn-block" variant="primary" type="submit">
              Register
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default OrganizationRegisterPage;
