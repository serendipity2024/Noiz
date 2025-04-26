/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React, { ReactElement, useContext } from 'react';
import { cloneDeep } from 'lodash';
import useDataModelMetadata from '../../../../hooks/useDataModelMetadata';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import { ARRAY_TYPE, SELF_ROLE, USER_ROLE } from '../../../../shared/type-definition/DataModel';
import {
  EventBinding,
  GraphQLRequestBinding,
} from '../../../../shared/type-definition/EventBinding';
import DataBindingHelper from '../../../../utils/DataBindingHelper';
import {
  getDefaultDisabledClickActionList,
  getWithDefaultActions,
} from '../config-row/ClickActionConfigRow';
import DataBindingConfigRow from '../config-row/DataBindingConfigRow';
import MutationConflictConfigRow from '../config-row/MutationConflictConfigRow';
import RequestFilterConfigRow from '../config-row/RequestFilterConfigRow';
import TriggerConfigRow from '../config-row/TriggerConfigRow';
import RequestResultActionRow from './RequestResultActionRow';
import i18n from './MutationActionRow.i18n.json';
import useLocale from '../../../../hooks/useLocale';
import { VariableContext } from '../../../../context/VariableContext';
import {
  ArithmeticOperator,
  DataBinding,
  DataBindingKind,
  isNumericType,
  ValueBinding,
  Variable,
} from '../../../../shared/type-definition/DataBinding';
import { ZColors, ZThemedColors } from '../../../../utils/ZConst';
import HackCenter from '../../../../utils/HackCenter';
import { ActionConfigMode } from '../../../../models/interfaces/EventModel';
import { Row, Select, Switch } from '../../../../zui';

const NONE = 'none';

interface Props {
  configMode?: ActionConfigMode;
  componentModel: BaseComponentModel;
  event: EventBinding;
  onEventChange: () => void;
}

export default observer(function MutationActionRow(props: Props): ReactElement {
  const { localizedContent: content } = useLocale(i18n);
  const { resultVariableRecord } = useContext(VariableContext);
  const { dataModelRegistry } = useDataModelMetadata();

  const requestHandleBinding = props.event as GraphQLRequestBinding;
  let requestObject = requestHandleBinding.object ?? {};
  const configMode: ActionConfigMode = props.configMode ?? ActionConfigMode.NORMAL;

  const requestModel = dataModelRegistry.getGraphQLModel(requestHandleBinding.rootFieldType);
  if (requestModel && requestHandleBinding.operation !== 'delete') {
    requestObject = {
      ...DataBindingHelper.convertGraphQLObjectArgs(
        dataModelRegistry.convertFieldsToInputs(requestModel.fields)
      ),
      ...requestObject,
    };
  }

  if (requestHandleBinding.operation === 'update') {
    const objectArgs: Record<string, DataBinding> = {};
    Object.keys(requestObject).forEach((key) => {
      if (requestObject[key].type !== 'array') {
        objectArgs[key] = requestObject[key];
      }
    });
    requestObject = objectArgs;
  }

  const currentResultVariableRecord: Record<string, Variable> =
    cloneDeep(resultVariableRecord) ?? {};
  currentResultVariableRecord[requestHandleBinding.requestId] = {
    type: requestHandleBinding.rootFieldType,
    nullable: false,
  };

  const renderArithmeticOperatorSelectComponent = (title: string, dataBinding: DataBinding) => {
    if (!isNumericType(dataBinding.type)) return undefined;
    const operatorList: ArithmeticOperator[] = Object.values(ArithmeticOperator);
    return (
      <Select
        placeholder="select arithmetic operator"
        value={dataBinding.arithmeticOperator ?? NONE}
        style={styles.operatorSelect}
        onChange={(op) => {
          const newValue = dataBinding;
          newValue.arithmeticOperator = op === NONE ? undefined : op;
          requestObject[title] = newValue;
          requestHandleBinding.object = requestObject;
          props.onEventChange();
        }}
      >
        <Select.Option key={NONE} value={NONE}>
          {NONE}
        </Select.Option>
        {operatorList.map((op) => (
          <Select.Option key={op} value={op}>
            {op}
          </Select.Option>
        ))}
      </Select>
    );
  };

  const listmutationEnable = requestHandleBinding.operation === 'insert';

  return (
    <div>
      {listmutationEnable && (
        <Row justify="space-between" align="middle">
          <div style={styles.switchTitle}>{content.label.listMutation}</div>
          <Switch
            defaultChecked={requestHandleBinding.listMutation}
            onChange={(checked) => {
              requestHandleBinding.listMutation = checked;
              requestHandleBinding.listMutationSourceData = undefined;
              props.onEventChange();
            }}
          />
        </Row>
      )}
      {requestHandleBinding.listMutation === true && (
        <DataBindingConfigRow
          title={content.label.listMutationSourceData}
          componentModel={props.componentModel}
          dataBinding={
            requestHandleBinding.listMutationSourceData ?? DataBinding.withSingleValue(ARRAY_TYPE)
          }
          onChange={(value) => {
            requestHandleBinding.listMutationSourceData = value;
            Object.entries(requestObject).forEach(([name, dataBinding]) => {
              if (
                requestHandleBinding.object &&
                dataBinding.valueBinding instanceof Object &&
                (dataBinding.valueBinding as ValueBinding)?.kind ===
                  DataBindingKind.ARRAY_ELEMENT_MAPPING
              ) {
                requestHandleBinding.object[name] = DataBinding.withSingleValue(
                  dataBinding.type,
                  dataBinding.itemType
                );
              }
            });
            props.onEventChange();
          }}
        />
      )}

      <div style={styles.mutationTitle}>{content.label.role}</div>
      <Select
        size="large"
        key={requestHandleBinding.role}
        defaultValue={requestHandleBinding.role ?? USER_ROLE}
        style={styles.roleSelect}
        onChange={(value) => {
          requestHandleBinding.role = value;
          props.onEventChange();
        }}
      >
        <Select.Option value={USER_ROLE}>{content.role.user}</Select.Option>
        <Select.Option value={SELF_ROLE}>{content.role.self}</Select.Option>
      </Select>
      {Object.entries(requestObject).length > 0 ? (
        <div style={styles.mutationTitle}>{content.label.parameter}</div>
      ) : null}
      {Object.entries(requestObject).map(([title, dataBinding]) => (
        <DataBindingConfigRow
          key={title}
          title={title}
          componentModel={props.componentModel}
          dataBinding={dataBinding}
          arrayMappingSource={requestHandleBinding.listMutationSourceData}
          operatorSelectionComponent={renderArithmeticOperatorSelectComponent(title, dataBinding)}
          onChange={(value) => {
            // hack media id
            requestObject[title] = HackCenter.hackMediaDataDinding(value);
            requestHandleBinding.object = requestObject;
            props.onEventChange();
          }}
        />
      ))}
      {requestHandleBinding.operation === 'insert' && (
        <MutationConflictConfigRow
          request={requestHandleBinding}
          onRequestChange={() => props.onEventChange()}
        />
      )}
      <RequestFilterConfigRow
        componentModel={props.componentModel}
        request={requestHandleBinding}
        onRequestChange={() => props.onEventChange()}
      />
      <VariableContext.Provider value={{ resultVariableRecord: currentResultVariableRecord }}>
        {configMode === ActionConfigMode.NORMAL ? (
          <TriggerConfigRow
            componentModel={props.componentModel}
            requestHandleBinding={requestHandleBinding}
            triggerOnChange={() => props.onEventChange()}
          />
        ) : null}
        <RequestResultActionRow
          componentModel={props.componentModel}
          event={requestHandleBinding}
          onEventChange={props.onEventChange}
          enabledActions={getWithDefaultActions(getDefaultDisabledClickActionList())}
        />
      </VariableContext.Provider>
    </div>
  );
});

const styles: Record<string, React.CSSProperties> = {
  mutationTitle: {
    marginTop: '10px',
    color: ZColors.WHITE,
    opacity: '0.5',
  },
  roleSelect: {
    marginTop: '10px',
    width: '100%',
    fontSize: '10px',
    background: ZThemedColors.PRIMARY,
    borderRadius: '6px',
    textAlign: 'center',
  },
  switchTitle: {
    margin: '10px 0px',
    color: ZColors.WHITE,
    opacity: '0.5',
  },
  operatorSelect: {
    width: '100%',
    marginBottom: '10px',
  },
};
