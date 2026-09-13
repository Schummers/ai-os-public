import { cn } from "@/lib/cn";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "border border-border rounded-none bg-bg p-md",
        className
      )}
    >
      {children}
    </div>
  );
}
