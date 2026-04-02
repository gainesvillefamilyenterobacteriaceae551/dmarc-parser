'use client';

import { useEffect } from 'react';
import { cn } from '@/lib/utils';

export interface ToastMsg {
  text: string;
  type: 'success' | 'error' | 'info';
  id: number;
}

export function Toast({ msg, onDone }: { msg: ToastMsg; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [msg.id, onDone]);

  const styles = {
    success: 'border-green-700 text-green-400',
    error:   'border-red-700   text-red-400',
    info:    'border-[#30363d] text-neutral-300',
  };

  return (
    <div
      className={cn(
        'fixed bottom-6 right-6 bg-[#161b22] border rounded-md px-4 py-2.5 text-sm shadow-xl z-50 transition-opacity',
        styles[msg.type]
      )}
    >
      {msg.text}
    </div>
  );
}
