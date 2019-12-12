import React, { useReducer, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';

const inputReducer = (state, action) => {
	switch (action.type) {
		case 'INPUT_CHANGE':
			return {
				...state,
				value: action.value,
				isValid: action.isValid
			};

		case 'INPUT_BLUR':
			return {
				...state,
				isTouched: true
			};

		default:
			return state;
	}
};
const Input = props => {
	const {
		label,
		errorText,
		initialValue,
		isInitiallyValid,
		onInputChange,
		id
	} = props;
	const [inputState, dispatch] = useReducer(inputReducer, {
		//initial state
		value: initialValue ? initialValue : '',
		isValid: isInitiallyValid,
		isTouched: false
	});

	useEffect(() => {
		if (inputState.isTouched) {
			onInputChange(id, inputState.value, inputState.isValid); //pass data to parent component onBlur
			console.log({ id, value: inputState.value, isValid: inputState.isValid });
		}
	}, [inputState, onInputChange]); //runs when our input state changes
	const textChangeHandler = text => {
		const emailMatch = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\.\-]+)\.([a-zA-Z]{2,5})$/;

		let isValid = true;
		if (props.required && text.trim().length === 0) {
			isValid = false;
		}

		if (props.email && !emailMatch.test(text)) {
			isValid = false;
		}

		if (props.min !== null && +text < props.min) {
			isValid = false;
		}

		if (props.max !== null && +text > props.max) {
			isValid = false;
		}

		if (props.minLength !== null && text.length < props.minLength) {
			isValid = false;
		}

		dispatch({
			type: 'INPUT_CHANGE',
			value: text,
			isValid
		});
	};

	const onBlurHandler = () => {
		dispatch({
			type: 'INPUT_BLUR'
		});
	};
	return (
		<View style={styles.formGroup}>
			<Text style={styles.label}>{label}</Text>
			<TextInput
				{...props}
				style={styles.input}
				onChangeText={textChangeHandler}
				value={inputState.value}
				onEndEditing={() => {}}
				onSubmitEditing={() => {}}
				onBlur={onBlurHandler}
			/>
			{!inputState.isValid && inputState.isTouched && (
				<View style={styles.errorContainer}>
					<Text style={styles.errorText}>{errorText}</Text>
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	formGroup: {
		width: '100%'
	},
	label: {
		fontFamily: 'open-sans-bold',
		marginVertical: 4
	},
	input: {
		paddingHorizontal: 2,
		paddingVertical: 4,
		borderBottomColor: '#ccc',
		borderBottomWidth: 1
	},
	errorContainer: {
		marginVertical: 5
	},
	errorText: {
		color: '#DB4437',
		fontFamily: 'open-sans',
		fontSize: 13
	}
});

export default Input;
