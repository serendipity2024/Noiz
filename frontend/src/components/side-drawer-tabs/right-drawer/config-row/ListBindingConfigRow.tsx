/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React from 'react';
import {
  DataBinding,
  DataBindingKind,
  ListBinding,
  ValueBinding,
} from '../../../../shared/type-definition/DataBinding';
import { NullableReactElement } from '../../../../shared/type-definition/ZTypes';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import i18n from './ListBindingConfigRow.i18n.json';
import useLocale from '../../../../hooks/useLocale';
import useDataModelMetadata from '../../../../hooks/useDataModelMetadata';
import useCustomRequestRegistry from '../../../../hooks/useCustomRequestRegistry';
import { GraphQLModel } from '../../../../shared/type-definition/DataModelRegistry';
import DataBindingConfigRow from './DataBindingConfigRow';
import { ARRAY_TYPE, ID } from '../../../../shared/type-definition/DataModel';
import { Collapse } from '../../../../zui';
import cssModule from './ListBindingConfigRow.module.scss';

interface Props {
  componentModel: BaseComponentModel;
  listBinding: ListBinding;
  onListBindingChange: (listBinding: ListBinding) => void;
}

export default observer(function ListBindingConfigRow(props: Props): NullableReactElement {
  const { localizedContent } = useLocale(i18n);
  const { dataModelRegistry } = useDataModelMetadata();
  const { getCustomRequestField } = useCustomRequestRegistry();

  const { componentModel, listBinding, onListBindingChange } = props;
  let object: Record<string, DataBinding> = {};

  const gqlModel: GraphQLModel | undefined = dataModelRegistry.getGraphQLModel(
    listBinding.itemType
  );
  if (gqlModel) {
    gqlModel.fields.forEach((field) => {
      if (field.name !== ID) {
        object[field.name] = DataBinding.withSingleValue(field.type, field.itemType);
      }
    });
  } else {
    const customRequestField = getCustomRequestField(listBinding.itemType);
    (customRequestField?.object ?? []).forEach((field) => {
      if (field.name !== ID) {
        object[field.name] = DataBinding.withSingleValue(field.type, field.itemType);
      }
    });
  }
  object = { ...object, ...listBinding.object };

  return (
    <>
      <DataBindingConfigRow
        title={localizedContent.label.listSourceData}
        componentModel={componentModel}
        dataBinding={listBinding.listSourceData ?? DataBinding.withSingleValue(ARRAY_TYPE)}
        valueSwitchable={false}
        onChange={(value) => {
          listBinding.listSourceData = value;
          Object.entries(object).forEach(([name, dataBinding]) => {
            if (
              dataBinding.valueBinding instanceof Object &&
              (dataBinding.valueBinding as ValueBinding)?.kind ===
                DataBindingKind.ARRAY_ELEMENT_MAPPING
            ) {
              listBinding.object[name] = DataBinding.withSingleValue(
                dataBinding.type,
                dataBinding.itemType
              );
            }
          });
          onListBindingChange(listBinding);
        }}
      />
      <Collapse
        bordered
        setContentFontColorToOrangeBecauseHistoryIsCruel
        className={cssModule.collapse}
        items={[
          {
            title: localizedContent.label.parameters,
            content: (
              <>
                {Object.entries(object).map(([name, dataBinding]) => (
                  <DataBindingConfigRow
                    key={name}
                    title={name}
                    componentModel={componentModel}
                    dataBinding={dataBinding}
                    arrayMappingSource={listBinding.listSourceData}
                    onChange={(value) => {
                      listBinding.object[name] = value;
                      onListBindingChange(listBinding);
                    }}
                  />
                ))}
              </>
            ),
          },
        ]}
      />
    </>
  );
});
