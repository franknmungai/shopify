import React from 'react';
import {
	View,
	Text,
	StyleSheet,
	Image,
	TouchableOpacity,
	TouchableNativeFeedback,
	Platform
} from 'react-native';
import Card from './Card';

const ProductItem = props => {
	let Touchable =
		Platform.OS === 'android' && Platform.Version >= 21
			? TouchableNativeFeedback
			: TouchableOpacity;

	return (
		<Card style={styles.product}>
			<View style={styles.touchable}>
				<Touchable onPress={props.onSelect} activeOpacity={0.75} useForeground>
					<View>
						<View style={styles.imageContainer}>
							<Image
								source={{ uri: props.image }}
								style={styles.image}
								resizeMode="cover"
							/>
						</View>
						<View style={styles.details}>
							<Text style={styles.title}>{props.title}</Text>
							<Text style={styles.price}>${props.price.toFixed(2)}</Text>
						</View>
						<View style={styles.actions}>{props.children}</View>
					</View>
				</Touchable>
			</View>
		</Card>
	);
};

const styles = StyleSheet.create({
	product: {
		margin: 20,
		paddingHorizontal: 8,
		paddingVertical: 5,
		height: 300
	},
	touchable: {
		borderRadius: 10,
		overflow: 'hidden' //ensure the touchable ripple respects our background radius
	},
	imageContainer: {
		width: '100%',
		height: '60%',
		//make sure that the top of the card has a border radius
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
		overflow: 'hidden' //make sure that the image is cut to show border radius
	},
	image: {
		width: '100%',
		height: '100%'
	},
	title: {
		fontSize: 18,
		marginVertical: 3,
		fontFamily: 'open-sans-bold'
	},
	price: {
		fontSize: 16,
		color: '#888',
		fontFamily: 'open-sans',
		marginTop: 5
	},
	details: {
		alignItems: 'center',
		height: '15%'
	},
	actions: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-end',
		height: '25%',
		paddingBottom: 24
	}
});
export default ProductItem;
