import React from "react";
import clsx from "clsx";

type CardAtalhoProps = {
    icon?: React.ReactNode;
    label: string;
    onClick?: () => void;
    className?: string;
};

export function CardAtalho({ icon, label, onClick, className }: CardAtalhoProps) {
    return (
        <div
            onClick={onClick}
            className={clsx(
                "w-full h-18 borda-cinza rounded-[8px] flex items-center justify-center text-center transition",
                "bg-card-cinza",
                className
            )}
        >
            {icon && <span className="mr-2 flex items-center">{icon}</span>}
            <span>{label}</span>

        </div>
    );
}
