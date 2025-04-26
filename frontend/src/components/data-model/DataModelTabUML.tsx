/* eslint-disable unused-imports/no-unused-vars */
import React, { ReactElement, useEffect, useState, useRef } from 'react';
import cx from 'classnames';
import { uniq } from 'lodash/fp';
import { last } from 'lodash';
import { observer } from 'mobx-react';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { useGesture } from 'react-use-gesture';
import cssModule from './DataModelTabUML.module.scss';
import startIcon from '../../shared/assets/data-modal/arrow_start.svg';
import endIcon from '../../shared/assets/data-modal/arrow_end.svg';
import { DataModelRelationsTab } from './DataModelRelationsTab';
import { DataModelColumnsTab } from './DataModelColumnsTab';
import useStores from '../../hooks/useStores';
import { DataModelUmlView } from '../../mobx/stores/DataModelStore';
import { TableMetadata } from '../../shared/type-definition/DataModel';

interface Point {
  x: number;
  y: number;
}
interface LineInfo {
  start: Point;
  end: Point;
  offset?: number;
  isReverse: boolean;
  isTop: boolean;
}
interface Props {
  selectedTableName: string;
  onTableSelected: (table: string) => void;
  centerTableName: string;
  tableMetadata: TableMetadata[];
}
enum LineText {
  ONE_TO_MANY = '1:N',
  MANY_TO_ONE = 'N:1',
  ONE_TO_ONE = '1:1',
  MANY_TO_MANY = 'N:N',
}

type TopOffsetRecord = Record<number, number>;

const TABLE_MARGIN_TOP = 0;
const TABLE_WIDTH = 200;
const TABLE_MARGIN = 100;
const ANCHOR_TOP_X = TABLE_WIDTH / 2;
const ANCHOR_TOP_Y = 0;
const ANCHOR_LEFT_X = 0;
const ANCHOR_LEFT_Y = 30;
const ANCHOR_RIGHT_X = 200;
const ANCHOR_RIGHT_Y = 30;
const OFFSET_TOP_STEP = 40;

let dataModelUmlView: DataModelUmlView;

export const DataModeTabUML = observer(function DataModeTabUML(props: Props): ReactElement {
  const umlContainerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<Point>({ x: 0, y: 0 });
  const [scale, setScale] = useState<number>(1);
  const lastPosRef = useRef<Point>(pos);
  const { dataModelStore, coreStore } = useStores();
  dataModelUmlView = dataModelStore.genDataModelUmlView(
    props.selectedTableName,
    dataModelUmlView?.tableMetadata ??
      coreStore.dataModel.tableMetadata.filter((table) => table.schemaModifiable)
  );
  useEffect(() => {
    if (props.centerTableName) setContainerCenter();
  }, [props.centerTableName]);

  const setContainerCenter = (): void => {
    if (!umlContainerRef.current) return;
    const { width, height } = umlContainerRef.current.getBoundingClientRect();
    const index = dataModelUmlView.tableMetadata.findIndex(
      (t) => t.name === props.selectedTableName
    );
    const tableCenterX = index * (TABLE_WIDTH + TABLE_MARGIN) + TABLE_WIDTH / 2;
    setPos({
      x: -(tableCenterX - width / 2),
      // TIP: Leaving 1/3 blank on the longitudinal axis is better than centering
      y: (height / 3) * 1,
    });
    setScale(1);
  };

  const touchMoveEvent = useGesture({
    onWheel: (current) => {
      const [dX, dY] = current.delta;
      setPos({ x: pos.x - dX, y: pos.y - dY });
    },
  });

  const getLineTopOffsetRecord = (dataModel: DataModelUmlView): TopOffsetRecord => {
    const { leftRelationTableList, rightRelationTableList, selectedTableInfo } = dataModel;
    const indexMap: TopOffsetRecord = {};
    const leftLength =
      last(leftRelationTableList)?.index === selectedTableInfo.index - 1
        ? leftRelationTableList.length - 1
        : leftRelationTableList.length;
    leftRelationTableList.forEach((relation, index) => {
      indexMap[relation.index] = (leftLength - index) * OFFSET_TOP_STEP;
    });
    rightRelationTableList.forEach((relation, index) => {
      indexMap[relation.index] = (index + leftLength) * OFFSET_TOP_STEP;
    });
    return indexMap;
  };

  const getLineInfo = (
    sourceIndex: number,
    targetIndex: number,
    topOffsetRecord: TopOffsetRecord
  ): LineInfo => {
    const diff = targetIndex - sourceIndex;
    if (diff === 1) {
      return {
        start: {
          x: sourceIndex * (TABLE_WIDTH + TABLE_MARGIN) + ANCHOR_RIGHT_X,
          y: TABLE_MARGIN_TOP + ANCHOR_RIGHT_Y,
        },
        end: {
          x: targetIndex * (TABLE_WIDTH + TABLE_MARGIN) + ANCHOR_LEFT_X,
          y: TABLE_MARGIN_TOP + ANCHOR_LEFT_Y,
        },
        isReverse: false,
        isTop: false,
      };
    }
    if (diff === -1) {
      return {
        start: {
          x: sourceIndex * (TABLE_WIDTH + TABLE_MARGIN) + ANCHOR_LEFT_X,
          y: TABLE_MARGIN_TOP + ANCHOR_LEFT_Y,
        },
        end: {
          x: targetIndex * (TABLE_WIDTH + TABLE_MARGIN) + ANCHOR_RIGHT_X,
          y: TABLE_MARGIN_TOP + ANCHOR_RIGHT_Y,
        },
        isReverse: true,
        isTop: false,
      };
    }
    return {
      start: {
        x: sourceIndex * (TABLE_WIDTH + TABLE_MARGIN) + ANCHOR_TOP_X,
        y: TABLE_MARGIN_TOP + ANCHOR_TOP_Y,
      },
      end: {
        x: targetIndex * (TABLE_WIDTH + TABLE_MARGIN) + ANCHOR_TOP_X,
        y: TABLE_MARGIN_TOP + ANCHOR_TOP_Y,
      },
      offset: topOffsetRecord[targetIndex],
      isReverse: diff < 0,
      isTop: true,
    };
  };

  const renderLineList = () => {
    if (!dataModelUmlView) return null;
    const topOffsetRecord = getLineTopOffsetRecord(dataModelUmlView);
    return (
      <TransitionGroup>
        {[
          ...dataModelUmlView.leftRelationTableList.slice().reverse(),
          ...dataModelUmlView.rightRelationTableList,
        ].map((table) => {
          const {
            start,
            end,
            offset = 0,
            isReverse,
            isTop,
          } = getLineInfo(dataModelUmlView.selectedTableInfo.index, table.index, topOffsetRecord);
          const relationTexts = table.relations.map((r) => r.type as keyof typeof LineText);

          return (
            <CSSTransition
              in
              timeout={300}
              classNames={{
                enterActive: cssModule.lineEnterActive,
                enter: cssModule.lineEnter,
              }}
              key={table.tableName}
              appear
              exit={false}
            >
              <div
                className={cx(cssModule.line, [
                  isReverse ? cssModule.isReverse : '',
                  isTop ? cssModule.isTop : '',
                ])}
                style={{
                  top: `${start.y - offset}px`,
                  left: `${start.x}px`,
                  height: `${offset}px`,
                  width: `${Math.abs(end.x - start.x)}px`,
                }}
              >
                <img className={cssModule.start} src={startIcon} alt="" />
                <img className={cssModule.end} src={endIcon} alt="" />
                <div className={cssModule.relationsBox}>
                  {uniq(relationTexts).map((text, i) => (
                    <span className={cssModule.text} key={i.toString()}>
                      {LineText[text]}
                    </span>
                  ))}
                </div>
              </div>
            </CSSTransition>
          );
        })}
      </TransitionGroup>
    );
  };

  return (
    <div ref={umlContainerRef} className={cssModule.umlContainer} {...touchMoveEvent()}>
      <TransformWrapper
        positionX={pos.x}
        positionY={pos.y}
        scale={scale}
        doubleClick={{ disabled: true }}
        wheel={{
          wheelEnabled: false,
          touchPadEnabled: true,
          limitsOnWheel: true,
          step: 1,
        }}
        options={{
          limitToBounds: false,
          transformEnabled: true,
          centerContent: false,
          minScale: 0.05,
          maxScale: 8,
        }}
        onPanningStart={() => {
          lastPosRef.current = pos;
        }}
        onWheelStop={(evt: any) => {
          setScale(evt.scale);
          setPos({ x: evt.positionX, y: evt.positionY });
        }}
        onPanningStop={(evt: any) => {
          setPos({ x: evt.positionX, y: evt.positionY });
        }}
      >
        <TransformComponent>
          <div className={cssModule.tableContianer}>
            {props.tableMetadata.map((data) => {
              const index = dataModelUmlView.tableMetadata.findIndex((v) => v.name === data.name);
              return (
                <div
                  data-tag={data.name}
                  className={cx(cssModule.table, {
                    [cssModule.isSelected]: props.selectedTableName === data.name,
                  })}
                  style={{
                    transform: `translate3d(${(TABLE_WIDTH + TABLE_MARGIN) * index}px, 0, 0)`,
                  }}
                  key={data.name}
                  onClick={() => {
                    if (
                      Math.abs(lastPosRef.current.x - pos.x) <= 10 &&
                      Math.abs(lastPosRef.current.y - pos.y) <= 10
                    ) {
                      props.onTableSelected(data.name);
                    }
                  }}
                >
                  <p className={cssModule.tableName}>{data.name}</p>
                  <DataModelColumnsTab tableMetadata={data} deletable={false} />
                  <DataModelRelationsTab tableMetadata={data} />
                </div>
              );
            })}
          </div>
          <div>{renderLineList()}</div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
});
