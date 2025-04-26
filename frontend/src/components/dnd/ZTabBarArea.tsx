import { observer } from 'mobx-react';
import React, { ReactElement } from 'react';
import { ShortId } from '../../shared/type-definition/ZTypes';
import { DefaultTabBarHeight, ZMoveableClassName } from '../../utils/ZConst';
import { ZTabBar } from '../mobile-components/ZTabBar';

interface Props {
  screenMRef: ShortId;
}

export const ZTabBarArea = observer((props: Props): ReactElement => {
  return (
    <div className={`${ZMoveableClassName.SNAPPABLE}`} style={styles.footer}>
      <ZTabBar screenMRef={props.screenMRef} />
    </div>
  );
});

const styles: Record<string, React.CSSProperties> = {
  footer: {
    backgroundColor: 'red',
    width: '100%',
    height: DefaultTabBarHeight,
    borderBottomRightRadius: '5px',
    borderBottomLeftRadius: '5px',
    overflow: 'hidden',
    position: 'absolute',
    left: 0,
    bottom: 0,
    zIndex: 100,
  },
};
