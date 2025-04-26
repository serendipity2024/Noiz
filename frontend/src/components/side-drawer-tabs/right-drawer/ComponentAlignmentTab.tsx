/* eslint-disable import/no-default-export */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-param-reassign */
import { observer, useObserver } from 'mobx-react';
import React from 'react';
import useModel from '../../../hooks/useModel';
import { ZPosition } from '../../../models/interfaces/Frame';
import AlignBottom from '../../../shared/assets/icons/component-alignment/align-bottom.svg';
import AlignCenterHorizontal from '../../../shared/assets/icons/component-alignment/align-center-horizontal.svg';
import AlignCenterVertical from '../../../shared/assets/icons/component-alignment/align-center-vertical.svg';
import AlignInnerCenterHorizontal from '../../../shared/assets/icons/component-alignment/align-inner-center-horizontal.svg';
import AlignInnerCenterVertical from '../../../shared/assets/icons/component-alignment/align-inner-center-vertical.svg';
import AlignLeft from '../../../shared/assets/icons/component-alignment/align-left.svg';
import AlignRight from '../../../shared/assets/icons/component-alignment/align-right.svg';
import AlignTop from '../../../shared/assets/icons/component-alignment/align-top.svg';
import { NullableReactElement, ShortId } from '../../../shared/type-definition/ZTypes';
import { ZColors, ZThemedColors } from '../../../utils/ZConst';

interface AlignmentIconData {
  source: string;
  onClick: () => void;
}

export interface Props {
  mRef: ShortId;
}

export default observer(function ComponentAlignmentTab(props: Props): NullableReactElement {
  const model = useModel(props.mRef);
  const frame = useObserver(() => model?.getComponentFrame());
  const parentFrame = model?.parent()?.getComponentFrame();
  if (!model || !frame || !parentFrame) return null;
  if (!model.getFrameConfiguration().positionEnabled) return null;

  const setPosition = (partialPosition: Partial<ZPosition>) => {
    const newFrame = { ...frame, position: { ...frame.position, ...partialPosition } };
    model.onUpdateFrame({ ...frame, ...newFrame });
  };

  const iconData: Record<string, AlignmentIconData> = {
    left: {
      source: AlignLeft,
      onClick: () => setPosition({ x: 0 }),
    },
    centerHorizontal: {
      source: AlignCenterHorizontal,
      onClick: () => setPosition({ x: (parentFrame.size.width - frame.size.width) / 2 }),
    },
    right: {
      source: AlignRight,
      onClick: () => setPosition({ x: parentFrame.size.width - frame.size.width }),
    },
    innerCenterHorizontal: {
      source: AlignInnerCenterHorizontal,
      onClick: () => {
        // do nothing
      },
    },
    top: {
      source: AlignTop,
      onClick: () => setPosition({ y: 0 }),
    },
    centerVertical: {
      source: AlignCenterVertical,
      onClick: () => setPosition({ y: (parentFrame.size.height - frame.size.height) / 2 }),
    },
    bottom: {
      source: AlignBottom,
      onClick: () => setPosition({ y: parentFrame.size.height - frame.size.height }),
    },
    innerCenterVertical: {
      source: AlignInnerCenterVertical,
      onClick: () => {
        // do nothing
      },
    },
  };

  const renderIcon = (data: AlignmentIconData) => (
    <div onClick={data.onClick}>
      <img alt="" style={styles.icon} src={data.source} />
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.separator} />
      <div style={styles.iconContainer}>
        {renderIcon(iconData.left)}
        {renderIcon(iconData.centerHorizontal)}
        {renderIcon(iconData.right)}
        {renderIcon(iconData.innerCenterHorizontal)}
        <div style={styles.verticalSeparator} />
        {renderIcon(iconData.top)}
        {renderIcon(iconData.centerVertical)}
        {renderIcon(iconData.bottom)}
        {renderIcon(iconData.innerCenterVertical)}
      </div>
      <div style={styles.separator} />
    </div>
  );
});

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 20,
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: ZColors.WHITE,
    opacity: 0.1,
  },
  iconContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
  },
  icon: {
    width: 15,
    height: 15,
  },
  verticalSeparator: {
    position: 'relative',
    width: 1,
    height: 10,
    margin: '2.5px 0',
    backgroundColor: ZThemedColors.PRIMARY_TEXT,
  },
};
