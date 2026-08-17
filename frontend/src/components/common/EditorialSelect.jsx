import { useEffect, useRef, useState } from "react";

export default function EditorialSelect({
    value,
    onChange,
    options = [],
    placeholder = "Select an option",
    disabled = false,
}) {
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef(null);

    const selectedOption = options.find(
        (option) => String(option.value) === String(value)
    );

    useEffect(() => {
        function handleOutsideClick(event) {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    useEffect(() => {
        function handleKeyDown(event) {
            if (!open) return;

            if (event.key === "Escape") {
                setOpen(false);
                return;
            }

            if (event.key === "ArrowDown") {
                event.preventDefault();

                const currentIndex = options.findIndex(
                    (option) => String(option.value) === String(value)
                );

                const nextIndex =
                    currentIndex >= options.length - 1
                        ? 0
                        : currentIndex + 1;

                onChange(options[nextIndex].value);
            }

            if (event.key === "ArrowUp") {
                event.preventDefault();

                const currentIndex = options.findIndex(
                    (option) => String(option.value) === String(value)
                );

                const previousIndex =
                    currentIndex <= 0
                        ? options.length - 1
                        : currentIndex - 1;

                onChange(options[previousIndex].value);
            }

            if (event.key === "Enter") {
                event.preventDefault();
                setOpen(false);
            }
        }

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [open, options, value, onChange]);

    function selectOption(option) {
        onChange(option.value);
        setOpen(false);
    }

    return (
        <div
            ref={wrapperRef}
            className="relative w-full"
        >
            {/* Trigger */}
            <button
                type="button"
                disabled={disabled}
                onClick={() => setOpen((current) => !current)}
                className={[
                    "flex w-full items-center justify-between gap-4",
                    "rounded-xl border bg-white px-4 py-3",
                    "text-left text-sm font-medium text-slate-800",
                    "transition-all duration-200 ease-out",
                    "outline-none",
                    "focus:border-slate-400 focus:ring-2 focus:ring-slate-200",
                    disabled
                        ? "cursor-not-allowed opacity-50"
                        : "cursor-pointer hover:border-slate-400 hover:bg-slate-50",
                    open
                        ? "border-slate-400 ring-2 ring-slate-200"
                        : "border-slate-300",
                ].join(" ")}
                aria-haspopup="listbox"
                aria-expanded={open}
            >
                <span className="min-w-0 truncate">
                    {selectedOption?.label || placeholder}
                </span>

                <svg
                    className={[
                        "h-4 w-4 shrink-0 text-slate-400",
                        "transition-transform duration-200",
                        open ? "rotate-180" : "",
                    ].join(" ")}
                    viewBox="0 0 20 20"
                    fill="none"
                    aria-hidden="true"
                >
                    <path
                        d="M5 7.5L10 12.5L15 7.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>

            {/* Dropdown */}
            {open && (
                <div
                    className="
            absolute
            left-0
            right-0
            z-50
            mt-2
            origin-top
            overflow-hidden
            rounded-xl
            border
            border-slate-200
            bg-white
            p-1.5
            shadow-[0_16px_40px_rgba(15,23,42,0.10)]
            animate-editorial-dropdown
          "
                    role="listbox"
                >
                    <div className="max-h-64 overflow-y-auto">
                        {options.length > 0 ? (
                            options.map((option) => {
                                const isSelected =
                                    String(option.value) === String(value);

                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        role="option"
                                        aria-selected={isSelected}
                                        onClick={() => selectOption(option)}
                                        className={[
                                            "group flex w-full items-center gap-3",
                                            "rounded-lg px-3 py-2.5",
                                            "text-left text-sm",
                                            "transition-colors duration-150",
                                            isSelected
                                                ? "bg-slate-50 font-medium text-slate-950"
                                                : "text-slate-700 hover:bg-[#eef6eb] hover:text-slate-950",
                                        ].join(" ")}
                                    >
                                        <span
                                            className={[
                                                "flex h-4 w-4 shrink-0 items-center justify-center",
                                                isSelected
                                                    ? "text-slate-900"
                                                    : "text-transparent",
                                            ].join(" ")}
                                        >
                                            <svg
                                                className="h-3.5 w-3.5"
                                                viewBox="0 0 20 20"
                                                fill="none"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    d="M4.5 10.5L8 14L15.5 6.5"
                                                    stroke="currentColor"
                                                    strokeWidth="1.8"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </span>

                                        <span className="min-w-0 flex-1 truncate">
                                            {option.label}
                                        </span>
                                    </button>
                                );
                            })
                        ) : (
                            <div className="px-3 py-3 text-sm text-slate-400">
                                No options available.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}