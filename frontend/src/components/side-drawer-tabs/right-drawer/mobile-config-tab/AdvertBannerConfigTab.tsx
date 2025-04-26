/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React from 'react';
import useLocale from '../../../../hooks/useLocale';
import useModel from '../../../../hooks/useModel';
import AdvertBannerModel from '../../../../models/mobile-components/AdvertBannerModel';
import { NullableReactElement } from '../../../../shared/type-definition/ZTypes';
import { MRefProp } from '../../../mobile-components/PropTypes';
import ConfigInput from '../shared/ConfigInput';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import i18n from './AdvertBannerConfigTab.i18n.json';
import ConfigTab from './ConfigTab';
import { AdvertBannerAttributes } from '../../../mobile-components/ZAdvertBanner';
import { Empty } from '../../../../zui';

const AdvertBannerDataConfigTab = observer((props: { model: AdvertBannerModel }) => {
  const { localizedContent: content } = useLocale(i18n);
  const { model } = props;
  const dataAttributes = model.dataAttributes as AdvertBannerAttributes;
  return (
    <>
      <ZConfigRowTitle text={content.label} />
      <ConfigInput
        value={dataAttributes.advertId}
        placeholder={content.placeholder}
        onSaveValue={(value) => {
          model.onUpdateDataAttributes('advertId', value);
        }}
      />
    </>
  );
});

export default observer(function AdvertBannerConfigTab(props: MRefProp): NullableReactElement {
  const model = useModel<AdvertBannerModel>(props.mRef);
  if (!model) return null;

  return (
    <ConfigTab
      model={model}
      DataConfigTab={AdvertBannerDataConfigTab}
      StyleConfigTab={() => <Empty description={false} />}
      ActionConfigTab={() => <Empty description={false} />}
    />
  );
});
