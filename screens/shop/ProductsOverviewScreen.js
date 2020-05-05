import React, { useEffect, useState, useCallback } from 'react';
import {
	View,
	FlatList,
	Platform,
	Button,
	ActivityIndicator,
	StyleSheet,
	Text
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import ProductItem from '../../components/shop/ProductItem';
import { addToCart } from '../../store/actions/cartActions';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import CustomHeaderButton from './UI/HeaderButton';
import Colors from '../../theme/Colors';
import { fetchProducts } from '../../store/actions/productActions';

const ProductOverviewScreen = props => {
	const [isLoading, setIsLoading] = useState(false);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [error, setError] = useState();
	const availableProducts = useSelector(
		state => state.products.availableProducts
	); //get a slice of state

	const dispatch = useDispatch();

	// ? Fetch products from the database
	const loadProducts = useCallback(async () => {
		setError(null);
		setIsRefreshing(true);
		try {
			await dispatch(fetchProducts()); //returns a promise. I can use await on dispatch 😃😃😃
			setIsRefreshing(false);
		} catch (err) {
			setError(err);
		}
	}, [dispatch]);

	//* Load products initially
	useEffect(() => {
		setIsLoading(true);
		loadProducts().then(() => {
			setIsLoading(false);
		});
	}, [loadProducts]);

	//* refresh the products again when we navigate to the component to show latest db changes
	useEffect(() => {
		const unSubscribe = props.navigation.addListener(
			//perform a refresh everytime we focus on this screen. This listener returns the unsubscribe func which we need to call on unmount
			'focus',
			loadProducts
		);
		return () => {
			//clean up on unmount
			unSubscribe();
		};
	}, [loadProducts]);

	const selectItemHandler = (id, title) => {
		props.navigation.navigate({
			routeName: 'productDetail',
			params: {
				productId: id,
				productTitle: title
			}
		});
	};

	if (isLoading) {
		return (
			<View style={styles.loader}>
				<ActivityIndicator size="large" color={Colors.primary} />
			</View>
		);
	}

	if (!isLoading && availableProducts.length === 0) {
		return (
			<View style={styles.loader}>
				<Text>No products yet, add some</Text>
			</View>
		);
	}

	if (error) {
		return (
			<View style={styles.loader}>
				<Text> An error occurred</Text>
				<Button
					title="Try again"
					onPress={loadProducts}
					color={Colors.primary}
				/>
			</View>
		);
	}
	return (
		<FlatList
			onRefresh={loadProducts} // add pull to refresh
			refreshing={isRefreshing} //set this to true while awaiting data from a refresh
			data={availableProducts}
			keyExtractor={item => item.id}
			renderItem={(
				itemData //receives itemData and item from RN
			) => (
				<ProductItem
					image={itemData.item.imageUrl}
					title={itemData.item.title}
					price={itemData.item.price}
					onSelect={() => {
						selectItemHandler(itemData.item.id, itemData.item.title);
					}}
				>
					<Button
						title="Show Details"
						onPress={() =>
							selectItemHandler(itemData.item.id, itemData.item.title)
						}
						color={Colors.primary}
					/>
					<Button
						title="Add to cart"
						onPress={() => dispatch(addToCart(itemData.item))}
						color={Colors.primary}
					/>
				</ProductItem>
			)}
		/>
	);
};

export const ProductsOverviewScreenOptions = navData => {
	//will receive navData as an argument from react-navigation-componenent
	return {
		headerTitle: 'Products',
		headerRight: () => (
			//takes in a component
			<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
				<Item
					title="Cart"
					iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
					onPress={() => {
						navData.navigation.navigate('cart');
					}}
				/>
			</HeaderButtons>
		),
		headerLeft: () => (
			<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
				<Item
					title="Menu"
					iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
					onPress={() => {
						navData.navigation.toggleDrawer(); //toggle the drawer
					}}
				/>
			</HeaderButtons>
		)
	};
};

const styles = StyleSheet.create({
	loader: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	}
});
export default ProductOverviewScreen;
