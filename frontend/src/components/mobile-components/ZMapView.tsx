/* eslint-disable import/no-default-export */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { HeatMapOutlined } from '@ant-design/icons/lib/icons';
import { observer } from 'mobx-react';
import React from 'react';
import useColorBinding from '../../hooks/useColorBinding';
import useModel from '../../hooks/useModel';
import ZFrame from '../../models/interfaces/Frame';
import { DataBinding } from '../../shared/type-definition/DataBinding';
import { LocationType } from '../../shared/type-definition/DataModel';
import { NullableReactElement } from '../../shared/type-definition/ZTypes';
import {
  CombinedStyleDefaultDataAttributes,
  prepareCombinedStyles,
} from '../side-drawer-tabs/right-drawer/config-row/CombinedStyleConfigRow';
import { MRefProp } from './PropTypes';

export const ZMapDefaultReferenceAttributes = {
  geoPoint: DataBinding.withSingleValue(LocationType.GEO_POINT),
};

export const ZMapViewDefaultDataAttributes = {
  ...CombinedStyleDefaultDataAttributes,
  ...ZMapDefaultReferenceAttributes,
};

export type MapViewAttributes = typeof ZMapViewDefaultDataAttributes;

export const ZMapViewDefaultFrame: ZFrame = {
  size: { width: 300, height: 260 },
  position: { x: 0, y: 0 },
};

export default observer(function ZMapView(props: MRefProp): NullableReactElement {
  const cb = useColorBinding();
  const model = useModel(props.mRef);
  if (!model) return null;

  const dataAttributes = model.dataAttributes as MapViewAttributes;
  const configuredStyle = {
    ...prepareCombinedStyles(dataAttributes, cb),
  };
  return (
    <div style={{ ...styles.container, ...configuredStyle }}>
      <HeatMapOutlined style={styles.icon} />
    </div>
  );
});

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#fff',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    backgroundColor: '#ddd',
  },
  icon: {
    fontSize: '32px',
    color: '#ffa522',
  },
};
