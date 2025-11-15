"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";

import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  isLoading?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, children, variant = "primary", isLoading, disabled, ...rest },
    ref,
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";
    const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
      primary:
        "bg-brand text-white hover:bg-brand-dark focus-visible:outline-brand",
      secondary:
        "bg-slate-100 text-slate-900 hover:bg-slate-200 focus-visible:outline-slate-400",
      ghost:
        "text-slate-600 hover:bg-slate-100 focus-visible:outline-slate-300",
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          (disabled || isLoading) && "cursor-not-allowed opacity-60",
          className,
        )}
        disabled={disabled || isLoading}
        {...rest}
      >
        {isLoading ? "Please wait..." : children}
      </button>
    );
  },
);

Button.displayName = "Button";
