import React from 'react'
import { Footer, Login as LoginComponent } from '../../Components/index'
import { ToastContainer } from 'react-toastify'

function Login() {
  return (
    <>
    <ToastContainer style={{top:'70px'}}/>
    <LoginComponent/>
    <Footer/>
    </>
  )
}

export default Login