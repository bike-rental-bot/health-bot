import Select from './../UI/Select/index';
import img1 from '../../assets/images/tgUser1.png';
import img2 from '../../assets/images/tgUser2.png';
import img3 from '../../assets/images/tgUser3.png';
import AdminEventItem from '../UI/AdminEventItem';
import styles from './styles.module.scss';
import { useState } from 'react';

const variants = [
	{ id: 1, img: img1, name: 'Анастасия', nickname: '@nasty' },
	{ id: 2, img: img2, name: 'Леонид', nickname: '@lenya' },
	{ id: 3, img: img3, name: 'Александр', nickname: '@alex' },
];
const Archieve = () => {
	const [user, setUser] = useState(null);
	return (
		<div className="container">
			<Select onChange={(value) => setUser(value)} variants={variants} />

			{!user && <h3 className={styles.recent}>Недавние</h3>}

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
