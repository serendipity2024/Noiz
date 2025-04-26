import { observer } from 'mobx-react';
import React, { CSSProperties } from 'react';
import useModel from '../../hooks/useModel';
import ZFrame from '../../models/interfaces/Frame';
import { MRefProp } from './PropTypes';
import BaseComponentModel from '../../models/base/BaseComponentModel';
import { WechatOfficialAccountModel } from '../../models/mobile-components/WechatOfficialAccountModel';
import CSSModule from './ZWechatOfficialAccount.module.scss';

export const ZWechatOfficialAccountDefaultDataAttributes = {};

export type WechatOfficialAccountAttributes = typeof ZWechatOfficialAccountDefaultDataAttributes;

export const ZWechatOfficialAccountDefaultFrame: ZFrame = {
  size: { width: 300, height: 84 },
  position: { x: 0, y: 0 },
};

export const ZWechatOfficialAccount = observer((props: MRefProp) => {
  const model = useModel<WechatOfficialAccountModel>(props.mRef);
  if (!model) return null;

  const renderChild = (component: BaseComponentModel) => {
    const style: React.CSSProperties = {
      left: component.getComponentFrame().position?.x,
      top: component.getComponentFrame().position?.y,
      width: component.getComponentFrame().size.width,
      height: component.getComponentFrame().size.height,
      position: 'absolute',
      pointerEvents: 'none',
    };
    return (
      <div key={component.mRef} style={style}>
        {component.renderForPreview()}
      </div>
    );
  };

  return <div className={CSSModule.container}>{model.children().map(renderChild)}</div>;
});
