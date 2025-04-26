/* eslint-disable import/no-default-export */
/* eslint-disable default-case */
import { LeftOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import { observer } from 'mobx-react';
import React from 'react';
import useColorBinding from '../../hooks/useColorBinding';
import useModel from '../../hooks/useModel';
import StoreHelpers from '../../mobx/StoreHelpers';
import WeChatMiniProgramBlackImage from '../../shared/assets/mobile-assets/wechat-appbar-black.svg';
import WeChatMiniProgramWhiteImage from '../../shared/assets/mobile-assets/wechat-appbar-white.svg';
import { DataBinding, DataBindingKind } from '../../shared/type-definition/DataBinding';
import { NullableReactElement } from '../../shared/type-definition/ZTypes';
import { ZColors } from '../../utils/ZConst';
import { MRefProp } from './PropTypes';
import { useConfiguration } from '../../hooks/useConfiguration';
import { Row } from '../../zui';

export const WechatNavigationBarStyle = {
  WHITE: '#ffffff',
  BLACK: '#000000',
} as const;

export const ZWechatNavigationBarDefaultDataAttributes = {
  title: DataBinding.withTextVariable([{ kind: DataBindingKind.LITERAL, value: 'Page Title' }]),
  backgroundColor: DataBinding.withColor(ZColors.WHITE_LIKE_GREY),
  textColor: DataBinding.withColor(WechatNavigationBarStyle.BLACK),
};

export type WechatNavigationBarAttributes = typeof ZWechatNavigationBarDefaultDataAttributes;

export default observer(function ZWechatNavigationBar(props: MRefProp): NullableReactElement {
  const cb = useColorBinding();
  const model = useModel(props.mRef);
  const { initialScreenMRef } = useConfiguration();
  if (!model) return null;

  // styles
  const dataAttributes = model.dataAttributes as WechatNavigationBarAttributes;
  const backgroundColor = cb(dataAttributes.backgroundColor);
  const textColor = cb(dataAttributes.textColor);

  // value
  const title = dataAttributes?.title?.effectiveValue;

  function rightImageSrc(): string {
    switch (textColor) {
      case WechatNavigationBarStyle.BLACK:
        return WeChatMiniProgramBlackImage;
      case WechatNavigationBarStyle.WHITE:
      default:
        return WeChatMiniProgramWhiteImage;
    }
  }

  function leftImageColor(): string {
    const screenModel = StoreHelpers.fetchRootModel(model);
    const leftImageIsHidden =
      !screenModel ||
      initialScreenMRef === screenModel.mRef ||
      StoreHelpers.screenContainsTabBar(screenModel.mRef);
    return leftImageIsHidden ? 'transparent' : textColor;
  }

  return (
    <div style={{ backgroundColor }}>
      <div style={styles.statusBar} />
      <Row align="middle" justify="center" style={styles.navigation}>
        <LeftOutlined style={{ ...styles.leftIcon, color: leftImageColor() }} />
        <label style={{ ...styles.label, color: textColor }}>{title}</label>
        <img alt="" style={styles.img} src={rightImageSrc()} />
      </Row>
    </div>
  );
});

const styles: Record<string, React.CSSProperties> = {
  statusBar: {
    height: '20px',
  },
  navigation: {
    height: '44px',
    marginLeft: '20px',
    marginRight: '20px',
  },
  leftIcon: {
    fontSize: '17px',
    position: 'absolute',
    left: '12px',
  },
  label: {
    fontSize: '17px',
    maxWidth: '50%',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    wordBreak: 'break-all',
    WebkitLineClamp: 1,
  },
  img: {
    position: 'absolute',
    right: '10px',
    top: '25px',
  },
};
