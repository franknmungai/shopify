import React, { useState } from 'react';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';
import { productReducer } from './store/reducers/productReducer';
import NavigationContainer from './navigation/NavigationContainer';
// import { composeWithDevTools } from 'redux-devtools-extension';
import cartReducer from './store/reducers/cartReducer';
import ordersReducer from './store/reducers/ordersReducer';
import authReducer from './store/reducers/authReducer';
const rootReducer = combineReducers({
	//state
	products: productReducer, //slice of state
	cart: cartReducer,
	orders: ordersReducer,
	auth: authReducer
});

const store = createStore(
	rootReducer,
	/*composeWithDevTools()*/ applyMiddleware(ReduxThunk)
);
//* Fetch fonts
const fetchFonts = () => {
	return Font.loadAsync({
		//a promise
		'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
		'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf')
	});
};

export default function App() {
	const [fontLoaded, setFontLoaded] = useState(false);

	if (!fontLoaded) {
		return (
			<AppLoading
				startAsync={fetchFonts}
				onFinish={() => setFontLoaded(true)}
			/>
		);
	}

	return (
		<Provider store={store}>
			<NavigationContainer />
		</Provider>
	);
}
