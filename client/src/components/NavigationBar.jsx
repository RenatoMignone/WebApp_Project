import React from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';

function NavigationBar({ user, onLogout }) {
  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="mb-4" style={{ position: 'fixed', top: 0, width: '100%', zIndex: 1040 }}>
      <Container>
        <Navbar.Brand href="/">
          <i className="bi bi-chat-dots"></i> Forum
        </Navbar.Brand>
        <Nav className="ms-auto">
          {user ? (
            <>
              <Navbar.Text className="me-3">
                <i className="bi bi-person-circle"></i> {user.name} ({user.username})
              </Navbar.Text>
              <Button variant="outline-light" size="sm" onClick={onLogout}>
                <i className="bi bi-box-arrow-right"></i> Logout
              </Button>
            </>
          ) : (
            <Button variant="outline-light" size="sm" href="/login">
              <i className="bi bi-box-arrow-in-right"></i> Login
            </Button>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
