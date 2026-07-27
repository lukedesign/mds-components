/**
 * Tipo estrutural do objeto de tokens produzido pelo build do @mds/tokens
 * (dist/web/<marca>/<modo>.ts e dist/react-native/<marca>/<modo>.ts).
 *
 * Os componentes NUNCA importam uma marca específica — recebem o objeto de
 * tokens via provider e este tipo garante só o subconjunto que os componentes
 * usam. Dimensões são `string | number` porque a web emite "8px" e o React
 * Native emite 8.
 */

export type Dim = string | number;

export type VisualRole = 'primary' | 'secondary' | 'tertiary' | 'complementary';
export type FeedbackRole = 'info' | 'critical' | 'caution' | 'success';
export type LabelSize = 'xLarge' | 'large' | 'medium' | 'small' | 'xSmall';
export type RadiusScale = 'base' | 'producao';

export interface TypeStyle {
  fontFamily: string;
  fontWeight: Dim;
  fontSize: Dim;
  lineHeight: Dim;
  kerning: Dim;
}

export interface MdsTokens {
  brandModifier: string;
  /** Papéis visuais da marca (visual/onVisual/visualContainer/...). */
  visual: Record<VisualRole, Record<string, string>>;
  /** Papéis de feedback (feedback/onFeedback/feedbackContainer/...). */
  feedback: Record<FeedbackRole, Record<string, string>>;
  /** Camada estável de interface — checkpoint documentado no repo de tokens. */
  interface: Record<string, string>;
  label: Record<LabelSize, TypeStyle>;
  paragraph: Record<LabelSize, TypeStyle>;
  gap: Record<string, Dim>;
  'inset-deprecated': Record<string, Dim>;
  radii: Record<RadiusScale, Record<string, Dim>>;
}
