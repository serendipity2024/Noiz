/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React, { CSSProperties, ReactElement } from 'react';
import useColorBinding from '../../hooks/useColorBinding';
import { useMediaUrl } from '../../hooks/useMediaUrl';
import useModel from '../../hooks/useModel';
import ZFrame from '../../models/interfaces/Frame';
import ImagePlaceholder from '../../shared/assets/icons/display-image.svg';
import { DataBinding } from '../../shared/type-definition/DataBinding';
import { EventBinding } from '../../shared/type-definition/EventBinding';
import { ZColors } from '../../utils/ZConst';
import {
  CombinedStyleDefaultDataAttributes,
  prepareCombinedStyles,
} from '../side-drawer-tabs/right-drawer/config-row/CombinedStyleConfigRow';
import { ImageSourceDefaultDataAttributes } from '../side-drawer-tabs/right-drawer/config-row/ImageSourceConfigRow';
import { UploadType } from '../side-drawer-tabs/right-drawer/shared/UploadFile';
import { MRefProp } from './PropTypes';

export enum ImageCrop {
  FULL_IMAGE = 'full-image',
  FILL_SPACE = 'fill-space',
}

export enum ImageSource {
  UPLOAD = 'upload',
  IMAGE = 'image',
}

export const ZImageDefaultReferenceAttributes = {
  clickActions: [] as EventBinding[],
};

export const ZImageDefaultDataAttributes = {
  ...ImageSourceDefaultDataAttributes,
  ...CombinedStyleDefaultDataAttributes,
  ...ZImageDefaultReferenceAttributes,
  backgroundColor: DataBinding.withColor(ZColors.TRANSPARENT),
  imageCrop: DataBinding.withLiteral(ImageCrop.FULL_IMAGE),
};

export type ImageAttributes = typeof ZImageDefaultDataAttributes;

export const ZImageDefaultFrame: ZFrame = {
  size: { width: 300, height: 200 },
  position: { x: 0, y: 0 },
};

export default observer(function ZImage(props: MRefProp) {
  const cb = useColorBinding();
  const model = useModel(props.mRef);

  const dataAttributes = model?.dataAttributes as ImageAttributes;
  const imageExId = dataAttributes.imageObject.effectiveValue;
  const imageCrop = dataAttributes.imageCrop.effectiveValue;
  const imageSource = dataAttributes.imageSource.effectiveValue;

  if (!model) return null;

  // styles
  const configuredStyle = {
    ...prepareCombinedStyles(dataAttributes, cb),
  };
  const imgStyle = (): CSSProperties => {
    switch (imageCrop) {
      case ImageCrop.FULL_IMAGE:
        return { objectFit: 'contain' };
      case ImageCrop.FILL_SPACE:
        return { objectFit: 'cover' };
      default:
        throw new Error(`invalid image crop: ${JSON.stringify(model)}`);
    }
  };

  const isPlaceholder = imageSource !== ImageSource.UPLOAD || !imageExId;
  const backgroundColor = isPlaceholder
    ? ZColors.TRANSPARENT_LIKE_GREY
    : cb(dataAttributes.backgroundColor);
  const imageStyle = isPlaceholder ? styles.placeholderImage : { ...styles.image, ...imgStyle() };

  return (
    <div style={{ ...styles.container, ...configuredStyle, backgroundColor }}>
      {isPlaceholder ? (
        <img alt="" src={ImagePlaceholder} style={imageStyle} />
      ) : (
        <ImageComponent exId={imageExId} style={imageStyle} />
      )}
    </div>
  );
});

const ImageComponent = observer(
  (props: { exId: string; style: React.CSSProperties }): ReactElement => {
    const umu = useMediaUrl();
    const url = umu(props.exId, UploadType.IMAGE);
    return <img alt="" src={url} style={props.style} />;
  }
);

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#fff',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  image: {
    overflow: 'hidden',
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '35px',
    height: '35px',
  },
};
