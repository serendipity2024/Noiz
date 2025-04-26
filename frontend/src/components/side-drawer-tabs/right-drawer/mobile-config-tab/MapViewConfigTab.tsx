/* eslint-disable import/no-default-export */
/* eslint-disable default-case */
import { observer } from 'mobx-react';
import React from 'react';
import useLocale from '../../../../hooks/useLocale';
import useModel from '../../../../hooks/useModel';
import { NullableReactElement } from '../../../../shared/type-definition/ZTypes';
import { MRefProp } from '../../../mobile-components/PropTypes';
import CombinedStyleConfigRow from '../config-row/CombinedStyleConfigRow';
import DataBindingConfigRow from '../config-row/DataBindingConfigRow';
import i18n from './MapViewConfigTab.i18n.json';
import MapViewModel from '../../../../models/mobile-components/MapViewModel';
import ConfigTab from './ConfigTab';
import { MapViewAttributes } from '../../../mobile-components/ZMapView';
import { Empty } from '../../../../zui';

const MapViewDataConfigTab = observer((props: { model: MapViewModel }) => {
  const { localizedContent: content } = useLocale(i18n);
  const { model } = props;
  const dataAttributes = model.dataAttributes as MapViewAttributes;
  return (
    <div key={model.mRef}>
      <DataBindingConfigRow
        title={content.label.geoPoint}
        componentModel={model}
        dataBinding={dataAttributes.geoPoint}
        onChange={(value) => {
          model.onUpdateDataAttributes('geoPoint', value);
        }}
      />
      <CombinedStyleConfigRow data={model} />
    </div>
  );
});

export default observer(function MapViewConfigTab(props: MRefProp): NullableReactElement {
  const model = useModel<MapViewModel>(props.mRef);
  if (!model) return null;

  return (
    <ConfigTab
      model={model}
      ActionConfigTab={() => <Empty description={false} />}
      DataConfigTab={MapViewDataConfigTab}
      StyleConfigTab={() => <Empty description={false} />}
    />
  );
});
