// -----------------------------------------------------------------------------
// App Component
// -----------------------------------------------------------------------------
// This file defines the main App component, which serves as the root of the
// application. It manages the state of the application, handles authentication,
// and defines routes for navigation.
// -----------------------------------------------------------------------------

import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import API from './API';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { ForumLayout, LoginLayout, NotFoundLayout } from './components/Layout';

//----------------------------------------------------------------------------
// --- Main App ---
function App() {

  //----------------------------------------------------------------------------
  // State management using React hooks

  // User information
  const [user, setUser] = useState(null);
  // If TOTP is required for the user
  const [totpRequired, setTotpRequired] = useState(false);
  // Pending admin user data (for TOTP verification)
  const [pendingAdminUser, setPendingAdminUser] = useState(null);
  // Global message to display to the user (e.g., success or error messages)
  const [message, setMessage] = useState('');
  // Type of message to display (success, warning, danger)
  const [messageType, setMessageType] = useState('danger');

  const navigate = useNavigate();

  // Check session on mount
  useEffect(() => {
    API.getUserInfo()
      .then(u => setUser(u))
      .catch(() => setUser(null));
  }, []);

  //############################################################################
  // --- Authentication handlers ---
  async function handleLogin(credentials) {
    try {
      const res = await API.logIn(credentials);
      if (res.canDoTotp) {
        setTotpRequired(true);
        setPendingAdminUser(res);
        setUser(null);
      } else {
        setUser({ ...res, isTotp: true });
        setTotpRequired(false);
        setPendingAdminUser(null);
        navigate('/');
      }
      setMessage('');
    } catch (err) {
      setUser(null);
      setTotpRequired(false);
      setPendingAdminUser(null);
      setMessage('');
      throw new Error(err.error || 'Login failed. Please check your credentials.');
    }
  }

  //-----------------------------------------------------------------------------
  // Handle TOTP verification
  async function handleTotp(code) {
    try {
      await API.logInTotp(code);
      const u = await API.getUserInfo();
      setUser(u);
      setTotpRequired(false);
      setPendingAdminUser(null);
      setMessage('');
      navigate('/');
    } catch (err) {
      throw new Error(err.error || 'Invalid TOTP code. Please try again.');
    }
  }

  //-----------------------------------------------------------------------------
  // Handle skipping TOTP for pending admin user
  async function handleSkipTotp() {
    if (pendingAdminUser) {
      setUser({ 
        ...pendingAdminUser, 
        is_admin: false,
        limited_access: true,
        original_admin: true
      });
      setTotpRequired(false);
      setPendingAdminUser(null);
      setMessage('Logged in with limited access. Complete 2FA for full admin privileges.');
      setMessageType('warning');
      setTimeout(() => setMessage(''), 2000);
      navigate('/');
    }
  }

  //-----------------------------------------------------------------------------
  // Handle user logout
  async function handleLogout() {
    await API.logOut();
    setUser(null);
    setTotpRequired(false);
    setPendingAdminUser(null);
    setMessage('');
    navigate('/login');
  }

  //-----------------------------------------------------------------------------
  // Global message handler
  const showMessage = (msg, type = 'danger') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 2000);
  };

  //############################################################################
  // --- Routing ---
  return (
    <div className="px-3 py-4" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #1e40af 100%)' }}>
      <Routes>
        <Route path="/" element={
            <ForumLayout user={user} message={message} messageType={messageType} onLogout={handleLogout} showMessage={showMessage}/>}>
          
          {/* Nested routes for posts and comments */}
          <Route index element={
              <div>
                {/* Main forum view - shows post list and details */}
              </div>}
          />
          {/* Route for creating a new post */}
          <Route path="post/:postId" element={
              <div>
                {/* Individual post view */}
              </div>} 
          />
          {/*Route for the Login*/}
          <Route path="/login"element={
              !user ? (
                <LoginLayout onLogin={handleLogin} totpRequired={totpRequired} onTotp={handleTotp} onSkipTotp={handleSkipTotp}/>
              ) : (
                <Navigate replace to='/' />
              )
          }/>

          <Route path="*" element={<NotFoundLayout />}/>
        </Route>
      </Routes>
    </div>
  );
}

//----------------------------------------------------------------------------
export default App;
