// -----------------------------------------------------------------------------
// LoginForm Component
// -----------------------------------------------------------------------------
// This component provides a form for user authentication. It supports both
// standard login with username and password and TOTP-based 2FA verification.
// -----------------------------------------------------------------------------

import React, { useState } from 'react';
import { Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function LoginForm({ onLogin, totpRequired, onTotp, onSkipTotp }) {
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
      <Col xs={12} sm={10} md={8} lg={6}>
        <div className="card shadow-lg border-0" style={{ background: '#ffffff', borderRadius: '20px' }}>
          <div className="card-body p-5">
            <div className="text-center mb-4">
              <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px', background: 'linear-gradient(45deg, #1e40af, #3b82f6)' }}>
                <i className="bi bi-shield-lock-fill text-white" style={{ fontSize: '2rem' }}></i>
              </div>
              <h2 className="fw-bold" style={{ color: '#1e40af' }}>
                {totpRequired ? 'Two-Factor Authentication' : 'Welcome Back'}
              </h2>
              <p className="text-muted">
                {totpRequired ? 'Enter your TOTP code for full admin access, or skip to continue as a regular user' : 'Please sign in to your account'}
              </p>
            </div>
            <Form onSubmit={handleSubmit}>
              {/* Display error messages */}
              {errorMessage && (
                <Alert variant="danger" onClose={() => setErrorMessage('')} dismissible className="border-0 shadow-sm">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {errorMessage}
                </Alert>
              )}
              {!totpRequired ? (
                <>
                  {/* Username input */}
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold text-dark">Username</Form.Label>
                    <Form.Control
                      type="text"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      placeholder="Enter your username"
                      required
                      className="border-0 shadow-sm"
                      style={{ borderRadius: '10px', padding: '12px 16px', background: '#f8fafc' }}
                    />
                  </Form.Group>
                  {/* Password input */}
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold text-dark">Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      className="border-0 shadow-sm"
                      style={{ borderRadius: '10px', padding: '12px 16px', background: '#f8fafc' }}
                    />
                  </Form.Group>
                </>
              ) : (
                <>
                  {/* TOTP Code input */}
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold text-dark">TOTP Code</Form.Label>
                    <Form.Control
                      type="text"
                      value={totpCode}
                      onChange={e => setTotpCode(e.target.value)}
                      placeholder="000000"
                      required
                      className="border-0 shadow-sm text-center"
                      style={{ borderRadius: '10px', padding: '12px 16px', background: '#f8fafc', fontSize: '1.5rem', letterSpacing: '0.3rem' }}
                      maxLength={6}
                    />
                  </Form.Group>
                  <div className="alert alert-info border-0 shadow-sm mb-4" style={{ borderRadius: '10px' }}>
                    <small>
                      <i className="bi bi-info-circle-fill me-2"></i>
                      Complete 2FA for full admin privileges, or skip to continue with limited access.
                    </small>
                  </div>
                </>
              )}
              {/* Submit button */}
              <Button
                type="submit"
                className="w-100 fw-bold border-0 shadow-sm mb-3"
                size="lg"
                style={{ 
                  borderRadius: '10px',
                  background: 'linear-gradient(90deg, #1e40af 0%, #3b82f6 100%)',
                  padding: '12px'
                }}
              >
                <i className={`bi ${totpRequired ? 'bi-shield-check' : 'bi-box-arrow-in-right'} me-2`}></i>
                {totpRequired ? 'Verify' : 'Sign In'}
              </Button>
              {/* Skip TOTP button for admins */}
              {totpRequired && (
                <Button
                  variant="outline-warning"
                  onClick={() => onSkipTotp && onSkipTotp()}
                  className="w-100 fw-bold border-2"
                  size="lg"
                  style={{ 
                    borderRadius: '10px',
                    padding: '12px'
                  }}
                >
                  Skip 2FA
                </Button>
              )}
            </Form>
          </div>
        </div>
      </Col>
    </Row>
  );
}

export default LoginForm;
