import React, { useEffect, useState } from 'react';
import { Header, Input, Button, Footer } from '../../Components';
import axios from 'axios';
import './Profile.css';
import { ToastContainer} from 'react-toastify';
import { useToast } from '../../Components/Hooks/useToast.js';
import { ClipLoader } from 'react-spinners';

function Profile() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const token = localStorage.getItem('token');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const notify = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const { id, name, email, username } = response.data;
        setData({ id, name, username, email });
        setName(name);
        setUsername(username);
        setEmail(email);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put('http://127.0.0.1:5000/update_profile', { name, username, email }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const newToken = response.data.token;
      if (newToken) {
        localStorage.setItem('token', newToken);
        console.log('Token updated');
        notify(response.data.message, {type:'success'})
      }

      
    } catch (error) {
      if (error.response && error.response.data) {
        notify(error.response.data.error, {type:'error'})
        console.log(error)
        notify(error, {type:'error'})
      } else {
        notify('Error in updating profile', {type:'error'})
      }
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
      <ToastContainer style={{top:'70px'}}/>
      <div className="profile-container">
        {data ? (
          <form className="profile-form" onSubmit={handleSubmit}>
            <h2>Update Profile</h2>
            <Input
              label='Full Name: '
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label='Username: '
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              label='Email: '
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button type='submit' children='Update' />
          </form>
        ) : (
          <h1>Access not granted</h1>
        )}
      </div>
      <Footer/>
    </>
  );
}

export default Profile;
