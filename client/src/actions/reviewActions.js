export const fetchProductReviews = (id) => {
    return (dispatch) => {
      fetch(`http://localhost:3001/reviews/${id}`)
        .then(response => response.json())
        .then(data => dispatch({ type: 'SET_PRODUCT_REVIEWS', productReviews: data }));
    };
  };