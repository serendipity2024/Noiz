/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React, { CSSProperties } from 'react';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import ZConfigRowTitle from './ZConfigRowTitle';
import { Row, Switch } from '../../../../zui';

interface Props<T, K extends string & keyof T> {
  componentModel: BaseComponentModel;
  dataAttribute: { [P in keyof T]: P extends K ? boolean | undefined : any };
  field: K;
  title: string;
  style?: CSSProperties;
}

export default observer(function SwitchRow<T, K extends string & keyof T>(props: Props<T, K>) {
  return (
    <Row justify="space-between" align="middle" style={props.style}>
      <ZConfigRowTitle text={props.title} />
      <Switch
        checked={props.dataAttribute[props.field]}
        onChange={(checked) => {
          props.componentModel.onUpdateDataAttributes(props.field, checked);
        }}
      />
    </Row>
  );
});
