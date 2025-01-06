export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const INCREASE_QUANTITY = 'INCREASE_QUANTITY';
export const DECREASE_QUANTITY = 'DECREASE_QUANTITY';

export const addToCart = (product) => (dispatch, getState) => {
  const cartItems = getState().cart.products;

  const existingProduct = cartItems.find(item => item.id === product.id);
  
  if (existingProduct) {
    dispatch({
      type: ADD_TO_CART,
      payload: {
        ...product,
        quantity: Number(product.quantity),
      },
    });
  }
  else {
    dispatch({
      type: ADD_TO_CART,
      payload: product,
    });
  }
};
export const removeFromCart = (productId) => {
  return { type: REMOVE_FROM_CART, payload: productId };
};

export const increaseQuantity = (productId, quantity) => {
  return { type: INCREASE_QUANTITY, payload: { productId, quantity } };
};

export const decreaseQuantity = (productId, quantity) => {
  return { type: DECREASE_QUANTITY, payload: { productId, quantity } };
};