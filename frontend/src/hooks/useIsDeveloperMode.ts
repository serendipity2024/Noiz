/* eslint-disable import/no-default-export */
import { useObserver } from 'mobx-react';
import useStores from './useStores';

export default function useIsDeveloperMode(): boolean {
  const { persistedStore } = useStores();

  return useObserver(() => persistedStore.isDeveloperMode);
}
