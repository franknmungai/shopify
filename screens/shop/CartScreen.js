import React, { useState } from 'react';
import {
	View,
	Text,
	Button,
	FlatList,
	ActivityIndicator,
	Alert,
	StyleSheet
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Colors from '../../theme/Colors';
import CartItem from '../../components/shop/CartItem';
import { removeFromCart } from '../../store/actions/cartActions';
import { addOrder } from '../../store/actions/ordersAction';
import Card from '../../components/shop/Card';

const CartScreen = props => {
	const cartTotal = useSelector(state => state.cart.totalAmount); //useSelector retriggers whenever the redux state changes
	const cartItems = useSelector(state => {
		const transformedItems = [];
		for (const key in state.cart.items) {
			transformedItems.push({
				productId: key,
				...state.cart.items[key]
			});
		}
		return transformedItems;
	});

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState();
	const dispatch = useDispatch();
	const addOrderHandler = async () => {
		try {
			setIsLoading(true);
			await dispatch(addOrder(cartItems, cartTotal)); //using await on dispatch is pretty cool. My async actions throw errors which I then store in component state. Cool
		} catch (error) {
			setError(error);
		}
		setIsLoading(false);
	};

	if (error) {
		Alert.alert('An error occurred', error, [{ style: 'default', text: 'Ok' }]);
	}
	return (
		<View style={styles.screen}>
			<Card style={styles.summary}>
				<Text style={styles.summaryText}>
					Total: {'  '}{' '}
					<Text style={styles.amount}>
						${Math.round(cartTotal.toFixed(2) * 100) / 100}
					</Text>
				</Text>
				{isLoading ? (
					<ActivityIndicator size="large" color={Colors.primary} />
				) : (
					<Button
						title="Purchase"
						color={Colors.accent}
						disabled={cartItems.length === 0}
						onPress={addOrderHandler}
					/>
				)}
			</Card>
			<FlatList
				data={cartItems}
				keyExtractor={item => item.productId}
				renderItem={itemData => (
					<CartItem
						item={itemData.item}
						onRemove={() => {
							dispatch(removeFromCart(itemData.item.productId));
						}}
						deletable
					/>
				)}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	screen: {
		margin: 16
	},
	summary: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 16,
		padding: 8
	},
	summaryText: {
		fontSize: 18,
		fontFamily: 'open-sans-bold',
		marginBottom: 16
	},
	amount: {
		color: Colors.primary
	}
});
export default CartScreen;
