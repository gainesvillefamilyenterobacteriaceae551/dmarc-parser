import { useMemo } from 'react';
import type { DmarcRecord } from '@/lib/types';
import { rowStatus } from '@/lib/parse';
import { StatCard } from '@/components/ui/StatCard';
import { Badge } from '@/components/ui/Badge';

export function SummaryDashboard({
  records,
  fileCount,
}: {
  records: DmarcRecord[];
  fileCount: number;
}) {
  const stats = useMemo(() => {
    const total     = records.reduce((s, r) => s + r.count, 0);
    const passCount = records.filter(r => rowStatus(r) === 'pass').reduce((s, r) => s + r.count, 0);
    const passRate  = total > 0 ? Math.round((passCount / total) * 100) : 0;
    const uniqueIPs = new Set(records.map(r => r.ip)).size;
    const reporters = new Set(records.map(r => r.reporter));

    const dates = records
      .flatMap(r => [r.dateBegin, r.dateEnd])
      .filter(d => d && d !== '—')
      .sort();
    const dateMin = dates[0]              ?? '—';
    const dateMax = dates[dates.length-1] ?? '—';
    let daysDiff = '—';
    if (dateMin !== '—' && dateMax !== '—') {
      const d = (new Date(dateMax).getTime() - new Date(dateMin).getTime()) / 86_400_000;
      daysDiff = d === 0 ? 'same day' : `${Math.round(d) + 1} days`;
    }

    // Infrastructure from selectors
    const infraMap = new Map<string, number>();
    records.forEach(r => {
      if (r.sender && r.sender !== '—') {
        infraMap.set(r.sender, (infraMap.get(r.sender) ?? 0) + r.count);
      }
    });

    const passTone = passRate >= 95 ? 'pass' : passRate >= 70 ? 'warn' : 'fail';

    return { total, passCount, passRate, uniqueIPs, reporters, dateMin, dateMax, daysDiff, infraMap, passTone };
  }, [records]);

  return (
    <div className="space-y-4">
      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <StatCard
          label="Total Messages"
          value={stats.total.toLocaleString()}
          sub={`${fileCount} report file${fileCount !== 1 ? 's' : ''}`}
          tone="default"
        />
        <StatCard
          label="Pass Rate"
          value={`${stats.passRate}%`}
          sub={`${stats.passCount.toLocaleString()} / ${stats.total.toLocaleString()} messages`}
          tone={stats.passTone as 'pass' | 'warn' | 'fail'}
        >
          <div className="mt-2 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
            <div
              className={
                stats.passTone === 'pass' ? 'h-full bg-green-500 rounded-full transition-all' :
                stats.passTone === 'warn' ? 'h-full bg-yellow-500 rounded-full transition-all' :
                                            'h-full bg-red-500 rounded-full transition-all'
              }
              style={{ width: `${stats.passRate}%` }}
            />
          </div>
        </StatCard>
        <StatCard
          label="Date Range"
          value={
            <span className="text-base">
              {stats.dateMin === stats.dateMax ? stats.dateMin : `${stats.dateMin} → ${stats.dateMax}`}
            </span>
          }
          sub={stats.daysDiff}
          tone="default"
        />
        <StatCard
          label="Unique IPs"
          value={stats.uniqueIPs}
          sub="source addresses"
          tone="default"
        />
        <StatCard
          label="Reporters"
          value={stats.reporters.size}
          sub="organisations"
          tone="default"
        />
      </div>

      {/* Infrastructure */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-md p-4">
        <p className="text-[11px] uppercase tracking-widest text-neutral-500 mb-3">
          Detected sending infrastructure
        </p>
        <div className="flex flex-wrap gap-2">
          {stats.infraMap.size === 0 ? (
            <span className="text-xs text-neutral-600">No selectors found</span>
          ) : (
            [...stats.infraMap.entries()]
              .sort((a, b) => b[1] - a[1])
              .map(([name, count]) => (
                <Badge key={name} variant="blue" className="text-xs">
                  {name} &nbsp; {count.toLocaleString()}
                </Badge>
              ))
          )}
        </div>
      </div>
    </div>
  );
}
