import SearchSVG from '../Icons/Search';
import styles from './styles.module.scss';
import { Link } from 'react-router-dom';

const HeaderAdmin = ({ onClickCreateEvent, onClickPreview }) => {
	return (
		<div className={`${styles.container} container`}>
			<Link to={'/client'}>Предпросмотр</Link>

			<button
				onClick={() => {
					if (typeof onClickCreateEvent === 'function') {
						onClickCreateEvent();
					}
				}}>
				Создать
			</button>
		</div>
	);
};

export default HeaderAdmin;
