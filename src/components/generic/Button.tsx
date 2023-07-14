import React, { ReactNode } from "react";

interface Props {
	color: string,
	action?: () => void,
	type?: "button" | "submit" | "reset" | undefined,
	hoverColor?: string,
	additionalClass?: string,
	disabled?: boolean,
	id?: string,
	children: ReactNode
}

export const Button : React.FC<Props> = ({children, color, type, action, hoverColor, additionalClass, disabled, id}) => {
	return (
		<>
			{disabled ? (
				<button disabled={disabled} onClick={action} type={type} id={id}
						className={`bg-gray-400 text-white py-2 px-4 rounded-full transition-all duration-500 ${additionalClass}`}>
					{children}
				</button>
			) : (
			<button disabled={disabled} onClick={action} type={type} id={id}
					className={`bg-${color} text-white py-2 px-4 rounded-full transition-all duration-500 hover:scale-105 hover:bg-${hoverColor} ${additionalClass}`}>
				{children}
			</button>)
			}
		</>

	)
}