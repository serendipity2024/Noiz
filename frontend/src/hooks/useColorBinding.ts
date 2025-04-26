/* eslint-disable import/no-default-export */
import { useObserver } from 'mobx-react';
import { ColorBinding, DataBinding, DataBindingKind } from '../shared/type-definition/DataBinding';
import { HexColor } from '../shared/type-definition/ZTypes';
import useStores from './useStores';

export default function useColorBinding(): (data: DataBinding) => HexColor {
  const { coreStore } = useStores();
  const theme = useObserver(() => new Map(Object.entries(coreStore.colorTheme)));

  return (data: DataBinding): HexColor => {
    const colorBinding = data?.valueBinding as ColorBinding;
    if (colorBinding) {
      return colorBinding.kind === DataBindingKind.LITERAL
        ? (colorBinding.value as HexColor)
        : theme.get(colorBinding.value) ?? '';
    }
    return '#ffffff';
  };
}
