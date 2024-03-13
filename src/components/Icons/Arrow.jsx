const ArrowSVG = ({ active, style }) => {
	return (
		<svg
		    
			style={{ transform: active ? 'rotate(180deg)' : '', ...style }}
			width="16"
			height="16"
			viewBox="0 0 16 16"
			fill="none"
			xmlns="http://www.w3.org/2000/svg">
			<path
				d="M2.5 6L7.5 11L12.5 6"
				stroke="black"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};

export default ArrowSVG
