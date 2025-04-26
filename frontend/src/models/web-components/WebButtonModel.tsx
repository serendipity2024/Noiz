/* eslint-disable import/no-default-export */
import { observable } from 'mobx';
import React from 'react';
import ZWebButton, {
  WebButtonAttributes,
  ZWebButtonDefaultDataAttributes,
  ZWebButtonDefaultGridLayout,
} from '../../components/web-components/ZWebButton';
import { ComponentModelType } from '../../shared/type-definition/ComponentModelType';
import { ShortId } from '../../shared/type-definition/ZTypes';
import BaseComponentModel from '../base/BaseComponentModel';
import BaseWebComponentModel from '../base/BaseWebComponentModel';
import ZGridLayout from '../interfaces/GridLayout';

export default class WebButtonModel extends BaseWebComponentModel {
  public readonly type: ComponentModelType = ComponentModelType.WEB_BUTTON;

  @observable
  public gridLayout: ZGridLayout = ZWebButtonDefaultGridLayout;

  @observable
  public dataAttributes = this.defaultDataAttributes() as WebButtonAttributes;

  public defaultDataAttributes(): Record<string, any> {
    return ZWebButtonDefaultDataAttributes;
  }

  public canCreateComponentTemplate(): boolean {
    return false;
  }

  public createCopy(parentMRef?: ShortId): BaseComponentModel | null {
    return this.defaultCreateCopy(parentMRef);
  }

  // renderers
  public renderForPreview(): React.ReactNode {
    return <ZWebButton mRef={this.mRef} />;
  }
}
