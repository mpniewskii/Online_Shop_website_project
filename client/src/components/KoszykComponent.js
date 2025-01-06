import React, { useReducer, useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, increaseQuantity, decreaseQuantity } from '../actions/cartActions';
import './KoszykCss.css';
import { useNavigate } from 'react-router-dom';
import { OrderContext } from '../contexts/OrderContext'; 

const initialState = {
  shippingType: 'cheap',
  shippingCosts: {
    cheap: 10,
    normal: 15,
    express: 30,
  },
};

function reducer(state, action) {
  switch (action.type) {
    case 'setShippingType':
      return { ...state, shippingType: action.payload };
    default:
      throw new Error();
  }
}

function Cart({ setIsCartVisible }) { 
  const [state, dispatch] = useReducer(reducer, initialState);
  const reduxDispatch = useDispatch();
  const cartItems = useSelector(state => state.cart?.products || []);
  const navigate = useNavigate(); 
  const { order, setOrder } = useContext(OrderContext);

  useEffect(() => {
    console.log('Cart items updated:', cartItems);
  }, [cartItems]);

  const handleRemoveFromCart = (productId) => {
    reduxDispatch(removeFromCart(productId));
  };

  const handleIncreaseQuantity = (item) => {
    const newQuantity = Number(item.quantity) + 1;
    if (newQuantity <= item.stock) {
      reduxDispatch(increaseQuantity(item.id, newQuantity));
    } else {
      console.log('Cannot increase quantity beyond stock');
      console.log('Stock:', item.stock)
    }
  };

  const handleDecreaseQuantity = (item) => {
    const newQuantity = Number(item.quantity) - 1;
    if (newQuantity >= 1) {
      reduxDispatch(decreaseQuantity(item.id, newQuantity));
    } else {
      console.log('Cannot decrease quantity below 1');
    }
  };

  const handleShippingTypeChange = (event) => {
    dispatch({ type: 'setShippingType', payload: event.target.value });
  };

  const goToOrderForm = () => {
    setOrder(prevOrder => ({
      ...prevOrder,
      cartItems: cartItems,
      deliveryCost: state.shippingCosts[state.shippingType],
    }));

    navigate('/order-form');
    setIsCartVisible(false); 
  };

  const handleCloseCart = () => {
    setIsCartVisible(false);
  };

  const totalCost = cartItems.reduce((total, item) => total + item.priceWithoutDelivery * item.quantity, 0);
  const deliveryCost = state.shippingCosts[state.shippingType];
  const finalCost = totalCost + deliveryCost;

  return (
    <div className="cart-popup">
      <button onClick={handleCloseCart}>X</button> 
      {cartItems.map((item, index) => (
        <div key={item.id}>
          <p>Product Name: {item.title}</p>
          <p>Quantity: {item.quantity}</p>
          <p>Price: {item.priceWithoutDelivery}</p>
          <button onClick={() => handleRemoveFromCart(item.id)}>Remove from cart</button>
          <button onClick={() => handleIncreaseQuantity(item)}>Increase quantity</button>
          <button onClick={() => handleDecreaseQuantity(item)}>Decrease quantity</button>
        </div>
      ))}
      <form>
        <label>
          Shipping type:
          <select value={state.shippingType} onChange={handleShippingTypeChange}>
            <option value="cheap">Tania - 10</option>
            <option value="normal">Normalna - 15</option>
            <option value="express">Ekspresowa - 30</option>
          </select>
        </label>
      </form>
      <p>Total cost: {finalCost}</p>
      <button onClick={goToOrderForm}>Przejdź do formularza dostawy</button> 
    </div>
  );
}

export default Cart;