import { Swiper, SwiperSlide } from 'swiper/react';
import { useEffect, useRef, useState } from 'react';
import { Virtual, Mousewheel, FreeMode } from 'swiper/modules';
import useDebounce from '../../../hooks/useDebounce';
import DatePicker from 'react-mobile-datepicker';
import TimePicker from './index';
import React from 'react';
import './style.scss';

const dateConfig = {
	hour: {
		format: 'hh',
		step: 1,
	},
	minute: {
		format: 'mm',
		step: 5,
	},
};

const startDate = () => {
	let DateWithTime;

	const currentDate = new Date();
	const currentMinutes = currentDate.getMinutes();

	if (currentMinutes % 5 !== 0) {
		const diff = 5 - (currentMinutes % 5);
		const newDate = new Date(currentDate.getTime() + diff * 60000); // Добавляем минуты для деления на 5

		DateWithTime = newDate;

		return DateWithTime;
	}

	return currentDate;
};

const TimePick = ({ onChange }) => {
	const [dateWithTime, setDateWithTime] = useState();

	useEffect(() => {
		if (typeof onChange === 'function') {
			const obj = {
				hours: startDate().getHours(),
				minutes: startDate().getMinutes(),
			};

			setDateWithTime(startDate())

			onChange(obj);
		}
	}, []);

	return (
		<>
			<DatePicker
				onChange={(e) => {
					const obj = {
						hours: e.getHours(),
						minutes: e.getMinutes(),
					};

					if (typeof onChange === 'function') onChange(obj);

					setDateWithTime(e);
				}}
				theme={'ios'}
				value={dateWithTime}
				showCaption={false}
				showFooter={false}
				showHeader={false}
				dateConfig={dateConfig}
				isOpen={true}
				isPopup={false}
			/>
		</>
	);
};
export default TimePick;
