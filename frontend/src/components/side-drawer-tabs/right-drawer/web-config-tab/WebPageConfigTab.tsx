/* eslint-disable import/no-default-export */
import { useObserver } from 'mobx-react';
import React from 'react';
import { DraggableScreenAttributes } from '../../../../containers/ZDraggableBoard';
import useLocale from '../../../../hooks/useLocale';
import useModel from '../../../../hooks/useModel';
import BasicMobileModel from '../../../../models/basic-components/BasicMobileModel';
import { DataBinding } from '../../../../shared/type-definition/DataBinding';
import { NullableReactElement } from '../../../../shared/type-definition/ZTypes';
import { MRefProp } from '../../../mobile-components/PropTypes';
import ScreenDataConfigRow from '../config-row/ScreenDataConfigRow';
import ColorPicker from '../shared/ColorPicker';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import commonI18n from '../mobile-config-tab/CommonConfigTab.i18n.json';

export default function WebPageConfigTab(props: MRefProp): NullableReactElement {
  const { localizedContent: commonContent } = useLocale(commonI18n);

  const model = useModel<BasicMobileModel>(props.mRef);
  const dataAttributes = useObserver(() => model?.dataAttributes as DraggableScreenAttributes);
  const bgColor = useObserver(() => dataAttributes.backgroundColor);

  if (!model) return null;

  return (
    <>
      <ZConfigRowTitle text={commonContent.label.color} />
      <ColorPicker
        style={styles.colorSelect}
        color={bgColor}
        disableAlpha
        name={commonContent.label.backgroundColor}
        onChange={(color) => {
          model.onUpdateDataAttributes('backgroundColor', DataBinding.withColor(color));
        }}
      />
      <ScreenDataConfigRow model={model} />
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  colorSelect: {
    verticalAlign: 'middle',
    color: '#fff',
    width: '100%',
    height: '55px',
    borderRadius: '10px',
    marginBottom: '20px',
  },
};
