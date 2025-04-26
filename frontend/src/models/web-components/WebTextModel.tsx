/* eslint-disable import/no-default-export */
import { observable } from 'mobx';
import React from 'react';
import ZWebText, {
  WebTextAttributes,
  ZWebTextDefaultDataAttributes,
  ZWebTextDefaultGridLayout,
} from '../../components/web-components/ZWebText';
import { ComponentModelType } from '../../shared/type-definition/ComponentModelType';
import { ShortId } from '../../shared/type-definition/ZTypes';
import BaseComponentModel from '../base/BaseComponentModel';
import BaseWebComponentModel from '../base/BaseWebComponentModel';
import ZGridLayout from '../interfaces/GridLayout';

export default class WebTextModel extends BaseWebComponentModel {
  public readonly type: ComponentModelType = ComponentModelType.WEB_TEXT;

  @observable
  public gridLayout: ZGridLayout = ZWebTextDefaultGridLayout;

  @observable
  public dataAttributes = this.defaultDataAttributes() as WebTextAttributes;

  public defaultDataAttributes(): Record<string, any> {
    return ZWebTextDefaultDataAttributes;
  }

  public canCreateComponentTemplate(): boolean {
    return false;
  }

  public createCopy(parentMRef?: ShortId): BaseComponentModel | null {
    return this.defaultCreateCopy(parentMRef);
  }

  // renderers
  public renderForPreview(): React.ReactNode {
    return <ZWebText mRef={this.mRef} />;
  }
}
