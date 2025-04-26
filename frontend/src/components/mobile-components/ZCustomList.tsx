/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React, { CSSProperties } from 'react';
import useColorBinding from '../../hooks/useColorBinding';
import { useMediaUrl } from '../../hooks/useMediaUrl';
import useModel from '../../hooks/useModel';
import BaseContainerModel from '../../models/base/BaseContainerModel';
import CustomListModel from '../../models/mobile-components/CustomListModel';
import { DataBinding } from '../../shared/type-definition/DataBinding';
import { EventBinding } from '../../shared/type-definition/EventBinding';
import { NullableReactElement } from '../../shared/type-definition/ZTypes';
import { ZColors } from '../../utils/ZConst';
import { getOutterStyle } from '../dnd/ZDroppableArea';
import { getBackgroundStyle } from '../side-drawer-tabs/right-drawer/config-row/BackgroundConfigRow';
import {
  CombinedStyleDefaultDataAttributes,
  prepareCombinedStyles,
} from '../side-drawer-tabs/right-drawer/config-row/CombinedStyleConfigRow';
import { MRefProp } from './PropTypes';
import ZBlankContainer from './ZBlankContainer';

export const ZCustomListDefaultReferenceAttributes = {
  onScrollActions: [] as EventBinding[],
};

export const ZCustomListDefaultDataAttributes = {
  ...CombinedStyleDefaultDataAttributes,
  ...ZCustomListDefaultReferenceAttributes,
  pullDownRefreshEnabled: true,
  loadMoreEnabled: true,
  backgroundColor: DataBinding.withColor(ZColors.TRANSPARENT_LIKE_GREY),
  columnNum: 1,
  horizontalPadding: 5,
  verticalPadding: 5,
};

export type CustomListAttributes = typeof ZCustomListDefaultDataAttributes;

export default observer(function ZCustomList(props: MRefProp): NullableReactElement {
  const cb = useColorBinding();
  const umu = useMediaUrl();
  const model = useModel<CustomListModel>(props.mRef);

  const childMRefs = model?.childMRefs.slice() ?? [];
  const cellModel = useModel<BaseContainerModel>(childMRefs[0] ?? undefined);
  const headerViewModel = useModel<BaseContainerModel>(childMRefs[1] ?? undefined);

  if (!model || !cellModel) return null;

  // styles
  const dataAttributes = model.dataAttributes as CustomListAttributes;
  const backgroundStyles = getBackgroundStyle(model.dataAttributes, cb, umu);
  const configuredStyle = {
    ...prepareCombinedStyles(dataAttributes, cb),
  };
  const { columnNum, verticalPadding, horizontalPadding } = dataAttributes;

  const modelHeight = model.getComponentFrame().size.height;
  const cellHeight = cellModel.getComponentFrame().size.height;
  const previewCellCount = Math.floor(modelHeight / cellHeight) + 1;

  const renderPreviewCells = () => {
    const itemCells: React.ReactElement[] = [];
    for (let j = 0; j < columnNum; j++) {
      itemCells.push(
        <div
          key={`item-${j}`}
          style={{
            position: 'relative',
            marginRight: j === columnNum - 1 ? 0 : horizontalPadding,
            ...cellModel.getComponentFrame().size,
          }}
        >
          <ZBlankContainer mRef={cellModel.mRef} />
        </div>
      );
    }

    const previewCells: React.ReactElement[] = [];
    for (let i = 0; i < previewCellCount; i++) {
      previewCells.push(
        <div
          key={`cell-${i}`}
          style={{
            ...styles.cellRow,
            marginBottom: verticalPadding,
          }}
        >
          {itemCells}
        </div>
      );
    }

    const style: CSSProperties = {
      position: 'relative',
      ...model.getComponentFrame().size,
    };

    return <div style={style}>{previewCells}</div>;
  };

  return (
    <div
      style={{
        ...styles.container,
        ...getOutterStyle(model, backgroundStyles),
        ...configuredStyle,
      }}
    >
      <div style={{ position: 'relative', ...headerViewModel?.getComponentFrame().size }}>
        {headerViewModel?.renderForPreview()}
      </div>
      {renderPreviewCells()}
    </div>
  );
});

const styles: Record<string, React.CSSProperties> = {
  container: {
    overflow: 'hidden',
    height: '100%',
    width: '100%',
  },
  cell: {
    position: 'relative',
    overflow: 'hidden',
  },
  cellComponentContainer: {
    position: 'absolute',
    pointerEvents: 'none',
  },
  cellRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
};
