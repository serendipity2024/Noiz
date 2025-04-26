/* eslint-disable import/no-default-export */
import { CascaderOptionType } from 'antd/lib/cascader';
import { observer } from 'mobx-react';
import React, { ReactElement } from 'react';
import useLocale from '../../../../hooks/useLocale';
import useScreenModels from '../../../../hooks/useScreenModels';
import StoreHelpers from '../../../../mobx/StoreHelpers';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import BaseContainerModel from '../../../../models/base/BaseContainerModel';
import { DataBinding } from '../../../../shared/type-definition/DataBinding';
import { IntegerType } from '../../../../shared/type-definition/DataModel';
import {
  EventBinding,
  RefreshListHandleBinding,
  RefreshPathComponent,
} from '../../../../shared/type-definition/EventBinding';
import { isDefined } from '../../../../utils/utils';
import { ZThemedColors } from '../../../../utils/ZConst';
import DataBindingConfigRow from '../config-row/DataBindingConfigRow';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import i18n from './RefreshListActionRow.i18n.json';
import './RefreshListActionRow.scss';
import { Cascader } from '../../../../zui';

interface Props {
  componentModel: BaseComponentModel;
  event: EventBinding;
  onEventChange: () => void;
}

export default observer(function RefreshListActionRow(props: Props): ReactElement {
  const components = useScreenModels();
  const refreshEvent = props.event as RefreshListHandleBinding;

  const refreshPathComponent = refreshEvent.refreshPathComponents[0] ?? {};
  const remainderPathComponents = refreshEvent.refreshPathComponents.slice(
    1,
    refreshEvent.refreshPathComponents.length
  );

  let screenMRef: string | undefined;
  const fields: CascaderOptionType[] = components
    .map((screen) => {
      const containerModels = StoreHelpers.findAllModelsWithLogicInContainer({
        container: screen,
        filter: (model) => {
          return model.isContainer && componentHasQuery(model as BaseContainerModel);
        },
      }) as BaseContainerModel[];
      const children: CascaderOptionType[] = containerModels.map((model) => {
        if (refreshPathComponent.listMRef === model.mRef) {
          screenMRef = screen.mRef;
        }
        return {
          value: model.mRef,
          label: model.componentName,
          isLeaf: true,
        };
      });
      const cascaderSelectModel: CascaderOptionType = {
        value: screen.mRef,
        label: screen.componentName,
        children,
      };
      return children.length > 0 ? cascaderSelectModel : undefined;
    })
    .filter(isDefined);

  const selectedValues: string[] = [];
  if (screenMRef) selectedValues.push(screenMRef);
  if (refreshPathComponent.listMRef) selectedValues.push(refreshPathComponent.listMRef);

  return (
    <RefreshObjectComponent
      componentModel={props.componentModel}
      selectedValues={selectedValues}
      fields={fields}
      refreshPathComponent={refreshPathComponent}
      remainderPathComponents={remainderPathComponents}
      onEventChange={(pathComponents) => {
        refreshEvent.refreshPathComponents = pathComponents;
        props.onEventChange();
      }}
    />
  );
});

interface RefreshObjectProps {
  componentModel: BaseComponentModel;
  selectedValues: string[];
  fields: CascaderOptionType[];
  refreshPathComponent: RefreshPathComponent;
  remainderPathComponents: RefreshPathComponent[];
  onEventChange: (pathComponents: RefreshPathComponent[]) => void;
}

function RefreshObjectComponent(props: RefreshObjectProps): ReactElement {
  const { localizedContent: content } = useLocale(i18n);
  const { componentModel, fields, refreshPathComponent, remainderPathComponents } = props;

  const currentFields: CascaderOptionType[] = [];
  if (refreshPathComponent.listMRef) {
    const currentModel = StoreHelpers.getComponentModel(refreshPathComponent.listMRef);
    if (currentModel) {
      const containerModels = StoreHelpers.findAllModelsWithLogicInContainer({
        container: currentModel,
        filter: (model) => {
          return model.isContainer && componentHasQuery(model as BaseContainerModel);
        },
      }) as BaseContainerModel[];
      containerModels.forEach((model) => {
        const cascaderSelectModel = {
          value: model.mRef,
          label: model.componentName,
          isLeaf: true,
        };
        currentFields.push(cascaderSelectModel);
      });
    }
  }

  const renderRemainderComponent = () => {
    const currentPathComponent = remainderPathComponents[0] ?? {};
    const currentRemainderPathComponents = remainderPathComponents.slice(
      1,
      remainderPathComponents.length
    );
    return (
      <RefreshObjectComponent
        componentModel={props.componentModel}
        selectedValues={currentPathComponent.listMRef ? [currentPathComponent.listMRef] : []}
        fields={currentFields}
        refreshPathComponent={currentPathComponent}
        remainderPathComponents={currentRemainderPathComponents}
        onEventChange={(pathComponents) => {
          props.onEventChange([refreshPathComponent, ...pathComponents]);
        }}
      />
    );
  };

  return (
    <>
      <ZConfigRowTitle text={content.label.pathComponent} />
      <Cascader
        style={styles.cascader}
        options={fields}
        placeholder={content.placeholder}
        value={props.selectedValues.length > 0 ? props.selectedValues : undefined}
        onChange={(_, selectedOptions) => {
          if (selectedOptions && selectedOptions.length > 0) {
            const selectOption = selectedOptions[selectedOptions.length - 1];
            props.onEventChange([
              {
                ...refreshPathComponent,
                listMRef: selectOption.value as string,
              },
            ]);
          }
        }}
      />
      {currentFields.length > 0 && (
        <DataBindingConfigRow
          title={content.label.index}
          key={refreshPathComponent.listMRef}
          componentModel={componentModel}
          dataBinding={
            refreshPathComponent.cellIndex ?? DataBinding.withSingleValue(IntegerType.INTEGER)
          }
          onChange={(value) => {
            props.onEventChange([
              {
                ...refreshPathComponent,
                cellIndex: value,
              },
              ...remainderPathComponents,
            ]);
          }}
        />
      )}
      {currentFields.length > 0 &&
        refreshPathComponent.cellIndex?.effectiveValue &&
        renderRemainderComponent()}
    </>
  );
}

const componentHasQuery = (component: BaseContainerModel): boolean => {
  return (
    (component.queries?.length ?? 0) > 0 ||
    (component.thirdPartyQueries?.length ?? 0) > 0 ||
    (component.dataPathComponents?.length ?? 0) > 0
  );
};

const styles: Record<string, React.CSSProperties> = {
  cascader: {
    width: '100%',
    borderRadius: '6px',
    background: ZThemedColors.PRIMARY,
    border: '0px',
  },
};
