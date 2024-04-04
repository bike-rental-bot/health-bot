import { useState, useRef, useEffect } from 'react';
import styles from './styles.module.scss';
import ArrowSVG from '../../Icons/Arrow';
const TextField = ({
	name,
	placeholder,
	onChange,
	value = '',
	onBlur,
	onFocus,
	onChangeFull,
	isOpen = false,
}) => {
	const [active, setActive] = useState(isOpen);
	const textareaRef = useRef(null);
	const [text, setText] = useState(value);
	const [focus, setFocus] = useState(false);

	useEffect(() => {
		if (typeof onChange === 'function') {
			onChange(text);
		}
	}, [text]);

	useEffect(() => {
		setText(value);
	}, [value]);

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
			textareaRef.current.style.height = `0px`;
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
		}
	}, [active]);

	return (
		<div className={styles.textField}>
			<button
				onClick={() => {
					setActive(!active);
					if (typeof onChangeFull === 'function') onChangeFull(!active);
				}}>
				{name}
				<ArrowSVG className={`${styles.arrow} ${active && styles.active}`} width={19} height={19} />
			</button>

			{active && (
				<label>
					<textarea
						style={{ maxHeight: 100 }}
						value={text}
						ref={textareaRef}
						onFocus={() => {
							if (typeof onFocus === 'function') onFocus();
						}}
						onBlur={() => {
							if (typeof onFocus === 'function') onBlur();
						}}
						onChange={(e) => {
							e.preventDefault();
							// window.scrollTo(0, window.innerHeight);
							setText(e.target.value);

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
