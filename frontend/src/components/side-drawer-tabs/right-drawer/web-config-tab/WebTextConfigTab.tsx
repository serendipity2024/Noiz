/* eslint-disable import/no-default-export */
import { cloneDeep } from 'lodash';
import { observer } from 'mobx-react';
import React from 'react';
import useLocale from '../../../../hooks/useLocale';
import useModel from '../../../../hooks/useModel';
import { DataBinding } from '../../../../shared/type-definition/DataBinding';
import { NullableReactElement } from '../../../../shared/type-definition/ZTypes';
import { ZColors } from '../../../../utils/ZConst';
import { MRefProp } from '../../../mobile-components/PropTypes';
import ClickActionConfigRow from '../config-row/ClickActionConfigRow';
import ColorPicker from '../shared/ColorPicker';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import i18n from '../mobile-config-tab/CommonConfigTab.i18n.json';
import ConfigTab from '../mobile-config-tab/ConfigTab';
import WebTextModel from '../../../../models/web-components/WebTextModel';
import { WebTextAttributes } from '../../../web-components/ZWebText';
import DataBindingConfigRow from '../config-row/DataBindingConfigRow';
import TextStyleConfigRow from '../config-row/TextStyleConfigRow';
import { Row, Switch } from '../../../../zui';

const WebTextStyleConfigTab = observer((props: { model: WebTextModel }) => {
  const { localizedContent: content } = useLocale(i18n);
  const { model } = props;
  const dataAttributes = model.dataAttributes as WebTextAttributes;
  const { backgroundColor, color } = dataAttributes;
  return (
    <>
      <ZConfigRowTitle text={content.label.color} />
      <ColorPicker
        style={styles.colorSelect}
        color={backgroundColor}
        name={content.label.backgroundColor}
        onChange={(value) => {
          model.onUpdateDataAttributes('backgroundColor', DataBinding.withColor(value));
        }}
      />
      <ColorPicker
        style={styles.colorSelect}
        color={color}
        name={content.label.textColor}
        onChange={(value) => model.onUpdateDataAttributes('color', DataBinding.withColor(value))}
      />

      <Row justify="space-between" align="middle" style={styles.row}>
        <ZConfigRowTitle text="autoSize" />
        <Switch
          checked={model.autoSize}
          onChange={(checked) => {
            model.onUpdateModel('autoSize', checked);
          }}
        />
      </Row>
      <TextStyleConfigRow data={model} />
    </>
  );
});

const WebTextActionConfigTab = observer((props: { model: WebTextModel }) => {
  const { localizedContent: content } = useLocale(i18n);
  const { model } = props;
  const { dataAttributes } = model;
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

const WebTextDataConfigTab = observer((props: { model: WebTextModel }) => {
  const { localizedContent: content } = useLocale(i18n);
  const { model } = props;
  const { dataAttributes } = model;
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

export default function WebTextConfigTab(props: MRefProp): NullableReactElement {
  const model = useModel<WebTextModel>(props.mRef);

  if (!model) return null;

  return (
    <ConfigTab
      model={model}
      ActionConfigTab={WebTextActionConfigTab}
      DataConfigTab={WebTextDataConfigTab}
      StyleConfigTab={WebTextStyleConfigTab}
    />
  );
}

const styles: Record<string, React.CSSProperties> = {
  collapse: {
    background: ZColors.WHITE,
    marginTop: '20px',
  },
  panel: {
    background: ZColors.GREY,
  },
  colorSelect: {
    verticalAlign: 'middle',
    color: '#fff',
    width: '100%',
    height: '55px',
    borderRadius: '10px',
    marginBottom: '10px',
  },
  row: {
    marginTop: '10px',
  },
};
