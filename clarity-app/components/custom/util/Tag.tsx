import { MouseEventHandler } from "react";

export default function Tag({
  children,
  color,
  className,
  onClick,
}: {
  children: React.ReactNode;
  color?: string;
  className?: string;
  onClick?: MouseEventHandler;
}) {
  return (
    <span
      onClick={onClick}
      className={`bg-${
        color == null ? "primary" : color + "-400"
      } font-medium flex items-center justify-center px-4 rounded-full text-primary-foreground cursor-pointer hover:brightness-80 transition-all ${className}`}
    >
      {children}
    </span>
  );
}
