/* eslint-disable import/no-default-export */
import React, { ReactElement, ReactNode, useState, useRef, useEffect, createContext, useContext } from 'react';
import cx from 'classnames';
import styles from './ZMenu.module.scss';
import { useConfig } from './ConfigProvider';

export type MenuMode = 'vertical' | 'horizontal' | 'inline';
export type MenuTheme = 'light' | 'dark';
export type MenuSelectionMode = 'none' | 'single' | 'multiple';

export interface MenuClickEventInfo {
  key: React.Key;
  keyPath: React.Key[];
  item: React.ReactInstance;
  domEvent: React.MouseEvent<HTMLElement>;
}

export interface MenuInfo {
  key: React.Key;
  keyPath: React.Key[];
  item: React.ReactInstance;
  domEvent: React.MouseEvent<HTMLElement>;
}

export interface SubMenuInfo {
  key: React.Key;
  domEvent: React.MouseEvent<HTMLElement>;
}

export interface MenuItemProps {
  /** 菜单项的唯一标志 */
  key: React.Key;
  /** 菜单项的标题 */
  title?: ReactNode;
  /** 菜单项的图标 */
  icon?: ReactNode;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否选中 */
  selected?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 子元素 */
  children?: ReactNode;
  /** 点击事件 */
  onClick?: (info: MenuClickEventInfo) => void;
}

export interface SubMenuProps {
  /** 子菜单的唯一标志 */
  key: React.Key;
  /** 子菜单的标题 */
  title?: ReactNode;
  /** 子菜单的图标 */
  icon?: ReactNode;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否展开 */
  open?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 子元素 */
  children?: ReactNode;
  /** 点击事件 */
  onClick?: (info: SubMenuInfo) => void;
  /** 展开/关闭的回调 */
  onOpenChange?: (open: boolean) => void;
}

export interface MenuItemGroupProps {
  /** 分组的标题 */
  title?: ReactNode;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 子元素 */
  children?: ReactNode;
}

export interface MenuDividerProps {
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
}

export interface MenuProps {
  /** 初始选中的菜单项 key 数组 */
  defaultSelectedKeys?: React.Key[];
  /** 当前选中的菜单项 key 数组 */
  selectedKeys?: React.Key[];
  /** 初始展开的 SubMenu 菜单项 key 数组 */
  defaultOpenKeys?: React.Key[];
  /** 当前展开的 SubMenu 菜单项 key 数组 */
  openKeys?: React.Key[];
  /** 菜单类型 */
  mode?: MenuMode;
  /** 主题颜色 */
  theme?: MenuTheme;
  /** 是否允许选中 */
  selectable?: boolean;
  /** 选择模式 */
  selectionMode?: MenuSelectionMode;
  /** 是否允许多选 */
  multiple?: boolean;
  /** 是否内联模式下折叠 */
  inlineCollapsed?: boolean;
  /** 菜单项点击事件 */
  onClick?: (info: MenuClickEventInfo) => void;
  /** 选中菜单项改变事件 */
  onSelect?: (info: MenuInfo) => void;
  /** 取消选中菜单项事件 */
  onDeselect?: (info: MenuInfo) => void;
  /** 打开/关闭子菜单事件 */
  onOpenChange?: (openKeys: React.Key[]) => void;
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
  /** 菜单项数据 */
  items?: {
    key: React.Key;
    title?: ReactNode;
    icon?: ReactNode;
    disabled?: boolean;
    children?: {
      key: React.Key;
      title?: ReactNode;
      icon?: ReactNode;
      disabled?: boolean;
      children?: any[];
    }[];
  }[];
}

interface MenuContextProps {
  mode: MenuMode;
  theme: MenuTheme;
  selectable: boolean;
  selectionMode: MenuSelectionMode;
  multiple: boolean;
  inlineCollapsed: boolean;
  selectedKeys: React.Key[];
  openKeys: React.Key[];
  onItemClick: (info: MenuClickEventInfo) => void;
  onSubMenuClick: (info: SubMenuInfo) => void;
  onOpenChange: (key: React.Key, open: boolean) => void;
}

const MenuContext = createContext<MenuContextProps>({
  mode: 'vertical',
  theme: 'light',
  selectable: true,
  selectionMode: 'single',
  multiple: false,
  inlineCollapsed: false,
  selectedKeys: [],
  openKeys: [],
  onItemClick: () => {},
  onSubMenuClick: () => {},
  onOpenChange: () => {},
});

export const MenuItem = (props: MenuItemProps): ReactElement => {
  const {
    key,
    title,
    icon,
    disabled = false,
    selected,
    className,
    style,
    children,
    onClick,
  } = props;

  const {
    mode,
    selectable,
    selectedKeys,
    onItemClick,
  } = useContext(MenuContext);

  // 处理点击
  const handleClick = (e: React.MouseEvent<HTMLLIElement>) => {
    if (disabled) return;

    const info: MenuClickEventInfo = {
      key,
      keyPath: [key],
      item: e.currentTarget,
      domEvent: e,
    };

    onClick?.(info);
    onItemClick(info);
  };

  // 计算类名
  const itemClassName = cx(
    styles.menuItem,
    {
      [styles[`menuItem${mode.charAt(0).toUpperCase() + mode.slice(1)}`]]: true,
      [styles.menuItemActive]: selectable && selectedKeys.includes(key),
      [styles.menuItemSelected]: selectable && selectedKeys.includes(key),
      [styles.menuItemDisabled]: disabled,
    },
    className
  );

  return (
    <li
      key={key}
      className={itemClassName}
      style={style}
      onClick={handleClick}
      aria-disabled={disabled}
    >
      {icon && <span className={styles.menuItemIcon}>{icon}</span>}
      {title || children}
    </li>
  );
};

export const SubMenu = (props: SubMenuProps): ReactElement => {
  const {
    key,
    title,
    icon,
    disabled = false,
    open,
    className,
    style,
    children,
    onClick,
    onOpenChange,
  } = props;

  const {
    mode,
    openKeys,
    onSubMenuClick,
    onOpenChange: contextOnOpenChange,
  } = useContext(MenuContext);

  // 内部状态
  const [innerOpen, setInnerOpen] = useState<boolean>(open !== undefined ? open : openKeys.includes(key));
  const subMenuRef = useRef<HTMLLIElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  // 同步外部open
  useEffect(() => {
    if (open !== undefined) {
      setInnerOpen(open);
    } else {
      setInnerOpen(openKeys.includes(key));
    }
  }, [open, openKeys, key]);

  // 处理点击
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;

    const info: SubMenuInfo = {
      key,
      domEvent: e,
    };

    onClick?.(info);
    onSubMenuClick(info);

    if (mode === 'inline') {
      const newOpen = !innerOpen;
      if (open === undefined) {
        setInnerOpen(newOpen);
      }
      onOpenChange?.(newOpen);
      contextOnOpenChange(key, newOpen);
    }
  };

  // 处理鼠标进入
  const handleMouseEnter = () => {
    if (disabled || mode === 'inline') return;

    if (open === undefined) {
      setInnerOpen(true);
    }
    onOpenChange?.(true);
    contextOnOpenChange(key, true);
  };

  // 处理鼠标离开
  const handleMouseLeave = () => {
    if (disabled || mode === 'inline') return;

    if (open === undefined) {
      setInnerOpen(false);
    }
    onOpenChange?.(false);
    contextOnOpenChange(key, false);
  };

  // 计算类名
  const subMenuClassName = cx(
    styles.subMenu,
    className
  );

  // 计算标题类名
  const titleClassName = cx(
    styles.subMenuTitle,
    {
      [styles[`subMenuTitle${mode.charAt(0).toUpperCase() + mode.slice(1)}`]]: true,
      [styles.subMenuTitleActive]: innerOpen,
      [styles.subMenuTitleDisabled]: disabled,
    }
  );

  // 计算箭头类名
  const arrowClassName = cx(
    styles.subMenuArrow,
    {
      [styles[`subMenuArrow${mode.charAt(0).toUpperCase() + mode.slice(1)}`]]: true,
      [styles.subMenuArrowOpen]: innerOpen && mode === 'inline',
    }
  );

  // 计算弹出层类名
  const popupClassName = cx(
    styles.subMenuPopup,
    {
      [styles.subMenuPopupHidden]: !innerOpen,
      [styles[`subMenuPopupPlacement${mode === 'horizontal' ? 'BottomLeft' : 'RightTop'}`]]: true,
    }
  );

  // 渲染子菜单
  const renderChildren = () => {
    if (mode === 'inline') {
      return (
        <ul
          className={cx(styles.menu, {
            [styles.menuInline]: true,
            [styles.hidden]: !innerOpen,
          })}
        >
          {children}
        </ul>
      );
    }

    return (
      <div
        ref={popupRef}
        className={popupClassName}
      >
        <ul
          className={cx(styles.menu, {
            [styles.menuVertical]: true,
          })}
        >
          {children}
        </ul>
      </div>
    );
  };

  return (
    <li
      ref={subMenuRef}
      className={subMenuClassName}
      style={style}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={titleClassName}
        onClick={handleClick}
        aria-disabled={disabled}
      >
        {icon && <span className={styles.menuItemIcon}>{icon}</span>}
        {title}
        <span className={arrowClassName}>
          {mode === 'inline' ? '▾' : '▸'}
        </span>
      </div>
      {renderChildren()}
    </li>
  );
};

export const MenuItemGroup = (props: MenuItemGroupProps): ReactElement => {
  const {
    title,
    className,
    style,
    children,
  } = props;

  return (
    <li className={cx(styles.menuItemGroup, className)} style={style}>
      <div className={styles.menuItemGroupTitle}>{title}</div>
      <ul>{children}</ul>
    </li>
  );
};

export const MenuDivider = (props: MenuDividerProps): ReactElement => {
  const {
    className,
    style,
  } = props;

  return (
    <li className={cx(styles.menuItemDivider, className)} style={style} />
  );
};

export const ZMenu = (props: MenuProps): ReactElement => {
  const {
    defaultSelectedKeys = [],
    selectedKeys,
    defaultOpenKeys = [],
    openKeys,
    mode = 'vertical',
    theme = 'light',
    selectable = true,
    selectionMode = 'single',
    multiple = false,
    inlineCollapsed = false,
    onClick,
    onSelect,
    onDeselect,
    onOpenChange,
    className,
    style,
    children,
    dark = false,
    prefixCls: customizePrefixCls,
    items,
  } = props;

  const { getPrefixCls } = useConfig();
  const prefixCls = getPrefixCls('menu', customizePrefixCls);

  // 内部状态
  const [innerSelectedKeys, setInnerSelectedKeys] = useState<React.Key[]>(
    selectedKeys || defaultSelectedKeys
  );
  const [innerOpenKeys, setInnerOpenKeys] = useState<React.Key[]>(
    openKeys || defaultOpenKeys
  );

  // 同步外部状态
  useEffect(() => {
    if (selectedKeys) {
      setInnerSelectedKeys(selectedKeys);
    }
  }, [selectedKeys]);

  useEffect(() => {
    if (openKeys) {
      setInnerOpenKeys(openKeys);
    }
  }, [openKeys]);

  // 处理菜单项点击
  const handleItemClick = (info: MenuClickEventInfo) => {
    onClick?.(info);

    if (!selectable) return;

    const { key } = info;
    let newSelectedKeys: React.Key[] = [...innerSelectedKeys];

    if (selectionMode === 'single') {
      newSelectedKeys = [key];
    } else if (selectionMode === 'multiple') {
      if (newSelectedKeys.includes(key)) {
        newSelectedKeys = newSelectedKeys.filter((k) => k !== key);
        onDeselect?.({
          ...info,
          keyPath: [key],
        });
      } else {
        newSelectedKeys = [...newSelectedKeys, key];
      }
    }

    if (selectedKeys === undefined) {
      setInnerSelectedKeys(newSelectedKeys);
    }

    onSelect?.({
      ...info,
      keyPath: [key],
    });
  };

  // 处理子菜单点击
  const handleSubMenuClick = (info: SubMenuInfo) => {
    // 子菜单点击事件
  };

  // 处理子菜单展开/关闭
  const handleOpenChange = (key: React.Key, open: boolean) => {
    let newOpenKeys: React.Key[] = [...innerOpenKeys];

    if (open) {
      if (!newOpenKeys.includes(key)) {
        newOpenKeys = [...newOpenKeys, key];
      }
    } else {
      newOpenKeys = newOpenKeys.filter((k) => k !== key);
    }

    if (openKeys === undefined) {
      setInnerOpenKeys(newOpenKeys);
    }

    onOpenChange?.(newOpenKeys);
  };

  // 计算类名
  const menuClassName = cx(
    styles.menu,
    {
      [styles[`menu${mode.charAt(0).toUpperCase() + mode.slice(1)}`]]: true,
      [styles.menuInlineCollapsed]: mode === 'inline' && inlineCollapsed,
      [styles.dark]: dark || theme === 'dark',
    },
    className
  );

  // 渲染菜单项
  const renderMenuItems = () => {
    if (items && items.length > 0) {
      return items.map((item) => {
        if (item.children && item.children.length > 0) {
          return (
            <SubMenu
              key={item.key}
              title={item.title}
              icon={item.icon}
              disabled={item.disabled}
            >
              {item.children.map((child) => (
                <MenuItem
                  key={child.key}
                  title={child.title}
                  icon={child.icon}
                  disabled={child.disabled}
                />
              ))}
            </SubMenu>
          );
        }
        return (
          <MenuItem
            key={item.key}
            title={item.title}
            icon={item.icon}
            disabled={item.disabled}
          />
        );
      });
    }
    return children;
  };

  return (
    <MenuContext.Provider
      value={{
        mode,
        theme,
        selectable,
        selectionMode,
        multiple,
        inlineCollapsed,
        selectedKeys: innerSelectedKeys,
        openKeys: innerOpenKeys,
        onItemClick: handleItemClick,
        onSubMenuClick: handleSubMenuClick,
        onOpenChange: handleOpenChange,
      }}
    >
      <ul className={menuClassName} style={style}>
        {renderMenuItems()}
      </ul>
    </MenuContext.Provider>
  );
};

ZMenu.Item = MenuItem;
ZMenu.SubMenu = SubMenu;
ZMenu.ItemGroup = MenuItemGroup;
ZMenu.Divider = MenuDivider;

export default ZMenu;