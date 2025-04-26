/* eslint-disable import/no-default-export */
import { includes, matches } from 'lodash';
import { observer } from 'mobx-react';
import React from 'react';
import useLocale from '../../../../hooks/useLocale';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import { ComponentModelType } from '../../../../shared/type-definition/ComponentModelType';
import { DataBinding } from '../../../../shared/type-definition/DataBinding';
import { IntegerType } from '../../../../shared/type-definition/DataModel';
import { LottieAction, LottieHandleBinding } from '../../../../shared/type-definition/EventBinding';
import { ZColors, ZThemedColors } from '../../../../utils/ZConst';
import DataBindingConfigRow from '../config-row/DataBindingConfigRow';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import i18n from './LottieActionRow.i18n.json';
import { Radio, Row, Select, Switch } from '../../../../zui';

interface Props {
  componentModel: BaseComponentModel;
  event: LottieHandleBinding;
  onEventChange: () => void;
}

export default observer(function LottieActionRow(props: Props) {
  const { localizedContent: content } = useLocale(i18n);
  const { componentModel, event, onEventChange } = props;

  const targets = componentModel
    .parent()
    .children()
    .filter(matches({ type: ComponentModelType.LOTTIE }));

  return (
    <>
      <ZConfigRowTitle text={content.label.action} />
      <Radio.Group
        key={event.action}
        value={event.action}
        style={styles.radioTitle}
        onChange={(e) => {
          event.action = e.target.value;
          onEventChange();
        }}
      >
        {Object.values(LottieAction).map((action) => (
          <Radio value={action} key={action} style={styles.radioTitle}>
            {content.action[action]}
          </Radio>
        ))}
      </Radio.Group>
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
        {targets.map((value) => (
          <Select.Option key={value.mRef} value={value.mRef}>
            {value.componentName}
          </Select.Option>
        ))}
      </Select>
      {includes([LottieAction.PLAY, LottieAction.PLAY_SEGMENTS], event.action) ? (
        <>
          <Row justify="space-between" align="middle" style={styles.fixedRow}>
            <ZConfigRowTitle text={content.label.playFrom} />
            <Switch
              key={JSON.stringify(event.startFrame)}
              checked={!event.startFrame.isEmpty}
              onChange={(checked) => {
                if (checked) event.startFrame = DataBinding.withLiteral(0, IntegerType.INTEGER);
                else event.startFrame = DataBinding.withSingleValue(IntegerType.INTEGER);
                onEventChange();
              }}
            />
          </Row>
          <DataBindingConfigRow
            title={content.label.frame}
            dataBinding={event.startFrame}
            onChange={(value) => {
              event.startFrame = value;
              onEventChange();
            }}
            componentModel={componentModel}
          />
        </>
      ) : (
        <></>
      )}

      {includes(
        [LottieAction.PLAY_SEGMENTS, LottieAction.STOP, LottieAction.PAUSE],
        event.action
      ) ? (
        <>
          <Row justify="space-between" align="middle" style={styles.fixedRow}>
            <ZConfigRowTitle text={content.label.stopAt} />
            <Switch
              key={JSON.stringify(event.endFrame)}
              checked={!event.endFrame.isEmpty}
              onChange={(checked) => {
                if (checked) event.endFrame = DataBinding.withLiteral(0, IntegerType.INTEGER);
                else event.endFrame = DataBinding.withSingleValue(IntegerType.INTEGER);
                onEventChange();
              }}
            />
          </Row>
          <DataBindingConfigRow
            title={content.label.frame}
            dataBinding={event.endFrame}
            onChange={(value) => {
              event.endFrame = value;
              onEventChange();
            }}
            componentModel={componentModel}
          />
        </>
      ) : (
        <></>
      )}

      {event.action === LottieAction.SET_DIRECTION ? (
        <>
          <Row justify="space-between" align="middle" style={styles.fixedRow}>
            <ZConfigRowTitle text={content.action.setDirection} />
          </Row>
          <DataBindingConfigRow
            title={content.label.direction}
            dataBinding={event.direction}
            onChange={(value) => {
              event.direction = value;
              onEventChange();
            }}
            componentModel={componentModel}
          />
        </>
      ) : (
        <></>
      )}
    </>
  );
});

const styles: Record<string, React.CSSProperties> = {
  fixedRow: {
    marginTop: '10px',
  },
  select: {
    width: '100%',
    fontSize: '10px',
    background: ZThemedColors.PRIMARY,
    textAlign: 'center',
    borderRadius: '6px',
  },
  radioTitle: {
    color: ZColors.WHITE,
  },
};
