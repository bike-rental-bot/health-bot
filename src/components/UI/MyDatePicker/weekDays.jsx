import { useEffect } from 'react';
import './styles.scss';
const WeekDays = ({ el, dateValue, setDateValue, show, min }) => {
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
						onClick={() => {
							const date = new Date(
								el1.value.getFullYear(),
								el1.value.getMonth(),
								el1.value.getDate(),
								dateValue.getHours(),
								dateValue.getMinutes(),
							);

							console.log('dateValue', dateValue);

							if (!min) {
								setDateValue(date);
							} else {
								if (
									new Date(min.getFullYear(), min.getMonth(), min.getDate()).getTime() <=
									el1.value.getTime()
								) {
									setDateValue(date);
								}
							}
						}}
						className={`date-picker__day ${el1.className} ${
							dateIsSelected(el1, dateValue) ? 'date-picker__day-selected' : ''
						} ${
							min &&
							new Date(min.getFullYear(), min.getMonth(), min.getDate()).getTime() >
								el1.value.getTime() &&
							'disabled-dates'
						}`}>
						{el1.value.getDate()}
					</span>
				);
			})}
		</div>
	);
};

export default WeekDays;
