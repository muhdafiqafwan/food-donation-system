import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Nav, Navbar } from "react-bootstrap";
import { AuthContext } from "../context/auth";

function NavBar() {
  const { user, logout: logoutUser } = useContext(AuthContext);
  console.log(user);

  const navBar =
    user.isAuth && user.role === "donor" ? (
      <div>
        <Navbar collapseOnSelect expand="sm" bg="navCol" variant="dark">
          <Navbar.Brand eventKey={1} as={Link} to="/donorHomepage">
            Home
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ml-auto">
              <Nav.Item>
                <Nav.Link
                  eventKey={2}
                  as={Link}
                  to={`/donorProfile/${user.user.donorId}`}
                >
                  Profile
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey={3} as={Link} to="/donateHistory">
                  Donation
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey={4} onClick={logoutUser} as={Link} to="/">
                  Logout
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    ) : user.isAuth && user.role === "organization" ? (
      <div>
        <Navbar collapseOnSelect expand="sm" bg="navCol" variant="dark">
          <Navbar.Brand eventKey={1} as={Link} to="/organizationDashboard">
            Home
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ml-auto">
              <Nav.Item>
                <Nav.Link
                  eventKey={2}
                  as={Link}
                  to={`/organizationProfile/${user.user.organizationId}`}
                >
                  Profile
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey={3} onClick={logoutUser} as={Link} to="/">
                  Logout
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    ) : user.isAuth && user.role === "admin" ? (
      <div>
        <Navbar collapseOnSelect expand="sm" bg="navCol" variant="dark">
          <Navbar.Brand eventKey={1} as={Link} to="/adminDashboard">
            Home
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ml-auto">
              <Nav.Item>
                <Nav.Link eventKey={2} onClick={logoutUser} as={Link} to="/">
                  Logout
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    ) : null;

  return navBar;
}

export default NavBar;
