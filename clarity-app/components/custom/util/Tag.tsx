export default function Tag({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`bg-primary font-medium flex items-center justify-center px-2 rounded-full text-primary-foreground cursor-default hover:brightness-80 transition-all ${className}`}
    >
      {children}
    </span>
  );
}
