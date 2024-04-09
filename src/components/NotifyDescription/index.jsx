import styles from './style.module.scss';
import linkIMG from '../../assets/images/tgImg.png';
import BoltSVG from '../Icons/Bolt';
import LinkPreview from '../UI/LinkPreview';
import { useEffect, useState } from 'react';

const regexLink = new RegExp(
	'^(https?:\\/\\/)?' + // Протокол (http:// или https://)
		'(?:www\\.)?telegra\\.ph' + // Доменное имя telegra.ph
		'(\\/[\\w\\d-._~%]*)*' + // Путь
		'(\\?[;&=a-z\\d%_.~+-]*)?' + // Query string
		'(#[a-z\\d-._~]*)?$', // Anchor ссылка
	'i',
);

const NotifyDescription = ({
	title,
	time,
	tgLinkHeader,
	attachment_url,
	type = 'food',
	fullFillClick,
	closeClick,
}) => {
	const [metaData, setMetaData] = useState(null);

	useEffect(() => {
		if (regexLink.test(attachment_url)) {
			fetch(`https://impulsrent.ru:8203/api/notify/getTelegraphData?url=${attachment_url}`)
				.then((res) => res.json())
				.then((res) => {
					setMetaData(res);
				})
				.catch((err) => {
					setMetaData(null);
				});
		}
	}, []);



	return (
		<div className={styles.superContainer}>
			<div className={styles.container}>
				<div className={`${styles.header} ${styles.block} ${styles[type]}`}>
					<p>{title}</p>
					<p>{time}</p>
				</div>

				{metaData && <LinkPreview image={metaData?.image} title={metaData?.title} type={type} href={attachment_url} siteName={'Telegraph'} />}

				<button
					onClick={() => {
						if (typeof fullFillClick === 'function') fullFillClick();
					}}
					className={`${styles.fullFillBtn} ${styles[type]}`}>
					<span>Исполнить</span>
				</button>

				<button
					onClick={() => {
						if (typeof closeClick === 'function') closeClick();
					}}
					className={`${styles.closeBtn} ${styles[type]}`}>
					Закрыть
				</button>
			</div>
		</div>
	);
};

export default NotifyDescription;
