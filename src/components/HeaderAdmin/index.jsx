import SearchSVG from '../Icons/Search';
import styles from './styles.module.scss';

const HeaderAdmin = ({ onClickCreateEvent, onClickPreview }) => {
	return (
		<div className={`${styles.container} container`}>
			<div>
				<button
					onClick={() => {
						if (typeof onClickSearch === 'function') onClickPreview();
					}}>
					Предварительный просмотр
				</button>
			</div>

			<h2>Новое событие</h2>

			<div>
				<button
					onClick={() => {
						if (typeof onClickCreateEvent === 'function') {
							onClickCreateEvent();
						}
					}}>
					Создать
				</button>
			</div>
		</div>
	);
};

export default HeaderAdmin;
