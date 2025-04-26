/* eslint-disable import/no-default-export */
/* eslint-disable no-restricted-globals */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { observer } from 'mobx-react';
import React from 'react';
import useColorBinding from '../../hooks/useColorBinding';
import useModel from '../../hooks/useModel';
import useStores from '../../hooks/useStores';
import StoreHelpers from '../../mobx/StoreHelpers';
import BaseComponentModel from '../../models/base/BaseComponentModel';
import BlankContainerModel from '../../models/mobile-components/BlankContainerModel';
import TabViewModel from '../../models/mobile-components/TabViewModel';
import ZFrame from '../../models/interfaces/Frame';
import { DataBinding, DataBindingKind } from '../../shared/type-definition/DataBinding';
import { IntegerType } from '../../shared/type-definition/DataModel';
import { NullableReactElement, ShortId } from '../../shared/type-definition/ZTypes';
import { ZColors } from '../../utils/ZConst';
import { MRefProp } from './PropTypes';
import ZBlankContainer from './ZBlankContainer';
import { Row } from '../../zui';

export enum TabViewMode {
  NORMAL = 'normal',
  CUSTOM = 'custom',
}

export const ZTabViewDefaultDataAttributes = {
  tabHeight: 42,
  backgroundColor: DataBinding.withColor(ZColors.WHITE_LIKE_GREY),
  selectedIndex: DataBinding.withLiteral(0, IntegerType.INTEGER),
  tabList: [
    {
      title: DataBinding.withTextVariable([{ kind: DataBindingKind.LITERAL, value: 'Tab 1' }]),
      mRef: '',
    },
    {
      title: DataBinding.withTextVariable([{ kind: DataBindingKind.LITERAL, value: 'Tab 2' }]),
      mRef: '',
    },
  ] as TabViewItem[],

  mode: TabViewMode.NORMAL,
  normalTabMRef: '',
  selectedTabMRef: '',
};

export interface TabViewItem {
  title: DataBinding;
  mRef: ShortId;
}

export type TabViewAttributes = typeof ZTabViewDefaultDataAttributes;

export const ZTabViewDefaultFrame: ZFrame = {
  size: { width: 375, height: 180 },
  position: { x: 0, y: 0 },
};

export default observer(function ZTabView(props: MRefProp): NullableReactElement {
  const cb = useColorBinding();
  const { coreStore } = useStores();
  const model = useModel<TabViewModel>(props.mRef);

  if (!model) return null;

  const { tabSelectedIndex } = model;

  // styles
  const dataAttributes = model.dataAttributes as TabViewAttributes;
  const { tabList, tabHeight } = dataAttributes;
  const backgroundColor = cb(dataAttributes.backgroundColor);

  function renderTabContainer() {
    const itemWidth = `${(1 / tabList.length) * 100}%`;
    return (
      <Row
        align="middle"
        justify="start"
        style={{ ...styles.tabContanier, height: tabHeight, backgroundColor: 'white' }}
      >
        {tabList.map((tabItem, index) => {
          const lineHeight = index === tabSelectedIndex ? '1px' : '0px';
          const itemColor = index === tabSelectedIndex ? ZColors.LIGHT_BLUE : ZColors.LIGHT_BLACK;
          return (
            <div
              key={tabItem.title.effectiveValue}
              style={{
                ...styles.tabItem,
                width: itemWidth,
              }}
            >
              <div style={{ ...styles.tabTitle, color: itemColor }}>
                {tabItem.title.effectiveValue}
              </div>
              <div
                style={{
                  ...styles.tabLine,
                  height: lineHeight,
                  backgroundColor: itemColor,
                }}
              />
            </div>
          );
        })}
      </Row>
    );
  }

  function renderCustomTabContainer() {
    const itemWidth = Math.floor((model?.getComponentFrame().size.width ?? 0) / tabList.length);
    const normalTabModel = StoreHelpers.getComponentModel(dataAttributes.normalTabMRef);
    const selectedTabModel = StoreHelpers.getComponentModel(dataAttributes.selectedTabMRef);

    if (!normalTabModel || !selectedTabModel)
      throw new Error(`custom tab error, ${JSON.stringify(model)}`);

    return (
      <Row align="middle" justify="start" style={styles.tabContanier}>
        {tabList.map((tabItem, index) => {
          return (
            <div
              key={tabItem.title.effectiveValue}
              style={{
                height: normalTabModel.getComponentFrame().size.height,
                width: itemWidth,
                position: 'relative',
              }}
            >
              <ZBlankContainer
                mRef={index === tabSelectedIndex ? selectedTabModel.mRef : normalTabModel.mRef}
              />
            </div>
          );
        })}
      </Row>
    );
  }

  function renderTabItem() {
    const target = tabList[tabSelectedIndex].mRef;
    const itemContainerModel = coreStore.getModel(target) as BlankContainerModel;

    const renderChild = (component: BaseComponentModel) => {
      const style: React.CSSProperties = {
        left: component.getComponentFrame().position?.x,
        top: component.getComponentFrame().position?.y,
        width: component.getComponentFrame().size.width,
        height: component.getComponentFrame().size.height,
        ...styles.cellComponentContainer,
      };
      return (
        <div key={component.mRef} style={style}>
          {component.renderForPreview()}
        </div>
      );
    };

    return (
      <div
        style={{
          ...itemContainerModel.getComponentFrame().size,
          ...styles.cell,
        }}
      >
        {itemContainerModel.children().map(renderChild)}
      </div>
    );
  }

  return (
    <div style={{ ...styles.container, backgroundColor }}>
      {dataAttributes.mode === TabViewMode.NORMAL ? renderTabContainer() : null}
      {dataAttributes.mode === TabViewMode.CUSTOM ? renderCustomTabContainer() : null}
      <div style={{ ...styles.resizable }}>
        <div style={styles.contentContainer}>{renderTabItem()}</div>
      </div>
    </div>
  );
});

const styles: Record<string, React.CSSProperties> = {
  container: {
    overflow: 'hidden',
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    width: '100%',
    height: '100%',
  },
  resizable: {
    overflow: 'hidden',
  },
  tabContanier: {
    flexWrap: 'nowrap',
    overflow: 'hidden',
  },
  tabItem: {
    height: '100%',
    minWidth: '18%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center',
    position: 'sticky',
  },
  tabTitle: {
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    wordBreak: 'break-all',
    WebkitLineClamp: 1,
  },
  tabLine: {
    position: 'absolute',
    bottom: '0px',
    width: '100%',
  },
  cell: {
    position: 'relative',
    overflow: 'hidden',
  },
  cellComponentContainer: {
    position: 'absolute',
    pointerEvents: 'none',
  },
};
