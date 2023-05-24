import React from "react";

interface Props {
	text: string,
	color: string,
	action?: () => void,
	type?: "button" | "submit" | "reset" | undefined,
	hoverColor?: string,
	additionalClass?: string,
	disabled?: boolean
}

export const Button : React.FC<Props> = ({text, color, type, action, hoverColor, additionalClass, disabled}) => {
	return (
		<>
			{disabled ? (
				<button disabled={disabled} onClick={action} type={type}
						className={`bg-gray-400 text-white py-2 px-4 rounded-full transition-all duration-500 ${additionalClass}`}>
					{text}
				</button>
			) : (
			<button disabled={disabled} onClick={action} type={type}
					className={`bg-${color} text-white py-2 px-4 rounded-full transition-all duration-500 hover:scale-105 hover:bg-${hoverColor} ${additionalClass}`}>
				{text}
			</button>)
			}
		</>

	)
}