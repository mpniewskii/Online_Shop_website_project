import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, setSelectedProductId } from '../actions/productActions'; 
import { addToCart, increaseQuantity } from '../actions/cartActions';
import { useLocation } from 'react-router-dom';
import ProductDetails from './ProductDetails';
import './ProductList.css';

function ProductList() {
  const dispatch = useDispatch();
  const location = useLocation();
  const [averageRating, setAverageRating] = useState(null);
  const filter = useSelector(state => state.filter);

  const products = useSelector(state => state.product.products);
  const key = products.length; 
  
  const cartItems = useSelector(state => state.cart.products); 
  const selectedProductId = useSelector(state => state.product.selectedProductId);
  const [quantities, setQuantities] = useState({});
  const [averageRatings, setAverageRatings] = useState({});

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch, location.pathname, cartItems, filter]); 

  useLayoutEffect(() => {
    const fetchAverageRatings = async () => {
      const newAverageRatings = {};
      for (const product of products) {
        const response = await fetch(`http://localhost:3001/reviews/average/${product.id}`);
        const data = await response.json();
        newAverageRatings[product.id] = data.averageRating;
      }
      setAverageRatings(newAverageRatings);
    };

    fetchAverageRatings();
  }, [products]);



  console.log('Rendering ProductList with products:', products);
  useEffect(() => {
    console.log('Cart items have changed:', cartItems);
  }, [cartItems]);
  
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch, location.pathname, cartItems]); 
  
  useEffect(() => {
    console.log('Products state has changed:', products);
  }, [products]); 

  useEffect(() => {
    console.log('Cart items have changed:', cartItems);
  }, [cartItems]);

  useEffect(() => {
    console.log('Type of selectedProductId:', typeof selectedProductId);
  }, [selectedProductId]);


  
 const handleDetailsClick = (id) => {
   if (selectedProductId === id) {
     dispatch(setSelectedProductId(null));
   } else {
     dispatch(setSelectedProductId(id));
   }
   console.log('Clicked product id:', id);
 };
 
 const handleClose = () => {
   dispatch(setSelectedProductId(null));
 };

  const handleQuantityChange = (id, value) => {
    setQuantities(prev => ({ ...prev, [id]: value }));
  };

  const handleAddToCartClick = (event, product) => {
    event.preventDefault(); 
  
    const quantity = quantities[product.id] || 1;
    console.log('Adding product to cart:', product);
    if (quantity <= product.quantityInStock) {
      const existingCartItem = cartItems.find(item => item.id === product.id);
      if (existingCartItem) {
        dispatch(addToCart({ ...product, quantity: Number(quantity), stock: product.quantityInStock }));
      } else {
        dispatch(addToCart({ ...product, quantity: Number(quantity), stock: product.quantityInStock }));
      }
    } else {
      console.log('Requested quantity exceeds stock');
    }
  };

  return (
    <div className="product-grid" key={key}> 
      {products.map(product => (
        <div key={product.id} className="product-card">
          <img src={product.productImage} alt={product.title} className="product-image" />
          <h2 className="product-title">{product.title}</h2>
          <p className="product-description">{product.shortDescription}</p>
          <p className="product-price">Cena: {product.priceWithoutDelivery}</p>
          <p className="product-price">Cena z wysyłką: {product.priceWithDelivery}</p>
          <p className="product-stock">W piwnicy: {product.quantityInStock}</p>
          <form className="quantity-form">
            <input
              type="number"
              min="1"
              max={product.quantityInStock}
              defaultValue="1"
              onChange={(e) => handleQuantityChange(product.id, e.target.value)}
            />
            <button onClick={(event) => handleAddToCartClick(event, product)}>Dodaj do koszyka</button>
          </form>
          <button onClick={() => handleDetailsClick(product.id)}>Detale</button>
          {selectedProductId === product.id && <ProductDetails id={product.id} onClose={handleClose} />}

        </div>
      ))}
    </div>
  );
}

export default ProductList;