import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Logo, Searchbar } from '../index';
import { useDispatch, useSelector } from 'react-redux';
import { logoutAuth } from '../Store/authSlice';
import './Header.css';
import { House, ShoppingCart, LogOut, UserRoundPen, LogIn, CircleUser, Package, Menu, X } from 'lucide-react';
import { useEffect } from 'react';
import { loginAuth } from '../Store/authSlice';

function Header({ toggleSidebar, sidebarOpen }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isAuth = useSelector((state) => state.auth.isAuthenticated);
    const cartCount = useSelector((state) => state.cart.count);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        if (token && user) {
            dispatch(loginAuth({ user: { username: user }, token }));
        }
    }, [dispatch]);

    const handleLogout = () => {
        dispatch(logoutAuth());
        localStorage.removeItem('token');
        navigate('/');
    };

    const navLogin = [
        {
            name: '',
            slug: '/profile',
            icon: <CircleUser size={32} />,
        },
        {
            name: 'Orders & Returns',
            slug: '/orders',
            icon: '',
        },
        {
            name: '',
            slug: '/cart',
            icon: (
                <div style={{ position: 'relative' }}>
                    <ShoppingCart />
                    <span className="cart-counter">{cartCount}</span>
                </div>
            ),
        },
        {
            name: '',
            slug: '/logout',
            icon: <LogOut />,
        },
    ];

    const navLogout = [
        {
            name: 'Login',
            slug: '/login',
            icon: <LogIn />,
        },
        {
            name: 'Register',
            slug: '/signup',
            icon: <UserRoundPen />,
        },
        {
            name: 'Contact',
            slug: '/contact-us',
            icon: '',
        },
    ];

    const navItems = isAuth ? navLogin : navLogout;

    return (
        <header>
            <Container className='header_bar'>
                <div className='start_part'>
                    <button onClick={toggleSidebar} className='sidebar-toggle'>
                        <div className={`icon-container ${sidebarOpen ? 'hidden' : ''}`}>
                            <Menu color="#333333" />
                        </div>
                        <div className={`icon-container ${sidebarOpen ? '' : 'hidden'}`}>
                            <X color="#333333" />
                        </div>
                    </button>
                    <Link to='/' style={{ textDecoration: 'none' }}>
                        <div className='logo'>
                            <Logo />
                        </div>
                    </Link>
                </div>
                <div className='middle_part'>
                    <Searchbar />
                </div>
                <div className='end_part'>
                    <ul style={{ listStyleType: 'none' }}>
                        {navItems.map((item) => (
                            <li key={item.slug}>
                                {item.slug === '/logout' ? (
                                    <button onClick={handleLogout}>
                                        {item.icon} {item.name}
                                    </button>
                                ) : (
                                    <button onClick={() => navigate(item.slug)}>
                                        {item.icon} {item.name}
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </Container>
        </header>
    );
}

export default Header;
