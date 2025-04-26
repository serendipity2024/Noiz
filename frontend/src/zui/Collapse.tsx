import React, { ReactElement, ComponentProps } from 'react';
import _ from 'lodash';
import cx from 'classnames';
import { Collapse as AntdCollapse } from 'antd';
import { filterNotNullOrUndefined } from '../utils/utils';
import styles from './Collapse.module.scss';

export interface CustomHeaderCollapseItem {
  headerComponent: ReactElement;
  key: string;
  content: ReactElement;
}

export interface StringHeaderCollapseItem {
  title: string;
  icon?: ReactElement | false;
  content: ReactElement;
}

export type CollapseItem = CustomHeaderCollapseItem | StringHeaderCollapseItem;
const isCustomHeaderItem = (item: CollapseItem): item is CustomHeaderCollapseItem =>
  _.has(item, 'headerComponent');

const getItemKey = (item: CollapseItem) => (isCustomHeaderItem(item) ? item.key : item.title);

interface BaseCollapseProps {
  className?: string;
  items: CollapseItem[];
  defaultOpenIndex?: number;
  size?: 'large' | 'small';
  bordered?: boolean;
  noBackground?: boolean;
  noContentPadding?: boolean;
  noHeaderHighlight?: boolean;
  hideArrows?: boolean;

  // TODO(geoff): There used to be a global CSS rule that sets the font color of
  // collapse contents. Then each use site overwrote that rule as needed, which
  // is silly. We shouldn't have the global in the first place. For historical
  // reasons, we can't just remove the global. So for new use sites, one should
  // opt out. Once every place has opted out, we can remove it.
  setContentFontColorToOrangeBecauseHistoryIsCruel?: boolean;
}

interface SingularCollapseProps extends BaseCollapseProps {
  hasUnstableId?: false;
  allowMultiple?: false;
  activeIndex?: number;
  onActiveIndexChange?: (index: number) => void;
}

interface MultiCollapseProps extends BaseCollapseProps {
  hasUnstableId?: false;
  allowMultiple: true;
  activeIndices?: number[];
  onActiveIndicesChange?: (indices: number[]) => void;
}

interface UnstableIdSingularCollapseProps extends BaseCollapseProps {
  hasUnstableId: true;
  allowMultiple?: false;
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
}

interface UnstableIdMultiCollapseProps extends BaseCollapseProps {
  hasUnstableId: true;
  allowMultiple: true;
  activeIndices: number[];
  onActiveIndicesChange: (indices: number[]) => void;
}

export type CollapseProps =
  | UnstableIdSingularCollapseProps
  | UnstableIdMultiCollapseProps
  | SingularCollapseProps
  | MultiCollapseProps;

export const Collapse = (props: CollapseProps): ReactElement => {
  const {
    className = '',
    items,
    defaultOpenIndex = -1,
    bordered,
    noBackground,
    noContentPadding,
    noHeaderHighlight,
    hideArrows,
    allowMultiple,
    size = 'small',
    setContentFontColorToOrangeBecauseHistoryIsCruel,
  } = props;

  const getKeyForIndex = (index: number) => {
    if (index < 0 || index >= items.length) {
      return undefined;
    }
    return getItemKey(items[index]);
  };

  const getIndexForKey = (key: string) => {
    if (_.isUndefined(key)) return -1;
    return items.findIndex((item) => getItemKey(item) === key);
  };

  const activeKeyProps: Partial<ComponentProps<typeof AntdCollapse>> = {};
  if (props.allowMultiple) {
    if (props.activeIndices) {
      activeKeyProps.activeKey = filterNotNullOrUndefined(props.activeIndices.map(getKeyForIndex));
    }
    if (props.onActiveIndicesChange) {
      activeKeyProps.onChange = (keys: any /* string[] */) =>
        // If prop is not null now, then it's probably not null when the
        // callback is invoked, but Typescript doesn't know that.
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        props.onActiveIndicesChange!(
          // Yes this is quadratic. Yes it could be linear. But if n is bounded,
          // anything is, in theory, constant.
          keys.map(getIndexForKey)
        );
    }
  } else {
    if (!_.isUndefined(props.activeIndex)) {
      activeKeyProps.activeKey = getKeyForIndex(props.activeIndex);
    }
    if (props.onActiveIndexChange) {
      activeKeyProps.onChange = (key: any /* string */) =>
        // If prop is not null now, then it's probably not null when the
        // callback is invoked, but Typescript doesn't know that.
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        props.onActiveIndexChange!(getIndexForKey(key));
    }
  }

  return (
    <div
      className={cx(styles.container, {
        [className]: className,
        [styles.bordered]: bordered,
        [styles.noBackground]: noBackground,
        [styles.noContentPadding]: noContentPadding,
        [styles.noHeaderHighlight]: noHeaderHighlight,
        [styles.sizeLarge]: size === 'large',
        [styles.orangeContent]: setContentFontColorToOrangeBecauseHistoryIsCruel,
      })}
    >
      <AntdCollapse
        className={styles.collapse}
        defaultActiveKey={getKeyForIndex(defaultOpenIndex)}
        accordion={!allowMultiple}
        {...activeKeyProps}
      >
        {items.map((item) =>
          isCustomHeaderItem(item) ? (
            <AntdCollapse.Panel
              className={styles.customItem}
              header={item.headerComponent}
              key={item.key}
              showArrow={!hideArrows}
            >
              {item.content}
            </AntdCollapse.Panel>
          ) : (
            <AntdCollapse.Panel
              className={cx({
                [styles.noArrow]: hideArrows,
                [styles.noIcon]: !item.icon,
              })}
              header={<div className={styles.textTitle}>{item.title}</div>}
              key={item.title}
              extra={item.icon}
              showArrow={!hideArrows}
            >
              {item.content}
            </AntdCollapse.Panel>
          )
        )}
      </AntdCollapse>
    </div>
  );
};
