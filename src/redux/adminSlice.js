import { createSlice } from '@reduxjs/toolkit';

const adminState = {
	isTextFieldsClose: true,
	focusTextField: false,
	formState: {
		type: 'nutrition',
		title: '',
		description: '',
		preview_url: '',
		time: null,
		end_date: null,
	},
	patients: [],
};

export const adminSlice = createSlice({
	name: 'admin',
	initialState: adminState,
	reducers: {
		setFieldsState: (state, action) => {
			state.isTextFieldsClose = action.payload;
		},
		setFocusTextField: (state, action) => {
			state.focusTextField = action.payload;
		},
		setFormState: (state, action) => {
			state.formState = { ...action.payload };
		},
		setPatients: (state, action) => {
			state.patients = action.payload;
		},
	},
});

// Action creators are generated for each case reducer function
export const { setFieldsState, setFocusTextField, setFormState, setPatients } = adminSlice.actions;

export default adminSlice.reducer;
