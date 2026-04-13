import type { ReactNode } from 'react';

interface LetterSectionProps {
  title: string;
  children: ReactNode;
}

export function LetterSection({ title, children }: LetterSectionProps) {
  return (
    <section className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      {children}
    </section>
  );
}
