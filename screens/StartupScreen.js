import React, { useEffect } from 'react';
import {
	View,
	ActivityIndicator,
	StyleSheet,
	AsyncStorage
} from 'react-native';
import { useDispatch } from 'react-redux';
import Colors from '../theme/Colors';
import { authenticate } from '../store/actions/authActions';
const StartupScreen = props => {
	const dispatch = useDispatch();
	useEffect(() => {
		const autoLogin = async () => {
			const data = await AsyncStorage.getItem('userData');
			if (!data) {
				props.navigation.navigate('Auth');
				return;
			}
			const userData = JSON.parse(data);
			const { token, userId, expiryDate } = userData;

			if (expiryDate < new Date().getTime() || !(token && userId)) {
				return props.navigation.navigate('Auth');
			}
			const exp = expiryDate - new Date().getTime;
			props.navigation.navigate('Shop');
			dispatch(authenticate(token, userId, exp));
		};
		autoLogin();
	}, []);
	return (
		<View style={styles.screen}>
			<ActivityIndicator size="large" color={Colors.primary} />
		</View>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	}
});
export default StartupScreen;
