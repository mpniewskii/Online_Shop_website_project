const initialState = {
    productReviews: null,
  };
  
  function reviewReducer(state = initialState, action) {
    switch (action.type) {
      case 'SET_PRODUCT_REVIEWS':
        return { ...state, productReviews: action.productReviews };
      default:
        return state;
    }
  }
  export default reviewReducer;