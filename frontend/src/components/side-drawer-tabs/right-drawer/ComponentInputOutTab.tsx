/* eslint-disable import/no-default-export */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { observer } from 'mobx-react';
import _ from 'lodash';
import { NullableReactElement } from '../../../shared/type-definition/ZTypes';
import ComponentDiff from '../../../diffs/ComponentDiff';
import useStores from '../../../hooks/useStores';
import i18n from './ComponentInputOutTab.i18n.json';
import useLocale from '../../../hooks/useLocale';
import ComponentInputOutputConfigRow from './config-row/ComponentInputOutputConfigRow';
import { ComponentInputOutputData } from '../../../models/interfaces/ComponentModel';
import StoreHelpers from '../../../mobx/StoreHelpers';
import { MRefProp } from '../../mobile-components/PropTypes';
import useModel from '../../../hooks/useModel';
import { DiffItem } from '../../../shared/type-definition/Diff';
import { DataBinding } from '../../../shared/type-definition/DataBinding';
import ComponentModelType from '../../../shared/type-definition/ComponentModelType';
import ComponentModelBuilder from '../../../models/ComponentModelBuilder';
import { Collapse } from '../../../zui';
import cssModule from './ComponentInputOutTab.module.scss';

export default observer(function ComponentInputOutTab(props: MRefProp): NullableReactElement {
  const { localizedContent: content } = useLocale(i18n);
  const { coreStore, diffStore } = useStores();
  const model = StoreHelpers.findComponentModelOrThrow(props.mRef);
  const previewModel = useModel(model.previewMRef) ?? model;

  const inputDataSource = _.cloneDeep(model.inputDataSource ?? []);
  const outputDataSource = _.cloneDeep(model.outputDataSource ?? []);

  const onUpdateInputDataSource = (dataSource: ComponentInputOutputData[]) => {
    let diffItems: DiffItem[] = [];
    if (previewModel.isTemplate) {
      diffItems = diffItems.concat(getUpdateAllReferencedModelInputDiff(dataSource));
    } else {
      diffItems.push(
        ComponentDiff.buildUpdateModelDiff({
          model: previewModel,
          valueKey: 'inputDataSource',
          newValue: dataSource,
        })
      );
    }
    diffStore.applyDiff(diffItems);
  };

  const onUpdateOutputDataSource = (dataSource: ComponentInputOutputData[]) => {
    let diffItems = [
      ComponentDiff.buildUpdateModelDiff({
        model: previewModel,
        valueKey: 'outputDataSource',
        newValue: dataSource,
      }),
    ];
    if (previewModel.isTemplate) {
      diffItems = diffItems.concat(getUpdateAllReferencedModelOutputDiff(dataSource));
    }
    diffStore.applyDiff(diffItems);
  };

  const getUpdateAllReferencedModelInputDiff = (
    dataSource: ComponentInputOutputData[]
  ): DiffItem[] => {
    const diffItems: DiffItem[] = [];
    Object.values(coreStore.mRefMap).forEach((data) => {
      if (data.referencedTemplateMRef === previewModel.mRef || data.mRef === previewModel.mRef) {
        const newDataSource =
          data.mRef === model.mRef
            ? dataSource
            : dataSource.map((element) => {
                const currentComponentData = data.inputDataSource?.find(
                  (ids) => ids.name === element.name
                );
                let referencedData: DataBinding | undefined = currentComponentData?.referencedData;
                if (data.isTemplate) {
                  return { ...element, referencedData };
                }
                if (
                  element.referencedData &&
                  (currentComponentData?.referencedData?.type !== element.referencedData.type ||
                    currentComponentData?.referencedData?.itemType !==
                      element.referencedData.itemType)
                ) {
                  referencedData = DataBinding.withSingleValue(
                    element.referencedData.type,
                    element.referencedData.itemType
                  );
                }
                return { ...element, referencedData };
              });
        diffItems.push(
          ComponentDiff.buildUpdateModelDiff({
            model: data,
            valueKey: 'inputDataSource',
            newValue: newDataSource,
          })
        );
      }
    });
    return diffItems;
  };

  const getUpdateAllReferencedModelOutputDiff = (
    dataSource: ComponentInputOutputData[]
  ): DiffItem[] => {
    const diffItems: DiffItem[] = [];
    Object.values(coreStore.mRefMap).forEach((data) => {
      if (data.referencedTemplateMRef === previewModel.mRef) {
        diffItems.push(
          ComponentDiff.buildUpdateModelDiff({
            model: data,
            valueKey: 'outputDataSource',
            newValue: dataSource,
          })
        );
      }
    });
    return diffItems;
  };

  const renderInputDataConfigTab = () => {
    return (
      (previewModel.isTemplate || inputDataSource.length > 0) && (
        <Collapse
          className={cssModule.inputOutputConfigRow}
          setContentFontColorToOrangeBecauseHistoryIsCruel
          items={[
            {
              title: content.label.inputData,
              content: (
                <ComponentInputOutputConfigRow
                  referenceable={!model.isTemplate}
                  selectReferencedDataTransientModel={ComponentModelBuilder.buildByType(
                    model.mRef,
                    ComponentModelType.BLANK_CONTAINER
                  )}
                  dataSource={inputDataSource}
                  noDataTitle={content.label.noInputData}
                  addDataTitle={content.label.addInputData}
                  saveComponentOutput={(dataSource) => onUpdateInputDataSource(dataSource)}
                />
              ),
            },
          ]}
        />
      )
    );
  };

  const renderOutputDataConfigTab = () => {
    return (
      (previewModel.isTemplate || outputDataSource.length > 0) && (
        <Collapse
          className={cssModule.inputOutputConfigRow}
          setContentFontColorToOrangeBecauseHistoryIsCruel
          items={[
            {
              title: content.label.outputData,
              content: (
                <ComponentInputOutputConfigRow
                  referenceable
                  selectReferencedDataTransientModel={ComponentModelBuilder.buildByType(
                    previewModel.mRef,
                    ComponentModelType.BLANK_CONTAINER
                  )}
                  dataSource={outputDataSource}
                  noDataTitle={content.label.noOutputData}
                  addDataTitle={content.label.addOutputData}
                  saveComponentOutput={(dataSource) => onUpdateOutputDataSource(dataSource)}
                />
              ),
            },
          ]}
        />
      )
    );
  };

  return (
    <div key={model.mRef}>
      {renderInputDataConfigTab()}
      {renderOutputDataConfigTab()}
    </div>
  );
});
