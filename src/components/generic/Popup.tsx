import React, { useState } from "react";

interface Props {
	message: string,
	onConfirm: () => void
}

const Popup: React.FC<Props> = ({ message, onConfirm }) => {
	const [isOpen, setIsOpen] = useState(false);

	const handleConfirm = () => {
		onConfirm();
		setIsOpen(false);
	};

	return (
		<>
			<button onClick={() => setIsOpen(true)}>Finaliser cette phase !</button>
			{isOpen && (
				<div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex justify-center items-center">
					<div className="bg-white p-8 rounded-lg">
						<p className="text-lg font-medium mb-4">{message}</p>
						<div className="flex justify-end">
							<button
								className="bg-red-500 text-white px-4 py-2 rounded mr-4"
								onClick={() => setIsOpen(false)}
							>
								Non
							</button>
							<button
								className="bg-green-500 text-white px-4 py-2 rounded"
								onClick={handleConfirm}
							>
								Oui
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}

export default Popup;
