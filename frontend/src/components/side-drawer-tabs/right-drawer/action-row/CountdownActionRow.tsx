/* eslint-disable import/no-default-export */
import { some } from 'lodash';
import { observer } from 'mobx-react';
import React from 'react';
import useLocale from '../../../../hooks/useLocale';
import StoreHelpers from '../../../../mobx/StoreHelpers';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import CountDownModel from '../../../../models/mobile-components/CountDownModel';
import { CountdownHandleBinding } from '../../../../shared/type-definition/EventBinding';
import { NullableReactElement } from '../../../../shared/type-definition/ZTypes';
import { ZThemedColors } from '../../../../utils/ZConst';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import { Select } from '../../../../zui';

import i18n from './CountdownActionRow.i18n.json';

interface Props {
  componentModel: BaseComponentModel;
  event: CountdownHandleBinding;
  onEventChange: () => void;
}

export default observer(function CountdownActionRow(props: Props): NullableReactElement {
  const { localizedContent: content } = useLocale(i18n);
  const { componentModel, event, onEventChange } = props;
  const screen = StoreHelpers.fetchRootModel(componentModel);
  const countdown = screen
    ? StoreHelpers.findAllModelsWithLogicInContainer({
        container: screen,
        filter: (model) => model instanceof CountDownModel,
      })
    : [];

  if (!some(countdown, { mRef: event.targetMRef })) {
    event.targetMRef = '';
  }

  return (
    <>
      <ZConfigRowTitle text={content.label.target} />
      <Select
        style={styles.select}
        key={event.targetMRef}
        value={event.targetMRef}
        onChange={(value) => {
          event.targetMRef = value;
          onEventChange();
        }}
        dropdownMatchSelectWidth={false}
      >
        {countdown.map((value) => (
          <Select.Option key={value.mRef} value={value.mRef}>
            {value.componentName}
          </Select.Option>
        ))}
      </Select>
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
