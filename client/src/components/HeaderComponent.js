import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import PriceRangeForm from './PriceRangeForm';
import { filterProductsByPrice } from '../actions/productActions';
import { resetProducts, fetchProducts, filterProductsByType } from '../actions/productActions';
import './Header.scss';
import Cart from './KoszykComponent';

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isCartVisible, setIsCartVisible] = useState(false); 
  const [selectedType, setSelectedType] = useState('all'); 

  const handleSortByPrice = (direction) => {
    dispatch({ type: 'SORT_PRODUCTS_BY_PRICE', direction });
    console.log('Sorting products by price:', direction);
  };
  
  const handlePriceRangeSubmit = (minPrice, maxPrice) => {
    dispatch(filterProductsByPrice(minPrice, maxPrice));
    console.log(`Filtering products by price range: ${minPrice} - ${maxPrice}`);
  };
  
  const handleHomeClick = () => {
    dispatch(resetProducts());
    dispatch(fetchProducts()); 
    console.log('Resetting products and fetching them again');
    navigate('/');
  };

  const handleCartClick = () => {
    console.log('Toggling cart visibility');
    setIsCartVisible(!isCartVisible);
  };

  const handleSortByRating = (direction) => {
    dispatch({ type: 'SORT_PRODUCTS_BY_AVERAGE_RATING', payload: direction });
    console.log('Sorting products by rating:', direction);
  };
  
  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  const handleFilterByType = () => {
    if (selectedType === 'all') {
      console.log('Fetching all products');
      dispatch(fetchProducts());
    } else {
      dispatch(filterProductsByType(selectedType));
    }
    console.log(`Filterings products by type: ${selectedType}`);
  };


  return (
    <header className="App-header">
      <Link to="/">
        <button onClick={handleHomeClick}>Strona główna</button>
      </Link>
      <select onChange={handleTypeChange}>
        <option value="all">Wszystkie modele</option>
        <option value="kraft">Modele Kraft</option>
        <option value="komercyjny">Modele Komercyjne</option>
      </select>
      <button onClick={handleFilterByType}>Filtruj</button>
      <button onClick={() => handleSortByPrice('asc')}>Najdroższe</button>
      <button onClick={() => handleSortByPrice('desc')}>Najtańsze</button>
      <button onClick={() => handleSortByRating('asc')}>Najgorsze</button>
      <button onClick={() => handleSortByRating('desc')}>Najlepsze</button>
      <PriceRangeForm onPriceRangeSubmit={handlePriceRangeSubmit} />
      <button onClick={handleCartClick}>Zobacz koszyk</button>
      <Link to="/admin">
        <button className="admin-button">Panel Admina</button>
      </Link>
      {isCartVisible && <Cart setIsCartVisible={setIsCartVisible} />} 
    </header>
  );
}

export default Header;