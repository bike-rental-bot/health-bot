import SearchSVG from '../Icons/Search';
import styles from './styles.module.scss';
import { Link } from 'react-router-dom';

const HeaderAdmin = ({ onClickPreview }) => {
	return (
		<div className={`${styles.container} container`}>
			<button 
			    
				type="button"
				onClick={() => {
					if (typeof onClickPreview === 'function') onClickPreview();
				}}
				className={styles.previewBtn}
				to={'/client'}>
				Предпросмотр
			</button>

			<button className={styles.createEventBtn} type={'submit'}>Создать</button>
		</div>
	);
};

export default HeaderAdmin;
