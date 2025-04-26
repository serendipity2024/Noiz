/* eslint-disable import/no-default-export */
import { useSubscription } from '@apollo/client';
import { GQL_ON_COLLABORATION, GQL_ON_SCHEMA_DIFF } from '../graphQL/collaboration';
import { CollaborationState } from '../mobx/stores/DiffStore';
import useProjectDetails from './useProjectDetails';
import useStores from './useStores';
import { CollaborationEventType } from '../graphQL/__generated__/globalTypes';
import { SchemaDiffFragment } from '../graphQL/__generated__/SchemaDiffFragment';

export default function useSubscriptionForCollaboration(): void {
  const { schemaExId, projectExId } = useProjectDetails();
  const { diffStore } = useStores();

  useSubscription(GQL_ON_SCHEMA_DIFF, {
    skip: !schemaExId || diffStore.collaborationState !== CollaborationState.NORMAL,
    shouldResubscribe: true,
    variables: { schemaExId },
    onSubscriptionData: ({ subscriptionData: { data } }) => {
      if (diffStore.collaborationState !== CollaborationState.NORMAL) {
        return;
      }
      if (data.onNewSchemaDiff instanceof Array && data.onNewSchemaDiff.length > 0) {
        const diff: SchemaDiffFragment = data.onNewSchemaDiff[0];
        if (diffStore.existsInLocalDiffs(diff.uuid)) {
          return;
        }
        if (diff.seq > (diffStore.lastNetworkDiffSeq ?? -1)) {
          diffStore.addPendingApplyNetworkDiff(diff);
        }
      }
    },
  });

  useSubscription(GQL_ON_COLLABORATION, {
    skip: !projectExId || diffStore.collaborationState !== CollaborationState.NORMAL,
    shouldResubscribe: true,
    variables: { projectExId },
    onSubscriptionData: ({ subscriptionData: { data } }) => {
      if (diffStore.collaborationState !== CollaborationState.NORMAL) {
        return;
      }
      switch (data.onCollaborationEvent?.changeType) {
        case CollaborationEventType.PROJECT_RESET: {
          diffStore.collaborationState = CollaborationState.PROJECT_RESET;
          break;
        }
        case CollaborationEventType.SCHEMA_SAVED: {
          diffStore.collaborationState = CollaborationState.SCHEMA_SAVED;
          break;
        }
        case CollaborationEventType.ERROR_REPORT: {
          const firstDiffWithError = data.onCollaborationEvent?.firstDiffWithError;
          if (firstDiffWithError && diffStore.existsInLocalDiffs(firstDiffWithError.uuid)) {
            diffStore.collaborationState = CollaborationState.DIFF_APPLICATION_ERROR;
          }
          break;
        }
        default:
          break;
      }
    },
  });
}
