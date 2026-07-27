const injected = new Set<string>();

/** Injeta uma folha de estilo estática uma única vez por documento. Os valores
 * dinâmicos (por marca/modo/props) entram via CSS custom properties definidas
 * inline pelos componentes — o CSS estático só descreve estrutura e estados. */
export function injectOnce(id: string, css: string): void {
  if (typeof document === 'undefined' || injected.has(id)) return;
  if (!document.getElementById(id)) {
    const style = document.createElement('style');
    style.id = id;
    style.textContent = css;
    document.head.appendChild(style);
  }
  injected.add(id);
}
