import { useEffect, useState, useRef } from 'react';
import styles from './styles.module.scss';
import img from '../../../assets/images/tgImg.png';
import ArrowSVG from '../../Icons/Arrow';

const TYPESMAP = {
	food: 'nutrition',
	drugs: 'preparations',
	activity: 'day_regime',
};

const AdminEventItem = ({
	type = 'food',
	description,
	images = [],
	title = 'Завтрак',
	time = '8:00',
	preview_url,
	copyClick,
}) => {
	const [isHidden, setIsHidden] = useState(true);
	const infoRef = useRef();
	const contRef = useRef();

	useEffect(() => {
		infoRef.current.style.transition = 'height 0.25s ease-in-out, opacity 0.25s linear, padding 0s';
		if (isHidden) {
			infoRef.current.style.height = '0';
		} else {
			infoRef.current.style.height = `${infoRef.current.scrollHeight}px`;
		}
	}, [isHidden]);

	return (
		<div
			ref={contRef}
			onClick={() => {
				setIsHidden(!isHidden);
				contRef.current.blur();
			}}
			className={`${styles.container} ${styles[type]}`}>
			<div className={`${styles.header} ${styles[type]} ${!isHidden && styles.open}`}>
				{isHidden ? (
					<div className={`${styles.hidden} ${styles[type]}`}>
						<p>{title}</p> <p>{time}</p>
					</div>
				) : (
					<div className={`${styles.notHidden} ${styles[type]}`}>
						<div>
							<button
								type={'button'}
								onClick={(e) => {
									if (typeof copyClick === 'function')
										copyClick({
											title,
											description,
											preview_url,
											attachments: images,
											type: TYPESMAP[type],
										});
									e.stopPropagation();
								}}
								className={styles.copyBtn}>
								Копировать
							</button>
						</div>

						<div className={styles.textHeader}>
							<p>{title}</p>
							<p>{time}</p>
						</div>

						<div>
							<ArrowSVG stroke={'white'} />
						</div>
					</div>
				)}
			</div>

			<div ref={infoRef} className={`${styles.info} ${styles[type]} ${!isHidden && styles.open}`}>
				<div className={styles.text}>
					<p>{description}</p>
				</div>

				<div className={styles.imgBlock}>
					{Array.isArray(images) &&
						images.map((el, index) => {
							return (
								<div key={`${el} ${index}`}>
									<img src={el} alt={el} />
								</div>
							);
						})}
				</div>
			</div>
		</div>
	);
};

export default AdminEventItem;
