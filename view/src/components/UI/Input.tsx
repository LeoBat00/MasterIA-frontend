import React, { forwardRef, useId, useState } from "react";
import clsx from "clsx";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { IMaskInput } from "react-imask";

export type InputSize = "sm" | "md" | "lg";
export type InputVariant = "default" | "underline";

export interface InputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "onChange" | "value"> {
    label?: string;
    value?: string;
    onChange?: (value: string) => void;
    error?: string;
    helperText?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    onLeftIconClick?: () => void;
    onRightIconClick?: () => void;
    size?: InputSize;
    variant?: InputVariant;
    fullWidth?: boolean;
    containerClassName?: string; // wrapper externo (label + campo + erro)
    inputClassName?: string;     // apenas o <input/>
    passwordToggle?: boolean;
    mask?: string;
    number?: boolean;
}

const paddingsBySize: Record<InputSize, string> = {
    sm: "py-1.5 pl-3 pr-3",
    md: "py-2 pl-3 pr-3",
    lg: "py-3 pl-4 pr-4",
};

const heightBySize: Record<InputSize, string> = {
    sm: "h-9",
    md: "h-10",
    lg: "h-12",
};

const iconSpaceBySize: Record<InputSize, { left: string; right: string; icon: number }> = {
    sm: { left: "pl-9", right: "pr-9", icon: 16 },
    md: { left: "pl-10", right: "pr-10", icon: 18 },
    lg: { left: "pl-12", right: "pr-12", icon: 20 },
};

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
    {
        label,
        value,
        onChange,
        placeholder,
        error,
        helperText,
        leftIcon,
        rightIcon,
        onLeftIconClick,
        onRightIconClick,
        size = "md",
        variant = "default",
        fullWidth = true,
        className,
        containerClassName,
        inputClassName,
        passwordToggle = false,
        type = "text",
        maxLength,
        disabled,
        required,
        number = false,
        mask,
        ...rest
    },
    ref
) {
    const id = useId();
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";
    const effectiveType = isPassword && passwordToggle ? (showPassword ? "text" : "password") : type;

    const withLeft = Boolean(leftIcon);
    // se existir rightIcon use-o; senão, se for senha e passwordToggle=true, usa o olho
    const willShowPasswordToggle = isPassword && passwordToggle && !rightIcon;

    const withRight = Boolean(rightIcon) || willShowPasswordToggle;

    const baseBorder =
        variant === "default"
            ? clsx(
                "border",
                error ? "border-red-500" : "border-[var(--color-purple-1)]",
                "rounded"
            )
            : "border-b " + (error ? "border-red-500" : "border-[var(--color-purple-1)]");

    const focusStyles =
        variant === "default"
            ? "focus-within:ring-2 focus-within:ring-black"
            : "focus-within:border-b-black";

    // Função para tratar input numérico
    const handleNumericChange = (val: string) => {
        const onlyNumbers = val.replace(/\D/g, ""); // remove tudo que não for número
        onChange?.(onlyNumbers);
    };

    // Função para tratar o onChange geral
    const handleChange = (val: string) => {
        if (number) {
            handleNumericChange(val);
        } else {
            onChange?.(val);
        }
    };

    return (
        <div className={clsx("w-full", fullWidth && "block", containerClassName)}>
            {label && (
                <label
                    htmlFor={id}
                    className="block text-xs font-semibold mb-1"
                >
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}

            <div
                className={clsx(
                    "relative flex items-center w-full",
                    baseBorder,
                    focusStyles,
                    disabled && "opacity-60 cursor-not-allowed",
                    heightBySize[size],
                    className
                )}
            >
                {/* Ícone esquerdo */}
                {withLeft && (
                    <button
                        type="button"
                        onClick={onLeftIconClick}
                        tabIndex={-1}
                        className={clsx(
                            "absolute left-3 text-gray-400 hover:text-gray-600",
                            "flex items-center justify-center"
                        )}
                    >
                        {React.isValidElement(leftIcon) ? React.cloneElement(leftIcon as any, { size: iconSpaceBySize[size].icon }) : leftIcon}
                    </button>
                )}

                {mask ? (
                    <IMaskInput
                        mask={mask}
                        // se quiser que o onAccept te entregue o valor "cru" (sem máscara), ative:
                        // unmask={true}
                        onAccept={(val: unknown) =>
                            handleChange(number ? String(val).replace(/\D/g, "") : String(val))
                        }
                        id={id}
                        inputRef={ref} // << use inputRef no lugar de ref
                        value={value ?? ""}
                        type={effectiveType}
                        placeholder={placeholder}
                        // maxLength com máscara geralmente não é necessário; pode até atrapalhar
                        disabled={disabled}
                        aria-invalid={!!error}
                        aria-describedby={error ? `${id}-error` : helperText ? `${id}-help` : undefined}
                        // ajuda no mobile se for só números:
                        inputMode={number ? "numeric" : undefined}
                        pattern={number ? "\\d*" : undefined}
                        className={clsx(
                            "w-full outline-none placeholder-[#868686] bg-transparent",
                            paddingsBySize[size],
                            withLeft && iconSpaceBySize[size].left,
                            withRight && iconSpaceBySize[size].right,
                            variant === "underline" && "rounded-none",
                            inputClassName
                        )}
                        {...rest}
                    />
                ) : (
                    <input
                        id={id}
                        ref={ref}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e.target.value)}
                        value={value ?? ""}
                        type={effectiveType}
                        placeholder={placeholder}
                        maxLength={maxLength}
                        disabled={disabled}
                        aria-invalid={!!error}
                        aria-describedby={error ? `${id}-error` : helperText ? `${id}-help` : undefined}
                        inputMode={number ? "numeric" : undefined}
                        pattern={number ? "\\d*" : undefined}
                        className={clsx(
                            "w-full outline-none placeholder-[#868686] bg-transparent",
                            paddingsBySize[size],
                            withLeft && iconSpaceBySize[size].left,
                            withRight && iconSpaceBySize[size].right,
                            variant === "underline" && "rounded-none",
                            inputClassName
                        )}
                        {...rest}
                    />
                )}

                {/* Ícone direito ou toggle de senha */}
                {withRight && (
                    <button
                        type="button"
                        onClick={
                            willShowPasswordToggle
                                ? () => setShowPassword((s) => !s)
                                : onRightIconClick
                        }
                        tabIndex={-1}
                        className={clsx(
                            "absolute right-3 text-gray-400 hover:text-gray-600",
                            "flex items-center justify-center"
                        )}
                        aria-label={
                            willShowPasswordToggle
                                ? showPassword
                                    ? "Ocultar senha"
                                    : "Mostrar senha"
                                : "Action icon"
                        }
                    >
                        {willShowPasswordToggle ? (
                            showPassword ? <FiEyeOff size={iconSpaceBySize[size].icon} /> : <FiEye size={iconSpaceBySize[size].icon} />
                        ) : (
                            React.isValidElement(rightIcon) ? React.cloneElement(rightIcon as any, { size: iconSpaceBySize[size].icon }) : rightIcon
                        )}
                    </button>
                )}
            </div>

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
});

export default Input;
