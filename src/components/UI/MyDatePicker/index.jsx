import { useEffect, useState, useRef } from 'react';
import ArrowSVG from '../../Icons/Arrow';
import styles from './styles.module.scss';
import './styles.scss';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import WeekDays from './weekDays';
import Month from './month';
import MonthDays from './monthDays';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

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

function getWeekNumber(year, month, date) {
	const curMonth = date.getMonth();
	const curYear = date.getFullYear();

	if (month !== curMonth || year !== curYear) {
		return new Date(year, month, 1).getTime() > date.getTime() ? 1 : 6;
	} else {
		const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
		const dayOfWeekFirstDay = firstDayOfMonth.getDay();
		const offset = (dayOfWeekFirstDay + date.getDate() - 1) / 7;

		return Math.ceil(offset);
	}
}

const selectMonthDays = (year, month, currentDateValue, weekNumber) => {
	const days = getMonthDays(year, month, currentDateValue);
	weekNumber = weekNumber - 1;

	const curMonth = currentDateValue.getMonth();
	const curYear = currentDateValue.getFullYear();

	if (curMonth === month && curYear === year) {
		if (weekNumber === 0) {
			const value = days.map((el, index) => {
				return {
					select: index === 0 || index === 1,
					days: el,
				};
			});
			return value;
		}
		if (weekNumber >= 1 && weekNumber <= 4) {
			const value = days.map((el, index) => {
				return {
					select: weekNumber === index || weekNumber + 1 === index,
					days: el,
				};
			});
			return value;
		}

		const value = days.map((el, index) => {
			return {
				select: index === 4 || index === 5,
				days: el,
			};
		});
	} else {
		weekNumber = getWeekNumber(year, month, currentDateValue);

		if (weekNumber === 1) {
			const value = days.map((el, index) => {
				return {
					select: index === 0 || index === 1,
					days: el,
				};
			});

			return value;
		}

		if (weekNumber === 6) {
			const value = days.map((el, index) => {
				return {
					select: index === 4 || index === 5,
					days: el,
				};
			});

			return value;
		}
	}

	return [];
};

const MyDatePicker = ({ value, onChange, calendarRef, full, setFull }) => {
	const [dateValue, setDateValue] = useState(value);
	const [slide, setSlide] = useState(null);
	const [slideCal, setSlideCal] = useState(null);
	const weekDaysRef = useRef(null);
	const [currentMonth, setCurrentMonth] = useState({
		month: value ? value.getMonth() : new Date().getMonth(),
		year: value ? value.getFullYear() : new Date().getFullYear(),
	});

	const currentWeek = useRef(
		getWeekNumber(currentMonth.year, currentMonth.month, dateValue ? dateValue : new Date()),
	);

	const [monthDays, setMonthDays] = useState(
		selectMonthDays(
			currentMonth.year,
			currentMonth.month,
			dateValue ? dateValue : new Date(),
			currentWeek.current,
		),
	);

	const handlePrevMonth = () => {
		const prevMonth = { ...currentMonth };

		const addMonth = {
			month: prevMonth.month === 0 ? 11 : prevMonth.month - 1,
			year: prevMonth.month === 0 ? prevMonth.year - 1 : prevMonth.year,
		};

		setSlide('prev');

		requestAnimationFrame(() => {
			setCurrentMonth(addMonth);
		});

		const monthsDaysPrev = [...monthDays];

		setMonthDays((prev) =>
			selectMonthDays(
				addMonth.year,
				addMonth.month,
				dateValue ? dateValue : new Date(),
				currentWeek.current,
			),
		);
	};

	const handleNextMonth = () => {
		const prevMonth = { ...currentMonth };

		const addMonth = {
			month: prevMonth.month === 11 ? 0 : prevMonth.month + 1,
			year: prevMonth.month === 11 ? prevMonth.year + 1 : prevMonth.year,
		};

		setSlide('next');

		requestAnimationFrame(() => {
			setCurrentMonth(addMonth);
		});

		const monthsDaysPrev = [...monthDays];

		setMonthDays((prev) =>
			selectMonthDays(
				addMonth.year,
				addMonth.month,
				dateValue ? dateValue : new Date(),
				currentWeek.current,
			),
		);
	};

	const fullBtnClick = () => {
		setFull(!full);
		if (!full) {
			setMonthDays(
				selectMonthDays(
					currentMonth.year,
					currentMonth.month,
					dateValue ? dateValue : new Date(),
					currentWeek.current,
				),
			);
		} else {
			setMonthDays(
				selectMonthDays(
					currentMonth.year,
					currentMonth.month,
					dateValue ? dateValue : new Date(),
					currentWeek.current,
				),
			);
		}
	};

	useEffect(() => {
		if (typeof onChange === 'function') {
			onChange(dateValue);

			if (full) {
				currentWeek.current = getWeekNumber(
					currentMonth.year,
					currentMonth.month,
					dateValue ? dateValue : new Date(),
				);
			}
		}
	}, [dateValue]);

	return (
		<div ref={calendarRef} className={styles.container}>
			<div className={styles.panelMonth}>
				<button key={'btnPrev'} onClick={handlePrevMonth}>
					<ArrowSVG style={{ transform: 'rotate(90deg)' }} />
				</button>
				<div>
					<TransitionGroup>
						<CSSTransition
							key={`${MONTHS[currentMonth.month]} ${currentMonth.year}`}
							timeout={250}
							classNames={`slide-month-${slide}`}>
							<Month>
								{MONTHS[currentMonth.month]} {currentMonth.year}
							</Month>
						</CSSTransition>
					</TransitionGroup>
				</div>
				<button key={'btnNext'} onClick={handleNextMonth}>
					<ArrowSVG style={{ transform: 'rotate(-90deg)' }} />
				</button>
			</div>

			<div className="container">
				<div className={styles.weekDays}>
					{DAYS.map((el, i) => (
						<span key={i}>{el}</span>
					))}
				</div>

				<div
					style={{
						width: '100%',
						position: 'relative',
						overflow: 'hidden',
						height: full ? 240 : 80,
						transition: '0.5s',
					}}>
					<TransitionGroup>
						<CSSTransition
							key={monthDays[0].days[0].value.getTime()}
							timeout={500}
							classNames="slide">
							<MonthDays
								monthDays={monthDays}
								dateValue={dateValue}
								setDateValue={setDateValue}
								full={full}
							/>
						</CSSTransition>
					</TransitionGroup>
				</div>
			</div>

			<button className={styles.fullBtn} onClick={fullBtnClick}>
				<ArrowSVG active={full} />
			</button>
		</div>
	);
};

export default MyDatePicker;
