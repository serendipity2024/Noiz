/* eslint-disable import/no-default-export */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { observer } from 'mobx-react';
import React from 'react';
import useColorBinding from '../../hooks/useColorBinding';
import useModel from '../../hooks/useModel';
import ConditionalContainerModel from '../../models/mobile-components/ConditionalContainerModel';
import ZFrame from '../../models/interfaces/Frame';
import { DataBinding } from '../../shared/type-definition/DataBinding';
import { NullableReactElement, ShortId } from '../../shared/type-definition/ZTypes';
import { ZColors } from '../../utils/ZConst';
import {
  CombinedStyleDefaultDataAttributes,
  prepareCombinedStyles,
} from '../side-drawer-tabs/right-drawer/config-row/CombinedStyleConfigRow';
import { MRefProp } from './PropTypes';

export const ZConditionalContainerDefaultDataAttributes = {
  ...CombinedStyleDefaultDataAttributes,
  backgroundColor: DataBinding.withColor(ZColors.TRANSPARENT_LIKE_GREY),
  rerunConditionOnUpdate: true,
};

export type ConditionalContainerAttributes = typeof ZConditionalContainerDefaultDataAttributes;

export const ZConditionalContainerDefaultFrame: ZFrame = {
  size: { width: 265, height: 150 },
  position: { x: 0, y: 0 },
};

interface Props {
  childPreviewMRef?: ShortId;
}

export default observer(function ZConditionalContainer(
  props: MRefProp & Props
): NullableReactElement {
  const cb = useColorBinding();
  const model = useModel<ConditionalContainerModel>(props.mRef);
  if (!model) return null;

  // styles
  const dataAttributes = model.dataAttributes as ConditionalContainerAttributes;
  const backgroundColor = cb(dataAttributes.backgroundColor);
  const configuredStyle = {
    ...prepareCombinedStyles(dataAttributes, cb),
  };
  const renderChild = () => {
    const modelChildren = model.children();
    if (!props.childPreviewMRef || props.childPreviewMRef === props.mRef)
      // render the default condition as preview
      return modelChildren[0]?.renderForPreview();

    const previewChild = modelChildren.find((m) => m.mRef === props.childPreviewMRef);
    return previewChild ? previewChild.renderForPreview() : null;
  };

  return (
    <div style={{ ...styles.container, ...configuredStyle, backgroundColor }}>{renderChild()}</div>
  );
});

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
};
