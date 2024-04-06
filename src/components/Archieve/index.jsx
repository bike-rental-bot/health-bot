
import AdminEventItem from '../UI/AdminEventItem';
import styles from './styles.module.scss';
import { useState } from 'react';


const Archieve = () => {

	return (
		<div className="container">

			{<h3 className={styles.recent}>Недавние</h3>}

			<div className={styles.events}>
				<AdminEventItem type={'food'} />

				<AdminEventItem type={'drugs'} />

				<AdminEventItem type={'activity'} />

				<AdminEventItem />
			</div>
		</div>
	);
};

export default Archieve;
