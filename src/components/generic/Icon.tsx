interface Props {
    icon: string,
    color?: string,
    size: number,
    additionalClass?: string
}

export const Icon: React.FC<Props> = ({ icon, color, size, additionalClass }) => {
    return (
        <div className={`text-${color} ${additionalClass}`}>
            <img src={`/images/${icon}.png`} alt={`icon-${icon}`} width={size} />
        </div>
    )
}