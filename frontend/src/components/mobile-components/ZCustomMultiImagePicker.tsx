/* eslint-disable import/no-default-export */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { observer } from 'mobx-react';
import React from 'react';
import useColorBinding from '../../hooks/useColorBinding';
import useModel from '../../hooks/useModel';
import ZFrame from '../../models/interfaces/Frame';
import CustomMultiImagePickerModel from '../../models/mobile-components/CustomMultiImagePickerModel';
import { DataBinding } from '../../shared/type-definition/DataBinding';
import { ARRAY_TYPE, DecimalType, MediaType } from '../../shared/type-definition/DataModel';
import { NullableReactElement } from '../../shared/type-definition/ZTypes';
import { ZColors } from '../../utils/ZConst';
import {
  CombinedStyleDefaultDataAttributes,
  prepareCombinedStyles,
} from '../side-drawer-tabs/right-drawer/config-row/CombinedStyleConfigRow';
import { MRefProp } from './PropTypes';

export const ZCustomMultiImagePickerDefaultDataAttributes = {
  ...CombinedStyleDefaultDataAttributes,
  borderRadius: DataBinding.withLiteral(0, DecimalType.FLOAT8),
  backgroundColor: DataBinding.withColor(ZColors.TRANSPARENT_LIKE_GREY),
  defaultImageList: DataBinding.withSingleValue(ARRAY_TYPE, MediaType.IMAGE),
  isShowMultiLine: false,
  maxImageCount: 9,
  imageContainerMRef: '',
  addContainerMRef: '',
  uploadLoadingEnabled: false,
};

export type CustomMultiImagePickerAttributes = typeof ZCustomMultiImagePickerDefaultDataAttributes;

export const ZCustomMultilmagePickerDefaultFrame: ZFrame = {
  size: { width: 265, height: 100 },
  position: { x: 0, y: 0 },
};

export default observer(function ZCustomMultiImagePicker(props: MRefProp): NullableReactElement {
  const cb = useColorBinding();
  const model = useModel<CustomMultiImagePickerModel>(props.mRef);
  const imageContainerModel = useModel(model?.dataAttributes?.imageContainerMRef ?? '');
  const addContainerModel = useModel(model?.dataAttributes?.addContainerMRef ?? '');
  if (!model || !imageContainerModel || !addContainerModel) return null;

  // styles
  const dataAttributes = model.dataAttributes as CustomMultiImagePickerAttributes;
  const configuredStyle = {
    ...prepareCombinedStyles(dataAttributes, cb),
  };
  const backgroundColor = cb(dataAttributes.backgroundColor);

  return (
    <div
      style={{
        ...styles.container,
        ...configuredStyle,
        backgroundColor,
        flexWrap: dataAttributes.isShowMultiLine ? 'wrap' : 'nowrap',
      }}
    >
      <div
        style={{
          ...styles.item,
          ...imageContainerModel.getComponentFrame().size,
        }}
      >
        {imageContainerModel.renderForPreview()}
      </div>
      <div
        style={{
          ...styles.item,
          ...addContainerModel.getComponentFrame().size,
        }}
      >
        {addContainerModel.renderForPreview()}
      </div>
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
  },
  item: {
    overflow: 'hidden',
    flexShrink: 0,
    pointerEvents: 'none',
    position: 'relative',
  },
};
