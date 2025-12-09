import { cn } from "@/lib/cn";

export default function Button({ as = "button", variant="solid", className="", ...props }) {
  const Comp = as;
  const base = "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors";
  const styles = {
    solid:   "bg-base-accent text-white hover:opacity-90",
    outline: "border border-base-border text-base-fg hover:bg-base-border/40",
    ghost:   "text-base-fg hover:bg-base-border/50",
  };
  return <Comp className={cn(base, styles[variant], className)} {...props} />;
}
