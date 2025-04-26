/* eslint-disable import/no-default-export */
import { useObserver } from 'mobx-react';
import React from 'react';
import useModel from '../../../../hooks/useModel';
import { DataBinding } from '../../../../shared/type-definition/DataBinding';
import { HexColor, NullableReactElement } from '../../../../shared/type-definition/ZTypes';
import { MRefProp } from '../../../mobile-components/PropTypes';
import CombinedStyleConfigRow from '../config-row/CombinedStyleConfigRow';
import { ModalViewAttributes } from '../../../mobile-components/ZModalView';
import ColorPicker from '../shared/ColorPicker';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import ChildComponentsConfigRow from '../config-row/ChildComponentsConfigRow';
import i18n from './ModalViewConfigTab.i18n.json';
import commonI18n from './CommonConfigTab.i18n.json';
import useLocale from '../../../../hooks/useLocale';
import SwitchRow from '../shared/SwitchRow';
import { Collapse } from '../../../../zui';
import cssModule from './ModalViewConfigTab.module.scss';

export default function ModalViewConfigTab(props: MRefProp): NullableReactElement {
  const { localizedContent: commonContent } = useLocale(commonI18n);
  const { localizedContent: content } = useLocale(i18n);
  const model = useModel(props.mRef);
  const parentModel = useObserver(() => model?.parent());
  const parentSize = useObserver(() => parentModel?.getComponentFrame().size);
  const dataAttributes = useObserver(() => model?.dataAttributes as ModalViewAttributes);
  const bgColor = useObserver(() => dataAttributes.backgroundColor);

  if (!model) return null;
  const { position, size } = model.getComponentFrame();
  if (!position || !size || !parentSize) {
    throw new Error(
      `custom view position or size or parentSize cannot be null, ${JSON.stringify(model)}`
    );
  }

  return (
    <div key={model.mRef}>
      <ZConfigRowTitle text={commonContent.label.color} />
      <ColorPicker
        style={styles.colorSelect}
        name={commonContent.label.backgroundColor}
        color={bgColor}
        onChange={(color: HexColor) => {
          dataAttributes.backgroundColor = DataBinding.withColor(color);
        }}
      />
      <SwitchRow
        componentModel={model}
        dataAttribute={dataAttributes}
        field="closeOnClickOverlay"
        title={content.label.closeOnClickOverlay}
      />
      <CombinedStyleConfigRow data={model} />
      <Collapse
        className={cssModule.collapse}
        bordered
        setContentFontColorToOrangeBecauseHistoryIsCruel
        items={[
          {
            title: commonContent.label.components,
            content: <ChildComponentsConfigRow mRef={model.mRef} reverse />,
          },
        ]}
      />
    </div>
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
  checkbox: {
    marginTop: '20px',
  },
  checkboxTitle: {
    color: 'white',
  },
};
