/* eslint-disable import/no-default-export */
/* eslint-disable no-bitwise */
import { v4 } from 'uuid'; // For version 5
import BaseComponentModel from '../models/base/BaseComponentModel';
import { HexColor } from '../shared/type-definition/ZTypes';

const SymbolNames: Record<string, string> = {
  ' ': 'Space',
  '-': 'Dash',
  _: 'Underscore',
  '/': 'Slash',
  '\\': 'BackSlash',
};

export default class StringUtils {
  static generateCamelCasedMRef(model: BaseComponentModel): string {
    return this.convertStringArrayToOneCamelCaseString([model.type, 'of', model.mRef]);
  }

  static convertStringArrayToOneCamelCaseString(input: string[]): string {
    return input.map((s) => this.convertStringToCamelCase(s)).join('');
  }

  static convertStringToCamelCase(input: string): string {
    let output = this.convertStringInitialToUpperCase(input);
    Object.keys(SymbolNames).forEach((key: string) => {
      const name = SymbolNames[key];
      output = output
        .split(key)
        .map((part, index) => {
          if (index === 0) return part;
          return this.convertStringInitialToUpperCase(part);
        })
        .join(name);
    });
    return output;
  }

  static convertStringInitialToUpperCase(input: string): string {
    return input.charAt(0).toUpperCase() + input.slice(1);
  }

  static generateRandomHexColor(): HexColor {
    return `#${((Math.random() * 0xffffff) << 0).toString(16).padStart(6, '0')}`;
  }

  static isValid(input: string): boolean {
    const regex = new RegExp('^[_a-z][_0-9a-z]*');
    const value = regex.exec(input)?.join('');
    return value === input;
  }

  static incrementStringPostfixSequence(input: string, delimiter = ' '): string {
    const stringParts = input.split(delimiter);
    const postfix = stringParts[stringParts.length - 1];
    const numberedPostfix = Number(postfix);

    if (numberedPostfix >= 0) {
      stringParts[stringParts.length - 1] = (numberedPostfix + 1).toString();
      return stringParts.join(' ');
    }
    return `${input} 2`;
  }
}

export const uuidV4 = (): string => {
  return v4();
};
