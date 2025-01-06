const initialState = {
  products: [],
  selectedProductId: null,
  averageRatings: {}
};


function productReducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return { ...state, products: action.products, averageRatings: action.averageRatings };

    case 'SET_SELECTED_PRODUCT_ID':
      return { ...state, selectedProductId: action.payload };

    case 'FILTER_PRODUCTS_BY_PRICE':
      console.log('action.products:', action.products);
      return { ...state, products: action.products };

    case 'RESET_PRODUCTS':
      return initialState;

    case 'SORT_PRODUCTS_BY_AVERAGE_RATING':
      const sortedByRating = [...state.products].sort((a, b) => {
        console.log('Sorting products by average rating:', action.payload);
        const ratingA = state.averageRatings[a.id] !== undefined ? state.averageRatings[a.id] : -Infinity;
        const ratingB = state.averageRatings[b.id] !== undefined ? state.averageRatings[b.id] : -Infinity;
        if (action.payload === 'desc') {
          return ratingB - ratingA;
        } else {
          return ratingA - ratingB;
        }
      });
      return { ...state, products: sortedByRating };

    case 'FILTER_PRODUCTS_BY_TYPE':
      return {
        ...state,
        products: action.payload, 
      };

    case 'SORT_PRODUCTS_BY_PRICE':
      const sortedProducts = [...state.products].sort((a, b) => {
        if (action.direction === 'desc') {
          return a.priceWithDelivery - b.priceWithDelivery; 
        } else {
          return b.priceWithDelivery - a.priceWithDelivery; 
        }
      });
      return { ...state, products: sortedProducts };
    default:
      return state;
  }
}

export default productReducer;