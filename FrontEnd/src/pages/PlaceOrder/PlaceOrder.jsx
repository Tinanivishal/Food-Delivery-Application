import React, { useContext, useState } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../context/StoreContext';

const PlaceOrder = () => {
  const { getTotalCartAmount, cartItems, food_list } = useContext(StoreContext);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const displayRazorpay = async () => {
    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      return;
    }

    // Create order directly on client side (not recommended for production)
    const amount = (getTotalCartAmount() + 10) * 100; // Convert to paise
    
    const options = {
      key: 'rzp_test_GkFixE8uocZOFN', // Your test API key
      amount: amount.toString(),
      currency: 'INR',
      name: 'Your Restaurant Name',
      description: 'Food Order Payment',
      image: 'https://example.com/your-restaurant-logo.png',
      handler: function (response) {
        // This will be called after successful payment
        alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
        
        // Here you would typically send this data to your backend for verification
        // But since you don't have a backend, we'll just show a success message
        console.log({
          paymentId: response.razorpay_payment_id,
          orderInfo: {
            ...formData,
            items: cartItems.map(item => ({
              foodId: item.id,
              quantity: item.quantity,
              price: food_list.find(food => food._id === item.id).price
            })),
            amount: getTotalCartAmount() + 10,
          }
        });
      },
      prefill: {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        contact: formData.phone
      },
      notes: {
        address: `${formData.street}, ${formData.city}, ${formData.state} - ${formData.zipCode}, ${formData.country}`
      },
      theme: {
        color: '#3399cc'
      }
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    
    paymentObject.on('payment.failed', function (response) {
      alert(`Payment failed! Error: ${response.error.description}`);
      console.log(response.error);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (getTotalCartAmount() === 0) {
      alert('Your cart is empty');
      return;
    }
    
    if (!formData.firstName || !formData.email || !formData.phone) {
      alert('Please fill in all required fields');
      return;
    }
    
    displayRazorpay();
  };

  return (
    <form className='place-order' onSubmit={handleSubmit}>
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input 
            type="text" 
            placeholder='First Name' 
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <input 
            type="text" 
            placeholder='Last Name' 
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>
        <input 
          type="email" 
          placeholder='Email address' 
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input 
          type="text" 
          placeholder='Street' 
          name="street"
          value={formData.street}
          onChange={handleChange}
          required
        />
        <div className="multi-fields">
          <input 
            type="text" 
            placeholder='City' 
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          />
          <input 
            type="text" 
            placeholder='State' 
            name="state"
            value={formData.state}
            onChange={handleChange}
            required
          />
        </div>
        <div className="multi-fields">
          <input 
            type="text" 
            placeholder='Zip code' 
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
          />
          <input 
            type="text" 
            placeholder='Country' 
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
          />
        </div>
        <input 
          type="tel" 
          placeholder='Phone' 
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₹{getTotalCartAmount() === 0 ? 0 : 10}</p>    
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>₹{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 10}</b>
            </div>
          </div>
          <button type="submit">PROCEED TO PAYMENT</button>
        </div> 
      </div>
    </form>
  );
};

export default PlaceOrder;