import SearchSVG from '../Icons/Search';
import styles from './styles.module.scss';
import { Link } from 'react-router-dom';

const HeaderAdmin = ({ onClickPreview, disabledBtn }) => {
	return (
		<div className={`${styles.container} container`}>
			<button
				type="button"
				onClick={() => {
					if (typeof onClickPreview === 'function') onClickPreview();
				}}
				className={styles.previewBtn}>
				Предпросмотр
			</button>

			<button
				disabled={disabledBtn}
				className={`${styles.createEventBtn} ${disabledBtn && styles.disabled}`}
				type={'submit'}>
				Создать
			</button>
		</div>
	);
};

export default HeaderAdmin;
