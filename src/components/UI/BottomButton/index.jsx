import styles from './styles.module.scss';
const BottomButton = ({ children }) => {
	return (
		<div className={styles.container}>
			{children ? (
				children
			) : (
				<a href="https://t.me/olegin_m">
					<span>Задать вопрос</span>
				</a>
			)}
		</div>
	);
};

export default BottomButton
