/* eslint-disable import/no-default-export */
/* eslint-disable react/no-array-index-key */
import { observer } from 'mobx-react';
import React from 'react';
import useColorBinding from '../../hooks/useColorBinding';
import useModel from '../../hooks/useModel';
import MobileNavigationBarModel from '../../models/mobile-components/MobileNavigationBarModel';
import { DataBinding, DataBindingKind } from '../../shared/type-definition/DataBinding';
import { IntegerType } from '../../shared/type-definition/DataModel';
import { EventBinding, EventType } from '../../shared/type-definition/EventBinding';
import {
  FontWeight,
  getFontWeightValue,
  NullableReactElement,
} from '../../shared/type-definition/ZTypes';
import { ZColors, ZImageUrls } from '../../utils/ZConst';
import { MRefProp } from './PropTypes';
import { Row } from '../../zui';
import { useMediaUrl } from '../../hooks/useMediaUrl';
import { UploadType } from '../side-drawer-tabs/right-drawer/shared/UploadFile';

export interface MobileNavigationButtonConfig {
  imageExId: string;
  clickActions: EventBinding[];
  isHidden: boolean;
}

export const ZMobileNavigationBarDefaultDataAttributes = {
  title: DataBinding.withTextVariable([{ kind: DataBindingKind.LITERAL, value: '页面' }]),
  backgroundColor: DataBinding.withColor(ZColors.WHITE_LIKE_GREY),
  titleColor: DataBinding.withColor('#000000'),
  titleFontSize: DataBinding.withLiteral(16, IntegerType.INTEGER),
  titleFontWeight: DataBinding.withLiteral(FontWeight.MEDIUM),
  leftButtonList: [
    {
      imageExId: ZImageUrls.GO_BACK_ICON,
      clickActions: [
        {
          type: EventType.NAVIGATION,
          operation: 'go-back',
          value: 'go-back',
        },
      ],
      isHidden: false,
    },
    {
      imageExId: '',
      clickActions: [],
      isHidden: true,
    },
  ] as MobileNavigationButtonConfig[],
  rightButtonList: [
    {
      imageExId: '',
      clickActions: [],
      isHidden: false,
    },
    {
      imageExId: '',
      clickActions: [],
      isHidden: true,
    },
  ] as MobileNavigationButtonConfig[],
};

export type MobileNavigationBarAttributes = typeof ZMobileNavigationBarDefaultDataAttributes;

export default observer(function ZMobileNavigationBar(props: MRefProp): NullableReactElement {
  const cb = useColorBinding();
  const model = useModel<MobileNavigationBarModel>(props.mRef);

  // styles
  const dataAttributes = model?.dataAttributes as MobileNavigationBarAttributes;
  const { leftButtonList, rightButtonList } = dataAttributes;
  const backgroundColor = cb(dataAttributes.backgroundColor);
  const titleColor = cb(dataAttributes.titleColor);
  const titleFontSize = dataAttributes.titleFontSize.effectiveValue;
  const titleFontWeight = getFontWeightValue(dataAttributes.titleFontWeight.effectiveValue);

  if (!model) return null;

  return (
    <div
      style={{
        ...styles.container,
        backgroundColor,
      }}
    >
      <div style={styles.statusBar} />
      <Row align="middle" justify="center" style={styles.navigation}>
        <Row align="middle" justify="center" style={styles.leftContainer}>
          {leftButtonList.map((buttonConfig, index) => (
            <div key={`${buttonConfig.imageExId}_${index}`}>
              {buttonConfig.isHidden ? null : <ImageComponent exId={buttonConfig.imageExId} />}
            </div>
          ))}
        </Row>
        <label style={{ color: titleColor, fontSize: titleFontSize, fontWeight: titleFontWeight }}>
          {dataAttributes.title.effectiveValue}
        </label>
        <Row align="middle" justify="center" style={styles.rightContainer}>
          {rightButtonList.map((buttonConfig, index) => (
            <div key={`${buttonConfig.imageExId}_${index}`}>
              {buttonConfig.isHidden ? null : <ImageComponent exId={buttonConfig.imageExId} />}
            </div>
          ))}
        </Row>
      </Row>
    </div>
  );
});

const ImageComponent = observer((props: { exId: string }): NullableReactElement => {
  const umu = useMediaUrl();
  const url = umu(props.exId, UploadType.IMAGE);
  return (
    <div>
      <img alt="" style={styles.icon} src={url} />
    </div>
  );
});

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'relative',
  },
  statusBar: {
    height: '20px',
  },
  navigation: {
    position: 'relative',
    height: '44px',
    marginLeft: '20px',
    marginRight: '20px',
  },
  leftContainer: {
    zIndex: 100,
    position: 'absolute',
    left: '-10px',
  },
  rightContainer: {
    zIndex: 100,
    position: 'absolute',
    right: '-10px',
  },
  icon: {
    width: '30px',
    height: '30px',
    marginLeft: '6px',
  },
};
