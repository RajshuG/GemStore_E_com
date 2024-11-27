import React, { useState, useEffect } from 'react';
import { Container } from '../../Components/index';
import ProductDisplay from '../../Components/ProductDisplay/ProductDisplay';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import Button from 'react-bootstrap/esm/Button';
import { useToast } from '../../Components/Hooks/useToast';
import { ToastContainer } from 'react-toastify';
import { setCartItems, removeItem, addItem } from '../../Components/Store/cartSlice';
import { ClipLoader } from 'react-spinners';
import './Cart.css';

function Cart() {
    const cartItems = useSelector((state) => state.cart.items);
    const isAuth = useSelector((state) => state.auth.isAuthenticated);
    const dispatch = useDispatch();
    const notify = useToast();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
    
        if (token) {
            setLoading(true); 
            axios.get('http://localhost:5000/cart', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(response => {
                const items = Array.isArray(response.data.cart_items) ? response.data.cart_items : [];
                dispatch(setCartItems(items));
            })
            .catch(error => {
                console.log('Error in fetching data', error);
            })
            .finally(() => setLoading(false)); 
        } else {
            console.log('No token found, user might not be logged in');
        }
    }, [isAuth, dispatch]);

    const handleClick = (productId) => {
        const token = localStorage.getItem('token');
    
        if (token) {
            setLoading(true); 
            axios.delete(`http://localhost:5000/cart/remove/${productId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(() => {
                dispatch(removeItem({ id: productId })); 
            })
            .catch(error => {
                console.log('Error in removing item:', error);
            })
            .finally(() => setLoading(false)); 
        } else {
            console.log('No token found');
        }
    };

    const handleIncreaseQuantity = (productId) => {
        const token = localStorage.getItem('token');

        if (token) {
            setLoading(true); 
            axios.put(`http://localhost:5000/cart/increase/${productId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(response => {
                const updatedQuantity = response.data.quantity;
                dispatch(addItem({ id: productId, quantity: updatedQuantity }));
            })
            .catch(error => {
                console.log('Error increasing quantity: ', error);
            })
            .finally(() => setLoading(false)); 
        }
    };

    const handleOrder = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            setLoading(true); 
            try {
                await axios.post(`http://localhost:5000/cart/order`, {}, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                dispatch(setCartItems([])); 
                notify('Order Placed', { type: 'success' });
            } catch (error) {
                console.log('Error in placing order:', error);
            } finally {
                setLoading(false); 
            }
        } else {
            console.log('Error in token');
        }
    };

    if (!isAuth) {
        return <h1 style={{ margin: '60px' }}>Access not granted</h1>;
    }

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const taxes = subtotal * 0.1;
    const shipping = subtotal > 0 ? 0 : 0;
    const total = subtotal + taxes + shipping;
    
    return (
        <>
            <style>
                {`
                    .no-box-shadow {
                        box-shadow: none !important;
                    }
                `}
            </style>
            <ToastContainer style={{ top: '70px' }} />
            {loading && (
                <div className="loading-overlay">
                <ClipLoader color="#123abc" size={30} />
            </div>
            )}
            <Container className="cart-container">
                {cartItems.length === 0 ? (
                    <h2 className="cart-empty">Cart is empty</h2>
                ) : (
                    <div className="cart-page">
                        <ul className="cart-list" style={{ listStyleType: 'none' }}>
                            {cartItems.map((cart, index) => (
                                <li key={cart.id || index} className="cart-item">
                                    <div className="cart-item-info">
                                        <img src={cart.image} alt={cart.title} className="cart-item-image" />
                                        <ProductDisplay
                                            title={cart.title}
                                            price={cart.price}
                                            quantity={cart.quantity}
                                            classname="no-box-shadow"
                                        />
                                        <div className="cart-item-quantity">
                                            <Button className="quantity-button" onClick={() => handleClick(cart.product_id)}>-</Button>
                                            <span> {cart.quantity} </span>
                                            <Button className="quantity-button" onClick={() => handleIncreaseQuantity(cart.product_id)}>+</Button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="cart-summary">
                            <h3>Summary</h3>
                            <div className="summary-item">
                                <span>Subtotal</span>
                                <span>₹{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="summary-item">
                                <span>Taxes</span>
                                <span>₹{taxes.toFixed(2)}</span>
                            </div>
                            <div className="summary-item">
                                <span>Shipping</span>
                                <span>₹{shipping.toFixed(2)}</span>
                            </div>
                            <div className="summary-item total">
                                <span>Total</span>
                                <span>₹{total.toFixed(2)}</span>
                            </div>
                            <Button className="checkout-button" onClick={handleOrder}>Checkout</Button>
                        </div>
                    </div>
                )}
            </Container>
        </>
    );
}

export default Cart;
