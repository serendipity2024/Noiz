/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React from 'react';
import useLocale from '../../../../hooks/useLocale';
import useModel from '../../../../hooks/useModel';
import ScrollViewModel from '../../../../models/mobile-components/ScrollViewModel';
import { DataBinding } from '../../../../shared/type-definition/DataBinding';
import { NullableReactElement } from '../../../../shared/type-definition/ZTypes';
import { MRefProp } from '../../../mobile-components/PropTypes';
import { ScrollViewAttributes } from '../../../mobile-components/ZScrollView';
import ChildComponentsConfigRow from '../config-row/ChildComponentsConfigRow';
import CombinedStyleConfigRow from '../config-row/CombinedStyleConfigRow';
import ColorPicker from '../shared/ColorPicker';
import SwitchRow from '../shared/SwitchRow';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import i18n from './ScrollViewConfigTab.i18n.json';
import commonI18n from './CommonConfigTab.i18n.json';
import ConfigTab from './ConfigTab';
import { Collapse, Empty } from '../../../../zui';
import cssModule from './ScrollViewConfigTab.module.scss';

const ScrollViewStyleConfigTab = observer((props: { model: ScrollViewModel }) => {
  const { localizedContent: content } = useLocale(i18n);
  const { localizedContent: commonContent } = useLocale(commonI18n);
  const { model } = props;
  const dataAttributes = model.dataAttributes as ScrollViewAttributes;

  return (
    <div>
      <ZConfigRowTitle text={commonContent.label.color} />
      <ColorPicker
        key={model.mRef}
        style={styles.colorSelect}
        color={dataAttributes.backgroundColor}
        name={commonContent.label.backgroundColor}
        onChange={(color) => {
          model.onUpdateDataAttributes('backgroundColor', DataBinding.withColor(color));
        }}
      />

      <SwitchRow
        title={content.label.hasScrollX}
        componentModel={model}
        dataAttribute={dataAttributes}
        field="hasScrollX"
        style={styles.checkbox}
      />
      <SwitchRow
        title={content.label.hasScrollY}
        componentModel={model}
        dataAttribute={dataAttributes}
        field="hasScrollY"
        style={styles.checkbox}
      />
      <SwitchRow
        title={content.label.showHorizontalIndicator}
        componentModel={model}
        dataAttribute={dataAttributes}
        field="showHorizontalIndicator"
        style={styles.checkbox}
      />
      <SwitchRow
        title={content.label.showVerticalIndicator}
        componentModel={model}
        dataAttribute={dataAttributes}
        field="showVerticalIndicator"
        style={styles.checkbox}
      />

      <Collapse
        bordered
        setContentFontColorToOrangeBecauseHistoryIsCruel
        className={cssModule.collapse}
        items={[
          {
            title: commonContent.label.components,
            content: <ChildComponentsConfigRow mRef={model.mRef} />,
          },
        ]}
      />

      <CombinedStyleConfigRow data={model} />
    </div>
  );
});

export default observer(function ScrollViewConfigTab(props: MRefProp): NullableReactElement {
  const model = useModel<ScrollViewModel>(props.mRef);
  if (!model) return null;

  return (
    <ConfigTab
      model={model}
      ActionConfigTab={() => <Empty description={false} />}
      DataConfigTab={() => <Empty description={false} />}
      StyleConfigTab={ScrollViewStyleConfigTab}
    />
  );
});

const styles: Record<string, React.CSSProperties> = {
  checkbox: {
    marginTop: '10px',
  },
  checkboxTitle: {
    color: 'white',
  },
  colorSelect: {
    verticalAlign: 'middle',
    color: '#fff',
    width: '100%',
    height: '55px',
    borderRadius: '10px',
    marginBottom: '10px',
  },
};
