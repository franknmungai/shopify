import * as types from './actionConsts';

// ? Action creators
export const addToCart = product => {
	return { type: types.ADD_TO_CART, payload: product };
};

export const removeFromCart = productId => ({
	type: types.REMOVE_FROM_CART,
	payload: productId
});
