/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React, { ReactElement } from 'react';
import useLocale from '../../../../hooks/useLocale';
import StoreHelpers from '../../../../mobx/StoreHelpers';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import { DataBinding } from '../../../../shared/type-definition/DataBinding';
import { IntegerType } from '../../../../shared/type-definition/DataModel';
import {
  EventBinding,
  RefreshCellHandleBinding,
} from '../../../../shared/type-definition/EventBinding';
import { ZColors, ZThemedColors } from '../../../../utils/ZConst';
import DataBindingConfigRow from '../config-row/DataBindingConfigRow';
import i18n from './RefreshCellActionRow.i18n.json';
import { Select } from '../../../../zui';

interface Props {
  componentModel: BaseComponentModel;
  event: EventBinding;
  onEventChange: () => void;
}

export default observer(function RefreshCellActionRow(props: Props): ReactElement {
  const { localizedContent: content } = useLocale(i18n);
  const handleBinding = props.event as RefreshCellHandleBinding;

  const screen = StoreHelpers.fetchRootModel(props.componentModel);
  let listViewModels: BaseComponentModel[] = [];
  if (screen) {
    listViewModels = StoreHelpers.findAllModelsWithLogicInContainer({
      container: screen,
      filter: (model) => model.isList,
    });
  }
  return (
    <>
      <div style={styles.mutationTitle}>{content.label.list}</div>
      <Select
        size="large"
        key={handleBinding.listMRef}
        defaultValue={handleBinding.listMRef}
        placeholder={content.placeholder}
        style={styles.roleSelect}
        onChange={(value) => {
          handleBinding.listMRef = value;
          props.onEventChange();
        }}
      >
        {listViewModels.map((model) => (
          <Select.Option key={model.mRef} value={model.mRef}>
            {model.componentName}
          </Select.Option>
        ))}
      </Select>
      {handleBinding.listMRef && (
        <DataBindingConfigRow
          title={content.label.index}
          componentModel={props.componentModel}
          dataBinding={handleBinding.cellIndex ?? DataBinding.withSingleValue(IntegerType.INTEGER)}
          onChange={(value) => {
            handleBinding.cellIndex = value;
            props.onEventChange();
          }}
        />
      )}
    </>
  );
});

const styles: Record<string, React.CSSProperties> = {
  mutationTitle: {
    marginTop: '10px',
    color: ZColors.WHITE,
    opacity: '0.5',
  },
  roleSelect: {
    marginTop: '10px',
    width: '100%',
    fontSize: '10px',
    background: ZThemedColors.PRIMARY,
    textAlign: 'center',
    borderRadius: '6px',
  },
};
