import { useEffect } from 'react';
import './styles.scss';
const WeekDays = ({
	el,
	dateValue,
	setDateValue,
	dateValueMultiple,
	setDateValueMultiple,
	show,
	min,
	multiple = false,
}) => {
	const dateIsSelected = (el1, dateValue) => {
		if (!multiple) {
			return (
				el1.value.getDate() === dateValue?.getDate() &&
				el1.value.getMonth() === dateValue?.getMonth() &&
				el1.value.getFullYear() === dateValue?.getFullYear()
			);
		} else {
			for (let i = 0; i < dateValueMultiple.length; i++) {
				if (
					el1.value.getDate() === dateValueMultiple[i]?.getDate() &&
					el1.value.getMonth() === dateValueMultiple[i]?.getMonth() &&
					el1.value.getFullYear() === dateValueMultiple[i]?.getFullYear()
				) {
					return true;
				}
			}

			return false;
		}
	};

	return (
		<div className={`${show ? 'date-picker__week--show' : 'date-picker__week'}`}>
			{el.map((el1) => {
				return (
					<span
						key={`${el1.value.getDate()}`}
						onClick={(e) => {
							e.stopPropagation();
							if (!multiple) {
								const date = new Date(
									el1.value.getFullYear(),
									el1.value.getMonth(),
									el1.value.getDate(),
									dateValue.getHours(),
									dateValue.getMinutes(),
								);

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
							} else {
								const date = new Date(
									el1.value.getFullYear(),
									el1.value.getMonth(),
									el1.value.getDate(),
									0,
									0,
								);

								if (!min) {
									let filterArr = dateValueMultiple.filter((a) => date.getTime() !== a.getTime());

									if (filterArr.length < dateValueMultiple.length) {
										setDateValueMultiple(filterArr.sort((a, b) => a.getTime() - b.getTime()));
									} else {
										setDateValueMultiple((prev) =>
											[...prev, date].sort((a, b) => {
												return a.getTime() - b.getTime();
											}),
										);
									}
								} else {
									if (
										new Date(min.getFullYear(), min.getMonth(), min.getDate()).getTime() <=
										el1.value.getTime()
									) {
										let filterArr = dateValueMultiple.filter((a) => date.getTime() !== a.getTime());

										if (filterArr.length < dateValueMultiple.length) {
											setDateValueMultiple(filterArr.sort((a, b) => a.getTime() - b.getTime()));
										} else {
											setDateValueMultiple((prev) =>
												[...prev, date].sort((a, b) => {
													return a.getTime() - b.getTime();
												}),
											);
										}
									}
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
