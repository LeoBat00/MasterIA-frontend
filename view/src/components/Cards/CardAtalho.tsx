import React from "react";
import clsx from "clsx";

type CardAtalhoProps = {
  icon?: React.ReactNode;
  label: string;
  onClick?: () => void;
  className?: string;
  isDimmed?: boolean;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
};

export function CardAtalho({
  icon,
  label,
  onClick,
  className,
  isDimmed = false,
  onHoverStart,
  onHoverEnd,
}: CardAtalhoProps) {
  return (
    <div
      onClick={onClick}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      className={clsx(
        "w-full borda-[#616EFF] cursor-pointer rounded-[8px] py-4 flex items-center justify-center text-center transition-opacity duration-200",
        "bg-[#3E368C]",
        isDimmed ? "opacity-60" : "opacity-100 hover:opacity-100",
        className
      )}
    >
      {icon && <span className="mr-2 flex items-center">{icon}</span>}
      <span>{label}</span>
    </div>
  );
}
