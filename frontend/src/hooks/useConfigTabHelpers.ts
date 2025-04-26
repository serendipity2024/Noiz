/* eslint-disable import/no-default-export */
import BaseComponentModel from '../models/base/BaseComponentModel';
import { ShortId } from '../shared/type-definition/ZTypes';
import useModel from './useModel';
import useStores from './useStores';

export interface ConfigTabHelpers<T> {
  model: T | undefined;
  updateModel: () => void;
}

export default function useConfigTabHelpers<T extends BaseComponentModel>(
  mRef: ShortId
): ConfigTabHelpers<T> {
  const { coreStore } = useStores();
  const model = useModel<T>(mRef);

  const updateModel = (): void => {
    if (model) coreStore.updateComponentModel(model);
  };

  return { model, updateModel };
}
