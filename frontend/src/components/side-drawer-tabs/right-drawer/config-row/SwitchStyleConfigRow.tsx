/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React, { ReactElement } from 'react';
import ComponentDiff from '../../../../diffs/ComponentDiff';
import FrameDiff from '../../../../diffs/FrameDiff';
import useLocale from '../../../../hooks/useLocale';
import { AllStores } from '../../../../mobx/StoreContexts';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import { DataBinding } from '../../../../shared/type-definition/DataBinding';
import {
  DecimalType,
  IntegerType,
  SwitchStyleType,
} from '../../../../shared/type-definition/DataModel';
import { HexColor } from '../../../../shared/type-definition/ZTypes';
import { SwitchInputAttributes } from '../../../mobile-components/ZSwitch';
import ColorPicker from '../shared/ColorPicker';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import i18n from './SwitchStyleConfigRow.i18n.json';
import { Collapse, Slider } from '../../../../zui';
import cssModule from './SwitchStyleConfigRow.module.scss';

interface Props {
  model: BaseComponentModel;
}

export default observer(function SwitchStyleConfigRow(props: Props): ReactElement {
  const { localizedContent: content } = useLocale(i18n);
  const { model } = props;
  const dataAttributes = model.dataAttributes as SwitchInputAttributes;
  const componentFrame = model.getComponentFrame();

  const onSelectedColorChanged = (color: HexColor) => {
    model.onUpdateDataAttributes('selectedColor', DataBinding.withColor(color));
  };

  const onDeselectedColorChanged = (color: HexColor) => {
    model.onUpdateDataAttributes('deselectedColor', DataBinding.withColor(color));
  };

  const onCheckBoxSizeChanged = (value: number) => {
    const diffItems = [
      ComponentDiff.buildUpdateDataAttributesDiff({
        model,
        valueKey: 'size',
        newValue: DataBinding.withLiteral(value as number, IntegerType.INTEGER),
      }),
      ...FrameDiff.buildUpdateComponentFrameDiffs(model, {
        ...componentFrame,
        size: { width: value, height: value },
      }),
    ];
    AllStores.diffStore.applyDiff(diffItems);
  };

  const onSwitchScaleChanged = (value: number) => {
    const scale = value as number;
    const diffItems = [
      ComponentDiff.buildUpdateDataAttributesDiff({
        model,
        valueKey: 'scale',
        newValue: DataBinding.withLiteral(scale, DecimalType.FLOAT8),
      }),
      ...FrameDiff.buildUpdateComponentFrameDiffs(model, {
        ...componentFrame,
        size: { width: 50 * scale, height: 30 * scale },
      }),
    ];
    AllStores.diffStore.applyDiff(diffItems);
  };

  return (
    <Collapse
      className={cssModule.switchStyleConfig}
      setContentFontColorToOrangeBecauseHistoryIsCruel
      defaultOpenIndex={0}
      items={[
        {
          title: content.label.styleSetting,
          content: (
            <>
              {dataAttributes.styleType !== SwitchStyleType.SWITCH ? (
                <>
                  <ZConfigRowTitle text={content.label.size} />
                  <Slider
                    min={10}
                    max={50}
                    style={{ width: '70%', marginRight: '15px' }}
                    onChange={onCheckBoxSizeChanged}
                    value={dataAttributes.size.effectiveValue}
                  />
                  <ZConfigRowTitle text={content.label.deselectedColor} />
                  <ColorPicker
                    style={styles.colorSelect}
                    color={dataAttributes.deselectedColor}
                    name={content.label.deselectedColor}
                    onChange={onDeselectedColorChanged}
                  />
                </>
              ) : (
                <>
                  <ZConfigRowTitle text={content.label.size} />
                  <Slider
                    min={0.2}
                    max={2}
                    step={0.1}
                    style={{ width: '70%', marginRight: '15px' }}
                    onChange={onSwitchScaleChanged}
                    value={dataAttributes.scale.effectiveValue}
                  />
                </>
              )}
              <ZConfigRowTitle text={content.label.selectedColor} />
              <ColorPicker
                style={styles.colorSelect}
                color={dataAttributes.selectedColor}
                name={content.label.selectedColor}
                onChange={onSelectedColorChanged}
              />
            </>
          ),
        },
      ]}
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
