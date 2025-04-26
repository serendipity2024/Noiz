/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React, { useState } from 'react';
import useLocale from '../../../../hooks/useLocale';
import ComponentDiff from '../../../../diffs/ComponentDiff';
import useModel from '../../../../hooks/useModel';
import useStores from '../../../../hooks/useStores';
import ConditionalContainerChildModel from '../../../../models/mobile-components/ConditionalContainerChildModel';
import ConditionalContainerModel from '../../../../models/mobile-components/ConditionalContainerModel';
import { DataBinding } from '../../../../shared/type-definition/DataBinding';
import { HexColor, NullableReactElement } from '../../../../shared/type-definition/ZTypes';
import { MRefProp } from '../../../mobile-components/PropTypes';
import { ConditionalContainerAttributes } from '../../../mobile-components/ZConditionalContainer';
import LeftDrawerButton from '../../left-drawer/shared/LeftDrawerButton';
import ChildComponentsConfigRow from '../config-row/ChildComponentsConfigRow';
import CombinedStyleConfigRow from '../config-row/CombinedStyleConfigRow';
import ColorPicker from '../shared/ColorPicker';
import ConfigInput from '../shared/ConfigInput';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import i18n from './ConditionalContainerConfigTab.i18n.json';
import commonI18n from './CommonConfigTab.i18n.json';
import ConfigTab from './ConfigTab';
import { Row, Switch, Empty } from '../../../../zui';

const ConditionalContainerStyleConfigTab = observer(
  (props: { model: ConditionalContainerModel }) => {
    const { localizedContent: commonContent } = useLocale(commonI18n);
    const { model } = props;
    const dataAttributes = model.dataAttributes as ConditionalContainerAttributes;
    const { backgroundColor } = dataAttributes;

    return (
      <>
        <ZConfigRowTitle text={commonContent.label.color} />
        <ColorPicker
          style={styles.colorSelect}
          name={commonContent.label.backgroundColor}
          color={backgroundColor}
          onChange={(color: HexColor) => {
            model.onUpdateDataAttributes('backgroundColor', DataBinding.withColor(color));
          }}
        />
        <CombinedStyleConfigRow data={model} />
      </>
    );
  }
);

const ConditionalContainerDataConfigTab = observer(
  (props: { model: ConditionalContainerModel }) => {
    const { localizedContent: content } = useLocale(i18n);
    const { diffStore } = useStores();
    const [newCaseName, setNewCaseName] = useState('');

    const { model } = props;
    const dataAttributes = model.dataAttributes as ConditionalContainerAttributes;

    const handleAddLogicOnClick = () => {
      const childModel = new ConditionalContainerChildModel(model.mRef, false);
      childModel.componentName = newCaseName;
      diffStore.applyDiff([
        ComponentDiff.buildAddComponentDiff(childModel),
        ComponentDiff.buildUpdateChildMRefsDiff(model.mRef, [childModel.mRef, ...model.childMRefs]),
      ]);
      setNewCaseName('');
    };

    return (
      <>
        <ZConfigRowTitle text={content.label.cases} />
        <ChildComponentsConfigRow mRef={model.mRef} />

        <ZConfigRowTitle text={content.label.addNewCase} />
        <ConfigInput
          value={newCaseName}
          placeholder={content.placeholder.case}
          onValueChange={setNewCaseName}
        />
        <LeftDrawerButton
          type="primary"
          text={content.label.add}
          disabled={!newCaseName}
          handleOnClick={handleAddLogicOnClick}
        />

        <Row justify="space-between" align="middle" style={styles.fixedRow}>
          <ZConfigRowTitle text={content.label.rerun} />
          <Switch
            checked={dataAttributes.rerunConditionOnUpdate}
            onChange={(checked: boolean) => {
              model.onUpdateDataAttributes('rerunConditionOnUpdate', checked);
            }}
          />
        </Row>
      </>
    );
  }
);

export default observer(function ConditionalContainerConfigTab(
  props: MRefProp
): NullableReactElement {
  const model = useModel<ConditionalContainerModel>(props.mRef);

  if (!model) return null;

  return (
    <ConfigTab
      model={model}
      ActionConfigTab={() => <Empty description={false} />}
      DataConfigTab={ConditionalContainerDataConfigTab}
      StyleConfigTab={ConditionalContainerStyleConfigTab}
    />
  );
});

const styles: Record<string, React.CSSProperties> = {
  colorSelect: {
    verticalAlign: 'middle',
    color: '#fff',
    width: '100%',
    height: '55px',
    borderRadius: '10px',
    marginBottom: '10px',
  },
};
