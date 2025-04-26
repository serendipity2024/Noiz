/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React from 'react';
import { cloneDeep } from 'lodash';
import useLocale from '../../../../hooks/useLocale';
import ComponentDiff from '../../../../diffs/ComponentDiff';
import FrameDiff from '../../../../diffs/FrameDiff';
import useModel from '../../../../hooks/useModel';
import ZFrame from '../../../../models/interfaces/Frame';
import ImgRoundStyle from '../../../../shared/assets/editor/drawer-options/switch-round-style.svg';
import ImgSwitchStyle from '../../../../shared/assets/editor/drawer-options/switch-style.svg';
import ImgTickStyle from '../../../../shared/assets/editor/drawer-options/switch-tick-style.svg';
import { SwitchStyleType } from '../../../../shared/type-definition/DataModel';
import { NullableReactElement } from '../../../../shared/type-definition/ZTypes';
import { MRefProp } from '../../../mobile-components/PropTypes';
import { SwitchInputAttributes } from '../../../mobile-components/ZSwitch';
import SwitchStyleConfigRow from '../config-row/SwitchStyleConfigRow';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import i18n from './SwitchConfigTab.i18n.json';
import SwitchModel from '../../../../models/mobile-components/SwitchModel';
import ConfigTab from './ConfigTab';
import ClickActionConfigRow from '../config-row/ClickActionConfigRow';
import DataBindingConfigRow from '../config-row/DataBindingConfigRow';
import useStores from '../../../../hooks/useStores';

const SwitchStyleConfigTab = observer((props: { model: SwitchModel }) => {
  const { localizedContent: content } = useLocale(i18n);
  const { diffStore } = useStores();
  const { model } = props;
  const componentFrame = model.getComponentFrame();
  const dataAttributes = model.dataAttributes as SwitchInputAttributes;
  const size = dataAttributes.size.effectiveValue;
  const scale = dataAttributes.scale.effectiveValue;
  const onSwitchStyleChange = (type: SwitchStyleType) => {
    let frame;
    switch (type) {
      case SwitchStyleType.ROUND_CHECKBOX:
      case SwitchStyleType.TICK_CHECKBOX:
        frame = {
          ...componentFrame,
          size: { width: size, height: size },
        } as ZFrame;
        break;
      case SwitchStyleType.SWITCH:
        frame = {
          ...componentFrame,
          size: { width: 50 * scale, height: 30 * scale },
        } as ZFrame;
        break;
      default:
        throw new Error(`unsupported switch style type: ${type}`);
    }
    const diffItems = [
      ComponentDiff.buildUpdateDataAttributesDiff({
        model,
        valueKey: 'styleType',
        newValue: type,
      }),
      ...FrameDiff.buildUpdateComponentFrameDiffs(model, frame),
    ];
    diffStore.applyDiff(diffItems);
  };

  const isSwitchStyle = (type: SwitchStyleType) => {
    return type === SwitchStyleType.SWITCH;
  };

  const isTickStyle = (type: SwitchStyleType) => {
    return type === SwitchStyleType.TICK_CHECKBOX;
  };

  const isRoundStyle = (type: SwitchStyleType) => {
    return type === SwitchStyleType.ROUND_CHECKBOX;
  };

  const selectedSwitchStyle = isSwitchStyle(dataAttributes.styleType)
    ? { ...styles.divSelectedStyle }
    : {};
  const selectedTickCheckboxStyle = isTickStyle(dataAttributes.styleType)
    ? { ...styles.divSelectedStyle }
    : {};
  const selectedRoundCheckboxStyle = isRoundStyle(dataAttributes.styleType)
    ? { ...styles.divSelectedStyle }
    : {};

  return (
    <>
      <ZConfigRowTitle text={content.label.switchStyle} />
      <div style={styles.switchStyle}>
        <div
          key={SwitchStyleType.SWITCH}
          style={{
            ...styles.switchTypeStyle,
            ...selectedSwitchStyle,
            backgroundImage: `url(${ImgSwitchStyle})`,
          }}
          onClick={() => onSwitchStyleChange(SwitchStyleType.SWITCH)}
        >
          <div
            style={{
              ...(isSwitchStyle(dataAttributes.styleType) ? styles.frontDiv : {}),
            }}
          />
        </div>
        <div
          key={SwitchStyleType.TICK_CHECKBOX}
          style={{
            ...styles.switchTypeStyle,
            ...selectedTickCheckboxStyle,
            backgroundImage: `url(${ImgTickStyle})`,
          }}
          onClick={() => onSwitchStyleChange(SwitchStyleType.TICK_CHECKBOX)}
        >
          <div
            style={{
              ...(isTickStyle(dataAttributes.styleType) ? styles.frontDiv : {}),
            }}
          />
        </div>
        <div
          key={SwitchStyleType.ROUND_CHECKBOX}
          style={{
            ...styles.switchTypeStyle,
            ...selectedRoundCheckboxStyle,
            backgroundImage: `url(${ImgRoundStyle})`,
          }}
          onClick={() => onSwitchStyleChange(SwitchStyleType.ROUND_CHECKBOX)}
        >
          <div
            style={{
              ...(isRoundStyle(dataAttributes.styleType) ? styles.frontDiv : {}),
            }}
          />
        </div>
      </div>
      <SwitchStyleConfigRow model={model} />
    </>
  );
});

const SwitchActionConfigTab = observer((props: { model: SwitchModel }) => {
  const { model } = props;
  const dataAttributes = model.dataAttributes as SwitchInputAttributes;
  return (
    <ClickActionConfigRow
      componentModel={model}
      eventList={cloneDeep(dataAttributes.onChangeActions)}
      eventListOnChange={(eventList) => model.onUpdateDataAttributes('onChangeActions', eventList)}
    />
  );
});

const SwitchDataConfigTab = observer((props: { model: SwitchModel }) => {
  const { model } = props;
  const dataAttributes = model.dataAttributes as SwitchInputAttributes;
  return (
    <>
      <DataBindingConfigRow
        key={model.mRef}
        title="selected"
        componentModel={model}
        dataBinding={dataAttributes.selected}
        onChange={(value) => model.onUpdateDataAttributes('selected', value)}
      />
    </>
  );
});

export default observer(function SwitchConfigTab(props: MRefProp): NullableReactElement {
  const model = useModel<SwitchModel>(props.mRef);
  if (!model) return null;

  return (
    <ConfigTab
      model={model}
      ActionConfigTab={SwitchActionConfigTab}
      DataConfigTab={SwitchDataConfigTab}
      StyleConfigTab={SwitchStyleConfigTab}
    />
  );
});

const styles: Record<string, React.CSSProperties> = {
  switchStyle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchTypeStyle: {
    height: '53px',
    width: '75px',
    backgroundRepeat: 'no-repeat',
    borderRadius: '4px',
  },
  divSelectedStyle: {
    border: '2px solid #FF9A2E',
    borderRadius: '4px',
    outlineColor: 'red',
  },
  frontDiv: {
    position: 'absolute',
    width: '74px',
    height: '52px',
    backgroundColor: '#FF9A2E',
    borderRadius: '4px',
    opacity: '0.1',
  },
  row: {
    marginTop: '10px',
  },
};
