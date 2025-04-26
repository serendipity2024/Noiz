/* eslint-disable import/no-default-export */
import { cloneDeep } from 'lodash';
import { observer } from 'mobx-react';
import React from 'react';
import ComponentDiff from '../../../../diffs/ComponentDiff';
import useModel from '../../../../hooks/useModel';
import { AllStores } from '../../../../mobx/StoreContexts';
import { DataBinding } from '../../../../shared/type-definition/DataBinding';
import { NullableReactElement } from '../../../../shared/type-definition/ZTypes';
import { MRefProp } from '../../../mobile-components/PropTypes';
import { MultiImagePickerAttributes } from '../../../mobile-components/ZMultiImagePicker';
import ClickActionConfigRow, { getWithDefaultActions } from '../config-row/ClickActionConfigRow';
import CombinedStyleConfigRow from '../config-row/CombinedStyleConfigRow';
import DataBindingConfigRow from '../config-row/DataBindingConfigRow';
import ColorPicker from '../shared/ColorPicker';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import i18n from './MultiImageConfigTab.i18n.json';
import commonI18n from './CommonConfigTab.i18n.json';
import useLocale from '../../../../hooks/useLocale';
import MultiImagePickerModel from '../../../../models/mobile-components/MultiImagePickerModel';
import ConfigTab from './ConfigTab';
import { EventType } from '../../../../shared/type-definition/EventBinding';
import { InputNumber, Row } from '../../../../zui';
import SwitchRow from '../shared/SwitchRow';

const MultiImagePickerStyleConfigTab = observer((props: { model: MultiImagePickerModel }) => {
  const { localizedContent: content } = useLocale(i18n);
  const { localizedContent: commonContent } = useLocale(commonI18n);
  const { model } = props;
  const dataAttributes = model.dataAttributes as MultiImagePickerAttributes;

  return (
    <>
      <ZConfigRowTitle text={commonContent.label.color} />
      <ColorPicker
        style={styles.colorSelect}
        color={dataAttributes.backgroundColor}
        name={commonContent.label.backgroundColor}
        onChange={(color) => {
          model.onUpdateDataAttributes('backgroundColor', DataBinding.withColor(color));
        }}
      />
      <Row justify="space-between" align="middle" style={styles.row}>
        <ZConfigRowTitle text={content.label.previewImageCount} />
        <InputNumber
          min={1}
          max={dataAttributes.maxImageCount}
          key={dataAttributes.maxImageCount}
          style={styles.inputNumber}
          value={dataAttributes.previewImageCount}
          onChange={(value) => {
            model.onUpdateDataAttributes(
              'previewImageCount',
              typeof value === 'number' ? value : 0
            );
          }}
        />
      </Row>

      <Row justify="space-between" align="middle" style={styles.row}>
        <ZConfigRowTitle text={content.label.maxImageCount} />
        <InputNumber
          min={1}
          max={9}
          style={styles.inputNumber}
          value={dataAttributes.maxImageCount}
          onChange={(value) => {
            const count = typeof value === 'number' ? value : 0;
            const diffItems = [
              ComponentDiff.buildUpdateDataAttributesDiff({
                model,
                valueKey: 'maxImageCount',
                newValue: count,
              }),
            ];
            if (dataAttributes.previewImageCount > count || dataAttributes.previewImageCount <= 0) {
              diffItems.push(
                ComponentDiff.buildUpdateDataAttributesDiff({
                  model,
                  valueKey: 'previewImageCount',
                  newValue: count,
                })
              );
            }
            AllStores.diffStore.applyDiff(diffItems);
          }}
        />
      </Row>
      <CombinedStyleConfigRow data={model} />
    </>
  );
});

const MultiImagePickerDataConfigTab = observer((props: { model: MultiImagePickerModel }) => {
  const { localizedContent: content } = useLocale(i18n);
  const { model } = props;
  const dataAttributes = model.dataAttributes as MultiImagePickerAttributes;
  return (
    <>
      <SwitchRow
        title={content.label.uploadLoadingEnabled}
        componentModel={model}
        dataAttribute={dataAttributes}
        field="uploadLoadingEnabled"
      />
      <DataBindingConfigRow
        title={content.label.defaultImageList}
        componentModel={model}
        dataBinding={dataAttributes.defaultImageList}
        onChange={(value) => {
          model.onUpdateDataAttributes('defaultImageList', value);
        }}
      />
    </>
  );
});

const MultiImagePickerActionConfigTab = observer((props: { model: MultiImagePickerModel }) => {
  const { localizedContent: content } = useLocale(i18n);
  const { model } = props;
  const dataAttributes = model.dataAttributes as MultiImagePickerAttributes;
  return (
    <>
      <ZConfigRowTitle text={content.label.itemClickActions} />
      <ClickActionConfigRow
        componentModel={model}
        enabledActions={getWithDefaultActions([
          {
            type: EventType.FULLSCREEN_IMAGE,
            enabled: true,
          },
        ])}
        eventList={cloneDeep(dataAttributes.itemClickActions)}
        eventListOnChange={(value) => model.onUpdateDataAttributes('itemClickActions', value)}
      />
    </>
  );
});

export default observer(function MultiImagePickerConfigTab(props: MRefProp): NullableReactElement {
  const model = useModel<MultiImagePickerModel>(props.mRef);
  if (!model) return null;

  return (
    <ConfigTab
      model={model}
      ActionConfigTab={MultiImagePickerActionConfigTab}
      DataConfigTab={MultiImagePickerDataConfigTab}
      StyleConfigTab={MultiImagePickerStyleConfigTab}
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
  row: {
    marginTop: '10px',
  },
};
