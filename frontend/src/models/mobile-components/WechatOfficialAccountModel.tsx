import { observable } from 'mobx';
import React from 'react';
import { ZWechatOfficialAccountFocusView } from '../../components/focus-view/ZWechatOfficialAccountFocusView';
import {
  WechatOfficialAccountAttributes,
  ZWechatOfficialAccount,
  ZWechatOfficialAccountDefaultDataAttributes,
  ZWechatOfficialAccountDefaultFrame,
} from '../../components/mobile-components/ZWechatOfficialAccount';
import { ComponentModelType } from '../../shared/type-definition/ComponentModelType';
import { DataBinding, DataBindingKind } from '../../shared/type-definition/DataBinding';
import { ShortId } from '../../shared/type-definition/ZTypes';
import BaseComponentModel from '../base/BaseComponentModel';
import BaseMobileContainerModel from '../base/BaseMobileContainerModel';
import ComponentModelBuilder from '../ComponentModelBuilder';
import { ComponentLayoutConfiguration } from '../interfaces/ComponentModel';
import ZFrame from '../interfaces/Frame';
import TextModel from './TextModel';

export class WechatOfficialAccountModel extends BaseMobileContainerModel {
  public readonly type: ComponentModelType = ComponentModelType.WECHAT_OFFICIAL_ACCOUNT;

  public defaultDataAttributes(): Record<string, any> {
    return ZWechatOfficialAccountDefaultDataAttributes;
  }

  @observable
  public dataAttributes: WechatOfficialAccountAttributes = this.defaultDataAttributes() as WechatOfficialAccountAttributes;

  public getDefaultComponentFrame(): ZFrame {
    return ZWechatOfficialAccountDefaultFrame;
  }

  constructor(public parentMRef: ShortId, shouldInitialize?: boolean) {
    super(parentMRef);

    if (shouldInitialize) return;
    const defaultComponent = ComponentModelBuilder.buildByType(
      this.mRef,
      ComponentModelType.TEXT
    ) as TextModel;
    defaultComponent.setComponentFrame({
      position: { x: 0, y: 0 },
      size: {
        width: this.getComponentFrame().size?.width ?? 300,
        height: this.getComponentFrame().size?.height ?? 84,
      },
    });
    defaultComponent.dataAttributes.title = DataBinding.withTextVariable([
      {
        kind: DataBindingKind.LITERAL,
        value: 'loading...',
      },
    ]);
    defaultComponent.dataAttributes.textAlign = DataBinding.withTextVariable([
      {
        kind: DataBindingKind.LITERAL,
        value: 'center',
      },
    ]);

    this.unsavedChildren = [defaultComponent];
  }

  public getLayoutConfiguration(): ComponentLayoutConfiguration {
    return {
      ...super.getLayoutConfiguration(),
      layoutModeEnabled: true,
    };
  }

  public createCopy(parentMRef?: ShortId): BaseComponentModel | null {
    const clonedModel = this.defaultCreateCopy(parentMRef) as WechatOfficialAccountModel;
    if (super.imperfectCopy(this.parentMRef, parentMRef)) {
      super.resetDataAttributesToDefaultIfNecessary(clonedModel, {});
    }
    return clonedModel;
  }

  // renderers
  public renderForPreview(): React.ReactNode {
    return <ZWechatOfficialAccount mRef={this.previewMRef} />;
  }

  public hasFocusMode(): boolean {
    return true;
  }

  public renderForFocusView(): React.ReactNode {
    return <ZWechatOfficialAccountFocusView mRef={this.previewMRef} />;
  }
}
