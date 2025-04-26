/* eslint-disable import/no-default-export */
import { DownOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import { useObserver } from 'mobx-react';
import React, { ReactElement, useState } from 'react';
import { ColorResult, SketchPicker } from 'react-color';
import _ from 'lodash';
import useColorBinding from '../../../../hooks/useColorBinding';
import useStores from '../../../../hooks/useStores';
import { DataBinding, THEME_COLOR_PREFIX } from '../../../../shared/type-definition/DataBinding';
import { HexColor } from '../../../../shared/type-definition/ZTypes';
import { ZColors, ZThemedBorderRadius } from '../../../../utils/ZConst';
import { getThemeColor } from '../../left-drawer/ThemeTab';
import { Button, Col, Popover, Row } from '../../../../zui';

interface Props {
  color: HexColor | DataBinding;
  onChange: (value: any) => void;

  name?: string;
  style?: React.CSSProperties;
  textStyle?: React.CSSProperties;
  backgroundColor?: HexColor;
  arrowIcon?: ReactElement;
  disableThemeColors?: boolean;
  disableAlpha?: boolean;
}

export default function ColorPicker(props: Props): ReactElement {
  const [showPicker, setShowPicker] = useState(false);
  const cb = useColorBinding();
  const { coreStore } = useStores();
  const theme = useObserver(() => coreStore.colorTheme);

  const { themeColorList } = getThemeColor(theme);
  const themeColorBlocks = themeColorList.map((key: string, index: number) => ({
    title: `#${index}`,
    color: (theme as any)[key],
    target: `${THEME_COLOR_PREFIX}${key}`,
  }));

  const color = typeof props.color === 'string' ? props.color : cb(props.color);
  const textColor = invertColor(color);
  const disableAlpha: boolean = props.disableAlpha ?? false;

  const handleClick = () => setShowPicker(!showPicker);
  const handleColorChange = (value: ColorResult) => {
    const target = disableAlpha
      ? value.hex
      : `rgba(${value.rgb.r},${value.rgb.g},${value.rgb.b},${value.rgb.a ?? 1.0})`;
    if (target !== color) {
      props.onChange(target);
    }
  };
  const renderThemeColors = () => {
    if (props.disableThemeColors) return null;

    return (
      <div style={styles.themeColorPickerContainer}>
        {themeColorBlocks.map((data) => (
          <div
            key={data.title}
            style={{ backgroundColor: data.color, ...styles.themeColorBlock }}
            onClick={() => props.onChange(data.target)}
          >
            <p style={{ color: invertColor(data.color), ...styles.themeColorTitle }}>
              {data.title}
            </p>
          </div>
        ))}
      </div>
    );
  };
  const renderPicker = () => {
    return (
      <div style={styles.pickerContainer}>
        <div onClick={handleClick} style={styles.shade} />
        <div style={styles.sketchPickerContainer}>
          <SketchPicker color={color} disableAlpha={disableAlpha} onChange={handleColorChange} />
          {renderThemeColors()}
        </div>
      </div>
    );
  };

  const buttonStyle = {
    ...styles.container,
    ...props.style,
    background: props.backgroundColor ?? color,
  };

  return (
    <Popover content={renderPicker} trigger="click" placement="bottom">
      <Button style={buttonStyle}>
        <Row justify="space-between" align="middle">
          <Col>
            <p style={{ color: textColor, ...styles.text, ...props.textStyle }}>{props.name}</p>
            <p
              style={{
                color: textColor,
                ...styles.text,
                ...props.textStyle,
              }}
            >
              {color}
            </p>
          </Col>
          {props.arrowIcon ?? <DownOutlined />}
        </Row>
      </Button>
    </Popover>
  );
}

function invertColor(color: string): string {
  if (!color) return ZColors.WHITE;

  const input = color.startsWith('#')
    ? color.replace('#', '').substr(0, 6)
    : _(Array.from(color.matchAll(/\d+/g)))
        .take(3)
        .map((array) => parseInt(array[0], 10).toString(16).padStart(2, '0'))
        .join('');
  // eslint-disable-next-line no-bitwise
  const output = (~parseInt(input, 16) >>> 0).toString(16).substring(8 - input.length);
  return `#${output}`;
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    border: '1px solid #555555',
    borderRadius: ZThemedBorderRadius.DEFAULT,
  },
  shade: {
    position: 'absolute',
    zIndex: 10,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  text: {
    margin: 0,
    textAlign: 'justify',
  },
  pickerContainer: {
    transform: 'translate(120px, -12px)',
  },
  sketchPickerContainer: {
    display: 'flex',
    flexDirection: 'row',
    position: 'absolute',
    right: 10,
    zIndex: 20,
  },
  themeColorPickerContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  themeColorBlock: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '50px',
    height: '50px',
    cursor: 'pointer',
  },
  themeColorTitle: {
    margin: 0,
  },
};
