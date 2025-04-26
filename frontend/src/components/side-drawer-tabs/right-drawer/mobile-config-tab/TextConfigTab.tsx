/* eslint-disable import/no-default-export */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { cloneDeep } from 'lodash';
import { observer } from 'mobx-react';
import React from 'react';
import useLocale from '../../../../hooks/useLocale';
import useModel from '../../../../hooks/useModel';
import { DataBinding } from '../../../../shared/type-definition/DataBinding';
import { HexColor, NullableReactElement } from '../../../../shared/type-definition/ZTypes';
import { MRefProp } from '../../../mobile-components/PropTypes';
import ClickActionConfigRow from '../config-row/ClickActionConfigRow';
import DataBindingConfigRow from '../config-row/DataBindingConfigRow';
import TextStyleConfigRow from '../config-row/TextStyleConfigRow';
import ColorPicker from '../shared/ColorPicker';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import i18n from './CommonConfigTab.i18n.json';
import TextModel from '../../../../models/mobile-components/TextModel';
import ConfigTab from './ConfigTab';
import { TextAttributes } from '../../../mobile-components/ZText';

const TextStyleConfigTab = observer((props: { model: TextModel }) => {
  const { localizedContent: content } = useLocale(i18n);
  const { model } = props;
  const dataAttributes = model.dataAttributes as TextAttributes;
  const bgColor = dataAttributes.backgroundColor;
  const textColor = dataAttributes.color;
  return (
    <>
      <ZConfigRowTitle text={content.label.color} />
      <ColorPicker
        style={styles.colorSelect}
        name={content.label.backgroundColor}
        color={bgColor}
        onChange={(color: HexColor) => {
          model.onUpdateDataAttributes('backgroundColor', DataBinding.withColor(color));
        }}
      />
      <ColorPicker
        style={styles.colorSelect}
        color={textColor}
        name={content.label.textColor}
        onChange={(color: HexColor) => {
          model.onUpdateDataAttributes('color', DataBinding.withColor(color));
        }}
      />
      <TextStyleConfigRow data={model} />
    </>
  );
});

const TextDataConfigTab = observer((props: { model: TextModel }) => {
  const { localizedContent: content } = useLocale(i18n);
  const { model } = props;
  const dataAttributes = model.dataAttributes as TextAttributes;
  const { title } = dataAttributes;
  return (
    <DataBindingConfigRow
      componentModel={model}
      title={content.label.text}
      dataBinding={title}
      onChange={(dataBinding) => {
        model.onUpdateDataAttributes('title', dataBinding);
      }}
    />
  );
});

const TextActionConfigTab = observer((props: { model: TextModel }) => {
  const { localizedContent: content } = useLocale(i18n);
  const { model } = props;
  const dataAttributes = model.dataAttributes as TextAttributes;
  const clickActions = cloneDeep(dataAttributes.clickActions);
  return (
    <>
      <ZConfigRowTitle text={content.label.clickActions} />
      <ClickActionConfigRow
        componentModel={model}
        eventList={clickActions}
        eventListOnChange={(value) => model.onUpdateDataAttributes('clickActions', value)}
      />
    </>
  );
});

export default function TextConfigTab(props: MRefProp): NullableReactElement {
  const model = useModel<TextModel>(props.mRef);
  if (!model) return null;

  return (
    <ConfigTab
      model={model}
      ActionConfigTab={TextActionConfigTab}
      DataConfigTab={TextDataConfigTab}
      StyleConfigTab={TextStyleConfigTab}
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
};
