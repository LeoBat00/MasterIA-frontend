"use client";
import React, { useId, useRef, useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import { ptBR } from "date-fns/locale";
import { format, parse, isValid } from "date-fns";
import { FaCalendar } from "react-icons/fa";
import clsx from "clsx";
import "react-day-picker/dist/style.css";

export interface DatePickerProps {
  label?: string;
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "underline";
  required?: boolean;
  containerClassName?: string;
  inputClassName?: string;
}

const paddingsBySize: Record<string, string> = {
  sm: "py-1.5 pl-3 pr-9",
  md: "py-2 pl-3 pr-10",
  lg: "py-3 pl-4 pr-12",
};

const heightBySize: Record<string, string> = {
  sm: "h-9",
  md: "h-10",
  lg: "h-12",
};

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onChange,
  placeholder = "dd/mm/aaaa",
  error,
  helperText,
  disabled = false,
  fullWidth = true,
  size = "md",
  variant = "default",
  required = false,
  containerClassName,
  inputClassName,
}) => {
  const id = useId();
  const [inputValue, setInputValue] = useState(value ? format(value, "dd/MM/yyyy") : "");
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<"top" | "bottom">("bottom");
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Atualiza input quando value externo muda
  useEffect(() => {
    if (value) {
      setInputValue(format(value, "dd/MM/yyyy"));
    } else {
      setInputValue("");
    }
  }, [value]);

  // Fecha ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Determina se abre em cima ou embaixo
  useEffect(() => {
    if (open && wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      setPosition(windowHeight - rect.bottom < 300 ? "top" : "bottom");
    }
  }, [open]);

  const [displayMonth, setDisplayMonth] = useState<Date>(value ?? new Date());

  const handleInputChange = (val: string) => {
    const onlyNumbers = val.replace(/\D/g, "");
    let formatted = onlyNumbers;

    if (onlyNumbers.length >= 2) {
      formatted = onlyNumbers.slice(0, 2) + "/" + onlyNumbers.slice(2);
    }
    if (onlyNumbers.length >= 4) {
      formatted = formatted.slice(0, 5) + "/" + onlyNumbers.slice(4, 8);
    }

    setInputValue(formatted);

    // Só dispara quando completar 8 dígitos (ddMMyyyy)
    if (onlyNumbers.length === 8) {
      const parsed = parse(formatted, "dd/MM/yyyy", new Date());
      if (isValid(parsed)) {
        onChange?.(parsed);
        setDisplayMonth(parsed); // 👉 força o calendário para o mês digitado
      }
    }
  };

  const handleSelect = (date: Date | undefined) => {
    if (disabled) return;
    if (date) {
      setInputValue(format(date, "dd/MM/yyyy"));
      onChange?.(date);
    } else {
      setInputValue("");
      onChange?.(undefined);
    }
    setOpen(false);
  };

  const baseBorder =
    variant === "default"
      ? clsx(
        "border",
        error ? "border-red-500" : "border-[var(--color-purple-2)]",
        "rounded-[8px]"
      )
      : "border-b " + (error ? "border-red-500" : "border-[var(--color-purple-2)]");

  return (
    <div
      ref={wrapperRef}
      className={clsx("w-full relative", fullWidth && "block", containerClassName)}
    >
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold mb-1">
          {label} {required && <span className="text-white">*</span>}
        </label>
      )}

      <div
        className={clsx(
          "relative flex items-center w-full bg-[#12121B] overflow-hidden",
          baseBorder,
          disabled && "opacity-60 cursor-not-allowed",
          heightBySize[size],
          inputClassName
        )}
      >
        <input
          id={id}
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={clsx(
            "w-full outline-none placeholder-[#868686] bg-transparent",
            paddingsBySize[size]
          )}
        />
        <button
          type="button"
          onClick={() => setOpen((s) => !s)}
          className="absolute right-3 text-gray-400 hover:text-gray-600"
        >
          <FaCalendar size={18} />
        </button>
      </div>

      {/* Erro/Helper */}
      {error ? (
        <p className="p-1 text-xs text-red-500">{error}</p>
      ) : helperText ? (
        <p className="p-1 text-xs text-gray-500">{helperText}</p>
      ) : null}

      {open && (
        <div
          className={clsx(
            "absolute z-50 bg-[#12121B] border border-gray-700 rounded-lg shadow-lg",
            position === "top" ? "bottom-full mb-2" : "top-full mt-2"
          )}
        >
          <DayPicker
            mode="single"
            selected={value}
            onSelect={handleSelect}
            locale={ptBR}
            // 👉 garante que, se o calendário já estiver aberto, ele "vai" para o mês digitado
            month={displayMonth}             // controlado pelo estado local
            onMonthChange={setDisplayMonth}
            className="p-4 min-h-[380px]"
            classNames={{
              day: "w-8 h-8 m-0.5 rounded hover:bg-purple-500/20 focus:outline-none focus:ring-2 focus:ring-purple-500/40 disabled:opacity-50",
            }}
          />
        </div>
      )}
    </div>
  );
};
