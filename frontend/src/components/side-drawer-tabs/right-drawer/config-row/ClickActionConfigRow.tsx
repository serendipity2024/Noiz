/* eslint-disable import/no-default-export */
import { CascaderOptionType } from 'antd/lib/cascader';
import { observer } from 'mobx-react';
import React, { ReactElement } from 'react';
import { DraggableProvided } from 'react-beautiful-dnd';
import useScreenModels from '../../../../hooks/useScreenModels';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import {
  EventBinding,
  EventType,
  UserLoginActionType,
} from '../../../../shared/type-definition/EventBinding';
import { ShortId } from '../../../../shared/type-definition/ZTypes';
import { ZThemedColors } from '../../../../utils/ZConst';
import SharedStyles from './SharedStyles';
import { EventsDragDropConfigRow } from './EventsDragDropConfigRow';
import './ClickActionConfigRow.scss';
import i18n from './ClickActionConfigRow.i18n.json';
import useLocale from '../../../../hooks/useLocale';
import useLocalizeEventBindingTitle from '../../../../hooks/useLocalizeEventBindingTitle';
import BaseContainerModel from '../../../../models/base/BaseContainerModel';
import { EventModelBuilder } from '../../../../models/EventModelBuilder';
import { ActionConfigMode } from '../../../../models/interfaces/EventModel';
import { Cascader, Collapse, Row } from '../../../../zui';

export interface ActionSwitchConfig {
  type: EventType;
  enabled: boolean;
  enabledSubTypes?: string[];
}

function getDefaultEnabledActionList(): ActionSwitchConfig[] {
  // TODO: query 和 subscription 不属于主动事件, 后面需拿出来
  return Object.values(EventType)
    .filter((eventType) => eventType !== EventType.QUERY && eventType !== EventType.SUBSCRIPTION)
    .map((eventType) => {
      const eventModel = EventModelBuilder.getByType(eventType);
      return {
        type: eventType,
        enabled: eventModel.canSelect(),
      };
    });
}

export function getDefaultDisabledClickActionList(): ActionSwitchConfig[] {
  return [
    {
      type: EventType.USER_LOGIN,
      enabled: true,
      enabledSubTypes: [UserLoginActionType.WECHAT_SILENT_LOGIN],
    },
    { type: EventType.USER_REGISTER, enabled: false },
    { type: EventType.SHARE, enabled: false },
    { type: EventType.CALL_PHONE, enabled: false },
    { type: EventType.WECHAT_CONTACT, enabled: false },
    { type: EventType.OBTAIN_PHONE_NUMBER, enabled: false },
    { type: EventType.OPEN_WECHAT_SETTING, enabled: false },
  ];
}

export function getWithDefaultActions(list: ActionSwitchConfig[]): ActionSwitchConfig[] {
  const tempRecord: Record<string, ActionSwitchConfig> = Object.fromEntries(
    getDefaultEnabledActionList().map((data) => [data.type, data])
  );
  list.forEach((enabledAction) => {
    tempRecord[enabledAction.type] = enabledAction;
  });
  return Object.values(tempRecord);
}

interface Props {
  componentModel: BaseComponentModel;
  configMode?: ActionConfigMode;
  enabledActions?: ActionSwitchConfig[];
  eventList?: EventBinding[];
  eventListOnChange: (eventList: EventBinding[]) => void;
}

export default observer(function ClickActionConfigRow(props: Props): ReactElement {
  const { localizedContent: content } = useLocale(i18n);
  const localizeEventBindingTitle = useLocalizeEventBindingTitle();
  const screenComponents = useScreenModels();

  const {
    componentModel,
    configMode = ActionConfigMode.NORMAL,
    eventList = [],
    enabledActions = props.enabledActions ? props.enabledActions : getDefaultEnabledActionList(),
    eventListOnChange,
  } = props;

  const screenMRefMap = new Map<ShortId, BaseContainerModel>();
  screenComponents.forEach((model): void => {
    screenMRefMap.set(model.mRef, model);
  });

  const prepareButtonActions = (): Array<CascaderOptionType> => {
    const map = new Map<any, CascaderOptionType>();
    enabledActions.forEach((enabledAction) => {
      if (enabledAction.enabled) {
        const eventType = enabledAction.type;
        const eventModel = EventModelBuilder.getByType(eventType);
        const cascaderOption = eventModel.getCascaderOption(
          componentModel,
          enabledAction.enabledSubTypes
        );
        if (cascaderOption) {
          map.set(eventType, cascaderOption);
        }
      }
    });
    return Array.from(map.values());
  };

  const onCascaderChange = (selectedOptions: any): void => {
    const options = selectedOptions as Record<string, any>[];
    if (!options || options.length < 1) return;

    const type = options[0].value as EventType;
    const obj = options[options.length - 1];
    const eventModel = EventModelBuilder.getByType(type);
    const newEventList = eventList.concat(eventModel.getDefaultEventBinding(obj));
    props.eventListOnChange(newEventList);
  };

  const renderActionPanel = (
    event: EventBinding,
    index: number,
    provided: DraggableProvided
  ): ReactElement => {
    const eventModel = EventModelBuilder.getByType(event.type);
    const key = event.type + index;
    return (
      <div
        ref={provided.innerRef}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...provided.draggableProps}
        style={{ ...provided.draggableProps.style, ...styles.eventContainer }}
      >
        <Collapse
          key={key}
          bordered
          hideArrows
          setContentFontColorToOrangeBecauseHistoryIsCruel
          items={[
            {
              headerComponent: renderHeaderComponent(event, index, provided),
              key,
              content: (
                <div style={styles.inputContainer}>
                  {eventModel.renderForConfigRow({
                    event,
                    componentModel,
                    onChange: () => eventListOnChange(eventList),
                  })}
                </div>
              ),
            },
          ]}
        />
      </div>
    );
  };
  const renderHeaderComponent = (
    event: EventBinding,
    index: number,
    provided: DraggableProvided
  ) => {
    const eventModel = EventModelBuilder.getByType(event.type);
    return (
      <>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <div {...provided.dragHandleProps} style={styles.headerContent}>
          <Row justify="start" align="middle" style={styles.headerRow}>
            <div style={styles.headerTitle}>{localizeEventBindingTitle(event)}</div>
          </Row>
          {eventModel.renderForExtraAction({
            event,
            componentModel,
            onDelete: () => {
              props.eventListOnChange(eventList.filter((_, i) => index !== i));
            },
          })}
        </div>
      </>
    );
  };
  const renderEventList = () => {
    if (eventList.length > 0) {
      return (
        <EventsDragDropConfigRow
          events={eventList}
          renderRow={renderActionPanel}
          onChange={(list) => props.eventListOnChange(list)}
        />
      );
    }
    let emptyTitle;
    switch (configMode) {
      case ActionConfigMode.TRIGGER:
        emptyTitle = content.label.noTrigger;
        break;
      default:
        emptyTitle = content.label.noAction;
    }
    return (
      <div style={styles.content}>
        <span style={SharedStyles.configRowTitleText}>{emptyTitle}</span>
      </div>
    );
  };
  const renderActionAddButton = () => {
    let emptyTitle;
    switch (configMode) {
      case ActionConfigMode.TRIGGER:
        emptyTitle = content.label.addTrigger;
        break;
      default:
        emptyTitle = content.label.addAction;
    }

    const filter = (inputValue: string, path: CascaderOptionType[]) => {
      return path.some(
        (option) => option.name.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
      );
    };

    return (
      <Cascader
        className="config-cascader"
        bordered={false}
        fieldNames={{ label: 'name', value: 'value', children: 'fields' }}
        options={prepareButtonActions()}
        value={[]}
        onChange={(_, selectedOptions) => onCascaderChange(selectedOptions)}
        showSearch={{ filter }}
        placeholder={emptyTitle}
      />
    );
  };

  return (
    <>
      {renderEventList()}
      {renderActionAddButton()}
    </>
  );
});

const styles: Record<string, React.CSSProperties> = {
  headerTitle: {
    fontSize: '15px',
    lineHeight: '15px',
    marginLeft: '5px',
  },
  headerContent: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: {
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
  deleteIcon: {
    fontSize: '16px',
  },
  inputContainer: {
    marginTop: '15px',
  },
  transitionHeader: {
    padding: '10px 5px',
  },
  transitionSelect: {
    width: '100%',
    fontSize: '13px',
    background: '#eee',
    textAlign: 'center',
  },
  paremetersHeader: {
    marginTop: '15px',
    padding: '10px 5px',
  },
  headerRow: {
    width: '90%',
  },
  mutationTitle: {
    marginTop: '10px',
  },
  roleSelect: {
    marginTop: '10px',
    width: '100%',
    fontSize: '10px',
    background: '#fff',
    textAlign: 'center',
  },
  videoSelect: {
    width: '100%',
    fontSize: '10px',
    background: '#eee',
    textAlign: 'center',
  },
  sortField: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: '40px',
    fontSize: '10px',
    background: '#eee',
  },
  sortTitle: {
    textAlign: 'center',
    flex: '1',
    marginLeft: '10px',
    marginRight: '10px',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    wordBreak: 'break-all',
    WebkitLineClamp: 1,
  },
  sortIcon: {
    fontSize: '12px',
    color: '#a8a8a8',
    marginRight: '10px',
  },
  select: {
    width: '100%',
    fontSize: '10px',
    background: '#eee',
    textAlign: 'center',
  },
  webViewTitle: {
    color: 'red',
  },
  eventContainer: {
    marginTop: '10px',
  },
};
