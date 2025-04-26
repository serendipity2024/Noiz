/* eslint-disable import/no-default-export */
import { observable } from 'mobx';
import React from 'react';
import ZSimpleList from '../../components/mobile-components/ZSimpleList';
import { ComponentModelType } from '../../shared/type-definition/ComponentModelType';
import { ShortId } from '../../shared/type-definition/ZTypes';
import BaseComponentModel from '../base/BaseComponentModel';
import BaseMobileContainerModel from '../base/BaseMobileContainerModel';

export default class SimpleListModel extends BaseMobileContainerModel {
  public readonly type: ComponentModelType = ComponentModelType.SIMPLE_LIST;

  public defaultDataAttributes(): Record<string, any> {
    return {};
  }

  @observable
  public dataAttributes = this.defaultDataAttributes();

  public createCopy(parentMRef?: ShortId): BaseComponentModel | null {
    return this.defaultCreateCopy(parentMRef);
  }

  // renderers
  public renderForPreview(): React.ReactNode {
    return <ZSimpleList mRef={this.previewMRef} />;
  }
}
