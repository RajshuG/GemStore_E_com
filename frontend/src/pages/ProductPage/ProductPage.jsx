import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './ProductPage.css'; 
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { useToast } from '../../Components/Hooks/useToast';
import { ToastContainer } from 'react-toastify';

const ProductPage = () => {
  const token = localStorage.getItem('token')
  const [product, setProduct] = useState(null);
  const { id } = useParams();
  const isAuth = useSelector((state)=>state.auth.isAuthenticated)
  const navigate = useNavigate()
  const notify = useToast()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/products/${id}`);
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleCart = async (productId) => {
    if (isAuth){
        console.log('function called')
        const response = await axios.post('http://localhost:5000/cart/add',{product_id:productId, quantity:1},{headers:{
            Authorization: `Bearer ${token}`
        }})
        notify('Succesfully added in Cart', {type:'success'})
        console.log(response.message)

        
    }else{
        navigate('/Login', {state:{loginFirst:true}})
    }
}


  return (
    <div className="product-page" style={{margin: '30px'}}>
      {product && (
        <>
            <ToastContainer style={{top:'70px'}}/>
          <div className="product-image">
            <img src={product.image} alt={product.title} />
          </div>
          <div className="product-details">
            <h1>{product.title}</h1>
            <p>{product.content}</p>
            <p className="price">Price: ₹{product.price}</p>
            <button onClick={()=>handleCart(product.id)} className='add-to-cart-button'>Add to cart</button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductPage;
