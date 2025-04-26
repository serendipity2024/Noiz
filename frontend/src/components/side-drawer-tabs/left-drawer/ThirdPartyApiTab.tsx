import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react';
import React, { ReactElement } from 'react';
import cx from 'classnames';
import useStores from '../../../hooks/useStores';
import {
  ThirdPartyRequest,
  ThirdPartyRequestMethod,
  ThirdPartyResult,
} from '../../../shared/type-definition/ThirdPartyRequest';
import { Collapse, Select, Tabs, ZInput } from '../../../zui';
import cssModule from './ThirdPartyApiTab.module.scss';
import UrlSvg from '../../../shared/assets/icons/request-url.svg';
import { Parameter, ThirdPartyApiParamTab } from './ThirdPartyApiParamTab';
import i18n from './ThirdPartyApiTab.i18n.json';
import useLocale from '../../../hooks/useLocale';
import { useMutations } from '../../../hooks/useMutations';
import { ThirdPartyApiCreateParamTab } from './ThirdPartyApiCreateParamTab';
import { TypeSystemHelper } from '../../../utils/TypeSystemHelper';

export const ThirdPartyApiTab = observer((): ReactElement => {
  const { localizedContent } = useLocale(i18n);
  const { coreStore } = useStores();
  const { thirdPartyApiMutations } = useMutations();

  // TODO: open debug api view
  function onDebugApi(thirdPartyRequest: ThirdPartyRequest) {
    window.console.log(`onDebugApi, ${thirdPartyRequest.url}`);
  }

  function renderThirdPartyHeaderComponent(thirdPartyRequest: ThirdPartyRequest) {
    return (
      <div className={cssModule.headerContainer}>
        <div onClick={(event) => event.stopPropagation()}>
          <ZInput
            key={thirdPartyRequest.name}
            defaultValue={thirdPartyRequest.name}
            onBlur={(result) =>
              thirdPartyApiMutations.updateThirdPartyRequest(
                thirdPartyRequest.id,
                'name',
                result.target.value
              )
            }
          />
        </div>
        <div className={cssModule.headerRight}>
          <div
            className={cssModule.debugButton}
            onClick={(event) => {
              event.stopPropagation();
              onDebugApi(thirdPartyRequest);
            }}
          >
            {localizedContent.debug}
          </div>
          <DeleteOutlined
            onClick={(event) => {
              event.stopPropagation();
              thirdPartyApiMutations.deleteThirdPartyRequest(thirdPartyRequest.id);
            }}
          />
        </div>
      </div>
    );
  }

  function renderThirdPartyItemInput(thirdPartyRequest: ThirdPartyRequest) {
    return (
      <div className={cssModule.itemContent}>
        <div className={cssModule.urlContainer}>
          <Select
            className={cssModule.select}
            value={thirdPartyRequest.method}
            bordered={false}
            onSelect={(value) =>
              thirdPartyApiMutations.updateThirdPartyRequest(thirdPartyRequest.id, 'method', value)
            }
          >
            {Object.values(ThirdPartyRequestMethod).map((method) => (
              <Select.Option key={method} value={method}>
                {method}
              </Select.Option>
            ))}
          </Select>
          <div className={cssModule.urlContent}>
            <img alt="" src={UrlSvg} />
            <ZInput
              key={thirdPartyRequest.url}
              className={cssModule.urlInput}
              defaultValue={thirdPartyRequest.url}
              bordered={false}
              lightBackground={false}
              onBlur={(result) =>
                thirdPartyApiMutations.updateThirdPartyRequest(
                  thirdPartyRequest.id,
                  'url',
                  result.target.value
                )
              }
            />
          </div>
        </div>
        <div className={cssModule.urlContainer}>
          <div className={cssModule.description}>{localizedContent.description}</div>
          <ZInput
            key={thirdPartyRequest.description}
            className={cssModule.descriptionInput}
            defaultValue={thirdPartyRequest.description}
            placeholder={localizedContent.inputDescription}
            onBlur={(result) =>
              thirdPartyApiMutations.updateThirdPartyRequest(
                thirdPartyRequest.id,
                'description',
                result.target.value
              )
            }
          />
        </div>
        {renderEditParameters({
          parameters: thirdPartyRequest.parameters ?? [],
          needPosition: true,
          addButtonHidden: false,
          onParametersChange: (parameters) => {
            thirdPartyApiMutations.updateThirdPartyRequest(
              thirdPartyRequest.id,
              'parameters',
              parameters
            );
          },
        })}
      </div>
    );
  }

  function renderEditParameters(props: {
    parameters: Parameter[];
    needPosition: boolean;
    addButtonHidden: boolean;
    onParametersChange: (parameters: Parameter[]) => void;
  }) {
    const { parameters, needPosition, addButtonHidden, onParametersChange } = props;
    return (
      <div className={cssModule.addParam}>
        {!addButtonHidden && (
          <>
            <ThirdPartyApiCreateParamTab
              needPosition={needPosition}
              content={
                <div className={cssModule.addParamContent} onClick={(e) => e.stopPropagation()}>
                  <PlusOutlined className={cssModule.addIcon} />
                  <div className={cssModule.addTitle}>添加Parameters</div>
                </div>
              }
              onConfirm={(newParameter) => {
                onParametersChange([
                  ...parameters,
                  {
                    ...newParameter,
                    zType: TypeSystemHelper.genZType(newParameter),
                  },
                ]);
              }}
            />
            {parameters.length > 0 && <div className={cssModule.addParamSpace} />}
          </>
        )}
        <ThirdPartyApiParamTab parameters={parameters} onParametersChange={onParametersChange} />
      </div>
    );
  }

  function renderThirdPartyItemOutput(thirdPartyRequest: ThirdPartyRequest) {
    const renderTabPane = (
      result: ThirdPartyResult,
      title: string,
      onResultChange: (result: ThirdPartyResult) => void
    ) => (
      <Tabs.TabPane className={cssModule.itemData} tab={title} key={result.statusCode}>
        {renderEditParameters({
          parameters: result.responseData ? [result.responseData] : [],
          needPosition: false,
          addButtonHidden: !!result.responseData,
          onParametersChange: (parameters) => {
            onResultChange({ ...result, responseData: parameters[0] });
          },
        })}
      </Tabs.TabPane>
    );
    return (
      <div className={cssModule.itemContent}>
        <Tabs
          className={cssModule.itemTab}
          defaultActiveKey={thirdPartyRequest.response.successResponse.statusCode}
        >
          {renderTabPane(
            thirdPartyRequest.response.successResponse,
            localizedContent.successTab,
            (result) => {
              thirdPartyApiMutations.updateThirdPartyRequest(thirdPartyRequest.id, 'response', {
                ...thirdPartyRequest.response,
                successResponse: result,
              });
            }
          )}
          {renderTabPane(
            thirdPartyRequest.response.temporaryFailResponse,
            localizedContent.temporaryFailureTab,
            (result) => {
              thirdPartyApiMutations.updateThirdPartyRequest(thirdPartyRequest.id, 'response', {
                ...thirdPartyRequest.response,
                temporaryFailResponse: result,
              });
            }
          )}
          {renderTabPane(
            thirdPartyRequest.response.permanentFailResponse,
            localizedContent.permanentFailureTab,
            (result) => {
              thirdPartyApiMutations.updateThirdPartyRequest(thirdPartyRequest.id, 'response', {
                ...thirdPartyRequest.response,
                permanentFailResponse: result,
              });
            }
          )}
        </Tabs>
      </div>
    );
  }

  return (
    <div className={cssModule.container}>
      <div className={cssModule.titleRow}>
        <div className={cssModule.title}>{localizedContent.thirdPartyApi}</div>
      </div>
      <div
        className={cssModule.addConfig}
        onClick={(event) => {
          event.stopPropagation();
          thirdPartyApiMutations.addThirdPartyRequest();
        }}
      >
        <PlusOutlined className={cssModule.addIcon} />
        <div className={cssModule.addTitle}>{localizedContent.addConfig}</div>
      </div>
      {coreStore.thirdPartyApiConfigs.length > 0 && (
        <Collapse
          className={cssModule.collapse}
          bordered={false}
          hideArrows={false}
          setContentFontColorToOrangeBecauseHistoryIsCruel
          items={coreStore.thirdPartyApiConfigs.map((thirdPartyRequest) => ({
            key: thirdPartyRequest.id,
            isPanel: true,
            headerComponent: renderThirdPartyHeaderComponent(thirdPartyRequest),
            content: (
              <div className={cssModule.thirdPartyItem}>
                <div className={cssModule.placeholder}>{localizedContent.input}</div>
                {renderThirdPartyItemInput(thirdPartyRequest)}
                <div className={cx(cssModule.placeholder, cssModule.outputPlaceholder)}>
                  {localizedContent.output}
                </div>
                {renderThirdPartyItemOutput(thirdPartyRequest)}
              </div>
            ),
          }))}
        />
      )}
    </div>
  );
});
