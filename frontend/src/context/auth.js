import React, { useReducer, createContext } from "react";
import jwtDecode from "jwt-decode";

const initialState = {
  isAuth: false,
  user: null,
  role: null,
};

if (localStorage.getItem("token")) {
  const decodedToken = jwtDecode(localStorage.getItem("token"));

  if (decodedToken.exp * 1000 < Date.now()) {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  } else {
    if (localStorage.getItem("role") == "donor") {
      initialState.user = decodedToken;
      initialState.isAuth = true;
      initialState.role = "donor";
    } else if (localStorage.getItem("role") == "organization") {
      initialState.user = decodedToken;
      initialState.isAuth = true;
      initialState.role = "organization";
    } else if (localStorage.getItem("role") == "admin") {
      initialState.user = decodedToken;
      initialState.isAuth = true;
      initialState.role = "admin";
    }
  }
}

const AuthContext = createContext({
  isAuth: false,
  user: null,
  role: null,
  login: (data) => {},
  logout: () => {},
});

function authReducer(state, action) {
  switch (action.type) {
    case "LOGIN_DONOR":
      return {
        ...state,
        isAuth: true,
        user: action.payload,
        role: "donor",
      };
    case "LOGIN_ORGANIZATION":
      return {
        ...state,
        isAuth: true,
        user: action.payload,
        role: "organization",
      };
    case "LOGIN_ADMIN":
      return {
        ...state,
        isAuth: true,
        user: action.payload,
        role: "admin",
      };
    case "LOGOUT":
      return {
        ...state,
        isAuth: false,
        user: null,
        role: null,
      };
    default:
      return state;
  }
}

function AuthProvider(props) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  function login(data) {
    if (data.loginDonor) {
      localStorage.setItem("token", data.loginDonor.accessToken);
      localStorage.setItem("role", "donor");
      dispatch({
        type: "LOGIN_DONOR",
        payload: data,
      });
    } else if (data.loginOrganization) {
      localStorage.setItem("token", data.loginOrganization.accessToken);
      localStorage.setItem("role", "organization");
      dispatch({
        type: "LOGIN_ORGANIZATION",
        payload: data,
      });
    } else if (data.loginAdmin) {
      localStorage.setItem("token", data.loginAdmin.accessToken);
      localStorage.setItem("role", "admin");
      dispatch({
        type: "LOGIN_ADMIN",
        payload: data,
      });
    }
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    dispatch({ type: "LOGOUT" });
  }

  return (
    <AuthContext.Provider value={{ user: state, login, logout }} {...props} />
  );
}

export { AuthContext, AuthProvider };
