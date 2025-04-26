/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React from 'react';
import useLocale from '../../../../hooks/useLocale';
import StoreHelpers from '../../../../mobx/StoreHelpers';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import InputModel from '../../../../models/mobile-components/InputModel';
import { ComponentModelType } from '../../../../shared/type-definition/ComponentModelType';
import { DataBinding } from '../../../../shared/type-definition/DataBinding';
import { IntegerType } from '../../../../shared/type-definition/DataModel';
import { SetInputValueHandleBinding } from '../../../../shared/type-definition/EventBinding';
import { NullableReactElement } from '../../../../shared/type-definition/ZTypes';
import { ZThemedColors } from '../../../../utils/ZConst';
import { InputValueType } from '../../../mobile-components/ZInput';
import DataBindingConfigRow from '../config-row/DataBindingConfigRow';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import i18n from './SetValueActionRow.i18n.json';
import { Select } from '../../../../zui';

interface Props {
  componentModel: BaseComponentModel;
  event: SetInputValueHandleBinding;
  onEventChange: () => void;
}
export default observer(function SetValueActionRow(props: Props): NullableReactElement {
  const { localizedContent: content } = useLocale(i18n);
  const { event, componentModel, onEventChange } = props;
  const screen = StoreHelpers.fetchRootModel(componentModel);
  const inputs = screen
    ? StoreHelpers.findAllModelsWithLogicInContainer({
        container: screen,
        filter: (model: BaseComponentModel) => {
          return model.type === ComponentModelType.INPUT;
        },
      })
    : [];
  return (
    <>
      <ZConfigRowTitle text={content.label.target} />
      <Select
        key={event.targetMRef}
        value={event.targetMRef}
        style={styles.select}
        placeholder="please input..."
        onChange={(value) => {
          event.targetMRef = value;
          const component = StoreHelpers.getComponentModel(value) as InputModel;
          if (!component) {
            event.value = DataBinding.withTextVariable();
          } else {
            event.value =
              component.dataAttributes.valueType === InputValueType.TEXT
                ? DataBinding.withTextVariable()
                : DataBinding.withSingleValue(IntegerType.INTEGER);
          }
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
      {event.targetMRef && (
        <DataBindingConfigRow
          title={content.label.value}
          componentModel={componentModel}
          dataBinding={event.value}
          onChange={(dataBinding) => {
            event.value = dataBinding;
            onEventChange();
          }}
        />
      )}
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
