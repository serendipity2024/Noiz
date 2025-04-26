/* eslint-disable import/no-default-export */
/* eslint-disable default-case */
import { cloneDeep } from 'lodash';
import { observer } from 'mobx-react';
import React from 'react';
import useLocale from '../../../../hooks/useLocale';
import useModel from '../../../../hooks/useModel';
import { NullableReactElement } from '../../../../shared/type-definition/ZTypes';
import { MRefProp } from '../../../mobile-components/PropTypes';
import { CalendarAttributes } from '../../../mobile-components/ZCalendar';
import ClickActionConfigRow from '../config-row/ClickActionConfigRow';
import DataBindingConfigRow from '../config-row/DataBindingConfigRow';
import SwitchRow from '../shared/SwitchRow';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import i18n from './CalendarConfigTab.i18n.json';
import CalendarModel from '../../../../models/mobile-components/CalendarModel';
import ConfigTab from './ConfigTab';

const CalendarStyleConfigTab = observer((props: { model: CalendarModel }) => {
  const { localizedContent: content } = useLocale(i18n);
  const { model } = props;
  const dataAttributes = model.dataAttributes as CalendarAttributes;
  return (
    <SwitchRow
      componentModel={model}
      title={content.isVertical}
      dataAttribute={dataAttributes}
      field="isVertical"
      style={styles.fixedRow}
    />
  );
});

const CalendarDataConfigTab = observer((props: { model: CalendarModel }) => {
  const { localizedContent: content } = useLocale(i18n);
  const { model } = props;
  const dataAttributes = model.dataAttributes as CalendarAttributes;
  return (
    <DataBindingConfigRow
      title={content.currentDate}
      componentModel={model}
      dataBinding={dataAttributes.currentDate}
      onChange={(value) => {
        model.onUpdateDataAttributes('currentDate', value);
      }}
    />
  );
});

const CalendarActionConfigTab = observer((props: { model: CalendarModel }) => {
  const { localizedContent: content } = useLocale(i18n);
  const { model } = props;
  const dataAttributes = model.dataAttributes as CalendarAttributes;
  const onSelectDateActions = cloneDeep(dataAttributes.onSelectDateActions);
  return (
    <>
      <ZConfigRowTitle text={content.onSelectDateActions} />
      <ClickActionConfigRow
        componentModel={model}
        eventList={onSelectDateActions}
        eventListOnChange={(value) => model.onUpdateDataAttributes('onSelectDateActions', value)}
      />
    </>
  );
});

export default observer(function CalendarConfigTab(props: MRefProp): NullableReactElement {
  const model = useModel<CalendarModel>(props.mRef);

  if (!model) return null;

  return (
    <ConfigTab
      model={model}
      ActionConfigTab={CalendarActionConfigTab}
      DataConfigTab={CalendarDataConfigTab}
      StyleConfigTab={CalendarStyleConfigTab}
    />
  );
});

const styles: Record<string, React.CSSProperties> = {
  fixedRow: {
    marginTop: '10px',
  },
};
