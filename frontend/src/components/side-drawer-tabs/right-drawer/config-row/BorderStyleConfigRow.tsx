/* eslint-disable import/no-default-export */
import 'antd/dist/antd.css';
import { observer } from 'mobx-react';
import React, { ReactElement } from 'react';
import useLocale from '../../../../hooks/useLocale';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import { DataBinding } from '../../../../shared/type-definition/DataBinding';
import { DecimalType } from '../../../../shared/type-definition/DataModel';
import { HexColor } from '../../../../shared/type-definition/ZTypes';
import { ZColors, ZThemedColors } from '../../../../utils/ZConst';
import ColorPicker from '../shared/ColorPicker';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import i18n from './BorderStyleConfigRow.i18n.json';
import { Collapse, InputNumber, Row, Select, Slider } from '../../../../zui';
import cssModule from './BorderStyleConfigRow.module.scss';

const { Option } = Select;
const DEFAULT_FONT_SIZE = '14px';

export const BorderStyle = {
  NONE: 'None',
  Solid: 'solid',
} as const;

export const BorderStyleDefaultDataAttributes = {
  borderStyle: DataBinding.withLiteral(BorderStyle.NONE),
  borderColor: DataBinding.withColor(ZColors.WHITE_LIKE_GREY),
  borderRadius: DataBinding.withLiteral(5, DecimalType.FLOAT8),
  borderWidth: DataBinding.withLiteral(0, DecimalType.FLOAT8),
};

export const prepareBorderStyles = (
  dataAttributes: typeof BorderStyleDefaultDataAttributes,
  colorBinding: (data: DataBinding) => string
): React.CSSProperties => {
  return {
    borderRadius: dataAttributes.borderRadius.effectiveValue,
    borderStyle: dataAttributes.borderStyle.effectiveValue,
    borderColor: colorBinding(dataAttributes.borderColor),
    borderWidth: dataAttributes.borderWidth.effectiveValue,
  };
};

export type BorderStyleAttributes = typeof BorderStyleDefaultDataAttributes;

interface Props {
  data: BaseComponentModel;
}

export default observer(function BorderStyleConfigRow(props: Props): ReactElement {
  const { localizedContent: content } = useLocale(i18n);
  const { data } = props;
  const dataAttributes = data.dataAttributes as BorderStyleAttributes;

  const buttonTypeOnChange = (value: string) => {
    data.onUpdateDataAttributes('borderStyle', DataBinding.withLiteral(value));
  };

  const borderColorSelectOnChange = (color: HexColor) => {
    data.onUpdateDataAttributes('borderColor', DataBinding.withColor(color));
  };
  const borderRadiusOnChange = (value: number) => {
    data.onUpdateDataAttributes(
      'borderRadius',
      DataBinding.withLiteral(value as number, DecimalType.FLOAT8)
    );
  };
  const stringBorderRadiusOnChange = (value: any) => {
    const numValue = typeof value === 'number' ? (value as number) : 0;
    borderRadiusOnChange(numValue);
  };
  const borderWidthOnChange = (value: number) => {
    data.onUpdateDataAttributes(
      'borderWidth',
      DataBinding.withLiteral(value as number, DecimalType.FLOAT8)
    );
  };
  const stringBorderWidthOnChange = (value: any) => {
    const numValue = typeof value === 'number' ? (value as number) : 0;
    borderWidthOnChange(numValue);
  };

  const { size } = data.getComponentFrame();
  const maxHeight = (size?.height || 40) / 2;

  return (
    <Collapse
      className={cssModule.borderConfig}
      setContentFontColorToOrangeBecauseHistoryIsCruel
      items={[
        {
          title: content.label.edit,
          content: (
            <div>
              <ColorPicker
                style={styles.colorSelect}
                color={dataAttributes.borderColor}
                name={content.label.color}
                onChange={borderColorSelectOnChange}
              />

              <ZConfigRowTitle text={content.label.style} />
              <Select
                bordered={false}
                value={dataAttributes.borderStyle.effectiveValue}
                size="large"
                style={styles.typeSelect}
                onChange={buttonTypeOnChange}
              >
                {Object.entries(BorderStyle).map(([key, value]) => (
                  <Option key={key} style={styles.titleText} value={value}>
                    {content.style[value]}
                  </Option>
                ))}
              </Select>

              <ZConfigRowTitle text={content.label.width} />
              <Row>
                <Slider
                  min={0}
                  max={Math.round(maxHeight)}
                  style={{ width: '70%', marginRight: '15px' }}
                  onChange={borderWidthOnChange}
                  value={dataAttributes.borderWidth.effectiveValue}
                />
                <InputNumber
                  key={`border-width-${data.mRef}`}
                  min={0}
                  max={maxHeight}
                  style={styles.input}
                  value={dataAttributes.borderWidth.effectiveValue}
                  onChange={stringBorderWidthOnChange}
                />
              </Row>

              <ZConfigRowTitle text={content.label.radius} />
              <Row>
                <Slider
                  min={0}
                  max={Math.round(maxHeight)}
                  style={{ width: '70%', marginRight: '15px' }}
                  onChange={borderRadiusOnChange}
                  value={dataAttributes.borderRadius.effectiveValue}
                />
                <InputNumber
                  key={`border-radius-${data.mRef}`}
                  min={0}
                  max={maxHeight}
                  style={styles.input}
                  value={dataAttributes.borderRadius.effectiveValue}
                  onChange={stringBorderRadiusOnChange}
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
  typeSelect: {
    width: '100%',
    fontSize: DEFAULT_FONT_SIZE,
    background: ZThemedColors.PRIMARY,
    textAlign: 'center',
    borderRadius: '6px',
  },
  iconSelect: {
    width: '100%',
    fontSize: DEFAULT_FONT_SIZE,
    background: ZThemedColors.PRIMARY,
    textAlign: 'center',
  },
  iconOption: { marginRight: '10px' },
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
