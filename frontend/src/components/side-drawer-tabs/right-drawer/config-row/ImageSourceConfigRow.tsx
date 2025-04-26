/* eslint-disable import/no-default-export */
/* eslint-disable default-case */
/* eslint-disable no-param-reassign */
import { observer } from 'mobx-react';
import React, { ReactElement } from 'react';
import ComponentDiff from '../../../../diffs/ComponentDiff';
import useLocale from '../../../../hooks/useLocale';
import useStores from '../../../../hooks/useStores';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import { DataBinding } from '../../../../shared/type-definition/DataBinding';
import { IdentityType, MediaType } from '../../../../shared/type-definition/DataModel';
import { Select } from '../../../../zui';
import { UploadType, UploadFile } from '../shared/UploadFile';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import DataBindingConfigRow from './DataBindingConfigRow';
import i18n from './ImageSourceConfigRow.i18n.json';

export enum ImageSource {
  UPLOAD = 'upload',
  IMAGE = 'image',
}

export const ImageSourceDefaultDataAttributes = {
  imageSource: DataBinding.withLiteral(ImageSource.UPLOAD),
  imageObject: DataBinding.withTextVariable(),
};

export type ImageSourceAttributes = typeof ImageSourceDefaultDataAttributes;

interface Props {
  model: BaseComponentModel;
  belongsToDataAttribute: boolean;
  imageSourceDataAttributes: ImageSourceAttributes;
  onImageDataAttributesChange?: (imageSourceAttributes: ImageSourceAttributes) => void;
}

export default observer(function ImageSourceConfigRow(props: Props): ReactElement {
  const { localizedContent: content } = useLocale(i18n);
  const { diffStore } = useStores();

  const { model, imageSourceDataAttributes } = props;
  const imageSource = imageSourceDataAttributes.imageSource?.effectiveValue;

  const imageExId = imageSourceDataAttributes.imageObject.effectiveValue;

  function renderImageSourceComponent() {
    switch (imageSource) {
      case ImageSource.UPLOAD: {
        return (
          <div style={styles.imageContainer}>
            <UploadFile
              fileExId={imageExId}
              uploadType={UploadType.IMAGE}
              uploadFileResult={(result) => {
                if (props.belongsToDataAttribute) {
                  model.onUpdateDataAttributes(
                    'imageObject',
                    DataBinding.withLiteral(result.exId, IdentityType.EXID)
                  );
                } else if (props.onImageDataAttributesChange) {
                  props.onImageDataAttributesChange({
                    imageSource: imageSourceDataAttributes.imageSource,
                    imageObject: DataBinding.withLiteral(result.exId, IdentityType.EXID),
                  });
                }
              }}
            />
          </div>
        );
      }
      case ImageSource.IMAGE: {
        return (
          <DataBindingConfigRow
            title={content.source.image}
            componentModel={model}
            dataBinding={imageSourceDataAttributes.imageObject}
            onChange={(value) => {
              if (props.belongsToDataAttribute) {
                model.onUpdateDataAttributes('imageObject', value);
              } else if (props.onImageDataAttributesChange) {
                props.onImageDataAttributesChange({
                  imageSource: imageSourceDataAttributes.imageSource,
                  imageObject: value,
                });
              }
            }}
          />
        );
      }
      default:
        return <div />;
    }
  }

  return (
    <>
      <ZConfigRowTitle text={content.label.source} />
      <Select
        style={styles.fullWidth}
        key={imageSource}
        defaultValue={imageSource}
        onChange={(value) => {
          if (props.belongsToDataAttribute) {
            const diffItems = [
              ComponentDiff.buildUpdateDataAttributesDiff({
                model,
                valueKey: 'imageSource',
                newValue: DataBinding.withLiteral(value),
              }),
            ];
            switch (value) {
              case ImageSource.UPLOAD: {
                diffItems.push(
                  ComponentDiff.buildUpdateDataAttributesDiff({
                    model,
                    valueKey: 'imageObject',
                    newValue: DataBinding.withTextVariable(),
                  })
                );
                break;
              }
              case ImageSource.IMAGE: {
                diffItems.push(
                  ComponentDiff.buildUpdateDataAttributesDiff({
                    model,
                    valueKey: 'imageObject',
                    newValue: DataBinding.withSingleValue(MediaType.IMAGE),
                  })
                );
                break;
              }
            }
            diffStore.applyDiff(diffItems);
          } else if (props.onImageDataAttributesChange) {
            let imageObject;
            switch (value) {
              case ImageSource.UPLOAD: {
                imageObject = DataBinding.withTextVariable();
                break;
              }
              case ImageSource.IMAGE: {
                imageObject = DataBinding.withSingleValue(MediaType.IMAGE);
                break;
              }
              default:
                throw new Error(`unsupported imageSource, ${value}`);
            }
            props.onImageDataAttributesChange({
              imageSource: DataBinding.withLiteral(value),
              imageObject,
            });
          }
        }}
      >
        {Object.values(ImageSource).map((e) => (
          <Select.Option key={e} value={e}>
            {content.source[e] ?? e}
          </Select.Option>
        ))}
      </Select>
      {renderImageSourceComponent()}
    </>
  );
});

const styles: Record<string, React.CSSProperties> = {
  titleContainer: {
    margin: '10px 5px',
  },
  imageContainer: {
    marginTop: '25px',
  },
  fullWidth: {
    width: '100%',
  },
};
