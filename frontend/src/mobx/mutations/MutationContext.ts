import { AllStores } from '../StoreContexts';
import { SchemaMutator } from './SchemaMutator';
import { ActionFlowMutations } from './ActionFlowMutations';
import { ComponentMutations } from './ComponentMutations';
import { DataModelMutations } from './DataModelMutations';
import { ManagementConsoleMutation } from './ManagementConsoleMutation';
import { ThemeColorMutations } from './ThemeColorMutations';
import { AppConfigMutators } from './AppConfigMutators';
import { ThirdPartyApiMutations } from './ThirdPartyApiMutations';

export interface AllMutations {
  transaction: (body: () => void) => void;
  actionFlowMutations: ActionFlowMutations;
  componentMutations: ComponentMutations;
  dataModelMutations: DataModelMutations;
  managementConsoleMutation: ManagementConsoleMutation;
  themeColorMutations: ThemeColorMutations;
  appConfigMutators: AppConfigMutators;
  thirdPartyApiMutations: ThirdPartyApiMutations;
}

export function createFromStores(stores: AllStores): AllMutations {
  const mutator = new SchemaMutator(stores.coreStore, stores.diffStore);
  return {
    transaction: (body) => mutator.transaction(body),
    actionFlowMutations: new ActionFlowMutations(mutator),
    componentMutations: new ComponentMutations(mutator),
    dataModelMutations: new DataModelMutations(mutator),
    managementConsoleMutation: new ManagementConsoleMutation(mutator),
    themeColorMutations: new ThemeColorMutations(mutator),
    appConfigMutators: new AppConfigMutators(mutator),
    thirdPartyApiMutations: new ThirdPartyApiMutations(mutator),
  };
}
