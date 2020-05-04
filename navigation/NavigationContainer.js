import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import ShopNavigator from './ShopNavigator';

const NavigationContainer = props => {
	const navRef = useRef();
	const isAuthenticated = useSelector(state => !!state.auth.idToken); //!! ensure its either true or false

	useEffect(() => {
		if (!isAuthenticated) {
			navRef.current.dispatch(
				//you can call dispatch from a Navigator.
				NavigationActions.navigate({ routeName: 'Auth' })
			); //dispatch is method on createAppContainer exported by ShopNavigator
		}
	}, [isAuthenticated]);
	return <ShopNavigator ref={navRef} />;
};

export default NavigationContainer;
