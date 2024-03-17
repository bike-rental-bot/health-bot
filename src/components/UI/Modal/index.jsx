import { useEffect } from 'react';
import styles from './styles.module.scss';
import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
const Modal = ({ active, children, hiddenZindex = -1, activeZindex = 10 }) => {
	const [open, setOpen] = useState(active);
	const elRef = useRef();
	useEffect(() => {
		if (active) {
			requestAnimationFrame(() => {
				elRef.current.style.zIndex = activeZindex;
				elRef?.current?.classList.toggle(styles.active);
				document.body.style.overflow = 'hidden'
			});
		} else {
			requestAnimationFrame(() => {
				elRef?.current?.classList?.toggle(styles.active);
				document.body.style.overflow = '';
			});
		}
	}, [active]);


	const condition = () => {
		return active || (!active && open);
	};

	return (
		condition() && (
			<>
				{createPortal(
					<div
						ref={elRef}
						onTransitionEnd={() => {
							setOpen(active);
							if (!active) {
								elRef.current.style.zIndex = hiddenZindex;
							}
						}}
						className={`${styles.container} ${open && styles.active}`}>
						{children}
					</div>,
					document.body,
				)}
			</>
		)
	);
};

export default Modal;
