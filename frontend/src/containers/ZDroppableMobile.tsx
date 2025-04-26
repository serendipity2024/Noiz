import { observer } from 'mobx-react';
import React from 'react';
import ZDroppableArea from '../components/dnd/ZDroppableArea';
import { MRefProp } from '../components/mobile-components/PropTypes';
import { getBackgroundStyle } from '../components/side-drawer-tabs/right-drawer/config-row/BackgroundConfigRow';
import useColorBinding from '../hooks/useColorBinding';
import { useMediaUrl } from '../hooks/useMediaUrl';
import useModel from '../hooks/useModel';
import BasicMobileModel from '../models/basic-components/BasicMobileModel';
import { NullableReactElement } from '../shared/type-definition/ZTypes';
import { DefaultTabBarHeight } from '../utils/ZConst';

export const ZDroppableWechat = observer((props: MRefProp): NullableReactElement => {
  const cb = useColorBinding();
  const umu = useMediaUrl();

  const model = useModel<BasicMobileModel>(props.mRef);
  if (!model) return null;

  const { dataAttributes } = model;

  const fillMarginFooterHeight =
    dataAttributes.footerHeight + (model?.hasFooter ? DefaultTabBarHeight : 0);

  const renderFillMarginFooterIndicator = () => {
    if (fillMarginFooterHeight === 0) return null;
    return <div style={{ ...styles.indication, bottom: fillMarginFooterHeight }} />;
  };

  const backgroundStyles = getBackgroundStyle(model.dataAttributes, cb, umu);

  return (
    <ZDroppableArea mRef={props.mRef} backgroundStyles={backgroundStyles}>
      {renderFillMarginFooterIndicator()}
    </ZDroppableArea>
  );
});

const styles: Record<string, React.CSSProperties> = {
  indication: {
    position: 'absolute',
    left: 0,
    width: '100%',
    height: 1,
    backgroundColor: '#eeeeee',
  },
};
