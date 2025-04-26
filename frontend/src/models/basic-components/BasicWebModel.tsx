/* eslint-disable import/no-default-export */
import { observable } from 'mobx';
import React from 'react';
import {
  DraggableScreenAttributes,
  ZDraggableScreenDefaultDataAttributes,
} from '../../containers/ZDraggableBoard';
import { ZDroppableWebPage } from '../../containers/ZDroppableWeb';
import { ComponentModelType } from '../../shared/type-definition/ComponentModelType';
import { VariableTable } from '../../shared/type-definition/DataBinding';
import { ShortId } from '../../shared/type-definition/ZTypes';
import BaseComponentModel from '../base/BaseComponentModel';
import BaseWebContainerModel from '../base/BaseWebContainerModel';
import ZFrame from '../interfaces/Frame';

const EMPTY_STRING = '';

export default class BasicWebModel extends BaseWebContainerModel {
  public readonly type: ComponentModelType = ComponentModelType.WEB_PAGE;

  // Number of columns in this layout.
  public readonly columnCount: number = 16;

  @observable
  public pageVariableTable: VariableTable = {};

  public shouldFullyFocus(): boolean {
    return false;
  }

  public getComponentFrame(): ZFrame {
    return { position: { x: 0, y: 0 }, size: { width: 0, height: 0 } };
  }

  public defaultDataAttributes(): Record<string, any> {
    return ZDraggableScreenDefaultDataAttributes;
  }

  @observable
  public dataAttributes = this.defaultDataAttributes() as DraggableScreenAttributes;

  @observable
  public childMRefs: ShortId[] = [];

  @observable
  public variableTable: VariableTable = {};

  constructor(screenName: string, shouldInitialize = true) {
    super(EMPTY_STRING);
    this.componentName = screenName;
    this.dataAttributes = { ...this.defaultDataAttributes(), ...this.dataAttributes };
  }

  public hasFocusMode(): boolean {
    return true;
  }

  public createCopy(parentMRef?: ShortId): BaseComponentModel | null {
    return this.defaultCreateCopy(parentMRef);
  }

  public renderForPreview(): React.ReactNode {
    return <ZDroppableWebPage mRef={this.mRef} />;
  }
}
