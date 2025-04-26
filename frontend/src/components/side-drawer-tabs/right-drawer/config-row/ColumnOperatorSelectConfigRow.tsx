/* eslint-disable import/no-default-export */
import React from 'react';
import { observer } from 'mobx-react';
import { DataBinding, isBasicType } from '../../../../shared/type-definition/DataBinding';
import { ARRAY_TYPE, BaseType } from '../../../../shared/type-definition/DataModel';
import { NullableReactElement } from '../../../../shared/type-definition/ZTypes';
import i18n from './ColumnOperatorSelectConfigRow.i18n.json';
import useLocale from '../../../../hooks/useLocale';
import DataBindingHelper from '../../../../utils/DataBindingHelper';
import {
  ColumnValueExp,
  GenericOperator,
  Operator,
  TextOperator,
} from '../../../../shared/type-definition/TableFilterExp';
import { Select } from '../../../../zui';

export default observer(function ColumnOperatorSelectConfigRow(props: {
  columnExp: ColumnValueExp;
  onColumnExpChange: (columnExp: ColumnValueExp) => void;
}): NullableReactElement {
  const { localizedContent: content } = useLocale(i18n);
  const { columnExp } = props;
  const dataBinding = columnExp.value;

  if (!columnExp.op) return null;
  let operatorList: Operator[] = Object.values(GenericOperator);
  if (!isBasicType(dataBinding.type)) {
    operatorList = operatorList.filter((e) => !DataBindingHelper.isDecimalComparisonOperator(e));
  }
  if (dataBinding.type === BaseType.TEXT) {
    operatorList = [...operatorList, ...Object.values(TextOperator)];
  }

  return (
    <Select
      placeholder={content.placeholder.operator}
      value={columnExp.op}
      style={styles.operatorSelect}
      onChange={(operator: Operator) => {
        const lastOperator = columnExp.op;
        if (!lastOperator) return;

        let newColumnExp = { ...columnExp, op: operator };
        if (
          DataBindingHelper.isInOrNotIn(operator) &&
          !DataBindingHelper.isInOrNotIn(lastOperator)
        ) {
          const newDataBinding = DataBinding.withSingleValue(ARRAY_TYPE);
          newDataBinding.typeParameter = dataBinding.itemType ?? dataBinding.type;
          newColumnExp = { ...newColumnExp, value: newDataBinding };
        } else if (
          !DataBindingHelper.isInOrNotIn(operator) &&
          DataBindingHelper.isInOrNotIn(lastOperator)
        ) {
          if (!dataBinding.typeParameter)
            throw new Error(`dataBinding originType error, ${JSON.stringify(dataBinding)}`);
          const newDataBinding = DataBinding.withSingleValue(dataBinding.typeParameter);
          newDataBinding.typeParameter = undefined;
          newColumnExp = { ...newColumnExp, value: newDataBinding };
        } else if (DataBindingHelper.isNullOrNotNull(lastOperator)) {
          const newDataBinding = DataBinding.withSingleValue(
            dataBinding.typeParameter ?? dataBinding.type
          );
          newColumnExp = { ...newColumnExp, value: newDataBinding };
        }
        props.onColumnExpChange(newColumnExp);
      }}
    >
      {operatorList.map((e) => (
        <Select.Option key={e} value={e}>
          {content.operator[e]}
        </Select.Option>
      ))}
    </Select>
  );
});

const styles: Record<string, React.CSSProperties> = {
  operatorSelect: {
    width: '100%',
    marginBottom: '10px',
  },
};
