import ArrowLeft from './../../components/Icons/ArrowLeft';
import ArrowSVG from './../../components/Icons/Arrow';
import styles from './styles.module.scss';
import LinkPreview from './../../components/UI/LinkPreview/index';
import ImageLoadPreview from './../../components/ImageLoadPreview/index';
import { useEffect, useState } from 'react';
import { useRef } from 'react';
import { useSelector } from 'react-redux';
import { get } from '../../lib/api';
import { useNavigate } from 'react-router-dom';

const regexLink = new RegExp(
	'^(https?:\\/\\/)?' + // Протокол (http:// или https://)
		'(?:www\\.)?telegra\\.ph' + // Доменное имя telegra.ph
		'(\\/[\\w\\d-._~%]*)*' + // Путь
		'(\\?[;&=a-z\\d%_.~+-]*)?' + // Query string
		'(#[a-z\\d-._~]*)?$', // Anchor ссылка
	'i',
);

const COLORMAP = {
	food: '#ff8551',
	drugs: '#00c187',
	activity: '#9747ff',
};

const WebApp = window.Telegram.WebApp;
const NotifyPage = ({
	description,
	attachments,
	preview_url,
	title,
	time,
	id,
	type = 'food',
	is_completed,
}) => {
	const [stateBlocks, setStateBlocks] = useState({ text: true, attachment: true });
	const [metaData, setMetaData] = useState({ info: null, loading: true });
	const userToken = useSelector((state) => state.user.token);
	const role = useSelector((state) => state.user.user.role);
	const [completeClick, setCompleteClick] = useState(false);

	const textRef = useRef(null);
	const attachmentRef = useRef(null);
	const navigate = useNavigate();

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

	useEffect(() => {
		if (regexLink.test(preview_url)) {
			fetch(`https://impulsrent.ru:8203/api/notify/getTelegraphData?url=${preview_url}`)
				.then((res) => res.json())
				.then((res) => {
					const obj = {
						info: res,
						loading: false,
					};
					setMetaData(obj);
				})
				.catch((err) => {
					setMetaData({ info: null, loading: false });
				});
		} else {
			setMetaData({ info: null, loading: false });
		}
	}, [preview_url]);

	useEffect(() => {
		document.body.style.background = '#f6f6f6';
		WebApp.MainButton.setParams({
			text: is_completed ? 'Исполнено' : 'Исполнить',
			color: is_completed ? '#a9a9a9' : COLORMAP[type],
			textColor: 'white',
			isActive: true,
		}).show();

		const mainBtnClick = () => {
			if (role === 'user' && !is_completed && !completeClick) {
				get('/notify/completeNotify', { task_id: id, token: userToken }).then((res) => {
					console.log('complete', res);
					WebApp.MainButton.setParams({ text: 'Исполнено', color: '#a9a9a9' });
				});
			}
		};

		WebApp.onEvent('mainButtonClicked', mainBtnClick);

		return () => WebApp.offEvent('mainButtonClicked', mainBtnClick);
	}, []);
	return (
		<div className={`container ${styles.container}`}>
			<button
				onClick={() => {
					if (role === 'admin') navigate('/admin');
					if (role === 'user') navigate('/');
				}}
				className={styles.backBtn}>
				<ArrowSVG width={10} height={10} style={{ transform: 'rotate(90deg)' }} />{' '}
				<span>Назад</span>
			</button>

			<div className={`${styles.notify}`}>
				<div>{title}</div>
				<div>{time}</div>
			</div>

			<div className={`${styles.info} ${styles[type]}`}>
				<div className={styles.block}>
					<button onClick={() => setStateBlocks({ ...stateBlocks, text: !stateBlocks.text })}>
						Текст <ArrowSVG className={stateBlocks.text && styles.active} width={20} height={20} />
					</button>

					<div className={styles.infoBlock} ref={textRef}>
						{description}
					</div>
				</div>

				<div className={styles.block}>
					<button
						onClick={() => setStateBlocks({ ...stateBlocks, attachment: !stateBlocks.attachment })}>
						Вложение{' '}
						<ArrowSVG className={stateBlocks.attachment && styles.active} width={20} height={20} />
					</button>

					<div className={styles.infoBlock} ref={attachmentRef}>
						{!metaData.loading && (
							<>
								{' '}
								{metaData.info ? (
									<LinkPreview
										className={styles.linkPreview}
										type={type}
										href={preview_url}
										image={metaData?.info?.image}
										title={metaData?.info?.title}
										siteName={'Telegraph'}
									/>
								) : (
									<div
										onClick={() => WebApp.openLink(preview_url, { try_instant_view: true })}
										className={styles.link}>
										{preview_url}
									</div>
								)}
							</>
						)}

						<div className={styles.imgList}>
							{Array.isArray(attachments) &&
								attachments.map((el) => {
									return <ImageLoadPreview src={el} key={el} />;
								})}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default NotifyPage;
