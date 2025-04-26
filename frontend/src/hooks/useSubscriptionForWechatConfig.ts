/* eslint-disable import/no-default-export */
import { useSubscription } from '@apollo/client';
import { useEffect } from 'react';
import { GQL_ON_WECHAT_CONFIG_UPDATE } from '../graphQL/wechatAPI';
import { OnWechatConfigUpdate } from '../graphQL/__generated__/OnWechatConfigUpdate';
import {
  ProjectConfigFragment,
  ProjectConfigFragment_wechatAppConfig,
} from '../graphQL/__generated__/ProjectConfigFragment';
import useProjectDetails from './useProjectDetails';
import useStores from './useStores';

export default function useSubscriptionForWechatConfig(): void {
  const { projectStore } = useStores();
  const { projectExId } = useProjectDetails();
  const { data } = useSubscription(GQL_ON_WECHAT_CONFIG_UPDATE, {
    skip: !projectExId,
    variables: { projectExId },
  });

  useEffect(() => {
    const newConfig = (data as OnWechatConfigUpdate)?.onWechatConfigUpdate;
    if (!newConfig) return;

    const newProjectDetails = {
      projectConfig: {
        wechatAppConfig: newConfig as ProjectConfigFragment_wechatAppConfig,
      } as ProjectConfigFragment,
    };
    projectStore.updateProjectDetails(newProjectDetails);
  }, [data, projectStore]);
}
