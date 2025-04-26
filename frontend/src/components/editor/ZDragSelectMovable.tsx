/* eslint-disable no-param-reassign */
/* eslint-disable import/no-default-export */
import { transaction } from 'mobx';
import { observer, useObserver } from 'mobx-react';
import React, { ReactElement } from 'react';
import Moveable, { MoveableManagerInterface, Able } from 'react-moveable';
import { head } from 'lodash';
import { Enable } from 're-resizable';
import uniqid from 'uniqid';
import { Button, Tooltip } from 'antd';
import FrameDiff from '../../diffs/FrameDiff';
import useStores from '../../hooks/useStores';
import { UserFlow, useSelectionTrigger } from '../../hooks/useUserFlowTrigger';
import StoreHelpers from '../../mobx/StoreHelpers';
import BaseComponentModel from '../../models/base/BaseComponentModel';
import BaseMobileComponentModel from '../../models/base/BaseMobileComponentModel';
import ZFrame from '../../models/interfaces/Frame';
import { DiffItem } from '../../shared/type-definition/Diff';
import { NullableReactElement } from '../../shared/type-definition/ZTypes';
import HotKeyUtils from '../../utils/HotKeyUtils';
import { isNotNull } from '../../utils/utils';
import useModel from '../../hooks/useModel';
import { ZMoveableClassName, ZColors } from '../../utils/ZConst';
import useResizableConfiguration from '../../hooks/useResizableConfiguration';
import Aiming from '../../shared/assets/icons/aiming.svg';
import styles from './ZDragSelectMovable.module.scss';
import useLocale from '../../hooks/useLocale';
import i18n from './ZDragSelectMovable.i18n.json';

function FocusButton(props: { targetId: string }): ReactElement | null {
  const { targetId } = props;
  const { editorStore } = useStores();
  const model = useModel(targetId);
  const focusTargetMRef = useObserver(() => editorStore.editorState.target);
  const uft = useSelectionTrigger();
  const { localizedContent: content } = useLocale(i18n);

  return model?.isContainer && focusTargetMRef !== model.mRef ? (
    <Tooltip title={content.tooltip} placement="bottom" color={ZColors.BLUE}>
      <Button className={styles.focusButton} onClick={() => uft(UserFlow.FOCUS_TARGET)(targetId)}>
        <img className={styles.focusImg} alt="" src={Aiming} />
      </Button>
    </Tooltip>
  ) : null;
}

const ExtraInformationVisible: Able = {
  name: 'extraInformationVisible',
  props: {},
  events: {},
  render(moveable: MoveableManagerInterface<any, any>) {
    const rect = moveable.getRect();
    const [, , , , , , offsetX, offsetY] = moveable.state.beforeMatrix;
    // Add key (required)
    // Add class prefix moveable-(required)
    // offsetX, offsetY和我们的坐标系相比有1px的误差

    const INFO_DIV_UP_GAP = 8;

    return (
      <div
        key="extra-information-visible"
        className={styles.descriptionContainer}
        style={{
          left: `${rect.width / 2}px`,
          top: `${rect.height + INFO_DIV_UP_GAP}px`,
        }}
      >
        {moveable.props.target?.id && (
          <div className={styles.focusContainer}>
            <FocusButton targetId={moveable.props.target?.id} />
            <div className={styles.divider} />
          </div>
        )}
        <div className={styles.frameDescription}>
          {`${Math.round(rect.offsetWidth)} x ${Math.round(rect.offsetHeight)} | (${Math.trunc(
            rect.left - offsetX
          )}, ${Math.trunc(rect.top - offsetY)})`}
        </div>
      </div>
    );
  },
};

export default observer(function ZDragSelectMovable(): NullableReactElement {
  const { editorStore, diffStore } = useStores();
  const uft = useSelectionTrigger();
  const getResizableConfiguration = useResizableConfiguration();

  const elements = editorStore.selectedTargets
    .map((ds) => document.getElementById(ds))
    .filter(isNotNull);

  const updateChildComponentPosition = (mRef: string, tx: number, ty: number): DiffItem[] => {
    const model = StoreHelpers.getComponentModel(mRef) as BaseMobileComponentModel;
    if (!model) throw new Error(`drag select component error, mRef: ${mRef}`);
    const oldFrame = model.getComponentFrame();

    return FrameDiff.buildUpdateComponentFrameDiffs(model, {
      position: {
        x: Math.round(oldFrame.position.x + tx),
        y: Math.round(oldFrame.position.y + ty),
      },
    });
  };

  const targetComponent = useModel<BaseComponentModel>(head(editorStore.selectedTargets) ?? '');
  const parentContainer = useModel<BaseComponentModel>(targetComponent?.parentMRef ?? '');

  const elementGuidelines = [
    document.querySelector(
      `.${ZMoveableClassName.SNAPPABLE}_${parentContainer?.mRef ?? ''}:not(.${
        ZMoveableClassName.PREVIEW
      } .${ZMoveableClassName.SNAPPABLE})`
    ),
    ...Array.from(
      document.querySelectorAll(
        `.${ZMoveableClassName.SNAPPABLE}_${parentContainer?.mRef ?? ''} .${
          ZMoveableClassName.SNAPPABLE
        }:not(.${ZMoveableClassName.PREVIEW} .${ZMoveableClassName.SNAPPABLE})`
      )
    ),
  ].filter(isNotNull);

  const resizeConfiguration =
    elements.length === 1 && targetComponent ? getResizableConfiguration(targetComponent) : {};

  const translateEnable = (enable: Enable | undefined): string[] => {
    const enabledDirections = [];
    if (enable?.top) enabledDirections.push('n');
    if (enable?.topRight) enabledDirections.push('ne');
    if (enable?.right) enabledDirections.push('e');
    if (enable?.bottomRight) enabledDirections.push('se');
    if (enable?.bottom) enabledDirections.push('s');
    if (enable?.bottomLeft) enabledDirections.push('sw');
    if (enable?.left) enabledDirections.push('w');
    if (enable?.topLeft) enabledDirections.push('nw');
    return enabledDirections;
  };

  return (
    <Moveable
      key={uniqid.process()}
      target={elements}
      draggable={
        elements.length > 1 || head(elements)?.classList.contains(ZMoveableClassName.DRAGGABLE)
      }
      snappable
      resizable={!!resizeConfiguration.enable}
      renderDirections={translateEnable(resizeConfiguration.enable)}
      elementGuidelines={elementGuidelines}
      onDrag={({ target, translate }) => {
        target.style.transform = `translate(${translate[0]}px, ${translate[1]}px)`;
      }}
      onDragEnd={({ target, lastEvent, isDrag }) => {
        target.style.transform = '';
        if (lastEvent && isDrag) {
          const diffItems = updateChildComponentPosition(
            target.id,
            lastEvent.translate[0],
            lastEvent.translate[1]
          );
          diffStore.applyDiff(diffItems);
        }
      }}
      onDragGroup={({ targets, translate }) => {
        targets.forEach((target) => {
          target.style.transform = `translate(${translate[0]}px, ${translate[1]}px)`;
        });
      }}
      onDragGroupEnd={({ targets, lastEvent, isDrag }) => {
        targets.forEach((target) => {
          target.style.transform = '';
        });
        if (lastEvent && isDrag) {
          transaction(() => {
            const diffItems: DiffItem[] = [];
            targets.forEach((target) => {
              updateChildComponentPosition(
                target.id,
                lastEvent.translate[0],
                lastEvent.translate[1]
              ).forEach((di) => diffItems.push(di));
            });
            diffStore.applyDiff(diffItems);
          });
        }
      }}
      onClickGroup={(data) => {
        if (data.targetIndex < 0) return;
        const ctrlOrCommandPressed = HotKeyUtils.ctrlOrCommandPressed(data.inputEvent);
        if (ctrlOrCommandPressed) {
          uft(UserFlow.DRAG_SELECTED_TARGETS)(
            editorStore.selectedTargets.filter((ds, index) => index !== data.targetIndex) ?? []
          );
        }
      }}
      onResize={({ width, height, target, direction, dist }) => {
        const transform = [direction[0] === -1 ? -dist[0] : 0, direction[1] === -1 ? -dist[1] : 0];
        target.style.transform = `translate(${transform[0]}px, ${transform[1]}px)`;
        target.style.width = `${width}px`;
        target.style.height = `${height}px`;
        // direction表示选中的拖拽点。direction[0]代表x方向，direction[1]代表y方向，-1代表反向，0代表不做修改，1表示正向。
        // dist表示在对应方向上经过的距离。dist[0]代表x方向，dist[1]代表y方向。
      }}
      onResizeEnd={({ target, lastEvent, isDrag }) => {
        target.style.transform = '';
        if (isDrag) {
          if (lastEvent && targetComponent) {
            if (resizeConfiguration.onResizeStop) {
              resizeConfiguration.onResizeStop(lastEvent);
            } else {
              const model = StoreHelpers.getComponentModel(target.id) as BaseMobileComponentModel;
              const oldFrame = model.getComponentFrame();
              model.onUpdateFrame({
                size: {
                  width: lastEvent.width,
                  height: lastEvent.height,
                },
                position: {
                  x: Math.round(
                    oldFrame.position.x + (lastEvent.direction[0] === -1 ? -lastEvent.dist[0] : 0)
                  ),
                  y: Math.round(
                    oldFrame.position.y + (lastEvent.direction[1] === -1 ? -lastEvent.dist[1] : 0)
                  ),
                },
              });
            }
          }
        }
      }}
      zoom={1 / editorStore.scale}
      ables={[ExtraInformationVisible]}
      props={{
        extraInformationVisible: true,
      }}
    />
  );
});

export function getDragSelectedContainerFrame(models: BaseComponentModel[]): ZFrame {
  const lastComponentFrame = models[0].getComponentFrame();
  let minX: number = lastComponentFrame.position.x;
  let minY: number = lastComponentFrame.position.y;
  let maxX: number = lastComponentFrame.position.x + lastComponentFrame.size.width;
  let maxY: number = lastComponentFrame.position.y + lastComponentFrame.size.height;
  models
    .filter((m, index) => index > 0)
    .forEach((m) => {
      const itemFrame = m.getComponentFrame();
      const itemMinX = itemFrame.position.x;
      const itemMinY = itemFrame.position.y;
      const itemMaxX = itemFrame.position.x + itemFrame.size.width;
      const itemMaxY = itemFrame.position.y + itemFrame.size.height;
      if (itemMinX < minX) {
        minX = itemMinX;
      }
      if (itemMinY < minY) {
        minY = itemMinY;
      }
      if (itemMaxX > maxX) {
        maxX = itemMaxX;
      }
      if (itemMaxY > maxY) {
        maxY = itemMaxY;
      }
    });
  return { position: { x: minX, y: minY }, size: { width: maxX - minX, height: maxY - minY } };
}
