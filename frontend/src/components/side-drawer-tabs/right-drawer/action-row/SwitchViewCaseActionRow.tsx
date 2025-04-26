/* eslint-disable import/no-default-export */
import { ArrowRightOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react';
import React from 'react';
import useLocale from '../../../../hooks/useLocale';
import useModel from '../../../../hooks/useModel';
import useStores from '../../../../hooks/useStores';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import { SwitchViewCaseHandleBinding } from '../../../../shared/type-definition/EventBinding';
import { NullableReactElement } from '../../../../shared/type-definition/ZTypes';
import { ZColors, ZThemedBorderRadius } from '../../../../utils/ZConst';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import i18n from './SwitchViewCaseActionRow.i18n.json';
import { Select } from '../../../../zui';

const { Option } = Select;

interface Props {
  componentModel: BaseComponentModel;
  event: SwitchViewCaseHandleBinding;
  onEventChange: () => void;
}

export default observer(function SwitchViewCaseActionRow(props: Props): NullableReactElement {
  const { localizedContent: content } = useLocale(i18n);
  const { editorStore } = useStores();
  const event = props.event as SwitchViewCaseHandleBinding;
  const child = useModel(event.target);
  const container = child?.parent();
  if (!container || !child) return null;

  const handleTargetOnClick = (target: BaseComponentModel) => {
    editorStore.selectedTargets = [target.mRef];
  };
  const handleCaseOnSwitch = (value: string) => {
    const newEventValue = container.children().find((e) => e.mRef === value)?.componentName;
    if (!newEventValue) return;

    event.target = value;
    event.value = newEventValue;
    props.onEventChange();
  };

  return (
    <>
      <ZConfigRowTitle text={content.label.self} />
      <div style={styles.rowContainer} onClick={() => handleTargetOnClick(props.componentModel)}>
        <div style={styles.content}>
          <span style={styles.modelMRef}>{props.componentModel.mRef}</span>
        </div>
        <ArrowRightOutlined />
      </div>

      <ZConfigRowTitle text={content.label.conditionalContainer} />
      <div style={styles.rowContainer} onClick={() => handleTargetOnClick(container)}>
        <div style={styles.content}>
          <span style={styles.modelMRef}>{container.mRef}</span>
        </div>
        <ArrowRightOutlined />
      </div>

      <ZConfigRowTitle text={content.label.switchCase} />
      <Select
        key={event.target}
        value={event.target}
        size="middle"
        style={styles.selectContainer}
        onChange={handleCaseOnSwitch}
      >
        {container.children().map((containerChild) => (
          <Option key={containerChild.mRef} style={styles.titleText} value={containerChild.mRef}>
            {containerChild.componentName}
          </Option>
        ))}
      </Select>
    </>
  );
});

const styles: Record<string, React.CSSProperties> = {
  rowContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '15px',
    padding: '10px',
    width: '100%',
    height: '40px',
    backgroundColor: ZColors.WHITE,
    borderRadius: ZThemedBorderRadius.DEFAULT,
    cursor: 'pointer',
  },
  content: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
  },
  modelMRef: {
    fontSize: '14px',
  },
  selectContainer: {
    width: '100%',
    height: '40px',
    borderRadius: ZThemedBorderRadius.DEFAULT,
    cursor: 'pointer',
  },
};
