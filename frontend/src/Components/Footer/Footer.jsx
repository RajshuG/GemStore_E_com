import React from 'react'
import { Link } from 'react-router-dom'
import '../Footer/Footer.css'
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react'

function Footer() {
  return (
    <footer className='footer'>
      <div className='footer-container'>
        <div className='footer-section'>
          <h4>About Us</h4>
          <p>We provide high-quality products at affordable prices. Your satisfaction is our priority. </p>
        </div>
        <div className='footer-section'>
          <h4>Quick Links</h4>
          <ul>
            <li><Link to='/'>Home</Link></li>
            <li><Link to='/about-us'>About</Link></li>
            <li><Link to='/contact-us'>Contact</Link></li>
          </ul>
        </div>
        <div className='footer-section'>
          <h4>Follow Us</h4>
          <div className='social-icons'>
            <ul>
              <li><a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"><Facebook size={15} color="#333333" /> Facebook</a></li>
              <li><a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer"><Twitter size={15} color="#333333" /> Twitter</a></li>
              <li><a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"><Instagram size={15} color="#333333" /> Instagram</a></li>
              <li><a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer"><Linkedin size={15} color="#333333" /> LinkedIn</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer