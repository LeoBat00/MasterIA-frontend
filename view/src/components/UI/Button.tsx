import React from "react";
import clsx from "clsx";
import { FiLoader } from "react-icons/fi";

export type ButtonSize = "sm" | "md" | "lg";
export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "outlineGhost"| "aba" | "abaSelecionada" | "outlineGhostPurple";

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    size?: ButtonSize;
    variant?: ButtonVariant;
    fullWidth?: boolean;
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    className?: string;
}

const paddingsBySize: Record<ButtonSize, string> = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-3 text-lg",
};

const Button: React.FC<ButtonProps> = ({
    children,
    size = "md",
    variant = "primary",
    fullWidth = false,
    isLoading = false,
    leftIcon,
    rightIcon,
    disabled,
    className,
    ...rest
}) => {
    const baseStyles =
        "inline-flex items-center justify-center rounded-md transition-colors duration-150 cursor-pointer ";

    const variantStyles: Record<ButtonVariant, { base: string; hover?: string }> = {
        primary: { base: "bg-[var(--color-button-primary)] text-black", hover: "hover:opacity-90" },
        secondary: { base: "bg-[var(--color-button-secondary)] text-black", hover: "hover:opacity-90" },
        outline: { base: "border border-[var(--color-purple-3)]/23 text-white", hover: "hover:border-[var(--color-purple-1)]" },
        ghost: { base: "bg-transparent text-[var(--color-purple-2)]", hover: "hover:bg-[var(--color-purple-3)] hover:text-white" },
        outlineGhost: {
            base: "border border-[var(--color-button-primary)] text-[var(--color-button-primary)] bg-transparent",
            hover: "hover:bg-[var(--color-button-primary)] hover:text-black",
        },
        aba: { base: "border-b-6 border-transparent text-[var(--color-purple-2)]", hover: "hover:text-white" },
        abaSelecionada: { base: "border-b-6 border-[var(--color-purple-1)] text-white rounded-none" },
        outlineGhostPurple: {
            base: "border border-[var(--color-purple-2)] text-[var(--color-purple-2)] bg-transparent",
            hover: "hover:bg-[var(--color-purple-2)] hover:text-white",
        },
    };

    return (
        <button
            className={clsx(
                baseStyles,
                paddingsBySize[size],
                variantStyles[variant].base,
                !(disabled || isLoading) && variantStyles[variant].hover,
                fullWidth && "w-full",
                (disabled || isLoading) && "opacity-60 cursor-default",
                className
            )}
            disabled={disabled || isLoading}
            {...rest}
        >
            {/* Ícone esquerdo */}
            {leftIcon && (
                <span className="mr-2 flex items-center text-[var(--color-purple-2)] pb-0.5">
                    {React.isValidElement(leftIcon)
                        ? React.cloneElement(leftIcon as any, { size: 18 })
                        : leftIcon}
                </span>
            )}

            {/* Texto ou spinner */}
            {isLoading ? (
                <FiLoader className="animate-spin" size={18} />
            ) : (
                children
            )}

            {/* Ícone direito */}
            {rightIcon && (
                <span className="flex items-center text-[var(--color-purple-2)] pb-0.5 ml-auto">
                    {React.isValidElement(rightIcon)
                        ? React.cloneElement(rightIcon as any, { size: 18 })
                        : rightIcon}
                </span>
            )}
        </button>
    );
};

export default Button;
