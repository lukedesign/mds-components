/** Utilidades de cor para as variantes translúcidas (composição de camadas
 * com alpha feita em JS para gerar um rgba() único, portável para web e RN). */

export interface AlphaLayer {
  /** Cor hex (#rgb, #rrggbb ou #rrggbbaa) vinda dos tokens. */
  color: string;
  /** Opacidade da camada no Figma (0..1). */
  alpha: number;
}

function hexToRgba(hex: string): { r: number; g: number; b: number; a: number } {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const a = h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1;
  return { r, g, b, a };
}

/**
 * Compõe camadas semi-transparentes (na ordem em que o Figma as empilha, da
 * de baixo para a de cima) em um único rgba(). Compositing "source over".
 */
export function compositeLayers(layers: AlphaLayer[]): string {
  let r = 0;
  let g = 0;
  let b = 0;
  let a = 0;
  for (const layer of layers) {
    const c = hexToRgba(layer.color);
    const la = c.a * layer.alpha;
    const outA = la + a * (1 - la);
    if (outA === 0) continue;
    r = (c.r * la + r * a * (1 - la)) / outA;
    g = (c.g * la + g * a * (1 - la)) / outA;
    b = (c.b * la + b * a * (1 - la)) / outA;
    a = outA;
  }
  return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${Number(a.toFixed(4))})`;
}

export function withAlpha(color: string, alpha: number): string {
  return compositeLayers([{ color, alpha }]);
}
