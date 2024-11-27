import React, { useState } from 'react'
import { Button, Container, Input } from '../../Components'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import './ResetPassword.css'
import { useToast } from '../../Components/Hooks/useToast'
import { ToastContainer } from 'react-toastify'

function ResetPassword() {
  const {token} = useParams()
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const notify = useToast()

  const handleSubmit = async(e)=>{
    e.preventDefault()
    try{
      const response = await axios.post('http://127.0.0.1:5000/resetRequest', {email},{
        headers:{
          'Content-Type':'application/json'
        }
      })
      if(response.data.message){
        notify(response.data.message, {type:'success'})
      }else{
        notify(response.data.error, {type:'error'})
      }
    }catch(error){
      console.log(error)
      notify("Error resetting password", {type:'error'})
    }
  }

  return (
    <>
    <ToastContainer style={{top:'70px'}}/>
    <Container className='reset-password-container'>
    <form onSubmit={handleSubmit} className='reset-password-form'>
        <Input label='Enter your registered Email: ' type='email' value={email} onChange ={(e)=>setEmail(e.target.value)} className='reset-password-input'/><br/>
        <Button className='reset-password-button'>Send Reset Link</Button>
    </form>
    </Container>
    </>
  )
}

export default ResetPassword