import { useEffect, useState, useRef } from 'react';
import ArrowSVG from '../../Icons/Arrow';
import styles from './styles.module.scss';

const SelectValue = ({ value }) => {
	return (
		<>
			{value ? (
				<div className={styles.userInfo}>
					<img width={34} height={34} src={value?.img} alt="tgImg" />
					<div>
						<p>{value?.name}</p>
						<p>{value?.nickname}</p>
					</div>
				</div>
			) : (
				<span>Выберите пользователя</span>
			)}
		</>
	);
};

const Select = ({ variants, onChange, children }) => {
	const [value, setValue] = useState(null);
	const [activeDropDown, setActiveDropDown] = useState(false);
	const dropDownRef = useRef(null);
	const handleVariant = (index) => {
		setValue(index);
	};
	const selectRef = useRef();
	const handleSelect = (e) => {
		e.stopPropagation();
		setActiveDropDown(!activeDropDown);
		const selectHeight = selectRef.current?.getBoundingClientRect()?.height;
		dropDownRef.current.style.overflow = 'hidden';
		dropDownRef.current.style.top = `${selectHeight + 4}px`;
	};

	useEffect(() => {
		if (typeof onChange === 'function') {
			onChange(variants[value]);
		}
	}, [value]);

	useEffect(() => {
		const clickWin = () => {
			setActiveDropDown(false);
		};
		window.addEventListener('click', clickWin);

		return () => window.removeEventListener('click', clickWin);
	}, []);
	return (
		<div ref={selectRef} className={styles.container}>
			<div onClick={handleSelect} className={styles.select}>
				<SelectValue value={value !== null ? variants[value] : null} />
				<ArrowSVG />
			</div>

			<div
				onTransitionEnd={() => (dropDownRef.current.style.overflow = 'auto')}
				ref={dropDownRef}
				className={`${styles.dropDown} ${activeDropDown && styles.active}`}>
				{variants.map((el, index) => {
					return (
						<div
							className={`${styles.userInfo} ${index === value && styles.checked} ${
								styles.dropDownItem
							}`}
							onClick={(e) => {
								e.stopPropagation();
								handleVariant(index);
							}}
							key={index}>
							<img width={34} height={34} src={el?.img} alt="tgImg" />
							<div>
								<p>{el?.name}</p>
								<p>{el?.nickname}</p>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default Select;
