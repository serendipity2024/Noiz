/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import uniqid from 'uniqid';
import useLocale from '../hooks/useLocale';
import useStores from '../hooks/useStores';
import { UserFlow, useSelectionTrigger } from '../hooks/useUserFlowTrigger';
import { useValidationDataDependency } from '../hooks/useValidationDataDependency';
import StoreHelpers from '../mobx/StoreHelpers';
import { DataDependencyType } from '../mobx/stores/ValidationStore';
import BaseComponentModel from '../models/base/BaseComponentModel';
import { DiffPathComponent } from '../shared/type-definition/Diff';
import { NullableReactElement } from '../shared/type-definition/ZTypes';
import DiffHelper from '../utils/DiffHelper';
import DataBindingI18n from './side-drawer-tabs/right-drawer/config-row/DataBindingConfigRow.i18n.json';
import i18n from './ZDiffValidationView.i18n.json';
import { Table, Modal, Row } from '../zui';

type TargetType = BaseComponentModel;

interface DependencyError {
  key: string;
  target: TargetType;
  dependentPathComponent: string;
  dependencyContent: string;
}

export default observer(function ZDiffValidationView(): NullableReactElement {
  const { localizedContent } = useLocale(i18n);
  const { localizedContent: dataBindingLocalizedContent } = useLocale(DataBindingI18n);

  const uft = useSelectionTrigger();
  const { validateDiff } = useValidationDataDependency();
  const { validationStore, coreStore, diffStore } = useStores();

  useEffect(() => {
    if (diffStore.diffPendingApplication) {
      DiffHelper.apply(diffStore.diffPendingApplication, validateDiff, true);
    }
  }, [diffStore.diffPendingApplication, validateDiff]);

  const TableColumns = [
    {
      title: localizedContent.target,
      dataIndex: 'target',
      key: 'target',
      render: (target: TargetType) => (
        <div
          style={styles.target}
          onClick={(e) => {
            e.stopPropagation();
            validationStore.clearValidationResult();
            let focusTarget: BaseComponentModel | undefined = target;
            while (focusTarget && !focusTarget.hasFocusMode()) {
              const parentModel = StoreHelpers.findParentOrThrow(focusTarget);
              focusTarget = parentModel;
            }
            if (!focusTarget) return;
            uft(UserFlow.FOCUS_TARGET)(focusTarget.mRef);
            uft(UserFlow.SELECT_TARGET)(target.mRef);
          }}
        >
          {target.componentName}
        </div>
      ),
    },
    {
      title: localizedContent.dependentPathComponent,
      dataIndex: 'dependentPathComponent',
      key: 'dependentPathComponent',
    },
    {
      title: localizedContent.dependencyContent,
      dataIndex: 'dependencyContent',
      key: 'dependencyContent',
      render: (dependencyContent: string) => (
        <div style={styles.dependencyContent}>{dependencyContent}</div>
      ),
    },
  ];

  const getTargetAndDependencyContent = (
    diffPathComponents: DiffPathComponent[]
  ): { target: TargetType; dependencyContent: string } | undefined => {
    if (diffPathComponents.length <= 1) return undefined;
    const kindPathComponent = diffPathComponents[0];
    switch (kindPathComponent.key) {
      case 'mRefMap': {
        const mRef = diffPathComponents[1].key;
        if (!mRef) return undefined;
        const target = coreStore.getModel(mRef);
        if (!target) return undefined;
        return {
          target,
          dependencyContent: diffPathComponents
            .slice(2)
            .map((dpc) => dpc.key ?? dpc.index)
            .join('—>'),
        };
      }
      default:
        throw new Error(`analytic diffPathComponents error, ${JSON.stringify(diffPathComponents)}`);
    }
  };

  const tableDataSourceRecord: Record<string, DependencyError> = {};
  validationStore.validationResult.dataDependencies.forEach((dataDependency) => {
    let dependencyContent: string | undefined;
    switch (dataDependency.dependencyType) {
      case DataDependencyType.QUERIES: {
        const screenModel = StoreHelpers.findComponentModelOrThrow(dataDependency.rootMRef);
        dependencyContent = `${screenModel.componentName}->${dataBindingLocalizedContent.label.remoteData}->${dataDependency.requestId}`;
        break;
      }
      case DataDependencyType.THIRD_PARTY_QUERIES: {
        const screenModel = StoreHelpers.findComponentModelOrThrow(dataDependency.rootMRef);
        dependencyContent = `${screenModel.componentName}->${dataBindingLocalizedContent.label.customData}->${dataDependency.requestId}`;
        break;
      }
      case DataDependencyType.ITEM_VARIABLE_TABLE: {
        const listModel = StoreHelpers.findComponentModelOrThrow(dataDependency.listMRef);
        dependencyContent = `${listModel.componentName}->${dataBindingLocalizedContent.label.itemData}->${dataDependency.requestId}`;
        break;
      }
      case DataDependencyType.PAGE_VARIABLE_TABLE: {
        const screenModel = StoreHelpers.findComponentModelOrThrow(dataDependency.rootMRef);
        dependencyContent = `${screenModel.componentName}->${dataBindingLocalizedContent.label.pageData}->${dataDependency.dataName}`;
        break;
      }
      case DataDependencyType.SHARED_COMPONENT_INPUT: {
        const rootModel = StoreHelpers.findComponentModelOrThrow(dataDependency.rootMRef);
        dependencyContent = `${rootModel.componentName}->${dataBindingLocalizedContent.label.componentInputData}->${dataDependency.dataName}`;
        break;
      }
      case DataDependencyType.SHARED_COMPONENT_OUTPUT: {
        const rootModel = StoreHelpers.findComponentModelOrThrow(dataDependency.rootMRef);
        dependencyContent = `${rootModel.componentName}->${dataBindingLocalizedContent.label.componentOutputData}->${dataDependency.dataName}`;
        break;
      }
      case DataDependencyType.VARIABLE_TABLE: {
        const screenModel = StoreHelpers.findComponentModelOrThrow(dataDependency.rootMRef);
        dependencyContent = `${screenModel.componentName}->${dataBindingLocalizedContent.label.linkedData}->${dataDependency.dataName}`;
        break;
      }
      case DataDependencyType.COMPONENT: {
        const targetModel = StoreHelpers.getComponentModel(dataDependency.targetMRef);
        dependencyContent = targetModel ? targetModel.componentName : dataDependency.targetMRef;
        break;
      }
      case DataDependencyType.GLOBAL_VARIABLE_TABLE: {
        dependencyContent = `${dataBindingLocalizedContent.label.globalData}->${dataDependency.dataName}`;
        break;
      }
      case DataDependencyType.DATA_MODEL_TABLE: {
        dependencyContent = `${dataDependency.dependencyType}->${dataDependency.rootTable}`;
        break;
      }
      default:
        throw new Error(`unsupported dependencyType, ${JSON.stringify(dataDependency)}`);
    }
    const targetAndDependencyContent = getTargetAndDependencyContent(
      dataDependency.diffPathComponents
    );
    if (targetAndDependencyContent) {
      const error: DependencyError = {
        key: dataDependency.id,
        target: targetAndDependencyContent.target,
        dependentPathComponent: targetAndDependencyContent.dependencyContent,
        dependencyContent,
      };
      const key = [error.target.mRef, error.dependentPathComponent, error.dependencyContent].join();
      tableDataSourceRecord[key] = error;
    }
  });
  const tableDataSource = Object.values(tableDataSourceRecord);
  // TODO: parsing typeStystem validation
  validationStore.validationResult.typeSystemValidationMessages.forEach((tsValidationMessage) =>
    tableDataSource.push({
      key: uniqid.process(),
      target: StoreHelpers.findComponentModelOrThrow(tsValidationMessage.componentId),
      dependentPathComponent: tsValidationMessage.pathComponent.join('->'),
      dependencyContent: JSON.stringify(tsValidationMessage.dependant),
    })
  );
  return (
    <Modal
      title={
        <Row align="middle">
          <span style={styles.warningTitle}>{localizedContent.title} !!</span>
        </Row>
      }
      centered
      destroyOnClose
      maskClosable={false}
      footer={null}
      visible={!validationStore.validationResult.successful}
      onCancel={() => {
        validationStore.clearValidationResult();
      }}
      width="800px"
    >
      <Table columns={TableColumns} dataSource={tableDataSource} pagination={false} />
    </Modal>
  );
});

const styles: Record<string, React.CSSProperties> = {
  warningIcon: {
    color: 'red',
    fontSize: '20px',
  },
  warningTitle: {
    color: 'red',
  },
  target: {
    color: 'blue',
  },
  dependencyContent: {
    color: 'red',
  },
};
