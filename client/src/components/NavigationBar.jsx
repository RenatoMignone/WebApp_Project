// -----------------------------------------------------------------------------
// NavigationBar Component
// -----------------------------------------------------------------------------
// This component provides a fixed navigation bar at the top of the application.
// It displays the app title, user information (if logged in), and login/logout buttons.
// -----------------------------------------------------------------------------

import React from 'react';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function NavigationBar({ user, onLogout }) {
  const navigate = useNavigate();

  return (
    <Navbar bg="primary" variant="dark" expand="lg" fixed="top">
      <Container>
        {/* App title */}
        <Navbar.Brand href="/">Cybersecurity Forum</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {user ? (
              <>
                {/* Display user information */}
                <Nav.Link disabled>Welcome, {user.name}</Nav.Link>
                {/* Logout button */}
                <Button variant="outline-light" onClick={onLogout}>Logout</Button>
              </>
            ) : (
              // Login button for unauthenticated users
              <Button variant="outline-light" onClick={() => navigate('/login')}>Login</Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
