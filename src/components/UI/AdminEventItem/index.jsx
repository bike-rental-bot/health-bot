import { useState } from 'react';
import styles from './styles.module.scss';
import img from '../../../assets/images/tgImg.png';
import ArrowSVG from '../../Icons/Arrow';

const TEXT =
	'Текст текст текст Текст текст текст Текст текст текст Текст текст текст Текст текст текст Текст текст текст Текст текст текст Текст текст текст Текст текст текст Текст текст текст Текст текст текст Текст текст текст Текст текст текст Текст текст текст Текст текст текст Текст текст текст Текст текст текст Текст текст текст Текст текст текст Текст текст текст Текст текст текст Текст текст текст Текст текст текст Текст текст текст';

const copyText = (text) => {
	navigator.clipboard
		.writeText(text)
		.then(() => {
			console.log('Текст скопирован успешно:', text);
		})
		.catch((error) => {
			console.error('Ошибка при копировании текста:', error);
		});
};
const AdminEventItem = ({
	type = 'food',
	text = TEXT,
	images = [img, img],
	header = 'Завтрак',
	time = '8:00',
}) => {
	const [isHidden, setIsHidden] = useState(true);

	return (
		<div onClick={() => setIsHidden(!isHidden)} className={`${styles.container} ${styles[type]}`}>
			<div className={`${styles.header} ${styles[type]} ${!isHidden && styles.open}`}>
				{isHidden ? (
					<div className={`${styles.hidden} ${styles[type]}`}>
						<p>{header}</p> <p>{time}</p>
					</div>
				) : (
					<div className={`${styles.notHidden} ${styles[type]}`}>
						<button
							onClick={(e) => {
								copyText(text);
								e.stopPropagation();
							}}
							className={styles.copyBtn}>
							Копировать
						</button>
						<div className={styles.textHeader}>
							<p>{header}</p>
							<p>{time}</p>
						</div>

						<div>
							<ArrowSVG stroke={'white'} />
						</div>
					</div>
				)}
			</div>

			<div className={`${styles.info} ${styles[type]} ${!isHidden && styles.open}`}>
				<div className={styles.text}>
					<p>{text}</p>
				</div>

				<div className={styles.imgBlock}>
					{Array.isArray(images) &&
						images.map((el) => {
							return (
								<div>
									<img src={el} alt={'img'} />
								</div>
							);
						})}
				</div>
			</div>
		</div>
	);
};

export default AdminEventItem;
