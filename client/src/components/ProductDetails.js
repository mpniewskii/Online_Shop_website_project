import React, { useState, useEffect } from 'react';
import ReviewForm from './ReviewForm';
import './ProductDetails.css';

function ProductDetails({ id, onClose }) {
  const [product, setProduct] = useState(null);
  const [averageRating, setAverageRating] = useState(null);
  const [reviews, setReviews] = useState(null);
  
  useEffect(() => {
    fetch(`http://localhost:3001/products/${id}/extendedDescription`)
      .then(response => response.json())
      .then(data => setProduct(data));
  
    fetch(`http://localhost:3001/reviews/average/${id}`)
      .then(response => response.json())
      .then(data => setAverageRating(data.averageRating !== undefined ? data.averageRating : 0));
  
    fetch(`http://localhost:3001/reviews/${id}`)
      .then(response => response.json())
      .then(data => setReviews(data));
      
    document.body.classList.add('popup-open');
    
    return () => {
      document.body.classList.remove('popup-open');
    };
  }, [id]);

  const handleClose = () => {
    onClose();
  };

  if (!product || averageRating === null) {
    return <div>Loading...</div>;
  }

  const fullStars = Number.isFinite(averageRating) ? Math.floor(averageRating) : 0;
  const halfStars = Number.isFinite(averageRating) && averageRating % 1 >= 0.5 ? 1 : 0;

  return (
    <div className="product-details-popup">
      <div className="product-details-content">
        <button onClick={handleClose}>X</button> 
        <h2>{product.title}</h2>
        <p className="product-description">{product.extendedDescription}</p>
        <p><span className="label">Rodzaj:</span> {product.type}</p>
        <p className="delivery-options-title">Opcje dostawy</p>
        <ul>
          {product.deliveryOptions && product.deliveryOptions.map((option, index) => (
            <li key={index}>{option.type}: {option.cost}</li>
          ))}
        </ul>
        <p><span className="label">Średnia ocena:</span> {Number.isFinite(averageRating) ? `${Array(fullStars).fill('⭐').join('')}${halfStars ? '☆' : ''}` : 'Brak opinii'}</p> {/* Dodane klasy */}
        {reviews && reviews.length > 0 ? (
          <>
            {reviews.map((review, index) => (
              <div key={index}>
                <p><span className="label">Ocena:</span> {review.rating}</p> {/* Dodane klasy */}
                <p><span className="label">Recenzja:</span> {review.comment}</p> {/* Dodane klasy */}
              </div>
            ))}
          </>
        ) : (
          <p>Nie ma jeszcze recenzji. Zmień to!</p>
        )}
        <ReviewForm id={id} />
      </div>
    </div>
  );
}

export default ProductDetails;