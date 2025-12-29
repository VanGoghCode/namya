import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline";
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  children,
  className = "",
  ...props
}) => {
  const baseStyles =
    "px-8 py-3 rounded-full transition-all duration-300 font-medium tracking-wide text-sm uppercase transform hover:scale-105 active:scale-95";
  const variants = {
    primary:
      "bg-[#5D4037] text-white hover:bg-[#4E342E] shadow-lg hover:shadow-xl",
    outline:
      "border-2 border-[#5D4037] text-[#5D4037] hover:bg-[#5D4037] hover:text-white",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
