import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, FlatList } from 'react-native';
import Colors from '../../theme/Colors';
import CartItem from './CartItem';
import Card from './Card';

const OrderItem = props => {
	const [showDetails, setShowDetails] = useState(false);
	return (
		<Card style={styles.orderItem}>
			<View style={styles.summary}>
				<Text style={styles.total}>$ {props.amount.toFixed()}</Text>
				<Text style={styles.date}>{props.date}</Text>
			</View>
			<Button
				title={showDetails ? 'Hide Details' : 'Show Details'}
				color={Colors.primary}
				onPress={() => {
					setShowDetails(currentState => !currentState);
				}}
			/>

			{showDetails && (
				<View style={styles.detailItems}>
					<FlatList
						data={props.list}
						keyExtractor={item => item.productId}
						renderItem={itemData => <CartItem item={itemData.item} />}
					/>
				</View>
			)}
		</Card>
	);
};

const styles = StyleSheet.create({
	orderItem: {
		alignItems: 'center',
		shadowColor: '#000',

		margin: 16,
		padding: 8
	},
	summary: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '100%',
		marginBottom: 16
	},
	total: {
		fontFamily: 'open-sans-bold',
		fontSize: 16
	},
	date: {
		fontFamily: 'open-sans',
		fontSize: 16,
		color: '#888'
	},
	detailItems: {
		width: '100%',
		marginTop: 16
	}
});

export default OrderItem;
