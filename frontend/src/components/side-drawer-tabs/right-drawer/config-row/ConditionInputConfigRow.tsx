import _ from 'lodash';
import { observer } from 'mobx-react';
import React, { CSSProperties, ReactElement } from 'react';
import useDataModelMetadata from '../../../../hooks/useDataModelMetadata';
import { Field } from '../../../../shared/type-definition/DataModelRegistry';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import {
  CollectionOperator,
  GenericOperator,
} from '../../../../shared/type-definition/TableFilterExp';
import Condition, {
  AllConditions,
  ConditionInput,
  toCondition,
} from '../../../../shared/type-definition/conditions/Condition';
import ConditionCategory from '../../../../shared/type-definition/conditions/ConditionCategory';
import { ConstantConditionType } from '../../../../shared/type-definition/conditions/ConstantCondition';
import ExpressionCondition from '../../../../shared/type-definition/conditions/ExpressionCondition';
import { DataBinding, VariableBinding } from '../../../../shared/type-definition/DataBinding';
import {
  ARRAY_TYPE,
  BaseType,
  ColumnTypes,
  ColumnType,
  MediaType,
} from '../../../../shared/type-definition/DataModel';
import DataBindingHelper from '../../../../utils/DataBindingHelper';
import { ZThemedBorderRadius, ZThemedColors } from '../../../../utils/ZConst';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import DataBindingConfigRow from './DataBindingConfigRow';
import i18n from './ConditionInputConfigRow.i18n.json';
import useLocale from '../../../../hooks/useLocale';
import {
  EnvironmentConditionType,
  OSType,
  WechatPermission,
} from '../../../../shared/type-definition/conditions/EnvironmentCondition';
import { Select } from '../../../../zui';

const REFERENCE = 'reference';

interface Props {
  model: BaseComponentModel;
  condition: Condition;
  onDelete?: () => void;
  onSave: (condition: Condition) => void;
}

export const ConditionInputConfigRow = observer((props: Props): ReactElement | null => {
  const { localizedContent: content } = useLocale(i18n);
  const { dataModelRegistry } = useDataModelMetadata();

  const currentCondition = props.condition;

  const onInitLogicChange = (value: string) => {
    const [category, type] = value.split('|');
    if (type === currentCondition.type) return;

    const condition = toCondition({ category, type } as ConditionInput) as Condition;
    if (!condition) return;

    if (condition.category === ConditionCategory.EXPRESSION) {
      const expressionCondition = condition as ExpressionCondition;
      expressionCondition.target = DataBinding.withSingleValue(
        isCollectionComparison(expressionCondition) ? ARRAY_TYPE : BaseType.TEXT
      );
    }
    props.onSave(condition);
  };

  return (
    <div style={styles.initIfContainer}>
      <Select
        bordered={false}
        value={`${currentCondition.category}|${currentCondition.type}`}
        size="middle"
        style={styles.selectRow}
        onChange={onInitLogicChange}
        disabled={!currentCondition.updateable}
      >
        {AllConditions.filter(
          (c) =>
            c.type !== ConstantConditionType.DEFAULT &&
            c.type !== GenericOperator.IN &&
            c.type !== GenericOperator.NOTIN
        ).map((co: Condition) => (
          <Select.Option key={co.label} value={`${co.category}|${co.type}`}>
            {content.condition[co.type]}
          </Select.Option>
        ))}
      </Select>
      {renderExpressionCondition()}
      {renderEnvironmentCondition()}
    </div>
  );

  function isDecimalComparison(condition: Condition): boolean {
    return (
      condition.type === GenericOperator.GT ||
      condition.type === GenericOperator.LT ||
      condition.type === GenericOperator.GTE ||
      condition.type === GenericOperator.LTE
    );
  }

  function isCollectionComparison(condition: Condition): boolean {
    return (
      condition.type === CollectionOperator.ISEMPTY ||
      condition.type === CollectionOperator.ISNOTEMPTY ||
      condition.type === CollectionOperator.INCLUDES
    );
  }

  function conditionIsUnary(expressionCondition: ExpressionCondition): boolean {
    return (
      expressionCondition.type !== GenericOperator.ISNULL &&
      expressionCondition.type !== GenericOperator.ISNOTNULL &&
      expressionCondition.type !== CollectionOperator.ISEMPTY &&
      expressionCondition.type !== CollectionOperator.ISNOTEMPTY
    );
  }

  function renderExpressionCondition() {
    if (currentCondition.category !== ConditionCategory.EXPRESSION) {
      return null;
    }
    const expressionCondition = currentCondition as ExpressionCondition;
    const options = Object.values(ColumnTypes);
    const referenceOptions: Field[] = DataBindingHelper.fetchReferenceFields(dataModelRegistry);

    let defaultValue = expressionCondition?.target?.type;
    if (
      defaultValue &&
      !options.includes(defaultValue as ColumnType) &&
      defaultValue !== ARRAY_TYPE
    ) {
      defaultValue = `${REFERENCE}/${defaultValue}`;
    }

    return (
      <div key={`${expressionCondition.type}+${expressionCondition?.target?.type}`}>
        <ZConfigRowTitle text={content.label.targetType} />
        <Select
          value={defaultValue}
          style={styles.linkedDataCascader}
          onSelect={(_value, opt) => {
            expressionCondition.target = DataBinding.withSingleValue(opt.key as string);
            expressionCondition.value = undefined;
            const newCondition = _.cloneDeep(expressionCondition);
            props.onSave(newCondition);
          }}
        >
          {isCollectionComparison(expressionCondition) ? (
            <>
              <Select.Option key={ARRAY_TYPE} value={ARRAY_TYPE}>
                {content.label.list}
              </Select.Option>
              <Select.Option key={MediaType.IMAGE_LIST} value={MediaType.IMAGE_LIST}>
                {content.label.imageList}
              </Select.Option>
            </>
          ) : (
            <>
              {options.map((element) => {
                return (
                  <Select.Option key={element} value={element}>
                    {content.type[element]}
                  </Select.Option>
                );
              })}
              {isDecimalComparison(expressionCondition) ? null : (
                <Select.OptGroup label={content.label.reference}>
                  {referenceOptions.map((element: Field) => {
                    const value = `${REFERENCE}/${element.type}`;
                    return (
                      <Select.Option key={element.type} value={value}>
                        {element.name}
                      </Select.Option>
                    );
                  })}
                </Select.OptGroup>
              )}
              {[GenericOperator.EQ, GenericOperator.NEQ].includes(
                expressionCondition.type as GenericOperator
              ) ? (
                <Select.OptGroup label={content.label.list}>
                  <Select.Option key={ARRAY_TYPE} value={ARRAY_TYPE}>
                    {content.label.list}
                  </Select.Option>
                </Select.OptGroup>
              ) : (
                <></>
              )}
            </>
          )}
        </Select>
        <DataBindingConfigRow
          title={content.label.target}
          componentModel={props.model}
          dataBinding={expressionCondition.target ?? DataBinding.withSingleValue(BaseType.TEXT)}
          onChange={(dataBinding) => {
            expressionCondition.target = dataBinding;
            if (dataBinding.isEmpty) {
              expressionCondition.value = undefined;
            } else if (conditionIsUnary(expressionCondition)) {
              if (expressionCondition.type === CollectionOperator.INCLUDES) {
                const variableBinding = dataBinding.valueBinding as VariableBinding;
                const { itemType } =
                  variableBinding.pathComponents[variableBinding.pathComponents.length - 1];
                if (itemType) {
                  expressionCondition.value = DataBinding.withSingleValue(itemType);
                } else {
                  throw new Error(
                    'collection includes operator error, dataBinding itemType is null'
                  );
                }
              } else {
                expressionCondition.value = DataBinding.withSingleValue(dataBinding.type);
              }
            }
            const newCondition = _.cloneDeep(expressionCondition);
            props.onSave(newCondition);
          }}
        />
        {conditionIsUnary(expressionCondition) &&
        expressionCondition.target !== undefined &&
        expressionCondition.value !== undefined ? (
          <DataBindingConfigRow
            title={content.label.value}
            componentModel={props.model}
            dataBinding={expressionCondition.value}
            onChange={(dataBinding) => {
              expressionCondition.value = dataBinding;
              const newCondition = _.cloneDeep(expressionCondition);
              props.onSave(newCondition);
            }}
          />
        ) : null}
      </div>
    );
  }

  function renderEnvironmentCondition() {
    if (currentCondition.category !== ConditionCategory.ENVIRONMENT) {
      return null;
    }
    const onChange = (value: OSType | WechatPermission) => {
      props.onSave({ ...currentCondition, value });
    };
    return currentCondition.type === EnvironmentConditionType.OS_TYPE ? (
      <Select
        value={currentCondition.value}
        style={{ ...styles.selectRow, ...styles.gap }}
        bordered={false}
        onChange={onChange}
      >
        {Object.values(OSType).map((value) => (
          <Select.Option key={value} value={value}>
            {content.os[value]}
          </Select.Option>
        ))}
      </Select>
    ) : (
      <Select
        value={currentCondition.value}
        style={{ ...styles.selectRow, ...styles.gap }}
        bordered={false}
        onChange={onChange}
      >
        {Object.values(WechatPermission).map((value) => (
          <Select.Option key={value} value={value}>
            {content['wechat-permission'][value]}
          </Select.Option>
        ))}
      </Select>
    );
  }
});

const styles: Record<string, CSSProperties> = {
  initIfContainer: {
    display: 'flex',
    flexDirection: 'column',
    padding: '16px 16px 16px 16px',
    borderRadius: ZThemedBorderRadius.DEFAULT,
    backgroundColor: ZThemedColors.PRIMARY,
  },
  selectRow: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: '4px 0',
    fontSize: '14px',
    backgroundColor: ZThemedColors.SECONDARY,
    borderRadius: ZThemedBorderRadius.DEFAULT,
    cursor: 'pointer',
  },
  linkedDataCascader: {
    width: '100%',
    fontSize: '12px',
  },
  gap: {
    marginTop: '10px',
  },
};
