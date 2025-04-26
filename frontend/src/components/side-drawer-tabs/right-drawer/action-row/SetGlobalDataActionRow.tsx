/* eslint-disable import/no-default-export */
import _ from 'lodash';
import { observer } from 'mobx-react';
import React, { ReactElement } from 'react';
import { useConfiguration } from '../../../../hooks/useConfiguration';
import useLocale from '../../../../hooks/useLocale';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import { DataBinding, PathComponent } from '../../../../shared/type-definition/DataBinding';
import { ARRAY_TYPE } from '../../../../shared/type-definition/DataModel';
import {
  SetVariableData,
  SetGlobalDataHandleBinding,
} from '../../../../shared/type-definition/EventBinding';
import { ZThemedColors } from '../../../../utils/ZConst';
import DataBindingConfigRow from '../config-row/DataBindingConfigRow';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import i18n from './SetPageDataActionRow.i18n.json';
import { Select } from '../../../../zui';

interface Props {
  componentModel: BaseComponentModel;
  event: SetGlobalDataHandleBinding;
  onEventChange: () => void;
}

export default observer(function SetGlobalDataActionRow(props: Props): ReactElement {
  const { localizedContent: content } = useLocale(i18n);

  const setGlobalDataHandleBinding = props.event;
  const { globalVariableTable } = useConfiguration();
  const selectedData: PathComponent | undefined = _.cloneDeep(
    setGlobalDataHandleBinding.pathComponents
  )?.pop();
  const pageDataName = setGlobalDataHandleBinding.pathComponents?.map((pc) => pc.name).join('/');

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
          const variable = globalVariableTable[value];
          setGlobalDataHandleBinding.action = SetVariableData.ASSIGN;
          setGlobalDataHandleBinding.pathComponents = [
            {
              name: value,
              type: variable.type,
              itemType: variable.itemType,
            },
          ];
          setGlobalDataHandleBinding.data = DataBinding.withSingleValue(
            variable.type,
            variable.itemType
          );
          props.onEventChange();
        }}
      >
        {Object.entries(globalVariableTable).map((element) => {
          const name = element[0];
          return (
            <Select.Option key={name} value={name}>
              {name}
            </Select.Option>
          );
        })}
      </Select>
      {selectedData && (
        <>
          <ZConfigRowTitle text={content.label.action} />
          <Select
            key={setGlobalDataHandleBinding.action}
            bordered={false}
            disabled={selectedData?.type !== ARRAY_TYPE}
            defaultValue={setGlobalDataHandleBinding.action}
            placeholder={content.placeholder.action}
            size="large"
            style={styles.select}
            onChange={(value) => {
              setGlobalDataHandleBinding.action = value;
              switch (value) {
                case SetVariableData.ASSIGN: {
                  setGlobalDataHandleBinding.data = DataBinding.withSingleValue(
                    selectedData.type,
                    selectedData.itemType
                  );
                  break;
                }
                case SetVariableData.APPEND:
                case SetVariableData.REMOVE: {
                  if (selectedData.itemType) {
                    setGlobalDataHandleBinding.data = DataBinding.withSingleValue(
                      selectedData.itemType
                    );
                  }
                  break;
                }
                default:
                  throw new Error(
                    `unsupported globalDataHandleBinding action, ${setGlobalDataHandleBinding}`
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
      {setGlobalDataHandleBinding.data && (
        <DataBindingConfigRow
          title={content.label.value}
          componentModel={props.componentModel}
          dataBinding={setGlobalDataHandleBinding.data}
          onChange={(value) => {
            setGlobalDataHandleBinding.data = value;
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
