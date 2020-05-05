import * as types from '../actions/actionConsts';
const initialState = {
	idToken: null,
	userId: null,
	previousAutoLoginAttempt: false
};

const authReducer = (state = initialState, action) => {
	switch (action.type) {
		case types.AUTHENTICATE:
			return {
				idToken: action.token,
				userId: action.userId
			};
		case types.LOGOUT:
			return {
				...initialState,
				previousAutoLoginAttempt: true
			};
		case types.AUTO_LOGIN:
			return { ...state, previousAutoLoginAttempt: true };
		default:
			return state;
	}
};

export default authReducer;
