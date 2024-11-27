import React, { useState } from 'react';
import axios from 'axios';
import { Input, Button, Container, Logo } from '../index';
import { Link, useNavigate } from 'react-router-dom';
import './Signup.css';
import { ToastContainer } from 'react-toastify';
import { useToast } from '../Hooks/useToast';
import { ClipLoader } from 'react-spinners';

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false); 
  const notify = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { fullName, username, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      notify('Passwords do not match', { type: 'error' });
      return;
    }

    setLoading(true); 

    try {
      const response = await axios.post('http://127.0.0.1:5000/signup', {
        fullName,
        username,
        email,
        password,
        confirmPassword
      });

      navigate('/Login', { state: { registerSuccess: true } });
    } catch (error) {
      notify('Credentials already exist', { type: 'error' });
      console.log(error);
    } finally {
      setLoading(false); 
    }
  };


  return (
    <>
      <ToastContainer style={{ top: '70px' }} />
      {loading && (
        <div className="loading-overlay">
          <ClipLoader color="#123abc" size={30} />
        </div>
      )}
      <Container className='signup-form-container'>
        <form onSubmit={handleSignup} className='signup-form'>
          <div className='logo-cont'>
            <Logo />
          </div>
          <Input className='signup-input' label='Full Name: ' type='text' placeholder='Enter your full name' name='fullName' onChange={handleChange} required /><br />
          <Input className='signup-input' label='Username: ' type='text' placeholder='Enter your username' name='username' onChange={handleChange} required /><br />
          <Input className='signup-input' label='Email: ' type='email' placeholder='Enter your email' name='email' onChange={handleChange} required /><br />
          <Input className='signup-input' label='Password: ' type='password' placeholder='Enter your password' name='password' onChange={handleChange} required /><br />
          <Input className='signup-input' label='Confirm Password: ' type='password' placeholder='Confirm your password' name='confirmPassword' onChange={handleChange} required /><br />
          <Button className='signup-submit-button' type='submit' disabled={loading} children={loading ? 'Signing Up...' : 'Sign Up'} /><br />
          Already have an account? <Link to='/Login'>Login here</Link>
        </form>
      </Container>
    </>
  );
}

export default Signup;
