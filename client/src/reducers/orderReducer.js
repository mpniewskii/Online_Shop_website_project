import { CREATE_ORDER } from './orderActions';

const initialState = {
  orders: [],
};

const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_ORDER:
      return {
        ...state,
        orders: [...state.orders, action.payload],
      };
    default:
      return state;
  }
};

export default orderReducer;