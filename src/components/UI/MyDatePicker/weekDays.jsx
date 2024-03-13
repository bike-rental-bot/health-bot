import { useEffect } from 'react';
import './styles.scss';
const WeekDays = ({ transitionFull, el, dateValue, setDateValue }) => {
	useEffect(() => {
		console.log('evfdw');
	}, [dateValue]);
	return (
		<div
			className={`date-picker__week ${!transitionFull ? 'app-date--from' : 'app-date--to'} ${
				transitionFull === null && 'start'
			}`}>
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
