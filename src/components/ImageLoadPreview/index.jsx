import styles from './styles.module.scss';
import DeleteButton from './../UI/DeleteButton/index';
const ImageLoadPreview = ({ src, clickDelete, alt }) => {
	return (
		<div className={styles.container}>
			<div className={styles.imgContainer}>
				<img src={src} alt={alt} />

				{clickDelete && <DeleteButton onClick={clickDelete} />}
			</div>
		</div>
	);
};

export default ImageLoadPreview;
