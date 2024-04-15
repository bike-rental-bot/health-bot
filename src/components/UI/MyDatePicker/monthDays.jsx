import { useEffect, useRef, useState } from 'react';
import WeekDays from './weekDays';
const MonthDays = ({
	monthDays,
	dateValue,
	setDateValue,
	dateValueMultiple,
	setDateValueMultiple,
	full,
	min,
	multiple = false,
}) => {
	const weekDaysRef = useRef(null);
	
	return (
		<div ref={weekDaysRef} className={`date-picker__week-days`}>
			{Array.isArray(monthDays) &&
				monthDays.map((el, i) => {
					return (
						<WeekDays
							key={i}
							el={el.days}
							show={full || el.select}
							dateValue={dateValue}
							setDateValue={setDateValue}
							dateValueMultiple={dateValueMultiple}
							setDateValueMultiple={setDateValueMultiple}
							min={min}
							multiple={multiple}
						/>
					);
				})}
		</div>
	);
};

export default MonthDays;
