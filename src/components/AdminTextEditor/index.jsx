import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import useDebounce from '../../hooks/useDebounce.js';
import { setFocusTextField } from '../../redux/adminSlice.js';
import ArrowSVG from '../Icons/Arrow';
import ClipSVG from '../Icons/Clip';
import ImageLoadPreview from '../ImageLoadPreview';
import DeleteButton from '../UI/DeleteButton';
import TextField from '../UI/TextField';
import LinkPreview from './../UI/LinkPreview/index';
import styles from './styles.module.scss';

const regexLink = new RegExp(
	'^(https?:\\/\\/)?' + // Протокол (http:// или https://)
		'(?:www\\.)?telegra\\.ph' + // Доменное имя telegra.ph
		'(\\/[\\w\\d-._~%]*)*' + // Путь
		'(\\?[;&=a-z\\d%_.~+-]*)?' + // Query string
		'(#[a-z\\d-._~]*)?$', // Anchor ссылка
	'i',
);
const FocusTextField = {
	text: false,
	header: false,
};

const AdminTextEditor = ({ textForm, setTextForm, activeTextFields, setActiveTextFields }) => {
	const [focusTextFields, setFocusTextFields] = useState(FocusTextField);
	const [previewImages, setPreviewImages] = useState([]);
	const debounceTextLink = useDebounce(textForm.link, 500);
	const textareaRef = useRef(null);
	const [metaData, setMetaData] = useState(null);
	const dispatch = useDispatch();
	// async function getMetaDataPage() {
	// 	const url = 'https://www.youtube.com/watch?v=MzO-0IYkZMU';
	// 	const data = await fetch(
	// 		`https://api.linkpreview.net/?key=f1afcecf935f21a315617f1fe537a642&q=${url}`,
	// 	);
	// 	const res = await data.json();
	// 	setMetaData(res);
	// }

	const handleInputLink = (e) => {
		setTextForm({ ...textForm, link: e.target.value });

		// if (regexLink.test(e.target.value)) {
		// 	fetch(`https://impulsrent.ru:8203/api/notify/getTelegraphData?url=${e.target.value}`)
		// 		.then((res) => res.json())
		// 		.then((res) => console.log(res));
		// }
	};

	useEffect(() => {
		console.log('text', debounceTextLink, regexLink.test(debounceTextLink));
		if (debounceTextLink && regexLink.test(debounceTextLink)) {
			fetch(`https://impulsrent.ru:8203/api/notify/getTelegraphData?url=${debounceTextLink}`)
				.then((res) => res.json())
				.then((res) => {
					setMetaData(res);
				})
				.catch((err) => {
					setMetaData(null);
				});
		} else {
			setMetaData(null);
		}
	}, [debounceTextLink]);

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
					isOpen={activeTextFields.title}
					onChangeFull={(value) => setActiveTextFields({ ...activeTextFields, title: value })}
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
					name={'Текст'}
					isOpen={activeTextFields.description}
					onChangeFull={(value) => setActiveTextFields({ ...activeTextFields, description: value })}
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
						setActiveTextFields({ ...activeTextFields, link: !activeTextFields.link });
					}}>
					Вложение{' '}
					<ArrowSVG
						className={`${styles.arrow} ${activeTextFields.link && styles.active}`}
						width={19}
						height={19}
					/>
				</button>

				{activeTextFields.link && (
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

				{metaData && (
					<div className={styles.containerPreview}>
						<DeleteButton
							onClick={() => {
								setMetaData(null);
								setTextForm({ ...textForm, link: '' });
							}}
						/>

						<LinkPreview
							titleClassName={styles.linkPreviewTitle}
							title={metaData?.title}
							image={metaData?.image}
							style={{ marginTop: 10 }}
							href={debounceTextLink}
						/>
					</div>
				)}

				{activeTextFields.link && previewImages.length > 0 && (
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
