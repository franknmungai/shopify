import * as types from './actionConsts';
import Product from '../../utils/models/products';

export const fetchProducts = () => async (dispatch, getState) => {
	const ownerId = getState().auth.userId;
	try {
		const response = await fetch(
			'https://shopify-6616e.firebaseio.com/products.json'
		);
		if (!response.ok) {
			throw new Error('Something went wrong');
		}
		const productsData = await response.json();

		let products = [];
		for (const key in productsData) {
			products.push(
				new Product(
					key,
					productsData[key].ownerId, //'u1',
					productsData[key].title,
					productsData[key].imageUrl,
					productsData[key].desc,
					productsData[key].price
				)
			);
		}
		dispatch({ type: types.GET_AVAILABLE_PRODUCTS, products, ownerId });
	} catch (err) {
		throw err;
	}
};

export const deleteProduct = productId => async (dispatch, getState) => {
	const token = getState().auth.idToken;
	const response = await fetch(
		`https://shopify-6616e.firebaseio.com/products/${productId}.json?auth=${token}`,
		{
			method: 'DELETE'
		}
	);
	if (!response.ok) {
		throw new Error('Something went wrong');
	}
	dispatch({
		type: types.DELETE_PRODUCT,
		pid: productId
	});
};

export const createProduct = (title, desc, imageUrl, price) => async (
	dispatch,
	getState
) => {
	const token = getState().auth.idToken;
	const userId = getState().auth.userId;
	const response = await fetch(
		`https://shopify-6616e.firebaseio.com/products.json?auth=${token}`, //added products.json, thats a db that will be automatically created for us
		{
			method: 'POST',
			headers: {
				'Content-type': 'application/json'
			},
			body: JSON.stringify({ title, desc, imageUrl, price, ownerId: userId })
		}
	);

	if (!response.ok) {
		throw new Error('Something went wrong');
	}

	const resData = await response.json();
	console.log(resData);

	dispatch({
		type: types.CREATE_PRODUCT,
		id: resData.name,
		title,
		desc,
		imageUrl,
		price,
		ownerId: userId
	});
};

export const updateProduct = (id, title, desc, imageUrl) => async (
	dispatch,
	getState
) => {
	//getState gives us access to our current state, passed by Redux Thunk
	console.log(getState());
	const token = getState().auth.idToken;
	const response = await fetch(
		`https://shopify-6616e.firebaseio.com/products/${id}.json?auth=${token}`,
		{
			method: 'PATCH',
			headers: {
				'Content-type': 'application/json'
			},
			body: JSON.stringify({ title, desc, imageUrl })
		}
	);

	if (!response.ok) {
		throw new Error('Something went wrong');
	}
	dispatch({
		type: types.UPDATE_PRODUCT,
		id,
		title,
		desc,
		imageUrl
	});
};
