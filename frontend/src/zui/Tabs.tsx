/* eslint-disable import/no-default-export */
import React, { ReactElement, ReactNode, useState, useEffect, useRef, createContext, useContext } from 'react';
import cx from 'classnames';
import styles from './Tabs.module.scss';
import { useConfig } from './ConfigProvider';

export type TabsType = 'line' | 'card' | 'editable-card';
export type TabsPosition = 'top' | 'right' | 'bottom' | 'left';
export type TabsSize = 'large' | 'default' | 'small';

export interface TabsProps {
  /** 当前激活 tab 面板的 key */
  activeKey?: string;
  /** 初始化选中面板的 key */
  defaultActiveKey?: string;
  /** 是否隐藏加号图标，在 type="editable-card" 时有效 */
  hideAdd?: boolean;
  /** 切换面板的回调 */
  onChange?: (activeKey: string) => void;
  /** tab 被点击的回调 */
  onTabClick?: (key: string, event: React.MouseEvent | React.KeyboardEvent) => void;
  /** tab bar 上额外的元素 */
  tabBarExtraContent?: ReactNode;
  /** tab bar 的样式对象 */
  tabBarStyle?: React.CSSProperties;
  /** 页签的基本样式 */
  type?: TabsType;
  /** 页签位置 */
  tabPosition?: TabsPosition;
  /** 新增和删除页签的回调 */
  onEdit?: (targetKey: string | React.MouseEvent, action: 'add' | 'remove') => void;
  /** 大小 */
  size?: TabsSize;
  /** 是否使用动画切换 Tabs */
  animated?: boolean;
  /** 是否销毁隐藏的标签页 */
  destroyInactiveTabPane?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 子元素 */
  children?: ReactNode;
  /** 是否使用暗色主题 */
  dark?: boolean;
  /** 自定义前缀 */
  prefixCls?: string;
}

export interface TabPaneProps {
  /** 选项卡头显示文字 */
  tab: ReactNode;
  /** 对应 activeKey */
  key: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 选项卡内容 */
  children?: ReactNode;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 是否强制渲染内容 */
  forceRender?: boolean;
  /** 自定义前缀 */
  prefixCls?: string;
  /** 关闭按钮 */
  closeIcon?: ReactNode;
}

interface TabsContextProps {
  activeKey: string;
  onTabClick: (key: string, e: React.MouseEvent | React.KeyboardEvent) => void;
}

const TabsContext = createContext<TabsContextProps | null>(null);

export const TabPane: React.FC<TabPaneProps> = (props) => {
  const {
    tab,
    children,
    className,
    style,
    disabled,
    forceRender,
    prefixCls: customizePrefixCls,
    closeIcon,
    ...rest
  } = props;

  const { getPrefixCls } = useConfig();
  const prefixCls = getPrefixCls('tabs-tabpane', customizePrefixCls);

  const tabsContext = useContext(TabsContext);
  const active = tabsContext ? tabsContext.activeKey === props.key : false;

  return (
    <div
      className={cx(
        styles.tabsTabpane,
        {
          [styles.tabsTabpaneActive]: active,
          [styles.tabsTabpaneHidden]: !active,
        },
        className
      )}
      style={style}
      {...rest}
    >
      {(active || forceRender) && children}
    </div>
  );
};

export const Tabs = (props: TabsProps): ReactElement => {
  const {
    activeKey,
    defaultActiveKey,
    hideAdd = false,
    onChange,
    onTabClick,
    tabBarExtraContent,
    tabBarStyle,
    type = 'line',
    tabPosition = 'top',
    onEdit,
    size = 'default',
    animated = true,
    destroyInactiveTabPane = false,
    className,
    style,
    children,
    dark = false,
    prefixCls: customizePrefixCls,
  } = props;

  const { getPrefixCls } = useConfig();
  const prefixCls = getPrefixCls('tabs', customizePrefixCls);

  // 内部状态
  const [innerActiveKey, setInnerActiveKey] = useState<string>(
    activeKey || defaultActiveKey || ''
  );
  const [inkStyle, setInkStyle] = useState<React.CSSProperties>({});
  const navRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLDivElement>(null);

  // 同步外部activeKey
  useEffect(() => {
    if (activeKey !== undefined) {
      setInnerActiveKey(activeKey);
    }
  }, [activeKey]);

  // 处理标签点击
  const handleTabClick = (key: string, e: React.MouseEvent | React.KeyboardEvent) => {
    if (activeKey === undefined) {
      setInnerActiveKey(key);
    }

    onTabClick?.(key, e);
    onChange?.(key);
  };

  // 处理编辑
  const handleEdit = (targetKey: string | React.MouseEvent, action: 'add' | 'remove') => {
    onEdit?.(targetKey, action);
  };

  // 处理添加
  const handleAdd = (e: React.MouseEvent) => {
    handleEdit(e, 'add');
  };

  // 处理删除
  const handleRemove = (key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    handleEdit(key, 'remove');
  };

  // 更新墨条样式
  const updateInkBar = () => {
    if (type === 'card') return;

    const activeTab = activeTabRef.current;
    if (!activeTab) return;

    const isHorizontal = tabPosition === 'top' || tabPosition === 'bottom';
    const inkBar = navRef.current?.querySelector(`.${styles.tabsInk}`);
    if (!inkBar) return;

    if (isHorizontal) {
      const left = activeTab.offsetLeft;
      const width = activeTab.offsetWidth;
      setInkStyle({
        transform: `translateX(${left}px)`,
        width: `${width}px`,
      });
    } else {
      const top = activeTab.offsetTop;
      const height = activeTab.offsetHeight;
      setInkStyle({
        transform: `translateY(${top}px)`,
        height: `${height}px`,
      });
    }
  };

  // 当活动标签或标签位置变化时更新墨条
  useEffect(() => {
    updateInkBar();
  }, [innerActiveKey, tabPosition, type]);

  // 当窗口大小变化时更新墨条
  useEffect(() => {
    const handleResize = () => {
      updateInkBar();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 提取标签页
  const panes: React.ReactElement<TabPaneProps>[] = [];
  const tabs: { key: string; tab: ReactNode; disabled?: boolean }[] = [];

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;

    const key = child.key as string;
    const { tab, disabled } = child.props as TabPaneProps;

    tabs.push({
      key,
      tab,
      disabled,
    });

    panes.push(
      React.cloneElement(child, {
        key,
        forceRender: destroyInactiveTabPane ? false : child.props.forceRender,
      })
    );
  });

  // 渲染标签
  const renderTabs = () => {
    return tabs.map((item, index) => {
      const { key, tab, disabled } = item;
      const isActive = key === innerActiveKey;

      const tabClassName = cx(styles.tabsTab, {
        [styles.tabsTabActive]: isActive,
        [styles.tabsTabDisabled]: disabled,
      });

      const handleClick = (e: React.MouseEvent) => {
        if (disabled) return;
        handleTabClick(key, e);
      };

      const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          if (disabled) return;
          handleTabClick(key, e);
        }
      };

      return (
        <div
          key={key}
          ref={isActive ? activeTabRef : null}
          className={tabClassName}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          tabIndex={disabled ? -1 : 0}
          role="tab"
          aria-selected={isActive}
          aria-disabled={disabled}
        >
          {tab}
          {type === 'editable-card' && !disabled && (
            <span
              className={styles.tabsClose}
              onClick={(e) => handleRemove(key, e)}
              role="button"
              tabIndex={0}
              aria-label="Close tab"
            >
              ×
            </span>
          )}
        </div>
      );
    });
  };

  // 渲染添加按钮
  const renderAddButton = () => {
    if (type !== 'editable-card' || hideAdd) return null;

    return (
      <div
        className={styles.tabsAdd}
        onClick={handleAdd}
        role="button"
        tabIndex={0}
        aria-label="Add tab"
      >
        +
      </div>
    );
  };

  // 计算类名
  const tabsClassName = cx(
    styles.tabs,
    {
      [styles.tabsCard]: type === 'card' || type === 'editable-card',
      [styles.tabsLarge]: size === 'large',
      [styles.tabsSmall]: size === 'small',
      [styles.tabsTop]: tabPosition === 'top',
      [styles.tabsBottom]: tabPosition === 'bottom',
      [styles.tabsLeft]: tabPosition === 'left',
      [styles.tabsRight]: tabPosition === 'right',
      [styles.dark]: dark,
    },
    className
  );

  // 创建上下文值
  const contextValue = {
    activeKey: innerActiveKey,
    onTabClick: handleTabClick,
  };

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={tabsClassName} style={style}>
        <div className={styles.tabsNav} style={tabBarStyle} ref={navRef}>
          <div className={styles.tabsNavList}>
            {renderTabs()}
            {renderAddButton()}
            <div className={styles.tabsInk} style={inkStyle} />
          </div>
          {tabBarExtraContent && <div className={styles.tabsExtra}>{tabBarExtraContent}</div>}
        </div>
        <div className={styles.tabsContent}>{panes}</div>
      </div>
    </TabsContext.Provider>
  );
};

Tabs.TabPane = TabPane;

export default Tabs;