/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React from 'react';
import GenerateImageActionRow from './GenerateImageActionRow';
import {
  GenerateMiniProgramCodeHandleBinding,
  MiniAppCodeType,
} from '../../../../shared/type-definition/EventBinding';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import i18n from './GenerateImageActionRow.i18n.json';
import useLocale from '../../../../hooks/useLocale';
import useScreenModels from '../../../../hooks/useScreenModels';
import { useConfiguration } from '../../../../hooks/useConfiguration';
import { Select } from '../../../../zui';

interface Props {
  componentModel: BaseComponentModel;
  event: GenerateMiniProgramCodeHandleBinding;
  onEventChange: () => void;
}
export default observer(function GenerateMiniProgramCodeActionRow(props: Props) {
  const { localizedContent: content } = useLocale(i18n);
  const { componentModel, event, onEventChange } = props;
  const screenComponents = useScreenModels();
  const { initialScreenMRef } = useConfiguration();
  return (
    <>
      <ZConfigRowTitle text={content.label.type} />
      <Select
        value={event.codeType}
        onChange={(value) => {
          event.codeType = value;
          if (value === MiniAppCodeType.CUSTOM) {
            event.args = {};
          } else {
            event.args = undefined;
          }
          onEventChange();
        }}
      >
        {Object.values(MiniAppCodeType).map((value) => (
          <Select.Option key={value} value={value}>
            {content.miniAppCodeType[value]}
          </Select.Option>
        ))}
      </Select>
      <ZConfigRowTitle text={content.label.entrance} />
      <Select
        placeholder={content.placeholder.entrance}
        value={initialScreenMRef}
        onChange={(value) => {
          event.pageMRef = value;
          props.onEventChange();
        }}
        disabled
      >
        {screenComponents.map((screenModel) => (
          <Select.Option key={screenModel.mRef} value={screenModel.mRef}>
            {screenModel.componentName}
          </Select.Option>
        ))}
      </Select>
      <GenerateImageActionRow
        componentModel={componentModel}
        event={event}
        onEventChange={onEventChange}
      />
    </>
  );
});
