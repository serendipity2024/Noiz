/* eslint-disable import/no-default-export */
import React, { ReactElement, CSSProperties } from 'react';
import { ShortId } from '../../shared/type-definition/ZTypes';
import useIsDeveloperMode from '../../hooks/useIsDeveloperMode';
import SharedStyles from '../side-drawer-tabs/right-drawer/config-row/SharedStyles';

interface Props {
  mRef?: ShortId;
}
export default function DebugModeShowMRef(props: Props): ReactElement {
  const { mRef } = props;
  const isDeveloperMode = useIsDeveloperMode();

  const renderMRefContainer = () => <span style={styles.mRef}> {mRef}</span>;

  return <>{isDeveloperMode && renderMRefContainer()}</>;
}

const styles: Record<string, CSSProperties> = {
  mRef: {
    ...SharedStyles.configRowTitleText,
    userSelect: 'text',
  },
};
