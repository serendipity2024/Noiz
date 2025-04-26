/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React from 'react';
import {
  ScrollHorizontalListHandleBinding,
  ScrollHorizontalListDirection,
} from '../../../../shared/type-definition/EventBinding';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import i18n from './ScrollHorizontalListActionRow.i18n.json';
import useLocale from '../../../../hooks/useLocale';
import StoreHelpers from '../../../../mobx/StoreHelpers';
import { ComponentModelType } from '../../../../shared/type-definition/ComponentModelType';
import { Select } from '../../../../zui';

interface Props {
  componentModel: BaseComponentModel;
  event: ScrollHorizontalListHandleBinding;
  onEventChange: () => void;
}

export default observer(function ScrollHorizontalListActionRow(props: Props) {
  const { localizedContent: content } = useLocale(i18n);
  const { event, onEventChange } = props;

  const screen = StoreHelpers.fetchRootModel(props.componentModel);
  const horizontalLists = screen
    ? StoreHelpers.findAllModelsWithLogicInContainer({
        container: screen,
        filter: (model) => model.type === ComponentModelType.HORIZONTAL_LIST,
      })
    : [];

  return (
    <>
      <ZConfigRowTitle text={content.label.target} />
      <Select
        value={event.targetMRef}
        onChange={(value: string) => {
          event.targetMRef = value;
          props.onEventChange();
        }}
        dropdownMatchSelectWidth={false}
      >
        {horizontalLists.map((element) => (
          <Select.Option key={element.mRef} value={element.mRef}>
            {element.componentName}
          </Select.Option>
        ))}
      </Select>
      <ZConfigRowTitle text={content.label.direction} />
      <Select
        value={event.direction}
        onChange={(value) => {
          event.direction = value;
          onEventChange();
        }}
        dropdownMatchSelectWidth={false}
      >
        {Object.values(ScrollHorizontalListDirection).map((direction) => (
          <Select.Option value={direction} key={direction}>
            {content.direction[direction]}
          </Select.Option>
        ))}
      </Select>
    </>
  );
});
