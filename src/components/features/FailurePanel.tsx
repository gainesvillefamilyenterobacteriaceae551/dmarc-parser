import { useMemo } from 'react';
import type { DmarcRecord } from '@/lib/types';
import { rowStatus } from '@/lib/parse';
import { authBadge, dispositionBadge, Badge } from '@/components/ui/Badge';

function AuthRow({ label, val }: { label: string; val: string }) {
  const color = val === 'pass' ? 'text-green-400' : val === 'fail' ? 'text-red-400' : 'text-neutral-400';
  return (
    <div className="flex gap-2 leading-loose">
      <span className="text-neutral-500 font-mono text-xs w-20 shrink-0">{label}</span>
      <span className={`font-mono text-xs ${color}`}>{val}</span>
    </div>
  );
}

function FailureCard({ rec }: { rec: DmarcRecord }) {
  return (
    <div className="bg-[#161b22] border border-red-900 border-l-[3px] border-l-red-500 rounded-md p-4 mb-2">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <Badge variant="muted" className="font-mono">{rec.ip}</Badge>
        <span className="text-sm text-neutral-300">{rec.reporter}</span>
        <Badge variant="muted">{rec.dateBegin}</Badge>
        <Badge variant="blue">{rec.count.toLocaleString()} msg{rec.count !== 1 ? 's' : ''}</Badge>
        <span className="flex items-center gap-1 text-xs text-neutral-400">{authBadge(rec.dkim)} DKIM</span>
        <span className="flex items-center gap-1 text-xs text-neutral-400">{authBadge(rec.spf)} SPF</span>
        {dispositionBadge(rec.disposition)}
      </div>

      <div className="bg-[#0d1117] rounded p-3">
        {rec.dkimResults.length > 0
          ? rec.dkimResults.map((d, i) => (
              <AuthRow
                key={i}
                label="dkim"
                val={`${d.domain} · selector: ${d.selector || '—'} · ${d.result || '—'}`}
              />
            ))
          : <AuthRow label="dkim" val="no results" />
        }
        {rec.spfResults.length > 0
          ? rec.spfResults.map((s, i) => (
              <AuthRow
                key={i}
                label="spf"
                val={`${s.domain}${s.scope ? ` (${s.scope})` : ''} · ${s.result || '—'}`}
              />
            ))
          : <AuthRow label="spf" val="no results" />
        }
        {rec.policyP && (
          <AuthRow
            label="policy"
            val={`p=${rec.policyP}  adkim=${rec.policyDkim || 'r'}  aspf=${rec.policySpf || 'r'}`}
          />
        )}
        <AuthRow label="disposition" val={rec.disposition} />
      </div>
    </div>
  );
}

export function FailurePanel({ records }: { records: DmarcRecord[] }) {
  const failures = useMemo(
    () => records.filter(r => rowStatus(r) !== 'pass').sort((a, b) => b.count - a.count),
    [records]
  );

  if (failures.length === 0) return null;

  return (
    <div>
      <h2 className="text-sm font-semibold text-red-400 mb-3">⚠ Failure Details</h2>
      {failures.map((rec, i) => <FailureCard key={i} rec={rec} />)}
    </div>
  );
}
