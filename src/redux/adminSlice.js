import { createSlice } from '@reduxjs/toolkit';

const adminState = {
	isTextFieldsClose: true,
	focusTextField: false,
	formState: {
		type: 'nutrition',
		title: '',
		description: '',
		attachment_url: '',
		time: null,
		end_date: null,
	},
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
	},
});

// Action creators are generated for each case reducer function
export const { setFieldsState, setFocusTextField, setFormState } = adminSlice.actions;

export default adminSlice.reducer;
