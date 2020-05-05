import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ProductsNavigator } from './ShopNavigator';
const AppNavigation = props => {
	return (
		//navigaation container should wrap our all our navigators
		<NavigationContainer>
			<ProductsNavigator />
		</NavigationContainer>
	);
};

export default AppNavigation;
