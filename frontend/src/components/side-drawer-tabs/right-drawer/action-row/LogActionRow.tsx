/* eslint-disable import/no-default-export */
import { DeleteFilled, PlusOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react';
import React from 'react';
import uniqid from 'uniqid';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import { DataBinding } from '../../../../shared/type-definition/DataBinding';
import { ColumnTypes } from '../../../../shared/type-definition/DataModel';
import { EventBinding, LogHandleBinding } from '../../../../shared/type-definition/EventBinding';
import ConfigInput from '../shared/ConfigInput';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import DataBindingConfigRow from '../config-row/DataBindingConfigRow';
import i18n from './LogActionRow.i18n.json';
import useLocale from '../../../../hooks/useLocale';
import { ZThemedColors } from '../../../../utils/ZConst';
import { Button, Collapse, Select } from '../../../../zui';

interface Props {
  componentModel: BaseComponentModel;
  event: EventBinding;
  onEventChange: () => void;
}

export default observer(function LogActionRow(props: Props) {
  const handleBinding = props.event as LogHandleBinding;
  const { localizedContent: content } = useLocale(i18n);

  const deleteLogData = (key: string) => {
    delete handleBinding.args[key];
    props.onEventChange();
  };

  const renameLogData = (key: string, newKey: string) => {
    handleBinding.args[newKey] = handleBinding.args[key];
    delete handleBinding.args[key];
    props.onEventChange();
  };

  const updateLogData = (key: string, newDataBinding: DataBinding) => {
    handleBinding.args[key] = newDataBinding;
    props.onEventChange();
  };

  const addLogData = () => {
    const newKey = uniqid.process();
    handleBinding.args[newKey] = DataBinding.withSingleValue(ColumnTypes[0]);
    props.onEventChange();
  };

  const { Option } = Select;
  const options = ColumnTypes.map((type, index) => (
    <Option value={index} key={type}>
      {type}
    </Option>
  ));

  const Field = observer(
    ({ keyName, dataBinding }: { keyName: string; dataBinding: DataBinding }) => {
      const onSelectionChange = (newValue: number) => {
        updateLogData(keyName, DataBinding.withSingleValue(ColumnTypes[newValue]));
      };
      const onDataBindChange = (newDataBinding: DataBinding) => {
        updateLogData(keyName, newDataBinding);
      };

      const onKeyChange = (newKey: string) => {
        renameLogData(keyName, newKey);
      };
      return (
        <>
          <ZConfigRowTitle text={content.parameter.key} />
          <ConfigInput value={keyName} onSaveValue={onKeyChange} />
          <ZConfigRowTitle text={content.parameter.type} />
          <Select
            value={ColumnTypes.findIndex((value) => value === dataBinding.type)}
            onChange={onSelectionChange}
            style={styles.select}
          >
            {options}
          </Select>
          <DataBindingConfigRow
            title={content.parameter.value}
            componentModel={props.componentModel}
            dataBinding={dataBinding}
            onChange={onDataBindChange}
          />
        </>
      );
    }
  );

  const renderFieldsComponent = () => {
    return (
      <Collapse
        bordered
        setContentFontColorToOrangeBecauseHistoryIsCruel
        items={Object.entries(handleBinding.args).map(([key, dataBinding]) => ({
          title: key,
          icon: (
            <DeleteFilled
              onClick={(e) => {
                e.stopPropagation();
                deleteLogData(key);
              }}
            />
          ),
          content: <Field keyName={key} dataBinding={dataBinding} />,
        }))}
      />
    );
  };

  return (
    <>
      <ZConfigRowTitle text={content.label.name} />
      <ConfigInput
        key={handleBinding.title}
        value={handleBinding.title}
        placeholder="Enter title..."
        style={styles.input}
        onSaveValue={(newTitle) => {
          handleBinding.title = newTitle;
          props.onEventChange();
        }}
      />
      <ZConfigRowTitle text={content.label.parameter} />
      {renderFieldsComponent()}
      <Button block icon={<PlusOutlined />} onClick={addLogData} style={styles.buttonStyle} />
    </>
  );
});

const styles: Record<string, React.CSSProperties> = {
  select: {
    display: 'block',
  },
  input: {
    background: ZThemedColors.PRIMARY,
  },
};
