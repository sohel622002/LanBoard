import { cn } from "@/lib/utils";

type Tone = "success" | "warning" | "destructive" | "info" | "neutral";

const toneClasses: Record<Tone, string> = {
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  destructive: "bg-destructive/15 text-destructive",
  info: "bg-info/15 text-info",
  neutral: "bg-muted text-muted-foreground",
};

function Dot({ tone }: { tone: Tone }) {
  return (
    <span
      className={cn(
        "size-1.5 rounded-full",
        tone === "success" && "bg-success",
        tone === "warning" && "bg-warning",
        tone === "destructive" && "bg-destructive",
        tone === "info" && "bg-info",
        tone === "neutral" && "bg-muted-foreground"
      )}
    />
  );
}

function StatusPill({
  tone,
  children,
  className,
}: {
  tone: Tone;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium capitalize whitespace-nowrap",
        toneClasses[tone],
        className
      )}
    >
      <Dot tone={tone} />
      {children}
    </span>
  );
}

const PROJECT_STATUS_TONE: Record<string, Tone> = {
  active: "success",
  completed: "success",
  design: "info",
  pending: "warning",
  "on hold": "warning",
  cancelled: "destructive",
  archived: "neutral",
};

export function StatusBadge({
  status,
  className,
}: {
  status?: string | null;
  className?: string;
}) {
  if (!status) return null;
  const tone = PROJECT_STATUS_TONE[status.toLowerCase()] ?? "neutral";
  return (
    <StatusPill tone={tone} className={className}>
      {status.toLowerCase()}
    </StatusPill>
  );
}

const PRIORITY_TONE: Record<string, Tone> = {
  HIGH: "destructive",
  MEDIUM: "warning",
  LOW: "info",
};

export function PriorityBadge({
  priority,
  className,
}: {
  priority?: string | null;
  className?: string;
}) {
  if (!priority) return null;
  const tone = PRIORITY_TONE[priority.toUpperCase()] ?? "neutral";
  return (
    <StatusPill tone={tone} className={className}>
      {priority.toLowerCase()}
    </StatusPill>
  );
}
