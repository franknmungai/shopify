import React, { useEffect, useCallback, useReducer, useState } from 'react';
import {
	ScrollView,
	View,
	KeyboardAvoidingView,
	StyleSheet,
	Platform,
	Alert,
	ActivityIndicator
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import CustomHeaderButton from '../shop/UI/HeaderButton';
import {
	updateProduct,
	createProduct
} from '../../store/actions/productActions';
import Input from '../../components/UI/Input';
import Colors from '../../theme/Colors';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

//a reducer for useReducer. Receives the current state snapshot
const formReducer = (state, action) => {
	switch (action.type) {
		case FORM_INPUT_UPDATE: //store an input and validate it
			const updatedValues = {
				...state.inputValues,
				[action.input]: action.value
			};
			const updatedValidities = {
				...state.inputValidities,
				[action.input]: action.isValid
			};

			const formIsValid = Object.values(updatedValidities).every(
				val => val === true
			);
			return {
				...state,
				inputValues: updatedValues,
				inputValidities: updatedValidities,
				formValidity: formIsValid
			};
		default:
			return state;
	}
};
const EditProductScreen = props => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState();
	const prodId = props.navigation.getParam('productId');

	const editedProduct = useSelector(state =>
		state.products.userProducts.find(prod => prod.id === prodId)
	);

	const dispatch = useDispatch();
	//takes in a reducer and initial state
	const [formState, dispatchFormState] = useReducer(formReducer, {
		//initial state
		inputValues: {
			title: prodId ? editedProduct.title : '',
			description: prodId ? editedProduct.desc : '',
			imageUrl: prodId ? editedProduct.imageUrl : '',
			price: ''
		},
		inputValidities: {
			title: prodId ? true : false,
			description: prodId ? true : false,
			imageUrl: prodId ? true : false,
			price: prodId ? true : false
		},
		formValidity: prodId ? true : false
	});
	const submitHandler = useCallback(async () => {
		//useCallback ensures that the function isn't recreated everytime the component re-renders, hence avoid getting into an infinite loop

		if (!formState.formValidity) {
			return Alert.alert('Invalid input', 'Check Errors in the form', [
				{ style: 'default', text: 'Okay' }
			]);
		}
		const { title, description, imageUrl, price } = formState.inputValues;
		setIsLoading(true);
		setError(null);
		try {
			if (prodId) {
				await dispatch(updateProduct(prodId, title, description, imageUrl));
			} else {
				//create
				await dispatch(createProduct(title, description, imageUrl, +price));
			}
			props.navigation.goBack(); //navigate back to the previous screen
		} catch (err) {
			setError(err);
			setIsLoading(false);
		}
	}, [prodId, formState]); //this function needs to be recreated whenever the inputs change.
	useEffect(() => {
		//changing the props will cause the component to re-render, but useEffect will not be called since its dependencies have not changed
		props.navigation.setParams({ submit: submitHandler }); //passing this function from our component to the header buttons
	}, [submitHandler]);

	const inputChangeHandler = useCallback(
		(inputField, value, validity) => {
			//dispatch action
			dispatchFormState({
				type: FORM_INPUT_UPDATE,
				value,
				isValid: validity,
				input: inputField
			});
		},
		[dispatchFormState]
	);

	if (isLoading) {
		return (
			<View style={styles.centered}>
				<ActivityIndicator size="large" color={Colors.primary} />
			</View>
		);
	}
	if (error) {
		Alert.alert('Error', 'An error occurred', [{ text: 'Try again' }]);
	}
	return (
		<KeyboardAvoidingView
			style={{ flex: 1 }} //necessary for the keyboard to reserve space
			behavior="padding" //add padding to fit content
			keyboardVerticalOffset={100}
		>
			<ScrollView>
				<View style={styles.form}>
					<Input
						label="Title"
						id="title"
						errorText="Enter a valid title"
						keyboardType="default"
						autoCapitalize="sentences"
						returnKeyType="next"
						onInputChange={inputChangeHandler} //the two parameters, value and valid are passed by the func
						initialValue={prodId ? editedProduct.title : ''}
						isInitiallyValid={prodId}
						required
					/>
					<Input
						label="Description"
						id="description"
						errorText="Enter a valid description"
						// multiline={true}
						// numberOfLines={3} //use on Android only
						keyboardType="default"
						autoCapitalize="sentences"
						returnKeyType="next"
						onInputChange={inputChangeHandler} //passing data through params
						initialValue={prodId ? editedProduct.desc : ''}
						isInitiallyValid={prodId}
						requiredminLength={5}
					/>
					<Input
						id="imageUrl"
						label="Image URL"
						errorText="Enter a valid image url"
						onInputChange={inputChangeHandler} //text is passed automatically
						initialValue={prodId ? editedProduct.imageUrl : ''}
						isInitiallyValid={prodId ? true : false}
						required
					/>

					{!prodId && (
						<Input
							label="Price"
							id="price"
							errorText="Enter a valid price"
							onInputChange={inputChangeHandler}
							keyboardType="decimal-pad"
							required
							// min={0.1}
						/>
					)}
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
};

export const screenOptions = navData => {
	const productId = navData.navigation.getParam('productId'); //if presnt, we are in edit state, otherwise, add state:
	const submitFn = navData.navigation.getParam('submit'); //passing a function as params
	return {
		headerTitle: productId ? 'Edit Product' : 'Add Product',
		headerRight: () => (
			<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
				<Item
					title="Save"
					iconName={
						Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'
					}
					onPress={submitFn}
				/>
			</HeaderButtons>
		)
	};
};
const styles = StyleSheet.create({
	form: {
		margin: 16
	},
	centered: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	}
});
export default EditProductScreen;
