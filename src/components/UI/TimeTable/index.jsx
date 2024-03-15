import styles from './style.module.scss';

import ArrowSVG from '../../Icons/Arrow';
import { useState, useRef, useEffect } from 'react';
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

const TimeTable = ({ date, timetableRef, full, setFull, resizeFunction }) => {
	const fullBtnClick = () => {
		setFull(!full);

		if (!full) {
			contRef.current.style.transition = `0.5s`;
			contRef.current.style.height = `${contRef.current.scrollHeight}px`;
		} else {
			contRef.current.style.height = `209px`;
			contRef.current.style.transition = `0.5s`;
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

	return (
		<>
			{' '}
			<div
				onTransitionEnd={() => {
					console.log('1');
				}}
				ref={timetableRef}>
				<div className={styles.header}>
					<span>
						{`${DAYS[date.getDay()]}, ${date.getDate()}
					${MONTHS[date.getMonth()]}`}
					</span>

					<div className={styles.btns}>
						<button key={'btnPrev'}>
							<ArrowSVG style={{ transform: 'rotate(90deg)' }} />
						</button>
						<button key={'btnNext'}>
							<ArrowSVG style={{ transform: 'rotate(-90deg)' }} />
						</button>
					</div>
				</div>
				<div ref={contRef} className={styles.container}>
					<div className={styles.time}>
						<span>8:00</span>

						<div className={styles.activitiesList}></div>
					</div>

					<div className={styles.time}>
						<span>9:00</span>

						<div className={styles.activitiesList}>
							<div className={`${styles.activity} ${styles.food}`}>Завтрак</div>
							<div className={`${styles.activity} ${styles.drugs}`}>Медикаменты</div>
							<div className={`${styles.activity} ${styles.act}`}>Прогулка</div>
						</div>
					</div>

					<div className={styles.time}>
						<span>10:00</span>

						<div className={styles.activitiesList}>
							<div className={`${styles.activity} ${styles.act}`}>Прогулка</div>
						</div>
					</div>

					<div className={styles.time}>
						<span>10:00</span>

						<div className={styles.activitiesList}></div>
					</div>

					<div className={styles.time}>
						<span>10:00</span>

						<div className={styles.activitiesList}>
							<div className={`${styles.activity} ${styles.act}`}>Прогулка</div>
						</div>
					</div>

					<div className={styles.time}>
						<span>10:00</span>

						<div className={styles.activitiesList}></div>
					</div>

					<div className={styles.time}>
						<span>10:00</span>

						<div className={styles.activitiesList}></div>
					</div>
				</div>

				<button className={styles.fullBtn} onClick={fullBtnClick}>
					<ArrowSVG active={full} />
				</button>
			</div>
		</>
	);
};

export default TimeTable;
