/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React, { ReactElement, ReactNode } from 'react';
import ZSpinner from '../components/editor/ZSpinner';
import useStores from '../hooks/useStores';
import { ZThemedColors } from '../utils/ZConst';

interface Props {
  children: ReactNode;
}

export default observer(function ZProjectDataLoadingView(props: Props): ReactElement {
  const { projectStore } = useStores();

  if (projectStore.projectStatus !== 'LOADING') return <>{props.children}</>;

  return (
    <div style={styles.container}>
      <div style={styles.spinner}>
        <ZSpinner />
      </div>
    </div>
  );
});

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'fixed',
    width: '100%',
    height: '100%',
    backgroundColor: ZThemedColors.SECONDARY,
  },
  spinner: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
};
