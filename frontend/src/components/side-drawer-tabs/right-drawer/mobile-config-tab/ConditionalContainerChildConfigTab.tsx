/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React from 'react';
import { cloneDeep } from 'lodash';
import useLocale from '../../../../hooks/useLocale';
import useModel from '../../../../hooks/useModel';
import ConditionalContainerChildModel from '../../../../models/mobile-components/ConditionalContainerChildModel';
import { NullableReactElement } from '../../../../shared/type-definition/ZTypes';
import { MRefProp } from '../../../mobile-components/PropTypes';
import ChildComponentsConfigRow from '../config-row/ChildComponentsConfigRow';
import ConditionModalConfigRow from '../config-row/ConditionModalConfigRow';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import i18n from './CommonConfigTab.i18n.json';
import ClickActionConfigRow from '../config-row/ClickActionConfigRow';
import { ConditionalContainerChildAttributes } from '../../../mobile-components/ZConditionalContainerChild';
import ConfigTab from './ConfigTab';

const ConditionalContainerChildStyleConfigTab = observer(
  (props: { model: ConditionalContainerChildModel }) => {
    const { localizedContent: content } = useLocale(i18n);
    const { model } = props;

    return (
      <>
        <ZConfigRowTitle text={content.label.components} />
        <ChildComponentsConfigRow mRef={model.mRef} />
      </>
    );
  }
);

const ConditionalContainerChildDataConfigTab = observer(
  (props: { model: ConditionalContainerChildModel }) => {
    const { model } = props;
    return (
      <>
        <ConditionModalConfigRow
          componentModel={model}
          condition={model.initIfCondition}
          onChange={(newCondition) => {
            model.onUpdateModel('initIfCondition', newCondition);
          }}
        />
      </>
    );
  }
);

const ConditionalContainerChildActionConfigTab = observer(
  (props: { model: ConditionalContainerChildModel }) => {
    const { localizedContent: content } = useLocale(i18n);
    const { model } = props;
    const dataAttributes = model.dataAttributes as ConditionalContainerChildAttributes;
    return (
      <>
        <ZConfigRowTitle text={content.label.clickActions} />
        <ClickActionConfigRow
          componentModel={model}
          eventList={cloneDeep(dataAttributes.clickActions ?? [])}
          eventListOnChange={(value) => model.onUpdateDataAttributes('clickActions', value)}
        />
      </>
    );
  }
);

export default observer(function ConditionalContainerChildConfigTab(
  props: MRefProp
): NullableReactElement {
  const model = useModel<ConditionalContainerChildModel>(props.mRef);
  if (!model) return null;

  return (
    <ConfigTab
      model={model}
      ActionConfigTab={ConditionalContainerChildActionConfigTab}
      DataConfigTab={ConditionalContainerChildDataConfigTab}
      StyleConfigTab={ConditionalContainerChildStyleConfigTab}
    />
  );
});
