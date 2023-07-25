interface Props {
    label: string,
    name: string,
    options: Array<{value: string, label: string}>,
    value?: string,
    onBlur?: React.FocusEventHandler<HTMLSelectElement>,
    onSelect?: React.ReactEventHandler<HTMLSelectElement>,
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void,
    additionalClass?: string
}

export const FormSelect : React.FC<Props> = ({onSelect, onBlur, label, name, options, value, onChange, additionalClass}) => {
    return (
        <div className={`flex flex-col ${additionalClass}`}>
            <label htmlFor={name} className="text-gray-700 font-bold mb-2">{label}</label>
            <select onSelect={onSelect} name={name} id={name} onBlur={onBlur} value={value} onChange={onChange} className="appearance-none border rounded-full w-full px-4 py-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                {options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
        </div>
    )
}