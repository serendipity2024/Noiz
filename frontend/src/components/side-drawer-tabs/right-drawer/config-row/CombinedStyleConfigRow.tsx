/* eslint-disable import/no-default-export */
import React, { ReactElement } from 'react';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import { DataBinding } from '../../../../shared/type-definition/DataBinding';
import { BackgroundDefaultDataAttributes } from './BackgroundConfigRow';
import BorderStyleConfigRow, {
  BorderStyleDefaultDataAttributes,
  prepareBorderStyles,
} from './BorderStyleConfigRow';
import BoxShadowConfigRow, {
  BoxShadowStyleAttributes,
  BoxShadowStyleDefaultDataAttributes,
  prepareBoxShadowStyles,
} from './BoxShadowConfigRow';

interface Props {
  data: BaseComponentModel;
}

export const CombinedStyleDefaultDataAttributes = {
  ...BackgroundDefaultDataAttributes,
  ...BorderStyleDefaultDataAttributes,
  ...BoxShadowStyleDefaultDataAttributes,
  boxShadow: DataBinding.withLiteral(genBoxShadow(BoxShadowStyleDefaultDataAttributes)),
};

export type CombinedStyleAttributes = typeof CombinedStyleDefaultDataAttributes;

export const prepareCombinedStyles = (
  dataAttributes: CombinedStyleAttributes,
  color: (data: DataBinding) => string
): any => {
  const configuredStyle = {
    ...prepareBorderStyles(dataAttributes, color),
    ...prepareBoxShadowStyles(dataAttributes, color),
    boxShadow: genBoxShadow(dataAttributes),
  };
  return configuredStyle;
};

export default function CombinedStyleConfigRow(props: Props): ReactElement {
  return (
    <div>
      <BorderStyleConfigRow data={props.data} />
      <BoxShadowConfigRow data={props.data} />
    </div>
  );
}

function genBoxShadow(dataAttributes: BoxShadowStyleAttributes): string {
  return `${dataAttributes.boxShadowOffsetX.effectiveValue}px\
  ${dataAttributes.boxShadowOffsetY.effectiveValue}px\
  ${dataAttributes.boxShadowBlurRadius.effectiveValue}px\
  ${dataAttributes.boxShadowSpreadRadius.effectiveValue}px\
  ${dataAttributes.boxShadowColor.effectiveValue}`;
}
