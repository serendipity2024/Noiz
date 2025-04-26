/* eslint-disable import/no-default-export */
/* eslint-disable react/no-children-prop */
import { observer } from 'mobx-react';
import React, { CSSProperties, ReactElement, ReactNode } from 'react';
import {
  ConnectDropTarget,
  DropTarget,
  DropTargetConnector,
  DropTargetMonitor,
  XYCoord,
} from 'react-dnd';
import ReactDOM from 'react-dom';
import ComponentDiff from '../../diffs/ComponentDiff';
import useModel from '../../hooks/useModel';
import { AllStores } from '../../mobx/StoreContexts';
import StoreHelpers from '../../mobx/StoreHelpers';
import BaseContainerModel from '../../models/base/BaseContainerModel';
import BaseMobileComponentModel from '../../models/base/BaseMobileComponentModel';
import BaseMobileContainerModel from '../../models/base/BaseMobileContainerModel';
import ComponentModelBuilder from '../../models/ComponentModelBuilder';
import { ZPosition } from '../../models/interfaces/Frame';
import { ComponentModelType } from '../../shared/type-definition/ComponentModelType';
import { ShortId } from '../../shared/type-definition/ZTypes';
import ZDndType from './ZDndTypes';
import { ZNavigationBarArea } from './ZNavigationBarArea';
import ZComponentSelectionWrapper from '../base/ZComponentSelectionWrapper';
import { ZMoveableClassName } from '../../utils/ZConst';
import { ComponentTemplate } from '../../mobx/stores/CoreStoreDataType';
import ZNotification from '../../utils/notifications/ZNotifications';
import i18n from '../../utils/notifications/ZNotifications.i18n.json';
import { message } from '../../zui';
import { ZTabBarArea } from './ZTabBarArea';

export const getOutterStyle = (
  model: BaseContainerModel,
  backgroundStyles?: React.CSSProperties
): CSSProperties => {
  let result: Record<string, any> = {
    borderRadius: model.isRootContainer ? '5px' : '0px',
  };
  if (backgroundStyles) {
    result = {
      ...result,
      ...backgroundStyles,
    };
  }
  return result as CSSProperties;
};
@observer
class ZDroppableAreaInner extends React.Component<ZDroppableAreaProps> {
  getModelByMRef = (mRef: ShortId) => AllStores.coreStore.getModel(mRef);

  addChildComponent = (payload: ChildComponentManipulationPayload) =>
    AllStores.coreStore.processComponentModel(payload.parentMRef, (model) =>
      (model as BaseContainerModel).childMRefs.push(payload.childMRef)
    );

  /*
   * ==================================================
   * child component manipulations
   * ==================================================
   */
  addComponent(componentType: ComponentModelType, clientOffset: XYCoord | null, name?: string) {
    const parent = this.props.model;
    const position = this.getAbsolutePositionToParent(clientOffset);
    const newComponent = ComponentModelBuilder.buildByType(
      parent.mRef,
      componentType
    ) as BaseMobileComponentModel;
    newComponent.setComponentFrame({
      ...newComponent.getComponentFrame(),
      position: {
        x: position.x - newComponent.getComponentFrame().size.width / 2,
        y: position.y - newComponent.getComponentFrame().size.height / 2,
      },
    });
    if (name) newComponent.componentName = name;
    const diffItems = [
      ComponentDiff.buildAddChildMRefsDiff(parent.mRef, [newComponent.mRef]),
      ...newComponent.onCreateComponentDiffs(),
    ];
    AllStores.diffStore.applyDiff(diffItems);
  }

  addTemplateComponent(
    clientOffset: XYCoord | null,
    componentTemplate: ComponentTemplate,
    name?: string
  ) {
    const parent = this.props.model;

    // component templates cannot nest itself
    let hasLoop = false;
    let previousMRef = parent.mRef;
    while (previousMRef && !hasLoop) {
      hasLoop = previousMRef === componentTemplate.rootMRef;
      if (!hasLoop) {
        const model = StoreHelpers.findComponentModelOrThrow(previousMRef);
        previousMRef = model.parentMRef;
      }
    }
    if (hasLoop) {
      const { locale } = AllStores.persistedStore;
      const notif = new ZNotification(i18n[locale]);
      notif.send('COMPONENT_TEMPLATES_CANNOT_NEST_ITSELF');
      return;
    }

    const position = this.getAbsolutePositionToParent(clientOffset);
    const templateComponentModel = StoreHelpers.findComponentModelOrThrow(
      componentTemplate.rootMRef
    );
    const newComponent = templateComponentModel.createCopy(parent.mRef) as BaseMobileComponentModel;

    newComponent.setComponentFrame({
      ...newComponent.getComponentFrame(),
      position: {
        x: position.x - newComponent.getComponentFrame().size.width / 2,
        y: position.y - newComponent.getComponentFrame().size.height / 2,
      },
    });
    if (name) newComponent.componentName = name;
    const diffItems = [
      ComponentDiff.buildAddChildMRefsDiff(parent.mRef, [newComponent.mRef]),
      ...newComponent.onCreateComponentDiffs(),
    ];
    AllStores.diffStore.applyDiff(diffItems);
  }

  getAbsolutePositionToParent(clientOffset: XYCoord | null): ZPosition {
    const { scale } = AllStores.editorStore;
    const selfOffsetX = this.props.model.getComponentFrame().position?.x ?? 0;
    const selfOffsetY = this.props.model.getComponentFrame().position?.y ?? 0;
    // eslint-disable-next-line react/no-find-dom-node
    const rect: DOMRect | undefined =
      // eslint-disable-next-line react/no-find-dom-node
      ReactDOM.findDOMNode(this)?.parentElement?.getBoundingClientRect();
    let x: number = ((clientOffset?.x ?? 0) - (rect?.x ?? 0)) / scale;
    let y: number = ((clientOffset?.y ?? 0) - (rect?.y ?? 0)) / scale;
    if (this.props.model.isRootContainer) {
      x -= selfOffsetX;
      y -= selfOffsetY;
    }
    return { x, y };
  }

  /*
   * ==================================================
   * main view
   * ==================================================
   */
  renderPreview() {
    const { model, canDrop, isOver, connectDropTarget, backgroundStyles } = this.props;
    const containerSize = model.getComponentFrame().size;
    const items = model.children();
    const isContainsTabBar = StoreHelpers.screenContainsTabBar(model.mRef);

    const isActive = canDrop && isOver;
    let innerBackgroundColor = 'transparent';
    if (isActive) {
      innerBackgroundColor = 'darkgreen';
    } else if (canDrop) {
      innerBackgroundColor = 'darkkhaki';
    }
    const innerStyle = { ...styles.fullSize, backgroundColor: innerBackgroundColor };

    return (
      <div style={getOutterStyle(model, backgroundStyles)}>
        <div ref={connectDropTarget} style={innerStyle}>
          <div style={{ ...containerSize, ...styles.contentContainer }}>
            {items.map((item) =>
              item.type === ComponentModelType.WECHAT_NAVIGATION_BAR ||
              item.type === ComponentModelType.MOBILE_NAVIGATION_BAR ? (
                <ZNavigationBarArea key={item.mRef} componentModel={item} />
              ) : (
                <ZComponentSelectionWrapper key={item.mRef} component={item} draggable>
                  {item.renderForPreview()}
                </ZComponentSelectionWrapper>
              )
            )}
            {this.props.children}
            {isContainsTabBar && <ZTabBarArea key={model.mRef} screenMRef={model.mRef} />}
          </div>
        </div>
      </div>
    );
  }

  /*
   * ==================================================
   * main render
   * ==================================================
   */
  render() {
    if (!this.props.model || !this.props.model.isContainer) return null;

    // TODO: ZRightDrawer move will appear: ReferenceError: Cannot access 'BaseSlotModel' before initialization
    return (
      <div
        className={`${ZMoveableClassName.SNAPPABLE} ${ZMoveableClassName.SNAPPABLE}_${this.props.model.mRef}`}
      >
        {this.renderPreview()}
      </div>
    );
  }
}

/*
 * ==================================================
 * interfaces for props and states
 * ==================================================
 */
interface ZDroppableAreaPublicProps {
  mRef: ShortId;

  children?: ReactNode;
  droppable?: boolean;
  backgroundStyles?: React.CSSProperties;
}

interface ZDroppableAreaDndProps {
  model: BaseMobileContainerModel;

  canDrop: boolean;
  isOver: boolean;
  connectDropTarget: ConnectDropTarget;
}

export interface ZDroppableAreaProps extends ZDroppableAreaPublicProps, ZDroppableAreaDndProps {}

/*
 * ==================================================
 * styles
 * ==================================================
 */
const styles: Record<string, React.CSSProperties> = {
  fullSize: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    position: 'relative',
    overflow: 'visible',
  },
};

/*
 * ==================================================
 * dnd related
 * ==================================================
 */
const dropTargetTypes = (props: ZDroppableAreaProps) => {
  const droppable = props.droppable ?? true;
  if (!droppable) {
    return [];
  }
  const model = StoreHelpers.getComponentModel(props.mRef) as BaseContainerModel;
  if (!model) return [];
  return [ZDndType.CONTENT, ZDndType.LIST_CONTAINER];
};

const dropTargetSpec = {
  drop: (
    props: ZDroppableAreaProps,
    monitor: DropTargetMonitor,
    component: ZDroppableAreaInner
  ) => {
    if (!component) {
      return;
    }
    const clientOffset: XYCoord | null = monitor.getClientOffset();
    const { componentType, componentTemplate, componentName } = monitor.getItem();
    if (componentType === ComponentModelType.UNKNOWN) {
      if (!componentTemplate) throw new Error('drop templateComponent error');
      component.addTemplateComponent(clientOffset, componentTemplate, componentName);
    } else if (!componentDraggable(componentType, props.model)) {
      message.error(`Can not drag ${componentType} to this container`);
    } else {
      if (componentType === ComponentModelType.WECHAT_OFFICIAL_ACCOUNT) {
        const wechatOfficialAccountCount = StoreHelpers.getWechatOfficialAccountCount(
          component.props.model.childMRefs
        );
        if (wechatOfficialAccountCount) {
          message.error(`A page can have only one ${componentType} component`);
          return;
        }
      }
      component.addComponent(componentType, clientOffset, componentName);
    }
  },
};

const componentTypeMatchable = (componentType: any): boolean => {
  return (
    componentType === ComponentModelType.CUSTOM_LIST ||
    componentType === ComponentModelType.HORIZONTAL_LIST ||
    componentType === ComponentModelType.TAB_VIEW ||
    componentType === ComponentModelType.SELECT_VIEW
  );
};

const componentDraggable = (componentType: any, model: BaseMobileContainerModel): boolean => {
  const targetComponentType = model.parent()?.type;
  if (componentType === ComponentModelType.CUSTOM_MULTI_IMAGE_PICKER) {
    return !componentTypeMatchable(targetComponentType);
  }
  if (targetComponentType === ComponentModelType.CUSTOM_MULTI_IMAGE_PICKER) {
    return !componentTypeMatchable(componentType);
  }
  if (componentType === ComponentModelType.WECHAT_OFFICIAL_ACCOUNT) {
    return model.type === ComponentModelType.MOBILE_PAGE;
  }
  return true;
};

const dropTargetCollect = (
  dragTargetConnector: DropTargetConnector,
  monitor: DropTargetMonitor
) => ({
  connectDropTarget: dragTargetConnector.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
});

const ConnectedZDroppableAreaInner = DropTarget(
  dropTargetTypes,
  dropTargetSpec,
  dropTargetCollect
)(ZDroppableAreaInner);

/*
 * ==================================================
 * export
 * ==================================================
 */
export default function ZDroppableArea(props: ZDroppableAreaPublicProps): ReactElement {
  const model = useModel<BaseMobileContainerModel>(props.mRef);
  if (!model) return <div />;

  return (
    <ConnectedZDroppableAreaInner
      mRef={props.mRef}
      model={model}
      droppable={props.droppable}
      backgroundStyles={props.backgroundStyles}
    >
      {props.children}
    </ConnectedZDroppableAreaInner>
  );
}

interface ChildComponentManipulationPayload {
  parentMRef: ShortId;
  childMRef: ShortId;
}
