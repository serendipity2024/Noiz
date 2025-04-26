/* eslint-disable import/no-default-export */
import React, { ReactElement, ReactNode, useState, useEffect, useRef } from 'react';
import cx from 'classnames';
import styles from './Tooltip.module.scss';
import { useConfig } from './ConfigProvider';

export type TooltipPlacement =
  | 'top'
  | 'left'
  | 'right'
  | 'bottom'
  | 'topLeft'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomRight'
  | 'leftTop'
  | 'leftBottom'
  | 'rightTop'
  | 'rightBottom';

export type TooltipTrigger = 'hover' | 'focus' | 'click' | 'contextMenu';

export type TooltipColor =
  | 'pink'
  | 'red'
  | 'yellow'
  | 'orange'
  | 'cyan'
  | 'green'
  | 'blue'
  | 'purple'
  | 'geekblue'
  | 'magenta'
  | 'volcano'
  | 'gold'
  | 'lime';

export interface TooltipProps {
  /** 提示文字 */
  title: ReactNode;
  /** 触发行为 */
  trigger?: TooltipTrigger | TooltipTrigger[];
  /** 气泡框位置 */
  placement?: TooltipPlacement;
  /** 鼠标移入后延时多少才显示 Tooltip，单位：秒 */
  mouseEnterDelay?: number;
  /** 鼠标移出后延时多少才隐藏 Tooltip，单位：秒 */
  mouseLeaveDelay?: number;
  /** 卡片是否可见 */
  visible?: boolean;
  /** 卡片显示隐藏的回调 */
  onVisibleChange?: (visible: boolean) => void;
  /** 是否使用暗色主题 */
  dark?: boolean;
  /** 浮层的类名 */
  overlayClassName?: string;
  /** 浮层的样式 */
  overlayStyle?: React.CSSProperties;
  /** 箭头是否指向目标元素中心 */
  arrowPointAtCenter?: boolean;
  /** 自定义前缀 */
  prefixCls?: string;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 子元素 */
  children: ReactNode;
  /** 浮层渲染父节点，默认渲染到 body 上 */
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
  /** 是否销毁 Tooltip 后的内容 */
  destroyTooltipOnHide?: boolean;
  /** 自定义箭头 */
  arrow?: boolean | { pointAtCenter?: boolean };
  /** 自定义颜色 */
  color?: TooltipColor | string;
}

export const Tooltip = (props: TooltipProps): ReactElement => {
  const {
    title,
    trigger = 'hover',
    placement = 'top',
    mouseEnterDelay = 0.1,
    mouseLeaveDelay = 0.1,
    visible,
    onVisibleChange,
    dark = false,
    overlayClassName,
    overlayStyle,
    arrowPointAtCenter = false,
    prefixCls: customizePrefixCls,
    className,
    style,
    children,
    getPopupContainer,
    destroyTooltipOnHide = false,
    arrow = true,
    color,
  } = props;

  const { getPrefixCls } = useConfig();
  const prefixCls = getPrefixCls('tooltip', customizePrefixCls);

  // 内部状态
  const [innerVisible, setInnerVisible] = useState<boolean>(visible || false);
  const [position, setPosition] = useState<{ left: number; top: number }>({ left: 0, top: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const enterTimer = useRef<NodeJS.Timeout>();
  const leaveTimer = useRef<NodeJS.Timeout>();

  // 同步外部visible
  useEffect(() => {
    if (visible !== undefined) {
      setInnerVisible(visible);
    }
  }, [visible]);

  // 计算位置
  const calculatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    let left = 0;
    let top = 0;

    // 计算位置
    switch (placement) {
      case 'top':
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2 + scrollLeft;
        top = triggerRect.top - tooltipRect.height + scrollTop;
        break;
      case 'topLeft':
        left = triggerRect.left + scrollLeft;
        top = triggerRect.top - tooltipRect.height + scrollTop;
        break;
      case 'topRight':
        left = triggerRect.right - tooltipRect.width + scrollLeft;
        top = triggerRect.top - tooltipRect.height + scrollTop;
        break;
      case 'bottom':
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2 + scrollLeft;
        top = triggerRect.bottom + scrollTop;
        break;
      case 'bottomLeft':
        left = triggerRect.left + scrollLeft;
        top = triggerRect.bottom + scrollTop;
        break;
      case 'bottomRight':
        left = triggerRect.right - tooltipRect.width + scrollLeft;
        top = triggerRect.bottom + scrollTop;
        break;
      case 'left':
        left = triggerRect.left - tooltipRect.width + scrollLeft;
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2 + scrollTop;
        break;
      case 'leftTop':
        left = triggerRect.left - tooltipRect.width + scrollLeft;
        top = triggerRect.top + scrollTop;
        break;
      case 'leftBottom':
        left = triggerRect.left - tooltipRect.width + scrollLeft;
        top = triggerRect.bottom - tooltipRect.height + scrollTop;
        break;
      case 'right':
        left = triggerRect.right + scrollLeft;
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2 + scrollTop;
        break;
      case 'rightTop':
        left = triggerRect.right + scrollLeft;
        top = triggerRect.top + scrollTop;
        break;
      case 'rightBottom':
        left = triggerRect.right + scrollLeft;
        top = triggerRect.bottom - tooltipRect.height + scrollTop;
        break;
      default:
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2 + scrollLeft;
        top = triggerRect.top - tooltipRect.height + scrollTop;
    }

    // 如果箭头指向中心
    if (arrowPointAtCenter || (arrow && typeof arrow === 'object' && arrow.pointAtCenter)) {
      // 调整位置使箭头指向中心
      if (placement.startsWith('top') || placement.startsWith('bottom')) {
        left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2 + scrollLeft;
      } else if (placement.startsWith('left') || placement.startsWith('right')) {
        top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2 + scrollTop;
      }
    }

    // 防止超出视口
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (left < 0) {
      left = 0;
    } else if (left + tooltipRect.width > viewportWidth) {
      left = viewportWidth - tooltipRect.width;
    }

    if (top < 0) {
      top = 0;
    } else if (top + tooltipRect.height > viewportHeight) {
      top = viewportHeight - tooltipRect.height;
    }

    setPosition({ left, top });
  };

  // 处理显示
  const handleShow = () => {
    if (enterTimer.current) {
      clearTimeout(enterTimer.current);
    }

    enterTimer.current = setTimeout(() => {
      setInnerVisible(true);
      onVisibleChange?.(true);

      // 计算位置
      setTimeout(calculatePosition, 0);
    }, mouseEnterDelay * 1000);
  };

  // 处理隐藏
  const handleHide = () => {
    if (leaveTimer.current) {
      clearTimeout(leaveTimer.current);
    }

    leaveTimer.current = setTimeout(() => {
      setInnerVisible(false);
      onVisibleChange?.(false);
    }, mouseLeaveDelay * 1000);
  };

  // 处理点击
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (innerVisible) {
      handleHide();
    } else {
      handleShow();
    }
  };

  // 处理上下文菜单
  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleShow();
  };

  // 处理触发器事件
  const getTriggerProps = () => {
    const triggerProps: React.HTMLAttributes<HTMLDivElement> = {};
    const triggerList = Array.isArray(trigger) ? trigger : [trigger];

    if (triggerList.includes('hover')) {
      triggerProps.onMouseEnter = handleShow;
      triggerProps.onMouseLeave = handleHide;
    }

    if (triggerList.includes('focus')) {
      triggerProps.onFocus = handleShow;
      triggerProps.onBlur = handleHide;
    }

    if (triggerList.includes('click')) {
      triggerProps.onClick = handleClick;
    }

    if (triggerList.includes('contextMenu')) {
      triggerProps.onContextMenu = handleContextMenu;
    }

    return triggerProps;
  };

  // 处理窗口大小变化
  useEffect(() => {
    if (innerVisible) {
      window.addEventListener('resize', calculatePosition);
      window.addEventListener('scroll', calculatePosition);
    }

    return () => {
      window.removeEventListener('resize', calculatePosition);
      window.removeEventListener('scroll', calculatePosition);
    };
  }, [innerVisible]);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (enterTimer.current) {
        clearTimeout(enterTimer.current);
      }
      if (leaveTimer.current) {
        clearTimeout(leaveTimer.current);
      }
    };
  }, []);

  // 计算类名
  const tooltipClassName = cx(
    styles.tooltip,
    styles[`tooltipPlacement${placement.charAt(0).toUpperCase() + placement.slice(1)}`],
    {
      [styles.tooltipHidden]: !innerVisible,
      [styles.dark]: dark,
      [styles[`tooltip${color?.charAt(0).toUpperCase() + color?.slice(1)}`]]: color && typeof color === 'string' && /^[a-zA-Z]+$/.test(color),
    },
    overlayClassName
  );

  // 计算样式
  const tooltipStyle: React.CSSProperties = {
    ...style,
    ...position,
    ...overlayStyle,
  };

  // 如果是自定义颜色
  if (color && !/^[a-zA-Z]+$/.test(color)) {
    tooltipStyle.backgroundColor = color;
  }

  // 渲染箭头
  const renderArrow = () => {
    if (!arrow) return null;

    const arrowStyle: React.CSSProperties = {};
    if (color && !/^[a-zA-Z]+$/.test(color)) {
      arrowStyle.backgroundColor = color;
    }

    return <div className={styles.tooltipArrow} style={arrowStyle} />;
  };

  // 渲染内容
  const renderContent = () => {
    if (!innerVisible && destroyTooltipOnHide) {
      return null;
    }

    return (
      <div
        ref={tooltipRef}
        className={tooltipClassName}
        style={tooltipStyle}
        onMouseEnter={trigger === 'hover' ? handleShow : undefined}
        onMouseLeave={trigger === 'hover' ? handleHide : undefined}
      >
        {renderArrow()}
        {title}
      </div>
    );
  };

  // 获取容器
  const getContainer = () => {
    if (!getPopupContainer) {
      return document.body;
    }
    if (!triggerRef.current) {
      return document.body;
    }
    return getPopupContainer(triggerRef.current);
  };

  // 渲染触发器
  const renderTrigger = () => {
    return (
      <div ref={triggerRef} className={className} {...getTriggerProps()}>
        {children}
      </div>
    );
  };

  return (
    <>
      {renderTrigger()}
      {typeof window !== 'undefined' && document.body
        ? React.createPortal(renderContent(), getContainer())
        : null}
    </>
  );
};

export default Tooltip;