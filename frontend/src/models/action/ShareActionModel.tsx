import React from 'react';
import uniqid from 'uniqid';
import { DataDependency, DataDependencyType } from '../../mobx/stores/ValidationStore';
import {
  EventBinding,
  EventType,
  ShareHandleBinding,
} from '../../shared/type-definition/EventBinding';
import { EventProps } from '../interfaces/EventModel';
import { DataBinding } from '../../shared/type-definition/DataBinding';
import { BaseType } from '../../shared/type-definition/DataModel';
import { ImageSource } from '../../components/mobile-components/ZImage';
import { CompositeConfiguration } from '../../mobx/stores/CoreStoreDataType';
import { AllStores } from '../../mobx/StoreContexts';
import { ZedSupportedPlatform } from '../interfaces/ComponentModel';
import ShareActionRow from '../../components/side-drawer-tabs/right-drawer/action-row/ShareActionRow';
import { BaseActionModel } from '../base/BaseActionModel';
import { DiffPathComponent } from '../../shared/type-definition/Diff';

export class ShareActionModel extends BaseActionModel {
  public readonly type: EventType = EventType.SHARE;

  public getDefaultEventBinding(): EventBinding {
    const configuration = this.getConfiguration();
    return {
      type: EventType.SHARE,
      title: DataBinding.withSingleValue(BaseType.TEXT),
      imageSource: DataBinding.withLiteral(ImageSource.UPLOAD),
      imageObject: DataBinding.withTextVariable(),
      pageMRef: configuration.initialScreenMRef,
    };
  }

  public getDependentList(
    eventBinding: ShareHandleBinding,
    diffPathComponents: DiffPathComponent[]
  ): DataDependency[] {
    if (!eventBinding.pageMRef) return [];
    return [
      {
        id: uniqid.process(),
        dependencyType: DataDependencyType.COMPONENT,
        targetMRef: eventBinding.pageMRef,
        diffPathComponents,
        relation: eventBinding,
      },
    ];
  }

  public renderForConfigRow(props: EventProps): React.ReactNode {
    const { componentModel, event, onChange } = props;
    return (
      <ShareActionRow componentModel={componentModel} event={event} onEventChange={onChange} />
    );
  }

  private getConfiguration(): CompositeConfiguration {
    const { coreStore, editorStore } = AllStores;
    switch (editorStore.editorPlatform) {
      case ZedSupportedPlatform.WECHAT:
        return coreStore.wechatConfiguration;
      case ZedSupportedPlatform.WEB:
        return coreStore.webConfiguration;
      case ZedSupportedPlatform.MOBILE_WEB:
        return coreStore.mobileWebConfiguration;
      default:
        throw new Error(`unsupported editorPlatform, ${editorStore.editorPlatform}`);
    }
  }
}
