import { useState, useRef, useEffect } from 'react';
import ArrowSVG from '../Icons/Arrow';
import styles from './styles.module.scss';
import ClipSVG from '../Icons/Clip';
import LinkPreview from './../UI/LinkPreview/index';
import { act } from 'react-dom/test-utils';
import TextField from '../UI/TextField';
import DeleteButton from '../UI/DeleteButton';
import ImageLoadPreview from '../ImageLoadPreview';
import { useDispatch } from 'react-redux';
import { setFocusTextField } from '../../redux/adminSlice.js';

const regexLink = new RegExp(
	'^(https?:\\/\\/)?' + // validate protocol
		'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // validate domain name
		'((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
		'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
		'(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
		'(\\#[-a-z\\d_]*)?$',
	'i',
);

const FocusTextField = {
	text: false,
	header: false,
};

const AdminTextEditor = ({ textForm, setTextForm }) => {
	const [activeAttachment, setActiveAttachment] = useState(false);
	const [activeHeader, setActiveHeader] = useState(false);
	const [activeText, setActiveText] = useState(false);
	const [focusTextFields, setFocusTextFields] = useState(FocusTextField);
	const [previewImages, setPreviewImages] = useState([]);
	const textareaRef = useRef(null);
	const [metaData, setMetaData] = useState(null);
	const dispatch = useDispatch();
	async function getMetaDataPage() {
		const url = 'https://www.youtube.com/watch?v=MzO-0IYkZMU';
		const data = await fetch(
			`https://api.linkpreview.net/?key=f1afcecf935f21a315617f1fe537a642&q=${url}`,
		);
		const res = await data.json();
		setMetaData(res);
	}

	const handleInputLink = (e) => {
		setTextForm({ ...textForm, link: e.target.value });

		if (regexLink.test(e.target.value)) {
			fetch(`https://impulsrent.ru:8203/api/notify/getTelegraphData?url=${e.target.value}`)
				.then((res) => res.json())
				.then((res) => console.log(res));
		}
	};

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

	useEffect(() => {
		getMetaDataPage();
	}, []);

	useEffect(() => {
		dispatch(setFocusTextField(focusTextFields.header || focusTextFields.text));
	}, [focusTextFields]);

	return (
		<>
			<div className={`${styles.container}`}>
				<TextField
					onChange={(value) => {
						setTextForm({ ...textForm, title: value });
					}}
					name={'Заголовок'}
					placeholder={'Введите заголовок'}
					isOpen={activeHeader}
					onChangeFull={(value) => setActiveHeader(value)}
					onFocus={() => {
						setFocusTextFields({ ...focusTextFields, header: true });
					}}
					onBlur={() => {
						setFocusTextFields({ ...focusTextFields, header: false });
					}}
					value={textForm.title}
				/>

				<TextField
					onChange={(value) => {
						setTextForm({ ...textForm, description: value });
					}}
					onChangeFull={(value) => setActiveText(value)}
					name={'Текст'}
					isOpen={activeText}
					placeholder={'Введите текст'}
					onFocus={() => {
						setFocusTextFields({ ...focusTextFields, text: true });
					}}
					onBlur={() => {
						setFocusTextFields({ ...focusTextFields, text: false });
					}}
					value={textForm.description}
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
								value={textForm.link}
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
