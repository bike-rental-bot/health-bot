import { createSlice } from '@reduxjs/toolkit';

const adminState = {
	isTextFieldsClose: true,
	focusTextField: false,
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
	},
});

// Action creators are generated for each case reducer function
export const { setFieldsState, setFocusTextField } = adminSlice.actions;

export default adminSlice.reducer;
