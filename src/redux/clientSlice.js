import { createSlice } from '@reduxjs/toolkit';

const clientState = {
	// '4.4.2024': {
	// 	listEvent: {
	// 		nutrition: [],
	// 		preparations: [],
	// 		day_regime: [],
	// 	},
	// 	hourListEvent: {
	// 		6: [],
	// 		12: [],
	// 	},
	// },
};

export const clientSlice = createSlice({
	name: 'client',
	initialState: clientState,
	reducers: {
		setListEvent: (state, action) => {
			let info = action.payload.info;
			if (action.payload.date && info) {
				let dateInfo = {
					hours: {},
					nutrition: [],
					preparations: [],
					day_regime: [],
				};
				for (let i = 0; i < info.length; i++) {
					let arrEl = info[i];

					let el = {
						description: arrEl.notify.description,
						title: arrEl.notify.description,
						type: arrEl.notify.type,
						attachment_url: arrEl.notify.type,
						is_completed: arrEl.is_completed,
						time: arrEl.time,
					};

					dateInfo[el.type]?.push(el);
					if (!dateInfo.hours[new Date(el.time).getHours()]) {
						dateInfo.hours[new Date(el.time).getHours()] = [el];
					} else {
						dateInfo.hours[new Date(el.time).getHours()].push(el);
					}
				}

				state[action.payload.date] = dateInfo;
			}
		},
	},
});

export const { setListEvent } = clientSlice.actions;

export default clientSlice.reducer;
