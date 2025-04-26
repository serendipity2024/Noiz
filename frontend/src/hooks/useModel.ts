/* eslint-disable import/no-default-export */
import { useObserver } from 'mobx-react';
import BaseComponentModel from '../models/base/BaseComponentModel';
import { ShortId } from '../shared/type-definition/ZTypes';
import useStores from './useStores';

export default function useModel<T extends BaseComponentModel>(mRef: ShortId): T | undefined {
  const { coreStore } = useStores();
  const model = useObserver(() => coreStore.getModel(mRef) as T | undefined);
  return model;
}
