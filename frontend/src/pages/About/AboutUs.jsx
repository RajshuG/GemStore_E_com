import React from 'react';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-us-container">
      <section className="about-header">
        <h1>About Us</h1>
        <p>We provide high-quality products at affordable prices. Your satisfaction is our priority.</p>
      </section>

      <section className="about-content">
        <div className="mission">
          <h2>Our Mission</h2>
          <p>
            To provide high-quality products and exceptional customer service, ensuring every
            customer finds the perfect product suited to their needs.
          </p>
        </div>

        <div className="values">
          <h2>Our Values</h2>
          <ul>
            <li>Quality - We prioritize excellence in every product.</li>
            <li>Integrity - Honest pricing and genuine products.</li>
            <li>Customer Satisfaction - Ensuring a seamless shopping experience.</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
