import React, { useState } from 'react';

function PriceRangeForm({ onPriceRangeSubmit }) {
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onPriceRangeSubmit(minPrice, maxPrice);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="number" value={minPrice} onChange={e => setMinPrice(e.target.value)} placeholder="Min price" />
      <input type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} placeholder="Max price" />
      <button type="submit">Filtruj według ceny</button>
    </form>
  );
}

export default PriceRangeForm;