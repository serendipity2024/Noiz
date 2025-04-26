/* eslint-disable import/no-default-export */
import React, { ReactElement } from 'react';
import ZPageTitle from '../components/editor/ZPageTitle';
import ZSpinner from '../components/editor/ZSpinner';
import { ZThemedColors } from '../utils/ZConst';

const ZLoadingView = (): ReactElement => {
  return (
    <>
      <ZPageTitle>Loading...</ZPageTitle>
      <div style={styles.container}>
        <ZSpinner />
      </div>
    </>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100vh',
    backgroundColor: ZThemedColors.SECONDARY,
  },
};

export default ZLoadingView;
