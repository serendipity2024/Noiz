/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React from 'react';
import useModel from '../../hooks/useModel';
import { DataBinding } from '../../shared/type-definition/DataBinding';
import { EventBinding } from '../../shared/type-definition/EventBinding';
import { ZColors } from '../../utils/ZConst';
import { CombinedStyleDefaultDataAttributes } from '../side-drawer-tabs/right-drawer/config-row/CombinedStyleConfigRow';
import { MRefProp } from '../mobile-components/PropTypes';
import ZGridLayout from '../../models/interfaces/GridLayout';
import WebCustomViewModel from '../../models/web-components/WebCustomViewModel';
import { ZDroppableWebContainer } from '../../containers/ZDroppableWeb';

export const ZWebCustomViewDefaultReferenceAttributes = {
  clickActions: [] as EventBinding[],
};

export const ZWebCustomViewDefaultDataAttributes = {
  ...CombinedStyleDefaultDataAttributes,
  backgroundColor: DataBinding.withColor(ZColors.TRANSPARENT_LIKE_GREY),
  ...ZWebCustomViewDefaultReferenceAttributes,
};

export type WebCustomViewAttributes = typeof ZWebCustomViewDefaultDataAttributes;

export const ZWebCustomViewDefaultGridLayout: ZGridLayout = {
  x: 0,
  y: 0,
  w: 4,
  h: 3,
};

export default observer(function ZWebWebCustomView(props: MRefProp) {
  const model = useModel<WebCustomViewModel>(props.mRef);
  if (!model) return null;

  return <ZDroppableWebContainer mRef={model.mRef} />;
});
