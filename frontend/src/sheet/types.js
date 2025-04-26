// @flow

export type SheetOptions = {
  isServer?: boolean,
  useCSSOMInjection?: boolean,
  target?: HTMLElement,
};

export type GroupedTag = {
  getGroup: (id: string) => string,
  insertRules: (id: string, cssRules: string[]) => void,
  clearGroup: (id: string) => void,
  getTag: () => Tag,
  length: number,
};

export interface Tag {
  insertRule: (rule: string, index?: number) => boolean;
  getRule?: (index: number) => string | undefined;
  styleSheet?: CSSStyleSheet | void;
  cssRules?: CSSRuleList | void;
  length?: number;
}

export interface Sheet {
  allocateGSInstance: (id: string) => number;
  clearNames: () => void;
  clearRules: () => void;
  clearTag: () => void;
  getTag: () => void | GroupedTag;
  hasNameForId: (id: string, name: string) => boolean;
  insertRules: (id: string, name: string, rules: string[]) => void;
  names: Map<string, Set<string>>;
  options: SheetOptions;
  registerName: (id: string, name: string) => void;
  toString: () => string;
}