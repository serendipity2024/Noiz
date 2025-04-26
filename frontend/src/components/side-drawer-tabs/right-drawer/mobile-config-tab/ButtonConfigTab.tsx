/* eslint-disable import/no-default-export */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { observer } from 'mobx-react';
import React from 'react';
import { cloneDeep } from 'lodash';
import useModel from '../../../../hooks/useModel';
import { DataBinding } from '../../../../shared/type-definition/DataBinding';
import { NullableReactElement } from '../../../../shared/type-definition/ZTypes';
import { MRefProp } from '../../../mobile-components/PropTypes';
import ClickActionConfigRow from '../config-row/ClickActionConfigRow';
import DataBindingConfigRow from '../config-row/DataBindingConfigRow';
import TextStyleConfigRow from '../config-row/TextStyleConfigRow';
import ColorPicker from '../shared/ColorPicker';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import CombinedConfigRow from '../config-row/CombinedStyleConfigRow';
import i18n from './CommonConfigTab.i18n.json';
import useLocale from '../../../../hooks/useLocale';
import ButtonModel from '../../../../models/mobile-components/ButtonModel';
import ConfigTab from './ConfigTab';
import { ButtonAttributes } from '../../../mobile-components/ZButton';

const ButtonStyleConfigTab = observer((props: { model: ButtonModel }) => {
  const { localizedContent: content } = useLocale(i18n);
  const { model } = props;
  const dataAttributes = model.dataAttributes as ButtonAttributes;
  const bgColor = dataAttributes.backgroundColor;
  const textColor = dataAttributes.color;
  return (
    <>
      <ZConfigRowTitle text={content.label.color} />
      <ColorPicker
        style={styles.colorSelect}
        color={bgColor}
        name={content.label.backgroundColor}
        onChange={(color) =>
          model.onUpdateDataAttributes('backgroundColor', DataBinding.withColor(color))
        }
      />
      <ColorPicker
        style={styles.colorSelect}
        color={textColor}
        name={content.label.textColor}
        onChange={(color) => model.onUpdateDataAttributes('color', DataBinding.withColor(color))}
      />
      <TextStyleConfigRow data={model} />
      <CombinedConfigRow data={model} />
    </>
  );
});

const ButtonDataConfigTab = observer((props: { model: ButtonModel }) => {
  const { localizedContent: content } = useLocale(i18n);
  const { model } = props;
  const dataAttributes = model.dataAttributes as ButtonAttributes;
  const { title } = dataAttributes;
  return (
    <>
      <DataBindingConfigRow
        key={model.mRef}
        title={content.label.text}
        componentModel={model}
        dataBinding={title}
        onChange={(value) => model.onUpdateDataAttributes('title', value)}
      />
    </>
  );
});

const ButtonActionConfigTab = observer((props: { model: ButtonModel }) => {
  const { localizedContent: content } = useLocale(i18n);
  const { model } = props;
  const dataAttributes = model.dataAttributes as ButtonAttributes;
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

export default function ButtonConfigTab(props: MRefProp): NullableReactElement {
  const model = useModel<ButtonModel>(props.mRef);

  if (!model) return null;

  return (
    <ConfigTab
      model={model}
      ActionConfigTab={ButtonActionConfigTab}
      DataConfigTab={ButtonDataConfigTab}
      StyleConfigTab={ButtonStyleConfigTab}
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
