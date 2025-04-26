/* eslint-disable import/no-default-export */
import React, { ReactElement, ReactNode, useState, useRef, useEffect } from 'react';
import cx from 'classnames';
import styles from './Dropdown.module.scss';
import { useConfig } from './ConfigProvider';

export type Trigger = 'click' | 'hover' | 'contextMenu';
export type Placement = 'topLeft' | 'topCenter' | 'topRight' | 'bottomLeft' | 'bottomCenter' | 'bottomRight';

export interface DropdownProps {
  /** 菜单 */
  overlay: ReactNode;
  /** 触发下拉的行为 */
  trigger?: Trigger[];
  /** 菜单是否显示 */
  visible?: boolean;
  /** 菜单显示状态改变时的回调 */
  onVisibleChange?: (visible: boolean) => void;
  /** 菜单弹出位置 */
  placement?: Placement;
  /** 是否显示箭头 */
  arrow?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 下拉根元素的类名 */
  className?: string;
  /** 下拉根元素的样式 */
  style?: React.CSSProperties;
  /** 菜单的类名 */
  overlayClassName?: string;
  /** 菜单的样式 */
  overlayStyle?: React.CSSProperties;
  /** 自定义前缀 */
  prefixCls?: string;
  /** 下拉菜单打开后的类名 */
  openClassName?: string;
  /** 鼠标移入后延时多少才显示菜单，单位：秒 */
  mouseEnterDelay?: number;
  /** 鼠标移出后延时多少才隐藏菜单，单位：秒 */
  mouseLeaveDelay?: number;
  /** 菜单渲染父节点 */
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
  /** 子元素 */
  children?: ReactNode;
}

export const Dropdown = (props: DropdownProps): ReactElement => {
  const {
    overlay,
    trigger = ['hover'],
    visible: propsVisible,
    onVisibleChange,
    placement = 'bottomLeft',
    arrow = false,
    disabled = false,
    className,
    style,
    overlayClassName,
    overlayStyle,
    prefixCls: customizePrefixCls,
    openClassName,
    mouseEnterDelay = 0.15,
    mouseLeaveDelay = 0.1,
    getPopupContainer,
    children,
  } = props;

  const { getPrefixCls } = useConfig();
  const prefixCls = getPrefixCls('dropdown', customizePrefixCls);

  // 控制下拉菜单的显示状态
  const [visible, setVisible] = useState(propsVisible || false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mouseEnterTimer = useRef<NodeJS.Timeout>();
  const mouseLeaveTimer = useRef<NodeJS.Timeout>();

  // 同步外部visible属性
  useEffect(() => {
    if (propsVisible !== undefined) {
      setVisible(propsVisible);
    }
  }, [propsVisible]);

  // 处理可见性变化
  const handleVisibleChange = (newVisible: boolean) => {
    if (disabled) {
      return;
    }

    if (propsVisible === undefined) {
      setVisible(newVisible);
    }

    if (onVisibleChange) {
      onVisibleChange(newVisible);
    }
  };

  // 处理点击事件
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (trigger.includes('click')) {
      handleVisibleChange(!visible);
    }
  };

  // 处理鼠标进入事件
  const handleMouseEnter = () => {
    if (mouseLeaveTimer.current) {
      clearTimeout(mouseLeaveTimer.current);
      mouseLeaveTimer.current = undefined;
    }

    if (trigger.includes('hover')) {
      mouseEnterTimer.current = setTimeout(() => {
        handleVisibleChange(true);
      }, mouseEnterDelay * 1000);
    }
  };

  // 处理鼠标离开事件
  const handleMouseLeave = () => {
    if (mouseEnterTimer.current) {
      clearTimeout(mouseEnterTimer.current);
      mouseEnterTimer.current = undefined;
    }

    if (trigger.includes('hover')) {
      mouseLeaveTimer.current = setTimeout(() => {
        handleVisibleChange(false);
      }, mouseLeaveDelay * 1000);
    }
  };

  // 处理右键菜单事件
  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    if (trigger.includes('contextMenu')) {
      e.preventDefault();
      handleVisibleChange(true);
    }
  };

  // 处理点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        visible &&
        triggerRef.current &&
        dropdownRef.current &&
        !triggerRef.current.contains(e.target as Node) &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        handleVisibleChange(false);
      }
    };

    if (visible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [visible]);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (mouseEnterTimer.current) {
        clearTimeout(mouseEnterTimer.current);
      }
      if (mouseLeaveTimer.current) {
        clearTimeout(mouseLeaveTimer.current);
      }
    };
  }, []);

  // 定位下拉菜单
  useEffect(() => {
    if (visible && triggerRef.current && dropdownRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const dropdownRect = dropdownRef.current.getBoundingClientRect();
      const { scrollX, scrollY } = window;

      let top = 0;
      let left = 0;

      // 根据placement计算位置
      switch (placement) {
        case 'topLeft':
          top = triggerRect.top + scrollY - dropdownRect.height;
          left = triggerRect.left + scrollX;
          break;
        case 'topCenter':
          top = triggerRect.top + scrollY - dropdownRect.height;
          left = triggerRect.left + scrollX + (triggerRect.width - dropdownRect.width) / 2;
          break;
        case 'topRight':
          top = triggerRect.top + scrollY - dropdownRect.height;
          left = triggerRect.left + scrollX + triggerRect.width - dropdownRect.width;
          break;
        case 'bottomLeft':
          top = triggerRect.bottom + scrollY;
          left = triggerRect.left + scrollX;
          break;
        case 'bottomCenter':
          top = triggerRect.bottom + scrollY;
          left = triggerRect.left + scrollX + (triggerRect.width - dropdownRect.width) / 2;
          break;
        case 'bottomRight':
          top = triggerRect.bottom + scrollY;
          left = triggerRect.left + scrollX + triggerRect.width - dropdownRect.width;
          break;
        default:
          break;
      }

      // 应用位置
      if (dropdownRef.current) {
        dropdownRef.current.style.top = `${top}px`;
        dropdownRef.current.style.left = `${left}px`;
      }
    }
  }, [visible, placement]);

  // 渲染下拉菜单
  const renderDropdown = () => {
    if (!visible) {
      return null;
    }

    const dropdownClass = cx(
      styles.dropdownContent,
      {
        [styles.hidden]: !visible,
        [styles[`placement${placement.charAt(0).toUpperCase() + placement.slice(1)}`]]: true,
      },
      overlayClassName
    );

    const popupContainer = getPopupContainer ? getPopupContainer(triggerRef.current!) : document.body;

    return (
      <div
        ref={dropdownRef}
        className={dropdownClass}
        style={overlayStyle}
      >
        {arrow && <div className={styles.arrow} />}
        {overlay}
      </div>
    );
  };

  // 渲染触发器
  const renderTrigger = () => {
    const triggerClass = cx(
      styles.trigger,
      {
        [openClassName || `${prefixCls}-open`]: visible,
      }
    );

    // 克隆子元素并添加事件处理器
    return React.cloneElement(children as React.ReactElement, {
      className: cx((children as React.ReactElement).props.className, triggerClass),
      onClick: (e: React.MouseEvent<HTMLElement>) => {
        handleClick(e as React.MouseEvent<HTMLDivElement>);
        if ((children as React.ReactElement).props.onClick) {
          (children as React.ReactElement).props.onClick(e);
        }
      },
      onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
        handleMouseEnter();
        if ((children as React.ReactElement).props.onMouseEnter) {
          (children as React.ReactElement).props.onMouseEnter(e);
        }
      },
      onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
        handleMouseLeave();
        if ((children as React.ReactElement).props.onMouseLeave) {
          (children as React.ReactElement).props.onMouseLeave(e);
        }
      },
      onContextMenu: (e: React.MouseEvent<HTMLElement>) => {
        handleContextMenu(e as React.MouseEvent<HTMLDivElement>);
        if ((children as React.ReactElement).props.onContextMenu) {
          (children as React.ReactElement).props.onContextMenu(e);
        }
      },
    });
  };

  // 渲染下拉组件
  return (
    <div
      className={cx(styles.dropdown, className)}
      style={style}
      ref={triggerRef}
    >
      <div
        className={cx(styles.dropdownWrap, {
          [styles.open]: visible,
        })}
      >
        {renderTrigger()}
      </div>
      {renderDropdown()}
    </div>
  );
};

export default Dropdown;