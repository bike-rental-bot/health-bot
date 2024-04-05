import styles from './style.module.scss';
import ArrowSVG from '../../Icons/Arrow';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useState, useRef, useEffect } from 'react';
import './slideDay.scss';
const MONTHS = [
	'января',
	'февраля',
	'марта',
	'апреля',
	'мая',
	'июня',
	'июля',
	'августа',
	'сентября',
	'октября',
	'ноября',
	'декабря',
];

const DAYS = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];

function addLeadingZero(num) {
	return num < 10 ? '0' + num : num;
}

const TimeTable = ({ curDate, setCurDate, timetableRef, full, setFull, resizeFunction, data }) => {
	const [slide, setSlide] = useState(null);
	const fullBtnClick = () => {
		setFull(!full);

		if (contRef && contRef.current) {
			if (!full) {
				contRef.current.style.transition = `0.5s`;
				contRef.current.style.height = `${contRef.current.scrollHeight}px`;
			} else {
				contRef.current.style.height = `209px`;
				contRef.current.style.transition = `0.5s`;
			}
		}
	};

	const contRef = useRef();

	useEffect(() => {
		const element = timetableRef.current;
		const resizeObserver = new ResizeObserver((entries) => {
			for (let entry of entries) {
				const target = entry.target;
				const width = target.clientWidth;
				const height = target.clientHeight;

				if (typeof resizeFunction === 'function')
					requestAnimationFrame(() => {
						resizeFunction(height);
					});
			}
		});

		if (element) {
			resizeObserver.observe(element);
		}

		return () => {
			if (element) {
				resizeObserver.unobserve(element);
			}
		};
	}, [resizeFunction]);

	const handlePrevMonth = () => {
		setSlide('prev');

		requestAnimationFrame(() => {
			let cD = new Date(curDate.getTime());

			cD.setDate(cD.getDate() - 1);

			setCurDate(cD);
		});
	};

	const handleNextMonth = () => {
		setSlide('next');

		requestAnimationFrame(() => {
			let cD = new Date(curDate.getTime());

			cD.setDate(cD.getDate() + 1);

			setCurDate(cD);
		});
	};

	return (
		<>
			<div ref={timetableRef}>
				<div className={styles.panelMonth}>
					<button onClick={handlePrevMonth} key={'btnPrev'}>
						<ArrowSVG style={{ transform: 'rotate(90deg)' }} />
					</button>

					<TransitionGroup>
						<CSSTransition
							key={`${curDate.getDate()}, ${MONTHS[curDate.getMonth()]}`}
							timeout={250}
							classNames={`slide-day-${slide}`}>
							<span className={'timetable-month'}>
								{DAYS[curDate.getDay()]}, {curDate.getDate()} {MONTHS[curDate.getMonth()]}
							</span>
						</CSSTransition>
					</TransitionGroup>

					<button onClick={handleNextMonth} key={'btnNext'}>
						<ArrowSVG style={{ transform: 'rotate(-90deg)' }} />
					</button>
				</div>

				{data && Object.keys(data).length > 0 && (
					<div className={'container'}>
						<div ref={contRef} className={styles.container}>
							{data &&
								Object.keys(data).map((el) => {
									return (
										<div key={el} className={styles.time}>
											<span>{addLeadingZero(el)}:00</span>

											<div className={styles.activitiesList}>
												{data[el].map((el1) => {
													return (
														<div
															key={el1}
															className={`${styles.activity} ${
																el1.type === 'nutrition' && styles.food
															} ${el1.type === 'preparations' && styles.drugs} ${
																el1.type === 'day_regime' && styles.act
															}`}>
															{el1.title}
														</div>
													);
												})}
											</div>
										</div>
									);
								})}
						</div>
					</div>
				)}

				<button className={styles.fullBtn} onClick={fullBtnClick}>
					<ArrowSVG active={full} />
				</button>
			</div>
		</>
	);
};

export default TimeTable;
