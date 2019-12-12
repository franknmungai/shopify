import * as types from '../actions/actionConsts';
import Order from '../../utils/models/order';

export const fetchOrders = () => async (dispatch, getState) => {
	const userId = getState().auth.userId;
	try {
		const response = await fetch(
			`https://shopify-6616e.firebaseio.com/orders/${userId}.json`
		);
		if (!response.ok) {
			throw new Error('Something went wrong');
		}
		const ordersData = await response.json(); //Object { id: { cartItems: [{}, {}, {}], totalAmount: 10, createdAt: 15553135 } }
		let orders = [];
		for (const key in ordersData) {
			orders.push(
				new Order(
					key,
					ordersData[key].cartItems,
					ordersData[key].totalAmount,
					new Date(ordersData[key].createdAt)
				)
			);
		}
		dispatch({
			type: types.SET_ORDERS,
			orders
		});
	} catch (err) {
		throw err;
	}
};
export const addOrder = (cartItems, totalAmount) => async (
	dispatch,
	getState //current redux state
) => {
	const createdAt = new Date().toISOString();
	const token = getState().auth.idToken;
	const userId = getState().auth.userId;
	try {
		const response = await fetch(
			`https://shopify-6616e.firebaseio.com/orders/${userId}.json?auth=${token}`, //added a subfolder /u1 for user
			{
				method: 'POST',
				headers: {
					'Content-type': 'application/json'
				},
				body: JSON.stringify({
					cartItems,
					totalAmount,
					createdAt
				})
			}
		);

		if (!response.ok) {
			throw new Error('Something went wrong');
		}

		const data = await response.json();
		dispatch({
			type: types.ADD_ORDER,
			payload: {
				id: data.name,
				items: cartItems,
				amount: totalAmount,
				date: new Date(createdAt)
			}
		});
	} catch (err) {
		throw err;
	}
};
