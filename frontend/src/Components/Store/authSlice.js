import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    user: null,
    isAuthenticated: false ,
    token: localStorage.getItem('token') || null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers:{
        loginAuth:(state,action)=>{
            state.user = action.payload.user,
            state.isAuthenticated  = true
            state.token = action.payload.token
        },
        logoutAuth:(state)=>{
            state.user = null,
            state.isAuthenticated=false,
            state.token=null
            localStorage.removeItem('token')
        }
    }
})

export const { loginAuth, logoutAuth} = authSlice.actions
export default authSlice.reducer