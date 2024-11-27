import React from 'react';
import './ContactUs.css';

const ContactUs = () => {
  return (
    <div className="contact-us-container">
      <h1>Contact Us</h1>
      <p>If you have any questions, please feel free to reach out to us.</p>

      <div className="contact-details">
        <div className="contact-item">
          <h2>Email Us</h2>
          <p>rajshugem@gmail.com</p>
        </div>

        <div className="contact-item">
          <h2>Call Us</h2>
          <p>(+91) 999994444</p>
        </div>

        <div className="contact-item">
          <h2>Visit Us</h2>
          <p>124, GemStore, Gem Street, Ecommerce city, 110011</p>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
