import { createSlice } from '@reduxjs/toolkit';

const adminState = {
	isTextFieldsClose: true,
	focusTextField: false,
	formState: {
		id: null,
		type: 'nutrition',
		title: '',
		description: '',
		preview_url: '',
		time: null,
		end_date: null,
	},
	patients: [],
	patientsEvents: {
		loading: false,
		error: false,
	},
	selectUserValue: null,
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
		setPatientsEvents: (state, action) => {
			if (action.payload) {
				const { token, date, result } = action.payload;

				if (token && date) {
					const updatedPatientsEvents = {
						...state.patientsEvents,
						[token]: {
							...state.patientsEvents[token],
							[date]: result,
						},
					};
					return {
						...state,
						patientsEvents: updatedPatientsEvents,
					};
				}
			}
			return state;
		},
		setPatientsEventsLoading: (state, action) => {
			state.patientsEvents.loading = action.payload;
		},
		setPatientsEventsError: (state, action) => {
			state.patientsEvents.loading = action.payload;
		},
		setSelectUserValue: (state, action) => {
			state.selectUserValue = action.payload;
		},
	},
});

// Action creators are generated for each case reducer function
export const {
	setFieldsState,
	setFocusTextField,
	setFormState,
	setPatients,
	setPatientsEvents,
	setPatientsEventsLoading,
	setPatientsEventsError,
	setSelectUserValue,
} = adminSlice.actions;

export default adminSlice.reducer;
