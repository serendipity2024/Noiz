/* eslint-disable import/no-default-export */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { FileImageOutlined } from '@ant-design/icons/lib/icons';
import { observer } from 'mobx-react';
import React from 'react';
import useColorBinding from '../../hooks/useColorBinding';
import useModel from '../../hooks/useModel';
import ZFrame from '../../models/interfaces/Frame';
import { NullableReactElement } from '../../shared/type-definition/ZTypes';
import {
  CombinedStyleDefaultDataAttributes,
  prepareCombinedStyles,
} from '../side-drawer-tabs/right-drawer/config-row/CombinedStyleConfigRow';
import { ImageSourceDefaultDataAttributes } from '../side-drawer-tabs/right-drawer/config-row/ImageSourceConfigRow';
import { MRefProp } from './PropTypes';
import { EventBinding } from '../../shared/type-definition/EventBinding';

export const ZImagePickerDefaultDataAttributes = {
  ...CombinedStyleDefaultDataAttributes,
  ...ImageSourceDefaultDataAttributes,
  disablePreview: undefined as boolean | undefined,
  original: undefined as boolean | undefined,
  onSuccessActions: [] as EventBinding[],
  uploadLoadingEnabled: false,
};

export type ImagePickerAttributes = typeof ZImagePickerDefaultDataAttributes;

export const ZImagePickerDefaultFrame: ZFrame = {
  size: { width: 265, height: 150 },
  position: { x: 0, y: 0 },
};

export default observer(function ZImagePicker(props: MRefProp): NullableReactElement {
  const cb = useColorBinding();
  const model = useModel(props.mRef);
  if (!model) return null;

  const configuredStyle = prepareCombinedStyles(model.dataAttributes as ImagePickerAttributes, cb);
  return (
    <div style={{ ...styles.container, ...configuredStyle }}>
      <FileImageOutlined style={styles.icon} />
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
    fontSize: '32px',
    color: '#ffa522',
  },
};
