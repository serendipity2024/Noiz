/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React from 'react';
import useLocale from '../../../../hooks/useLocale';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import { DataBinding } from '../../../../shared/type-definition/DataBinding';
import { BaseType, IntegerType } from '../../../../shared/type-definition/DataModel';
import { ZColors, ZThemedColors } from '../../../../utils/ZConst';
import ColorPicker from '../shared/ColorPicker';
import { FontWeight, getFontWeightValue } from '../../../../shared/type-definition/ZTypes';
import SharedStyles from './SharedStyles';
import i18n from './TextStyleConfigRow.i18n.json';
import './TextStyleConfigRow.scss';
import cssModule from './TextStyleConfigRow.module.scss';
import { Collapse, InputNumber, Radio, Row, Select, Slider, Switch } from '../../../../zui';

enum TextAlign {
  LEFT = 'left',
  CENTER = 'center',
  RIGHT = 'right',
}

enum FontStyle {
  NORMAL = 'normal',
  ITALIC = 'italic',
  OBLIQUE = 'oblique',
}

enum FontFamily {
  NORMAL = 'normal',
  APPLE_SYSTEM = '-apple-system',
  BLINKMACSYSTEMFONT = 'blinkMacSystemFont',
  OPEN_SANS = 'open sans',
  PINGFANG_SC = `pingFang SC`,
  HELVETICA_NEUE = `helvetica neue`,
  STHEITI = `stheiti`,
  MICROSOFT_YAHEI = `microsoft yahei`,
  TAHOMA = `tahoma`,
  SIMSUN = `simsun`,
  SANS_SERIF = `sans-serif`,
}

enum TextDecorationLine {
  NONE = 'none',
  UNDERLINE = 'underline',
  LINETHROUGH = 'line-through',
}

enum TextDecorationStyle {
  SOLID = 'solid',
  DASHED = 'dashed',
  WAVY = 'wavy',
}

export const TextStyleDefaultDataAttributes = {
  fontSize: DataBinding.withLiteral(16, IntegerType.INTEGER),
  fontWeight: DataBinding.withLiteral(FontWeight.REGULAR),
  fontStyle: DataBinding.withLiteral(FontStyle.NORMAL),
  fontFamily: DataBinding.withLiteral(FontFamily.PINGFANG_SC),
  opacity: DataBinding.withLiteral(100, IntegerType.INTEGER),
  textAlign: DataBinding.withLiteral(TextAlign.LEFT),
  multiLine: DataBinding.withLiteral(false, BaseType.BOOLEAN),
  lineHeight: DataBinding.withLiteral(16, IntegerType.INTEGER),
  textDecorationLine: DataBinding.withLiteral(TextDecorationLine.NONE),
  textDecorationStyle: DataBinding.withLiteral(TextDecorationStyle.SOLID),
  textDecorationColor: DataBinding.withColor('red'),
};

type TextStyleAttributes = typeof TextStyleDefaultDataAttributes;

interface Props {
  data: BaseComponentModel;
}

export const prepareTextStyles = (
  dataAttributes: typeof TextStyleDefaultDataAttributes,
  colorBinding: (data: DataBinding) => string
): React.CSSProperties => {
  const multiLine: boolean = dataAttributes.multiLine.effectiveValue;
  return {
    fontSize: dataAttributes.fontSize.effectiveValue,
    fontWeight: getFontWeightValue(dataAttributes.fontWeight.effectiveValue),
    fontStyle: dataAttributes.fontStyle.effectiveValue,
    fontFamily: dataAttributes.fontFamily.effectiveValue,
    WebkitLineClamp: multiLine ? 100000 : 1,
    opacity: dataAttributes.opacity.effectiveValue / 100,
    textAlign: dataAttributes.textAlign.effectiveValue,
    lineHeight: multiLine ? `${dataAttributes.lineHeight.effectiveValue}px` : undefined,
    textDecorationLine: dataAttributes.textDecorationLine.effectiveValue,
    textDecorationStyle: dataAttributes.textDecorationStyle.effectiveValue,
    textDecorationColor: colorBinding(dataAttributes.textDecorationColor),
  };
};

export default observer(function TextStyleConfigRow(props: Props): React.ReactElement {
  const { localizedContent: content } = useLocale(i18n);
  const { data } = props;
  const dataAttributes = data.dataAttributes as TextStyleAttributes;

  function opacityOnChange(value: number) {
    data.onUpdateDataAttributes('opacity', DataBinding.withLiteral(value, IntegerType.INTEGER));
  }
  function fontSizeOnChange(value: number) {
    data.onUpdateDataAttributes('fontSize', DataBinding.withLiteral(value, IntegerType.INTEGER));
  }
  function lineHeightOnChange(value: number) {
    data.onUpdateDataAttributes('lineHeight', DataBinding.withLiteral(value, IntegerType.INTEGER));
  }

  return (
    <Collapse
      className={cssModule.textStyleConfig}
      defaultOpenIndex={0}
      bordered
      setContentFontColorToOrangeBecauseHistoryIsCruel
      items={[
        {
          title: content.label.styleSetting,
          content: (
            <div>
              <label style={styles.title}>{content.label.size}</label>
              <Row>
                <Slider
                  min={1}
                  max={40}
                  style={styles.slider}
                  value={dataAttributes.fontSize.effectiveValue}
                  onChange={fontSizeOnChange}
                />
                <InputNumber
                  key={`font-${props.data.mRef}`}
                  min={1}
                  max={40}
                  defaultValue={dataAttributes.fontSize?.effectiveValue}
                  value={dataAttributes.fontSize.effectiveValue}
                  style={styles.input}
                  onChange={(value) => {
                    const numValue = typeof value === 'number' ? (value as number) : 0;
                    fontSizeOnChange(numValue);
                  }}
                />
              </Row>

              <label style={styles.title}>{content.label.opacity}</label>
              <Row>
                <Slider
                  min={0}
                  max={100}
                  style={styles.slider}
                  onChange={opacityOnChange}
                  value={dataAttributes.opacity?.effectiveValue}
                />
                <InputNumber
                  key={`opacity-${props.data.mRef}`}
                  min={0}
                  max={100}
                  style={styles.input}
                  value={dataAttributes.opacity?.effectiveValue}
                  onChange={(value) => {
                    const opacity = typeof value === 'number' ? value : 0;
                    opacityOnChange(opacity);
                  }}
                />
              </Row>

              <label style={styles.title}>{content.label.lineHeight}</label>
              <Row>
                <Slider
                  min={0}
                  max={50}
                  style={styles.slider}
                  value={dataAttributes.lineHeight.effectiveValue}
                  onChange={lineHeightOnChange}
                />
                <InputNumber
                  key={`lineHeight-${props.data.mRef}`}
                  min={0}
                  max={50}
                  defaultValue={dataAttributes.lineHeight?.effectiveValue}
                  value={dataAttributes.lineHeight.effectiveValue}
                  style={styles.input}
                  onChange={(value) => {
                    const numValue = typeof value === 'number' ? (value as number) : 0;
                    lineHeightOnChange(numValue);
                  }}
                />
              </Row>

              <Row justify="space-between" align="middle" style={styles.row}>
                <label style={styles.title}>{content.label.weight}</label>
                <Select
                  key={dataAttributes.fontWeight?.effectiveValue}
                  defaultValue={dataAttributes.fontWeight?.effectiveValue}
                  style={{ ...styles.selectInput }}
                  onChange={(value) => {
                    data.onUpdateDataAttributes('fontWeight', DataBinding.withLiteral(value));
                  }}
                >
                  {Object.entries(FontWeight).map(([key, value]) => (
                    <Select.Option key={key} value={value}>
                      {content.weight[value] ?? value}
                    </Select.Option>
                  ))}
                </Select>
              </Row>

              <Row justify="space-between" align="middle" style={styles.row}>
                <label style={styles.title}>{content.label.style}</label>
                <Select
                  key={dataAttributes.fontStyle?.effectiveValue}
                  defaultValue={dataAttributes.fontStyle?.effectiveValue}
                  style={{ ...styles.selectInput }}
                  onChange={(value) => {
                    data.onUpdateDataAttributes('fontStyle', DataBinding.withLiteral(value));
                  }}
                >
                  {Object.entries(FontStyle).map(([key, value]) => (
                    <Select.Option key={key} value={value}>
                      {content.style[value] ?? value}
                    </Select.Option>
                  ))}
                </Select>
              </Row>

              <Row justify="space-between" align="middle" style={styles.row}>
                <label style={styles.title}>{content.label.family}</label>
                <Select
                  key={dataAttributes.fontFamily?.effectiveValue}
                  defaultValue={dataAttributes.fontFamily?.effectiveValue}
                  style={{ ...styles.selectInput }}
                  onChange={(value) => {
                    data.onUpdateDataAttributes('fontFamily', DataBinding.withLiteral(value));
                  }}
                  dropdownMatchSelectWidth={false}
                >
                  {Object.entries(FontFamily).map(([key, value]) => (
                    <Select.Option key={key} value={value}>
                      {value}
                    </Select.Option>
                  ))}
                </Select>
              </Row>

              <ColorPicker
                style={styles.colorSelect}
                color={dataAttributes.textDecorationColor}
                name={content.label.textDecorationColor}
                onChange={(color) => {
                  data.onUpdateDataAttributes('textDecorationColor', DataBinding.withColor(color));
                }}
              />

              <Row justify="space-between" align="middle" style={styles.row}>
                <label style={styles.title}>{content.label.textDecorationLine}</label>
                <Select
                  key={dataAttributes.textDecorationLine.effectiveValue}
                  defaultValue={dataAttributes.textDecorationLine.effectiveValue}
                  style={{ ...styles.selectInput }}
                  onChange={(value) => {
                    data.onUpdateDataAttributes(
                      'textDecorationLine',
                      DataBinding.withLiteral(value)
                    );
                  }}
                >
                  {Object.entries(TextDecorationLine).map(([key, value]) => (
                    <Select.Option key={key} value={value}>
                      {content.decorationLine[value] ?? value}
                    </Select.Option>
                  ))}
                </Select>
              </Row>

              <Row justify="space-between" align="middle" style={styles.row}>
                <label style={styles.title}>{content.label.textDecorationStyle}</label>
                <Select
                  key={dataAttributes.textDecorationStyle.effectiveValue}
                  defaultValue={dataAttributes.textDecorationStyle.effectiveValue}
                  style={{ ...styles.selectInput }}
                  onChange={(value) => {
                    data.onUpdateDataAttributes(
                      'textDecorationStyle',
                      DataBinding.withLiteral(value)
                    );
                  }}
                >
                  {Object.entries(TextDecorationStyle).map(([key, value]) => (
                    <Select.Option key={key} value={value}>
                      {content.decorationStyle[value] ?? value}
                    </Select.Option>
                  ))}
                </Select>
              </Row>

              <Row justify="space-between" align="middle" style={styles.row}>
                <label style={styles.title}>{content.label.multiline}</label>
                <Switch
                  key={dataAttributes.multiLine?.effectiveValue}
                  defaultChecked={dataAttributes.multiLine?.effectiveValue}
                  onChange={(checked) => {
                    data.onUpdateDataAttributes(
                      'multiLine',
                      DataBinding.withLiteral(checked, BaseType.BOOLEAN)
                    );
                  }}
                />
              </Row>

              <Row justify="space-between" align="middle" style={styles.row}>
                <label style={styles.title}>{content.label.alignment}</label>
                <div style={{ marginLeft: '30px' }}>
                  <Radio.Group
                    key={dataAttributes.textAlign?.effectiveValue}
                    defaultValue={dataAttributes.textAlign?.effectiveValue}
                    buttonStyle="solid"
                    size="small"
                    onChange={(e) => {
                      data.onUpdateDataAttributes(
                        'textAlign',
                        DataBinding.withLiteral(e.target.value)
                      );
                    }}
                  >
                    {Object.values(TextAlign).map((value) => (
                      <Radio.Button key={value} value={value}>
                        {content.alignment[value] ?? value}
                      </Radio.Button>
                    ))}
                  </Radio.Group>
                </div>
              </Row>
            </div>
          ),
        },
      ]}
    />
  );
});

const styles: Record<string, React.CSSProperties> = {
  selectInput: {
    width: '40%',
    fontSize: '10px',
    marginLeft: '0px',
    borderRadius: '6px',
    background: '#000000',
  },
  title: {
    ...SharedStyles.configRowTitleText,
    margin: '10px 0 10px 5px',
  },
  fontTitle: {
    position: 'relative',
    top: '-10px',
  },
  slider: {
    width: '65%',
    marginRight: '15px',
    borderRadius: '6px',
  },
  input: {
    width: '25%',
    background: ZThemedColors.PRIMARY,
    borderRadius: '6px',
    border: '0px',
    color: ZColors.WHITE,
  },
  row: {
    marginTop: '10px',
  },
  colorSelect: {
    verticalAlign: 'middle',
    color: '#fff',
    width: '100%',
    height: '55px',
    borderRadius: '10px',
    marginTop: '6px',
    marginBottom: '6px',
  },
};
