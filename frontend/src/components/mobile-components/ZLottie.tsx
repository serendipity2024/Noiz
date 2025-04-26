import { Player } from '@lottiefiles/react-lottie-player';
import { observer } from 'mobx-react';
import React, { useEffect, useRef } from 'react';
import { useMediaUrl } from '../../hooks/useMediaUrl';
import useModel from '../../hooks/useModel';
import ZFrame from '../../models/interfaces/Frame';
import { ReactComponent as LottiePlaceHolder } from '../../shared/assets/icons/lottie-placeholder.svg';
import { EventBinding } from '../../shared/type-definition/EventBinding';
import { ZColors } from '../../utils/ZConst';
import { UploadType } from '../side-drawer-tabs/right-drawer/shared/UploadFile';
import { MRefProp } from './PropTypes';
import './ZLottie.scss'; // For hack: see https://github.com/LottieFiles/lottie-react/issues/14

export const ZLottieDefaultDataAttributes = {
  exId: '',
  autoplay: true,
  loop: false,
  completeActions: [] as EventBinding[],
};

export type LottieAttributes = typeof ZLottieDefaultDataAttributes;

export const ZLottieDefaultFrame: ZFrame = {
  size: { width: 300, height: 200 },
  position: { x: 0, y: 0 },
};

// eslint-disable-next-line import/no-default-export
export default observer(function ZLottie(props: MRefProp) {
  const model = useModel(props.mRef);
  const umu = useMediaUrl();

  const animation = useRef<Player | null>();
  const dataAttributes = model?.dataAttributes as LottieAttributes | undefined;
  const lottieUrl = umu(dataAttributes?.exId ?? '', UploadType.JSON);

  useEffect(() => {
    if (animation.current) {
      if (dataAttributes?.autoplay) {
        animation.current.play();
      } else {
        animation.current.stop();
      }
      animation.current.setLoop(dataAttributes?.loop ?? false);
    }
  }, [dataAttributes, animation, lottieUrl]);

  if (!model) return null;

  return (
    <div className="zlottie">
      {!lottieUrl ? (
        <div style={styles.container}>
          <LottiePlaceHolder style={styles.placeholderImage} />
        </div>
      ) : (
        <Player
          ref={(ref) => {
            animation.current = ref;
          }}
          loop={dataAttributes?.loop}
          src={lottieUrl}
          autoplay
          style={styles.lottie as Record<string, string>}
        />
      )}
    </div>
  );
});
const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: ZColors.TRANSPARENT_LIKE_GREY,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  lottie: {
    overflow: 'hidden',
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '35px',
    height: '35px',
  },
};
