export const CREATE_ORDER = 'CREATE_ORDER';

export const createOrder = (order) => ({
  type: CREATE_ORDER,
  payload: order,
});