import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/auth";
import { UPDATE_ORGANIZATION } from "../../GraphQL/Mutations";
import { GET_ONE_ORGANIZATION } from "../../GraphQL/Queries";
import { useMutation, useQuery } from "@apollo/client";
import { useHistory } from "react-router-dom";
import {
  Row,
  Col,
  Container,
  Card,
  Button,
  Form,
  Alert,
  Modal,
  Figure,
} from "react-bootstrap";
import "../Form.css";

const OrganizationUpdateProfile = ({ match }) => {
  const {
    params: { id },
  } = match;

  const { data } = useQuery(GET_ONE_ORGANIZATION, {
    variables: { organizationId: id },
  });

  const [show, setShow] = useState(true);
  const handleClose = () => {
    setShow(false);
    history.go(0);
  };

  const [errors, setErrors] = useState({});
  const [values, setValues] = useState({
    name: data.oneOrganization.name,
    description: data.oneOrganization.description,
    email: data.oneOrganization.email,
    phone: data.oneOrganization.phone,
    bankAcc: data.oneOrganization.bankAcc,
    contactPerson: data.oneOrganization.contactPerson,
    longLat: data.oneOrganization.longLat,
  });
  const [loc, setLoc] = useState({
    long: data.oneOrganization.longLat.split(",")[0].trim(),
    lat: data.oneOrganization.longLat.split(",")[1].trim(),
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
    const { name, description, email, phone, bankAcc, contactPerson, longLat } =
      values;
    const newErrors = {};

    if (!name || name === "") newErrors.name = "cannot be blank!";
    if (!description || description === "")
      newErrors.description = "cannot be blank!";
    if (!email || email === "") newErrors.email = "cannot be blank!";
    if (!phone || phone === "") newErrors.phone = "cannot be blank!";
    if (!contactPerson || contactPerson === "")
      newErrors.contactPerson = "cannot be blank!";
    if (!longLat || longLat === "") newErrors.longLat = "cannot be blank!";
    if (!bankAcc || bankAcc === "") newErrors.bankAcc = "cannot be blank!";
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
      email: values.email,
      phone: values.phone,
      bankAcc: values.bankAcc,
      contactPerson: values.contactPerson,
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

  const [updateOrganization, { loading, error }] = useMutation(
    UPDATE_ORGANIZATION,
    {
      variables: {
        organizationId: id,
        organization: values,
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

  const onSubmit = async (event) => {
    event.preventDefault();
    const newErrors = findFormErrors();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      await updateOrganization();
      history.push(`/organizationProfile/${id}`);
    }
  };

  return (
    <Container>
      <h1 className="font-weight-light text-center mt-4">Update profile</h1>
      <h5 className="text-center font-weight-light">Update your information</h5>
      <Row className="justify-content-sm-center mt-4 mb-5">
        <Col lg="5">
          <Form onSubmit={onSubmit} noValidate>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Program name"
                name="name"
                value={values.name}
                onChange={onChange}
                isInvalid={!!errors.name}
              />
              <Form.Control.Feedback type="invalid">
                Please enter organization name
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formDescription">
              <Form.Label>Description</Form.Label>
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
                Please enter description for the organization
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Email"
                name="email"
                value={values.email}
                onChange={onChange}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">
                Please enter email
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formPhone">
              <Form.Label>Phone Number</Form.Label>
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
                Please enter phone number
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formContactPerson">
              <Form.Label>Contact Person Name</Form.Label>
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
                Please enter contact person name
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formBankAcc">
              <Form.Label>Bank Account Number</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Bank account"
                name="bankAcc"
                value={values.bankAcc}
                onChange={onChange}
                isInvalid={!!errors.bankAcc}
              />
              <Form.Control.Feedback type="invalid">
                Please enter organization's bank account number
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formLonglat">
              <Form.Label>Location</Form.Label>
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

            <Figure>
              <Figure.Image
                alt="171x180"
                src={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-l-circle+f74e4e(${loc.long},${loc.lat})/${loc.long},${loc.lat},15,0/600x300?access_token=${process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}`}
              />
            </Figure>

            <Button className="btn-block" variant="success" type="submit">
              Update
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default OrganizationUpdateProfile;
