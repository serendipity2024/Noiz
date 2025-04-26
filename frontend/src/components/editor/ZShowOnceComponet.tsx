import { useObserver } from 'mobx-react';
import React, { useEffect } from 'react';
import useStores from '../../hooks/useStores';
import { AccountTag } from '../../mobx/stores/AccountTagStore';

export function showOnceComponent<T>(
  Component: React.ComponentType<T>,
  accountTag: AccountTag
): React.ComponentType<T> {
  return function WrapComponent(props: T) {
    const { accountTagStore } = useStores();
    const currentRunningTag = useObserver(() => accountTagStore.currentRunningTag);

    useEffect(() => {
      accountTagStore.openAccountTag(accountTag);
      return function cleanup() {
        accountTagStore.closeAccountTag(accountTag);
      };
    }, [accountTagStore]);

    const shouldShowComponent = currentRunningTag === accountTag;
    return shouldShowComponent ? (
      <Component
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
        onFinish={() => accountTagStore.saveAccountTagAsFinished(accountTag)}
        onComponentVisible={shouldShowComponent}
      />
    ) : (
      <div />
    );
  };
}
