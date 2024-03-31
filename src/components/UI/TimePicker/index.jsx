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
		step: 1,
	},
};

const TimePick = () => {
	return (
		<>
			<DatePicker
				theme={'ios'}
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
