/* eslint-disable import/no-default-export */
import React, { ReactElement, useState } from 'react';
import ReactPlayer from 'react-player';
import { observer } from 'mobx-react';
import useLocale from '../../../../hooks/useLocale';
import i18n from './VideoPreviewView.i18.json';
import { Button, Modal } from '../../../../zui';
import { useMediaUrl } from '../../../../hooks/useMediaUrl';
import { UploadType } from './UploadFile';

interface Props {
  videoExId: string;
}

export default observer(function VideoPreviewView(props: Props): ReactElement {
  const { localizedContent: content } = useLocale(i18n);
  const umu = useMediaUrl();
  const [playerPreviewVisible, setPlayerPreviewVisible] = useState<boolean>(false);
  const videoUrl = umu(props.videoExId, UploadType.VIDEO);

  return (
    <>
      <Button style={styles.fullWidth} onClick={() => setPlayerPreviewVisible(true)}>
        {content.label.clickToPreview}
      </Button>
      <Modal
        maskClosable
        destroyOnClose
        visible={playerPreviewVisible}
        title={content.label.preview}
        onCancel={() => setPlayerPreviewVisible(false)}
        onOk={() => setPlayerPreviewVisible(false)}
      >
        <ReactPlayer width="100%" url={videoUrl} playing />
      </Modal>
    </>
  );
});

const styles: Record<string, React.CSSProperties> = {
  fullWidth: {
    width: '100%',
  },
};
