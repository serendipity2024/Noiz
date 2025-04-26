/* eslint-disable import/no-default-export */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { observer } from 'mobx-react';
import React from 'react';
import useColorBinding from '../../hooks/useColorBinding';
import { AllStores } from '../../mobx/StoreContexts';
import BaseContainerModel from '../../models/base/BaseContainerModel';
import HorizontalListModel from '../../models/mobile-components/HorizontalListModel';
import ZFrame from '../../models/interfaces/Frame';
import { DataBinding } from '../../shared/type-definition/DataBinding';
import { NullableReactElement, ShortId } from '../../shared/type-definition/ZTypes';
import { ZColors } from '../../utils/ZConst';
import { MRefProp } from './PropTypes';
import { Row } from '../../zui';

export const ZHorizontalListDefaultFrame: ZFrame = {
  size: { width: 375, height: 200 },
  position: { x: 0, y: 0 },
};

export const ZHorizontalListDefaultCellFrame: ZFrame = {
  size: { width: 170, height: 200 },
  position: { x: 0, y: 0 },
};

export const ZHorizontalListDefaultDataAttributes = {
  backgroundColor: DataBinding.withColor(ZColors.TRANSPARENT_LIKE_GREY),
  horizontalPadding: 5,
  pagingEnabled: false,
  autoplay: false,
  circular: false,
  indicatorDots: false,
  indicatorColor: DataBinding.withColor(ZColors.BLACK_WITH_OPACITY),
  indicatorActiveColor: DataBinding.withColor(ZColors.BLACK),
};

export type HorizontalListAttributes = typeof ZHorizontalListDefaultDataAttributes;

function ZHorizontalList(props: MRefProp): NullableReactElement {
  const cb = useColorBinding();
  const getModelByMRef = (mRef: ShortId) => AllStores.coreStore.getModel(mRef);
  const model = getModelByMRef(props.mRef) as HorizontalListModel;
  if (!model) return null;
  if (model.childMRefs.length !== 1) {
    throw new Error(`ZHorizontalList cell error， ${JSON.stringify(model)}`);
  }
  const cellModel = getModelByMRef(model.childMRefs[0]) as BaseContainerModel;

  // styles
  const dataAttributes = model.dataAttributes as HorizontalListAttributes;
  const backgroundColor = cb(dataAttributes.backgroundColor);
  const indicatorColor = cb(dataAttributes.indicatorColor);
  const indicatorActiveColor = cb(dataAttributes.indicatorActiveColor);

  const previewCellCount =
    Math.floor(model.getComponentFrame().size.width / cellModel.getComponentFrame().size.width) + 1;

  const renderPreviewCells = () => {
    const previewCells: React.ReactElement[] = [];
    for (let i = 0; i < previewCellCount; i++) {
      previewCells.push(
        <div
          key={`cell-${i}`}
          style={{
            ...styles.cell,
            marginRight: dataAttributes.horizontalPadding,
            ...cellModel.getComponentFrame().size,
          }}
        >
          {cellModel.renderForPreview()}
        </div>
      );
    }
    return (
      <div style={{ ...styles.container, backgroundColor }}>
        {previewCells}
        {dataAttributes.indicatorDots ? renderDotComponent() : null}
      </div>
    );
  };

  const renderDotComponent = () => {
    return (
      <Row align="middle" justify="center" style={styles.dotContainer}>
        <div style={{ ...styles.dot, backgroundColor: indicatorColor }} />
        <div style={{ ...styles.selectedDot, backgroundColor: indicatorActiveColor }} />
        <div style={{ ...styles.dot, backgroundColor: indicatorColor }} />
      </Row>
    );
  };

  return <>{renderPreviewCells()}</>;
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
    flexWrap: 'nowrap',
    overflow: 'hidden',
  },
  cell: {
    position: 'relative',
    overflow: 'hidden',
    flexShrink: 0,
    pointerEvents: 'none',
  },
  dotContainer: {
    position: 'absolute',
    bottom: '5%',
    left: '0px',
    width: '100%',
    textAlign: 'center',
  },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '4px',
  },
  selectedDot: {
    width: '8px',
    height: '8px',
    marginLeft: '5px',
    marginRight: '5px',
    borderRadius: '4px',
  },
};

export default observer(ZHorizontalList);
