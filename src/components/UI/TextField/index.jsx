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
	onChangeFull,
	isOpen = false,
}) => {
	const [active, setActive] = useState(isOpen);
	const textareaRef = useRef(null);
	const labelRef = useRef(null);
	const [focus, setFocus] = useState(false);
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
			// textareaRef.current.focus();
		}
		if (!active) {
			firstFocus.current = false;
		}
	}, [active]);

	// useEffect(() => {
	// 	const root = document.getElementById('root');
	// 	function viewportChanged() {
	// 		if (focus) {
	// 			setTimeout(() => {
	// 				if (root && labelRef.current) {
	// 					root.scrollTo({
	// 						top: labelRef.current.offsetTop - root.offsetTop,
	// 						behavior: 'smooth',
	// 					});
	// 				}
	// 			}, 300);
	// 		}
	// 	}

	// 	viewportChanged();
	// }, [isOpenKeyboard, viewPort, focus]);

	return (
		<div ref={labelRef} className={styles.textField}>
			<button
				ref={buttonRef}
				type={'button'}
				onClick={() => {
					setActive(!active);
					buttonRef.current.blur();
					if (typeof onChangeFull === 'function') onChangeFull(!active);
				}}>
				{name}
				<ArrowSVG className={`${styles.arrow} ${active && styles.active}`} width={19} height={19} />
			</button>

			{active && (
				<label>
					<textarea
						data-name="input-create-event"
						style={{ maxHeight: 100 }}
						value={value}
						ref={textareaRef}
						onFocus={() => {
							if (typeof onFocus === 'function') onFocus();
							setFocus(true);
						}}
						onBlur={() => {
							if (typeof onFocus === 'function') onBlur();
							setFocus(false);
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
			)}
		</div>
	);
};

export default TextField;
