import React, { ReactElement, useEffect, useState } from 'react';
import uniqid from 'uniqid';
import useLocale from '../../../hooks/useLocale';
import {
  ParamPosition,
  ThirdPartyData,
  ZDataType,
} from '../../../shared/type-definition/ThirdPartyRequest';
import { ZInput, Select, Checkbox, Dropdown } from '../../../zui';
import cssModule from './ThirdPartyApiCreateParamTab.module.scss';
import i18n from './ThirdPartyApiParam.i18n.json';

interface CreateParameter extends ThirdPartyData {
  position?: ParamPosition;
}

interface Props {
  parameter?: CreateParameter;
  needPosition: boolean;
  content: ReactElement;
  onConfirm: (newParameter: CreateParameter) => void;
}

export const ThirdPartyApiCreateParamTab = (props: Props): ReactElement => {
  const { localizedContent } = useLocale(i18n);
  const [paramEditVisible, setParamEditVisible] = useState<boolean>(false);
  const [parameter, setParameter] = useState<CreateParameter>(getDefaultParameter());

  useEffect(() => {
    if (paramEditVisible) {
      setParameter(getDefaultParameter());
    }
  }, [paramEditVisible]);

  function getDefaultParameter() {
    return (
      props.parameter ?? {
        name: uniqid.process(),
        uniqueId: uniqid.process(),
        type: ZDataType.STRING,
        position: props.needPosition ? ParamPosition.BODY : undefined,
        required: true,
      }
    );
  }

  return (
    <Dropdown
      arrow
      placement="bottomCenter"
      trigger={['click']}
      onVisibleChange={(visible) => setParamEditVisible(visible)}
      visible={paramEditVisible}
      overlay={
        <div className={cssModule.container} onClick={(e) => e.stopPropagation()}>
          <div>
            <div className={cssModule.titleContainer}>
              <div className={cssModule.title}>{localizedContent.parameterName}</div>
              <Checkbox
                className={cssModule.checkbox}
                checked={parameter.required}
                onChange={(e) =>
                  setParameter({
                    ...parameter,
                    required: e.target.checked,
                  })
                }
              >
                {localizedContent.required}
              </Checkbox>
            </div>
            <ZInput
              className={cssModule.input}
              value={parameter.name}
              bordered={false}
              lightBackground={false}
              onChange={(result) =>
                setParameter({
                  ...parameter,
                  name: result.target.value,
                })
              }
            />
            <div className={cssModule.title}>{localizedContent.parameterType}</div>
            <Select
              className={cssModule.select}
              value={parameter.type}
              onSelect={(value) =>
                setParameter({
                  ...parameter,
                  type: value,
                  itemType: value === ZDataType.ARRAY ? ZDataType.STRING : undefined,
                })
              }
            >
              {Object.values(ZDataType)
                .filter((dt) => {
                  if (dt === ZDataType.OBJECT || dt === ZDataType.ARRAY) {
                    return parameter.position ? parameter.position === ParamPosition.BODY : true;
                  }
                  return true;
                })
                .map((dataType) => (
                  <Select.Option key={dataType} value={dataType}>
                    {dataType}
                  </Select.Option>
                ))}
            </Select>
            {parameter.type === ZDataType.ARRAY && (
              <>
                <div className={cssModule.title}>{localizedContent.itemType}</div>
                <Select
                  className={cssModule.select}
                  value={parameter.itemType}
                  onSelect={(value) =>
                    setParameter({
                      ...parameter,
                      itemType: value,
                    })
                  }
                >
                  {Object.values(ZDataType)
                    .filter((dt) => dt !== ZDataType.ARRAY)
                    .map((dataType) => (
                      <Select.Option key={dataType} value={dataType}>
                        {dataType}
                      </Select.Option>
                    ))}
                </Select>
              </>
            )}
            {props.needPosition && (
              <div>
                <div className={cssModule.title}>{localizedContent.position}</div>
                <Select
                  className={cssModule.select}
                  value={parameter.position}
                  onSelect={(value) =>
                    setParameter({
                      ...parameter,
                      position: value,
                    })
                  }
                >
                  {Object.values(ParamPosition)
                    .filter(
                      (pp) =>
                        !(
                          parameter.type === ZDataType.OBJECT || parameter.type === ZDataType.ARRAY
                        ) || pp === ParamPosition.BODY
                    )
                    .map((pp) => (
                      <Select.Option key={pp} value={pp}>
                        {pp}
                      </Select.Option>
                    ))}
                </Select>
              </div>
            )}
          </div>
          <div className={cssModule.buttonContainer}>
            <div className={cssModule.cancelButton} onClick={() => setParamEditVisible(false)}>
              {localizedContent.cancel}
            </div>
            <div
              className={cssModule.submitButton}
              onClick={() => {
                setParamEditVisible(false);
                props.onConfirm(parameter);
              }}
            >
              {localizedContent.confirm}
            </div>
          </div>
        </div>
      }
    >
      {props.content}
    </Dropdown>
  );
};
