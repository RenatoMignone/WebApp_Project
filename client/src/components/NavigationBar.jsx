import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function NavigationBar({ user, onLogout }) {
  const navigate = useNavigate();

  return (
    <Navbar style={{ background: 'linear-gradient(90deg, #1e3a8a 0%, #1e40af 100%)' }} variant="dark" expand="lg" fixed="top" className="shadow-lg">
      <Container>
        {/* App title */}
        <Navbar.Brand href="/" className="fw-bold fs-4">
          <i className="bi bi-shield-lock-fill me-2"></i>
          Cybersecurity Forum
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {user ? (
              <>
                {/* Display user information */}
                <Nav.Link disabled className="text-light me-3">
                  <i className="bi bi-person-circle me-1"></i>
                  Welcome, <span className="fw-bold">{user.name}</span>
                  {user.is_admin && <span className="badge bg-warning text-dark ms-2">Admin</span>}
                </Nav.Link>
                {/* Logout button */}
                <Button variant="outline-light" onClick={onLogout} style={{ borderRadius: '20px' }}>
                  <i className="bi bi-box-arrow-right me-1"></i>
                  Logout
                </Button>
              </>
            ) : (
              // Login button for unauthenticated users
              <Button variant="outline-light" onClick={() => navigate('/login')} style={{ borderRadius: '20px' }}>
                <i className="bi bi-box-arrow-in-right me-1"></i>
                Login
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
