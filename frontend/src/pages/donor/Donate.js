import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/auth";
import { ADD_FOOD } from "../../GraphQL/Mutations";
import { GET_ONE_PROGRAM } from "../../GraphQL/Queries";
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
} from "react-bootstrap";
import "../Form.css";
import { TrashFill } from "react-bootstrap-icons";

const Donate = ({ match }) => {
  const [form, setForm] = useState([]);
  const [showForm, setShowForm] = useState([]);
  const [show, setShow] = useState(true);
  const handleClose = () => {
    setShow(false);
    history.go(0);
  };
  const {
    params: { id },
  } = match;

  const prevIsValid = () => {
    if (form.length === 0) {
      return true;
    }

    const someEmpty = form.some(
      (item) =>
        item.description === "" || item.name === "" || item.quantity === ""
    );

    if (someEmpty) {
      form.map((item, index) => {
        const allPrev = [...form];

        if (form[index].name === "") {
          allPrev[index].errors.name = "Name is required";
        }

        if (form[index].description === "") {
          allPrev[index].errors.description = "Description is required";
        }

        if (
          form[index].quantity === "" ||
          form[index].quantity == 0 ||
          form[index].quantity < 0
        ) {
          allPrev[index].errors.quantity = "Quantity is required";
        }

        setForm(allPrev);
      });
    }

    return !someEmpty;
  };

  const handleAddLink = (e) => {
    e.preventDefault();
    const inputState = {
      name: "",
      description: "",
      quantity: "",

      errors: {
        name: null,
        description: null,
        quantity: null,
      },
    };
    const inputShowState = {
      name: "",
      description: "",
      quantity: "",
    };

    if (prevIsValid()) {
      setForm((prev) => [...prev, inputState]);
      setShowForm((prev) => [...prev, inputShowState]);
      document.getElementById("sb").disabled = false;
    }
  };

  const onChange = (index, event) => {
    event.preventDefault();
    event.persist();

    setForm((prev) => {
      return prev.map((item, i) => {
        if (i !== index) {
          return item;
        }

        return {
          ...item,
          [event.target.name]: event.target.value,

          errors: {
            ...item.errors,
            [event.target.name]:
              event.target.value.length > 0
                ? null
                : [event.target.name] + " Is required",
          },
        };
      });
    });

    setShowForm((prev) => {
      return prev.map((item, i) => {
        if (i !== index) {
          return item;
        }
        let q;
        let n;
        let d;

        let nV;
        let dV;
        let qV;

        if (event.target.name == "quantity") {
          q = [event.target.name];
          qV = parseInt(event.target.value);
        }

        if (event.target.name == "name") {
          n = [event.target.name];
          nV = event.target.value;
        }

        if (event.target.name == "description") {
          d = [event.target.name];
          dV = event.target.value;
        }

        return {
          ...item,
          [q]: qV,
          [d]: dV,
          [n]: nV,
        };
      });
    });
  };

  const handleRemoveField = (e, index) => {
    e.preventDefault();
    setForm((prev) => prev.filter((item) => item !== prev[index]));
    setShowForm((prev) => prev.filter((item) => item !== prev[index]));

    if (index == 0) {
      document.getElementById("sb").disabled = true;
    }
  };

  const [addFood, { loading, error }] = useMutation(ADD_FOOD, {
    variables: {
      programId: id,
      food: showForm,
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

  const onSubmit = (event) => {
    if (showForm.length > 0) {
      event.preventDefault();
      addFood();
      setForm({
        name: "",
        description: "",
        quantity: "",
      });
      setShowForm({
        name: "",
        description: "",
        quantity: "",
      });
      history.push("/donateHistory");
    } else {
      setShow(true);
    }
  };

  return (
    <div className="container mt-5 py-5">
      <h1>Donate Food</h1>
      <p>Enter the food details</p>

      {/* {JSON.stringify(showForm)} */}
      <form onSubmit={onSubmit}>
        {form.map((item, index) => (
          <div className="row mt-3" key={`item-${index}`}>
            <div className="col">
              <input
                required
                type="text"
                className={
                  item.errors.name ? "form-control  is-invalid" : "form-control"
                }
                name="name"
                placeholder="Name"
                value={item.name}
                onChange={(e) => onChange(index, e)}
              />

              {item.errors.name && (
                <div className="invalid-feedback">{item.errors.name}</div>
              )}
            </div>

            <div className="col">
              <input
                required
                type="text"
                className={
                  item.errors.description
                    ? "form-control  is-invalid"
                    : "form-control"
                }
                name="description"
                placeholder="Description"
                value={item.description}
                onChange={(e) => onChange(index, e)}
              />

              {item.errors.description && (
                <div className="invalid-feedback">
                  {item.errors.description}
                </div>
              )}
            </div>

            <div className="col">
              <input
                required
                type="number"
                min="1"
                className={
                  item.errors.quantity
                    ? "form-control  is-invalid"
                    : "form-control"
                }
                name="quantity"
                placeholder="Quantity"
                value={item.quantity}
                onChange={(e) => onChange(index, e)}
              />

              {item.errors.quantity && (
                <div className="invalid-feedback">{item.errors.quantity}</div>
              )}
            </div>

            <button
              className="btn btn-danger"
              onClick={(e) => handleRemoveField(e, index)}
            >
              <TrashFill />
            </button>
          </div>
        ))}

        <button className="btn btn-primary mt-2" onClick={handleAddLink}>
          Add more
        </button>
        <br></br>
        <br></br>

        <Button
          className="btn-block"
          variant="success"
          type="submit"
          id="sb"
          disabled
        >
          Donate
        </Button>
      </form>
    </div>
  );
};

export default Donate;
