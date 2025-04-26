/* eslint-disable import/no-default-export */
import { useObserver } from 'mobx-react';
import { DataModelRegistry } from '../shared/type-definition/DataModelRegistry';
import { DataModel } from '../shared/type-definition/DataModel';
import useStores from './useStores';

interface DataModelMetadata extends DataModel {
  dataModelRegistry: DataModelRegistry;
}

export default function useDataModelMetadata(): DataModelMetadata {
  const { coreStore } = useStores();
  const dataModel = useObserver(() => coreStore.dataModel);
  return {
    ...dataModel,
    dataModelRegistry: new DataModelRegistry(dataModel),
  };
}
