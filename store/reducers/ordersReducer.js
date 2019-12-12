import * as types from '../actions/actionConsts';
import Order from '../../utils/models/order';
const initialState = {
	orders: [] //an array of objects
};

export default ordersReducer = (state = initialState, action) => {
	switch (action.type) {
		case types.SET_ORDERS:
			return {
				...state,
				orders: action.orders
			};
		case types.ADD_ORDER:
			const { payload } = action;
			const newOrder = new Order(
				payload.id, //id
				payload.items, //array
				payload.amount,
				payload.date //date
			);
			return {
				...state,
				orders: state.orders.concat(newOrder) //concat adds to an array returns a new array
			};

		default:
			break;
	}
	return state;
};
