/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React, { ReactElement } from 'react';
import _ from 'lodash';
import { DraggableScreenAttributes } from '../../../../containers/ZDraggableBoard';
import useDataModelMetadata from '../../../../hooks/useDataModelMetadata';
import BasicMobileModel from '../../../../models/basic-components/BasicMobileModel';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import ChildComponentsConfigRow from './ChildComponentsConfigRow';
import ClickActionConfigRow, {
  getDefaultDisabledClickActionList,
  getWithDefaultActions,
} from './ClickActionConfigRow';
import DataBindingConfigRow from './DataBindingConfigRow';
import ImageSourceConfigRow from './ImageSourceConfigRow';
import { LinkedDataConfigRow, LinkedData } from './LinkedDataConfigRow';
import { PageDataConfigRow, PageData } from './PageDataConfigRow';
import { RemoteDataConfigRow } from './RemoteDataConfigRow';
import { CustomRequestDataConfigRow } from './CustomRequestDataConfigRow';
import ScreenI18n from './ScreenDataConfigRow.i18n.json';
import DataI18n from './DataConfigRow.i18n.json';
import useLocale from '../../../../hooks/useLocale';
import useCustomRequestRegistry from '../../../../hooks/useCustomRequestRegistry';
import {
  CustomRequestBinding,
  GraphQLRequestBinding,
} from '../../../../shared/type-definition/EventBinding';
import { ZColors } from '../../../../utils/ZConst';
import { Collapse, Row, Switch } from '../../../../zui';

interface Props {
  model: BasicMobileModel;
}

export default observer(function ScreenDataConfigRow(props: Props): ReactElement {
  const { localizedContent: screenContent } = useLocale(ScreenI18n);
  const { localizedContent: content } = useLocale(DataI18n);
  const { customQueries } = useCustomRequestRegistry();

  const model = props.model as BasicMobileModel;
  const dataAttributes = model.dataAttributes as DraggableScreenAttributes;

  const { dataModelRegistry } = useDataModelMetadata();

  const saveLinkedData = (linkedData: LinkedData[]): void => {
    model.onUpdateModel(
      'variableTable',
      Object.fromEntries(linkedData.map((element) => [element.name, element.data]))
    );
  };
  const savePageData = (pageData: PageData[]): void => {
    model.onUpdateModel(
      'pageVariableTable',
      Object.fromEntries(pageData.map((element) => [element.name, element.data]))
    );
  };
  const saveRemoteData = (remoteList: GraphQLRequestBinding[]): void => {
    model.onUpdateModel('queries', remoteList);
  };

  const saveCustomRequestData = (customRequestList: CustomRequestBinding[]): void => {
    model.onUpdateModel('thirdPartyQueries', customRequestList);
  };

  const renderComponentsPanel = () => ({
    title: screenContent.label.components,
    content: <ChildComponentsConfigRow mRef={model.mRef} reverse />,
  });
  const renderSharePanel = () => ({
    title: screenContent.label.share,
    content: (
      <>
        <Row justify="space-between" align="middle" style={styles.sharePanelRow}>
          <label style={styles.label}>{screenContent.share.enableSharing}</label>
          <Switch
            checked={dataAttributes.shareInfo.enabled}
            onChange={(checked) => {
              model.onUpdateDataAttributes('shareInfo', {
                ...dataAttributes.shareInfo,
                enabled: checked,
              });
            }}
          />
        </Row>
        <div style={styles.limitLine} />
        <DataBindingConfigRow
          title={screenContent.share.title}
          componentModel={model}
          dataBinding={dataAttributes.shareInfo.title}
          onChange={(dataBinding) => {
            model.onUpdateDataAttributes('shareInfo', {
              ...dataAttributes.shareInfo,
              title: dataBinding,
            });
          }}
        />
        <ImageSourceConfigRow
          model={model}
          belongsToDataAttribute={false}
          imageSourceDataAttributes={model.dataAttributes.shareInfo}
          onImageDataAttributesChange={(imageDataAttributes) => {
            model.onUpdateDataAttributes('shareInfo', {
              ...dataAttributes.shareInfo,
              ...imageDataAttributes,
            });
          }}
        />
      </>
    ),
  });
  const renderLifeCyclePanel = () => ({
    title: screenContent.label.lifeCycle,
    content: (
      <>
        <ZConfigRowTitle text={screenContent.lifeCycle.didLoad} />
        <ClickActionConfigRow
          componentModel={model}
          eventList={_.cloneDeep(model.dataAttributes.pageDidLoad)}
          eventListOnChange={(eventList) => {
            model.onUpdateDataAttributes('pageDidLoad', eventList);
          }}
          enabledActions={getWithDefaultActions(getDefaultDisabledClickActionList())}
        />
        <ZConfigRowTitle text={screenContent.lifeCycle.dealloc} />
        <ClickActionConfigRow
          componentModel={model}
          eventList={_.cloneDeep(model.dataAttributes.pageDealloc)}
          eventListOnChange={(eventList) => {
            model.onUpdateDataAttributes('pageDealloc', eventList);
          }}
          enabledActions={getWithDefaultActions(getDefaultDisabledClickActionList())}
        />
      </>
    ),
  });
  const renderPageDataPanel = () => ({
    title: screenContent.label.pageData,
    content: (
      <PageDataConfigRow
        variableTable={model.pageVariableTable}
        dataModelRegistry={dataModelRegistry}
        noDataTitle={content.label.noPageData}
        addDataTitle={content.label.addPageData}
        savePageData={savePageData}
      />
    ),
  });
  const renderLinkedDataPanel = () => ({
    title: screenContent.label.linkedData,
    content: (
      <LinkedDataConfigRow
        data={model}
        dataModelRegistry={dataModelRegistry}
        saveLinkedData={saveLinkedData}
      />
    ),
  });
  const renderRemoteDataPanel = () => ({
    title: screenContent.label.remoteData,
    content: (
      <RemoteDataConfigRow
        data={model}
        dataModelRegistry={dataModelRegistry}
        saveRemoteData={saveRemoteData}
      />
    ),
  });

  const renderCustomDataPanel = () => ({
    title: screenContent.label.customData,
    content: (
      <CustomRequestDataConfigRow
        containerModel={model}
        queryList={customQueries}
        saveCustomRequestData={saveCustomRequestData}
      />
    ),
  });

  const collapseItems = [
    renderComponentsPanel(),
    renderSharePanel(),
    renderLifeCyclePanel(),
    renderLinkedDataPanel(),
    renderPageDataPanel(),
    renderRemoteDataPanel(),
  ];
  if (customQueries.length) {
    collapseItems.push(renderCustomDataPanel());
  }

  return <Collapse setContentFontColorToOrangeBecauseHistoryIsCruel items={collapseItems} />;
});

const styles: Record<string, React.CSSProperties> = {
  label: {
    color: ZColors.WHITE,
  },
  sharePanelRow: {
    marginTop: '10px',
    fontSize: '13px',
  },
  limitLine: {
    width: '100%',
    height: '1px',
    backgroundColor: '#bbb',
    marginTop: '10px',
    marginBottom: '5px',
  },
};
