"use client";

import clsx from "clsx";
import { useId } from "react";

type QuestionOption = {
  label: string;
  value: string;
};

type QuestionSelectorProps = {
  title: string;
  options: QuestionOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

export default function QuestionSelector({
  title,
  options,
  value,
  onChange,
  className,
}: QuestionSelectorProps) {
  const groupId = useId();

  return (
    <div
      className={clsx(
        "w-full rounded-[8px] border border-[#2F2B43] bg-[#28253C] p-5",
        className
      )}
    >
      <p className="mb-[4px] text-sm font-medium text-[#D9E8FF]">{title}</p>
      <div className="flex flex-col ml-[4px] ">
        {options.map((option) => {
          const optionId = `${groupId}-${option.value}`;
          const isSelected = value === option.value;

          return (
            <label
              key={option.value}
              htmlFor={optionId}
              className="flex cursor-pointer items-center gap-3 text-sm text-[#C7CCE5] hover:text-white"
            >
              <input
                id={optionId}
                type="radio"
                name={groupId}
                value={option.value}
                className="hidden"
                checked={isSelected}
                onChange={() => onChange(option.value)}
              />
              <span
                className={clsx(
                  "flex h-4 w-4 items-center justify-center rounded-full border",
                  isSelected
                    ? "border-[#7C3FFD]"
                    : "border-white/30 hover:border-white/70"
                )}
              >
                <span
                  className={clsx(
                    "h-2.5 w-2.5 rounded-full",
                    isSelected ? "bg-[#7C3FFD]" : "bg-transparent"
                  )}
                />
              </span>
              <span
                className={clsx(
                  "font-medium transition-colors",
                  isSelected ? "text-[#7C8BFF]" : undefined
                )}
              >
                {option.label}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
