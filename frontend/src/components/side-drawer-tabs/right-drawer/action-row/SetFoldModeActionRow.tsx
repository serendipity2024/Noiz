/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React from 'react';
import useLocale from '../../../../hooks/useLocale';
import StoreHelpers from '../../../../mobx/StoreHelpers';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import CustomViewModel from '../../../../models/mobile-components/CustomViewModel';
import ComponentModelType from '../../../../shared/type-definition/ComponentModelType';
import {
  FoldingMode,
  SetFlodModeHandleBinding,
} from '../../../../shared/type-definition/EventBinding';
import { NullableReactElement } from '../../../../shared/type-definition/ZTypes';
import { ZThemedColors } from '../../../../utils/ZConst';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import i18n from './SetFoldModeActionRow.i18n.json';
import { Select } from '../../../../zui';

interface Props {
  componentModel: BaseComponentModel;
  event: SetFlodModeHandleBinding;
  onEventChange: () => void;
}
export default observer(function SetFoldModeActionRow(props: Props): NullableReactElement {
  const { localizedContent: content } = useLocale(i18n);
  const { event, componentModel, onEventChange } = props;
  const screen = StoreHelpers.fetchRootModel(componentModel);
  const inputs = screen
    ? StoreHelpers.findAllModelsWithLogicInContainer({
        container: screen,
        filter: (model: BaseComponentModel) => {
          if (model.type === ComponentModelType.CUSTOM_VIEW) {
            const customViewModel = model as CustomViewModel;
            return customViewModel.dataAttributes.foldingMode !== FoldingMode.NONE;
          }
          return false;
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
      {event.targetMRef && (
        <>
          <ZConfigRowTitle text={content.label.foldMode} />
          <Select
            key={event.foldingMode}
            value={event.foldingMode}
            style={styles.select}
            placeholder="please select..."
            onChange={(value) => {
              event.foldingMode = value;
              onEventChange();
            }}
          >
            {Object.entries(FoldingMode).map(([key, value]) => (
              <Select.Option key={key} value={value}>
                {value}
              </Select.Option>
            ))}
          </Select>
        </>
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
