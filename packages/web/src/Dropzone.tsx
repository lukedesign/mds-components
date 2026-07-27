import {
  useId,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type DragEvent,
  type ReactNode,
} from 'react';
import { deriveInputState, type InputFeedbackRole, type InputRadius } from '@mds/components-core';
import { FieldFrame, FieldIcon, useFieldChrome } from './field';
import { IconAttach, IconFeedbackAlert } from './icons';

export interface DropzoneProps
  extends Omit<ComponentPropsWithoutRef<'input'>, 'type' | 'onChange' | 'value'> {
  label?: ReactNode;
  titleIcon?: ReactNode | null;
  helperText?: ReactNode;
  helperIcon?: ReactNode | null;
  feedback?: InputFeedbackRole;
  feedbackIcon?: ReactNode | null;
  /** Ícone central (default: clipe attach_file do Figma). */
  icon?: ReactNode | null;
  /** Texto central ("Solte os arquivos aqui"). */
  text?: ReactNode;
  radius?: InputRadius;
  fullWidth?: boolean;
  fieldHeight?: number;
  /** Arquivos selecionados (para o contador "n/máx" e o estado preenchido). */
  files?: File[];
  maxFiles?: number;
  onFiles?: (files: File[]) => void;
  className?: string;
  style?: CSSProperties;
}

/** Input/dropzone do Figma: área de upload com borda TRACEJADA, conteúdo
 * centrado em coluna (clipe + texto) e contador de arquivos no helper. */
export function Dropzone({
  label,
  titleIcon,
  helperText,
  helperIcon,
  feedback,
  feedbackIcon,
  icon,
  text = 'Solte os arquivos aqui',
  radius = 'default',
  fullWidth = false,
  fieldHeight = 100,
  files = [],
  maxFiles,
  onFiles,
  disabled,
  id,
  className,
  style,
  ...rest
}: DropzoneProps) {
  const autoId = useId();
  const inputId = id ?? `mds-dropzone-${autoId}`;
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const state = deriveInputState({
    disabled: !!disabled,
    feedback: feedback != null,
    hovered: dragOver,
    hasValue: files.length > 0,
  });
  const chrome = useFieldChrome({ state, feedbackRole: feedback, radius });

  const acceptFiles = (list: FileList | null) => {
    if (!list || disabled) return;
    const next = [...files, ...Array.from(list)].slice(0, maxFiles);
    onFiles?.(next);
  };

  const onDrop = (event: DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    acceptFiles(event.dataTransfer.files);
  };

  const counter = maxFiles != null ? `${files.length}/${maxFiles}` : undefined;

  return (
    <FieldFrame
      chrome={chrome}
      label={label}
      titleIcon={titleIcon}
      helperText={helperText}
      helperIcon={helperIcon}
      helperExtra={counter}
      fullWidth={fullWidth}
      htmlFor={inputId}
      fieldHeight={fieldHeight}
      fieldDashed
      fieldColumn
      fieldProps={{
        role: 'button',
        tabIndex: disabled ? undefined : 0,
        onClick: () => inputRef.current?.click(),
        onKeyDown: (event) => {
          if ((event.key === 'Enter' || event.key === ' ') && !disabled) {
            event.preventDefault();
            inputRef.current?.click();
          }
        },
        onDragOver: (event) => {
          event.preventDefault();
          if (!disabled) setDragOver(true);
        },
        onDragLeave: () => setDragOver(false),
        onDrop,
        style: { cursor: disabled ? 'not-allowed' : 'pointer' },
      }}
      className={className}
      style={style}
    >
      <input
        {...rest}
        ref={inputRef}
        id={inputId}
        type="file"
        disabled={disabled}
        style={{ display: 'none' }}
        onChange={(event) => {
          acceptFiles(event.target.files);
          event.target.value = '';
        }}
      />
      {icon !== null && <FieldIcon color={chrome.styles.placeholderColor}>{icon ?? <IconAttach />}</FieldIcon>}
      <span
        style={{
          color: chrome.styles.placeholderColor,
          textAlign: 'center',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        {text}
        {feedback != null && feedbackIcon !== null && (
          <FieldIcon color={chrome.tokens.feedback[feedback].onFeedbackContainer}>
            {feedbackIcon ?? <IconFeedbackAlert />}
          </FieldIcon>
        )}
      </span>
    </FieldFrame>
  );
}
