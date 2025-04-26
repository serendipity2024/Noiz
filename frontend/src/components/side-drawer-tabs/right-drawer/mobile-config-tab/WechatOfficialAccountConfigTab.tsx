import React from 'react';
import useModel from '../../../../hooks/useModel';
import { NullableReactElement } from '../../../../shared/type-definition/ZTypes';
import { MRefProp } from '../../../mobile-components/PropTypes';
import ConfigTab from './ConfigTab';
import { Empty } from '../../../../zui';
import { WechatOfficialAccountModel } from '../../../../models/mobile-components/WechatOfficialAccountModel';

export function WechatOfficialAccountConfigTab(props: MRefProp): NullableReactElement {
  const model = useModel<WechatOfficialAccountModel>(props.mRef);
  if (!model) return null;

  return (
    <ConfigTab
      model={model}
      ActionConfigTab={() => <Empty description={false} />}
      DataConfigTab={() => <Empty description={false} />}
      StyleConfigTab={() => <Empty description={false} />}
    />
  );
}
