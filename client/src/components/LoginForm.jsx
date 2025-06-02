// -----------------------------------------------------------------------------
// LoginForm Component
// -----------------------------------------------------------------------------
// This component provides a form for user authentication. It supports both
// standard login with username and password and TOTP-based 2FA verification.
// -----------------------------------------------------------------------------

import React, { useState } from 'react';
import { Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function LoginForm({ onLogin, totpRequired, onTotp }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = event => {
    event.preventDefault();
    if (totpRequired) {
      onTotp(totpCode).catch(() => setErrorMessage('Invalid TOTP code'));
    } else {
      onLogin({ username, password }).catch(() => setErrorMessage('Invalid credentials'));
    }
  };

  return (
    <Row className="justify-content-center px-3 py-4">
      <Col xs={12} sm={10} md={8} lg={6}> {/* Adjusted column size for wider form */}
        <div className="card shadow-lg border-0" style={{ background: '#ffffff', borderRadius: '10px' }}>
          <div className="card-body p-4">
            <h2 className="text-center mb-4 text-primary">
              <i className="bi bi-shield-lock-fill"></i> Login
            </h2>
            <Form onSubmit={handleSubmit}>
              {/* Display error messages */}
              {errorMessage && (
                <Alert variant="danger" onClose={() => setErrorMessage('')} dismissible>
                  {errorMessage}
                </Alert>
              )}
              {!totpRequired ? (
                <>
                  {/* Username input */}
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Username</Form.Label>
                    <Form.Control
                      type="text"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      placeholder="Enter your username"
                      required
                      style={{ borderRadius: '5px' }}
                    />
                  </Form.Group>
                  {/* Password input */}
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      style={{ borderRadius: '5px' }}
                    />
                  </Form.Group>
                </>
              ) : (
                <>
                  {/* TOTP Code input */}
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">TOTP Code</Form.Label>
                    <Form.Control
                      type="text"
                      value={totpCode}
                      onChange={e => setTotpCode(e.target.value)}
                      placeholder="Enter your TOTP code"
                      required
                      style={{ borderRadius: '5px' }}
                    />
                  </Form.Group>
                  <div className="text-muted mb-3">
                    <small>
                      Use the code from your authenticator app to complete the login process.
                    </small>
                  </div>
                </>
              )}
              {/* Submit button */}
              <Button
                type="submit"
                variant="primary"
                className="w-100 fw-bold"
                style={{ borderRadius: '5px' }}
              >
                {totpRequired ? 'Verify TOTP' : 'Login'}
              </Button>
            </Form>
          </div>
        </div>
      </Col>
    </Row>
  );
}

export default LoginForm;
