import React, { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  "aria-label"?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  className = "",
  type = "button",
  disabled = false,
  "aria-label": ariaLabel,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${className}`}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
};

export default Button;