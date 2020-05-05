import { AsyncStorage } from 'react-native';
import * as types from '../actions/actionConsts';

export const authenticate = (token, userId, exp) => dispatch => {
	dispatch({
		type: types.AUTHENTICATE,
		token,
		userId
	});
	dispatch(setLogoutTimer(exp));
};

export const autoLogin = () => ({
	type: types.AUTO_LOGIN
});

export const signUp = (email, password) => async dispatch => {
	//AIzaSyAW1WCLq-s4OLe0VfNvq4E6LOJC15nGb4I
	console.log({ email, password });
	const response = await fetch(
		'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAW1WCLq-s4OLe0VfNvq4E6LOJC15nGb4I',
		{
			method: 'POST',
			headers: {
				'Content-type': 'application/json'
			},
			body: JSON.stringify({
				email: email,
				password: password,
				returnSecureToken: true
			})
		}
	);

	if (!response.ok) {
		const errorData = await response.json();
		const errorId = errorData.error.message;

		let message = 'Something went wrong';
		if (errorId === 'EMAIL_EXISTS') {
			message = 'Email already taken';
		}
		throw new Error(message);
	}

	const data = await response.json();

	const { idToken, localId, expiresIn } = data;

	dispatch(authenticate(idToken, localId, +expiresIn * 1000));

	const expirationDate = new Date().getTime() + parseInt(expiresIn) * 1000;
	saveAuthToStorage(idToken, localId, expirationDate);
};

export const login = (email, password) => async dispatch => {
	const response = await fetch(
		'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAW1WCLq-s4OLe0VfNvq4E6LOJC15nGb4I',
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email,
				password,
				returnSecureToken: true
			})
		}
	);

	if (!response.ok) {
		const errorData = await response.json();
		const errorId = errorData.error.message;

		let message = 'Something went wrong';
		if (errorId === 'EMAIL_NOT_FOUND') {
			message = 'Email not found';
		} else if (errorId === 'INVALID_PASSWORD') {
			message = 'Invalid Password';
		}
		throw new Error(message);
	}

	const data = await response.json();
	const { idToken, localId, expiresIn } = data;
	dispatch(authenticate(idToken, localId, +expiresIn * 1000));

	const expirationDate = new Date().getTime() + parseInt(expiresIn) * 1000; //the timestamp in ms when the token expires
	saveAuthToStorage(idToken, localId, expirationDate); //persist the data to local storage for  app restarts
};
let timer;

export const logout = () => {
	clearLogoutTimer();
	AsyncStorage.removeItem('userData'); //this is async but we don't need the resolved data
	return { type: types.LOGOUT };
};

const setLogoutTimer = exp => dispatch => {
	timer = setTimeout(() => {
		//async code
		dispatch(logout());
	}, exp);
};

const clearLogoutTimer = () => {
	if (timer) {
		clearTimeout(timer);
	}
};
const saveAuthToStorage = (token, userId, expiryDate) => {
	AsyncStorage.setItem(
		//stores data in local device storage as key value pairs
		'userData',
		JSON.stringify({
			token,
			userId,
			expiryDate //time stamp
		})
	);
};
