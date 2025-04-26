/* eslint-disable import/no-default-export */
import { cloneDeep } from 'lodash';
import { observer } from 'mobx-react';
import React from 'react';
import useLocale from '../../../../hooks/useLocale';
import useModel from '../../../../hooks/useModel';
import { DataBinding } from '../../../../shared/type-definition/DataBinding';
import { NullableReactElement } from '../../../../shared/type-definition/ZTypes';
import { ZColors, ZThemedColors } from '../../../../utils/ZConst';
import { MRefProp } from '../../../mobile-components/PropTypes';
import ClickActionConfigRow from '../config-row/ClickActionConfigRow';
import ColorPicker from '../shared/ColorPicker';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import commonI18n from '../mobile-config-tab/CommonConfigTab.i18n.json';
import i18n from './WebCustomViewConfigTab.i18n.json';
import { Empty, Select } from '../../../../zui';

import ConfigTab from '../mobile-config-tab/ConfigTab';
import WebCustomViewModel from '../../../../models/web-components/WebCustomViewModel';
import { WebCustomViewAttributes } from '../../../web-components/ZWebCustomView';
import CombinedStyleConfigRow from '../config-row/CombinedStyleConfigRow';
import { WebContainerCompactType } from '../../../../models/base/BaseWebContainerModel';

const WebCustomViewStyleConfigTab = observer((props: { model: WebCustomViewModel }) => {
  const { localizedContent: commonContent } = useLocale(commonI18n);
  const { localizedContent: content } = useLocale(i18n);
  const { model } = props;
  const dataAttributes = model.dataAttributes as WebCustomViewAttributes;
  const { backgroundColor } = dataAttributes;
  return (
    <>
      <ZConfigRowTitle text={content.compactType} />
      <Select
        bordered={false}
        value={model.compactType}
        size="large"
        style={styles.iconSelect}
        onChange={(value) => model.onUpdateModel('compactType', value)}
      >
        {Object.entries(WebContainerCompactType).map(([key, value]) => (
          <Select.Option key={key} value={value} style={styles.titleText}>
            <label>{value}</label>
          </Select.Option>
        ))}
      </Select>
      <ZConfigRowTitle text={commonContent.label.color} />
      <ColorPicker
        style={styles.colorSelect}
        color={backgroundColor}
        name={commonContent.label.backgroundColor}
        onChange={(value) => {
          model.onUpdateDataAttributes('backgroundColor', DataBinding.withColor(value));
        }}
      />
      <CombinedStyleConfigRow data={model} />
    </>
  );
});

const WebCustomViewActionConfigTab = observer((props: { model: WebCustomViewModel }) => {
  const { localizedContent: commonContent } = useLocale(commonI18n);
  const { model } = props;
  const { dataAttributes } = model;
  const clickActions = cloneDeep(dataAttributes.clickActions);
  return (
    <>
      <ZConfigRowTitle text={commonContent.label.clickActions} />
      <ClickActionConfigRow
        componentModel={model}
        eventList={clickActions}
        eventListOnChange={(value) => model.onUpdateDataAttributes('clickActions', value)}
      />
    </>
  );
});

export default function WebCustomViewConfigTab(props: MRefProp): NullableReactElement {
  const model = useModel<WebCustomViewModel>(props.mRef);
  if (!model) return null;

  return (
    <ConfigTab
      model={model}
      ActionConfigTab={WebCustomViewActionConfigTab}
      DataConfigTab={() => <Empty description={false} />}
      StyleConfigTab={WebCustomViewStyleConfigTab}
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
  iconSelect: {
    width: '100%',
    fontSize: '14px',
    background: ZThemedColors.SECONDARY,
    border: '0px',
    borderRadius: '6px',
    textAlign: 'center',
  },
  titleInput: {
    background: ZThemedColors.SECONDARY,
    borderRadius: '6px',
    border: '0px',
    color: ZColors.WHITE,
    height: '40px',
  },
};
