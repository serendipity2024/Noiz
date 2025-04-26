/* eslint-disable import/no-default-export */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-find-dom-node */
/* eslint-disable react/no-string-refs */
import 'antd/dist/antd.css';
import { debounce } from 'lodash';
import { useObserver } from 'mobx-react';
import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { useGesture } from 'react-use-gesture';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import ZDragSelectable from '../components/editor/ZDragSelectable';
import ZZoomControl, { ZZoomControlProps } from '../components/editor/ZZoomControl';
import useModel from '../hooks/useModel';
import useStores from '../hooks/useStores';
import useWindowSize from '../hooks/useWindowSize';
import { NullableReactElement } from '../shared/type-definition/ZTypes';
import ZProjectDataLoadingView from '../views/ZProjectDataLoadingView';
import './ZBoard.scss';
import ZBoardOverlay from './ZBoardOverlay';
import ZFocusBoard from './ZFocusBoard';
import ZScreenBoard from './ZScreenBoard';
import { ZedSupportedPlatform } from '../models/interfaces/ComponentModel';
import useViewport from '../hooks/useViewport';
import { useScreenMRefs } from '../hooks/useScreenModels';

const DEFAULT_XYSCALE = [1, 1, 1]; // hack translate(0px, 0px) scale == 1时的残影

export default function ZBoard(): NullableReactElement {
  const { editorStore } = useStores();
  const isHandToolOn = useObserver(() => editorStore.isHandToolOn);

  const inFocusMode = useObserver(() => editorStore.inFocusMode);
  const focusTargetMRef = useObserver(() => editorStore.editorState.target);
  const focusTarget = useModel(focusTargetMRef ?? '');
  const isFullyFocused = inFocusMode && focusTarget?.shouldFullyFocus();

  const [screenXYScale, setScreenXYScale] = useState(DEFAULT_XYSCALE);
  const [focusXYScale, setFocusXYScale] = useState(DEFAULT_XYSCALE);

  const screenMRefs = useScreenMRefs();
  const viewport = useViewport();
  const windowSize = useWindowSize();

  useEffect(() => {
    const index = screenMRefs.findIndex((screenMRef) => screenMRef === focusTargetMRef);
    const slopeX = -windowSize.width / 2;
    const HALF = 0.5;
    const MARGIN = 60; // 60 px between screens
    const scale = screenXYScale[2];
    const offsetX = (screenMRefs.length / 2 - HALF - index) * (viewport.width + MARGIN) * scale;
    const slopeY = -windowSize.height / 2;
    if (index >= 0) {
      setScreenXYScale([
        slopeX * scale - slopeX + offsetX,
        slopeY * scale - slopeY,
        screenXYScale[2],
      ]);
    }
    // eslint-disable-next-line
  }, [focusTargetMRef, viewport, screenMRefs]);

  useEffect(() => {
    if (!isFullyFocused) setFocusXYScale(DEFAULT_XYSCALE);
    // hack translate(0px, 0px) scale == 1时的残影
    if (screenXYScale[0] === 0 && screenXYScale[1] === 0 && screenXYScale[2] === 1) {
      setScreenXYScale(DEFAULT_XYSCALE);
    }
  }, [isFullyFocused, screenXYScale]);

  const state = isFullyFocused ? focusXYScale : screenXYScale;
  const setState = (newState: [number, number, number]): void => {
    const exec = isFullyFocused ? setFocusXYScale : setScreenXYScale;
    const computedState = state.map((e, i) => newState[i] ?? e);
    exec(computedState);
  };
  const content = isFullyFocused ? <ZFocusBoard /> : <ZScreenBoard />;

  return (
    <ZProjectDataLoadingView>
      <ZBoardInner
        key={isFullyFocused}
        isHandToolOn={isHandToolOn}
        state={state}
        setState={setState}
        setScale={editorStore.setScale}
        content={content}
      />
    </ZProjectDataLoadingView>
  );
}

interface ZBoardInnerProps {
  isHandToolOn: boolean;
  state: [number, number, number];
  setState: (newState: [number, number, number]) => void;
  content: ReactElement;
}

function ZBoardInner(props: any): ReactElement {
  const { editorStore } = useStores();
  const currentXYScale = useRef([0, 0, 1]);

  const { isHandToolOn, state, setState, content, setScale } = props;
  const [stateX, stateY, stateScale] = state;

  const bind = useGesture({
    onWheel: (current: any) => {
      const [x, y] = currentXYScale.current;
      const [dX, dY] = current.delta;
      setState([x - dX, y - dY]);
    },
    onDrag: (current: any) => {
      if (!isHandToolOn) return;
      const [x, y] = currentXYScale.current;
      const [dX, dY] = current.delta;
      setState([x + dX, y + dY]);
    },
  });

  const wrapperOptions = {
    limitToBounds: false,
    transformEnabled: true,
    centerContent: true,
    minScale: 0.05,
    maxScale: 8,
  };
  const wheelOptions = {
    wheelEnabled: false,
    touchPadEnabled: true,
    limitsOnWheel: true,
    step: 120,
  };
  const zoomOptions = {
    step: 8,
    animationTime: 200,
    animationType: 'easeInOutQuad',
  };

  const debouncedSetScale = debounce(setScale, 100);

  return (
    <TransformWrapper
      defaultPositionX={stateX}
      defaultPositionY={stateY}
      positionX={stateX}
      positionY={stateY}
      defaultScale={stateScale}
      options={wrapperOptions}
      zoomIn={zoomOptions}
      zoomOut={zoomOptions}
      wheel={wheelOptions}
      doubleClick={{ disabled: true }}
      pinch={{ disabled: false }}
      pan={{ disabled: true }}
    >
      {({
        zoomIn,
        zoomOut,
        resetTransform,
        scale,
        positionX,
        positionY,
      }: ZZoomControlProps & { positionX: number; positionY: number }) => {
        currentXYScale.current = [positionX, positionY, scale ?? 1];
        const containerCss = `container ${isHandToolOn ? 'container-hand-tool-on' : ''}`;
        debouncedSetScale(scale);
        return (
          <div
            className={containerCss}
            {...bind()}
            onDoubleClick={() => {
              setState(currentXYScale.current);
            }}
          >
            <TransformComponent>
              {content}
              <ZBoardOverlay />
            </TransformComponent>
            <ZZoomControl
              scale={scale}
              zoomIn={zoomIn}
              zoomOut={zoomOut}
              resetTransform={resetTransform}
            />
            {editorStore.editorPlatform !== ZedSupportedPlatform.WEB && <ZDragSelectable />}
          </div>
        );
      }}
    </TransformWrapper>
  );
}
