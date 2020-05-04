import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ProductOverviewScreen from '../screens/shop/ProductsOverviewScreen';

const ProductStack = createStackNavigator();

const AppNavigation = props => {
	return (
		<NavigationContainer>
			<ProductStack.Navigator>
				<ProductStack.Screen
					name="Products Overview"
					component={ProductOverviewScreen}
				/>
			</ProductStack.Navigator>
		</NavigationContainer>
	);
};

export default AppNavigation;
