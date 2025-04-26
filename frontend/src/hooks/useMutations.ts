import useStores from './useStores';
import { createFromStores, AllMutations } from '../mobx/mutations/MutationContext';

export function useMutations(): AllMutations {
  return createFromStores(useStores());
}
