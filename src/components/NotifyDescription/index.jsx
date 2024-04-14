import styles from './style.module.scss';
import linkIMG from '../../assets/images/tgImg.png';
import BoltSVG from '../Icons/Bolt';
import LinkPreview from '../UI/LinkPreview';
import ArrowSVG from '../Icons/Arrow';
import { useEffect, useState, useRef } from 'react';
import img from '../../assets/images/tgImg.png';
import ImageLoadPreview from '../ImageLoadPreview';

const regexLink = new RegExp(
	'^(https?:\\/\\/)?' + // Протокол (http:// или https://)
		'(?:www\\.)?telegra\\.ph' + // Доменное имя telegra.ph
		'(\\/[\\w\\d-._~%]*)*' + // Путь
		'(\\?[;&=a-z\\d%_.~+-]*)?' + // Query string
		'(#[a-z\\d-._~]*)?$', // Anchor ссылка
	'i',
);

const WebApp = window.Telegram.WebApp;

const NotifyDescription = ({
	title,
	time,
	tgLinkHeader,
	description,
	preview_url,
	attachments,
	type = 'food',
	fullFillClick,
	closeClick,
	is_completed,
}) => {
	const [metaData, setMetaData] = useState(null);

	useEffect(() => {
		if (regexLink.test(preview_url)) {
			fetch(`https://impulsrent.ru:8203/api/notify/getTelegraphData?url=${preview_url}`)
				.then((res) => res.json())
				.then((res) => {
					setMetaData(res);
				})
				.catch((err) => {
					setMetaData(null);
				});
		}
	}, []);

	const [stateBlocks, setStateBlocks] = useState({ text: false, attachment: false });

	const textRef = useRef(null);
	const attachmentRef = useRef(null);

	useEffect(() => {
		if (stateBlocks.text) {
			if (textRef.current) {
				textRef.current.style.height = `${textRef.current.scrollHeight}px`;
				textRef.current.style.margin = ``;
			}
		} else {
			if (textRef.current) {
				textRef.current.style.height = `0px`;
				textRef.current.style.margin = `0px`;
			}
		}

		if (stateBlocks.attachment) {
			if (attachmentRef.current) {
				attachmentRef.current.style.height = `${attachmentRef.current.scrollHeight}px`;
				attachmentRef.current.style.margin = ``;
			}
		} else {
			if (attachmentRef.current) {
				attachmentRef.current.style.height = `0px`;
				attachmentRef.current.style.margin = `0px`;
			}
		}
	}, [stateBlocks]);

	return (
		<div className={styles.superContainer}>
			<div className={`container ${styles.container}`}>
				<div className={`${styles.notify}`}>
					<div>{title}</div>
					<div>{time}</div>
				</div>

				<div className={`${styles.info} ${styles[type]}`}>
					<div className={styles.block}>
						<button onClick={() => setStateBlocks({ ...stateBlocks, text: !stateBlocks.text })}>
							Текст{' '}
							<ArrowSVG className={stateBlocks.text && styles.active} width={20} height={20} />
						</button>

						<div className={styles.infoBlock} ref={textRef}>
							{description}
						</div>
					</div>

					<div className={styles.block}>
						<button
							onClick={() =>
								setStateBlocks({ ...stateBlocks, attachment: !stateBlocks.attachment })
							}>
							Вложение{' '}
							<ArrowSVG
								className={stateBlocks.attachment && styles.active}
								width={20}
								height={20}
							/>
						</button>

						<div className={styles.infoBlock} ref={attachmentRef}>
							{metaData ? (
								<LinkPreview
									className={styles.linkPreview}
									type={type}
									image={metaData?.image}
									href={preview_url}
									title={metaData?.title}
									siteName={'Telegraph'}
								/>
							) : (
								<div
									onClick={() => {
										WebApp.openLink(preview_url, { try_instant_view: true });
									}}
									className={styles.link}>
									{preview_url}
								</div>
							)}

							<div className={styles.imgList}>
								{attachments.map((el) => {
									return <ImageLoadPreview src={el} key={el} />;
								})}
							</div>
						</div>
					</div>
				</div>

				{
					<button
						onClick={() => {
							if (typeof fullFillClick === 'function') fullFillClick();
						}}
						className={`${styles.fullFillBtn} ${styles[type]} ${is_completed && styles.completed}`}>
						<span>{is_completed ? 'Исполнено' : 'Исполнить'}</span>
					</button>
				}

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
