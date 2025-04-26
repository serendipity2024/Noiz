/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React from 'react';
import useColorBinding from '../../hooks/useColorBinding';
import useModel from '../../hooks/useModel';
import ZFrame from '../../models/interfaces/Frame';
import { DataBinding } from '../../shared/type-definition/DataBinding';
import { DecimalType, MediaType } from '../../shared/type-definition/DataModel';
import { EventBinding } from '../../shared/type-definition/EventBinding';
import { NullableReactElement } from '../../shared/type-definition/ZTypes';
import { ZColors } from '../../utils/ZConst';
import {
  CombinedStyleDefaultDataAttributes,
  prepareCombinedStyles,
} from '../side-drawer-tabs/right-drawer/config-row/CombinedStyleConfigRow';
import { MRefProp } from './PropTypes';

export const ZMultiImageDefaultReferenceAttributes = {
  imageList: DataBinding.withSingleValue(MediaType.IMAGE_LIST),
  itemClickActions: [] as EventBinding[],
};

export const ZMultiImageDefaultDataAttributes = {
  ...CombinedStyleDefaultDataAttributes,
  borderRadius: DataBinding.withLiteral(0, DecimalType.FLOAT8),
  backgroundColor: DataBinding.withColor(ZColors.TRANSPARENT),
  horizontalPadding: 10,
  verticalPadding: 10,
  maxImageCount: 9,
  previewImageCount: 9,
  itemBorderRadius: 5,
  itemBackgroundColor: DataBinding.withColor(ZColors.WHITE_LIKE_GREY),
  ...ZMultiImageDefaultReferenceAttributes,
};

export type MultiImageAttributes = typeof ZMultiImageDefaultDataAttributes;

export const ZMultiImageDefaultFrame: ZFrame = {
  size: { width: 280, height: 280 },
  position: { x: 0, y: 0 },
};

export default observer(function ZMultiImage(props: MRefProp): NullableReactElement {
  const cb = useColorBinding();
  const model = useModel(props.mRef);
  if (!model) return null;

  // styles
  const dataAttributes = model.dataAttributes as MultiImageAttributes;
  const configuredStyle = {
    ...prepareCombinedStyles(dataAttributes, cb),
  };
  const backgroundColor = cb(dataAttributes.backgroundColor);
  const itemBackgroundColor = cb(dataAttributes.itemBackgroundColor);

  const { horizontalPadding, verticalPadding, previewImageCount, borderWidth, itemBorderRadius } =
    dataAttributes;

  let lineCount = 1;
  if (previewImageCount === 1) {
    lineCount = 1;
  } else if (previewImageCount === 2 || previewImageCount === 4) {
    lineCount = 2;
  } else {
    lineCount = 3;
  }

  const modelWidth = model.getComponentFrame().size.width;
  const itemWidth = Math.floor(
    (modelWidth - horizontalPadding * (lineCount - 1) - borderWidth.effectiveValue * 2) / lineCount
  );
  const itemHeight = lineCount === 1 ? '100%' : itemWidth;

  const renderItems = () => {
    const previewItems: React.ReactElement[] = [];
    for (let i = 0; i < previewImageCount; i++) {
      previewItems.push(
        <div
          key={i}
          style={{
            ...styles.item,
            backgroundColor: itemBackgroundColor,
            borderRadius: itemBorderRadius,
            width: itemWidth,
            height: itemHeight,
            marginBottom: verticalPadding,
            marginRight: (i + 1) % lineCount === 0 ? '0px' : horizontalPadding,
          }}
        />
      );
    }
    return <> {previewItems} </>;
  };

  return (
    <div
      style={{
        ...styles.container,
        ...configuredStyle,
        backgroundColor,
      }}
    >
      {renderItems()}
    </div>
  );
});

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
    overflow: 'hidden',
    flexWrap: 'wrap',
  },
  item: {
    overflow: 'hidden',
    flexShrink: 0,
    pointerEvents: 'none',
    backgroundColor: 'red',
  },
};
