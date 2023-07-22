import React from 'react';

interface Props {
	size?: number;
}

const Loader: React.FC<Props> = ({ size = 10 }) => {
	// animated loader tsx
	return (
		<div className="flex justify-center items-center">
			<div className={`animate-spin rounded-full h-${size} w-${size} border-b-2 border-primary`}></div>
		</div>
	);
};

export default Loader;