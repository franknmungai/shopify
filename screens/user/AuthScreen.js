import React, { useState, useReducer, useCallback, useEffect } from 'react';
import {
	Button,
	View,
	KeyboardAvoidingView,
	StyleSheet,
	TextInput,
	ActivityIndicator,
	Alert,
	ImageBackground
} from 'react-native';
import { useDispatch } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import Input from '../../components/UI/Input';
import Card from '../../components/shop/Card';
import Colors from '../../theme/Colors';
import { signUp, login } from '../../store/actions/authActions';

const formReducer = (state, action) => {
	switch (action.type) {
		case 'FORM_INPUT_UPDATE':
			const updatedInputValues = {
				...state.inputValues,
				[action.id]: action.value
			};
			const updatedValidities = {
				...state.inputValidities,
				[action.id]: action.isValid
			};

			const formIsValid = Object.values(updatedValidities).every(
				val => val === true
			);
			return {
				...state,
				inputValues: updatedInputValues,
				inputValidities: updatedValidities,
				formValidity: formIsValid
			};

		default:
			return {
				...state
			};
	}
};
const AuthScreen = props => {
	const dispatch = useDispatch();
	const [text, setText] = useState('');
	const [isSignup, setIsSignup] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState();

	const [formState, dispatchForm] = useReducer(formReducer, {
		inputValues: {
			email: '',
			password: ''
		},
		inputValidities: {
			email: false,
			password: false
		},
		formValidity: false
	});
	// Each input is managing its own state and sending values to the parent
	const inputChangeHandler = useCallback(
		(id, value, isValid) => {
			dispatchForm({
				type: 'FORM_INPUT_UPDATE',
				id,
				value,
				isValid
			});
		},
		[dispatchForm]
	);

	useEffect(() => {
		if (error) {
			Alert.alert('An error occurred', error, [{ text: 'Try Again' }]);
		}
	}, [error]);
	const authenticate = async () => {
		const { email, password } = formState.inputValues;

		let action;
		if (isSignup) {
			action = signUp(email, text); //dispatch the action creator
		} else {
			action = login(email, text);
		}
		setIsLoading(true);
		setError(null);
		try {
			await dispatch(action);
			props.navigation.navigate('Shop');
		} catch (err) {
			setError(err.message);
			setIsLoading(false);
		}
	};
	return (
		<KeyboardAvoidingView style={styles.screen}>
			<LinearGradient
				colors={[/*'#ffedff' '#ffe3ff'*/ '#fff', '#fff']}
				style={styles.gradient}
			>
				<ImageBackground
					source={require('../../assets/steps.png')}
					// style={{ width: '100%', height: '100%' }}
					style={styles.gradient}
				>
					<Card style={styles.authContainer}>
						<Input
							id="email"
							label="Email"
							keyboardType="email-address"
							required
							email
							autoCapitalize="none"
							errorText="Please provide a valid email address"
							// value={formState.inputValues.email}
							onInputChange={inputChangeHandler}
							placeholder="youremail@provider.com"
						/>

						<TextInput
							style={styles.password}
							value={text}
							onChangeText={text => setText(text)}
							secureTextEntry //password
						/>
						{/* <Text>{errors}</Text> */}
						{/* <Input
						id="password"
						label="Password"
						keyboardType="default"
						required
						autoCapitalize="none"
						errorText="Please provide a password"
						// value={formState.inputValues.password}
						onInputChange={inputChangeHandler} //id, value, isValid are passed by onInputChange when its called in the child
						secureTextEntry //for password fields
						minLength={5}
					/> */}
						<View style={styles.btnContainer}>
							{isLoading ? (
								<ActivityIndicator size="small" color={Colors.primary} />
							) : (
								<Button
									title={isSignup ? 'Sign Up' : 'Login'}
									onPress={authenticate}
									color={Colors.primary}
								/>
							)}
						</View>
						<View style={styles.btnContainer}>
							<Button
								title={`Switch to ${isSignup ? 'Login' : 'Sign Up'}`}
								onPress={() => {
									setIsSignup(prevState => !prevState);
								}}
								color={Colors.accent}
							/>
						</View>
					</Card>
				</ImageBackground>
			</LinearGradient>
		</KeyboardAvoidingView>
	);
};

export const screenOptions = {
	headerTitle: 'Authenticate'
};

const styles = StyleSheet.create({
	screen: {
		flex: 1
	},
	gradient: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		height: '100%'
	},
	authContainer: {
		width: '70%',
		// maxWidth: 400, //incase 80% is more than this
		// height: '60%',
		padding: 24
	},
	btnContainer: {
		marginTop: 8
	},
	password: {
		paddingHorizontal: 2,
		paddingVertical: 4,
		borderBottomColor: '#ccc',
		borderBottomWidth: 1,
		marginVertical: 20
	}
});

export default AuthScreen;
