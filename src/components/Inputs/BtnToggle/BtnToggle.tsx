
type TBtn = {
    className?: string
    onClick?: (e: any | undefined) => void
    text: string
    disabled?: boolean
    label?: string
}

const BtnToggle = ({ className, onClick, text, disabled = false}: TBtn) => {
    return (
        <button
            className={className}
            onClick={onClick}
            disabled={disabled}
        >
            {text}
        </button>
    );
};

export default BtnToggle;