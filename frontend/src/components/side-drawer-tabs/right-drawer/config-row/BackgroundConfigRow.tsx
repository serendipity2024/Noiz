import React, { ReactElement } from 'react';
import { Button, Row, Col, Popover, Select } from 'antd';
import { observer } from 'mobx-react';
import ColorPicker from '../shared/ColorPicker';
import BasicMobileModel from '../../../../models/basic-components/BasicMobileModel';
import useLocale from '../../../../hooks/useLocale';
import i18n from './BackgroundConfigRow.i18n.json';
import { DraggableScreenAttributes } from '../../../../containers/ZDraggableBoard';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import { ZColors, ZThemedBorderRadius, ZThemedColors } from '../../../../utils/ZConst';
import { DataBinding } from '../../../../shared/type-definition/DataBinding';
import { ReactComponent as AddIcon } from '../../../../shared/assets/icons/add.svg';

import ImageSourceConfigRow, {
  ImageSource,
  ImageSourceAttributes,
  ImageSourceDefaultDataAttributes,
} from './ImageSourceConfigRow';
import { HexColor } from '../../../../shared/type-definition/ZTypes';
import SharedStyles from './SharedStyles';
import BaseMobileContainerModel from '../../../../models/base/BaseMobileContainerModel';
import { UploadType } from '../shared/UploadFile';
import { useMediaUrl } from '../../../../hooks/useMediaUrl';

export enum BackgroundImageFitType {
  FILL = 'fill',
  FIT = 'fit',
  STRETCH = 'stretch',
  CENTER = 'center',
  TILE = 'tile',
}

export const getCSSPropertyForImageFit = (type: BackgroundImageFitType): React.CSSProperties => {
  return ImageFitCSSProperties[type];
};

export interface BackgroundDataAttributes {
  backgroundColor: DataBinding;
  backgroundImage: ImageSourceAttributes;
  backgroundImageFitType: BackgroundImageFitType;
}

export const BackgroundDefaultDataAttributes: BackgroundDataAttributes = {
  backgroundColor: DataBinding.withColor(ZColors.WHITE),
  backgroundImage: { ...ImageSourceDefaultDataAttributes },
  backgroundImageFitType: BackgroundImageFitType.FILL,
};

export const getBackgroundStyle = (
  backgroundData: BackgroundDataAttributes,
  cb: (data: DataBinding) => HexColor,
  umu: (exId: string, uploadType: UploadType) => string | undefined
): React.CSSProperties => {
  let resultStyles: React.CSSProperties = {};

  resultStyles.backgroundColor = cb(backgroundData.backgroundColor);
  if (!checkIsImageSelected(backgroundData.backgroundImage)) {
    return resultStyles;
  }

  resultStyles = {
    ...resultStyles,
    ...getImageBackgroundStyle(backgroundData.backgroundImage, umu),
    ...ImageFitCSSProperties[backgroundData.backgroundImageFitType],
  };
  return resultStyles;
};

const getImageBackgroundStyle = (
  imageData: ImageSourceAttributes,
  umu: (exId: string, uploadType: UploadType) => string | undefined
): React.CSSProperties => {
  if (!checkIsImageSelected(imageData)) {
    return {};
  }

  switch (imageData.imageSource.effectiveValue) {
    case ImageSource.UPLOAD: {
      const exId = imageData.imageObject.effectiveValue;
      const url = umu(exId, UploadType.IMAGE);
      return {
        backgroundImage: `url(${url})`,
      };
    }
    case ImageSource.IMAGE:
      return styles.imageNoPreview;
    default:
      return {};
  }
};

const checkIsImageSelected = (imageDataAttributes: ImageSourceAttributes): boolean =>
  imageDataAttributes.imageObject.effectiveValue !== '' &&
  imageDataAttributes.imageObject.effectiveValue !== undefined;

interface Props {
  model: BaseMobileContainerModel;
  colorPickerVisiable?: boolean;
  disableAlpha?: boolean;
}

export const BackgroundConfigRow = observer((props: Props): ReactElement => {
  const { localizedContent } = useLocale(i18n);
  const umu = useMediaUrl();

  const model = props.model as BasicMobileModel;
  const dataAttributes = model.dataAttributes as DraggableScreenAttributes;
  const colorData = dataAttributes.backgroundColor;
  const imageData = dataAttributes.backgroundImage;
  const imageFitType = dataAttributes.backgroundImageFitType;

  const updateBackgroundImage = (newImageData: ImageSourceAttributes) => {
    model.onUpdateDataAttributes('backgroundImage', { ...imageData, ...newImageData });
  };

  const updateImageFitType = (newImageFitType: BackgroundImageFitType) => {
    model.onUpdateDataAttributes('backgroundImageFitType', newImageFitType);
  };

  const renderImageSelector = () => {
    return (
      <div style={styles.imagePopover}>
        <ImageSourceConfigRow
          model={model}
          belongsToDataAttribute={false}
          imageSourceDataAttributes={imageData}
          onImageDataAttributesChange={updateBackgroundImage}
        />
      </div>
    );
  };

  return (
    <div style={styles.container}>
      {props.colorPickerVisiable && (
        <>
          <ZConfigRowTitle text={localizedContent.label.backgroundColor} />
          <ColorPicker
            style={styles.colorSelect}
            color={colorData}
            disableAlpha={props.disableAlpha}
            name=""
            onChange={(color) => {
              model.onUpdateDataAttributes('backgroundColor', DataBinding.withColor(color));
            }}
          />
          <Row justify="center">
            <label style={SharedStyles.configRowTitleText}>{localizedContent.label.color}</label>
          </Row>
        </>
      )}
      <ZConfigRowTitle text={localizedContent.label.backgroundImage} />
      <Row gutter={[8, 0]} align="middle">
        <Col span={12}>
          <Popover
            content={renderImageSelector()}
            key={`backgroundImagePopoverForSource${imageData.imageSource}`}
            trigger="click"
            placement="bottom"
            color={ZThemedColors.SECONDARY}
          >
            <Button
              style={{
                ...styles.imageSelect,
                ...getImageBackgroundStyle(imageData, umu),
                ...ImageFitCSSProperties[BackgroundImageFitType.STRETCH],
              }}
            >
              {!checkIsImageSelected(imageData) ? <AddIcon /> : ' '}
            </Button>
          </Popover>
        </Col>
        <Col span={12}>
          <Select
            style={styles.imageFitTypeSelect}
            key={`backgroundFitTypeSelect${model.mRef}`}
            value={imageFitType}
            onChange={updateImageFitType}
          >
            {Object.values(BackgroundImageFitType).map((e) => (
              <Select.Option key={e} value={e}>
                {localizedContent.fitType[e] ?? e}
              </Select.Option>
            ))}
          </Select>
        </Col>
        <Col span={12}>
          <Row justify="center">
            <label style={SharedStyles.configRowTitleText}>{localizedContent.label.image}</label>
          </Row>
        </Col>
        <Col span={12}>
          <Row justify="center">
            <label style={SharedStyles.configRowTitleText}>
              {localizedContent.label.backgroundImageFit}
            </label>
          </Row>
        </Col>
      </Row>
    </div>
  );
});

const ImageFitCSSProperties: Record<BackgroundImageFitType, React.CSSProperties> = {
  [BackgroundImageFitType.FILL]: {
    backgroundSize: 'cover',
    backgroundRepeat: 'repeat',
    backgroundPosition: '0% 0%',
  },
  [BackgroundImageFitType.FIT]: {
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  },
  [BackgroundImageFitType.STRETCH]: {
    backgroundSize: '100% 100%',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '0% 0%',
  },
  [BackgroundImageFitType.CENTER]: {
    backgroundSize: 'auto',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  },
  [BackgroundImageFitType.TILE]: {
    backgroundSize: 'auto',
    backgroundRepeat: 'repeat',
    backgroundPosition: '0% 0%',
  },
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    marginTop: '15px',
    marginBottom: '20px',
  },
  colorSelect: {
    verticalAlign: 'middle',
    color: '#fff',
    width: '100%',
    height: '55px',
    borderRadius: ZThemedBorderRadius.DEFAULT,
    marginBottom: '4px',
  },
  imageSelect: {
    border: 'none',
    verticalAlign: 'middle',
    width: '100%',
    borderRadius: ZThemedBorderRadius.DEFAULT,
    cursor: 'pointer',
    padding: 0,
    background: ZThemedColors.SECONDARY,
  },
  imagePopover: {
    width: '200px',
  },
  imageFitTypeSelect: {
    width: '100%',
  },
  imageNoPreview: {
    backgroundImage: `repeating-linear-gradient(45deg,${ZThemedColors.SECONDARY},${ZThemedColors.SECONDARY} 10px,${ZThemedColors.PRIMARY} 10px,${ZThemedColors.PRIMARY} 20px)`,
  },
};
