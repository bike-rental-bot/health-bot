import styles from './style.module.scss';
import { useSelector } from 'react-redux';
import loader from '../../../assets/images/loader.svg';

function addLeadingZero(num) {
	return num < 10 ? '0' + num : num;
}
const Table = ({ data, containerRef }) => {
	const { loading } = useSelector((state) => state.client);

	console.log('table', loading)

	return (
		<div className={'container'}>
			<div ref={containerRef} className={styles.container}>
				{loading ? (
					<div
						style={{
							height: '100%',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							width: '100%',
						}}>
						<img src={loader} alt="loader" width={32} height={32} />
					</div>
				) : (
					<>
						{data &&
							Object.keys(data).map((el) => {
								return (
									<div key={el.title} className={styles.time}>
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
					</>
				)}
			</div>
		</div>
	);
};

export default Table;
