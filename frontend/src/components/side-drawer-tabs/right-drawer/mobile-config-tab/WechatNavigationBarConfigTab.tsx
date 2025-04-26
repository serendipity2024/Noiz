/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React from 'react';
import useColorBinding from '../../../../hooks/useColorBinding';
import useLocale from '../../../../hooks/useLocale';
import useModel from '../../../../hooks/useModel';
import { DataBinding, LiteralBinding } from '../../../../shared/type-definition/DataBinding';
import { HexColor, NullableReactElement } from '../../../../shared/type-definition/ZTypes';
import { MRefProp } from '../../../mobile-components/PropTypes';
import {
  WechatNavigationBarAttributes,
  WechatNavigationBarStyle,
} from '../../../mobile-components/ZWechatNavigationBar';
import DataBindingConfigRow from '../config-row/DataBindingConfigRow';
import ColorPicker from '../shared/ColorPicker';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import i18n from './WechatNavigationBarConfigTab.i18n.json';
import commonI18n from './CommonConfigTab.i18n.json';
import WechatNavigationBarModel from '../../../../models/mobile-components/WechatNavigationBarModel';
import ConfigTab from './ConfigTab';
import { ZThemedBorderRadius, ZThemedColors } from '../../../../utils/ZConst';
import { Select, Empty, message } from '../../../../zui';

const WechatNavigationBarConfigTab = observer((props: { model: WechatNavigationBarModel }) => {
  const { localizedContent: content } = useLocale(i18n);
  const { localizedContent: commonContent } = useLocale(commonI18n);
  const cb = useColorBinding();
  const { model } = props;
  const dataAttributes = model.dataAttributes as WechatNavigationBarAttributes;
  const { backgroundColor } = dataAttributes;
  const textColor = cb(dataAttributes.textColor);

  return (
    <>
      <ZConfigRowTitle text={commonContent.label.color} />
      <ColorPicker
        style={styles.colorSelect}
        color={backgroundColor}
        name={commonContent.label.backgroundColor}
        disableAlpha
        onChange={(color: HexColor) => {
          model.onUpdateDataAttributes('backgroundColor', DataBinding.withColor(color));
        }}
      />

      <ZConfigRowTitle text={commonContent.label.textColor} />
      <Select
        bordered={false}
        value={textColor}
        size="large"
        style={styles.iconSelect}
        onChange={(color: string) => {
          model.onUpdateDataAttributes('textColor', DataBinding.withColor(color));
        }}
      >
        {Object.entries(WechatNavigationBarStyle).map(([styleName, styleValue]) => (
          <Select.Option key={styleValue} value={styleValue} style={styles.titleText}>
            {content.menuButtonColor[styleName as keyof typeof WechatNavigationBarStyle] ??
              styleValue}
          </Select.Option>
        ))}
      </Select>
    </>
  );
});

const hasIllegalCode = (value: string): boolean => {
  return value.includes('!');
};

const NavigationBarDataConfigTab = observer((props: { model: WechatNavigationBarModel }) => {
  const { localizedContent: content } = useLocale(i18n);
  const { model } = props;
  const dataAttributes = model.dataAttributes as WechatNavigationBarAttributes;
  return (
    <DataBindingConfigRow
      title={content.label.title}
      componentModel={model}
      dataBinding={dataAttributes.title}
      displaySelectValueComponent={false}
      onChange={(value: DataBinding) => {
        (value.valueBinding as LiteralBinding[]).map((item) => ({
          ...item,
          value: item.value.toString(),
        }));
        if (hasIllegalCode(value.effectiveValue)) {
          message.error(content.titleChangeMessage);
          return;
        }
        model.onUpdateDataAttributes('title', value);
      }}
    />
  );
});

export default function NavigationBarConfigTab(props: MRefProp): NullableReactElement {
  const model = useModel<WechatNavigationBarModel>(props.mRef);

  if (!model) return null;

  return (
    <ConfigTab
      model={model}
      ActionConfigTab={() => <Empty description={false} />}
      DataConfigTab={NavigationBarDataConfigTab}
      StyleConfigTab={WechatNavigationBarConfigTab}
    />
  );
}

const styles: Record<string, React.CSSProperties> = {
  colorSelect: {
    verticalAlign: 'middle',
    color: '#fff',
    width: '100%',
    height: '55px',
    borderRadius: '10px',
    marginBottom: '15px',
  },
  iconSelect: {
    width: '100%',
    fontSize: '16px',
    background: ZThemedColors.SECONDARY,
    borderRadius: ZThemedBorderRadius.DEFAULT,
    textAlign: 'center',
  },
};
