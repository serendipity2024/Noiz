/* eslint-disable import/no-default-export */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { observer } from 'mobx-react';
import React from 'react';
import uniqid from 'uniqid';
import useColorBinding from '../../hooks/useColorBinding';
import useModel from '../../hooks/useModel';
import { Field } from '../../shared/type-definition/DataModelRegistry';
import SelectViewModel from '../../models/mobile-components/SelectViewModel';
import ZFrame from '../../models/interfaces/Frame';
import { DataBinding } from '../../shared/type-definition/DataBinding';
import { BaseType, DecimalType } from '../../shared/type-definition/DataModel';
import { EventBinding } from '../../shared/type-definition/EventBinding';
import { NullableReactElement } from '../../shared/type-definition/ZTypes';
import { ZColors } from '../../utils/ZConst';
import {
  CombinedStyleDefaultDataAttributes,
  prepareCombinedStyles,
} from '../side-drawer-tabs/right-drawer/config-row/CombinedStyleConfigRow';
import { MRefProp } from './PropTypes';

export enum SelectViewMode {
  LOCAL = 'LOCAL',
  QUERY = 'QUERY',
}

export interface SelectLocalData {
  key: string;
  value: string;
}

export const ZSelectViewDefaultReferenceAttributes = {
  itemClickActions: [] as EventBinding[],
};

export const ZSelectViewDefaultDataAttributes = {
  ...CombinedStyleDefaultDataAttributes,
  ...ZSelectViewDefaultReferenceAttributes,
  borderRadius: DataBinding.withLiteral(0, DecimalType.FLOAT8),
  backgroundColor: DataBinding.withColor(ZColors.TRANSPARENT_LIKE_GREY),
  normalMRef: '',
  selectedMRef: '',
  sourceType: SelectViewMode.LOCAL,
  localData: [
    { key: uniqid.process(), value: 'selection-1' },
    { key: uniqid.process(), value: 'selection-2' },
    { key: uniqid.process(), value: 'selection-3' },
  ],
  isShowMultiLine: false,
  deselectable: false,
  multiple: false,
  treatEmptyAsAll: true,
  keepChoiceOnRefresh: undefined as boolean | undefined,

  // 多选时defaultValue的type是array,valueBinding是一个数组
  defaultValue: DataBinding.withSingleValue(BaseType.TEXT),
  displayDataField: undefined as Field | undefined,
};

export type SelectViewAttributes = typeof ZSelectViewDefaultDataAttributes;

export const ZSelectViewDefaultFrame: ZFrame = {
  size: { width: 265, height: 50 },
  position: { x: 0, y: 0 },
};

export default observer(function ZSelectView(props: MRefProp): NullableReactElement {
  const cb = useColorBinding();
  const model = useModel<SelectViewModel>(props.mRef);
  const normalModel = useModel(model?.dataAttributes?.normalMRef ?? '');
  const selectedModel = useModel(model?.dataAttributes?.selectedMRef ?? '');
  if (!model || !normalModel || !selectedModel) return null;

  // styles
  const dataAttributes = model.dataAttributes as SelectViewAttributes;
  const configuredStyle = {
    ...prepareCombinedStyles(dataAttributes, cb),
  };
  const backgroundColor = cb(dataAttributes.backgroundColor);

  return (
    <div
      style={{
        ...styles.container,
        ...configuredStyle,
        backgroundColor,
        flexWrap: dataAttributes.isShowMultiLine ? 'wrap' : 'nowrap',
      }}
    >
      {dataAttributes.localData.map((item, index) => {
        const childModel = index === 0 ? selectedModel : normalModel;
        const style = { ...childModel.getComponentFrame().size };
        return (
          <div key={item.key} style={{ ...styles.item, ...style }}>
            {childModel.renderForPreview()}
          </div>
        );
      })}
    </div>
  );
});

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
    overflow: 'hidden',
  },
  item: {
    overflow: 'hidden',
    flexShrink: 0,
    pointerEvents: 'none',
    position: 'relative',
  },
};
