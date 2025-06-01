import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

function LoginForm({ onLogin, totpRequired, onTotp }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [totp, setTotp] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if (!username) setError('Username cannot be empty');
    else if (!password) setError('Password cannot be empty');
    else {
      setError('');
      onLogin({ username, password });
    }
  };

  const handleTotpSubmit = e => {
    e.preventDefault();
    if (!totp) setError('TOTP code required');
    else {
      setError('');
      onTotp(totp);
    }
  };

  return (
    <Form onSubmit={totpRequired ? handleTotpSubmit : handleSubmit} className="p-4 rounded" style={{ background: '#e3f0ff' }}>
      <h2 className="pb-3 text-center text-primary">Login</h2>
      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
      {!totpRequired ? (
        <>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              value={username}
              placeholder="Enter your username"
              onChange={e => setUsername(e.target.value)}
              required
              autoFocus
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              placeholder="Enter your password"
              onChange={e => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Button className="w-100" variant="primary" type="submit">Login</Button>
        </>
      ) : (
        <>
          <Form.Group className="mb-3">
            <Form.Label>TOTP Code</Form.Label>
            <Form.Control
              type="text"
              value={totp}
              placeholder="Enter your TOTP code"
              onChange={e => setTotp(e.target.value)}
              required
              autoFocus
            />
          </Form.Group>
          <Button className="w-100" variant="primary" type="submit">Verify</Button>
        </>
      )}
    </Form>
  );
}

export default LoginForm;
