import React, { ReactElement, useState } from 'react';
import useLocale from '../../../hooks/useLocale';
import { ThirdPartyData } from '../../../shared/type-definition/ThirdPartyRequest';
import { ZInput, Checkbox, Dropdown } from '../../../zui';
import cssModule from './ThirdPartyApiCreateParamTab.module.scss';
import i18n from './ThirdPartyApiParam.i18n.json';

interface Props {
  parameter: ThirdPartyData;
  content: ReactElement;
  onConfirm: (parameter: ThirdPartyData) => void;
}

export const ThirdPartyApiEditParamTab = (props: Props): ReactElement => {
  const { localizedContent } = useLocale(i18n);
  const { parameter, onConfirm } = props;
  const [paramEditVisible, setParamEditVisible] = useState<boolean>(false);

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
                onChange={(e) => onConfirm({ ...parameter, required: e.target.checked })}
              >
                {localizedContent.required}
              </Checkbox>
            </div>
            <ZInput
              className={cssModule.input}
              key={parameter.name}
              defaultValue={parameter.name}
              bordered={false}
              lightBackground={false}
              onBlur={(result) => onConfirm({ ...parameter, name: result.target.value })}
            />
          </div>
        </div>
      }
    >
      {props.content}
    </Dropdown>
  );
};
