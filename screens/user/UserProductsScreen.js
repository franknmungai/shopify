import React from 'react';
import { FlatList, Platform, Button, Alert, View, Text } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import ProductItem from '../../components/shop/ProductItem';
import { useSelector, useDispatch } from 'react-redux';
import CustomHeaderButton from '../shop/UI/HeaderButton';
import Colors from '../../theme/Colors';
import { deleteProduct } from '../../store/actions/productActions';

const UserProductsScreen = props => {
	const userProducts = useSelector(state => state.products.userProducts);
	const dispatch = useDispatch();
	const selectItemHandler = id => {
		props.navigation.navigate('editProduct', { productId: id });
	};

	const deleteItemHandler = id => {
		Alert.alert('Are you sure', 'Do You want to delete this item ?', [
			{ text: 'No', style: 'default' },
			{
				text: 'Yes',
				style: 'destructive',
				onPress: () => {
					dispatch(deleteProduct(id));
				}
			}
		]);
	};

	if (userProducts.length === 0) {
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<Text> No products found, create some</Text>
			</View>
		);
	}
	return (
		<FlatList
			data={userProducts}
			keyExtractor={item => item.id}
			renderItem={itemData => (
				<ProductItem
					image={itemData.item.imageUrl}
					title={itemData.item.title}
					price={itemData.item.price}
					onSelect={() => selectItemHandler(itemData.item.id)}
				>
					<Button
						title="Edit"
						onPress={() => selectItemHandler(itemData.item.id)}
						color={Colors.primary}
					/>
					<Button
						title="Delete"
						onPress={deleteItemHandler.bind(this, itemData.item.id)}
						color={Colors.primary}
					/>
				</ProductItem>
			)}
		/>
	);
};

export const screenOptions = navData => ({
	headerTitle: 'My Shop',
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
	),
	headerRight: () => (
		<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
			<Item
				title="Add"
				iconName={Platform.OS === 'android' ? 'md-add' : 'ios-create'}
				onPress={() => navData.navigation.navigate('editProduct')}
			/>
		</HeaderButtons>
	)
});
export default UserProductsScreen;
