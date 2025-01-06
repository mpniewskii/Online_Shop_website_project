import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import {thunk} from 'redux-thunk';
import productReducer from './reducers/productReducer';
import './App.css';
import ProductList from './components/ProductList';
import Header from './components/HeaderComponent';
import cartReducer from './reducers/cartReducer';
import OrderForm from './components/OrderComponent';
import AdminPanel from './components/AdminPanels'; 
import { OrderContext } from './contexts/OrderContext'; // importuj kontekst zamówienia

const rootReducer = combineReducers({
  product: productReducer,
  cart: cartReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

function App() {
  const [order, setOrder] = useState({
    cartItems: [],
    deliveryCost: 0,
    name: '',
    deliveryType: '',
    address: '',
    email: '',
  });
  
  return (
    <Provider store={store}>
      <OrderContext.Provider value={{ order, setOrder }}>
        <Router>
          <div className="App">
            <Header />
            <Routes>
              <Route path="/" element={<ProductList />} />
              <Route path="/order-form" element={<OrderForm />} />
              <Route path="/product-list" element={<ProductList />} />
              <Route path="/admin" element={<AdminPanel />} /> 
            </Routes>
          </div>
        </Router>
      </OrderContext.Provider>
    </Provider>
  );
}

export default App;