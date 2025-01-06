import axios from 'axios';

export const SORT_PRODUCTS_BY_PRICE = 'SORT_PRODUCTS_BY_PRICE';

export const sortProductsByPrice = (direction) => ({
  type: SORT_PRODUCTS_BY_PRICE,
  payload: direction,
});

export const fetchProducts = () => async (dispatch) => {
  const response = await axios.get('http://localhost:3001/products-summary');
  const products = response.data;

  const averageRatings = {};
  for (const product of products) {
    const response = await axios.get(`http://localhost:3001/reviews/average/${product.id}`);
    averageRatings[product.id] = response.data.averageRating !== undefined ? response.data.averageRating : 0;
  }

  dispatch({
    type: 'SET_PRODUCTS',
    products: products,
    averageRatings: averageRatings
  });
};

export function filterProductsByPrice(minPrice, maxPrice) {
  return async function(dispatch) {
    try {
      const response = await fetch(`http://localhost:3001/products/price-range?minPrice=${minPrice}&maxPrice=${maxPrice}`);
      const products = await response.json();

      dispatch({ type: 'FILTER_PRODUCTS_BY_PRICE', products });
    } catch (error) {
      console.error('Error:', error);
    }
  };
}

export const resetProducts = () => {
  return { type: 'RESET_PRODUCTS' };
};

export const setSelectedProductId = (id) => ({
  type: 'SET_SELECTED_PRODUCT_ID',
  payload: id,
});

export const SORT_PRODUCTS_BY_AVERAGE_RATING = 'SORT_PRODUCTS_BY_AVERAGE_RATING';

export const sortProductsByAverageRating = (direction) => async (dispatch, getState) => {
  const { products } = getState().product;

  const sortedProducts = [...products].sort((a, b) => {
    const aRating = a.averageRating !== undefined ? a.averageRating : (direction === 'asc' ? -Infinity : Infinity);
    const bRating = b.averageRating !== undefined ? b.averageRating : (direction === 'asc' ? -Infinity : Infinity);

    if (aRating === bRating) {
      return a.id - b.id; 
    }

    return direction === 'asc' ? aRating - bRating : bRating - aRating;
  });

  dispatch({ type: SORT_PRODUCTS_BY_AVERAGE_RATING, payload: sortedProducts });
};

export const filterProductsByType = (productType) => async (dispatch) => {
  try {
    const res = await axios.get(`http://localhost:3001/products/${productType}`);
    console.log('Received products from server:', res.data); // Add this line
    dispatch({ type: 'FILTER_PRODUCTS_BY_TYPE', payload: res.data });
  } catch (error) {
    console.error('Error during fetching products:', error);
  }
};