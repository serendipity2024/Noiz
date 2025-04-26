/* eslint-disable import/no-default-export */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-underscore-dangle */
import _, { isArray, isEqual, last } from 'lodash';
import { observer } from 'mobx-react';
import React, { useState, useEffect } from 'react';
import { useApolloClient } from '@apollo/client';
import { LabeledValue } from 'antd/lib/select';
import useLocale from '../../../../hooks/useLocale';
import useStores from '../../../../hooks/useStores';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import { ColumnFilterExp, TableFilterExp } from '../../../../shared/type-definition/TableFilterExp';
import { AndExp } from '../../../../shared/type-definition/BoolExp';
import {
  AGGREGATE,
  ArrayMapping,
  DataBindingKind,
  FunctionBinding,
  InputBinding,
  isBasicType,
  isTimeType,
  FormulaBinding,
  PAGE_DATA,
  PathComponent,
  PredefinedFunctionName,
  SelectBinding,
  TemporalUnit,
  TimeDirection,
  TimeFormatType,
  TimestampConfiguration,
  ValueBinding,
  VariableBinding,
  isNumericType,
  LiteralBinding,
  ConditionalBinding,
  DataBinding,
} from '../../../../shared/type-definition/DataBinding';
import { ARRAY_TYPE, IntegerType, TimeType } from '../../../../shared/type-definition/DataModel';
import { EventType, GraphQLRequestBinding } from '../../../../shared/type-definition/EventBinding';
import { ZThemedColors } from '../../../../utils/ZConst';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import FormulaBindingConfigRow from './FormulaBindingConfigRow';
import RequestDistinctOnConfigRow from './RequestDistinctOnConfigRow';
import RequestFilterConfigRow from './RequestFilterConfigRow';
import SharedStyles from './SharedStyles';
import i18n from './ValueBindingConfigRow.i18n.json';
import {
  DefaultNumberFormat,
  DefaultNumberFormats,
} from '../../../../shared/type-definition/NumberFormat';
import LiteralConfigRow from './LiteralConfigRow';
import { GQL_GET_IMAGE_LIST_BY_EX_IDS } from '../../../../graphQL/getResourceMedia';
import {
  GetImageListByExIdsVariables,
  GetImageListByExIds,
} from '../../../../graphQL/__generated__/GetImageListByExIds';
import useProjectDetails from '../../../../hooks/useProjectDetails';
import { isNotNull } from '../../../../utils/utils';
import ConditionalBindingConfigRow from './ConditionalBindingConfigRow';
import DataBindingConfigRow from './DataBindingConfigRow';
import { Button, message, Popover, Radio, Row, Select, Switch, Tag, Modal } from '../../../../zui';
import useCustomRequestRegistry from '../../../../hooks/useCustomRequestRegistry';

function getAmountByTemporalUnit(temporalUnit: TemporalUnit) {
  const temporalUnitIndex = Object.values(TemporalUnit).indexOf(temporalUnit);
  return Object.values(TemporalUnit)
    .filter((e, index) => index > temporalUnitIndex)
    .map((item) => ({
      temporalUnit: item,
    }));
}

const DEFAULT_TIMESTAMP_CONFIG = {
  offset: {
    amount: DataBinding.withLiteral(1, IntegerType.INTEGER),
    temporalUnit: TemporalUnit.DAY,
    direction: TimeDirection.BEFORE,
  },
  instant: getAmountByTemporalUnit(TemporalUnit.DAY),
};

export const IMAGE_PREFIX = 'fz_image_';

interface Props {
  title: string;
  componentModel: BaseComponentModel;
  valueBinding: ValueBinding;
  onValueChange: (valueBinding: ValueBinding) => void;
  onValueDelete: (valueBinding: ValueBinding) => void;
}

export default observer(function ValueBindingConfigRow(props: Props): React.ReactElement {
  const { componentModel, valueBinding } = props;
  const { localizedContent: content } = useLocale(i18n);
  const { coreStore } = useStores();
  const { getCustomRequestField } = useCustomRequestRegistry();
  const client = useApolloClient();
  const { projectExId } = useProjectDetails();

  const [where, setWhere] = useState<TableFilterExp | undefined>(
    (valueBinding as VariableBinding).where ?? undefined
  );

  const [distinctOnFieldNames, setDistinctOnFieldNames] = useState<string[] | undefined>(
    (valueBinding as VariableBinding).distinctOnFieldNames ?? undefined
  );

  const [arrayElementFieldMapping, setArrayElementFieldMapping] = useState<
    PathComponent | undefined
  >((valueBinding as VariableBinding).arrayElementFieldMapping ?? undefined);

  const [arrayElementObjectMapping, setArrayElementObjectMapping] = useState<string[] | undefined>(
    (valueBinding as VariableBinding).arrayElementObjectMapping ?? undefined
  );

  const [arrayMappingType, setArrayRadioValue] = useState<string>(
    (valueBinding as VariableBinding).arrayMappingType ?? ArrayMapping.FIELD
  );

  const [shouldDependentsUpdateOnValueChange, setShouldDependentsUpdateOnValueChange] =
    useState<boolean>((valueBinding as InputBinding).shouldDependentsUpdateOnValueChange);

  const [timeFormat, setTimeFormat] = useState<TimeFormatType | undefined>(() => {
    if (
      valueBinding.kind !== DataBindingKind.INPUT &&
      valueBinding.kind !== DataBindingKind.SELECTION &&
      valueBinding.kind !== DataBindingKind.FUNCTION &&
      valueBinding.kind !== DataBindingKind.VARIABLE
    ) {
      return undefined;
    }
    if (valueBinding.dataFormat && !isArray(valueBinding.dataFormat)) {
      return valueBinding.dataFormat;
    }
    return TimeFormatType.NONE;
  });

  const [numberFormat, setNumberFormat] = useState<DefaultNumberFormat | undefined>(() => {
    if (
      valueBinding.kind !== DataBindingKind.INPUT &&
      valueBinding.kind !== DataBindingKind.SELECTION &&
      valueBinding.kind !== DataBindingKind.VARIABLE
    )
      return undefined;
    if (valueBinding.dataFormat && isArray(valueBinding.dataFormat)) {
      if (isEqual(valueBinding.dataFormat, DefaultNumberFormats.countdown))
        return DefaultNumberFormat.COUNTDOWN;
      if (isEqual(valueBinding.dataFormat, DefaultNumberFormats.distance))
        return DefaultNumberFormat.DISTANCE;
      if (isEqual(valueBinding.dataFormat, DefaultNumberFormats['countdown-without-unit']))
        return DefaultNumberFormat.COUNTDOWN_WITHOUT_UNIT;
    }
    return DefaultNumberFormat.NONE;
  });

  const [timestampConfig, setTimestampConfig] = useState<TimestampConfiguration>(
    (valueBinding as FunctionBinding).config ?? DEFAULT_TIMESTAMP_CONFIG
  );

  const [formulaBinding, setFormulaBinding] = useState<FormulaBinding>(
    valueBinding as FormulaBinding
  );

  const [conditionalBinding, setConditionalBinding] = useState<ConditionalBinding>(
    valueBinding as ConditionalBinding
  );

  const [urlIdPair, setUrlIdPair] = useState(new Map<string, string>());
  const [literalConfigModelVisible, setLiteralConfigModelVisible] = useState<boolean>(false);
  const [literalValue, setLiteralValue] = useState<string | undefined>(() => {
    if (valueBinding.kind === DataBindingKind.LITERAL) {
      return valueBinding.value;
    }
    return undefined;
  });
  useEffect(() => {
    const f = async () => {
      if (literalConfigModelVisible && literalValue) {
        let tmpLiteralValue = literalValue;
        const tmpUrlIdPair = urlIdPair;
        const imageExIds = Array.from(
          literalValue.matchAll(new RegExp(`${IMAGE_PREFIX}([a-zA-Z0-9]{11})`, 'g'))
        ).map(([, imageId]) => imageId);
        const { data } = await client.query<GetImageListByExIds, GetImageListByExIdsVariables>({
          query: GQL_GET_IMAGE_LIST_BY_EX_IDS,
          variables: {
            projectExId,
            imageExIds,
          },
        });
        (data.getImageListByExIds ?? []).filter(isNotNull).forEach(({ url }, index) => {
          tmpUrlIdPair.set(url, imageExIds[index]);
          tmpLiteralValue = tmpLiteralValue.replace(`${IMAGE_PREFIX}${imageExIds[index]}`, url);
        });
        setLiteralValue(tmpLiteralValue);
        setUrlIdPair(tmpUrlIdPair);
      }
    };
    f();
    // eslint-disable-next-line
  }, [literalConfigModelVisible]);

  let hasWhere = false;
  let hasUpdate = false;
  let hasTimestamp = false;
  let valueItemType: string | undefined;
  const isFormulaBinding = valueBinding.kind === DataBindingKind.FORMULA;
  const isConditionalBinding = valueBinding.kind === DataBindingKind.CONDITIONAL;
  const isLiteralBinding = valueBinding.kind === DataBindingKind.LITERAL;

  if (
    valueBinding.kind === DataBindingKind.VARIABLE ||
    valueBinding.kind === DataBindingKind.SELECTION
  ) {
    const pathComponents = (valueBinding as VariableBinding | SelectBinding).pathComponents ?? [];
    const lastPathComponent: PathComponent = pathComponents[pathComponents.length - 1];
    hasWhere = !!where && lastPathComponent.type === AGGREGATE;
    valueItemType =
      lastPathComponent.type === ARRAY_TYPE &&
      lastPathComponent.itemType &&
      !isBasicType(lastPathComponent.itemType)
        ? lastPathComponent.itemType
        : undefined;
  }
  if (
    valueBinding.kind === DataBindingKind.VARIABLE &&
    (valueBinding as VariableBinding).pathComponents.length > 0
  ) {
    hasUpdate = (valueBinding as VariableBinding).pathComponents[0].name === PAGE_DATA;
  }
  if (
    valueBinding.kind === DataBindingKind.INPUT ||
    valueBinding.kind === DataBindingKind.SELECTION
  ) {
    hasUpdate = true;
  }
  const pathComponents: PathComponent[] = (valueBinding as any)?.pathComponents ?? [];
  const hasTimeFormat = pathComponents.length > 0 && isTimeType(last(pathComponents)?.type ?? '');
  const hasNumberFormat =
    pathComponents.length > 0 && isNumericType(last(pathComponents)?.type ?? '');

  if (valueBinding.kind === DataBindingKind.FUNCTION) {
    const functionBinding: FunctionBinding = valueBinding as FunctionBinding;
    hasTimestamp = functionBinding.value === PredefinedFunctionName.GET_TIMESTAMP;
  }

  function saveValueDinding() {
    let newValueBinding = _.cloneDeep(props.valueBinding);
    if (hasWhere) {
      newValueBinding = { ...newValueBinding, where, distinctOnFieldNames } as ValueBinding;
    }
    if (valueItemType) {
      if (arrayMappingType === ArrayMapping.FIELD) {
        newValueBinding = {
          ...newValueBinding,
          arrayElementFieldMapping,
          arrayElementObjectMapping: undefined,
        } as ValueBinding;
      } else {
        newValueBinding = {
          ...newValueBinding,
          arrayElementFieldMapping: undefined,
          arrayElementObjectMapping,
        } as ValueBinding;
      }
    }
    if (hasNumberFormat) {
      newValueBinding = {
        ...newValueBinding,
        dataFormat:
          numberFormat && numberFormat !== DefaultNumberFormat.NONE
            ? DefaultNumberFormats[numberFormat]
            : undefined,
      } as ValueBinding;
    }
    if (hasTimeFormat) {
      newValueBinding = { ...newValueBinding, dataFormat: timeFormat } as ValueBinding;
    }
    if (hasUpdate) {
      newValueBinding = {
        ...newValueBinding,
        shouldDependentsUpdateOnValueChange,
      } as InputBinding;
    }
    if (hasTimestamp) {
      newValueBinding = {
        ...newValueBinding,
        config: timestampConfig,
        dataFormat: timeFormat,
      } as FunctionBinding;
    }
    if (isFormulaBinding) {
      newValueBinding = {
        ...newValueBinding,
        ...formulaBinding,
      } as FormulaBinding;
    }
    if (isConditionalBinding) {
      newValueBinding = {
        ...newValueBinding,
        ...conditionalBinding,
      } as ConditionalBinding;
    }
    if (isLiteralBinding) {
      newValueBinding = {
        ...newValueBinding,
        value: literalValue,
      } as LiteralBinding;
    }

    props.onValueChange(newValueBinding);
    message.success('change valueBinding success!');
  }

  return hasWhere ||
    hasUpdate ||
    hasNumberFormat ||
    hasTimeFormat ||
    hasTimestamp ||
    valueItemType ||
    isFormulaBinding ||
    isConditionalBinding ? (
    <Popover
      title={<div style={styles.popoverTitle}>{props.title}</div>}
      trigger="click"
      placement="bottom"
      destroyTooltipOnHide
      overlayInnerStyle={styles.popover}
      content={() => (
        <div style={styles.popoverContent}>
          {renderTagPopoverContent()}
          <Button
            type="link"
            style={{ ...SharedStyles.configRowButton, ...styles.save }}
            onClick={() => saveValueDinding()}
          >
            {content.label.save}
          </Button>
        </div>
      )}
      onVisibleChange={(visible) => {
        if (visible && hasWhere) {
          setWhere(
            _.cloneDeep((props.valueBinding as VariableBinding).where) as AndExp<ColumnFilterExp>
          );
        }
      }}
    >
      {renderTagComponent()}
    </Popover>
  ) : (
    <>
      {renderTagComponent()}
      {isLiteralBinding ? renderLiteralConfigComponent() : null}
    </>
  );

  function renderTagPopoverContent() {
    return (
      <>
        {hasWhere ? renderRequestFilterComponent() : null}
        {valueItemType ? renderArrayMappingComponent() : null}
        {hasUpdate ? renderInputOrSelectionConfigComponent() : null}
        {hasNumberFormat ? renderNumberFormatConfigComponent() : null}
        {hasTimestamp ? renderTimestampConfigComponent() : null}
        {hasTimeFormat || hasTimestamp ? renderTimeFormatConfigComponent() : null}
        {isFormulaBinding ? (
          <FormulaBindingConfigRow
            formulaBinding={formulaBinding}
            componentModel={componentModel}
            onFormulaBindingChange={(data) => setFormulaBinding(data)}
          />
        ) : null}
        {isConditionalBinding ? (
          <ConditionalBindingConfigRow
            conditionalBinding={conditionalBinding}
            componentModel={componentModel}
            onConditionalBindingChange={(data) => setConditionalBinding(data)}
          />
        ) : null}
      </>
    );
  }

  function renderTimestampConfigComponent() {
    return (
      <>
        <Row justify="start" align="middle" style={styles.timestampRow}>
          <Select
            style={styles.select}
            dropdownMatchSelectWidth={false}
            defaultValue={timestampConfig.offset.temporalUnit}
            onChange={(value) => {
              setTimestampConfig({
                ...timestampConfig,
                offset: {
                  ...timestampConfig.offset,
                  temporalUnit: value,
                },
                instant: getAmountByTemporalUnit(value),
              });
            }}
          >
            {Object.values(TemporalUnit).map((unit) => (
              <Select.Option key={unit} value={unit}>
                {content.timestamp.temporalUnit[unit]}
              </Select.Option>
            ))}
          </Select>
          <Select
            style={styles.select}
            dropdownMatchSelectWidth={false}
            defaultValue={timestampConfig.offset.direction}
            onChange={(value) => {
              setTimestampConfig({
                ...timestampConfig,
                offset: {
                  ...timestampConfig.offset,
                  direction: value,
                },
              });
            }}
          >
            {Object.values(TimeDirection).map((direction) => (
              <Select.Option key={direction} value={direction}>
                {content.timestamp.timeDirection[direction] ?? direction}
              </Select.Option>
            ))}
          </Select>
        </Row>
        <DataBindingConfigRow
          title={timestampConfig.offset.temporalUnit}
          componentModel={props.componentModel}
          dataBinding={
            timestampConfig.offset.amount ?? DataBinding.withSingleValue(IntegerType.INTEGER)
          }
          onChange={(value) => {
            setTimestampConfig({
              ...timestampConfig,
              offset: {
                ...timestampConfig.offset,
                amount: value,
              },
            });
          }}
        />
        <div key={timestampConfig.offset.temporalUnit}>
          {(timestampConfig.instant ?? []).map((timestampItem) => (
            <DataBindingConfigRow
              key={timestampItem.temporalUnit}
              title={timestampItem.temporalUnit}
              componentModel={props.componentModel}
              dataBinding={timestampItem.amount ?? DataBinding.withSingleValue(IntegerType.INTEGER)}
              onChange={(value) => {
                const instant = timestampConfig.instant?.map((e) => {
                  if (e.temporalUnit === timestampItem.temporalUnit) {
                    e.amount = value;
                  }
                  return e;
                });
                setTimestampConfig({ ...timestampConfig, instant });
              }}
            />
          ))}
        </div>
      </>
    );
  }

  function renderRequestFilterComponent() {
    let rootFieldType: string | undefined;
    if (valueBinding.kind === DataBindingKind.VARIABLE && where) {
      const variableBinding: VariableBinding = valueBinding as VariableBinding;
      const options = _.cloneDeep(variableBinding.pathComponents ?? []);
      const arrayOption = options.reverse().find((e) => e.type === ARRAY_TYPE);
      rootFieldType = arrayOption?.itemType;
    }
    const whereConditionRequest = {
      type: EventType.QUERY,
      rootFieldType,
      where,
      distinctOnFieldNames,
    } as GraphQLRequestBinding;
    return (
      <>
        <RequestDistinctOnConfigRow
          request={whereConditionRequest}
          onRequestChange={(request) => {
            setDistinctOnFieldNames(request.distinctOnFieldNames);
          }}
        />
        <RequestFilterConfigRow
          componentModel={componentModel}
          request={whereConditionRequest}
          onRequestChange={(request) => {
            setWhere({ _and: (request.where as AndExp<ColumnFilterExp>)._and });
          }}
        />
      </>
    );
  }

  function renderArrayMappingComponent() {
    let fieldOptions: LabeledValue[] = [];
    let objectOptions: LabeledValue[] = [];
    const table = coreStore.dataModel.tableMetadata.find((tb) => tb.name === valueItemType);
    if (table) {
      fieldOptions = table?.columnMetadata
        .filter((metadata) => !metadata.uiHidden)
        .map((metadata) => ({
          label: metadata.name,
          value: metadata.name,
          type: metadata.type,
        }));
      objectOptions = table?.columnMetadata
        .filter((metadata) => !metadata.uiHidden && !metadata.primaryKey && !metadata.systemDefined)
        .map((metadata) => ({
          label: metadata.name,
          value: metadata.name,
        }));
    } else {
      const customRequestField = getCustomRequestField(valueItemType ?? '');
      const options = (customRequestField?.object ?? []).map((element) => ({
        label: element.name,
        value: element.name,
        type: element.type,
      }));
      fieldOptions = options;
      objectOptions = options;
    }
    return (
      <div style={styles.arrayMapping}>
        <Radio.Group
          value={arrayMappingType}
          onChange={(e) => {
            setArrayRadioValue(e.target.value);
          }}
        >
          <Radio value={ArrayMapping.FIELD}>{content.arrayMapping.field}</Radio>
          <Radio value={ArrayMapping.OBJECT}>{content.arrayMapping.object}</Radio>
        </Radio.Group>
        {arrayMappingType === ArrayMapping.FIELD ? (
          <>
            <ZConfigRowTitle text={content.arrayMapping.fieldLabel} />
            <Select
              placeholder={content.arrayMapping.placeholder}
              options={fieldOptions}
              value={arrayElementFieldMapping?.name}
              style={styles.arraySelect}
              onChange={(value, option: any) => {
                setArrayElementFieldMapping({
                  name: option.value,
                  type: option.type,
                });
              }}
            />
          </>
        ) : (
          <>
            <ZConfigRowTitle text={content.arrayMapping.ObjectLabel} />
            <Select
              placeholder={content.arrayMapping.placeholder}
              mode="multiple"
              options={objectOptions}
              style={styles.arraySelect}
              value={arrayElementObjectMapping}
              onChange={(newValue: string[]) => {
                setArrayElementObjectMapping(newValue);
              }}
            />
          </>
        )}
      </div>
    );
  }

  function renderInputOrSelectionConfigComponent() {
    return (
      <Row justify="space-between" align="middle">
        <label>{content.input.refresh}</label>
        <Switch
          defaultChecked={shouldDependentsUpdateOnValueChange}
          onChange={(checked) => setShouldDependentsUpdateOnValueChange(checked)}
        />
      </Row>
    );
  }

  function renderTimeFormatConfigComponent() {
    const valueType: string = hasTimestamp
      ? TimeType.TIMESTAMPTZ
      : pathComponents[pathComponents.length - 1].type;
    return (
      <>
        <ZConfigRowTitle text={content.format.label} />
        <Radio.Group value={timeFormat} onChange={(e) => setTimeFormat(e.target.value)}>
          {Object.values(TimeFormatType)
            .filter((e) => {
              if (e === TimeFormatType.NONE) {
                return true;
              }
              if (valueType === TimeType.TIMETZ) {
                return e === TimeFormatType.TIME;
              }
              if (valueType === TimeType.DATE) {
                return e !== TimeFormatType.TIME;
              }
              return true;
            })
            .map((type) => {
              let dataFormatTitle;
              let dataFormatSubTitle;
              switch (type) {
                case TimeFormatType.NONE: {
                  dataFormatTitle = content.format.none;
                  dataFormatSubTitle = '2021-03-02T20:02:54.246046+08:00';
                  break;
                }
                case TimeFormatType.ELAPSED_TIME: {
                  dataFormatTitle = content.format.elpased;
                  dataFormatSubTitle = '10 days ago';
                  break;
                }
                case TimeFormatType.DATE: {
                  dataFormatTitle = content.format.date;
                  dataFormatSubTitle = '2020/08/15';
                  break;
                }
                case TimeFormatType.MONTH_DAY: {
                  dataFormatTitle = content.format.monthDay;
                  dataFormatSubTitle = '08/15';
                  break;
                }
                case TimeFormatType.DATE_TIME: {
                  dataFormatTitle = content.format.dateTime;
                  dataFormatSubTitle = '2020/08/15 14:00';
                  break;
                }
                case TimeFormatType.DAY_OF_WEEK: {
                  dataFormatTitle = content.format.dayOfWeek;
                  dataFormatSubTitle = 'Sunday';
                  break;
                }
                case TimeFormatType.TIME: {
                  dataFormatTitle = content.format.time;
                  dataFormatSubTitle = '14:00';
                  break;
                }
                default:
                  throw new Error(`unsupported timeFormatType of ${valueBinding}`);
              }
              return (
                <Radio style={styles.radioStyle} key={type} value={type}>
                  <div style={styles.radioContainer}>
                    <Row justify="space-between" align="middle" style={styles.dataFormatRow}>
                      <div style={styles.dataFormatTitle}>{dataFormatTitle}</div>
                      <div style={styles.dataFormatSubTitle}>{dataFormatSubTitle}</div>
                    </Row>
                  </div>
                </Radio>
              );
            })}
        </Radio.Group>
      </>
    );
  }

  function renderNumberFormatConfigComponent() {
    return (
      <>
        <ZConfigRowTitle text={content.format.label} />
        <Radio.Group value={numberFormat} onChange={(e) => setNumberFormat(e.target.value)}>
          {Object.values(DefaultNumberFormat)
            .map((type) => {
              switch (type) {
                case DefaultNumberFormat.COUNTDOWN:
                  return {
                    type,
                    dataFormatTitle: content.format.countdown,
                    dataFormatSubTitle: '09分02秒',
                  };
                case DefaultNumberFormat.COUNTDOWN_WITHOUT_UNIT:
                  return {
                    type,
                    dataFormatTitle: content.format.countdown,
                    dataFormatSubTitle: '00:00:00',
                  };
                case DefaultNumberFormat.DISTANCE:
                  return {
                    type,
                    dataFormatTitle: content.format.distance,
                    dataFormatSubTitle: '10.1公里',
                  };

                default:
                  return {
                    type,
                    dataFormatTitle: content.format.none,
                    dataFormatSubTitle: '100.00',
                  };
              }
            })
            .map(({ type, dataFormatTitle, dataFormatSubTitle }) => (
              <Radio style={styles.radioStyle} key={type} value={type}>
                <div style={styles.radioContainer}>
                  <Row justify="space-between" align="middle" style={styles.dataFormatRow}>
                    <div style={styles.dataFormatTitle}>{dataFormatTitle}</div>
                    <div style={styles.dataFormatSubTitle}>{dataFormatSubTitle}</div>
                  </Row>
                </div>
              </Radio>
            ))}
        </Radio.Group>
      </>
    );
  }

  function renderLiteralConfigComponent() {
    if (valueBinding.kind === DataBindingKind.LITERAL && literalConfigModelVisible)
      return (
        <Modal
          visible
          onCancel={() => {
            setLiteralConfigModelVisible(false);
          }}
          onOk={() => {
            setLiteralConfigModelVisible(false);
            let tmpLiteralValue = literalValue ?? '';
            urlIdPair.forEach((value, key) => {
              tmpLiteralValue = tmpLiteralValue.replace(key, `${IMAGE_PREFIX}${value}`);
            });
            props.onValueChange({
              ...valueBinding,
              value: tmpLiteralValue,
            });
          }}
        >
          <LiteralConfigRow
            value={literalValue}
            onChange={setLiteralValue}
            addRecord={(record: [string, string]) => {
              urlIdPair.set(record[0], record[1]);
              setUrlIdPair(urlIdPair);
            }}
          />
        </Modal>
      );
    return <></>;
  }

  function renderTagComponent() {
    return (
      <Tag
        color="default"
        closable
        onClick={(event) => {
          if (isLiteralBinding) {
            event.stopPropagation();
            setLiteralConfigModelVisible(true);
          }
        }}
        onClose={() => {
          props.onValueDelete(valueBinding);
        }}
      >
        {`${props.title}`.split('\n').map((s, index) => (
          <span key={`${s}_${index}`}>
            {index === 0 || <br />}
            {s}
          </span>
        ))}
      </Tag>
    );
  }
});

const styles: Record<string, React.CSSProperties> = {
  popover: {
    backgroundColor: ZThemedColors.PRIMARY,
  },
  popoverTitle: {
    color: 'white',
  },
  popoverContent: {
    width: '270px',
  },
  save: {
    marginTop: '15px',
  },
  radioStyle: {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
    marginBottom: '15px',
  },
  radioContainer: {
    display: 'inline-block',
    width: '250px',
    backgroundColor: ZThemedColors.QUATERNARY,
    borderRadius: '6px',
    padding: '5px',
  },
  dataFormatRow: {
    width: '100%',
  },
  dataFormatTitle: {
    color: '#ffffff',
    fontSize: '13px',
    width: '40%',
  },
  dataFormatSubTitle: {
    width: '60%',
    color: '#A5A5A5',
    fontSize: '9px',
    textAlign: 'right',
    overflow: 'hidden',
  },
  timestampRow: {
    marginBottom: '10px',
  },
  select: {
    marginLeft: '10px',
  },
  inputNumber: {
    width: '60px',
  },
  arrayMapping: {
    marginBottom: '20px',
  },
  arraySelect: {
    width: '100%',
  },
};
