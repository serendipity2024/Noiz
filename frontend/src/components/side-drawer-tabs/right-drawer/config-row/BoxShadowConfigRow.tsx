/* eslint-disable import/no-default-export */
import 'antd/dist/antd.css';
import { observer } from 'mobx-react';
import React, { ReactElement } from 'react';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import { DataBinding } from '../../../../shared/type-definition/DataBinding';
import { DecimalType } from '../../../../shared/type-definition/DataModel';
import { HexColor } from '../../../../shared/type-definition/ZTypes';
import { ZColors, ZThemedColors } from '../../../../utils/ZConst';
import ColorPicker from '../shared/ColorPicker';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import { CombinedStyleAttributes } from './CombinedStyleConfigRow';
import i18n from './BoxShadowConfigRow.i18n.json';
import useLocale from '../../../../hooks/useLocale';
import { useMutations } from '../../../../hooks/useMutations';
import { Collapse, InputNumber, Row, Slider } from '../../../../zui';
import useColorBinding from '../../../../hooks/useColorBinding';
import cssModule from './BoxShadowConfigRow.module.scss';

const DEFAULT_FONT_SIZE = '14px';

export const BoxShadowStyleDefaultDataAttributes = {
  boxShadowOffsetX: DataBinding.withLiteral(0, DecimalType.FLOAT8),
  boxShadowOffsetY: DataBinding.withLiteral(0, DecimalType.FLOAT8),
  boxShadowBlurRadius: DataBinding.withLiteral(0, DecimalType.FLOAT8),
  boxShadowSpreadRadius: DataBinding.withLiteral(0, DecimalType.FLOAT8),
  boxShadowColor: DataBinding.withColor(ZColors.BLACK),
};

export type BoxShadowStyleAttributes = typeof BoxShadowStyleDefaultDataAttributes;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const prepareBoxShadowStyles = (
  dataAttributes: typeof BoxShadowStyleDefaultDataAttributes,
  colorBinding: (data: DataBinding) => string
) => {
  return {
    boxShadowOffsetX: dataAttributes.boxShadowOffsetX.effectiveValue,
    boxShadowOffsetY: dataAttributes.boxShadowOffsetY.effectiveValue,
    boxShadowBlurRadius: dataAttributes.boxShadowBlurRadius.effectiveValue,
    boxShadowSpreadRadius: dataAttributes.boxShadowSpreadRadius.effectiveValue,
    boxShadowColor: colorBinding(dataAttributes.boxShadowColor),
  };
};

interface Props {
  data: BaseComponentModel;
}

export default observer(function BoxShadowConfigRow(props: Props): ReactElement {
  const { data } = props;
  const { localizedContent: content } = useLocale(i18n);
  const cb = useColorBinding();
  const { transaction, componentMutations } = useMutations();
  const dataAttributes = data.dataAttributes as CombinedStyleAttributes;

  const updateProperty = (value: DataBinding, property: keyof BoxShadowStyleAttributes) => {
    transaction(() => {
      componentMutations.setDataAttribute(data.mRef, property, value);
      componentMutations.setDataAttribute(
        data.mRef,
        'boxShadow',
        DataBinding.withLiteral(
          `${dataAttributes.boxShadowOffsetX.effectiveValue}px ${
            dataAttributes.boxShadowOffsetY.effectiveValue
          }px ${dataAttributes.boxShadowBlurRadius.effectiveValue}px ${
            dataAttributes.boxShadowSpreadRadius.effectiveValue
          }px ${cb(property === 'boxShadowColor' ? value : dataAttributes.boxShadowColor)}`
        )
      );
    });
  };

  const updateNumericProperty = (value: number, property: keyof BoxShadowStyleAttributes) => {
    updateProperty(DataBinding.withLiteral(value as number, DecimalType.FLOAT8), property);
  };

  const stringUpdateProperty = (value: any, property: keyof BoxShadowStyleAttributes) => {
    const numValue = typeof value === 'number' ? (value as number) : 0;
    updateNumericProperty(numValue, property);
  };

  const updateBoxShadowColor = (color: HexColor) => {
    updateProperty(DataBinding.withColor(color), 'boxShadowColor');
  };

  const { size } = data.getComponentFrame();
  const maxHeight = (size?.height || 40) / 2;
  const minHeight = -maxHeight;

  return (
    <Collapse
      className={cssModule.boxShadowConfig}
      setContentFontColorToOrangeBecauseHistoryIsCruel
      items={[
        {
          title: content.label.edit,
          content: (
            <div>
              <ColorPicker
                style={styles.colorSelect}
                color={dataAttributes.boxShadowColor}
                name={content.label.color}
                onChange={updateBoxShadowColor}
              />
              <ZConfigRowTitle text={content.label.offsetX} />
              <Row>
                <Slider
                  min={Math.round(minHeight)}
                  max={Math.round(maxHeight)}
                  style={{ width: '70%', marginRight: '15px' }}
                  value={dataAttributes.boxShadowOffsetX.effectiveValue}
                  onChange={(value: number) => updateNumericProperty(value, 'boxShadowOffsetX')}
                />
                <InputNumber
                  key={`offsetX-${data.mRef}`}
                  min={minHeight}
                  max={maxHeight}
                  style={styles.input}
                  value={dataAttributes.boxShadowOffsetX.effectiveValue}
                  onChange={(value) => stringUpdateProperty(value, 'boxShadowOffsetX')}
                />
              </Row>

              <ZConfigRowTitle text={content.label.offsetY} />
              <Row>
                <Slider
                  min={Math.round(minHeight)}
                  max={Math.round(maxHeight)}
                  style={{ width: '70%', marginRight: '15px' }}
                  value={dataAttributes.boxShadowOffsetY.effectiveValue}
                  onChange={(value: number) => updateNumericProperty(value, 'boxShadowOffsetY')}
                />
                <InputNumber
                  key={`offsetY-${data.mRef}`}
                  min={minHeight}
                  max={maxHeight}
                  style={styles.input}
                  value={dataAttributes.boxShadowOffsetY.effectiveValue}
                  onChange={(value) => stringUpdateProperty(value, 'boxShadowOffsetY')}
                />
              </Row>

              <ZConfigRowTitle text={content.label.blur} />
              <Row>
                <Slider
                  min={0}
                  max={Math.round(maxHeight)}
                  style={{ width: '70%', marginRight: '15px' }}
                  value={dataAttributes.boxShadowBlurRadius.effectiveValue}
                  onChange={(value: number) => updateNumericProperty(value, 'boxShadowBlurRadius')}
                />
                <InputNumber
                  key={`blur-radius-${data.mRef}`}
                  min={0}
                  max={maxHeight}
                  style={styles.input}
                  value={dataAttributes.boxShadowBlurRadius.effectiveValue}
                  onChange={(value) => stringUpdateProperty(value, 'boxShadowBlurRadius')}
                />
              </Row>

              <ZConfigRowTitle text={content.label.spread} />
              <Row>
                <Slider
                  min={0}
                  max={Math.round(maxHeight / 2)}
                  style={{ width: '70%', marginRight: '15px' }}
                  value={dataAttributes.boxShadowSpreadRadius.effectiveValue}
                  onChange={(value: number) =>
                    updateNumericProperty(value, 'boxShadowSpreadRadius')
                  }
                />
                <InputNumber
                  key={`spread-radius-${data.mRef}`}
                  min={0}
                  max={maxHeight}
                  style={styles.input}
                  value={dataAttributes.boxShadowSpreadRadius.effectiveValue}
                  onChange={(value) => stringUpdateProperty(value, 'boxShadowSpreadRadius')}
                />
              </Row>
            </div>
          ),
        },
      ]}
      bordered
    />
  );
});

const styles: Record<string, React.CSSProperties> = {
  titleText: {
    fontSize: DEFAULT_FONT_SIZE,
  },
  colorSelect: {
    verticalAlign: 'middle',
    color: '#fff',
    width: '100%',
    height: '55px',
    borderRadius: '10px',
    marginBottom: '10px',
  },
  input: {
    width: '20%',
    borderRadius: '6px',
    background: ZThemedColors.PRIMARY,
    color: ZColors.WHITE,
    border: '0px',
  },
};
