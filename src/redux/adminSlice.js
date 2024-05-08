import { createSlice } from '@reduxjs/toolkit';

const adminState = {
	isTextFieldsClose: true,
	focusTextField: false,
	formState: {
		user_id: null,
		token: null,
		type: 'nutrition',
		title: '',
		description: '',
		preview_url: '',
		time: null,
		end_date: null,
	},
	formErrors: {
		user_selected: false,
		title_entered: false,
		text_entered: false,
		date_selected: false,
		time_selected: false,
	},
	patients: [],
	patientsEvents: {
		loading: false,
		error: false,
	},
	selectUserValue: null,
};

export const DATE_FORM_ERROR = 'DATE_FORM_ERROR';
export const TIME_FORM_ERROR = 'TIME_FORM_ERROR';
export const TITLE_FORM_ERROR = 'TITLE_FORM_ERROR';
export const TEXT_FORM_ERROR = 'TEXT_FORM_ERROR';
export const USER_FORM_ERROR = 'USER_FORM_ERROR';

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

		setFormErrors: (state, action) => {
			switch (action.payload.type) {
				case USER_FORM_ERROR:
					state.formErrors.user_selected = action.payload.value;
					return;
				case TITLE_FORM_ERROR:
					state.formErrors.title_entered = action.payload.value;
					return;
				case TEXT_FORM_ERROR:
					state.formErrors.text_entered = action.payload.value;
					return;
				case TIME_FORM_ERROR:
					state.formErrors.time_selected = action.payload.value;
					return;
				case DATE_FORM_ERROR:
					state.formErrors.date_selected = action.payload.value;
					return;
				default:
					return;
			}
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
	setFormErrors,
} = adminSlice.actions;

export default adminSlice.reducer;
