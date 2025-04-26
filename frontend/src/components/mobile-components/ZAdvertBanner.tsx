/* eslint-disable import/no-default-export */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { observer } from 'mobx-react';
import React from 'react';
import useModel from '../../hooks/useModel';
import ZFrame from '../../models/interfaces/Frame';
import { NullableReactElement } from '../../shared/type-definition/ZTypes';
import { MRefProp } from './PropTypes';
import i18n from './DefaultValue.i18n.json';
import useLocale from '../../hooks/useLocale';

// 微信小程序限制
// 宽高比
const AdvertBannerAspectRatio = 0.336;
// 最小宽
const AdvertBannerMinWidth = 300;

export const ZAdvertBannerDefaultDataAttributes = {
  advertId: '',
};

export type AdvertBannerAttributes = typeof ZAdvertBannerDefaultDataAttributes;

export const ZAdvertBannerDefaultFrame: ZFrame = {
  size: { width: AdvertBannerMinWidth, height: AdvertBannerMinWidth * AdvertBannerAspectRatio },
  position: { x: 0, y: 0 },
};

export default observer(function ZAdvertBanner(props: MRefProp): NullableReactElement {
  const model = useModel(props.mRef);
  const { localizedContent: content } = useLocale(i18n);
  if (!model) return null;

  return (
    <div style={{ ...styles.container }}>
      <div style={styles.icon}>{content.advertBanner}</div>
    </div>
  );
});

const styles: Record<string, React.CSSProperties> = {
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
  icon: {
    fontSize: '24px',
    color: '#ffa522',
  },
};
