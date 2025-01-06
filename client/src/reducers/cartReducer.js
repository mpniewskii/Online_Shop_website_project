import { ADD_TO_CART, REMOVE_FROM_CART, INCREASE_QUANTITY, DECREASE_QUANTITY } from '../actions/cartActions';

const initialState = {
  products: [],
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      console.log(state.products); 
      console.log(action.payload.quantity); 

      const itemIndex = state.products.findIndex(item => item.id === action.payload.id);
      if (itemIndex >= 0) {
        const updatedProducts = [...state.products];
        updatedProducts[itemIndex].quantity = Number(updatedProducts[itemIndex].quantity) + Number(action.payload.quantity); // Convert quantity to number and increase by selected value
        updatedProducts[itemIndex].stock = action.payload.stock; 
        return {
          ...state,
          products: updatedProducts,
        };
      } else {
        const newProduct = {
          ...action.payload,
          quantity: Number(action.payload.quantity), 
          stock: action.payload.stock, 
        };
        return {
          ...state,
          products: [...state.products, newProduct],
        };
      }
    case REMOVE_FROM_CART:
      return {
        ...state,
        products: state.products.filter((product) => product.id !== action.payload),
      };
    case INCREASE_QUANTITY:
      return {
        ...state,
        products: state.products.map((product) =>
          product.id === action.payload.productId
            ? { ...product, quantity: product.quantity < product.stock ? product.quantity + 1 : product.quantity }
            : product
        ),
      };
    case DECREASE_QUANTITY:
      return {
        ...state,
        products: state.products.map((product) =>
          product.id === action.payload.productId
            ? { ...product, quantity: product.quantity > 0 ? product.quantity - 1 : 0 }
            : product
        ),
      };
    default:
      return state;
  }
};

export default cartReducer;