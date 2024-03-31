import styles from './styles.module.scss';
import TimeToggle from '../../components/TimeToggle';
import { useEffect, useRef } from 'react';
import NotifyToggle from '../../components/NotifyToggle';
import BottomButton from '../../components/UI/BottomButton';
import Modal from '../../components/UI/Modal';
import NotifyDescription from '../../components/NotifyDescription';

const MainPage = () => {
	return (
		<>
			<div className={styles.containerHeader}>
				<TimeToggle />
			</div>
			<NotifyToggle />
			<BottomButton />
		</>
	);
};

export default MainPage;
