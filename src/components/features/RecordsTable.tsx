'use client';

import { useState, useMemo, useCallback } from 'react';
import type { DmarcRecord, SortCol, SortDir } from '@/lib/types';
import { rowStatus } from '@/lib/parse';
import { authBadge, dispositionBadge } from '@/components/ui/Badge';

const PAGE_SIZE = 50;

const rowBg: Record<string, string> = {
  pass:    'hover:bg-green-950/20',
  partial: 'bg-yellow-950/30 hover:bg-yellow-950/50',
  fail:    'bg-red-950/30 hover:bg-red-950/50',
};

function SortIcon({ col, sortCol, sortDir }: { col: SortCol; sortCol: SortCol; sortDir: SortDir }) {
  if (col !== sortCol) return <span className="opacity-20 ml-1">↕</span>;
  return <span className="text-blue-400 ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>;
}

export function RecordsTable({ records }: { records: DmarcRecord[] }) {
  const [sortCol, setSortCol]     = useState<SortCol>('date');
  const [sortDir, setSortDir]     = useState<SortDir>('desc');
  const [search, setSearch]       = useState('');
  const [filterResult, setFilter] = useState('');
  const [filterReporter, setFilterReporter] = useState('');
  const [page, setPage]           = useState(1);

  const reporters = useMemo(
    () => [...new Set(records.map(r => r.reporter))].sort(),
    [records]
  );

  const handleSort = useCallback((col: SortCol) => {
    setSortCol(prev => {
      if (prev === col) { setSortDir(d => d === 'asc' ? 'desc' : 'asc'); return col; }
      setSortDir('asc');
      return col;
    });
    setPage(1);
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return records.filter(r => {
      if (filterResult && rowStatus(r) !== filterResult) return false;
      if (filterReporter && r.reporter !== filterReporter) return false;
      if (q) {
        const hay = [r.ip, r.reporter, r.sender, ...r.selectors, r.disposition].join(' ').toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [records, search, filterResult, filterReporter]);

  const sorted = useMemo(() => {
    const key = sortCol === 'date' ? 'dateBegin' : sortCol;
    return [...filtered].sort((a, b) => {
      const va = (a as unknown as Record<string, unknown>)[key] as string | number;
      const vb = (b as unknown as Record<string, unknown>)[key] as string | number;
      if (va < vb) return sortDir === 'asc' ? -1 :  1;
      if (va > vb) return sortDir === 'asc' ?  1 : -1;
      return 0;
    });
  }, [filtered, sortCol, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const slice      = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const th = (col: SortCol, label: string) => (
    <th
      key={col}
      onClick={() => handleSort(col)}
      className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-neutral-500 border-b border-[#30363d] cursor-pointer hover:text-neutral-300 select-none whitespace-nowrap"
    >
      {label}<SortIcon col={col} sortCol={sortCol} sortDir={sortDir} />
    </th>
  );

  return (
    <div>
      {/* Filter bar */}
      <div className="flex flex-wrap gap-2 mb-3">
        <input
          type="search"
          placeholder="Search IP, selector, sender…"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="bg-[#161b22] border border-[#30363d] rounded-md text-sm text-neutral-200 px-3 py-1.5 outline-none focus:border-blue-600 w-56 placeholder:text-neutral-600"
        />
        <select
          value={filterResult}
          onChange={e => { setFilter(e.target.value); setPage(1); }}
          className="bg-[#161b22] border border-[#30363d] rounded-md text-sm text-neutral-200 px-3 py-1.5 outline-none focus:border-blue-600"
        >
          <option value="">All results</option>
          <option value="pass">Pass</option>
          <option value="partial">Partial</option>
          <option value="fail">Fail</option>
        </select>
        <select
          value={filterReporter}
          onChange={e => { setFilterReporter(e.target.value); setPage(1); }}
          className="bg-[#161b22] border border-[#30363d] rounded-md text-sm text-neutral-200 px-3 py-1.5 outline-none focus:border-blue-600"
        >
          <option value="">All reporters</option>
          {reporters.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <span className="ml-auto text-xs text-neutral-600 self-center font-mono">
          {sorted.length} record{sorted.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-[#30363d] rounded-md">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-[#161b22] sticky top-0 z-10">
            <tr>
              {th('date',        'Date')}
              {th('reporter',    'Reporter')}
              {th('ip',          'Source IP')}
              {th('count',       'Count')}
              {th('dkim',        'DKIM')}
              {th('spf',         'SPF')}
              {th('disposition', 'Disposition')}
              <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-neutral-500 border-b border-[#30363d] whitespace-nowrap">
                Selector(s)
              </th>
              {th('sender', 'Inferred Sender')}
            </tr>
          </thead>
          <tbody>
            {slice.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-12 text-neutral-600 text-sm">
                  No records match the current filters.
                </td>
              </tr>
            ) : (
              slice.map((rec, i) => {
                const status = rowStatus(rec);
                return (
                  <tr key={i} className={`border-b border-[#30363d] last:border-0 transition-colors ${rowBg[status]}`}>
                    <td className="px-3 py-2 font-mono text-xs text-neutral-300 whitespace-nowrap">{rec.dateBegin}</td>
                    <td className="px-3 py-2 text-neutral-300 whitespace-nowrap">{rec.reporter}</td>
                    <td className="px-3 py-2 font-mono text-xs text-blue-400 whitespace-nowrap">{rec.ip}</td>
                    <td className="px-3 py-2 font-mono font-semibold text-neutral-200 whitespace-nowrap">{rec.count.toLocaleString()}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{authBadge(rec.dkim)}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{authBadge(rec.spf)}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{dispositionBadge(rec.disposition)}</td>
                    <td
                      className="px-3 py-2 font-mono text-xs text-neutral-500 max-w-45 truncate whitespace-nowrap"
                      title={rec.selectors.join(', ')}
                    >
                      {rec.selectors.join(', ') || '—'}
                    </td>
                    <td className="px-3 py-2 text-neutral-300 whitespace-nowrap">{rec.sender}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center gap-2 justify-end mt-3">
          <button
            disabled={safePage === 1}
            onClick={() => setPage(p => p - 1)}
            className="px-3 py-1.5 text-sm bg-[#21262d] border border-[#30363d] rounded-md text-neutral-300 hover:bg-[#30363d] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← Prev
          </button>
          <span className="text-xs text-neutral-500 font-mono">
            Page {safePage} / {totalPages}
          </span>
          <button
            disabled={safePage === totalPages}
            onClick={() => setPage(p => p + 1)}
            className="px-3 py-1.5 text-sm bg-[#21262d] border border-[#30363d] rounded-md text-neutral-300 hover:bg-[#30363d] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
