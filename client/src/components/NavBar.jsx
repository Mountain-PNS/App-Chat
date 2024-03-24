import React from "react";
import { useContext } from "react";
import { Container, Nav, Navbar, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AuthContex } from "../context/AuthContex";
import Notifications from "./chat/Notifications";
const NavBar = () => {
  const { user, logoutUser } = useContext(AuthContex);

  return (
    <Navbar bg="dark" className="mb-4" style={{ height: "4.75rem" }}>
      <Container>
        <h1>
          <Link to="/" className="link-light text-decoration-none">
            ChatAPP
          </Link>
        </h1>
        <span className="test-warning">Logged in as {user?.name}</span>
        <Nav>
          <Stack direction="horizontal" gap={3}>
            <Notifications/>
            {user && (
              <>
                <Link
                  onClick={() => logoutUser()}
                  to="/login"
                  className="link-light text-decoration-none"
                >
                  LogOut
                </Link>
              </>
            )}
            {!user && (
              <>
                <Link to="/login" className="link-light text-decoration-none">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="link-light text-decoration-none"
                >
                  Register
                </Link>
              </>
            )}
          </Stack>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavBar;
