import React from 'react';
import { Platform, Button, View, SafeAreaView } from 'react-native';
import { useDispatch } from 'react-redux';
import { createAppContainer, createSwitchNavigator } from 'react-navigation'; //combine our navigators into a single component
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

import CartScreen, { cartScreenOptions } from '../screens/shop/CartScreen';

import Colors from '../theme/Colors';
import UserProductsScreen from '../screens/user/UserProductsScreen';
import EditProductScreen from '../screens/user/EditProductsScreen';
import AuthScreen from '../screens/user/AuthScreen';
import StartupScreen from '../screens/StartupScreen';
import { logout } from '../store/actions/authActions';

// ? React Navigation v5.
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

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

const UserStackNavigator = createStackNavigator(
	{
		userProducts: UserProductsScreen,
		editProduct: EditProductScreen
	},
	{
		defaultNavigationOptions: defaultStackNavOptions
	}
);

const AuthStackNavigator = createStackNavigator(
	{
		Auth: AuthScreen
	},
	{
		defaultNavigationOptions: defaultStackNavOptions
	}
);
// * Combine our three stack navigators
const ShopNavigator = createDrawerNavigator(
	{
		Products: {
			screen: ProductStackNavigator,
			navigationOptions: {
				drawerIcon: drawerConfig => (
					<Ionicons
						name={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
						color={drawerConfig.tintColor}
						size={23}
					/>
				)
			}
		},
		Orders: {
			screen: OrdersStackNavigator,
			navigationOptions: {
				drawerIcon: drawerConfig => (
					<Ionicons
						name={Platform.OS === 'android' ? 'md-list' : 'ios-list'}
						size={23}
						color={drawerConfig.tintColor} //color of icon depends on tint color
					/>
				)
			}
		},
		User: {
			screen: UserStackNavigator,
			navigationOptions: {
				drawerIcon: drawerConfig => (
					<Ionicons
						name={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
						size={23}
						color={drawerConfig.tintColor}
					/>
				),
				drawerLabel: 'My Shop'
			}
		}
	},
	{
		contentOptions: {
			//configure the content
			activeTintColor: Colors.primary //is active color
		},
		contentComponent: (
			props //add components for the size drawer
		) => {
			const dispatch = useDispatch();
			return (
				<View style={{ flex: 1, paddingTop: 28 }}>
					<SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
						<DrawerNavigatorItems {...props} />
						<Button
							title="Logout"
							color={Colors.primary}
							onPress={() => {
								dispatch(logout());
								//token and id has already been cleared in redux
							}}
						/>
					</SafeAreaView>
				</View>
			);
		}
	}
);

// ? Main Navigator
const MainNavigator = createSwitchNavigator({
	Startup: StartupScreen,
	Auth: AuthStackNavigator,
	Shop: ShopNavigator
});
export default createAppContainer(MainNavigator); //takes in the main navigator
