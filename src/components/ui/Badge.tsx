import { cn } from '@/lib/utils';

type Variant = 'green' | 'yellow' | 'red' | 'blue' | 'muted';

const variants: Record<Variant, string> = {
  green:  'bg-green-950 text-green-400 border border-green-800/50',
  yellow: 'bg-yellow-950 text-yellow-400 border border-yellow-800/50',
  red:    'bg-red-950 text-red-400 border border-red-800/50',
  blue:   'bg-blue-950 text-blue-400 border border-blue-800/50',
  muted:  'bg-neutral-800 text-neutral-400 border border-neutral-700',
};

export function Badge({
  children,
  variant = 'muted',
  className,
}: {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold font-mono tracking-wide',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export function authBadge(val: string | undefined) {
  if (!val) return <Badge variant="muted">—</Badge>;
  if (val === 'pass') return <Badge variant="green">{val}</Badge>;
  if (val === 'fail') return <Badge variant="red">{val}</Badge>;
  return <Badge variant="yellow">{val}</Badge>;
}

export function dispositionBadge(val: string | undefined) {
  if (!val || val === 'none') return <Badge variant="muted">none</Badge>;
  if (val === 'quarantine')   return <Badge variant="yellow">{val}</Badge>;
  return <Badge variant="red">{val}</Badge>;
}
