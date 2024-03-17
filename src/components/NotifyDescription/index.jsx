import styles from './style.module.scss';
import linkIMG from '../../assets/images/tgImg.png';
import BoltSVG from '../Icons/Bolt';
const NotifyDescription = ({
	header,
	time,
	tgLinkHeader,
	img,
	tgLink,
	type = 'food',
	fullFillClick,
	closeClick,
}) => {
	return (
		<div className={styles.container}>
			<div className={`${styles.header} ${styles.block} ${styles[type]}`}>
				<p>Завтрак</p>
				<p>09:00</p>
			</div>

			<a
				href={'https://telegra.ph/fbdvscfas-03-15'}
				className={`${styles.block} ${styles.tgLink} ${styles[type]}`}>
				<div className={`${styles[type]} ${styles.siteName}`}>Telegraph</div>
				<p>Омлет с луком, морковью и цветной капустой </p>
				<div className={styles.img}>
					<img src={linkIMG} alt={'tgImg'} />
				</div>

				<div className={`${styles.watch} ${styles[type]} `}>
					<BoltSVG /> ПОСМОТРЕТЬ
				</div>
			</a>

			<button
				onClick={() => {
					if (typeof fullFillClick === 'function') fullFillClick();
				}}
				className={`${styles.fullFillBtn} ${styles[type]}`}>
				<span>Исполнить</span>
			</button>

			<button
				onClick={() => {
					if (typeof closeClick === 'function') closeClick();
				}}
				className={`${styles.closeBtn} ${styles[type]}`}>
				Закрыть
			</button>
		</div>
	);
};

export default NotifyDescription;
