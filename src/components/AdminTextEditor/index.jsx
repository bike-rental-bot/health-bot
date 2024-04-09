import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useDebounce from '../../hooks/useDebounce.js';
import { setFocusTextField, setFormState } from '../../redux/adminSlice.js';
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

const AdminTextEditor = ({ activeTextFields, setActiveTextFields }) => {
	const formState = useSelector((state) => state.admin.formState);
	const WebApp = window.Telegram.WebApp;
	const [focusTextFields, setFocusTextFields] = useState(FocusTextField);
	const [previewImages, setPreviewImages] = useState([]);
	const debounceTextLink = useDebounce(formState.attachment_url, 500);
	const [metaData, setMetaData] = useState(null);
	const dispatch = useDispatch();

	const handleInputLink = (e) => {
		dispatch(setFormState({ ...formState, attachment_url: e.target.value }));
	};

	useEffect(() => {
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

	const inputAttachmentRef = useRef();

	useEffect(() => {
		dispatch(setFocusTextField(focusTextFields.header || focusTextFields.text));
	}, [focusTextFields]);

	useEffect(() => {
		function clickCloseBtn() {
			const tagName = document.activeElement.tagName.toLowerCase();

			if (tagName === 'textarea' || tagName === 'input') {
				document.activeElement.blur();
			}

			requestAnimationFrame(() => {
				WebApp.showPopup(
					{
						title: 'health_bot',
						message: 'Внесенные изменения могут быть потеряны',
						buttons: [
							{ id: 'close', type: 'destructive', text: 'Закрыть' },
							{ id: 'cancel', type: 'cancel', text: 'Отмена' },
						],
					},
					(id) => {
						if (id === 'close') {
							WebApp.close();
						}
					},
				);
			});
		}

		WebApp.onEvent('backButtonClicked', clickCloseBtn);

		return () => {
			WebApp.offEvent('backButtonClicked', clickCloseBtn);
		};
	}, []);

	useEffect(() => {
		if (activeTextFields.link) {
			if (inputAttachmentRef && inputAttachmentRef.current) inputAttachmentRef.current.focus();
		}
	}, [activeTextFields]);

	return (
		<>
			<div className={`${styles.container}`}>
				<TextField
					onChange={(value) => {
						dispatch(setFormState({ ...formState, title: value }));
					}}
					name={'Заголовок'}
					placeholder={'Введите заголовок'}
					isOpen={activeTextFields.title}
					onChangeFull={(value) => setActiveTextFields({ ...activeTextFields, title: value })}
					onFocus={() => {
						setFocusTextFields({ ...focusTextFields, header: true });
						setActiveTextFields({ ...activeTextFields, description: false, link: false });
					}}
					onBlur={() => {
						setFocusTextFields({ ...focusTextFields, header: false });
					}}
					value={formState.title}
				/>

				<TextField
					onChange={(value) => {
						dispatch(setFormState({ ...formState, description: value }));
					}}
					name={'Текст'}
					isOpen={activeTextFields.description}
					onChangeFull={(value) => setActiveTextFields({ ...activeTextFields, description: value })}
					placeholder={'Введите текст'}
					onFocus={() => {
						setFocusTextFields({ ...focusTextFields, text: true });
						setActiveTextFields({ ...activeTextFields, title: false, link: false });
					}}
					onBlur={() => {
						setFocusTextFields({ ...focusTextFields, text: false });
					}}
					value={formState.description}
				/>
			</div>
			<div className={`${styles.textField} ${styles.attachment}`}>
				<button
					className={styles.attachmentBtn}
					onClick={() => {
						setActiveTextFields({
							...activeTextFields,
							link: !activeTextFields.link,
							title: false,
							description: false,
						});
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
								data-name="input-create-event"
								onChange={handleFileChange}
								multiple={true}
								accept=".jpg, .jpeg, .png"
								type="file"
							/>
							<ClipSVG />
						</label>

						<label className={styles.inputText}>
							<input
								value={formState.attachment_url}
								ref={inputAttachmentRef}
								onChange={handleInputLink}
								placeholder="Вставьте ссылку или вложение"
								type="text"
							/>
						</label>
					</div>
				)}

				{metaData && activeTextFields.link && (
					<div className={styles.containerPreview}>
						<DeleteButton
							onClick={() => {
								setMetaData(null);
								dispatch(setFormState({ ...formState, attachment_url: '' }));
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
