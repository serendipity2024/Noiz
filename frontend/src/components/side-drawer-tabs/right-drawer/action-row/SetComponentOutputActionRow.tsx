/* eslint-disable import/no-default-export */
import _ from 'lodash';
import { observer } from 'mobx-react';
import React, { ReactElement } from 'react';
import useLocale from '../../../../hooks/useLocale';
import StoreHelpers from '../../../../mobx/StoreHelpers';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import {
  COMPONENT_OUTPUT_DATA_PATH,
  DataBinding,
  PathComponent,
} from '../../../../shared/type-definition/DataBinding';
import { ARRAY_TYPE } from '../../../../shared/type-definition/DataModel';
import {
  SetVariableData,
  SetComponentOutputHandleBinding,
} from '../../../../shared/type-definition/EventBinding';
import { ZThemedColors } from '../../../../utils/ZConst';
import DataBindingConfigRow from '../config-row/DataBindingConfigRow';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import i18n from './SetPageDataActionRow.i18n.json';
import { Select } from '../../../../zui';

interface Props {
  componentModel: BaseComponentModel;
  event: SetComponentOutputHandleBinding;
  onEventChange: () => void;
}

export default observer(function SetComponentOutputActionRow(props: Props): ReactElement {
  const { localizedContent: content } = useLocale(i18n);

  const eventBinding = props.event;
  const rootModel = StoreHelpers.fetchRootModel(props.componentModel);
  if (!rootModel) {
    throw new Error(
      `template component not find, current mdoel: ${JSON.stringify(props.componentModel)}`
    );
  }
  const outputDataSource = rootModel.outputDataSource ?? [];
  const selectedData: PathComponent | undefined = _.cloneDeep(eventBinding.pathComponents)?.pop();
  const pageDataName = eventBinding.pathComponents?.map((pc) => pc.name).join('/');

  return (
    <>
      <ZConfigRowTitle text={content.label.target} />
      <Select
        bordered={false}
        placeholder={content.placeholder.target}
        size="large"
        style={styles.select}
        key={pageDataName}
        defaultValue={pageDataName}
        onChange={(value: string) => {
          const variable = outputDataSource.find((ods) => ods.name === value)?.variable;
          if (!variable) return;
          eventBinding.action = SetVariableData.ASSIGN;
          eventBinding.pathComponents = [
            COMPONENT_OUTPUT_DATA_PATH,
            {
              name: rootModel.mRef,
              type: '',
            },
            {
              name: value,
              type: variable.type,
              itemType: variable.itemType,
            },
          ];
          eventBinding.data = DataBinding.withSingleValue(variable.type, variable.itemType);
          props.onEventChange();
        }}
      >
        {outputDataSource.map((element) => {
          return (
            <Select.Option key={element.name} value={element.name}>
              {element.name}
            </Select.Option>
          );
        })}
      </Select>
      {selectedData && (
        <>
          <ZConfigRowTitle text={content.label.action} />
          <Select
            key={eventBinding.action}
            bordered={false}
            disabled={selectedData?.type !== ARRAY_TYPE}
            defaultValue={eventBinding.action}
            placeholder={content.placeholder.action}
            size="large"
            style={styles.select}
            onChange={(value) => {
              eventBinding.action = value;
              switch (value) {
                case SetVariableData.ASSIGN: {
                  eventBinding.data = DataBinding.withSingleValue(
                    selectedData.type,
                    selectedData.itemType
                  );
                  break;
                }
                case SetVariableData.APPEND:
                case SetVariableData.REMOVE: {
                  if (selectedData.itemType) {
                    eventBinding.data = DataBinding.withSingleValue(selectedData.itemType);
                  }
                  break;
                }
                default:
                  throw new Error(
                    `unsupported componentOutputHandleBinding action, ${eventBinding}`
                  );
              }
              props.onEventChange();
            }}
          >
            {Object.values(SetVariableData).map((type: SetVariableData) => (
              <Select.Option key={type} value={type}>
                {content.action[type] ?? type}
              </Select.Option>
            ))}
          </Select>
        </>
      )}
      {eventBinding.data && (
        <DataBindingConfigRow
          title={content.label.value}
          componentModel={props.componentModel}
          dataBinding={eventBinding.data}
          onChange={(value) => {
            eventBinding.data = value;
            props.onEventChange();
          }}
        />
      )}
    </>
  );
});

const styles: Record<string, React.CSSProperties> = {
  select: {
    width: '100%',
    fontSize: '10px',
    background: ZThemedColors.PRIMARY,
    borderRadius: '6px',
    border: '0px',
    textAlign: 'center',
  },
};
