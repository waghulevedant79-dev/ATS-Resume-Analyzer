export default function ATSLogo({
    size = 40,
    className = "",
}) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="ATS Resume Analyzer"
            role="img"
            className={className}
        >
            {/* Outer document */}
            <rect
                x="1.5"
                y="1.5"
                width="37"
                height="37"
                rx="11"
                fill="#0F172A"
            />

            {/* Document corner */}
            <path
                d="M27 1.5V8.5C27 9.60457 27.8954 10.5 29 10.5H38.5"
                fill="#1E293B"
            />

            {/* A */}
            <path
                d="M10.5 28L15.8 13H18.6L23.9 28H20.9L19.75 24.5H14.55L13.4 28H10.5ZM15.25 22H19.05L17.15 16.1L15.25 22Z"
                fill="white"
            />

            {/* Analysis line */}
            <path
                d="M26 16.5H32"
                stroke="#CBD5E1"
                strokeWidth="1.5"
                strokeLinecap="round"
            />

            <path
                d="M26 20.5H32"
                stroke="#CBD5E1"
                strokeWidth="1.5"
                strokeLinecap="round"
            />

            <path
                d="M26 24.5H30"
                stroke="#CBD5E1"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
        </svg>
    );
}