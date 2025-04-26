import { ReactElement } from 'react';
import { ShortId } from '../../shared/type-definition/ZTypes';

/**
 * Common props for components that reference a model by ID
 */
export interface MRefProp {
  mRef: ShortId;
}

/**
 * Props for components that can have children
 */
export interface ChildrenProp {
  children?: ReactElement | ReactElement[];
}

/**
 * Props for components with style
 */
export interface StyleProp {
  style?: React.CSSProperties;
}

/**
 * Props for components with className
 */
export interface ClassNameProp {
  className?: string;
}

/**
 * Props for components with both style and className
 */
export interface StyledProp extends StyleProp, ClassNameProp {}

/**
 * Props for components that can be disabled
 */
export interface DisableProp {
  disabled?: boolean;
}

/**
 * Props for components that can have a placeholder
 */
export interface PlaceholderProp {
  placeholder?: string;
}

/**
 * Props for components that can have a title
 */
export interface TitleProp {
  title?: string;
}

/**
 * Props for components that can have a value
 */
export interface ValueProp<T> {
  value?: T;
}

/**
 * Props for components that can have a default value
 */
export interface DefaultValueProp<T> {
  defaultValue?: T;
}

/**
 * Props for components that can have an onChange handler
 */
export interface OnChangeProp<T> {
  onChange?: (value: T) => void;
}

/**
 * Props for components that can have an onClick handler
 */
export interface OnClickProp {
  onClick?: (event: React.MouseEvent) => void;
}

/**
 * Props for components that can have an onFocus handler
 */
export interface OnFocusProp {
  onFocus?: (event: React.FocusEvent) => void;
}

/**
 * Props for components that can have an onBlur handler
 */
export interface OnBlurProp {
  onBlur?: (event: React.FocusEvent) => void;
}

/**
 * Props for form input components
 */
export interface InputProp<T> extends ValueProp<T>, DefaultValueProp<T>, OnChangeProp<T>, OnFocusProp, OnBlurProp, DisableProp, PlaceholderProp {}

/**
 * Props for components that can be sized
 */
export interface SizeProp {
  size?: 'small' | 'medium' | 'large';
}

/**
 * Props for components that can have a type
 */
export interface TypeProp {
  type?: string;
}

/**
 * Props for components that can have a name
 */
export interface NameProp {
  name?: string;
}

/**
 * Props for components that can be required
 */
export interface RequiredProp {
  required?: boolean;
}

/**
 * Props for components that can have a label
 */
export interface LabelProp {
  label?: string;
}

/**
 * Props for components that can have an id
 */
export interface IdProp {
  id?: string;
}