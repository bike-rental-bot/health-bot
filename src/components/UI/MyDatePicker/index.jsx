import { useEffect, useState, useRef } from 'react';
import ArrowSVG from '../../Icons/Arrow';
import styles from './styles.module.scss';
import './styles.scss';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import WeekDays from './weekDays';

const MONTHS = [
	'Январь',
	'Февраль',
	'Март',
	'Апрель',
	'Май',
	'Июнь',
	'Июль',
	'Август',
	'Сентябрь',
	'Октябрь',
	'Ноябрь',
	'Декабрь',
];

const DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

const getAmountDaysInMonth = (year, month) => {
	return new Date(year, month + 1, 0).getDate();
};

const getPrevMonthDays = (year, month) => {
	const days = [];
	let date = new Date(year, month, 1);
	if (date.getDay() === 0) {
		date = new Date(date.setMonth(date.getMonth() - 1));
		const amountDays = getAmountDaysInMonth(date.getFullYear(), date.getMonth());
		for (let i = 5; i >= 0; i--) {
			let el = {
				value: new Date(date.getFullYear(), date.getMonth(), amountDays - i),
				className: 'date-picker__prev-month',
			};
			days.push(el);
		}
	} else {
		const dayOfWeek = date.getDay();
		date = new Date(date.setMonth(date.getMonth() - 1));
		const amountDays = getAmountDaysInMonth(date.getFullYear(), date.getMonth());
		for (let i = dayOfWeek - 2; i >= 0; i--) {
			let el = {
				value: new Date(date.getFullYear(), date.getMonth(), amountDays - i),
				className: 'date-picker__prev-month',
			};
			days.push(el);
		}
	}

	return days;
};

const getMonthDays = (year, month) => {
	let days = [];
	for (let i = 1; i <= getAmountDaysInMonth(year, month); i++) {
		const el = {
			value: new Date(year, month, i),
			className: 'date-picker__current-month',
		};
		days.push(el);
	}

	days = [...getPrevMonthDays(year, month), ...days, ...getNextMonthDays(year, month)];

	let chunks = [];

	for (let i = 0; i < days.length; i += 7) {
		chunks.push(days.slice(i, i + 7));
	}

	let arr = [];

	if (chunks.length === 5) {
		for (let i = 1; i <= 7; i++) {
			let date = new Date(chunks[chunks.length - 1][6].value);
			let el = {
				value: new Date(date.getFullYear(), date.getMonth(), date.getDate() + i),
				className: 'date-picker__next-month',
			};
			arr.push(el);
		}

		chunks.push(arr);
	}

	return chunks;
};

const getNextMonthDays = (year, month) => {
	const days = [];
	let date = new Date(year, month, 1);
	date = new Date(date.setMonth(date.getMonth() + 1));
	date = new Date(date.getFullYear(), date.getMonth(), 1);

	const dayOfWeek = date.getDay();

	if (dayOfWeek === 0) {
		let el = {
			value: date,
			className: 'date-picker__next-month',
		};
		days.push(el);
		return days;
	} else {
		for (let i = 0; i <= 7 - dayOfWeek; i++) {
			let el = {
				value: new Date(date.getFullYear(), date.getMonth(), 1 + i),
				className: 'date-picker__next-month',
			};
			days.push(el);
		}
		return days;
	}
};

const twoWeeksMonthDays = (year, month, currentDateValue) => {
	function getDates(date) {
		let days = [];
		let dayOfWeek = date.getDay();

		if (dayOfWeek === 0) {
			for (let i = 6; i > 0; i--) {
				let dayDate = new Date(date.getTime() - i * 24 * 60 * 60 * 1000);
				let el = {
					value: dayDate,
					className:
						date.getMonth() === dayDate.getMonth()
							? 'date-picker__prev-day'
							: 'date-picker__prev-month',
				};
				days.push(el);
			}

			for (let i = 0; i <= 7; i++) {
				let dayDate = new Date(date.getTime() + i * 24 * 60 * 60 * 1000);
				let el = {
					value: dayDate,
					className:
						date.getMonth() === dayDate.getMonth()
							? 'date-picker__current-month'
							: 'date-picker__next-month',
				};

				days.push(el);
			}
		} else {
			for (let i = dayOfWeek - 1; i > 0; i--) {
				let dayDate = new Date(date.getTime() - i * 24 * 60 * 60 * 1000);
				let el = {
					value: dayDate,
					className:
						date.getMonth() === dayDate.getMonth()
							? 'date-picker__prev-day'
							: 'date-picker__prev-month',
				};
				days.push(el);
			}

			for (let i = 0; i <= 14 - dayOfWeek; i++) {
				let dayDate = new Date(date.getTime() + i * 24 * 60 * 60 * 1000);
				let el = {
					value: dayDate,
					className:
						date.getMonth() === dayDate.getMonth()
							? 'date-picker__current-month'
							: 'date-picker__next-month',
				};

				days.push(el);
			}
		}

		let chunks = [];

		for (let i = 0; i < days.length; i += 7) {
			chunks.push(days.slice(i, i + 7));
		}

		return chunks;
	}

	if (year == new Date().getFullYear() && month == new Date().getMonth()) {
		return getDates(
			currentDateValue
				? new Date(
						currentDateValue.getFullYear(),
						currentDateValue.getMonth(),
						currentDateValue.getDate(),
				  )
				: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
		);
	} else {
		return getDates(new Date(year, month, 1));
	}
};

const MyDatePicker = ({ value, onChange }) => {
	const [full, setFull] = useState(false);
	const [dateValue, setDateValue] = useState(value);
	const [transitionFull, setTransitionFull] = useState(null);
	const [currentMonth, setCurrentMonth] = useState({
		month: value ? value.getMonth() : new Date().getMonth(),
		year: value ? value.getFullYear() : new Date().getFullYear(),
	});

	const [monthDays, setMonthDays] = useState(
		twoWeeksMonthDays(currentMonth.year, currentMonth.month),
	);

	const weekDaysRef = useRef(null);

	const handlePrevMonth = () => {
		setCurrentMonth((prev) => ({
			month: prev.month === 0 ? 11 : prev.month - 1,
			year: prev.month === 0 ? prev.year - 1 : prev.year,
		}));

		if (full) {
			setMonthDays(
				getMonthDays(
					currentMonth.month === 0 ? currentMonth.year - 1 : currentMonth.year,
					currentMonth.month === 0 ? 11 : currentMonth.month - 1,
				),
			);
		} else {
			setMonthDays(
				twoWeeksMonthDays(
					currentMonth.month === 0 ? currentMonth.year - 1 : currentMonth.year,
					currentMonth.month === 0 ? 11 : currentMonth.month - 1,
				),
			);
		}
	};

	const handleNextMonth = () => {
		setCurrentMonth((prev) => ({
			month: prev.month === 11 ? 0 : prev.month + 1,
			year: prev.month === 11 ? prev.year + 1 : prev.year,
		}));

		if (full) {
			setMonthDays(
				getMonthDays(
					currentMonth.month === 11 ? currentMonth.year + 1 : currentMonth.year,
					currentMonth.month === 11 ? 0 : currentMonth.month + 1,
				),
			);
		} else {
			setMonthDays(
				twoWeeksMonthDays(
					currentMonth.month === 11 ? currentMonth.year + 1 : currentMonth.year,
					currentMonth.month === 11 ? 0 : currentMonth.month + 1,
				),
			);
		}
	};

	const fullBtnClick = () => {
		setFull(!full);

		if (!full) {
			setMonthDays(getMonthDays(currentMonth.year, currentMonth.month));

			setTransitionFull(false);

			requestAnimationFrame(() => {
				setTransitionFull(true);
			});
		} else {
			setMonthDays(twoWeeksMonthDays(currentMonth.year, currentMonth.month));
		}
	};

	useEffect(() => {
		if (typeof onChange === 'function') {
			onChange(dateValue);
		}
	}, [dateValue]);

	return (
		<div className={styles.container}>
			<div className={styles.panelMonth}>
				<span>
					{MONTHS[currentMonth.month]} {currentMonth.year}
				</span>

				<div>
					<button key={'btnPrev'} onClick={handlePrevMonth}>
						<ArrowSVG style={{ transform: 'rotate(90deg)' }} />
					</button>
					<button key={'btnNext'} onClick={handleNextMonth}>
						<ArrowSVG style={{ transform: 'rotate(-90deg)' }} />
					</button>
				</div>
			</div>

			<div className={styles.weekDays}>
				{DAYS.map((el) => (
					<span>{el}</span>
				))}
			</div>

			<div style={{ width: '100%', position: 'relative', overflow: 'hidden' }}>
				<div ref={weekDaysRef} className="date-picker__week-days">
					{monthDays.map((el, i) => {
						return (
							<WeekDays
								key={i}
								el={el}
								dateValue={dateValue}
								setDateValue={setDateValue}
								transitionFull={transitionFull}
							/>
						);
					})}
				</div>
			</div>

			<button className={styles.fullBtn} onClick={fullBtnClick}>
				<ArrowSVG active={full} />
			</button>
		</div>
	);
};

export default MyDatePicker;
