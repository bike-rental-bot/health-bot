import { useEffect, useState, useRef } from 'react';
import ArrowSVG from '../../Icons/Arrow';
import styles from './styles.module.scss';
import img1 from '../../../assets/images/tgUser1.png';
import avatarIMG from '../../../assets/images/user.png';

const SelectValue = ({ value }) => {
	return (
		<>
			{value ? (
				<div className={styles.userInfo}>
					<img width={34} height={34} src={value.photo ? value.photo : avatarIMG} alt="tgImg" />
					<div>
						<p>{value?.full_name.trim()}</p>
						<p>{value?.mention}</p>
					</div>
				</div>
			) : (
				<span>Выберите пользователя</span>
			)}
		</>
	);
};

const Select = ({ variants, onChange, children, value, className }) => {
	const [activeDropDown, setActiveDropDown] = useState(false);
	const dropDownRef = useRef(null);
	const handleVariant = (index) => {
		setActiveDropDown(!activeDropDown);

		if (typeof onChange === 'function') {
			onChange(variants[index] ? variants[index] : null, variants[index] ? index : null);
		}
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
		const clickWin = () => {
			setActiveDropDown(false);
		};
		window.addEventListener('click', clickWin);

		return () => window.removeEventListener('click', clickWin);
	}, []);

	return (
		<div ref={selectRef} className={`${styles.container} ${className}`}>
			<div onClick={handleSelect} className={styles.select}>
				<SelectValue value={value !== null ? variants[value] : null} />
				<ArrowSVG />
			</div>

			<div
				onTransitionEnd={() => (dropDownRef.current.style.overflow = 'auto')}
				ref={dropDownRef}
				className={`${styles.dropDown} ${activeDropDown && styles.active}`}>
				{variants &&
					Array.isArray(variants) &&
					variants.map((el, index) => {
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
								<img width={34} height={34} src={el?.photo ? el.photo : avatarIMG} alt="tgImg" />
								<div>
									<p>{el?.full_name.trim()}</p>
									<p>{el?.mention}</p>
								</div>
							</div>
						);
					})}
			</div>
		</div>
	);
};

export default Select;
