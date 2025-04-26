/* eslint-disable import/no-default-export */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { observer } from 'mobx-react';
import React from 'react';
import useModel from '../../hooks/useModel';
import ZFrame from '../../models/interfaces/Frame';
import { DataBinding } from '../../shared/type-definition/DataBinding';
import { TimeType } from '../../shared/type-definition/DataModel';
import { EventBinding } from '../../shared/type-definition/EventBinding';
import { NullableReactElement } from '../../shared/type-definition/ZTypes';
import { MRefProp } from './PropTypes';

export const ZCalendarDefaultReferenceAttributes = {
  currentDate: DataBinding.withSingleValue(TimeType.DATE),
  onSelectDateActions: [] as EventBinding[],
};

export const ZCalendarDefaultDataAttributes = {
  isVertical: false,
  ...ZCalendarDefaultReferenceAttributes,
};

export type CalendarAttributes = typeof ZCalendarDefaultDataAttributes;

export const ZCalendarDefaultFrame: ZFrame = {
  size: { width: 375, height: 305 },
  position: { x: 0, y: 0 },
};

export default observer(function ZCalendar(props: MRefProp): NullableReactElement {
  const model = useModel(props.mRef);
  if (!model) return null;

  return (
    <div style={{ ...styles.container }}>
      <div style={styles.icon}>Calendar</div>
    </div>
  );
});

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#fff',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    backgroundColor: '#ddd',
  },
  icon: {
    fontSize: '24px',
    color: '#ffa522',
  },
};
