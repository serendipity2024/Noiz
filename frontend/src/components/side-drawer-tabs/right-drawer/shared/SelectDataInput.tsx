/* eslint-disable import/no-default-export */
/* eslint-disable no-shadow */
import React, { ReactElement } from 'react';
import uniqid from 'uniqid';
import _ from 'lodash';
import {
  DataBindingKind,
  ValueBinding,
  DataBinding,
  isBasicType,
  isTimeType,
  LiteralBinding,
} from '../../../../shared/type-definition/DataBinding';
import ValueBindingConfigRow from '../config-row/ValueBindingConfigRow';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import { BaseType } from '../../../../shared/type-definition/DataModel';
import ReorderedListConfigRow from '../config-row/ReorderedListConfigRow';
import i18n from './SelectDataInput.i18n.json';
import useLocale from '../../../../hooks/useLocale';
import { useShowValueBinding } from '../../../../hooks/useShowDataBinding';
import { Input } from '../../../../zui';

interface Props {
  componentModel: BaseComponentModel;
  dataBinding: DataBinding;
  values: ValueBinding[];
  editComponent?: ReactElement;
  onValuesChange: (values: ValueBinding[]) => void;
}

interface SelectData {
  key: string;
  label: string;
  valueBinding: ValueBinding;
}

export default function SelectDataInput(props: Props): ReactElement {
  const { localizedContent: content } = useLocale(i18n);
  const showValueBinding = useShowValueBinding();
  const { componentModel, dataBinding, editComponent } = props;
  const values = _.cloneDeep(props.values);

  const selectDefaultValue: SelectData[] = values.map((item) => ({
    key: uniqid.process(),
    label: showValueBinding(item),
    valueBinding: item,
  }));
  const isObject = !isBasicType(dataBinding.type) || isTimeType(dataBinding.type);

  return (
    <div style={styles.containerWrapper}>
      <ReorderedListConfigRow
        axis="xy"
        containerStyle={styles.container}
        dataSource={selectDefaultValue}
        onChange={(dataSource) => {
          props.onValuesChange(dataSource.map((selectData) => selectData.valueBinding));
        }}
        renderItem={(item: any, index: number) => (
          <div style={styles.tag}>
            <ValueBindingConfigRow
              title={item.label}
              componentModel={componentModel}
              valueBinding={item.valueBinding}
              onValueChange={(data: ValueBinding) => {
                const newValues = values.map((e, eIndex) => (index === eIndex ? data : e));
                props.onValuesChange(newValues);
              }}
              onValueDelete={(data: ValueBinding) => {
                const newValues = values.filter((_, eIndex) => index !== eIndex);
                props.onValuesChange(newValues);
              }}
            />
          </div>
        )}
      />
      <Input.TextArea
        key={JSON.stringify(dataBinding.valueBinding)}
        style={{
          ...styles.input,
          marginTop: selectDefaultValue.length === 0 ? '0px' : '3px',
        }}
        autoSize
        disabled={isObject}
        placeholder={isObject ? content.placeholder.select : content.placeholder.input}
        onPressEnter={(e) => {
          e.preventDefault();
          if (e.shiftKey) return;
          let newValues = [];
          const { value } = e.target as any;
          const newValueBinding = {
            kind: DataBindingKind.LITERAL,
            value,
          } as LiteralBinding;
          if (dataBinding.type === BaseType.TEXT) {
            newValues = values.concat([newValueBinding]);
          } else {
            newValues = [newValueBinding];
          }
          props.onValuesChange(newValues);
        }}
      />
      <div style={styles.edit}>{editComponent}</div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  containerWrapper: {
    overflow: 'hidden',
  },
  container: {
    flexWrap: 'wrap',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    overflowX: 'scroll',
    overflowY: 'hidden',
  },
  input: {
    minWidth: '60px',
  },
  tag: {
    marginTop: '1.5px',
    marginBottom: '1.5px',
    marginLeft: '1.5px',
  },
  edit: {
    marginTop: '4px',
  },
};
