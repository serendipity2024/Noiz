/* eslint-disable import/no-default-export */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { observer } from 'mobx-react';
import React, { useEffect, useRef } from 'react';
import { Player, PlayerEvent } from '@lottiefiles/react-lottie-player';
import useModel from '../../hooks/useModel';
import ZFrame from '../../models/interfaces/Frame';
import { MRefProp } from './PropTypes';
import './ZLottie.scss'; // For hack: see https://github.com/LottieFiles/lottie-react/issues/14
import { EventBinding } from '../../shared/type-definition/EventBinding';
import { DataBinding } from '../../shared/type-definition/DataBinding';
import { IntegerType } from '../../shared/type-definition/DataModel';
import i18n from './DefaultValue.i18n.json';
import useLocale from '../../hooks/useLocale';
import { useMediaUrl } from '../../hooks/useMediaUrl';
import { UploadType } from '../side-drawer-tabs/right-drawer/shared/UploadFile';

export const ZProgressBarDefaultDataAttributes = {
  exId: '',
  totalProgress: 10,
  step: 1,
  defaultProgress: DataBinding.withLiteral(1, IntegerType.INTEGER),
  onProgressChangeActions: [] as EventBinding[],
};

export type ProgressBarAttributes = typeof ZProgressBarDefaultDataAttributes;

export const ZProgressBarDefaultFrame: ZFrame = {
  size: { width: 300, height: 120 },
  position: { x: 0, y: 0 },
};

export default observer(function ZProgressBar(props: MRefProp) {
  const model = useModel(props.mRef);
  const animation = useRef<Player | null>();
  const { localizedContent: content } = useLocale(i18n);
  const umu = useMediaUrl();

  const dataAttributes = model?.dataAttributes as ProgressBarAttributes;
  const lottieUrl = umu(dataAttributes?.exId ?? '', UploadType.JSON);

  useEffect(() => {
    if (animation.current) {
      const defaultProgress = Number(dataAttributes.defaultProgress.effectiveValue);
      animation.current.setSeeker(defaultProgress, false);
    }
  }, [dataAttributes.defaultProgress, animation]);

  if (!model) return null;

  return (
    <div className="zlottie" style={styles.resizable}>
      {lottieUrl ? (
        <Player
          ref={(ref) => {
            animation.current = ref;
          }}
          src={lottieUrl}
          speed={dataAttributes.step}
          autoplay={false}
          loop={false}
          onEvent={(e) => {
            if (e === PlayerEvent.Load && animation.current) {
              const defaultProgress = Number(dataAttributes.defaultProgress.effectiveValue);
              animation.current.setSeeker(defaultProgress, false);
            }
          }}
          style={styles.lottie as Record<string, string>}
        />
      ) : (
        <div style={styles.container}>
          <div style={styles.icon}>{content.progressBar}</div>
        </div>
      )}
    </div>
  );
});
const styles: Record<string, React.CSSProperties> = {
  resizable: {
    overflow: 'hidden',
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#fff',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    backgroundColor: '#ddd',
  },
  lottie: {
    width: '100%',
    height: '100%',
  },
  icon: {
    fontSize: '24px',
    color: '#ffa522',
  },
};
