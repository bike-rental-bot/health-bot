import { useState, useRef, useEffect } from 'react';
import ArrowSVG from '../Icons/Arrow';
import styles from './styles.module.scss';
import ClipSVG from '../Icons/Clip';
import LinkPreview from './../UI/LinkPreview/index';
import { act } from 'react-dom/test-utils';
import TextField from '../UI/TextField';
import DeleteButton from '../UI/DeleteButton';
import ImageLoadPreview from '../ImageLoadPreview';

const regexLink = new RegExp(
	'^(https?:\\/\\/)?' + // validate protocol
		'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // validate domain name
		'((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
		'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
		'(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
		'(\\#[-a-z\\d_]*)?$',
	'i',
);

const AdminTextEditor = () => {
	const [activeAttachment, setActiveAttachment] = useState(false);
	const [textHeader, setTextHeader] = useState('');
	const [textValue, setTextValue] = useState('');
	const [textLink, setTextLink] = useState('');
	const [previewImages, setPreviewImages] = useState([]);
	const textareaRef = useRef(null);
	const [metaData, setMetaData] = useState(null);
	async function getMetaDataPage() {
		const url = 'https://www.youtube.com/watch?v=MzO-0IYkZMU';
		const data = await fetch(
			`https://api.linkpreview.net/?key=f1afcecf935f21a315617f1fe537a642&q=${url}`,
		);
		const res = await data.json();
		setMetaData(res);
	}

	useEffect(() => {
		getMetaDataPage();
	}, []);

	const promFunc = (file) => {
		const newPreviewImages = [...previewImages];
		const promise = new Promise((resolve, reject) => {
			if (file.type.startsWith('image/') || file.type === 'image/gif') {
				const reader = new FileReader();
				reader.readAsDataURL(file);
				reader.onload = () => {
					// newPreviewImages.push(reader.result);
					resolve(reader.result);
				};
			} else {
				reject('');
				return;
			}
		});

		return promise;
	};

	const handleFileChange = (event) => {
		const files = event.target.files;

		const newPreviewImages = [...previewImages];

		const promises = [];

		for (let i = 0; i < 3 - newPreviewImages.length && i < files.length; i++) {
			promises.push(promFunc(files[i]));
		}

		const arr = [...previewImages];

		Promise.all(promises).then((results) => {
			results.forEach((result, index) => {
				let el = {
					src: result,
					key: `${result} ${new Date().getTime()}`,
				};
				arr.push(el);

				setPreviewImages(arr);
			});
		});
	};

	const handleInputLink = (e) => {
		setTextLink(e.target.value);

		if (regexLink.test(e.target.value)) {
			console.log('true');

			fetch(`https://impulsrent.ru:8203/api/notify/getTelegraphData?url=${e.target.value}`)
				.then((res) => res.json())
				.then((res) => console.log(res));
		}
	};

	return (
		<>
			<div className={`${styles.container}`}>
				<TextField
					onChange={(value) => setTextHeader(value)}
					name={'Заголовок'}
					placeholder={'Введите заголовок'}
				/>

				<TextField
					onChange={(value) => setTextValue(value)}
					name={'Текст'}
					placeholder={'Введите текст'}
				/>
			</div>
			<div className={`${styles.textField} ${styles.attachment}`}>
				<button
					className={styles.attachmentBtn}
					onClick={() => {
						setActiveAttachment(!activeAttachment);
					}}>
					Вложение{' '}
					<ArrowSVG
						className={`${styles.arrow} ${activeAttachment && styles.active}`}
						width={19}
						height={19}
					/>
				</button>

				{activeAttachment && (
					<div className={styles.inputAttachment}>
						<label className={styles.inputFile}>
							<input
								onChange={handleFileChange}
								multiple={true}
								accept=".jpg, .jpeg, .png"
								type="file"
							/>
							<ClipSVG />
						</label>

						<label className={styles.inputText}>
							<input
								value={textLink}
								onChange={handleInputLink}
								placeholder="Вставьте ссылку или вложение"
								type="text"
							/>
						</label>
					</div>
				)}

				{activeAttachment && (
					<div className={styles.containerPreview}>
						<DeleteButton />

						<LinkPreview
							titleClassName={styles.linkPreviewTitle}
							title={metaData?.title}
							image={metaData?.image}
							style={{ marginTop: 10 }}
							href={'https://www.youtube.com/watch?v=MzO-0IYkZMU'}
						/>
					</div>
				)}

				{activeAttachment && previewImages.length > 0 && (
					<div className={styles.imageList}>
						{previewImages.map((el, index) => {
							return (
								<ImageLoadPreview
									clickDelete={(el) => {
										const arr = [...previewImages];
										arr.splice(index, 1);
										setPreviewImages(arr);
									}}
									key={el.key}
									src={el.src}
								/>
							);
						})}
					</div>
				)}
			</div>
		</>
	);
};

export default AdminTextEditor;