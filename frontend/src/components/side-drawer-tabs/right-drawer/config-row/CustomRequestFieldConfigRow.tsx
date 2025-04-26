/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React from 'react';
import { head, last, cloneDeep } from 'lodash';
import uniqid from 'uniqid';
import { CustomRequestField } from '../../../../shared/type-definition/EventBinding';
import { ARRAY_TYPE } from '../../../../shared/type-definition/DataModel';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import { DataBinding, VariableBinding } from '../../../../shared/type-definition/DataBinding';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import DataBindingConfigRow from './DataBindingConfigRow';
import useDataModelMetadata from '../../../../hooks/useDataModelMetadata';
import DataBindingHelper from '../../../../utils/DataBindingHelper';
import ArgumentsConfigRow from './ArgumentsConfigRow';
import {
  ObjectTransformOperator,
  ObjectTransform,
  ObjectTransformType,
  TextTransformType,
  Const,
} from '../../../../shared/type-definition/Transform';
import { isDefined } from '../../../../utils/utils';
import i18n from './CustomRequestFieldConfigRow.i18n.json';
import useLocale from '../../../../hooks/useLocale';
import { Select, Collapse, Row, Divider } from '../../../../zui';

interface Props {
  componentModel: BaseComponentModel;
  value: CustomRequestField;
  onChange: (value: CustomRequestField) => void;

  ghost?: boolean; // esthetic
}

enum Source {
  CREATE = 'create',
  MAPPING = 'mapping',
}

export default observer(function CustomRequestFieldConfigRow(props: Props) {
  const { value, onChange, componentModel, ghost } = props;
  const { dataModelRegistry } = useDataModelMetadata();
  const references = DataBindingHelper.fetchReferenceFields(dataModelRegistry);
  const { localizedContent: content } = useLocale(i18n);

  const isObject = !!value.object?.length;
  const isArray = value.type === ARRAY_TYPE;

  // Basic type or array of basic type
  if (!isObject)
    return (
      <DataBindingConfigRow
        key={value.name}
        title={value.name}
        componentModel={componentModel}
        dataBinding={value.value ?? DataBinding.withSingleValue(value.type)}
        onChange={(dataBinding) => {
          onChange({ ...value, value: dataBinding });
        }}
      />
    );

  // Object
  if (!isArray) {
    const render = () => (
      <>
        {(value.object ?? []).map((obj, index) => (
          <CustomRequestFieldConfigRow
            key={obj.name}
            componentModel={componentModel}
            value={obj}
            onChange={(customRequestField) => {
              onChange({
                ...value,
                object: (value.object ?? []).map((o, i) => {
                  if (i === index) {
                    return customRequestField;
                  }
                  return o;
                }),
              });
            }}
          />
        ))}
      </>
    );
    return ghost ? (
      render()
    ) : (
      <Collapse
        setContentFontColorToOrangeBecauseHistoryIsCruel
        bordered
        items={[{ title: value.name, key: value.name, content: render() }]}
      />
    );
  }

  // Array of objects
  const arraySource = value.value ? Source.MAPPING : Source.CREATE;

  const renderArrayMapping = () => {
    const { value: dataBinding } = value;
    const itemType = last(
      (dataBinding?.valueBinding as VariableBinding | undefined)?.pathComponents
    )?.itemType;
    const fields = references.find((field) => field.type === itemType)?.where ?? [];
    const mappings = (dataBinding?.valueBinding as VariableBinding).arrayMappings;
    return (
      <>
        {dataBinding ? (
          <>
            <DataBindingConfigRow
              componentModel={componentModel}
              dataBinding={dataBinding}
              title={value.name}
              onChange={(newDataBinding) => {
                onChange({
                  ...value,
                  value: newDataBinding,
                });
              }}
            />
            <Divider>
              <ZConfigRowTitle text={content.label.mapping} />
            </Divider>
            {(value.object ?? []).map((field) => (
              <React.Fragment key={field.name}>
                <ZConfigRowTitle text={field.name} />
                <Select
                  value={
                    (
                      (mappings ?? []).find(
                        (mapping) =>
                          mapping.type === ObjectTransformType.UNARY_OBJECT &&
                          mapping.operator === ObjectTransformOperator.MAP_KEY &&
                          mapping.transform.operator === Const &&
                          mapping.transform.value === field.name
                      ) as ObjectTransform | undefined
                    )?.objectKey
                  }
                  onChange={(type) => {
                    const newMapping = (mappings ?? [])
                      .filter(
                        (mapping) =>
                          !(
                            mapping.type === ObjectTransformType.UNARY_OBJECT &&
                            mapping.operator === ObjectTransformOperator.MAP_KEY &&
                            mapping.transform.operator === Const &&
                            mapping.transform.value === field.name
                          )
                      )
                      .filter(isDefined)
                      .concat([
                        {
                          type: ObjectTransformType.UNARY_OBJECT,
                          operator: ObjectTransformOperator.MAP_KEY,
                          objectKey: type,
                          transform: {
                            type: TextTransformType.UNARY_TEXT,
                            operator: Const,
                            value: field.name,
                          },
                        },
                      ]);
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    const newDataBinding = DataBinding.buildFromObject(cloneDeep(dataBinding))!;
                    (newDataBinding.valueBinding as VariableBinding).arrayMappings = newMapping;
                    onChange({ ...value, value: newDataBinding });
                  }}
                  dropdownMatchSelectWidth={false}
                >
                  {fields
                    .filter((f) => DataBindingHelper.isSameDataType(f.type, field.type))
                    .map((f) => (
                      <Select.Option key={f.name} value={f.name}>
                        {f.name}
                      </Select.Option>
                    ))}
                </Select>
              </React.Fragment>
            ))}
          </>
        ) : (
          <></>
        )}
      </>
    );
  };

  const renderArrayBuilder = () => {
    const { list } = value;
    const args = Object.fromEntries((list ?? []).map((field) => [field.name, field]));
    const onArgsChange = (newArgs: Record<string, CustomRequestField>) => {
      onChange({
        ...value,
        list: Object.entries(newArgs).map(([name, field]) => ({
          ...field,
          name,
        })),
      });
    };
    return (
      <ArgumentsConfigRow
        args={args}
        onChange={onArgsChange}
        componentModel={componentModel}
        producer={() => ({
          name: '',
          type: value.itemType ?? head(value.object)?.type ?? '',
          object: value.object,
        })}
        nameProducer={() => uniqid.process(`${value.name}_`)}
        Edit={(editProps) => (
          <CustomRequestFieldConfigRow
            value={editProps.value}
            componentModel={editProps.componentModel}
            onChange={editProps.onChange}
            ghost
          />
        )}
      />
    );
  };

  const render = () => (
    <>
      <Row justify="space-around" align="middle">
        <div>{content.label.source}</div>
        <Select
          value={arraySource}
          onChange={(newSource) => {
            const { list: __list, value: __value, ...rest } = value;
            if (newSource === Source.MAPPING) {
              onChange({
                ...rest,
                value: DataBinding.withSingleValue(ARRAY_TYPE),
              });
            } else {
              onChange({
                ...rest,
                list: [],
              });
            }
          }}
        >
          {Object.values(Source).map((source) => (
            <Select.Option key={source} value={source}>
              {content.source[source]}
            </Select.Option>
          ))}
        </Select>
      </Row>
      <Divider />
      {arraySource === Source.MAPPING ? renderArrayMapping() : renderArrayBuilder()}
    </>
  );
  return ghost ? (
    render()
  ) : (
    <Collapse
      setContentFontColorToOrangeBecauseHistoryIsCruel
      bordered
      items={[{ title: value.name, key: value.name, content: render() }]}
    />
  );
});
