import SearchSVG from '../Icons/Search';
import styles from './styles.module.scss';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const HeaderAdmin = ({ onClickPreview, disabledBtn }) => {
	const photo = useSelector((state) => state.user.user.photo);

	console.log('photo', photo);

	return (
		<div className={`${styles.container} container`}>
			<div>
				<button
					type="button"
					onClick={() => {
						if (typeof onClickPreview === 'function') onClickPreview();
					}}
					className={styles.previewBtn}>
					Предпросмотр
				</button>
			</div>

			<div>
				<div>
					<img width={37} height={37} src={photo} />
				</div>
			</div>

			<div>
				<button
					disabled={disabledBtn}
					className={`${styles.createEventBtn} ${disabledBtn && styles.disabled}`}
					type={'submit'}>
					Создать
				</button>
			</div>
		</div>
	);
};

export default HeaderAdmin;
