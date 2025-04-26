/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React from 'react';
import useLocale from '../../../../hooks/useLocale';
import StoreHelpers from '../../../../mobx/StoreHelpers';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import ComponentModelType from '../../../../shared/type-definition/ComponentModelType';
import { DataBinding } from '../../../../shared/type-definition/DataBinding';
import { IntegerType, MediaType } from '../../../../shared/type-definition/DataModel';
import { ImagePickerReplaceImageHandleBinding } from '../../../../shared/type-definition/EventBinding';
import { NullableReactElement } from '../../../../shared/type-definition/ZTypes';
import { ZThemedColors } from '../../../../utils/ZConst';
import DataBindingConfigRow from '../config-row/DataBindingConfigRow';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import i18n from './ImagePickerDeleteImageRow.i18n.json';
import { Select } from '../../../../zui';

interface Props {
  componentModel: BaseComponentModel;
  event: ImagePickerReplaceImageHandleBinding;
  onEventChange: () => void;
}
export default observer(function ImagePickerReplaceImageRow(props: Props): NullableReactElement {
  const { localizedContent: content } = useLocale(i18n);
  const { event, componentModel, onEventChange } = props;
  const screen = StoreHelpers.fetchRootModel(componentModel);
  const inputs = screen
    ? StoreHelpers.findAllModelsWithLogicInContainer({
        container: screen,
        filter: (model: BaseComponentModel) =>
          model.type === ComponentModelType.CUSTOM_MULTI_IMAGE_PICKER,
      })
    : [];
  return (
    <>
      <ZConfigRowTitle text={content.label.imagePicker} />
      <Select
        key={event.targetMRef}
        value={event.targetMRef}
        style={styles.select}
        placeholder="please select..."
        onChange={(value) => {
          event.targetMRef = value;
          onEventChange();
        }}
        dropdownMatchSelectWidth={false}
      >
        {inputs.map((value) => (
          <Select.Option key={value.mRef} value={value.mRef}>
            {value.componentName}
          </Select.Option>
        ))}
      </Select>
      <DataBindingConfigRow
        title={content.label.index}
        dataBinding={event.index ?? DataBinding.withSingleValue(IntegerType.INTEGER)}
        onChange={(value) => {
          event.index = value;
          onEventChange();
        }}
        componentModel={componentModel}
      />
      <DataBindingConfigRow
        title={content.label.image}
        dataBinding={event.image ?? DataBinding.withSingleValue(MediaType.IMAGE)}
        onChange={(value) => {
          event.image = value;
          onEventChange();
        }}
        componentModel={componentModel}
      />
    </>
  );
});

const styles: Record<string, React.CSSProperties> = {
  select: {
    width: '100%',
    fontSize: '10px',
    background: ZThemedColors.PRIMARY,
    textAlign: 'center',
    borderRadius: '6px',
  },
};
