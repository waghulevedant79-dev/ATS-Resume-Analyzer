import { useState } from "react";

export default function CopyButton({ text }) {
    const [copied, setCopied] = useState(false);

    async function handleCopy() {
        if (!text) return;

        try {
            await navigator.clipboard.writeText(text);

            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 1800);
        } catch {
            setCopied(false);
        }
    }

    return (
        <button
            type="button"
            onClick={handleCopy}
            disabled={!text}
            className="inline-flex shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50"
        >
            {copied ? "Copied ✓" : "Copy"}
        </button>
    );
}