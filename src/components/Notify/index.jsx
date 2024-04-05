import BucketSVG from '../Icons/Bucket';
import DislikeSVG from '../Icons/Dislike';
import TickSVG from '../Icons/Tick';
import styles from './style.module.scss';
import Modal from '../UI/Modal';

import NotifyDescription from '../NotifyDescription';
import { useState } from 'react';

const Notify = ({ type = 'food', onClick, title, time, description }) => {
	const [modalActive, setModalActive] = useState(false);

	const closeModal = () => {
		setModalActive(false);
	};
	return (
		<>
			<div
				onClick={() => {
					setModalActive(true);
					if (typeof onClick === 'function') onClick();
				}}
				className={styles.container}>
				<div className={`${styles.header} ${styles[type]}`}>
					<span className={styles.name}>{title}</span>

					<span className={styles.time}>{time}</span>
				</div>

				<div className={styles.text}>{description}</div>

				<div className={styles.labelCont}>
					<label>
						<input type="checkbox" />
						<span>
							<TickSVG />
						</span>
					</label>
				</div>
			</div>
			<Modal active={modalActive}>
				<NotifyDescription title={title} type={type} closeClick={closeModal} />
			</Modal>
		</>
	);
};

export default Notify;
