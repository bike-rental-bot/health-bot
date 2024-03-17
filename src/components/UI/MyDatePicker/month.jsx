import { useEffect, useState, useRef } from 'react';

const Month = ({ children }) => {
	const elRef = useRef();

	return (
		<span ref={elRef} className={`date-picker__month-name`}>
			{children}
		</span>
	);
};

export default Month;
