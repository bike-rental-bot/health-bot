import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useDebounce from '../../hooks/useDebounce.js';
import {
	TEXT_FORM_ERROR,
	TITLE_FORM_ERROR,
	setFocusTextField,
	setFormErrors,
	setFormState,
} from '../../redux/adminSlice.js';
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

const AdminTextEditor = ({
	activeTextFields,
	setActiveTextFields,
	focusTextFields,
	setFocusTextFields,
	formFiles,
	setFormFiles,
}) => {
	const formState = useSelector((state) => state.admin.formState);
	const formErrors = useSelector((state) => state.admin.formErrors);
	const WebApp = window.Telegram.WebApp;

	const debounceTextLink = useDebounce(formState.preview_url, 250);
	const [metaData, setMetaData] = useState(null);
	const dispatch = useDispatch();

	const handleInputLink = (e) => {
		dispatch(setFormState({ ...formState, preview_url: e.target.value }));
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

		const promises = [];

		for (let i = 0; i < 3 - formFiles.length && i < files.length; i++) {
			promises.push(promFunc(files[i]));
		}

		const funcFiles = formFiles;

		Promise.all(promises).then((results) => {
			results.forEach((result, index) => {
				let el = {
					src: result,
					key: `${result} ${new Date().getTime()}`,
				};

				funcFiles.push({ file: files[index], preview: el });
				setFormFiles([...funcFiles]);
			});
		});
	};

	const inputAttachmentRef = useRef();

	const labelRef1 = useRef();
	const inputRef1 = useRef();

	const labelRef2 = useRef();
	const inputRef2 = useRef();

	// useEffect(() => {
	// 	if (activeTextFields.link) {
	// 		if (inputAttachmentRef && inputAttachmentRef.current) inputAttachmentRef.current.focus();
	// 	}
	// }, [activeTextFields]);

	const scrollToElem = (labelRef) => {
		const root = document.getElementById('root');
		if (root && labelRef?.current) {
			if (WebApp.platform === 'android') {
				setTimeout(() => {
					root.scrollTo({
						top: labelRef.current.offsetTop,
						behavior: 'smooth',
					});
				}, 250);
			}

			if (WebApp.platform === 'ios') {
				const pixelsToBottom = root.scrollHeight - (root.scrollTop + root.clientHeight);
				setTimeout(() => {
					root.scrollTo({
						top: labelRef.current.offsetTop - pixelsToBottom,
						behavior: 'smooth',
					});
				}, 250);
			}
		}
	};

	useEffect(() => {
		if (activeTextFields.title && !activeTextFields.description && !activeTextFields.link) {
			inputRef1.current.focus();
			inputRef2.current.blur();
		}

		if (!activeTextFields.title && activeTextFields.description && !activeTextFields.link) {
			inputRef2.current.focus();
			inputRef1.current.blur();
		}
	}, [activeTextFields]);

	return (
		<>
			<div className={`${styles.container}`}>
				<TextField
					onChange={(value) => {
						dispatch(setFormState({ ...formState, title: value }));
						dispatch(setFormErrors({ type: TITLE_FORM_ERROR, value: false }));
					}}
					name={
						formState.title.replace(/(\r\n|\n|\r)/gm, '').length === 0 || activeTextFields.title
							? 'Заголовок'
							: formState.title.replace(/(\r\n|\n|\r)/gm, '')
					}
					textareaRef={inputRef1}
					labelRef={labelRef1}
					placeholder={'Введите заголовок'}
					buttonClassName={formErrors.title_entered && styles.buttonTextFieldError}
					className={formErrors.title_entered && styles.textFieldError}
					isOpen={activeTextFields.title}
					onClickBtn={(active) => {
						if (active) {
							setActiveTextFields({
								...activeTextFields,
								title: true,
								description: false,
								link: false,
							});
						} else {
							setActiveTextFields({
								...activeTextFields,
								title: false,
								description: false,
								link: false,
							});
						}
					}}
					onFocus={() => {
						scrollToElem(labelRef1);
					}}
					onBlur={() => {}}
					value={formState.title}
				/>

				<TextField
					onChange={(value) => {
						dispatch(setFormState({ ...formState, description: value }));
						dispatch(setFormErrors({ type: TEXT_FORM_ERROR, value: false }));
					}}
					name={
						formState.description.replace(/(\r\n|\n|\r)/gm, '').length === 0 ||
						activeTextFields.description
							? 'Текст'
							: formState.description.replace(/(\r\n|\n|\r)/gm, '')
					}
					textareaRef={inputRef2}
					labelRef={labelRef2}
					isOpen={activeTextFields.description}
					buttonClassName={formErrors.text_entered && styles.buttonTextFieldError}
					className={formErrors.text_entered && styles.textFieldError}
					onClickBtn={(active) => {
						if (active) {
							setActiveTextFields({
								...activeTextFields,
								title: false,
								description: true,
								link: false,
							});
						} else {
							setActiveTextFields({
								...activeTextFields,
								title: false,
								description: false,
								link: false,
							});
						}
					}}
					placeholder={'Введите текст'}
					onBlur={() => {}}
					onFocus={() => {
						scrollToElem(labelRef2);
					}}
					value={formState.description}
				/>
			</div>
			<div className={`${styles.textField} ${styles.attachment}`}>
				<button
					type="button"
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
								onChange={handleFileChange}
								multiple={true}
								accept=".jpg, .jpeg, .png"
								type="file"
							/>
							<ClipSVG />
						</label>

						<label className={styles.inputText}>
							<input
								value={formState.preview_url}
								data-name="input-create-event"
								onChange={handleInputLink}
								placeholder="Вставьте ссылку или вложение"
								type="text"
								onBlur={() => {
									const root = document.getElementById('root');
									if (WebApp.platform === 'ios') {
										root.scrollTo(0, 0);
										window.scrollTo(0, 0);
									}
								}}
							/>
						</label>
					</div>
				)}

				{metaData && activeTextFields.link && (
					<div className={styles.containerPreview}>
						<DeleteButton
							onClick={() => {
								setMetaData(null);
								dispatch(setFormState({ ...formState, preview_url: '' }));
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

				{activeTextFields.link && formFiles.length > 0 && (
					<div className={styles.imageList}>
						{formFiles.map((el, index) => {
							return (
								<ImageLoadPreview
									clickDelete={(el) => {
										let fileList = [...formFiles];
										fileList.splice(index, 1);
										setFormFiles(fileList);
									}}
									key={el?.preview?.key}
									src={el?.preview?.src}
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
