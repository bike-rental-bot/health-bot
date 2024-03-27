import { useEffect } from 'react';
import './styles.scss';
const WeekDays = ({ el, dateValue, setDateValue, show }) => {
	const dateIsSelected = (el1, dateValue) => {
		return (
			el1.value.getDate() === dateValue?.getDate() &&
			el1.value.getMonth() === dateValue?.getMonth() &&
			el1.value.getFullYear() === dateValue?.getFullYear()
		);
	};
	return (
		<div className={`${show ? 'date-picker__week--show' : 'date-picker__week'}`}>
			{el.map((el1) => {
				return (
					<span
						key={`${el1.value.getDate()}`}
						onClick={() => setDateValue(el1.value)}
						className={`date-picker__day ${el1.className} ${
							dateIsSelected(el1, dateValue) ? 'date-picker__day-selected' : ''
						}`}>
						{el1.value.getDate()}
					</span>
				);
			})}
		</div>
	);
};

export default WeekDays;
