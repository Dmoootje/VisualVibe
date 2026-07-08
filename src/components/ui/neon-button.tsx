import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NeonButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "outline";
  className?: string;
};

export function NeonButton({ href, children, variant = "primary", className }: NeonButtonProps) {
  if (variant === "outline") {
    return (
      <Button
        asChild
        variant="outline"
        className={cn("border-white/20 text-white hover:bg-white/10 h-10 sm:h-12 px-6 sm:px-8 text-sm sm:text-base", className)}
      >
        <Link href={href}>{children}</Link>
      </Button>
    );
  }

  return (
    <Button
      asChild
      className={cn(
        "bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600 text-white border-0 h-10 sm:h-12 px-6 sm:px-8 text-sm sm:text-base",
        className
      )}
    >
      <Link href={href}>{children}</Link>
    </Button>
  );
}
