import React, { useState } from 'react'
import { Button, Container, Input } from '../../Components'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import './NewPass.css'
import { ToastContainer } from 'react-toastify'
import { useToast } from '../../Components/Hooks/useToast'

function NewPass() {
    const {token} = useParams()
    const [password, setPassword] = useState('')
    const navigate = useNavigate()
    const notify = useToast()

    const handleSubmit = async(e)=>{
        e.preventDefault()
        try{
          const response = await axios.post(`http://127.0.0.1:5000/reset_pass/${token}`, {password},{
            headers:{
                'Content-Type':'application/json'
            }
          })
          if(response.data.message){
            navigate('/Login', {state:{resetSuccess:true}})
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
    <Container className='new-password-container '>
      <div className='new-password-form'>
      <Input className='new-password-input' label="Enter new password: " type='password' value={password} onChange={(e)=>setPassword(e.target.value)}/><br/>
      <Button className='new-password-button' children="Change Password" onClick={handleSubmit} />
      </div>
    </Container>
    </>
  )
}

export default NewPass