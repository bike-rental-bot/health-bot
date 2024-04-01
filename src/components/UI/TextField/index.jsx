import { useState, useRef, useEffect } from 'react';
import styles from './styles.module.scss';
import ArrowSVG from '../../Icons/Arrow';
const TextField = ({ name, placeholder, onChange, value = '', onBlur, onFocus }) => {
	const [active, setActive] = useState(false);
	const textareaRef = useRef(null);
	const [text, setText] = useState(value);
	const [focus, setFocus] = useState(false);

	useEffect(() => {
		if (typeof onChange === 'function') {
			onChange(text);
		}
	}, [text]);

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
				}}>
				{name}
				<ArrowSVG className={`${styles.arrow} ${active && styles.active}`} width={19} height={19} />
			</button>

			{active && (
				<label>
					<textarea
						value={text}
						ref={textareaRef}
						onFocus={() => {
							if (typeof onFocus === 'function') onFocus();
						}}
						onBlur={() => {
							if (typeof onFocus === 'function') onBlur();
						}}
						onChange={(e) => {
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
