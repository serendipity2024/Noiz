/* eslint-disable import/no-default-export */
import { PlusOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react';
import React from 'react';
import useColorBinding from '../../hooks/useColorBinding';
import useModel from '../../hooks/useModel';
import ZFrame from '../../models/interfaces/Frame';
import { DataBinding } from '../../shared/type-definition/DataBinding';
import { MediaType } from '../../shared/type-definition/DataModel';
import { EventBinding } from '../../shared/type-definition/EventBinding';
import { NullableReactElement } from '../../shared/type-definition/ZTypes';
import { ZColors } from '../../utils/ZConst';
import {
  CombinedStyleDefaultDataAttributes,
  prepareCombinedStyles,
} from '../side-drawer-tabs/right-drawer/config-row/CombinedStyleConfigRow';
import { MRefProp } from './PropTypes';

export const ZMultiImagePickerDefaultReferenceAttributes = {
  defaultImageList: DataBinding.withSingleValue(MediaType.IMAGE_LIST),
  itemClickActions: [] as EventBinding[],
};

export const ZMultiImagePickerDefaultDataAttributes = {
  ...CombinedStyleDefaultDataAttributes,
  backgroundColor: DataBinding.withColor(ZColors.TRANSPARENT),
  previewImageCount: 2,
  maxImageCount: 9,
  uploadLoadingEnabled: false,
  ...ZMultiImagePickerDefaultReferenceAttributes,
};

export type MultiImagePickerAttributes = typeof ZMultiImagePickerDefaultDataAttributes;

export const ZMultiImagePickerDefaultFrame: ZFrame = {
  size: { width: 280, height: 160 },
  position: { x: 0, y: 0 },
};

export default observer(function ZMultiImagePicker(props: MRefProp): NullableReactElement {
  const cb = useColorBinding();
  const model = useModel(props.mRef);
  if (!model) return null;

  // styles
  const dataAttributes = model.dataAttributes as MultiImagePickerAttributes;

  const configuredStyle = {
    ...prepareCombinedStyles(dataAttributes, cb),
  };
  const backgroundColor = cb(dataAttributes.backgroundColor);

  const { previewImageCount, borderWidth } = dataAttributes;

  const lineCount = 3;
  const horizontalPadding = 5;
  const modelWidth = model.getComponentFrame().size.width;
  const itemWidth = Math.floor(
    (modelWidth - horizontalPadding * (lineCount - 1) - borderWidth.effectiveValue * 2) / lineCount
  );

  const renderItems = () => {
    const previewItems: React.ReactElement[] = [];
    for (let i = 0; i < previewImageCount; i++) {
      previewItems.push(
        <div
          key={i}
          style={{
            ...styles.item,
            width: itemWidth,
            height: itemWidth,
            marginRight: (i + 1) % lineCount === 0 ? 0 : horizontalPadding,
          }}
        >
          <PlusOutlined style={styles.addIcon} />
        </div>
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
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '5px',
    border: '1.5px #d6e4ef solid',
    marginBottom: 10,
  },
  addIcon: {
    fontSize: '26px',
    color: '#e0e0e0',
  },
};
