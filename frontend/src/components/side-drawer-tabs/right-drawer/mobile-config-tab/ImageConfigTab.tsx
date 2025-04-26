/* eslint-disable import/no-default-export */
import { cloneDeep } from 'lodash';
import { observer } from 'mobx-react';
import React from 'react';
import useLocale from '../../../../hooks/useLocale';
import useModel from '../../../../hooks/useModel';
import { DataBinding } from '../../../../shared/type-definition/DataBinding';
import { NullableReactElement } from '../../../../shared/type-definition/ZTypes';
import { MRefProp } from '../../../mobile-components/PropTypes';
import { ImageCrop, ImageAttributes } from '../../../mobile-components/ZImage';
import ClickActionConfigRow, { getWithDefaultActions } from '../config-row/ClickActionConfigRow';
import CombinedStyleConfigRow from '../config-row/CombinedStyleConfigRow';
import ImageSourceConfigRow from '../config-row/ImageSourceConfigRow';
import ColorPicker from '../shared/ColorPicker';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import i18n from './ImageConfigTab.i18n.json';
import commonI18n from './CommonConfigTab.i18n.json';
import ImageModel from '../../../../models/mobile-components/ImageModel';
import ConfigTab from './ConfigTab';
import { EventType } from '../../../../shared/type-definition/EventBinding';
import { Select } from '../../../../zui';

const ImageStyleConfigTab = observer((props: { model: ImageModel }) => {
  const { localizedContent: content } = useLocale(i18n);
  const { localizedContent: commonContent } = useLocale(commonI18n);
  const { model } = props;
  const dataAttributes = model.dataAttributes as ImageAttributes;
  const { backgroundColor } = dataAttributes;
  const imageCrop = dataAttributes.imageCrop.effectiveValue;

  return (
    <>
      <ZConfigRowTitle text={commonContent.label.color} />
      <ColorPicker
        style={styles.colorSelect}
        color={backgroundColor}
        name={commonContent.label.backgroundColor}
        onChange={(color) => {
          model.onUpdateDataAttributes('backgroundColor', DataBinding.withColor(color));
        }}
      />
      <ZConfigRowTitle text={content.label.imageCropping} />
      <Select
        style={styles.fullWidth}
        value={imageCrop}
        onChange={(value) => {
          model.onUpdateDataAttributes('imageCrop', DataBinding.withLiteral(value));
        }}
      >
        {Object.values(ImageCrop).map((e) => (
          <Select.Option key={e} value={e}>
            {content.cropping[e] ?? e}
          </Select.Option>
        ))}
      </Select>
      <CombinedStyleConfigRow data={model} />
    </>
  );
});

const ImageDataConfigTab = observer((props: { model: ImageModel }) => {
  const { model } = props;
  const dataAttributes = model.dataAttributes as ImageAttributes;
  return (
    <>
      <ImageSourceConfigRow
        model={model}
        belongsToDataAttribute
        imageSourceDataAttributes={dataAttributes}
      />
    </>
  );
});

const ImageActionConfigTab = observer((props: { model: ImageModel }) => {
  const { localizedContent: commonContent } = useLocale(commonI18n);
  const { model } = props;
  const dataAttributes = model.dataAttributes as ImageAttributes;
  const clickActions = cloneDeep(dataAttributes.clickActions);
  return (
    <>
      <ZConfigRowTitle text={commonContent.label.clickActions} />
      <ClickActionConfigRow
        componentModel={model}
        enabledActions={getWithDefaultActions([
          {
            type: EventType.FULLSCREEN_IMAGE,
            enabled: true,
          },
        ])}
        eventList={clickActions}
        eventListOnChange={(value) => model.onUpdateDataAttributes('clickActions', value)}
      />
    </>
  );
});

export default function ImageConfigTab(props: MRefProp): NullableReactElement {
  const model = useModel<ImageModel>(props.mRef);
  if (!model) return null;

  return (
    <ConfigTab
      model={model}
      ActionConfigTab={ImageActionConfigTab}
      DataConfigTab={ImageDataConfigTab}
      StyleConfigTab={ImageStyleConfigTab}
    />
  );
}

const styles: Record<string, React.CSSProperties> = {
  fullWidth: {
    width: '100%',
  },
  colorSelect: {
    verticalAlign: 'middle',
    color: '#fff',
    width: '100%',
    height: '55px',
    borderRadius: '10px',
    marginBottom: '10px',
  },
};
