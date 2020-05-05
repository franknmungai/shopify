import React from 'react';
import { useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { ShopNavigator } from './ShopNavigator';
import StartupScreen from '../screens/StartupScreen';
import AuthScreen from '../screens/user/AuthScreen';
import { createStackNavigator } from '@react-navigation/stack';

const MainStackNavigator = createStackNavigator();
const MainNavigator = () => {
	return (
		<MainStackNavigator.Navigator>
			<MainStackNavigator.Screen name="Shop" component={ShopNavigator} />
		</MainStackNavigator.Navigator>
	);
};

const AppNavigation = () => {
	const { previousAutoLoginAttempt, idToken } = useSelector(
		state => state.auth
	);

	const auth = !!idToken;
	return (
		//navigation container should wrap our all our navigators
		<NavigationContainer>
			{auth && <MainNavigator />}
			{!(auth && previousAutoLoginAttempt) && <StartupScreen />}
			{!auth && <AuthScreen />}
		</NavigationContainer>
	);
};

export default AppNavigation;
