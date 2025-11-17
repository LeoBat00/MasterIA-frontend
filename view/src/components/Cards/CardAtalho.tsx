import React from "react";
import clsx from "clsx";

type CardAtalhoProps = {
  icon?: React.ReactNode;
  label: string;
  onClick?: () => void;
  className?: string;
};

export function CardAtalho({
  icon,
  label,
  onClick,
  className,
}: CardAtalhoProps) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        "w-full borda-[#616EFF] cursor-pointer rounded-[8px] py-4 flex items-center justify-center text-center transition",
        "bg-[#3E368C]",
        className
      )}
    >
      {icon && <span className="mr-2 flex items-center">{icon}</span>}
      <span>{label}</span>
    </div>
  );
}
