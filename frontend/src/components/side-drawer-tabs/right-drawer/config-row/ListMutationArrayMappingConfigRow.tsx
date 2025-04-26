/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React, { ReactElement } from 'react';
import {
  ArrayElementMappingBinding,
  DataBinding,
  DataBindingKind,
  PathComponent,
  ValueBinding,
} from '../../../../shared/type-definition/DataBinding';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import i18n from './ListMutationArrayMappingConfigRow.i18n.json';
import useLocale from '../../../../hooks/useLocale';
import useDataModelMetadata from '../../../../hooks/useDataModelMetadata';
import DataBindingHelper from '../../../../utils/DataBindingHelper';
import { useShowValueBinding } from '../../../../hooks/useShowDataBinding';
import { Select } from '../../../../zui';

interface Props {
  componentModel: BaseComponentModel;
  dataBinding: DataBinding;
  listSourceData?: DataBinding;
  onValuesChange: (values: ValueBinding[]) => void;
}

export default observer(function ListMutationArrayMappingConfigRow(props: Props): ReactElement {
  const { localizedContent: content } = useLocale(i18n);
  const { dataBinding, listSourceData } = props;
  const { valueBinding } = dataBinding;
  const { dataModelRegistry } = useDataModelMetadata();
  const showValueBinding = useShowValueBinding();

  const arrayElementFieldMapping =
    (valueBinding as ArrayElementMappingBinding).arrayElementFieldMapping ?? undefined;

  const sourceDataValueBinding = listSourceData?.valueBinding;
  const pathComponents =
    (sourceDataValueBinding as ArrayElementMappingBinding)?.pathComponents ?? [];
  const lastPathComponent: PathComponent = pathComponents[pathComponents.length - 1];
  const requestModel = dataModelRegistry.getGraphQLModel(lastPathComponent?.itemType ?? 'TEXT');

  const options = requestModel?.fields
    .filter((field) => DataBindingHelper.isSameDataType(field.type, dataBinding.type))
    .map((metadata) => ({
      label: metadata.name,
      value: metadata.name,
      type: metadata.type,
    }));

  const initValue = `${showValueBinding(valueBinding as ValueBinding)}/item`;
  return (
    <Select
      placeholder={content.placeholder.select}
      options={options}
      value={requestModel ? arrayElementFieldMapping?.name : initValue}
      style={styles.arraySelect}
      onChange={(value, option: any) => {
        props.onValuesChange([
          {
            kind: DataBindingKind.ARRAY_ELEMENT_MAPPING,
            pathComponents,
            arrayElementFieldMapping: {
              name: option.value,
              type: option.type,
            },
          },
        ]);
      }}
    />
  );
});

const styles: Record<string, React.CSSProperties> = {
  arraySelect: {
    width: '100%',
  },
};
