import React from "react";

interface DividerProps {
    title?: string;
    color?: string;
}

function Divider({ title, color }: DividerProps) {
    const styles = {
        background: "#1e1e1e",
        color: "yellow",
    };

    return (
        <div className={`divider-root relative ${title ? "my-6" : "my-4"}`}>
            <span
                className={`block text-xs font-medium uppercase tracking-wider text-gray-500 ${title ? "mb-2" : ""}`}
            >
                {title}
            </span>
            <hr
                className="border-t border-gray-200"
                style={color ? { borderColor: color } : {}}
            />
        </div>
    );
}

export default Divider;
