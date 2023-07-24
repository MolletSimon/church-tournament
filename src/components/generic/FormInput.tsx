interface Props {
    innerRef?: React.RefObject<HTMLInputElement>,
    id: string,
    label: string,
    type: string,
    placeholder: string,
    onBlur?: React.FocusEventHandler<HTMLInputElement>,
    error?: string,
    additionalClass?: string,
    align?: "left" | "center" | "right",
    defaultValue?: any,
    value?: any,
    onChange?: React.ChangeEventHandler<HTMLInputElement>,
    min?: string,
    max?: string,
    required?: boolean
}

export const FormInput: React.FC<Props> = ({min, max, required, align, onChange, defaultValue, value, additionalClass, innerRef, id, label, type, placeholder, onBlur, error} ) => {
    const getAlignement = () => {
        switch (align) {
            case "left":
                return "ml-0 mr-auto"
            case "center":
                return "mx-auto"
            case "right":
                return "mr-0 ml-auto"
            default:
                return ""
        }
    }

    const getErrorStyle = () => {
        if (error) {
            return "border-danger"
        } 
        return "";
    }

    return (
        <div className={`flex flex-col w-2/3 ${getAlignement()} ${additionalClass}`}>
            <label 
                htmlFor={id}
                className="block text-gray-700 font-bold mb-2">{label}</label>

            <input 
                onChange={onChange ? onChange : () => {}}
                value={value}
                type={type}
                onBlur={onBlur ? onBlur : () => {}}
                defaultValue={defaultValue}
                min={min}
                max={max}
                required={required}
                placeholder={placeholder}
                className={`${getErrorStyle()} placeholder:italic appearance-none border rounded-xl w-full py-3 px-4 text-primary transition-all duration-300 leading-tight focus:outline-none focus:shadow-outline focus:scale-110 focus:border-primary`} 
                id={id} 
                ref={innerRef} />
            

            {/* Input ONBLUR
            {onBlur && 
                <input 
                onBlur={onBlur} 
                type={type} 
                placeholder={placeholder}
                defaultValue={defaultValue}
                className={`${getErrorStyle()} placeholder:italic appearance-none border rounded-xl w-full py-3 px-4 text-primary transition-all duration-300 leading-tight focus:outline-none focus:shadow-outline focus:scale-110 focus:border-primary`} 
                id={id} 
                ref={innerRef} />
            } */}
            
            {error && <p className="text-red-500 mb-4 mt-1 ml-2">{error}</p>}
        </div>
    )
}