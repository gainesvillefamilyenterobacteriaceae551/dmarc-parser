'use client';

import { useState, useCallback } from 'react';
import { parseXML } from '@/lib/parse';
import { readZip } from '@/lib/zip';
import type { DmarcRecord } from '@/lib/types';
import { DropZone } from '@/components/ui/DropZone';
import { Toast, type ToastMsg } from '@/components/ui/Toast';
import { SummaryDashboard } from '@/components/features/SummaryDashboard';
import { RecordsTable } from '@/components/features/RecordsTable';
import { FailurePanel } from '@/components/features/FailurePanel';

interface PendingFile {
  name: string;
  content: string;
}

export function Analyser() {
  const [pending, setPending]     = useState<PendingFile[]>([]);
  const [records, setRecords]     = useState<DmarcRecord[]>([]);
  const [loading, setLoading]     = useState(false);
  const [toast, setToast]         = useState<ToastMsg | null>(null);
  const [analysed, setAnalysed]   = useState(false);

  const showToast = useCallback((text: string, type: ToastMsg['type']) => {
    setToast({ text, type, id: Date.now() });
  }, []);

  const handleFiles = useCallback(async (files: FileList) => {
    const newFiles: PendingFile[] = [];
    const existing = new Set(pending.map(f => f.name));

    for (const file of Array.from(files)) {
      const name = file.name.toLowerCase();
      if (name.endsWith('.xml')) {
        if (!existing.has(file.name)) {
          newFiles.push({ name: file.name, content: await file.text() });
        }
      } else if (name.endsWith('.zip')) {
        const buf     = await file.arrayBuffer();
        const entries = await readZip(buf);
        for (const e of entries) {
          if (!existing.has(e.name)) {
            newFiles.push({ name: e.name, content: e.content });
          }
        }
      }
    }

    if (newFiles.length > 0) {
      setPending(prev => [...prev, ...newFiles]);
    }
  }, [pending]);

  const removeFile = useCallback((name: string) => {
    setPending(prev => prev.filter(f => f.name !== name));
  }, []);

  const handleAnalyse = useCallback(async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 10));

    const allRecords: DmarcRecord[] = [];
    const errors: string[]          = [];

    for (const f of pending) {
      try {
        const result = parseXML(f.content, f.name);
        allRecords.push(...result.records);
      } catch (e) {
        errors.push(`${f.name}: ${(e as Error).message}`);
      }
    }

    setLoading(false);

    if (errors.length) {
      showToast(`Parse errors: ${errors.join('; ')}`, 'error');
    }

    if (allRecords.length === 0) {
      showToast('No records found', 'error');
      return;
    }

    setRecords(allRecords);
    setAnalysed(true);
    showToast(`Loaded ${allRecords.length} record${allRecords.length !== 1 ? 's' : ''}`, 'success');
  }, [pending, showToast]);

  const handleClear = useCallback(() => {
    setPending([]);
    setRecords([]);
    setAnalysed(false);
  }, []);

  return (
    <div className="space-y-6">
      {/* Drop zone */}
      <DropZone onFiles={handleFiles} />

      {/* File queue */}
      {pending.length > 0 && (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {pending.map(f => (
              <span
                key={f.name}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#21262d] border border-[#30363d] rounded-full text-xs text-neutral-400 font-mono"
              >
                {f.name}
                <button
                  onClick={() => removeFile(f.name)}
                  className="text-neutral-600 hover:text-red-400 transition-colors leading-none"
                  title="Remove"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              disabled={loading}
              onClick={handleAnalyse}
              className="flex items-center gap-2 px-4 py-2 bg-[#238636] hover:bg-[#2ea043] border border-[#2ea043] text-white text-sm font-medium rounded-md transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading && (
                <span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              Analyse reports
            </button>
            <button
              onClick={handleClear}
              className="px-4 py-2 bg-red-950/50 hover:bg-red-950 border border-red-800 text-red-400 text-sm font-medium rounded-md transition-colors"
            >
              Clear all
            </button>
            <span className="ml-auto text-xs text-neutral-600 font-mono">
              {pending.length} file{pending.length !== 1 ? 's' : ''} queued
            </span>
          </div>
        </div>
      )}

      {/* Dashboard */}
      {analysed && records.length > 0 && (
        <>
          <SummaryDashboard records={records} fileCount={pending.length} />

          <div>
            <h2 className="text-sm font-semibold text-neutral-200 mb-3">Records</h2>
            <RecordsTable records={records} />
          </div>

          <FailurePanel records={records} />
        </>
      )}

      {/* Toast */}
      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
