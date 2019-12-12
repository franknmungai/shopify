import PRODUCTS from '../../utils/data/dummyData';
import * as types from '../actions/actionConsts';
import Product from '../../utils/models/products';
//? Define how products initial state slice will look like
const initialState = {
	availableProducts: [], //PRODUCTS, //all products
	userProducts: [] //products of the currently logged in user
};

export const productReducer = (state = initialState, action) => {
	switch (action.type) {
		case types.GET_AVAILABLE_PRODUCTS:
			return {
				...state,
				availableProducts: action.products,
				userProducts: action.products.filter(
					prod => prod.ownerId === action.ownerId
				)
			};
		case types.CREATE_PRODUCT:
			const newProduct = new Product(
				action.id,
				action.ownerId,
				action.title,
				action.imageUrl,
				action.desc,
				action.price
			);
			return {
				...state,
				availableProducts: [...state.availableProducts, newProduct],
				userProducts: state.userProducts.concat(newProduct)
			};
		case types.UPDATE_PRODUCT:
			const prodIndex = state.userProducts.findIndex(
				prod => prod.id === action.id
			);
			const index = state.availableProducts.findIndex(
				prod => prod.id === action.id
			);
			const updatedUserProducts = [...state.userProducts];
			const updatedProduct = new Product(
				action.id,
				state.userProducts[prodIndex].ownerId,
				action.title,
				action.imageUrl,
				action.desc,
				state.userProducts[prodIndex].price
			);
			updatedUserProducts.splice(prodIndex, 1, updatedProduct);

			const updatedAvailableProduct = [...state.availableProducts];
			updatedAvailableProduct.splice(index, 1, updatedProduct);

			return {
				...state,
				availableProducts: updatedAvailableProduct,
				userProducts: updatedUserProducts
			};

		case types.DELETE_PRODUCT:
			const newAvailableProducts = state.availableProducts.filter(
				prod => prod.id !== action.pid
			);
			const newUserProducts = state.userProducts.filter(
				prod => prod.id !== action.pid
			);
			return {
				...state,
				availableProducts: newAvailableProducts,
				userProducts: newUserProducts
			};

		default:
			return state;
	}
};
