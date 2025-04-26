/* eslint-disable import/no-default-export */
import { cloneDeep } from 'lodash';
import { observer } from 'mobx-react';
import React from 'react';
import useLocale from '../../../../hooks/useLocale';
import useModel from '../../../../hooks/useModel';
import iconfontJson from '../../../../shared/assets/iconfont/iconfont.json';
import { DataBinding } from '../../../../shared/type-definition/DataBinding';
import { NullableReactElement } from '../../../../shared/type-definition/ZTypes';
import { MRefProp } from '../../../mobile-components/PropTypes';
import ClickActionConfigRow from '../config-row/ClickActionConfigRow';
import ColorPicker from '../shared/ColorPicker';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import i18n from './IconConfigTab.i18n.json';
import commonI18n from './CommonConfigTab.i18n.json';
import IconModel from '../../../../models/mobile-components/IconModel';
import ConfigTab from './ConfigTab';
import { IconAttributes } from '../../../mobile-components/ZIcon';
import { ZColors, ZThemedColors } from '../../../../utils/ZConst';
import { InputNumber, Select, Empty } from '../../../../zui';

const ZIconFont = React.lazy(() => import('../../../editor/ZIconFont'));

const IconConfigStyleTab = observer((props: { model: IconModel }) => {
  const { localizedContent: content } = useLocale(i18n);
  const { localizedContent: commonContent } = useLocale(commonI18n);
  const { model } = props;
  const dataAttributes = model.dataAttributes as IconAttributes;
  const bgColor = dataAttributes.backgroundColor;
  const iconColor = dataAttributes.color;
  const { icon, fontSize } = dataAttributes;
  const clickActions = cloneDeep(dataAttributes.clickActions ?? []);

  const icons = iconfontJson.glyphs.map((item) => `${iconfontJson.css_prefix_text}${item.name}`);

  return (
    <>
      <ZConfigRowTitle text={commonContent.label.color} />
      <ColorPicker
        style={styles.colorSelect}
        color={bgColor}
        name={commonContent.label.backgroundColor}
        onChange={(color) => {
          model.onUpdateDataAttributes('backgroundColor', DataBinding.withColor(color));
        }}
      />
      <ColorPicker
        style={styles.colorSelect}
        color={iconColor}
        name={content.label.iconColor}
        onChange={(color) => {
          model.onUpdateDataAttributes('color', DataBinding.withColor(color));
        }}
      />

      <ZConfigRowTitle text={content.label.icon} />
      <Select
        bordered={false}
        value={icon}
        size="large"
        style={styles.iconSelect}
        onChange={(value) => {
          model.onUpdateDataAttributes('icon', value);
        }}
      >
        {icons.map((value) => (
          <Select.Option key={value} value={value} style={styles.titleText}>
            <ZIconFont type={value} style={styles.iconFont} />
            <span>{(content.icon as Record<string, any>)[value] ?? value}</span>
          </Select.Option>
        ))}
      </Select>

      <ZConfigRowTitle text={content.label.iconSize} />
      <InputNumber
        min={0}
        style={styles.numberInput}
        value={fontSize}
        onChange={(value) => {
          const numValue = typeof value === 'number' ? (value as number) : 0;
          model.onUpdateDataAttributes('fontSize', numValue);
        }}
      />

      <ZConfigRowTitle text={commonContent.label.clickActions} />
      <ClickActionConfigRow
        componentModel={model}
        eventList={clickActions}
        eventListOnChange={(value) => model.onUpdateDataAttributes('clickActions', value)}
      />
    </>
  );
});

export default function IconConfigTab(props: MRefProp): NullableReactElement {
  const model = useModel<IconModel>(props.mRef);

  if (!model) return null;

  return (
    <ConfigTab
      model={model}
      ActionConfigTab={() => <Empty description={false} />}
      DataConfigTab={() => <Empty description={false} />}
      StyleConfigTab={IconConfigStyleTab}
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
    marginBottom: '10px',
  },
  iconSelect: {
    width: '100%',
    fontSize: '14px',
    background: ZThemedColors.SECONDARY,
    borderRadius: '6px',
    textAlign: 'center',
  },
  numberInput: {
    marginRight: '5px',
    width: '70px',
    height: '30px',
    background: ZThemedColors.SECONDARY,
    borderRadius: '6px',
    border: '0px',
    color: ZColors.WHITE,
  },
  iconFont: {
    marginRight: '10px',
  },
};
