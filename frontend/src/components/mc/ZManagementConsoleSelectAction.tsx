import { DeleteFilled, PlusOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react';
import React, { ReactElement } from 'react';
import { CascaderOptionType, CascaderValueType } from 'antd/lib/cascader';
import uniqid from 'uniqid';
import useLocale from '../../hooks/useLocale';
import { NullableReactElement } from '../../shared/type-definition/ZTypes';
import SharedStyles from '../side-drawer-tabs/right-drawer/config-row/SharedStyles';
import cssModule from './ZManagementConsoleSelectAction.module.scss';
import i18n from './ZManagementConsoleSelectAction.i18n.json';
import {
  ManagementConsoleAction,
  ManagementConsoleActionType,
} from '../../shared/type-definition/ManagementConsole';
import ConfigInput from '../side-drawer-tabs/right-drawer/shared/ConfigInput';
import { Cascader, Collapse, Row } from '../../zui';

interface Props {
  title: string;
  actions: ManagementConsoleAction[];
  onSelectChange: (action: ManagementConsoleAction[]) => void;
}

export const ZManagementConsoleSelectAction = observer((props: Props): NullableReactElement => {
  const { localizedContent } = useLocale(i18n);
  const actions = props.actions ?? [];

  const prepareButtonActions = (): CascaderOptionType[] => {
    return Object.values(ManagementConsoleActionType).map((actionType) => {
      return {
        name: actionType,
        value: actionType,
        isLeaf: true,
        disabled: actions.map((e) => e.actionType).includes(actionType),
      };
    });
  };

  const onCascaderChange = (selectedValues: CascaderValueType): void => {
    if (selectedValues.length !== 1) {
      throw new Error('action multiple selection is not supported');
    }
    const actionType = selectedValues[0];

    let needsExplicitTarget = false;
    switch (actionType) {
      case ManagementConsoleActionType.DELETE_OBJECTS:
      case ManagementConsoleActionType.UPDATE_OBJECTS: {
        needsExplicitTarget = true;
        break;
      }
      case ManagementConsoleActionType.CREATE_OBJECT: {
        needsExplicitTarget = false;
        break;
      }
      default:
        throw new Error('unsupported mc action type');
    }
    props.onSelectChange([
      ...actions,
      {
        id: uniqid.process(),
        displayName: actionType.toString(),
        permittedRoles: [],
        needsExplicitTarget,
        actionType,
      },
    ]);
  };

  function renderBaseActionComponent(action: ManagementConsoleAction): ReactElement {
    return (
      <div>
        <Row className={cssModule.dataContainer} align="middle">
          <div className={cssModule.configItem}>
            <div className={cssModule.introduceTitle}>{localizedContent.displayName}</div>

            <ConfigInput
              className={cssModule.input}
              value={action.displayName}
              onSaveValue={(value) => {
                props.onSelectChange(
                  actions.map((element) => {
                    if (element.id === action.id) {
                      return { ...element, displayName: value };
                    }
                    return element;
                  })
                );
              }}
            />
          </div>
          <div className={cssModule.configItem}>
            <div className={cssModule.introduceTitle}>{localizedContent.actionType}</div>
            <ConfigInput className={cssModule.input} value={action.actionType} disable />
          </div>
        </Row>
      </div>
    );
  }

  const onDeleteAction = (actionId: string) => {
    props.onSelectChange(actions.filter((action) => action.id !== actionId));
  };

  function renderActionListComponent(): ReactElement {
    return (
      <div className={` ${cssModule.selectAction} ${cssModule.actionCollapse}`}>
        <Collapse
          bordered
          setContentFontColorToOrangeBecauseHistoryIsCruel
          items={actions.map((action) => ({
            title: action.displayName,
            icon: (
              <DeleteFilled
                onClick={(event) => {
                  event.stopPropagation();
                  onDeleteAction(action.id);
                }}
              />
            ),
            content: renderBaseActionComponent(action),
          }))}
        />
      </div>
    );
  }

  return (
    <div className={cssModule.container}>
      <Row justify="space-between" align="middle">
        <div className={cssModule.title}>{props.title}</div>
        <Cascader
          className="config-cascader"
          bordered={false}
          fieldNames={{ label: 'name', value: 'value', children: 'fields' }}
          options={prepareButtonActions()}
          value={[]}
          onChange={(value) => onCascaderChange(value)}
        >
          <PlusOutlined className={cssModule.icon} />
        </Cascader>
      </Row>
      {actions.length > 0 ? (
        renderActionListComponent()
      ) : (
        <div className={cssModule.content}>
          <span style={SharedStyles.configRowTitleText}>{localizedContent.noActions}</span>
        </div>
      )}
    </div>
  );
});
