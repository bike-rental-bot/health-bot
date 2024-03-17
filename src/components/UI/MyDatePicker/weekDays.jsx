import { useEffect } from 'react';
import './styles.scss';
const WeekDays = ({ el, dateValue, setDateValue, show }) => {
	return (
		<div className={`${show ? 'date-picker__week--show' : 'date-picker__week'}`}>
			{el.map((el1) => {
				return (
					<span
						key={`${el1.value.getDate()}`}
						onClick={() => setDateValue(el1.value)}
						className={`date-picker__day ${el1.className} ${
							el1.value.getTime() == dateValue?.getTime() ? 'date-picker__day-selected' : ''
						}`}>
						{el1.value.getDate()}
					</span>
				);
			})}
		</div>
	);
};

export default WeekDays;
