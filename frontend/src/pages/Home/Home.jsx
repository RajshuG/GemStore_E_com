import React, { useEffect, useState } from 'react';
import ProductDisplay from '../../Components/ProductDisplay/ProductDisplay';
import { Container } from '../../Components/index';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { useToast } from '../../Components/Hooks/useToast.js';
import ProductSlider from '../../Components/ProductSlider/ProductSlider.jsx';
import 'react-toastify/dist/ReactToastify.css';
import './Home.css';
import { addItem } from '../../Components/Store/cartSlice.js';
import { ClipLoader } from 'react-spinners';

const images = import.meta.glob('../../assets/Flyers/*.{png,jpg,jpeg,svg}');

async function loadImages() {
  const imageUrls = [];
  for (const path in images) {
    const module = await images[path]();
    imageUrls.push(module.default);
  }
  return imageUrls;
}

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [sliderImages, setSliderImages] = useState([])
  const isAuth = useSelector((state) => state.auth.isAuthenticated);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const notify = useToast();
  const location = useLocation();
  const [loginSuccess, setLoginSuccess] = useState(location.state?.loginSuccess || false);
  const productImages = products.map(product => product.image);
  const dispatch = useDispatch();

  useEffect(() => {
    if (loginSuccess) {
      notify('Login Successful', { type: 'success' });
      setLoginSuccess(false);
    }
  }, [loginSuccess]);
  
  useEffect(()=>{
    loadImages().then(images => setSliderImages(images));
  },[])

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true); 
      try {
        const response = await axios.get('http://localhost:5000/all');
        setProducts(response.data);
      } catch (error) {
        console.log('Error in fetching data', error);
      } finally {
        setLoading(false); 
      }
    };

    fetchProducts();
  }, []);

  const handleCart = async (productId) => {
    if (isAuth) {
      setLoading(true);
      try {
        const response = await axios.post('http://localhost:5000/cart/add', { product_id: productId, quantity: 1 }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        notify('Successfully added to Cart', { type: 'success' });
        const updatedQuantity = response.data.quantity;
        dispatch(addItem({ id: productId, quantity: updatedQuantity }));
      } catch (error) {
        console.log('Error adding to cart:', error);
        notify('Failed to add to cart', { type: 'error' });
      } finally {
        setLoading(false); 
      }
    } else {
      navigate('/Login', { state: { loginFirst: true } });
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
      {productImages.length > 0 && <ProductSlider images={sliderImages} />}
      <Container className='home-container'>
        <div className='heading-products'>Our Products</div>
        <ul className='product-list' style={{ listStyleType: 'none', margin: 0 }}>
          {products.map((product) => (
            <li key={product.title} className='product-item'>
              <ProductDisplay
                title={product.title}
                content={product.content}
                price={product.price}
                handleSubmit={() => handleCart(product.id)} 
                buttonText='Add to Cart' 
                imageSrc={product.image}
                linkroute={`products/${product.id}`}
              />
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}

export default Home;
