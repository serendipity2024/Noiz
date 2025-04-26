/* eslint-disable import/no-default-export */
/* eslint-disable react/no-find-dom-node */
/* eslint-disable react/no-string-refs */
import { observer } from 'mobx-react';
import React from 'react';
import ZDragSelectMovable from '../components/editor/ZDragSelectMovable';
import useStores from '../hooks/useStores';
import useWindowSize from '../hooks/useWindowSize';
import { ZedSupportedPlatform } from '../models/interfaces/ComponentModel';
import { NullableReactElement, ShortId } from '../shared/type-definition/ZTypes';
import './ZBoard.scss';
import ZDraggableBoard from './ZDraggableBoard';

export default observer(function ZScreenBoard(): NullableReactElement {
  const { width } = useWindowSize();
  const { coreStore, editorStore } = useStores();
  const { wechatRootMRefs, mobileWebRootMRefs, webRootMRefs } = coreStore;

  return (
    <div className="main-part" style={{ width }}>
      {editorStore.editorPlatform === ZedSupportedPlatform.MOBILE_WEB && (
        <>
          <ZDragSelectMovable />
          {mobileWebRootMRefs.map((mRef: ShortId) => (
            <ZDraggableBoard key={mRef} mRef={mRef} style={styles.screen} />
          ))}
        </>
      )}
      {editorStore.editorPlatform === ZedSupportedPlatform.WECHAT && (
        <>
          <ZDragSelectMovable />
          {wechatRootMRefs.map((mRef: ShortId) => (
            <ZDraggableBoard key={mRef} mRef={mRef} style={styles.screen} />
          ))}
        </>
      )}
      {editorStore.editorPlatform === ZedSupportedPlatform.WEB && (
        <>
          {webRootMRefs.map((mRef: ShortId) => (
            <ZDraggableBoard key={mRef} mRef={mRef} style={styles.screen} />
          ))}
        </>
      )}
    </div>
  );
});

const styles: Record<string, React.CSSProperties> = {
  screen: {
    marginLeft: '20px',
  },
};
