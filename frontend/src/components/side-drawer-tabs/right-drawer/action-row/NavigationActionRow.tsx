/* eslint-disable import/no-default-export */
/* eslint-disable no-return-assign */
import { observer } from 'mobx-react';
import React, { ReactElement, useMemo } from 'react';
import useLocale from '../../../../hooks/useLocale';
import useScreenModels from '../../../../hooks/useScreenModels';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import { DataBinding } from '../../../../shared/type-definition/DataBinding';
import { BaseType } from '../../../../shared/type-definition/DataModel';
import {
  EventBinding,
  NavigationActionHandleBinding,
  NavigationOperation,
  ScreenTransitionType,
} from '../../../../shared/type-definition/EventBinding';
import { ShortId } from '../../../../shared/type-definition/ZTypes';
import { ZColors, ZThemedColors } from '../../../../utils/ZConst';
import DataBindingConfigRow from '../config-row/DataBindingConfigRow';
import i18n from './NavigationActionRow.i18n.json';
import { Row, Select, Switch } from '../../../../zui';

interface Props {
  componentModel: BaseComponentModel;
  event: EventBinding;
  onEventChange: () => void;
}

export default observer(function NavigationActionRow(props: Props): ReactElement {
  const { localizedContent: content } = useLocale(i18n);
  const screenComponents = useScreenModels();

  const handleBinding = props.event as NavigationActionHandleBinding;

  const navigationActionArgs: Record<string, DataBinding> = useMemo(() => {
    const args: Record<string, DataBinding> = {};
    for (const screenComponent of screenComponents) {
      if (screenComponent.mRef === handleBinding.targetMRef) {
        Object.entries(screenComponent.variableTable).forEach(([key, variable]) => {
          args[key] = DataBinding.withSingleValue(variable.type);
        });
        break;
      }
    }
    return {
      ...args,
      ...(handleBinding.args ?? {}),
    };
  }, [handleBinding, screenComponents]);

  const renderTransitionOptionRow = () => {
    if (handleBinding.operation !== NavigationOperation.GO_BACK) {
      return (
        <>
          <div style={styles.transitionHeader}>{content.label.transition}</div>
          <Select
            bordered={false}
            size="large"
            value={handleBinding.transition}
            style={styles.transitionSelect}
            onChange={(value) => {
              handleBinding.transition = value;
              props.onEventChange();
            }}
          >
            {Object.values(ScreenTransitionType).map((type) => (
              <Select.Option key={type} value={type}>
                {content.transition[type] ?? type}
              </Select.Option>
            ))}
          </Select>
        </>
      );
    }

    const refresh =
      navigationActionArgs.refresh ??
      (DataBinding.withLiteral(false, BaseType.BOOLEAN) as DataBinding);
    const onRefreshEnabled = (checked: boolean) => {
      navigationActionArgs.refresh = DataBinding.withLiteral(checked, BaseType.BOOLEAN);
      handleBinding.args = navigationActionArgs;
      props.onEventChange();
    };

    return (
      <>
        <Row justify="space-between" align="middle">
          <label style={styles.refreshTitle}>{content.label.refreshEnabled}</label>
          <Switch title="Enabled" checked={refresh.effectiveValue} onClick={onRefreshEnabled} />
        </Row>
        <div style={styles.refreshTitle}>{content.label.targetScreenName}</div>
        <Select
          key={handleBinding.targetMRef}
          bordered={false}
          size="large"
          style={styles.transitionSelect}
          defaultValue={handleBinding.targetMRef}
          onChange={(value) => {
            handleBinding.targetMRef = value as ShortId;
            props.onEventChange();
          }}
        >
          {screenComponents.map((screenModel) => (
            <Select.Option key={screenModel.mRef} value={screenModel.mRef}>
              {screenModel.componentName}
            </Select.Option>
          ))}
        </Select>
      </>
    );
  };
  const renderParamsRow = () => {
    if (Object.keys(navigationActionArgs).length < 1) return null;
    if (handleBinding.operation === NavigationOperation.GO_BACK) return null;

    return (
      <>
        <div style={styles.paremetersHeader}>{content.label.parameters}</div>
        {Object.entries(navigationActionArgs).map(([title, dataBinding]) => (
          <DataBindingConfigRow
            key={title}
            title={title}
            componentModel={props.componentModel}
            dataBinding={dataBinding}
            onChange={(values) => {
              navigationActionArgs[title] = values;
              handleBinding.args = navigationActionArgs;
              props.onEventChange();
            }}
          />
        ))}
      </>
    );
  };

  return (
    <div>
      {renderTransitionOptionRow()}
      {renderParamsRow()}
    </div>
  );
});

const styles: Record<string, React.CSSProperties> = {
  transitionHeader: {
    padding: '10px 5px',
    color: ZColors.WHITE,
    opacity: '0.5',
  },
  transitionSelect: {
    width: '100%',
    fontSize: '10px',
    background: ZThemedColors.PRIMARY,
    textAlign: 'center',
    borderRadius: '6px',
  },
  paremetersHeader: {
    marginTop: '15px',
    padding: '10px 5px',
  },
  refreshTitle: {
    color: ZColors.WHITE,
    opacity: '0.5',
    marginBottom: '10px',
  },
};
