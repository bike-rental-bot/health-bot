import DeleteSVG from '../../Icons/Delete';
import styles from './styles.module.scss';
const DeleteButton = ({ className, onClick }) => {
	return (
		<button
		    type={'button'}
			onClick={() => {
				if (typeof onClick === 'function') onClick();
			}}
			className={styles.button}>
			<DeleteSVG />
		</button>
	);
};

export default DeleteButton;
