import { observer } from 'mobx-react';
import React from 'react';
import useColorBinding from '../../hooks/useColorBinding';
import { DataBinding } from '../../shared/type-definition/DataBinding';
import { BaseType } from '../../shared/type-definition/DataModel';
import { NullableReactElement, ShortId } from '../../shared/type-definition/ZTypes';
import { DefaultTabBarHeight, ZColors, ZThemedColors } from '../../utils/ZConst';
import { ConfigIcon } from '../side-drawer-tabs/right-drawer/shared/ConfigIcon';
import { Row } from '../../zui';
import { TabBarItem, TabBarSetting } from '../../mobx/stores/CoreStoreDataType';
import { useConfiguration } from '../../hooks/useConfiguration';

export const DefaultTabBarSetting: TabBarSetting = {
  backgroundColor: DataBinding.withColor(ZColors.WHITE_LIKE_GREY),
  color: DataBinding.withColor(ZColors.BLACK),
  selectedColor: DataBinding.withColor(ZThemedColors.ACCENT),
  items: [
    {
      mRef: 'First Tab',
      icon: DataBinding.withLiteral('home.png'),
      selectedIcon: DataBinding.withLiteral('home.png'),
      title: DataBinding.withLiteral('Home'),
      isHidden: DataBinding.withLiteral(false, BaseType.BOOLEAN),
      screenMRef: DataBinding.withLiteral(''),
    },
    {
      mRef: 'Second Tab',
      icon: DataBinding.withLiteral('globe.png'),
      selectedIcon: DataBinding.withLiteral('globe.png'),
      title: DataBinding.withLiteral('Globe'),
      isHidden: DataBinding.withLiteral(true, BaseType.BOOLEAN),
      screenMRef: DataBinding.withLiteral(''),
    },
    {
      mRef: 'Third Tab',
      icon: DataBinding.withLiteral('chat.png'),
      selectedIcon: DataBinding.withLiteral('chat.png'),
      title: DataBinding.withLiteral('Chat'),
      isHidden: DataBinding.withLiteral(true, BaseType.BOOLEAN),
      screenMRef: DataBinding.withLiteral(''),
    },
    {
      mRef: 'Fourth Tab',
      icon: DataBinding.withLiteral('profile.png'),
      selectedIcon: DataBinding.withLiteral('profile.png'),
      title: DataBinding.withLiteral('Profile'),
      isHidden: DataBinding.withLiteral(true, BaseType.BOOLEAN),
      screenMRef: DataBinding.withLiteral(''),
    },
    {
      mRef: 'Fifth Tab',
      icon: DataBinding.withLiteral('cart.png'),
      selectedIcon: DataBinding.withLiteral('cart.png'),
      title: DataBinding.withLiteral('cart'),
      isHidden: DataBinding.withLiteral(true, BaseType.BOOLEAN),
      screenMRef: DataBinding.withLiteral(''),
    },
  ],
};

export const internalTabBarItemScreenMRef = (
  item: TabBarItem,
  screenMRef: ShortId | undefined
): TabBarItem => {
  const mRef = screenMRef ?? '';
  return {
    ...item,
    screenMRef: DataBinding.withLiteral(mRef),
    isHidden: DataBinding.withLiteral(!(mRef.length > 0), BaseType.BOOLEAN),
  };
};

export const ZTabBar = observer((props: { screenMRef: ShortId }): NullableReactElement => {
  const cb = useColorBinding();
  const { tabBarSetting } = useConfiguration();
  if (!tabBarSetting) {
    return null;
  }

  // styles
  const backgroundColor = cb(tabBarSetting.backgroundColor);
  const selectedColor = cb(tabBarSetting.selectedColor);
  const color = cb(tabBarSetting.color);

  const tabs: TabBarItem[] = tabBarSetting.items.filter(
    (item: TabBarItem) => !item.isHidden.effectiveValue
  );

  return (
    <div style={{ backgroundColor, ...styles.container }}>
      <div style={styles.divider} />
      <Row align="middle" justify="space-around" style={styles.itemRow}>
        {tabs.map((item: TabBarItem) => {
          const textColor =
            props.screenMRef === item.screenMRef.effectiveValue ? selectedColor : color;
          const icon =
            props.screenMRef === item.screenMRef.effectiveValue
              ? item.selectedIcon.effectiveValue
              : item.icon.effectiveValue;
          return (
            <div style={styles.item} key={item.title.effectiveValue}>
              <ConfigIcon icon={icon} />
              <label style={{ ...styles.title, color: textColor }}>
                {item.title.effectiveValue}
              </label>
            </div>
          );
        })}
      </Row>
    </div>
  );
});

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: '100%',
    height: DefaultTabBarHeight,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  divider: {
    background: '#ccc',
    width: '100%',
    height: 2,
  },
  item: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemRow: {
    height: '100%',
  },
  title: {
    fontSize: '10px',
  },
};
