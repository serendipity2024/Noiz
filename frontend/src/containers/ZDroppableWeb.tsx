/* eslint-disable import/order */
import { observer } from 'mobx-react';
import React from 'react';
import GridLayout, { Layout } from 'react-grid-layout';
import { NullableReactElement, ShortId } from '../shared/type-definition/ZTypes';
import '../../node_modules/react-grid-layout/css/styles.css';
import '../../node_modules/react-resizable/css/styles.css';
import { ConnectDropTarget, DropTarget, DropTargetConnector, DropTargetMonitor } from 'react-dnd';
import { ComponentModelType } from '../shared/type-definition/ComponentModelType';
import ZDndType from '../components/dnd/ZDndTypes';
import useModel from '../hooks/useModel';
import { AllStores } from '../mobx/StoreContexts';
import BasicWebModel from '../models/basic-components/BasicWebModel';
import ComponentModelBuilder from '../models/ComponentModelBuilder';
import BaseMobileComponentModel from '../models/base/BaseMobileComponentModel';
import ComponentDiff from '../diffs/ComponentDiff';
import { UserFlow, useSelectionTrigger } from '../hooks/useUserFlowTrigger';
import FrameDiff from '../diffs/FrameDiff';
import StoreHelpers from '../mobx/StoreHelpers';
import { isDefined } from '../utils/utils';
import { ZThemedColors } from '../utils/ZConst';
import useColorBinding from '../hooks/useColorBinding';
import useGridLayoutConfig from '../hooks/useGridLayoutConfig';
import BaseWebContainerModel from '../models/base/BaseWebContainerModel';

const DELIMITER = '!--!';

export interface DroppableWebProps {
  isPage: boolean;
  model: BaseWebContainerModel;
  backgroundColor: string;
  columnCount: number;
  rowHeight: number;
  gridLayoutWidth: number;
  gridLayoutHeight: number;
}

export interface DroppableWebDndProps extends DroppableWebProps {
  onClickItem: (mRef: ShortId) => void;
  onDoubleClickItem: (mRef: ShortId) => void;
  onClickContainer: () => void;
  onChangeLayout: (layouts: Layout[]) => void;

  canDrop: boolean;
  isOver: boolean;
  connectDropTarget: ConnectDropTarget;
}

@observer
class ZDroppableWebInner extends React.Component<DroppableWebDndProps> {
  addComponent(componentType: ComponentModelType) {
    const parent = this.props.model;
    const newComponent = ComponentModelBuilder.buildByType(
      parent.mRef,
      componentType
    ) as BaseMobileComponentModel;
    const diffItems = [
      ComponentDiff.buildAddChildMRefsDiff(parent.mRef, [newComponent.mRef]),
      ...newComponent.onCreateComponentDiffs(),
    ];
    AllStores.diffStore.applyDiff(diffItems);
  }

  render() {
    const {
      isPage,
      model,
      backgroundColor,
      columnCount,
      rowHeight,
      gridLayoutWidth,
      gridLayoutHeight,
      onClickItem,
      onDoubleClickItem,
      onClickContainer,
      onChangeLayout,
    } = this.props;
    const { canDrop, isOver, connectDropTarget } = this.props;
    const isActive = canDrop && isOver;
    let dndBackgroundColor = 'transparent';
    if (isActive) {
      dndBackgroundColor = 'darkgreen';
    } else if (canDrop) {
      dndBackgroundColor = 'darkkhaki';
    }
    const items = model.children();
    const enabled = AllStores.editorStore.editorState.target === model.mRef;
    const gridLayoutHeightStyle = isPage
      ? {
          minHeight: gridLayoutHeight,
        }
      : {
          height: gridLayoutHeight,
        };
    return (
      <div
        ref={connectDropTarget}
        style={{
          ...styles.container,
          backgroundColor,
        }}
        onClick={() => {
          if (enabled) {
            onClickContainer();
          }
        }}
      >
        <GridLayout
          isDraggable={enabled}
          isResizable={enabled}
          isBounded={!isPage}
          maxRows={isPage ? undefined : model.gridLayout?.h}
          margin={[0, 0]}
          compactType={model.compactType}
          cols={columnCount}
          rowHeight={rowHeight}
          width={gridLayoutWidth}
          transformScale={AllStores.editorStore.scale}
          style={{
            ...styles.gridContainer,
            backgroundColor: dndBackgroundColor,
            width: gridLayoutWidth,
            ...gridLayoutHeightStyle,
          }}
          onDragStop={(layouts: Layout[]) => onChangeLayout(layouts)}
          onResizeStop={(layouts: Layout[]) => onChangeLayout(layouts)}
        >
          {items.map((item) => {
            const isSelected = AllStores.editorStore.selectedTargets.includes(item.mRef);
            return (
              <div
                key={`${item.mRef}${DELIMITER}${JSON.stringify(item.gridLayout)}`}
                data-grid={{
                  ...item.gridLayout,
                }}
                onClick={(event) => {
                  if (enabled) {
                    event.stopPropagation();
                    onClickItem(item.mRef);
                  }
                }}
                onDoubleClick={(event) => {
                  if (enabled && item.hasFocusMode()) {
                    event.stopPropagation();
                    onDoubleClickItem(item.mRef);
                  }
                }}
              >
                <div style={isSelected ? styles.selectionWrapper : {}} />
                {item.renderForPreview()}
              </div>
            );
          })}
        </GridLayout>
      </div>
    );
  }
}

const ConnectedZDroppableWebInner = DropTarget(
  () => [ZDndType.CONTENT, ZDndType.LIST_CONTAINER],
  {
    drop: (props, monitor: DropTargetMonitor, component: any) => {
      if (!component) {
        return;
      }
      const { componentType } = monitor.getItem();
      component.addComponent(componentType);
    },
  },
  (dropTargetConnector: DropTargetConnector, monitor: DropTargetMonitor) => ({
    connectDropTarget: dropTargetConnector.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
  })
)(ZDroppableWebInner);

function ZDroppableWebArea(props: DroppableWebProps): NullableReactElement {
  const {
    isPage,
    model,
    backgroundColor,
    columnCount,
    rowHeight,
    gridLayoutWidth,
    gridLayoutHeight,
  } = props;
  const uft = useSelectionTrigger();

  return (
    <ConnectedZDroppableWebInner
      model={model}
      backgroundColor={backgroundColor}
      isPage={isPage}
      columnCount={columnCount}
      rowHeight={rowHeight}
      gridLayoutWidth={gridLayoutWidth}
      gridLayoutHeight={gridLayoutHeight}
      onClickContainer={() => {
        uft(UserFlow.SELECT_TARGET)(model.mRef);
      }}
      onClickItem={(mRef: ShortId) => {
        uft(UserFlow.SELECT_TARGET)(mRef);
      }}
      onDoubleClickItem={(mRef: ShortId) => {
        uft(UserFlow.FOCUS_TARGET)(mRef);
      }}
      onChangeLayout={(layouts: Layout[]) => {
        const diffItems =
          layouts
            .map((item) => {
              const dataList = item.i.split(DELIMITER);
              if (dataList.length !== 2) return undefined;
              const mRef = dataList[0];
              const compopnent = StoreHelpers.findComponentModelOrThrow(mRef);
              if (
                compopnent.gridLayout?.x === item.x &&
                compopnent.gridLayout?.y === item.y &&
                compopnent.gridLayout?.w === item.w &&
                compopnent.gridLayout?.h === item.h
              ) {
                return undefined;
              }
              return FrameDiff.buildUpdateComponentGridLayoutDiff(compopnent, {
                x: item.x,
                y: item.y,
                w: item.w,
                h: item.h,
              });
            })
            .filter(isDefined) ?? [];
        if (diffItems.length > 0) {
          AllStores.diffStore.applyDiff(diffItems);
        }
      }}
    />
  );
}

export const ZDroppableWebPage = observer((props: { mRef: ShortId }): NullableReactElement => {
  const { columnCount, rowHeight, webPageWidth, webPageHeight } = useGridLayoutConfig();
  const cb = useColorBinding();
  const model = useModel<BasicWebModel>(props.mRef);

  if (!model) return null;

  return (
    <ZDroppableWebArea
      isPage
      model={model}
      backgroundColor={cb(model.dataAttributes.backgroundColor)}
      columnCount={columnCount}
      rowHeight={rowHeight}
      gridLayoutWidth={webPageWidth}
      gridLayoutHeight={webPageHeight}
    />
  );
});

export const ZDroppableWebContainer = observer((props: { mRef: ShortId }): NullableReactElement => {
  const { rowHeight } = useGridLayoutConfig();
  const cb = useColorBinding();
  const model = StoreHelpers.findComponentModelOrThrow<BaseWebContainerModel>(props.mRef);

  const columnCount = model.gridLayout.w;
  const gridLayoutWidth = model.gridLayout.w * rowHeight;
  const gridLayoutHeight = model.gridLayout.h * rowHeight;

  return (
    <ZDroppableWebArea
      isPage={false}
      model={model}
      backgroundColor={cb(model.dataAttributes.backgroundColor)}
      columnCount={columnCount}
      rowHeight={rowHeight}
      gridLayoutWidth={gridLayoutWidth}
      gridLayoutHeight={gridLayoutHeight}
    />
  );
});

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: '100%',
    height: '100%',
  },
  gridContainer: {
    overflow: 'hidden',
  },
  selectionWrapper: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    margin: '-6px',
    padding: '6px',
    outline: `2px solid ${ZThemedColors.HIGHLIGHT}`,
    backgroundColor: ZThemedColors.HIGHLIGHT_WITH_OPACITY,
    overflow: 'visible',
  },
};
