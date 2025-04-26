/* eslint-disable import/no-default-export */
import { useSubscription } from '@apollo/client';
import GQL_ON_PROJECT_DELETE from '../graphQL/onProjectDelete';
import useProjectDetails from './useProjectDetails';
import { CollaborationState } from '../mobx/stores/DiffStore';
import useStores from './useStores';

export default function useSubscriptionOnProjectDelete(): void {
  const { projectExId } = useProjectDetails();

  const { diffStore } = useStores();
  useSubscription(GQL_ON_PROJECT_DELETE, {
    skip: !projectExId,
    shouldResubscribe: true,
    variables: { projectExId },
    onSubscriptionData: ({ subscriptionData: { data } }) => {
      if (data?.onProjectDelete) {
        diffStore.collaborationState = CollaborationState.PROJECT_DELETED;
      }
    },
  });
}
