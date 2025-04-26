/* eslint-disable import/no-default-export */
/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
import { observer } from 'mobx-react';
import React from 'react';
import { DeleteFilled, PlusOutlined } from '@ant-design/icons';
import uniqid from 'uniqid';
import { cloneDeep } from 'lodash';
import useModel from '../../../../hooks/useModel';
import { NullableReactElement } from '../../../../shared/type-definition/ZTypes';
import { MRefProp } from '../../../mobile-components/PropTypes';
import ClickActionConfigRow from '../config-row/ClickActionConfigRow';
import DataBindingConfigRow from '../config-row/DataBindingConfigRow';
import TextStyleConfigRow from '../config-row/TextStyleConfigRow';
import ColorPicker from '../shared/ColorPicker';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import CombinedConfigRow from '../config-row/CombinedStyleConfigRow';
import { CountDownAttributes } from '../../../mobile-components/ZCountDown';
import { DataBinding } from '../../../../shared/type-definition/DataBinding';
import SharedStyles from '../config-row/SharedStyles';
import { ZThemedColors } from '../../../../utils/ZConst';
import { IntegerType } from '../../../../shared/type-definition/DataModel';
import { EventBinding } from '../../../../shared/type-definition/EventBinding';
import i18n from './CountDownConfigTab.i18n.json';
import commonI18n from './CommonConfigTab.i18n.json';
import useLocale from '../../../../hooks/useLocale';
import CountDownModel from '../../../../models/mobile-components/CountDownModel';
import ConfigTab from './ConfigTab';
import SwitchRow from '../shared/SwitchRow';
import { Collapse, Row } from '../../../../zui';

const CountDownStyleConfigTab = observer((props: { model: CountDownModel }) => {
  const { model } = props;
  const dataAttributes = model.dataAttributes as CountDownAttributes;
  const { backgroundColor, color } = dataAttributes;
  const { localizedContent: commonContent } = useLocale(commonI18n);
  return (
    <>
      <ZConfigRowTitle text={commonContent.label.color} />
      <ColorPicker
        name={commonContent.label.backgroundColor}
        style={styles.colorSelect}
        color={backgroundColor}
        onChange={(value) => {
          dataAttributes.backgroundColor = DataBinding.withColor(value);
        }}
      />
      <ColorPicker
        name={commonContent.label.textColor}
        style={styles.colorSelect}
        color={color}
        onChange={(value) => {
          dataAttributes.color = DataBinding.withColor(value);
        }}
      />
      <TextStyleConfigRow data={model} />
      <CombinedConfigRow data={model} />
    </>
  );
});

const CountDownDataConfigTab = observer((props: { model: CountDownModel }) => {
  const { model } = props;
  const { localizedContent: content } = useLocale(i18n);
  const dataAttributes = model.dataAttributes as CountDownAttributes;
  const { prefixTitle, millisFromStart, suffixTitle } = dataAttributes;
  return (
    <>
      <SwitchRow
        componentModel={model}
        dataAttribute={dataAttributes}
        field="invisible"
        title={content.label.invisible}
      />
      {dataAttributes.invisible ? (
        <></>
      ) : (
        <DataBindingConfigRow
          title={content.label.prefix}
          componentModel={model}
          dataBinding={prefixTitle}
          onChange={(data) => model.onUpdateDataAttributes('prefixTitle', data)}
        />
      )}
      <DataBindingConfigRow
        title={content.label.millis}
        componentModel={model}
        dataBinding={millisFromStart}
        onChange={(data) => model.onUpdateDataAttributes('millisFromStart', data)}
      />
      {dataAttributes.invisible ? (
        <></>
      ) : (
        <DataBindingConfigRow
          title={content.label.suffix}
          componentModel={model}
          dataBinding={suffixTitle}
          onChange={(data) => model.onUpdateDataAttributes('suffixTitle', data)}
        />
      )}
    </>
  );
});

const CountDownActionConfigTab = observer((props: { model: CountDownModel }) => {
  const { model } = props;
  const { localizedContent: content } = useLocale(i18n);
  const dataAttributes = model.dataAttributes as CountDownAttributes;

  const onTimeUpActions = cloneDeep(dataAttributes.onTimeUpActions);
  const eventListeners = cloneDeep(dataAttributes.eventListeners);

  const addEventListener = () => {
    const events = [
      ...eventListeners,
      {
        id: uniqid.process(),
        millisUntilExpiry: DataBinding.withLiteral(0, IntegerType.INTEGER),
        actions: [] as EventBinding[],
      },
    ];
    model.onUpdateDataAttributes('eventListeners', events);
  };

  const deleteEventListener = (id: string) => {
    const events = eventListeners.filter((lfe) => lfe.id !== id);
    model.onUpdateDataAttributes('eventListeners', events);
  };

  const changeEventListenerMillisUntilExpiry = (id: string, millisUntilExpiry: DataBinding) => {
    const events = eventListeners.map((lfe) => {
      if (lfe.id === id) lfe.millisUntilExpiry = millisUntilExpiry;
      return lfe;
    });
    model.onUpdateDataAttributes('eventListeners', events);
  };

  const changeEventListenerActions = (id: string, actions: EventBinding[]) => {
    const events = eventListeners.map((lfe) => {
      if (lfe.id === id) lfe.actions = actions;
      return lfe;
    });
    model.onUpdateDataAttributes('eventListeners', events);
  };

  return (
    <>
      <Row align="middle" justify="space-between" style={styles.listenContainer}>
        <ZConfigRowTitle text={content.label.listen} />
        <div
          style={styles.buttonContainer}
          onClick={(e) => {
            e.stopPropagation();
            addEventListener();
          }}
        >
          <PlusOutlined style={styles.listenTitle} />
        </div>
      </Row>
      {eventListeners.length > 0 ? (
        <Collapse
          bordered
          setContentFontColorToOrangeBecauseHistoryIsCruel
          items={eventListeners.map((lfe) => ({
            title: lfe.id,
            icon: (
              <DeleteFilled
                onClick={(e): void => {
                  e.stopPropagation();
                  deleteEventListener(lfe.id);
                }}
              />
            ),
            content: (
              <>
                <DataBindingConfigRow
                  title={content.listen.secondsUntilExpiry}
                  componentModel={model}
                  dataBinding={lfe.millisUntilExpiry}
                  onChange={(data) => changeEventListenerMillisUntilExpiry(lfe.id, data)}
                />
                <ZConfigRowTitle text={content.listen.actions} />
                <ClickActionConfigRow
                  componentModel={model}
                  eventList={lfe.actions}
                  eventListOnChange={(actions) => changeEventListenerActions(lfe.id, actions)}
                />
              </>
            ),
          }))}
        />
      ) : (
        <div style={styles.listenContent}>
          <span style={SharedStyles.configRowTitleText}>{content.listen.noListen}</span>
        </div>
      )}
      <ZConfigRowTitle text={content.label.actions} />
      <ClickActionConfigRow
        componentModel={model}
        eventList={onTimeUpActions}
        eventListOnChange={(value) => model.onUpdateDataAttributes('onTimeUpActions', value)}
      />
    </>
  );
});

export default observer(function CountDownConfigTab(props: MRefProp): NullableReactElement {
  const model = useModel<CountDownModel>(props.mRef);
  if (!model) return null;

  return (
    <ConfigTab
      model={model}
      DataConfigTab={CountDownDataConfigTab}
      ActionConfigTab={CountDownActionConfigTab}
      StyleConfigTab={CountDownStyleConfigTab}
    />
  );
});

const styles: Record<string, React.CSSProperties> = {
  colorSelect: {
    verticalAlign: 'middle',
    color: '#fff',
    width: '100%',
    height: '55px',
    borderRadius: '10px',
    marginBottom: '10px',
  },
  buttonContainer: {
    marginRight: '-5px',
    paddingLeft: '5px',
    paddingRight: '5px',
  },
  listenContainer: {
    marginTop: '10px',
    marginBottom: '10px',
  },
  listenContent: {
    borderWidth: '1px',
    borderColor: ZThemedColors.PRIMARY_TEXT,
    borderRadius: '5px',
    borderStyle: 'dashed',
    width: '100%',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listenTitle: {
    color: ZThemedColors.PRIMARY_TEXT,
  },
};
