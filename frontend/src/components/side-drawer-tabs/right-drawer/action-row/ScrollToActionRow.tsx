/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React, { ReactElement } from 'react';
import useLocale from '../../../../hooks/useLocale';
import StoreHelpers from '../../../../mobx/StoreHelpers';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import { DataBinding } from '../../../../shared/type-definition/DataBinding';
import { IntegerType } from '../../../../shared/type-definition/DataModel';
import {
  EventBinding,
  ScrollToHandleBinding,
} from '../../../../shared/type-definition/EventBinding';
import { ZThemedBorderRadius, ZThemedColors } from '../../../../utils/ZConst';
import DataBindingConfigRow from '../config-row/DataBindingConfigRow';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import i18n from './ScrollToActionRow.i18n.json';
import { Select } from '../../../../zui';

interface Props {
  componentModel: BaseComponentModel;
  event: EventBinding;
  onEventChange: () => void;
}

export default observer(function ScrollToActionRow(props: Props): ReactElement {
  const { localizedContent: content } = useLocale(i18n);
  const scrollToHandleBinding = props.event as ScrollToHandleBinding;

  const screen = StoreHelpers.fetchRootModel(props.componentModel);
  let listViewModels: BaseComponentModel[] = [];
  if (screen) {
    listViewModels = StoreHelpers.findAllModelsWithLogicInContainer({
      container: screen,
      filter: (model) => model.isList,
    });
  }
  return (
    <>
      <ZConfigRowTitle text={content.label.target} />
      <Select
        bordered={false}
        placeholder={content.placeholder}
        size="large"
        style={styles.select}
        key={scrollToHandleBinding.target}
        defaultValue={scrollToHandleBinding.target}
        onChange={(value: string) => {
          scrollToHandleBinding.target = value;
          props.onEventChange();
        }}
      >
        {listViewModels.map((element) => (
          <Select.Option key={element.mRef} value={element.mRef}>
            {element.componentName}
          </Select.Option>
        ))}
      </Select>
      <DataBindingConfigRow
        title={content.label.index}
        componentModel={props.componentModel}
        dataBinding={
          scrollToHandleBinding.sectionIndex ?? DataBinding.withSingleValue(IntegerType.INTEGER)
        }
        onChange={(value) => {
          scrollToHandleBinding.sectionIndex = value;
          props.onEventChange();
        }}
      />
    </>
  );
});

const styles: Record<string, React.CSSProperties> = {
  select: {
    width: '100%',
    fontSize: '10px',
    background: ZThemedColors.PRIMARY,
    borderRadius: ZThemedBorderRadius.DEFAULT,
    textAlign: 'center',
  },
};
