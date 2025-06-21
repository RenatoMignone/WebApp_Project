import { useState } from 'react';
import { Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function LoginForm({ onLogin, totpRequired, onTotp, onSkipTotp }) {

  // state for the username
  const [username, setUsername] = useState('');
  // state for the password
  const [password, setPassword] = useState('');
  // state for the TOTP code
  const [totpCode, setTotpCode] = useState('');
  // state for error messages
  const [errorMessage, setErrorMessage] = useState('');
  // state for loading state during submission
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  // ###########################################################################
  // HANDLERS
  // ###########################################################################

  // Handle form submission for login or TOTP verification
  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage(''); // Clear any previous errors
    setIsLoading(true);
    
    try {
      if (totpRequired) {
        await onTotp(totpCode);
      } else {
        await onLogin({ username, password });
      }
    } catch (error) {
      // Set appropriate error message based on the type of login
      if (totpRequired) {
        setErrorMessage('Invalid TOTP code. Please try again.');
      } else {
        setErrorMessage('Invalid username or password. Please check your credentials and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  //-----------------------------------------------------------------------------
  // Clear error message when user starts typing
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    if (errorMessage) setErrorMessage('');
  };

  //-----------------------------------------------------------------------------
  // Handle password change
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (errorMessage) setErrorMessage('');
  };

  //-----------------------------------------------------------------------------
  // Handle TOTP code change
  const handleTotpChange = (e) => {
    setTotpCode(e.target.value);
    if (errorMessage) setErrorMessage('');
  };

  //-----------------------------------------------------------------------------
  // Render the login form
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
                      onChange={handleUsernameChange}
                      placeholder="Enter your username"
                      required
                      disabled={isLoading}
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
                      onChange={handlePasswordChange}
                      placeholder="Enter your password"
                      required
                      disabled={isLoading}
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
                      onChange={handleTotpChange}
                      placeholder="000000"
                      required
                      disabled={isLoading}
                      className="border-0 shadow-sm text-center"
                      style={{ borderRadius: '10px', padding: '12px 16px', background: '#f8fafc', fontSize: '1.5rem', letterSpacing: '0.3rem' }}
                      maxLength={6}
                    />
                  </Form.Group>
                  <div className="alert alert-info border-0 shadow-sm mb-4" style={{ borderRadius: '10px' }}>
                    <small>
                      Complete 2FA for full admin privileges, or skip to continue with limited access.
                    </small>
                  </div>
                </>
              )}
              {/* Submit button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-100 fw-bold border-0 shadow-sm mb-3"
                size="lg"
                style={{ 
                  borderRadius: '10px',
                  background: 'linear-gradient(90deg, #1e40af 0%, #3b82f6 100%)',
                  padding: '12px'
                }}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    {totpRequired ? 'Verifying...' : 'Signing In...'}
                  </>
                ) : (
                  <>
                    {totpRequired ? 'Verify' : 'Sign In'}
                  </>
                )}
              </Button>
              
              {/* Skip TOTP button for admins */}
              {totpRequired && (
                <Button
                  variant="outline-warning"
                  onClick={() => onSkipTotp && onSkipTotp()}
                  disabled={isLoading}
                  className="w-100 fw-bold border-2 mb-3"
                  size="lg"
                  style={{ 
                    borderRadius: '10px',
                    padding: '12px'
                  }}
                >
                  Skip 2FA
                </Button>
              )}
              
              {/* Cancel button to go back to main page */}
              <Button
                variant="outline-secondary"
                onClick={() => navigate('/')}
                disabled={isLoading}
                className="w-100 fw-bold border-2"
                size="lg"
                style={{ 
                  borderRadius: '10px',
                  padding: '12px'
                }}
              >
                <i className="bi bi-arrow-left me-2"></i>
                Back to Forum
              </Button>
            </Form>
          </div>
        </div>
      </Col>
    </Row>
  );
}

//-----------------------------------------------------------------------------
export default LoginForm;
