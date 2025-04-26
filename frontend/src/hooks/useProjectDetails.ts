/* eslint-disable import/no-default-export */
import { useObserver } from 'mobx-react';
import { ProjectDetails } from '../mobx/stores/ProjectStore';
import useStores from './useStores';

export default function useProjectDetails(): ProjectDetails {
  const { projectStore } = useStores();
  return useObserver(() => projectStore.projectDetails ?? {}) as ProjectDetails;
}
