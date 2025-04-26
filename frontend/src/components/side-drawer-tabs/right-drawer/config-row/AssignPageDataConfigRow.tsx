/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React from 'react';
import useDataModelRegistryResolvers from '../../../../hooks/useDataModelRegistryResolvers';
import useLocale from '../../../../hooks/useLocale';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import { PAGE_DATA_PATH, PathComponent } from '../../../../shared/type-definition/DataBinding';
import { NullableReactElement } from '../../../../shared/type-definition/ZTypes';
import { ZThemedColors } from '../../../../utils/ZConst';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import i18n from './AssignPageDataConfigRow.i18n.json';
import { Empty, Select } from '../../../../zui';

interface Props {
  title: string;
  model: BaseComponentModel;
  pathComponents?: PathComponent[];
  onPathComponentsChange: (pathComponents: PathComponent[]) => void;
  pageDataFilter: (type: string) => boolean;
}

export default observer(function AssignPageDataConfigRow(props: Props): NullableReactElement {
  const { localizedContent: content } = useLocale(i18n);
  const { title, model, pathComponents, onPathComponentsChange } = props;

  const { resolveAllVariables } = useDataModelRegistryResolvers();
  const { pageVariables } = resolveAllVariables(model.mRef);

  return (
    <>
      <ZConfigRowTitle text={title} />
      <Select
        bordered={false}
        placeholder={content.placeholder}
        size="large"
        style={styles.select}
        value={pathComponents?.map((pc) => pc.name).join('/')}
        onChange={(value: string) => {
          onPathComponentsChange([
            PAGE_DATA_PATH,
            {
              name: value,
              type: pageVariables[value].type,
            },
          ]);
        }}
        notFoundContent={<Empty description={false} />}
      >
        {Object.entries(pageVariables)
          .filter((element) => props.pageDataFilter(element[1].type))
          .map(([name]) => (
            <Select.Option key={name} value={name}>
              {name}
            </Select.Option>
          ))}
      </Select>
    </>
  );
});

const styles: Record<string, React.CSSProperties> = {
  select: {
    width: '100%',
    fontSize: '10px',
    background: ZThemedColors.PRIMARY,
    textAlign: 'center',
    borderRadius: '6px',
  },
};
