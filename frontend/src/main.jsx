import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import Cart from './pages/Cart/Cart';
import Home from './pages/Home/Home';
import { Provider } from 'react-redux';
import store from './Components/Store/store'
import ResetPassword from './pages/ResetPassword/ResetPassword';
import NewPass from './pages/NewPass/NewPass';
import ProductPage from './pages/ProductPage/ProductPage';
import Profile from './pages/Profile/Profile';
import TestPage from './pages/TestPage';
import MyOrders from './pages/MyOrders/MyOrders';
import AboutUs from './pages/About/AboutUs';
import ContactUs from './pages/Contact/ContactUs';


const router = createBrowserRouter([
  {
    path:'/',
    element: <App/>,
    children:[
      {
        index: true,
        element: <Home />,
      },      
      {
        path: 'cart',
        element:<Cart/>
      },
      {
        path: 'resetpass',
        element:<ResetPassword/>
      },
      {
        path: 'newpass/:token',
        element:<NewPass/>
      },
      {
        path:'/products/:id',
        element: <ProductPage/>
      },
      {
        path:'/about-us',
        element: <AboutUs/>
      },
      {
        path:'/contact-us',
        element: <ContactUs/>
      },
    ]
  },
  {
    path:'login',
    element: <Login/>
  },
  {
    path: 'signup',
    element:<Signup/>
  },
  {
    path:'/test',
    element: <TestPage/>
  },
  {
    path:'/orders',
    element: <MyOrders/>
  },
  {
    path:'/profile',
    element: <Profile/>
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}/>
    </Provider>
  </React.StrictMode>,
);