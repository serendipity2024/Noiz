/* eslint-disable import/no-default-export */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-param-reassign */
import { DeleteFilled, PlusOutlined } from '@ant-design/icons';
import React, { ReactElement } from 'react';
import uniqid from 'uniqid';
import { observer } from 'mobx-react';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import {
  ConditionalAction,
  ConditionalActionHandleBinding,
} from '../../../../shared/type-definition/EventBinding';
import { ZColors, ZThemedColors } from '../../../../utils/ZConst';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import ClickActionConfigRow, {
  getDefaultDisabledClickActionList,
  getWithDefaultActions,
} from '../config-row/ClickActionConfigRow';
import SharedStyles from '../config-row/SharedStyles';
import ConstantCondition, {
  ConstantConditionType,
} from '../../../../shared/type-definition/conditions/ConstantCondition';
import ConditionModalConfigRow from '../config-row/ConditionModalConfigRow';
import ConfigInput from '../shared/ConfigInput';
import i18n from './ConditionalActionRow.i18n.json';
import useLocale from '../../../../hooks/useLocale';
import { Collapse, Row } from '../../../../zui';
import cssModule from './ConditionalActionRow.module.scss';

interface Props {
  componentModel: BaseComponentModel;
  event: ConditionalActionHandleBinding;
  onEventChange: () => void;
}

export default observer(function ConditionalActionRow(props: Props): ReactElement {
  const { localizedContent: content } = useLocale(i18n);
  const { componentModel, event, onEventChange } = props;

  function addConditionalAction() {
    const id = `${uniqid.process()}`;
    event.conditionalActions.push({
      id,
      condition: ConstantCondition.from(ConstantConditionType.ALWAYS),
      actions: [],
    });
    onEventChange();
  }

  function deleteConditionalAction(condition: ConditionalAction) {
    event.conditionalActions = event.conditionalActions.filter((c) => c.id !== condition.id);
    onEventChange();
  }

  return (
    <>
      <Row align="middle" justify="space-between" style={styles.container}>
        <div style={styles.conditionalTitle}>{content.label.conditionalAction}</div>
        <div style={styles.buttonContainer} onClick={() => addConditionalAction()}>
          <PlusOutlined />
        </div>
      </Row>
      {props.event.conditionalActions.length > 0 ? (
        props.event.conditionalActions.map((conditionalAction) => {
          const key = conditionalAction.name ?? conditionalAction.id;

          return (
            <Collapse
              key={key}
              className={cssModule.conditionItem}
              bordered
              hideArrows
              setContentFontColorToOrangeBecauseHistoryIsCruel
              items={[
                {
                  title: key,
                  icon: (
                    <DeleteFilled
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteConditionalAction(conditionalAction);
                      }}
                    />
                  ),
                  content: (
                    <>
                      <ZConfigRowTitle text={content.label.name} />
                      <ConfigInput
                        value={conditionalAction.name ?? conditionalAction.id}
                        onSaveValue={(value) => {
                          conditionalAction.name = value;
                          onEventChange();
                        }}
                      />
                      <ConditionModalConfigRow
                        componentModel={props.componentModel}
                        condition={conditionalAction.condition}
                        onChange={(newCondition) => {
                          conditionalAction.condition = newCondition;
                          onEventChange();
                        }}
                      />
                      <ZConfigRowTitle text="Actions" />
                      <ClickActionConfigRow
                        componentModel={componentModel}
                        enabledActions={getWithDefaultActions(getDefaultDisabledClickActionList())}
                        eventList={conditionalAction.actions}
                        eventListOnChange={(eventList) => {
                          conditionalAction.actions = eventList;
                          onEventChange();
                        }}
                      />
                    </>
                  ),
                },
              ]}
            />
          );
        })
      ) : (
        <div style={styles.content}>
          <span style={SharedStyles.configRowTitleText}>{content.label.noActions}</span>
        </div>
      )}
    </>
  );
});

const styles: Record<string, React.CSSProperties> = {
  container: {
    marginTop: '10px',
    marginBottom: '10px',
  },
  conditionalTitle: {
    color: ZColors.WHITE,
    opacity: '0.5',
  },
  buttonContainer: {
    marginRight: '-5px',
    paddingLeft: '5px',
    paddingRight: '5px',
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
  groupCollapse: {
    background: '#fff',
    marginTop: '20px',
  },
  groupPanel: {
    background: '#eee',
  },
};
