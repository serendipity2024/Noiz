import React, { ReactElement, ReactNode, useEffect, useState } from 'react';
import { Menu as AntdMenu } from 'antd';
import _ from 'lodash';
import styles from './Menu.module.scss';
import { ZInput } from '.';

export interface MenuClickEventInfo {
  key: React.Key;
  keyPath: React.Key[];
  item: React.ReactInstance;
  domEvent: React.MouseEvent<HTMLElement>;
}

interface BaseMenuItem {
  key: React.Key;
  disabled?: boolean;
  onClick?: (info: MenuClickEventInfo) => void;
  subMenu?: MenuProps;
}

interface CustomHeaderMenuItem extends BaseMenuItem {
  headerComponent: ReactNode;
}

export interface StringHeaderMenuItem extends BaseMenuItem {
  title: string;
  icon?: React.ReactNode;
}

const isCustomHeaderItem = (item: MenuItem): item is CustomHeaderMenuItem =>
  _.has(item, 'headerComponent');

export type MenuItem = CustomHeaderMenuItem | StringHeaderMenuItem;

interface BaseMenuProps {
  onClick?: (info: MenuClickEventInfo) => void;
  children?: ReactNode;
}

interface FilterMenuProps extends BaseMenuProps {
  items: StringHeaderMenuItem[];
  dynamicLoadData?: () => StringHeaderMenuItem[];
  enableFilter: true;
}

interface NormalMenuProps extends BaseMenuProps {
  items: MenuItem[];
  dynamicLoadData?: () => MenuItem[];
  enableFilter?: false;
}

export type MenuProps = FilterMenuProps | NormalMenuProps;

export const Menu = (props: MenuProps): ReactElement => {
  const { enableFilter, onClick, dynamicLoadData } = props;
  const [items, setItems] = useState<MenuItem[]>(props.items);
  const [filter, setFilter] = useState<string>('');
  useEffect(() => {
    if (!enableFilter) return;
    setItems(
      props.items
        ? props.items.filter((item) => !isCustomHeaderItem(item) && item.title.indexOf(filter) > -1)
        : []
    );
  }, [filter]);
  if (items.length === 0 && dynamicLoadData) setItems(dynamicLoadData());

  return (
    <div className={styles.menuContainer}>
      <AntdMenu
        onClick={onClick}
        className={styles.mainBody}
        triggerSubMenuAction="click"
        subMenuCloseDelay={60}
      >
        {enableFilter ? (
          <AntdMenu.Item key="input" disabled className={styles.menuItem}>
            <ZInput autoFocus value={filter} onChange={(value) => setFilter(value.target.value)} />
          </AntdMenu.Item>
        ) : null}
        {(items ?? []).map((item) =>
          item.subMenu ? (
            SubMenu(item)
          ) : (
            <AntdMenu.Item
              key={item.key}
              className={styles.menuItem}
              onClick={item.onClick}
              disabled={item.disabled}
              icon={isCustomHeaderItem(item) ? null : item.icon}
            >
              {isCustomHeaderItem(item) ? item.headerComponent : item.title}
            </AntdMenu.Item>
          )
        )}
        {props.children}
      </AntdMenu>
    </div>
  );
};

const SubMenu = (props: MenuItem): ReactElement => {
  const subMenu = props.subMenu as MenuProps;
  const [items, setItems] = useState<MenuItem[]>(subMenu.items);
  const [filter, setFilter] = useState<string>('');
  useEffect(() => {
    if (!subMenu.enableFilter) return;
    setItems(
      subMenu.items
        ? subMenu.items.filter(
            (item) => !isCustomHeaderItem(item) && item.title.indexOf(filter) > -1
          )
        : []
    );
  }, [filter]);

  if (items.length === 0 && subMenu.dynamicLoadData) setItems(subMenu.dynamicLoadData());

  return (
    <AntdMenu.SubMenu
      key={props.key}
      title={isCustomHeaderItem(props) ? props.headerComponent : props.title}
      disabled={props.disabled}
      icon={isCustomHeaderItem(props) ? null : props.icon}
      popupClassName={styles.subMenu}
    >
      {subMenu.enableFilter ? (
        <AntdMenu.Item key="input" disabled className={styles.menuItem}>
          <ZInput autoFocus value={filter} onChange={(value) => setFilter(value.target.value)} />
        </AntdMenu.Item>
      ) : null}
      {(items ?? []).map((item) =>
        item.subMenu ? (
          SubMenu(item)
        ) : (
          <AntdMenu.Item
            key={item.key}
            className={styles.menuItem}
            onClick={item.onClick}
            disabled={item.disabled}
            icon={isCustomHeaderItem(item) ? null : item.icon}
          >
            {isCustomHeaderItem(item) ? item.headerComponent : item.title}
          </AntdMenu.Item>
        )
      )}
    </AntdMenu.SubMenu>
  );
};
