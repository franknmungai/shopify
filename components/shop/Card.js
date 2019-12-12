import React from 'react';
import { View, StyleSheet } from 'react-native';

const Card = props => (
	<View style={{ ...props.style, ...styles.card }}>{props.children}</View>
);

const styles = StyleSheet.create({
	card: {
		shadowColor: '#000',
		shadowOpacity: 0.3,
		shadowOffset: { width: 2, height: 2 },
		shadowRadius: 8,
		elevation: 10,
		borderRadius: 10,
		backgroundColor: '#fff'
	}
});
export default Card;
