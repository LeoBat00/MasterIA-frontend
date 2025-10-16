import React, { useId, useState, useRef, useEffect } from "react";
import clsx from "clsx";

export type SelectSize = "sm" | "md" | "lg";
export type SelectVariant = "default" | "underline";

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface SelectSearchProps {
  label?: string;
  value?: string | number; // valor selecionado real
  onChange?: (value: string | number) => void;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  size?: SelectSize;
  variant?: SelectVariant;
  fullWidth?: boolean;
  containerClassName?: string;
  inputClassName?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
}

const paddingsBySize: Record<SelectSize, string> = {
  sm: "py-1.5 pl-3 pr-8",
  md: "py-2 pl-3 pr-8",
  lg: "py-3 pl-4 pr-10",
};

const heightBySize: Record<SelectSize, string> = {
  sm: "h-9",
  md: "h-10",
  lg: "h-12",
};

const SelectSearch: React.FC<SelectSearchProps> = ({
  label,
  value,
  onChange,
  error,
  helperText,
  options,
  size = "md",
  variant = "default",
  fullWidth = true,
  containerClassName,
  inputClassName,
  placeholder = "Selecione...",
  disabled,
  required,
}) => {
  const id = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // opções filtradas só quando digitando
  const filteredOptions =
    isOpen && search
      ? options.filter((opt) =>
          opt.label.toLowerCase().includes(search.toLowerCase())
        )
      : options;

  // fechar ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearch(""); // reseta filtro -> mostra selecionado
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const baseBorder =
    variant === "default"
      ? clsx(
          "border",
          error ? "border-red-500" : "border-[var(--color-purple-2)]",
          "rounded-[8px]"
        )
      : "border-b " + (error ? "border-red-500" : "border-[var(--color-purple-2)]");

  const focusStyles =
    variant === "default"
      ? "focus-within:ring-2 focus-within:ring-black"
      : "focus-within:border-b-black";

  return (
    <div
      className={clsx("w-full relative", fullWidth && "block", containerClassName)}
      ref={wrapperRef}
    >
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-semibold mb-1"
        >
          {label} {required && <span className="text-white">*</span>}
        </label>
      )}

      <div
        className={clsx(
          "relative w-full",
          baseBorder,
          "bg-[#12121B] overflow-hidden",
          focusStyles,
          disabled && "opacity-60 cursor-not-allowed",
          heightBySize[size]
        )}
      >
        <input
          id={id}
          type="text"
          disabled={disabled}
          placeholder={placeholder}
          value={search !== "" ? search : selectedOption?.label || ""}
          onChange={(e) => {
            setSearch(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className={clsx(
            "w-full outline-none bg-transparent placeholder-[#868686]",
            paddingsBySize[size],
            variant === "underline" && "rounded-none",
            inputClassName
          )}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
          ▼
        </span>
      </div>

      {isOpen && (
        <ul className="absolute z-10 w-full max-h-48 overflow-y-auto bg-[#12121B] border border-[var(--color-purple-2)] rounded-md mt-1">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt) => (
              <li
                key={opt.value}
                onClick={() => {
                  onChange?.(opt.value);
                  setIsOpen(false);
                  setSearch(""); // limpa filtro -> mostra selecionado
                }}
                className={clsx(
                  "px-3 py-2 cursor-pointer hover:bg-[var(--color-purple-3)]",
                  opt.value === value && "bg-[var(--color-purple-2)] text-white"
                )}
              >
                {opt.label}
              </li>
            ))
          ) : (
            <li className="px-3 py-2 text-gray-400">Nenhum resultado</li>
          )}
        </ul>
      )}

      {/* Helper/Erro */}
      {error ? (
        <p id={`${id}-error`} className="p-1 text-xs text-red-500">
          {error}
        </p>
      ) : helperText ? (
        <p id={`${id}-help`} className="p-1 text-xs text-gray-500">
          {helperText}
        </p>
      ) : null}
    </div>
  );
};

export default SelectSearch;
