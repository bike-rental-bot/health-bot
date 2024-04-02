import { createSlice } from '@reduxjs/toolkit';

const adminState = {
	isTextFieldsClose: true,
};

export const adminSlice = createSlice({
	name: 'admin',
	initialState: adminState,
	reducers: {
		setFieldsState: (state, action) => {
			state.isTextFieldsClose = action.payload;
		},
	},
});

// Action creators are generated for each case reducer function
export const { setFieldsState } = adminSlice.actions;

export default adminSlice.reducer;
