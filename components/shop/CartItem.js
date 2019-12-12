import React from 'react';
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CartItem = props => {
	const {
		item: { productTitle, quantity, sum },
		onRemove,
		deletable
	} = props;
	return (
		<View style={styles.cartItem}>
			<View style={styles.itemText}>
				<Text style={styles.quantity}>{quantity} </Text>
				<Text style={styles.mainText}>{productTitle}</Text>
			</View>
			<View style={styles.itemData}>
				<Text style={styles.mainText}> $ {sum.toFixed(2)}</Text>
				{deletable && (
					<TouchableOpacity onPress={onRemove} style={styles.deleteBtn}>
						<Ionicons
							name={Platform.OS === 'android' ? 'md-trash' : 'ios-trash'}
							size={23}
							color="red"
						/>
					</TouchableOpacity>
				)}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	cartItem: {
		padding: 12,
		marginHorizontal: 12,
		elevation: 5,
		backgroundColor: '#fff',
		marginBottom: 8
	},
	itemData: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-end',
		padding: 4
	},
	itemText: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		justifyContent: 'center'
	},
	quantity: {
		fontFamily: 'open-sans',
		color: '#888',
		fontSize: 16,
		marginRight: 8
	},
	mainText: {
		fontFamily: 'open-sans-bold',
		fontSize: 16
	},

	deleteBtn: {
		marginLeft: 24
	}
});

export default CartItem;
