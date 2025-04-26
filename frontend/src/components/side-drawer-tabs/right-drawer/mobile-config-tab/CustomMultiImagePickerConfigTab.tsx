/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React from 'react';
import CustomMultiImagePickerModel from '../../../../models/mobile-components/CustomMultiImagePickerModel';
import { DataBinding } from '../../../../shared/type-definition/DataBinding';
import { NullableReactElement } from '../../../../shared/type-definition/ZTypes';
import { MRefProp } from '../../../mobile-components/PropTypes';
import { CustomMultiImagePickerAttributes } from '../../../mobile-components/ZCustomMultiImagePicker';
import CombinedStyleConfigRow from '../config-row/CombinedStyleConfigRow';
import ColorPicker from '../shared/ColorPicker';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import commonI18n from './CommonConfigTab.i18n.json';
import useLocale from '../../../../hooks/useLocale';
import ConfigTab from './ConfigTab';
import useModel from '../../../../hooks/useModel';
import { Empty, InputNumber, Row, Switch } from '../../../../zui';
import SwitchRow from '../shared/SwitchRow';

const CustomMultiImagePickerStyleConfigTab = observer(
  (props: { model: CustomMultiImagePickerModel }) => {
    const { localizedContent: commonContent } = useLocale(commonI18n);

    const { model } = props;
    const dataAttributes = model.dataAttributes as CustomMultiImagePickerAttributes;
    return (
      <>
        <Row justify="space-between" align="middle" style={styles.multiLine}>
          <ZConfigRowTitle text="isMultiline" />
          <Switch
            checked={dataAttributes.isShowMultiLine}
            onChange={(checked) => {
              model.onUpdateDataAttributes('isShowMultiLine', checked);
            }}
          />
        </Row>
        <Row justify="space-between" align="middle" style={styles.row}>
          <ZConfigRowTitle text="maxImageCount" />
          <InputNumber
            min={1}
            value={dataAttributes.maxImageCount}
            onChange={(value) => {
              const count = typeof value === 'number' ? value : 0;
              model.onUpdateDataAttributes('maxImageCount', count);
            }}
          />
        </Row>
        <ZConfigRowTitle text={commonContent.label.color} />
        <ColorPicker
          key={model.mRef}
          style={styles.colorSelect}
          color={dataAttributes.backgroundColor}
          name={commonContent.label.backgroundColor}
          onChange={(color) => {
            model.onUpdateDataAttributes('backgroundColor', DataBinding.withColor(color));
          }}
        />
        <CombinedStyleConfigRow data={model} />
      </>
    );
  }
);

const CustomMultiImagePickerDataConfigTab = observer(
  (props: { model: CustomMultiImagePickerModel }) => {
    const { localizedContent: commonContent } = useLocale(commonI18n);
    const { model } = props;
    const dataAttributes = model.dataAttributes as CustomMultiImagePickerAttributes;
    return (
      <SwitchRow
        title={commonContent.label.uploadLoadingEnabled}
        componentModel={model}
        dataAttribute={dataAttributes}
        field="uploadLoadingEnabled"
      />
    );
  }
);

export default observer(function CustomMultiImagePickerConfigTab(
  props: MRefProp
): NullableReactElement {
  const model = useModel<CustomMultiImagePickerModel>(props.mRef);
  if (!model) return null;

  return (
    <ConfigTab
      model={model}
      ActionConfigTab={() => <Empty description={false} />}
      DataConfigTab={CustomMultiImagePickerDataConfigTab}
      StyleConfigTab={CustomMultiImagePickerStyleConfigTab}
    />
  );
});

const styles: Record<string, React.CSSProperties> = {
  colorSelect: {
    verticalAlign: 'middle',
    color: '#fff',
    width: '100%',
    height: '55px',
    borderRadius: '10px',
    marginBottom: '10px',
  },
  multiLine: {
    marginTop: '10px',
  },
};
