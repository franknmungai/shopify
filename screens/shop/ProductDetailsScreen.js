import React from 'react';
import {
	ScrollView,
	Button,
	Text,
	Image,
	StyleSheet,
	View,
	Dimensions
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Colors from '../../theme/Colors';
import { addToCart } from '../../store/actions/cartActions';

const ProductDetailScreen = props => {
	const { productId } = props.route.params;
	const selectedProduct = useSelector(state =>
		state.products.availableProducts.find(prod => prod.id === productId)
	);
	const dispatch = useDispatch();
	return (
		<ScrollView>
			<Image source={{ uri: selectedProduct.imageUrl }} style={styles.image} />
			<View style={styles.actions}>
				<Button
					title="Add to cart"
					color={Colors.primary}
					onPress={() => {
						dispatch(addToCart(selectedProduct));
					}}
				/>
			</View>
			<Text style={styles.price}>${selectedProduct.price.toFixed(2)}</Text>
			<Text style={styles.desc}>{selectedProduct.desc}</Text>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	image: {
		height: Dimensions.get('window').height * 0.45,
		width: '100%'
	},
	price: {
		fontSize: 20,
		color: '#888',
		textAlign: 'center',
		marginVertical: 16,
		fontFamily: 'open-sans-bold'
	},
	desc: {
		fontSize: 16,
		textAlign: 'center',
		marginHorizontal: 20,
		fontFamily: 'open-sans'
	},
	actions: {
		alignItems: 'center',
		marginVertical: 16
	}
});

export const ProductDetailsScreenOptions = navData => {
	const { productTitle } = navData.route.params;
	return {
		headerTitle: productTitle
	};
};

export default ProductDetailScreen;
