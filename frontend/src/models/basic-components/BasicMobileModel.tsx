/* eslint-disable import/no-default-export */
import { computed, observable } from 'mobx';
import React from 'react';
import {
  DraggableScreenAttributes,
  ZDraggableScreenDefaultDataAttributes,
  ZDraggableScreenDefaultReferenceAttributes,
} from '../../containers/ZDraggableBoard';
import { ZDroppableWechat } from '../../containers/ZDroppableMobile';
import { AllStores } from '../../mobx/StoreContexts';
import { getConfiguration } from '../../mobx/stores/CoreStore';
import { ComponentModelType } from '../../shared/type-definition/ComponentModelType';
import { VariableTable } from '../../shared/type-definition/DataBinding';
import { ShortId } from '../../shared/type-definition/ZTypes';
import BaseComponentModel from '../base/BaseComponentModel';
import BaseMobileContainerModel from '../base/BaseMobileContainerModel';
import ComponentModelBuilder from '../ComponentModelBuilder';
import { ZedSupportedPlatform } from '../interfaces/ComponentModel';
import ZFrame, { ZPosition } from '../interfaces/Frame';

const EMPTY_STRING = '';

export const DefaultScreenPosition: ZPosition = { x: 0, y: 0 };

export enum ScreenType {
  BASIC = 'basic',
  CONDITIONAL = 'conditional',
}

export default class BasicMobileModel extends BaseMobileContainerModel {
  public readonly type: ComponentModelType = ComponentModelType.MOBILE_PAGE;

  public hasFocusMode(): boolean {
    return true;
  }

  @observable
  public pageVariableTable: VariableTable = {};

  public shouldFullyFocus(): boolean {
    return false;
  }

  public getComponentFrame(): ZFrame {
    const { viewport } = getConfiguration();
    const size = viewport;
    return { size, position: DefaultScreenPosition };
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

    if (!shouldInitialize) return;

    // create default children
    let navigationBar;
    switch (AllStores.editorStore.editorPlatform) {
      case ZedSupportedPlatform.MOBILE_WEB: {
        navigationBar = ComponentModelBuilder.buildByType(
          this.mRef,
          ComponentModelType.MOBILE_NAVIGATION_BAR
        );
        break;
      }
      case ZedSupportedPlatform.WECHAT: {
        navigationBar = ComponentModelBuilder.buildByType(
          this.mRef,
          ComponentModelType.WECHAT_NAVIGATION_BAR
        );
        break;
      }
      default:
        break;
    }
    this.unsavedChildren = navigationBar ? [navigationBar] : [];
    this.componentName = screenName;
  }

  public createCopy(parentMRef?: ShortId): BaseComponentModel | null {
    const clonedModel = this.defaultCreateCopy(parentMRef) as BasicMobileModel;
    if (super.imperfectCopy(this.parentMRef, parentMRef)) {
      super.resetDataAttributesToDefaultIfNecessary(
        clonedModel,
        ZDraggableScreenDefaultReferenceAttributes
      );
    }
    return clonedModel;
  }

  @computed
  public get hasFooter(): boolean {
    return false;
  }

  // renderers
  public renderForPreview(): React.ReactNode {
    return <ZDroppableWechat mRef={this.mRef} />;
  }
}
