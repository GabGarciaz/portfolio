/** Rótulo de seção no estilo do terminal da intro: "01 / sobre". */
export function SectionLabel({ index, children }: { index: number; children: string }) {
  return (
    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg-dim">
      <span className="text-iris">{String(index).padStart(2, "0")}</span>
      <span className="mx-2 text-fg-faint">/</span>
      {children}
    </span>
  );
}
