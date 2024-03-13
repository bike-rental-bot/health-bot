import styles from './style.module.scss';

import ArrowSVG from '../../Icons/Arrow';
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

const TimeTable = ({ date }) => {
	return (
		<>
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
			<div className={styles.container}>
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
		</>
	);
};

export default TimeTable;
