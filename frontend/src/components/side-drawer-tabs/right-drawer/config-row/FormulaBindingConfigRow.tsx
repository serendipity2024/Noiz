/* eslint-disable import/no-default-export */
/* eslint-disable no-param-reassign */
/* eslint-disable react/no-array-index-key */
import { observer } from 'mobx-react';
import React, { ReactElement } from 'react';
import useDataModelMetadata from '../../../../hooks/useDataModelMetadata';
import useLocale from '../../../../hooks/useLocale';
import { Field } from '../../../../shared/type-definition/DataModelRegistry';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import {
  BooleanFormulaOperator,
  DataBinding,
  isNumericType,
  isTimeType,
  FormulaBinding,
  FormulaOperator,
  NumericFormulaOperator,
  TemporalUnit,
  TextFormulaOperator,
  DateTimeFormulaOperator,
  DateTimeFormulaBinding,
  isNumericFormulaBinaryOperator,
  isNumericFormulaOperator,
  JsonFormulaOperator,
  JsonFormulaBinding,
  isBasicType,
  CollectionFormulaOperator,
} from '../../../../shared/type-definition/DataBinding';
import {
  ARRAY_TYPE,
  BaseType,
  BaseTypes,
  ColumnTypes,
  DecimalType,
  IntegerType,
  JsonType,
  JsonTypes,
  NumericTypes,
} from '../../../../shared/type-definition/DataModel';
import DataBindingHelper from '../../../../utils/DataBindingHelper';
import ConfigInput from '../shared/ConfigInput';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import DataBindingConfigRow from './DataBindingConfigRow';
import i18n from './FormulaBindingConfigRow.i18n.json';
import { Select } from '../../../../zui';

const REFERENCE = 'reference';

interface Props {
  formulaBinding: FormulaBinding;
  componentModel: BaseComponentModel;
  onFormulaBindingChange: (formulaBinding: FormulaBinding) => void;
}

export default observer(function FormulaBindingConfigRow(props: Props): ReactElement {
  const { localizedContent: content } = useLocale(i18n);
  const { dataModelRegistry } = useDataModelMetadata();

  const { formulaBinding, onFormulaBindingChange } = props;
  const options: string[] = ColumnTypes.map((element) => element as string);
  const referenceOptions: Field[] = DataBindingHelper.fetchReferenceFields(dataModelRegistry);

  let operatorList: FormulaOperator[] = Object.values(JsonFormulaOperator);
  if (isNumericType(formulaBinding.resultType)) {
    operatorList = [
      ...operatorList,
      ...Object.values(NumericFormulaOperator),
      ...Object.values(CollectionFormulaOperator),
    ];
  } else if (isTimeType(formulaBinding.resultType)) {
    operatorList = [...operatorList, ...Object.values(DateTimeFormulaOperator)];
  } else if (formulaBinding.resultType === BaseType.TEXT) {
    operatorList = [
      ...operatorList,
      ...Object.values(TextFormulaOperator),
      ...Object.values(NumericFormulaOperator),
      ...Object.values(CollectionFormulaOperator),
    ];
  } else if (formulaBinding.resultType === BaseType.BOOLEAN) {
    operatorList = [...operatorList, ...Object.values(BooleanFormulaOperator)];
  }

  if (operatorList.length <= 0) {
    return <div>{content.label.noFormula}</div>;
  }

  const onOperatorChange = (op: FormulaOperator) => {
    if (
      Object.values(DateTimeFormulaOperator).includes(op as DateTimeFormulaOperator) &&
      isTimeType(formulaBinding.resultType)
    ) {
      onFormulaBindingChange({
        ...formulaBinding,
        op,
        valueRecord: { instant: DataBinding.withSingleValue(formulaBinding.resultType) },
        durations: Object.values(TemporalUnit).map((item) => ({
          temporalUnit: item,
        })),
      } as DateTimeFormulaBinding);
    } else if (Object.values(CollectionFormulaOperator).includes(op as CollectionFormulaOperator)) {
      let valueRecord: Record<string, DataBinding> = {};
      switch (op) {
        case CollectionFormulaOperator.STRING_LENGTH: {
          valueRecord = { value: DataBinding.withSingleValue(BaseType.TEXT) };
          break;
        }
        case CollectionFormulaOperator.ARRAY_LENGTH: {
          valueRecord = { value: DataBinding.withSingleValue(ARRAY_TYPE) };
          break;
        }
        default: {
          throw new Error(`unsupported collection formula operator, ${op}`);
        }
      }
      onFormulaBindingChange({
        ...formulaBinding,
        op,
        valueRecord,
      });
    } else if (isNumericFormulaOperator(op)) {
      onFormulaBindingChange({
        ...formulaBinding,
        op,
        valueRecord: isNumericFormulaBinaryOperator(op)
          ? {
              value1: DataBinding.withSingleValue(DecimalType.FLOAT8),
              value2: DataBinding.withSingleValue(DecimalType.FLOAT8),
            }
          : {
              value: DataBinding.withSingleValue(DecimalType.FLOAT8),
            },
      });
    } else if (Object.values(TextFormulaOperator).includes(op as TextFormulaOperator)) {
      let valueRecord: Record<string, DataBinding> = {};
      switch (op) {
        case TextFormulaOperator.SUBSTRING: {
          valueRecord = {
            value: DataBinding.withSingleValue(BaseType.TEXT),
            substringStart: DataBinding.withSingleValue(IntegerType.INTEGER),
            substringEnd: DataBinding.withSingleValue(IntegerType.INTEGER),
          };
          break;
        }
        case TextFormulaOperator.ARRAY_JOIN: {
          valueRecord = {
            array: DataBinding.withSingleValue(ARRAY_TYPE),
            joinDelimiter: DataBinding.withSingleValue(BaseType.TEXT),
          };
          break;
        }
        default: {
          valueRecord = {
            value: DataBinding.withSingleValue(BaseType.TEXT),
          };
          break;
        }
      }
      onFormulaBindingChange({
        ...formulaBinding,
        op,
        valueRecord,
      });
    } else if (Object.values(BooleanFormulaOperator).includes(op as BooleanFormulaOperator)) {
      onFormulaBindingChange({
        ...formulaBinding,
        op,
      });
    } else if (Object.values(JsonFormulaOperator).includes(op as JsonFormulaOperator)) {
      onFormulaBindingChange({
        ...formulaBinding,
        op,
        json: DataBinding.withSingleValue(JsonType.JSONB),
      } as JsonFormulaBinding);
    }
  };

  const renderDurationComponent = () => {
    const dateTimeFormulaBinding = formulaBinding as DateTimeFormulaBinding;
    return (
      <div key={dateTimeFormulaBinding.op} style={styles.temporalUnitContainer}>
        <ZConfigRowTitle text={content.label.durations} />
        {dateTimeFormulaBinding.durations?.map((duration) => {
          return (
            <DataBindingConfigRow
              key={duration.temporalUnit}
              title={duration.temporalUnit}
              componentModel={props.componentModel}
              dataBinding={duration.amount ?? DataBinding.withSingleValue(IntegerType.INTEGER)}
              onChange={(value) => {
                duration.amount = value;
                onFormulaBindingChange({
                  ...formulaBinding,
                  durations: dateTimeFormulaBinding.durations?.map((d) =>
                    d.temporalUnit === duration.temporalUnit ? duration : d
                  ),
                } as DateTimeFormulaBinding);
              }}
            />
          );
        })}
      </div>
    );
  };

  const renderTargetTypeSelectorComponent = () => {
    const valueList: DataBinding[] = Object.values(formulaBinding.valueRecord);
    const targetType = valueList.length > 0 ? valueList[0].type : undefined;
    return (
      <div key={formulaBinding.op}>
        <ZConfigRowTitle text={content.label.targetType} />
        <Select
          value={targetType}
          placeholder={content.placeholder.targetType}
          style={styles.typeSelect}
          onSelect={(value, opt) => {
            onFormulaBindingChange({
              ...formulaBinding,
              valueRecord: {
                value1: DataBinding.withSingleValue(opt.children),
                value2: DataBinding.withSingleValue(opt.children),
              },
            });
          }}
        >
          {options.map((element) => (
            <Select.Option key={element} value={element} style={styles.option}>
              {element}
            </Select.Option>
          ))}
          <Select.OptGroup label={content.label.reference}>
            {referenceOptions.map((element: Field) => {
              const value = `${REFERENCE}/${element.type}`;
              return (
                <Select.Option key={value} value={value} style={styles.option}>
                  {element.name}
                </Select.Option>
              );
            })}
          </Select.OptGroup>
        </Select>
      </div>
    );
  };

  const renderJsonComponent = () => {
    const jsonFormulaBinding = formulaBinding as JsonFormulaBinding;
    return (
      <>
        <DataBindingConfigRow
          title="json"
          componentModel={props.componentModel}
          dataBinding={jsonFormulaBinding.json}
          onChange={(dataBinding) => {
            onFormulaBindingChange({
              ...formulaBinding,
              json: dataBinding,
            } as JsonFormulaBinding);
          }}
        />
        <ZConfigRowTitle text="keyPath" />
        <ConfigInput
          value={jsonFormulaBinding.keyPath ?? ''}
          style={styles.operatorSelect}
          placeholder="please input..."
          onSaveValue={(value) => {
            onFormulaBindingChange({
              ...formulaBinding,
              keyPath: value,
            } as JsonFormulaBinding);
          }}
        />
        <ZConfigRowTitle text="valueType" />
        <Select
          placeholder="please select..."
          value={jsonFormulaBinding.valueType}
          style={styles.operatorSelect}
          onChange={(type) => {
            onFormulaBindingChange({
              ...formulaBinding,
              valueType: type,
              arrayElementObjectMapping: undefined,
            } as JsonFormulaBinding);
          }}
        >
          {[...BaseTypes, ...NumericTypes, ...JsonTypes, ARRAY_TYPE]
            .filter((type) => {
              // TODO 期待服务器的类型系统出来 替换这段恶心的filter
              if (formulaBinding.resultType === ARRAY_TYPE) {
                return type === ARRAY_TYPE;
              }
              if (formulaBinding.resultType === JsonType.JSONB) {
                return type === JsonType.JSONB;
              }
              if (
                BaseTypes.includes(type as BaseType) &&
                BaseTypes.includes(formulaBinding.resultType as BaseType)
              ) {
                return true;
              }
              if (isNumericType(type) && isBasicType(formulaBinding.resultType)) {
                return true;
              }
              return false;
            })
            .map((type) => (
              <Select.Option key={type} value={type}>
                <div style={styles.option}>{type}</div>
              </Select.Option>
            ))}
        </Select>
        {jsonFormulaBinding.valueType === ARRAY_TYPE && (
          <>
            <ZConfigRowTitle text="arrayElementObjectMapping" />
            <Select
              placeholder="please select..."
              mode="tags"
              style={styles.operatorSelect}
              value={jsonFormulaBinding.arrayElementObjectMapping}
              onChange={(newValue: string[]) => {
                onFormulaBindingChange({
                  ...formulaBinding,
                  arrayElementObjectMapping: newValue,
                } as JsonFormulaBinding);
              }}
            />
          </>
        )}
      </>
    );
  };

  return (
    <>
      <ZConfigRowTitle text={content.label.operator} />
      <Select
        placeholder={content.placeholder.operator}
        defaultValue={formulaBinding.op}
        style={styles.operatorSelect}
        onChange={onOperatorChange}
      >
        {operatorList.map((op) => (
          <Select.Option key={op} value={op}>
            <div style={styles.option}>{content.operator[op]}</div>
          </Select.Option>
        ))}
      </Select>

      {Object.values(JsonFormulaOperator).includes(formulaBinding.op as JsonFormulaOperator) ? (
        renderJsonComponent()
      ) : (
        <>
          {formulaBinding.op && formulaBinding.resultType === BaseType.BOOLEAN
            ? renderTargetTypeSelectorComponent()
            : null}
          {Object.entries(formulaBinding.valueRecord).map(([key, value], index) => (
            <DataBindingConfigRow
              key={index}
              title={(content.parameter as Record<string, any>)[key] ?? key}
              componentModel={props.componentModel}
              dataBinding={value}
              onChange={(dataBinding) => {
                const { valueRecord } = formulaBinding;
                valueRecord[key] = dataBinding;
                onFormulaBindingChange({ ...formulaBinding, valueRecord });
              }}
            />
          ))}
          {formulaBinding.op && isTimeType(formulaBinding.resultType)
            ? renderDurationComponent()
            : null}
        </>
      )}
    </>
  );
});

const styles: Record<string, React.CSSProperties> = {
  operatorSelect: {
    width: '100%',
    marginBottom: '10px',
    color: 'white',
  },
  option: {
    fontSize: '14px',
  },
  timestampRow: {
    marginBottom: '10px',
  },
  select: {
    marginLeft: '10px',
  },
  temporalUnitContainer: {
    marginTop: '15px',
  },
  typeSelect: {
    width: '100%',
    fontSize: '12px',
  },
};
