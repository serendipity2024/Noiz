/* eslint-disable import/no-default-export */
import React, { ReactElement, ReactNode, useState, useEffect, useRef } from 'react';
import cx from 'classnames';
import styles from './Popover.module.scss';
import { useConfig } from './ConfigProvider';

export type PopoverPlacement =
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

export type PopoverTrigger = 'hover' | 'focus' | 'click' | 'contextMenu';

export interface PopoverProps {
  /** 卡片内容 */
  content: ReactNode;
  /** 卡片标题 */
  title?: ReactNode;
  /** 触发行为 */
  trigger?: PopoverTrigger | PopoverTrigger[];
  /** 气泡框位置 */
  placement?: PopoverPlacement;
  /** 鼠标移入后延时多少才显示 Popover，单位：秒 */
  mouseEnterDelay?: number;
  /** 鼠标移出后延时多少才隐藏 Popover，单位：秒 */
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
  /** 卡片内容区域的样式 */
  contentStyle?: React.CSSProperties;
  /** 卡片标题区域的样式 */
  titleStyle?: React.CSSProperties;
  /** 是否销毁 Popover 后的内容 */
  destroyTooltipOnHide?: boolean;
  /** 自定义箭头 */
  arrow?: boolean | { pointAtCenter?: boolean };
  /** 自定义颜色 */
  color?: string;
}

export const Popover = (props: PopoverProps): ReactElement => {
  const {
    content,
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
    contentStyle,
    titleStyle,
    destroyTooltipOnHide = false,
    arrow = true,
    color,
  } = props;

  const { getPrefixCls } = useConfig();
  const prefixCls = getPrefixCls('popover', customizePrefixCls);

  // 内部状态
  const [innerVisible, setInnerVisible] = useState<boolean>(visible || false);
  const [position, setPosition] = useState<{ left: number; top: number }>({ left: 0, top: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const enterTimer = useRef<NodeJS.Timeout>();
  const leaveTimer = useRef<NodeJS.Timeout>();

  // 同步外部visible
  useEffect(() => {
    if (visible !== undefined) {
      setInnerVisible(visible);
    }
  }, [visible]);

  // 处理位置计算
  const calculatePosition = () => {
    if (!triggerRef.current || !popoverRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const popoverRect = popoverRef.current.getBoundingClientRect();
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    let left = 0;
    let top = 0;

    // 计算位置
    switch (placement) {
      case 'top':
        left = triggerRect.left + (triggerRect.width - popoverRect.width) / 2 + scrollLeft;
        top = triggerRect.top - popoverRect.height + scrollTop;
        break;
      case 'topLeft':
        left = triggerRect.left + scrollLeft;
        top = triggerRect.top - popoverRect.height + scrollTop;
        break;
      case 'topRight':
        left = triggerRect.right - popoverRect.width + scrollLeft;
        top = triggerRect.top - popoverRect.height + scrollTop;
        break;
      case 'bottom':
        left = triggerRect.left + (triggerRect.width - popoverRect.width) / 2 + scrollLeft;
        top = triggerRect.bottom + scrollTop;
        break;
      case 'bottomLeft':
        left = triggerRect.left + scrollLeft;
        top = triggerRect.bottom + scrollTop;
        break;
      case 'bottomRight':
        left = triggerRect.right - popoverRect.width + scrollLeft;
        top = triggerRect.bottom + scrollTop;
        break;
      case 'left':
        left = triggerRect.left - popoverRect.width + scrollLeft;
        top = triggerRect.top + (triggerRect.height - popoverRect.height) / 2 + scrollTop;
        break;
      case 'leftTop':
        left = triggerRect.left - popoverRect.width + scrollLeft;
        top = triggerRect.top + scrollTop;
        break;
      case 'leftBottom':
        left = triggerRect.left - popoverRect.width + scrollLeft;
        top = triggerRect.bottom - popoverRect.height + scrollTop;
        break;
      case 'right':
        left = triggerRect.right + scrollLeft;
        top = triggerRect.top + (triggerRect.height - popoverRect.height) / 2 + scrollTop;
        break;
      case 'rightTop':
        left = triggerRect.right + scrollLeft;
        top = triggerRect.top + scrollTop;
        break;
      case 'rightBottom':
        left = triggerRect.right + scrollLeft;
        top = triggerRect.bottom - popoverRect.height + scrollTop;
        break;
      default:
        left = triggerRect.left + (triggerRect.width - popoverRect.width) / 2 + scrollLeft;
        top = triggerRect.top - popoverRect.height + scrollTop;
    }

    // 如果箭头指向中心
    if (arrowPointAtCenter || (arrow && typeof arrow === 'object' && arrow.pointAtCenter)) {
      // 调整位置使箭头指向中心
      if (placement.startsWith('top') || placement.startsWith('bottom')) {
        left = triggerRect.left + triggerRect.width / 2 - popoverRect.width / 2 + scrollLeft;
      } else if (placement.startsWith('left') || placement.startsWith('right')) {
        top = triggerRect.top + triggerRect.height / 2 - popoverRect.height / 2 + scrollTop;
      }
    }

    // 防止超出视口
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (left < 0) {
      left = 0;
    } else if (left + popoverRect.width > viewportWidth) {
      left = viewportWidth - popoverRect.width;
    }

    if (top < 0) {
      top = 0;
    } else if (top + popoverRect.height > viewportHeight) {
      top = viewportHeight - popoverRect.height;
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
  const popoverClassName = cx(
    styles.popover,
    styles[`popoverPlacement${placement.charAt(0).toUpperCase() + placement.slice(1)}`],
    {
      [styles.popoverHidden]: !innerVisible,
      [styles.dark]: dark,
    },
    overlayClassName
  );

  // 计算样式
  const popoverStyle: React.CSSProperties = {
    ...style,
    ...position,
    ...overlayStyle,
    ...(color ? { backgroundColor: color, borderColor: color } : {}),
  };

  // 渲染箭头
  const renderArrow = () => {
    if (!arrow) return null;

    const arrowStyle: React.CSSProperties = {};
    if (color) {
      arrowStyle.backgroundColor = color;
      arrowStyle.borderColor = color;
    }

    return <div className={styles.popoverArrow} style={arrowStyle} />;
  };

  // 渲染内容
  const renderContent = () => {
    if (!innerVisible && destroyTooltipOnHide) {
      return null;
    }

    return (
      <div
        ref={popoverRef}
        className={popoverClassName}
        style={popoverStyle}
        onMouseEnter={trigger === 'hover' ? handleShow : undefined}
        onMouseLeave={trigger === 'hover' ? handleHide : undefined}
      >
        {renderArrow()}
        <div className={styles.popoverInner}>
          {title && (
            <div className={styles.popoverTitle} style={titleStyle}>
              {title}
            </div>
          )}
          <div className={styles.popoverContent} style={contentStyle}>
            {content}
          </div>
        </div>
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

export default Popover;