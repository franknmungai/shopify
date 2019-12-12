import * as types from '../actions/actionConsts';
import CartItem from '../../utils/models/cartItem';
const initialState = {
	items: {
		// itemId: {quantity: 1, productPrice: 10, productTitle: 'Something', sum: $26 }
	},
	totalAmount: 0
};

export default (state = initialState, action) => {
	switch (action.type) {
		case types.ADD_TO_CART:
			const { id, title, price } = action.payload;
			let updatedOrNewCartItem;
			if (state.items[id]) {
				//computed property name syntax
				//If the item already exists in the cart: updare the exist one's quantity
				const addedItem = { ...state.items[id] };
				updatedOrNewCartItem = new CartItem(
					(addedItem.quantity += 1),
					price,
					title,
					(addedItem.sum += price)
				);

				// delete state.items[id];
			} else {
				updatedOrNewCartItem = new CartItem(1, price, title, 1 * price);
			}
			return {
				...state,
				items: { ...state.items, [id]: updatedOrNewCartItem }, //computed property name syntax
				totalAmount: state.totalAmount + price
			};

		case types.REMOVE_FROM_CART:
			const selectedCartItem = state.items[action.payload]; //get the item from the action payload
			const currentQty = selectedCartItem.quantity;
			let updatedCartItems;
			if (currentQty && currentQty > 1) {
				//if there are multiple same items in the cart

				const updatedCartItem = new CartItem(
					selectedCartItem.quantity - 1,
					selectedCartItem.productPrice,
					selectedCartItem.productTitle,
					selectedCartItem.sum - selectedCartItem.productPrice
				);
				updatedCartItems = {
					...state.items,
					[action.payload]: updatedCartItem
				};
			} else {
				updatedCartItems = { ...state.items };
				delete updatedCartItems[action.payload];
			}

			return {
				...state,
				items: updatedCartItems,
				totalAmount: state.totalAmount - selectedCartItem.productPrice
			};
		case types.DELETE_PRODUCT:
			if (state.items[action.pid]) {
				const newItems = { ...state.items };
				delete newItems[action.pid];
				const newTotalAmount = state.totalAmount - state.items[action.pid].sum;
				return {
					...state,
					items: newItems,
					totalAmount: newTotalAmount
				};
			}
		case types.ADD_ORDER:
			return initialState;
		default:
			return state;
	}
};
