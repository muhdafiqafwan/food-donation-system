import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { CREATE_DONOR } from "../../GraphQL/Mutations";
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

const DonorRegisterPage = () => {
  const [show, setShow] = useState(true);
  const [showSuccess, setShowSuccess] = useState(true);
  const handleClose = () => {
    setShow(false);
    history.go(0);
  };
  const handleCloseSuccess = () => {
    setShowSuccess(false);
    history.push({
      pathname: "/donorLogin",
    });
  };

  const [errors, setErrors] = useState({});
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    longLat: "",
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

  let regName = RegExp(/^[0-9]*$/);

  const findFormErrors = () => {
    const { firstName, lastName, phone, email, password, longLat } = values;
    const newErrors = {};

    if (!firstName || firstName === "")
      newErrors.firstName = "cannot be blank!";
    if (!lastName || lastName === "") newErrors.lastName = "cannot be blank!";
    if (!phone || phone === "")
      newErrors.phone = "Please enter your phone number.";
    if (!regName.test(phone)) newErrors.phone = "Cannot contain alphabet.";
    if (!email || email === "") newErrors.email = "cannot be blank!";
    if (!password || password === "") newErrors.password = "cannot be blank!";
    if (!longLat || longLat === "") newErrors.longLat = "cannot be blank!";

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
      firstName: values.firstName,
      lastName: values.lastName,
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

  const [addDonor, { data, loading, error }] = useMutation(CREATE_DONOR, {
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
      addDonor();
      setValues({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        password: "",
        latLong: "",
      });
    }
  };

  return (
    <Container>
      <h1 className="font-weight-light text-center mt-4">Become a Donor</h1>
      <h5 className="text-center font-weight-light">Create your account</h5>
      <Row className="justify-content-sm-center mt-4 mb-5">
        <Col lg="5">
          <Form onSubmit={onSubmit} noValidate>
            <Form.Group controlId="formFirstName">
              <Form.Control
                required
                type="text"
                placeholder="First name"
                name="firstName"
                value={values.firstName || ""}
                onChange={onChange}
                isInvalid={!!errors.firstName}
              />
              <Form.Control.Feedback type="invalid">
                Please enter your first name.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formLastName">
              <Form.Control
                required
                type="text"
                placeholder="Last name"
                name="lastName"
                value={values.lastName}
                onChange={onChange}
                isInvalid={!!errors.lastName}
              />
              <Form.Control.Feedback type="invalid">
                Please enter your last name.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formPhone">
              <Form.Control
                required
                type="text"
                placeholder="Phone number"
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
                    Please enter your location in (longitude,latitude).
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

export default DonorRegisterPage;
