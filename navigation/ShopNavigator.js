import React from 'react';
import { Platform, Button, View, SafeAreaView } from 'react-native';
import { useDispatch } from 'react-redux';
import { createAppContainer, createSwitchNavigator } from 'react-navigation'; //combine our navigators into a single component
import { createStackNavigator } from 'react-navigation-stack';
import {
	createDrawerNavigator,
	DrawerNavigatorItems
} from 'react-navigation-drawer';
import ProductOverviewScreen from '../screens/shop/ProductsOverviewScreen';
import ProductDetailScreen from '../screens/shop/ProductDetailsScreen';
import Colors from '../theme/Colors';
import CartScreen from '../screens/shop/CartScreen';
import OrdersScreen from '../screens/shop/OrdersScreen';
import { Ionicons } from '@expo/vector-icons';
import UserProductsScreen from '../screens/user/UserProductsScreen';
import EditProductScreen from '../screens/user/EditProductsScreen';
import AuthScreen from '../screens/user/AuthScreen';
import StartupScreen from '../screens/StartupScreen';
import { logout } from '../store/actions/authActions';

// ? The default stack navigation options:
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

const ProductStackNavigator = createStackNavigator(
	{
		//returns react component
		productsOverview: ProductOverviewScreen,
		productDetail: ProductDetailScreen,
		cart: {
			screen: CartScreen,
			navigationOptions: {
				headerTitle: 'Cart'
			}
		}
	},
	{
		defaultNavigationOptions: defaultStackNavOptions
	}
);

const OrdersStackNavigator = createStackNavigator(
	{
		orders: OrdersScreen
	},
	{
		defaultNavigationOptions: defaultStackNavOptions
	}
);

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
								// props.navigation.navigate('Auth'); //token and id has already been cleared in redux
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
