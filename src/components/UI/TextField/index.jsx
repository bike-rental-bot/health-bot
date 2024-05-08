import { useState, useRef, useEffect } from 'react';
import styles from './styles.module.scss';
import ArrowSVG from '../../Icons/Arrow';
import { useSelector } from 'react-redux';
import useDebounce from '../../../hooks/useDebounce';

const WebApp = window.Telegram.WebApp;
const TextField = ({
	name,
	placeholder,
	onChange,
	value,
	onBlur,
	onFocus,
	onClickBtn,
	textareaRef,
	labelRef,
	onChangeFull,
	isOpen = false,
	buttonClassName,
	className,
}) => {
	const [active, setActive] = useState(isOpen);
	const firstFocus = useRef(false);
	const buttonRef = useRef(false);
	const { viewPort, isOpenKeyboard } = useSelector((state) => state.app);
	const debounceActive = useDebounce(active, 100);

	const app = useSelector((state) => state.app);

	useEffect(() => {
		setActive(isOpen);
	}, [isOpen]);

	useEffect(() => {
		function resizeWin() {
			if (textareaRef.current) {
				textareaRef.current.style.height = `0px`;
				textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
			}
		}
		window.addEventListener('resize', resizeWin);

		return () => window.removeEventListener('resize', resizeWin);
	}, []);

	useEffect(() => {
		if (active && textareaRef.current) {
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
		}
		if (!active) {
			firstFocus.current = false;
		}
	}, [active]);

	return (
		<div ref={labelRef} className={`${styles.textField} ${className}`}>
			<button
				ref={buttonRef}
				type={'button'}
				className={buttonClassName}
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
					setActive(!active);
					buttonRef.current.blur();

					if (typeof onClickBtn === 'function') onClickBtn(!active);
				}}>
				<span>{name}</span>

				<ArrowSVG className={`${styles.arrow} ${active && styles.active}`} width={19} height={19} />
			</button>

			{
				<label
					style={{
						height: active ? 'auto' : '0px',
						overflow: 'hidden',
						paddingBottom: active ? '14px' : '0',
					}}>
					<textarea
						data-name="input-create-event"
						style={{ maxHeight: 100 }}
						value={value}
						ref={textareaRef}
						onFocus={() => {
							if (typeof onFocus === 'function') onFocus();

							if (WebApp.platform === 'ios') {
								const root = document.getElementById('root');

								root.scrollTo(0, 0);
								window.scrollTo(0, 0);
							}
						}}
						onBlur={() => {
							if (typeof onFocus === 'function') onBlur();

							if (WebApp.platform === 'ios') {
								const root = document.getElementById('root');

								root.scrollTo(0, 0);
								window.scrollTo(0, 0);
							}
						}}
						onChange={(e) => {
							e.preventDefault();

							if (typeof onChange === 'function') {
								onChange(e.target.value);
							}

							if (textareaRef.current) {
								textareaRef.current.style.height = `0px`;
								textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
							}
						}}
						placeholder={placeholder}
					/>
				</label>
			}
		</div>
	);
};

export default TextField;
