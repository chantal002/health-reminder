import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          {
            "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500":
              variant === "primary",
            "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-400":
              variant === "secondary",
            "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500":
              variant === "danger",
            "hover:bg-gray-100 text-gray-700 focus:ring-gray-400":
              variant === "ghost",
            "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-indigo-500":
              variant === "outline",
          },
          {
            "text-xs px-2.5 py-1.5 gap-1": size === "sm",
            "text-sm px-4 py-2 gap-2": size === "md",
            "text-base px-6 py-3 gap-2": size === "lg",
          },
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
export default Button;
