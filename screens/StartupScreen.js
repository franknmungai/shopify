import React, { useEffect } from 'react';
import {
	View,
	ActivityIndicator,
	StyleSheet,
	AsyncStorage
} from 'react-native';
import { useDispatch } from 'react-redux';
import Colors from '../theme/Colors';
import {
	authenticate,
	autoLogin as _autoLogin
} from '../store/actions/authActions';

const StartupScreen = props => {
	const dispatch = useDispatch();
	useEffect(() => {
		const autoLogin = async () => {
			const data = await AsyncStorage.getItem('userData');
			if (!data) {
				dispatch(_autoLogin());
				return;
			}
			const userData = JSON.parse(data);
			const { token, userId, expiryDate } = userData;

			if (expiryDate < new Date().getTime() || !(token && userId)) {
				dispatch(autoLogin());
				return;
			}
			const expirationTime = expiryDate - new Date().getTime;
			props.navigation.navigate('Shop');
			dispatch(authenticate(token, userId, expirationTime));
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
