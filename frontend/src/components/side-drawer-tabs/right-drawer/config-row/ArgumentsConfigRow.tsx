/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import uniqid from 'uniqid';
import React from 'react';
import { DeleteFilled, PlusOutlined } from '@ant-design/icons';
import {
  DataBinding,
  PathComponent,
  PAGE_DATA_PATH,
} from '../../../../shared/type-definition/DataBinding';
import { ColumnTypes } from '../../../../shared/type-definition/DataModel';
import { Field } from '../../../../shared/type-definition/DataModelRegistry';
import DataBindingConfigRow from './DataBindingConfigRow';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import i18n from './DataConfigRow.i18n.json';
import useLocale from '../../../../hooks/useLocale';
import useDataModelRegistryResolvers from '../../../../hooks/useDataModelRegistryResolvers';
import { ZColors, ZThemedColors } from '../../../../utils/ZConst';
import { Row, Input, Select, Collapse, Button, Empty } from '../../../../zui';

interface Props<T> {
  args: Record<string, T>;
  componentModel: BaseComponentModel;
  onChange: (args: Record<string, T>) => void;

  producer: () => T;
  nameProducer?: () => string;
  Edit: ({
    value,
    onChange,
    componentModel,
  }: {
    value: T;
    onChange: (arg: T) => void;
    componentModel: BaseComponentModel;
  }) => JSX.Element;
}

type ParameterEdit<T> = Parameters<Props<T>['Edit']>[number];

export default observer(function ArgumentsConfigRow<T>(props: Props<T>) {
  const { localizedContent: content } = useLocale(i18n);
  const { args, componentModel, onChange, producer, nameProducer, Edit } = props;

  const addArg = (): void => {
    onChange({
      ...args,
      [nameProducer ? nameProducer() : uniqid.process('name_')]: producer(),
    });
  };

  const removeArg = (removeIndex: number): void => {
    const list = Object.fromEntries(
      Object.entries(args).filter((element, index) => index !== removeIndex)
    );
    onChange(list);
  };

  const updateArgName = (name: string, updateIndex: number): void => {
    const list = Object.fromEntries(
      Object.entries(args).map((element, index) =>
        index === updateIndex ? [name, element[1]] : element
      )
    );
    onChange(list);
  };

  const updateArg = (arg: T, updateIndex: number): void => {
    const list = Object.fromEntries(
      Object.entries(args).map((element, index) =>
        index === updateIndex ? [element[0], arg] : element
      )
    );
    onChange(list);
  };

  const renderArgItemComponent = (arg: [string, T], index: number) => {
    return (
      <>
        <Row justify="space-between" align="middle">
          <div>{content.parameter.name}</div>
          <Input
            key={arg[0]}
            defaultValue={arg[0]}
            onBlur={(e) => {
              updateArgName(e.target.value, index);
            }}
            style={styles.input}
          />
        </Row>
        <Edit
          componentModel={componentModel}
          value={arg[1]}
          onChange={(value) => updateArg(value, index)}
        />
      </>
    );
  };
  return (
    <>
      {Object.keys(args).length > 0 ? (
        <Collapse
          bordered
          setContentFontColorToOrangeBecauseHistoryIsCruel
          items={Object.entries(args).map((element, index) => ({
            title: element[0],
            icon: (
              <DeleteFilled
                onClick={(e) => {
                  e.stopPropagation();
                  removeArg(index);
                }}
              />
            ),
            content: renderArgItemComponent(element, index),
          }))}
        />
      ) : (
        <div style={styles.emptyContent}>{content.label.noParameter}</div>
      )}
      <Button icon={<PlusOutlined />} type="link" style={styles.addButton} onClick={addArg}>
        {content.label.addParameter}
      </Button>
    </>
  );
});

export const DataBindingParameterEdit = observer((props: ParameterEdit<DataBinding>) => {
  const { localizedContent: content } = useLocale(i18n);
  const { value, onChange, componentModel } = props;

  const options: Field[] = ColumnTypes.map((element) => ({
    name: element as string,
    type: element as string,
    nullable: false,
  }));

  return (
    <>
      <Row justify="space-between" align="middle" style={styles.row}>
        <div>{content.parameter.type}</div>
        <Select
          value={value.itemType ?? value.type}
          dropdownMatchSelectWidth={false}
          onSelect={(type) => {
            onChange(DataBinding.withSingleValue(type));
          }}
          style={styles.input}
        >
          {options.map((element) => (
            <Select.Option key={element.type} value={element.type}>
              {(content.type as Record<string, any>)[element.type] ?? element.type}
            </Select.Option>
          ))}
        </Select>
      </Row>
      <DataBindingConfigRow
        title={content.parameter.value}
        componentModel={componentModel}
        dataBinding={value}
        onChange={onChange}
      />
    </>
  );
});

export const AssignPageDataParameterEdit = observer((props: ParameterEdit<PathComponent[]>) => {
  const { localizedContent: content } = useLocale(i18n);
  const { componentModel, value, onChange } = props;

  const { resolveAllVariables } = useDataModelRegistryResolvers();
  const { pageVariables } = resolveAllVariables(componentModel.mRef);

  return (
    <Row justify="space-between" align="middle" style={styles.row}>
      <div>{content.parameter.pageData}</div>
      <Select
        value={value[1]?.name}
        onChange={(name: string) => {
          onChange([
            PAGE_DATA_PATH,
            {
              name,
              type: pageVariables[name].type,
            },
          ]);
        }}
        notFoundContent={<Empty description={false} />}
        dropdownMatchSelectWidth={false}
        style={styles.select}
      >
        {Object.keys(pageVariables).map((name) => (
          <Select.Option key={name} value={name}>
            {name}
          </Select.Option>
        ))}
      </Select>
    </Row>
  );
});

const styles: Record<string, React.CSSProperties> = {
  emptyContent: {
    borderWidth: '1px',
    borderColor: '#ccc',
    borderRadius: '5px',
    borderStyle: 'dashed',
    width: '100%',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: ZColors.WHITE,
    opacity: '0.5',
  },
  addButton: {
    borderWidth: 0,
    width: '100%',
    height: '45px',
    textAlign: 'center',
    boxShadow: '0 0 0 0',
    WebkitBoxShadow: '0 0 0 0',
    color: ZThemedColors.ACCENT,
  },
  row: {
    marginTop: '10px',
  },
  input: {
    background: '#eee',
    height: '32px',
    width: '60%',
  },
  select: {
    width: '60%',
  },
};
