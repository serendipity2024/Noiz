/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import { CascaderOptionType } from 'antd/lib/cascader';
import uniqid from 'uniqid';
import { DataDependency, DataDependencyType } from '../../mobx/stores/ValidationStore';
import { DataBinding } from '../../shared/type-definition/DataBinding';
import {
  EventBinding,
  EventType,
  NavigationActionHandleBinding,
  NavigationOperation,
  ScreenTransitionType,
} from '../../shared/type-definition/EventBinding';
import { EventExtraActionProps, EventProps } from '../interfaces/EventModel';
import { ShortId } from '../../shared/type-definition/ZTypes';
import { AllStores } from '../../mobx/StoreContexts';
import { ZedSupportedPlatform } from '../interfaces/ComponentModel';
import StoreHelpers from '../../mobx/StoreHelpers';
import NavigationActionRow from '../../components/side-drawer-tabs/right-drawer/action-row/NavigationActionRow';
import { BaseActionModel } from '../base/BaseActionModel';
import { DiffPathComponent } from '../../shared/type-definition/Diff';
import { UserFlow, useSelectionTrigger } from '../../hooks/useUserFlowTrigger';
import { EditorMode } from '../interfaces/EditorInfo';
import useStores from '../../hooks/useStores';
import ArrowIcon from '../../shared/assets/icons/arrow-with-tail-right.svg';
import { Button } from '../../zui';

export class NavigationActionModel extends BaseActionModel {
  public readonly type: EventType = EventType.NAVIGATION;

  public getDefaultEventBinding(obj: any): EventBinding {
    return {
      ...obj,
      type: EventType.NAVIGATION,
    };
  }

  public getDependentList(
    eventBinding: NavigationActionHandleBinding,
    diffPathComponents: DiffPathComponent[]
  ): DataDependency[] {
    const targetMRef = [
      ...AllStores.coreStore.wechatRootMRefs,
      ...AllStores.coreStore.mobileWebRootMRefs,
    ].find((screenMRef) => {
      const screenModel = AllStores.coreStore.getModel(screenMRef);
      if (!screenModel) return false;
      return screenModel.mRef === eventBinding.targetMRef;
    });
    if (!targetMRef) return [];
    return [
      {
        id: uniqid.process(),
        dependencyType: DataDependencyType.COMPONENT,
        targetMRef,
        diffPathComponents,
        relation: eventBinding,
      },
    ];
  }

  public getCascaderOption(): CascaderOptionType {
    const availableNavigations = [
      {
        name: NavigationOperation.GO_BACK,
        value: NavigationOperation.GO_BACK,
        operation: NavigationOperation.GO_BACK,
        isLeaf: true,
      },
      ...this.getScreenMRefs().map((mRef) => {
        const screen = StoreHelpers.findComponentModelOrThrow(mRef);
        const args = {} as Record<string, DataBinding>;
        Object.entries(screen.variableTable).forEach(([key, variable]) => {
          args[key] = DataBinding.withSingleValue(variable.itemType ?? variable.type);
        });
        return {
          targetMRef: screen.mRef,
          name: screen.componentName,
          value: screen.mRef,
          operation: NavigationOperation.GO,
          transition: StoreHelpers.screenContainsTabBar(screen.mRef)
            ? ScreenTransitionType.SWITCH_TO
            : ScreenTransitionType.PUSH,
          args,
          isLeaf: true,
        };
      }),
    ];
    return {
      name: this.getName().action[this.type],
      value: this.type,
      fields: availableNavigations,
      isLeaf: false,
    };
  }

  public renderForConfigRow(props: EventProps): React.ReactNode {
    const { componentModel, event, onChange } = props;
    return (
      <NavigationActionRow componentModel={componentModel} event={event} onEventChange={onChange} />
    );
  }

  public renderForExtraAction(props: EventExtraActionProps): React.ReactNode {
    const superAction = super.renderForExtraAction(props);
    const { editorStore } = useStores();
    const utf = useSelectionTrigger();

    const renderJumpToButton = (event: EventBinding) => {
      if (
        (event as NavigationActionHandleBinding).operation === NavigationOperation.GO_BACK &&
        !(event as NavigationActionHandleBinding).targetMRef
      ) {
        return null;
      }
      return (
        <Button
          type="text"
          style={styles.jumptoIcon}
          icon={<img alt="" style={styles.arrow} src={ArrowIcon} />}
          onClick={(e) => {
            e.stopPropagation();
            jumpToPage(event);
          }}
        />
      );
    };
    const jumpToPage = (event: EventBinding) => {
      const target = (event as NavigationActionHandleBinding).targetMRef;

      if (
        editorStore.editorState.target === target &&
        editorStore.editorState.mode === EditorMode.FOCUS
      ) {
        return;
      }
      utf(UserFlow.FOCUS_TARGET)(target);
      editorStore.setSingleClickAndRightDrawerTarget(null);
    };
    return (
      <>
        {renderJumpToButton(props.event)}
        {superAction}
      </>
    );
  }

  private getScreenMRefs(): ShortId[] {
    const { coreStore, editorStore } = AllStores;
    let screenMRefs: ShortId[] = [];
    switch (editorStore.editorPlatform) {
      case ZedSupportedPlatform.WECHAT:
        screenMRefs = coreStore.wechatRootMRefs;
        break;

      case ZedSupportedPlatform.MOBILE_WEB:
        screenMRefs = coreStore.mobileWebRootMRefs;
        break;
      case ZedSupportedPlatform.WEB:
        screenMRefs = coreStore.webRootMRefs;
        break;
      default:
        break;
    }
    return screenMRefs;
  }
}

const styles: Record<string, React.CSSProperties> = {
  jumptoIcon: {
    fontSize: '15px',
    top: '-2px',
    paddingRight: '5px',
  },
};
