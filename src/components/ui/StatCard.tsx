import { cn } from '@/lib/utils';

type Tone = 'default' | 'pass' | 'warn' | 'fail';

const tones: Record<Tone, string> = {
  default: 'text-blue-400',
  pass:    'text-green-400',
  warn:    'text-yellow-400',
  fail:    'text-red-400',
};

export function StatCard({
  label,
  value,
  sub,
  tone = 'default',
  children,
}: {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  tone?: Tone;
  children?: React.ReactNode;
}) {
  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-md p-4">
      <p className="text-[11px] uppercase tracking-widest text-neutral-500 mb-2">{label}</p>
      <p className={cn('text-3xl font-bold font-mono leading-none mb-1', tones[tone])}>{value}</p>
      {sub && <p className="text-xs text-neutral-500">{sub}</p>}
      {children}
    </div>
  );
}
