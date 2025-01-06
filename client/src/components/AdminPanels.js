import React, { useState, useEffect } from 'react';
import './AdminPanel.scss';

const defaultDeliveryOptions = [
  { type: 'ekspresowa', cost: 30, days: 3 },
  { type: 'normalna', cost: 15, days: 7 },
  { type: 'tania', cost: 10, days: 14 }
];

function AdminPanel() {
  const [product, setProduct] = useState({
    name: '',
    price: '',
    deliveryOptions: defaultDeliveryOptions,
    description: '',
    extendedDescription: '',
    type: '',
    quantityInStock: '',
    imageUrl: ''
  });

  const [products, setProducts] = useState([]);
  const [isDataLoaded, setDataLoaded] = useState(false);
  const [expandedProductId, setExpandedProductId] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/products-summary')
      .then(response => response.json())
      .then(data => {
        const productsWithReviews = data.map(product => ({
          ...product,
          reviews: []
        }));
        setProducts(productsWithReviews);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  useEffect(() => {
    if (!isDataLoaded && products.length > 0) {
      Promise.all(products.map((product) =>
        fetch(`http://localhost:3001/reviews/${product.id}`)
          .then(response => response.json())
          .then(data => ({ ...product, reviews: data }))
      ))
      .then(updatedProducts => {
        setProducts(updatedProducts);
        setDataLoaded(true);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    }
  }, [products, isDataLoaded]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:3001/products/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  const handleDeleteReview = (productId, reviewId) => {
    fetch(`http://localhost:3001/reviews/delete/${reviewId}`, {
      method: 'DELETE',
    })
    .then(() => {
      const updatedProducts = products.map(product => {
        if (product.id === productId) {
          product.reviews = product.reviews.filter(review => review._id !== reviewId);
        }
        return product;
      });
      setProducts(updatedProducts);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  const handleExpandClick = (productId) => {
    if (expandedProductId === productId) {
      setExpandedProductId(null);
    } else {
      setExpandedProductId(productId);
    }
  };


  return (
    <div className="admin-panel-product">
      <form className="admin-panel-form" onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" name="name" onChange={handleChange} />
        </label>
        <label>
          Price:
          <input type="text" name="price" onChange={handleChange} />
        </label>
        <label>
          Description:
          <input type="text" name="description" onChange={handleChange} />
        </label>
        <label>
          Extended Description:
          <input type="text" name="extendedDescription" onChange={handleChange} />
        </label>
        <label>
          Type:
          <input type="text" name="type" onChange={handleChange} />
        </label>
        <label>
          Quantity in Stock:
          <input type="text" name="quantityInStock" onChange={handleChange} />
        </label>
        <label>
          Image URL:
          <input type="text" name="imageUrl" onChange={handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
      <div className="admin-panel-review-section">
        {products.map((product) => (
          <div className="product" key={product.id}>
            <h2>{product.title}</h2>
            <button className="admin-panel-button" onClick={() => handleExpandClick(product.id)}>
              {expandedProductId === product.id ? 'Zwiń' : 'Rozwiń'}
            </button>
            {expandedProductId === product.id && product.reviews.map((review) => (
              <div className="review" key={review._id}>
                <p>{review.comment}</p>
                <button className="admin-panel-delete-button" onClick={() => handleDeleteReview(product.id, review._id)}>Usuń recenzję</button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );

}

export default AdminPanel;