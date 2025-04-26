import _ from 'lodash';
import { observer } from 'mobx-react';
import React, { ReactElement } from 'react';
import useDataModelRegistryResolvers from '../../../../hooks/useDataModelRegistryResolvers';
import useLocale from '../../../../hooks/useLocale';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import { DataBinding, PathComponent } from '../../../../shared/type-definition/DataBinding';
import { ARRAY_TYPE } from '../../../../shared/type-definition/DataModel';
import {
  SetVariableData,
  SetPageDataHandleBinding,
} from '../../../../shared/type-definition/EventBinding';
import DataBindingConfigRow from '../config-row/DataBindingConfigRow';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import i18n from './SetPageDataActionRow.i18n.json';
import { Select } from '../../../../zui';
import cssModule from './SetPageDataActionRow.module.scss';

interface Props {
  componentModel: BaseComponentModel;
  event: SetPageDataHandleBinding;
  onEventChange: () => void;
}

export const SetPageDataActionRow = observer((props: Props): ReactElement => {
  const { localizedContent: content } = useLocale(i18n);
  const { resolveAllVariables } = useDataModelRegistryResolvers();

  const pageDataHandleBinding = props.event;
  const { pageVariables } = resolveAllVariables(props.componentModel.mRef);
  const selectedData: PathComponent | undefined = _.cloneDeep(
    pageDataHandleBinding.pathComponents
  )?.pop();
  const pageDataName = pageDataHandleBinding.pathComponents?.map((pc) => pc.name).join('/');
  const pageVariable = Object.entries(pageVariables).find((data) => data[0] === pageDataName)?.[1];

  return (
    <>
      <div className={cssModule.titleContent}>
        <div>{content.label.target}</div>
        {pageVariable?.unique && <div>{content.label.unique}</div>}
      </div>
      <Select
        bordered={false}
        placeholder={content.placeholder.target}
        size="large"
        className={cssModule.select}
        key={pageDataName}
        defaultValue={pageDataName}
        onChange={(value: string) => {
          const variable = pageVariables[value];
          pageDataHandleBinding.action = SetVariableData.ASSIGN;
          pageDataHandleBinding.pathComponents = [
            {
              name: value,
              type: variable.type,
              itemType: variable.itemType,
            },
          ];
          pageDataHandleBinding.data = DataBinding.withSingleValue(
            variable.type,
            variable.itemType
          );
          props.onEventChange();
        }}
      >
        {Object.entries(pageVariables).map((element) => {
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
            key={pageDataHandleBinding.action}
            bordered={false}
            disabled={selectedData?.type !== ARRAY_TYPE}
            defaultValue={pageDataHandleBinding.action}
            placeholder={content.placeholder.action}
            size="large"
            className={cssModule.select}
            onChange={(value) => {
              pageDataHandleBinding.action = value;
              switch (value) {
                case SetVariableData.ASSIGN: {
                  pageDataHandleBinding.data = DataBinding.withSingleValue(
                    selectedData.type,
                    selectedData.itemType
                  );
                  break;
                }
                case SetVariableData.APPEND:
                case SetVariableData.REMOVE: {
                  if (selectedData.itemType) {
                    pageDataHandleBinding.data = DataBinding.withSingleValue(selectedData.itemType);
                  }
                  break;
                }
                default:
                  throw new Error(
                    `unsupported pageDataHandleBinding action, ${pageDataHandleBinding}`
                  );
              }
              props.onEventChange();
            }}
          >
            {Object.values(SetVariableData)
              .filter((type) => {
                if (type === SetVariableData.REMOVE) {
                  return pageVariable?.unique;
                }
                return true;
              })
              .map((type: SetVariableData) => (
                <Select.Option key={type} value={type}>
                  {content.action[type] ?? type}
                </Select.Option>
              ))}
          </Select>
        </>
      )}
      {pageDataHandleBinding.data && (
        <DataBindingConfigRow
          title={content.label.value}
          componentModel={props.componentModel}
          dataBinding={pageDataHandleBinding.data}
          onChange={(value) => {
            pageDataHandleBinding.data = value;
            props.onEventChange();
          }}
        />
      )}
    </>
  );
});
