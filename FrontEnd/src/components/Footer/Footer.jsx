import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'

const Fotter = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
             <img className='img' src={assets.logo} alt="" />
             <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Non, nihil.</p>
              <div className="footer-social-icons">
                <img src={assets.facebook_icon} alt="" />
                <img src={assets.twitter_icon} alt="" />
                <img src={assets.linkedin_icon} alt="" />
              </div>
        </div>

         <div className="footer-content-center">
          <h2>COMPANY</h2>
          <ul>
            <li>Home</li>
            <li>About Us</li>
            <li>Delivery</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        <div className="footer-content-right">
           <h2>GET IN TOUCH</h2>
           <ul>
            <li>+91-1234-5678-90</li>
            <li>contact@eatery.com</li>
           </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">Copyright 2025 © Eastery.com - All Right Reserved. </p>
    </div>
  )
}

export default Fotter;
