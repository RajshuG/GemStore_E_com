import React, { useEffect, useState } from 'react';
import { Button, Container, Input } from "../index";
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginAuth } from '../Store/authSlice';
import { Link } from 'react-router-dom';
import './Login.css'; 
import { useToast } from '../Hooks/useToast';
import Header from '../Header/Header';
import Logo from '../Logo/Logo';
import { ClipLoader } from 'react-spinners';
import { ToastContainer } from 'react-toastify';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const notify = useToast();
  const [registerSuccess, setRegisterSuccess] = useState(location.state?.registerSuccess || false);
  const [loginFirst, setLoginFirst] = useState(location.state?.loginFirst || false);
  const [resetSuccess, setResetSuccess] = useState(location.state?.resetSuccess || false);

  useEffect(() => {
    if (registerSuccess) {
      notify('Registration Successful', { type: 'success' });
      setRegisterSuccess(false);
    }
    if (loginFirst) {
      notify('Please Login!', { type: 'error' });
      setLoginFirst(false);
    }
    if (resetSuccess) {
      notify('Password reset successful', { type: 'success' });
    }
  }, [registerSuccess, loginFirst, resetSuccess]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/login', { username, password });
      const token = response.data.access_token;
      dispatch(loginAuth({ user: { username }, token }));
      localStorage.setItem('token', token);
      localStorage.setItem('user', username);
      navigate('/', { state: { loginSuccess: true } });
    } catch (error) {
      if (error && error.response.data) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred, Please try again.');
      }
      console.log('Login failed: ', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
        <>
            <ToastContainer style={{ top: '70px' }} />
            <div className="loading-spinner">
                <ClipLoader color="#123abc" size={30} /> 
            </div>
        </>
    );
}
  return (
    <>
      <Header />
      <div className="login-container">
        <form className="login-form" onSubmit={handleLogin}><br />
          <div className='logo-cont'>
            <Logo />
          </div>
          {error && <p className="login-error">{error}</p>}
          <Input className="login-input" label='Username: ' placeholder='Enter your username' name='name' onChange={(e) => setUsername(e.target.value)} /><br />
          <Input className="login-input" label='Password: ' placeholder='Enter your password' type='password' name='password' onChange={(e) => setPassword(e.target.value)} /><br />
          <Button className="login-button" id="login-button" type="submit" children={loading ? 'Logging in...' : 'Log In'} disabled={loading} /><br /><br />
          <Link className="login-link" to='/resetpass'>Forgot password</Link>
          <Link className="login-link" to='/Signup'>Create new account</Link>
        </form>
      </div>
    </>
  );
}

export default Login;
