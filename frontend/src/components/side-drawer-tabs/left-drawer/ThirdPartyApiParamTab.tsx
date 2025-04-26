import { observer } from 'mobx-react';
import React, { ReactElement } from 'react';
import _ from 'lodash';
import cx from 'classnames';
import {
  ThirdPartyData,
  ThirdPartyParameter,
  ZDataType,
} from '../../../shared/type-definition/ThirdPartyRequest';
import cssModule from './ThirdPartyApiParamTab.module.scss';
import deleteSvg from '../../../shared/assets/icons/tp-delete.svg';
import addSvg from '../../../shared/assets/icons/tp-add.svg';
import editSvg from '../../../shared/assets/icons/tp-edit.svg';
import { ThirdPartyApiCreateParamTab } from './ThirdPartyApiCreateParamTab';
import { ThirdPartyApiEditParamTab } from './ThirdPartyApiEditParamTab';
import { TypeSystemHelper } from '../../../utils/TypeSystemHelper';
import { TreeCollapse } from './TreeCollapse';

export type Parameter = ThirdPartyParameter | ThirdPartyData;

interface Props {
  parameters: Parameter[];
  onParametersChange: (parameters: Parameter[]) => void;
}

export const ThirdPartyApiParamTab = observer((props: Props): ReactElement => {
  const parameters = _.cloneDeep(props.parameters ?? []);

  function updateParam(currentParameter: Parameter) {
    props.onParametersChange(
      parameters.map((p) => (currentParameter.uniqueId === p.uniqueId ? currentParameter : p))
    );
  }

  function deleteParam(deleteParameter: Parameter) {
    props.onParametersChange(parameters.filter((p) => deleteParameter.uniqueId !== p.uniqueId));
  }

  function renderParameterTool(thirdPartyParameter: Parameter) {
    const addable =
      thirdPartyParameter.type === ZDataType.OBJECT || thirdPartyParameter.type === ZDataType.ARRAY;
    return (
      <div className={cssModule.collapseHeaderTool} onClick={(e) => e.stopPropagation()}>
        {addable && (
          <ThirdPartyApiCreateParamTab
            needPosition={false}
            content={<img className={cssModule.collapseHeaderIcon} alt="" src={addSvg} />}
            onConfirm={(newChild) => {
              const child = {
                ...newChild,
                zType: TypeSystemHelper.genZType(newChild),
              };
              const newParameter = {
                ...thirdPartyParameter,
                parameters: (thirdPartyParameter.parameters ?? []).concat(child),
              };
              newParameter.zType = TypeSystemHelper.genZType(newParameter);
              updateParam(newParameter);
            }}
          />
        )}
        <ThirdPartyApiEditParamTab
          parameter={thirdPartyParameter}
          content={<img className={cssModule.collapseHeaderIcon} alt="" src={editSvg} />}
          onConfirm={(newParameter) => updateParam(newParameter)}
        />
        <div
          onClick={(e) => {
            e.stopPropagation();
            deleteParam(thirdPartyParameter);
          }}
        >
          <img className={cssModule.collapseHeaderIcon} alt="" src={deleteSvg} />
        </div>
      </div>
    );
  }

  function renderParameterComponent(thirdPartyParameter: Parameter) {
    const expandable =
      (thirdPartyParameter.type === ZDataType.ARRAY &&
        thirdPartyParameter.itemType === ZDataType.OBJECT) ||
      thirdPartyParameter.type === ZDataType.OBJECT;
    return (
      <div
        className={cx(
          cssModule.collapseHeader,
          cssModule.hoverCollapseHeader,
          expandable ? cssModule.expandCollapseHeaderPadding : cssModule.normalCollapseHeaderPadding
        )}
        onClick={(e) => {
          if (!expandable) {
            e.stopPropagation();
          }
        }}
      >
        <div className={cssModule.collapseHeaderContent}>
          <div className={cssModule.typeName}>{thirdPartyParameter.name}</div>
          <div className={cssModule.type}>
            {thirdPartyParameter.itemType
              ? `${thirdPartyParameter.type} (${thirdPartyParameter.itemType})`
              : thirdPartyParameter.type}
          </div>
          {(thirdPartyParameter as ThirdPartyParameter).position && (
            <div className={cssModule.position}>
              {(thirdPartyParameter as ThirdPartyParameter).position}
            </div>
          )}
        </div>
        {renderParameterTool(thirdPartyParameter)}
      </div>
    );
  }

  return (
    <TreeCollapse
      dataSource={parameters.map((item) => {
        return {
          key: item.uniqueId,
          isPanel: (item.itemType ?? item.type) === ZDataType.OBJECT,
          content: (
            <ThirdPartyApiParamTab
              parameters={item.parameters ?? []}
              onParametersChange={(dataList) => {
                const newParameter = {
                  ...item,
                  parameters: dataList,
                };
                newParameter.zType = TypeSystemHelper.genZType(newParameter);
                updateParam(newParameter);
              }}
            />
          ),
          headerComponent: renderParameterComponent(item),
        };
      })}
    />
  );
});
