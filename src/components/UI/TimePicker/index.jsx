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

let DateWithTime;

const currentDate = new Date();
const currentMinutes = currentDate.getMinutes();

if (currentMinutes % 5 !== 0) {
	const diff = 5 - (currentMinutes % 5);
	const newDate = new Date(currentDate.getTime() + diff * 60000); // Добавляем минуты для деления на 5

	DateWithTime = newDate;
}

const TimePick = ({ onChange }) => {
	const [dateWithTime, setDateWithTime] = useState(DateWithTime);

	useEffect(() => {
		if (typeof onChange === 'function' && DateWithTime) {
			const obj = {
				hours: DateWithTime?.getHours(),
				minutes: DateWithTime?.getMinutes(),
			};

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
