import React from 'react';

interface Props {
	size?: number;
}

const Loader: React.FC<Props> = ({ size = 6 }) => {
	const sizeClasses = `h-${size} w-${size}`;

	return (
		<div className={`flex justify-center items-center ${sizeClasses}`}>
			<div className="relative flex">
				<div className="w-1.5 h-1.5 bg-gray-500 rounded-full mr-1 animate-bounce" />
				<div className="w-1.5 h-1.5 bg-gray-500 rounded-full mr-1 animate-bounce" />
				<div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" />
			</div>
		</div>
	);
};

export default Loader;