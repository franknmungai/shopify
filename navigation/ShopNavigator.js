import React from 'react';
import { Platform, Button, View, SafeAreaView } from 'react-native';
import { useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

import ProductOverviewScreen, {
	ProductsOverviewScreenOptions
} from '../screens/shop/ProductsOverviewScreen';

import ProductDetailScreen, {
	ProductDetailsScreenOptions
} from '../screens/shop/ProductDetailsScreen';

import OrdersScreen, {
	screenOptions as OrdersScreenOptions
} from '../screens/shop/OrdersScreen';

import UserProductsScreen, {
	screenOptions as UserProductsScreenOptions
} from '../screens/user/UserProductsScreen';
import CartScreen, { cartScreenOptions } from '../screens/shop/CartScreen';

import Colors from '../theme/Colors';
import EditProductScreen, {
	screenOptions as EditProductsScreenOptions
} from '../screens/user/EditProductsScreen';

import AuthScreen, {
	screenOptions as AuthScreenOptions
} from '../screens/user/AuthScreen';
import StartupScreen from '../screens/StartupScreen';
import { logout } from '../store/actions/authActions';

// ? React Navigation v5.
import { createStackNavigator } from '@react-navigation/stack';
import {
	createDrawerNavigator,
	DrawerItemList
} from '@react-navigation/drawer';

// ? The default stack navigation options: These haven't changed in react-navigtion v5. Just how you apply this configurations😇
const defaultStackNavOptions = {
	headerStyle: {
		backgroundColor: Platform.OS === 'android' ? Colors.primary : ''
	},
	headerTitleStyle: {
		fontFamily: 'open-sans-bold'
	},
	headerBackTitleStyle: { fontFamily: 'open-sans' }, //on iOS
	headerTintColor: Platform.OS === 'android' ? '#fff' : Colors.primary //color of the header text
};

const ProductsStackNavigator = createStackNavigator();
export const ProductsNavigator = () => {
	return (
		<ProductsStackNavigator.Navigator screenOptions={defaultStackNavOptions}>
			<ProductsStackNavigator.Screen //specifying a route and its configurations
				name="productsOverview"
				component={ProductOverviewScreen}
				options={ProductsOverviewScreenOptions}
			/>
			<ProductsStackNavigator.Screen
				name="productDetail"
				component={ProductDetailScreen}
				options={ProductDetailsScreenOptions}
			/>
			<ProductsStackNavigator.Screen
				name="cart"
				component={CartScreen}
				options={cartScreenOptions}
			/>
		</ProductsStackNavigator.Navigator>
	);
};

const OrdersStackNavigator = createStackNavigator();
export const OrdersNavigator = () => {
	return (
		<OrdersStackNavigator.Navigator screenOptions={defaultStackNavOptions}>
			<OrdersStackNavigator.Screen
				name="orders"
				component={OrdersScreen}
				options={OrdersScreenOptions}
			/>
		</OrdersStackNavigator.Navigator>
	);
};

const UserStackNavigator = createStackNavigator();

export const UserStackNavigator = () => {
	return (
		<UserStackNavigator.Navigator screenOptions={defaultStackNavOptions}>
			<UserStackNavigator.Screen
				name="userProducts"
				component={UserProductsScreen}
				options={UserProductsScreenOptions}
			/>
			<UserStackNavigator.Screen
				name="editProduct"
				component={EditProductScreen}
				options={EditProductsScreenOptions}
			/>
		</UserStackNavigator.Navigator>
	);
};

const AuthStackNavigator = createStackNavigator();
export const AuthNavigator = () => (
	<AuthStackNavigator.Navigator screenOptions={defaultStackNavOptions}>
		<AuthStackNavigator.Screen
			name="Auth"
			component={AuthScreen}
			options={AuthScreenOptions}
		/>
	</AuthStackNavigator.Navigator>
);

// * Combine our three stack navigators. This will be our main navigator and primary component
const ShopDrawerNavigator = createDrawerNavigator();
export const ShopNavigator = () => {
	const dispatch = useDispatch();

	return (
		<ShopDrawerNavigator.Navigator
			drawerContent={props => (
				<LogoutButtonDrawerItem dispatch={dispatch} {...props} />
			)} //react component to use as Drawer Item
			drawerContentOptions={{ activeTintColor: Colors.primary }}
		>
			<ShopDrawerNavigator.Screen
				name="Products"
				component={ProductStackNavigator}
				options={{
					drawerIcon: props => (
						<Ionicons
							name={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
							color={props.color} //will depend on whether this component is active, and the active tint color
							size={23}
						/>
					)
				}}
			/>
			<ShopDrawerNavigator.Screen
				name="Orders"
				component={OrdersStackNavigator}
				options={{
					drawerIcon: props => (
						<Ionicons
							name={Platform.OS === 'android' ? 'md-list' : 'ios-list'}
							size={23}
							color={props.color} //color of icon depends on tint color
						/>
					)
				}}
			/>
			<ShopDrawerNavigator.Screen
				name="User"
				component={UserStackNavigator}
				options={{
					drawerIcon: props => (
						<Ionicons
							name={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
							size={23}
							color={props.color}
						/>
					)
				}}
			/>
		</ShopDrawerNavigator.Navigator>
	);
};

const LogoutButtonDrawerItem = props => (
	<View style={{ flex: 1, paddingTop: 28 }}>
		<SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
			<DrawerItemList {...props} />
			<Button
				title="Logout"
				color={Colors.primary}
				onPress={() => {
					props.dispatch(logout());
					//token and id has already been cleared in redux
				}}
			/>
		</SafeAreaView>
	</View>
);
