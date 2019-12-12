import * as types from '../actions/actionConsts';
const initialState = {
	idToken: null,
	userId: null
};

const authReducer = (state = initialState, action) => {
	switch (action.type) {
		case types.AUTHENTICATE:
			return {
				idToken: action.token,
				userId: action.userId
			};
		case types.LOGOUT:
			return initialState;
		default:
			return state;
	}
};

export default authReducer;
