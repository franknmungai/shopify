import React, { useEffect, useState } from 'react';
import {
	FlatList,
	Platform,
	ActivityIndicator,
	Alert,
	StyleSheet,
	View,
	Text
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import CustomHeaderButton from './UI/HeaderButton';
import OrderItem from '../../components/shop/OrderItem';
import { fetchOrders } from '../../store/actions/ordersAction';
import Colors from '../../theme/Colors';

const OrdersScreen = props => {
	const orders = useSelector(state => state.orders.orders);
	const dispatch = useDispatch();
	const [isLoading, setIsloading] = useState(false);
	const [error, setError] = useState();

	useEffect(() => {
		setIsloading(true);
		dispatch(fetchOrders())
			.then(() => {
				setIsloading(false);
			})
			.catch(err => {
				setError(err);
			});
	}, [dispatch]);

	if (isLoading) {
		return (
			<View style={styles.center}>
				<ActivityIndicator size="large" color={Colors.primary} />
			</View>
		);
	}

	if (error) {
		Alert.alert('An error occurred', 'Something went wrong try again', [
			{ text: 'Okay', style: 'default' }
		]);
	}

	if (orders.length === 0) {
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<Text>No orders yet, order something</Text>
			</View>
		);
	}
	return (
		<FlatList
			data={orders}
			keyExtractor={item => item.id}
			renderItem={itemData => (
				<OrderItem
					date={itemData.item.readableDateAndroid}
					amount={itemData.item.totalAmount}
					list={itemData.item.items}
				/>
			)}
		/>
	);
};

const styles = StyleSheet.create({
	center: {
		justifyContent: 'center',
		alignItems: 'center',
		flex: 1
	}
});
export const screenOptions = navData => ({
	headerTitle: 'Your orders',
	headerLeft: () => (
		<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
			<Item
				title="Menu"
				iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
				onPress={() => {
					navData.navigation.toggleDrawer();
				}}
			/>
		</HeaderButtons>
	)
});
export default OrdersScreen;
