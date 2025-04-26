/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React, { ReactElement } from 'react';
import useLocale from '../../../../hooks/useLocale';
import useScreenModels from '../../../../hooks/useScreenModels';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import { DataBinding } from '../../../../shared/type-definition/DataBinding';
import { BaseType } from '../../../../shared/type-definition/DataModel';
import { EventBinding, ShareHandleBinding } from '../../../../shared/type-definition/EventBinding';
import DataBindingConfigRow from '../config-row/DataBindingConfigRow';
import ImageSourceConfigRow, { ImageSourceAttributes } from '../config-row/ImageSourceConfigRow';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import i18n from './ShareActionRow.i18n.json';
import ArgumentsConfigRow, { DataBindingParameterEdit } from '../config-row/ArgumentsConfigRow';
import { ZThemedColors } from '../../../../utils/ZConst';
import { Select } from '../../../../zui';

interface Props {
  componentModel: BaseComponentModel;
  event: EventBinding;
  onEventChange: () => void;
}

interface ShareArg {
  name: string;
  dataBinding: DataBinding;
}

export default observer(function ShareActionRow(props: Props): ReactElement {
  const { localizedContent: content } = useLocale(i18n);
  const screenComponents = useScreenModels();
  const handleBinding = props.event as ShareHandleBinding;

  return (
    <>
      <ZConfigRowTitle text={content.label.page} />
      <Select
        bordered={false}
        size="large"
        style={styles.transitionSelect}
        key={handleBinding.pageMRef}
        placeholder={content.placeholder.page}
        defaultValue={handleBinding.pageMRef}
        onChange={(value) => {
          handleBinding.pageMRef = value;
          props.onEventChange();
        }}
      >
        {screenComponents.map((screenModel) => (
          <Select.Option key={screenModel.mRef} value={screenModel.mRef}>
            {screenModel.componentName}
          </Select.Option>
        ))}
      </Select>
      <DataBindingConfigRow
        title={content.label.title}
        componentModel={props.componentModel}
        dataBinding={handleBinding.title}
        onChange={(dataBinding) => {
          handleBinding.title = dataBinding;
          props.onEventChange();
        }}
      />
      <ImageSourceConfigRow
        model={props.componentModel}
        belongsToDataAttribute={false}
        imageSourceDataAttributes={handleBinding}
        onImageDataAttributesChange={(imageDataAttributes) => {
          Object.entries(imageDataAttributes).forEach(([key, value]) => {
            handleBinding[key as keyof ImageSourceAttributes] = value;
          });
          props.onEventChange();
        }}
      />
      <ZConfigRowTitle text={content.label.parameter} />
      <ArgumentsConfigRow
        componentModel={props.componentModel}
        args={handleBinding.args ?? {}}
        onChange={(value) => {
          handleBinding.args = value;
          props.onEventChange();
        }}
        producer={() => DataBinding.withSingleValue(BaseType.TEXT)}
        Edit={DataBindingParameterEdit}
      />
    </>
  );
});

const styles: Record<string, React.CSSProperties> = {
  transitionSelect: {
    width: '100%',
    fontSize: '10px',
    background: ZThemedColors.PRIMARY,
    textAlign: 'center',
    borderRadius: '6px',
  },
  emptyContent: {
    borderWidth: '1px',
    borderColor: '#ccc',
    borderRadius: '5px',
    borderStyle: 'dashed',
    width: '100%',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    borderWidth: 0,
    width: '100%',
    height: '45px',
    textAlign: 'center',
    boxShadow: '0 0 0 0',
    WebkitBoxShadow: '0 0 0 0',
  },
  pageDataContainer: {
    marginBottom: '10px',
  },
  pageDataInput: {
    background: '#eee',
    height: '32px',
    width: '70%',
  },
  pageDataCascader: {
    width: '70%',
    fontSize: '12px',
  },
  option: {
    fontSize: '12px',
  },
};
