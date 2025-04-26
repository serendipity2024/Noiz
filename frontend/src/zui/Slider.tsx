/* eslint-disable import/no-default-export */
import React, { ReactElement, useState, useRef, useEffect } from 'react';
import cx from 'classnames';
import styles from './Slider.module.scss';
import { useConfig } from './ConfigProvider';

export interface SliderMarks {
  [key: number]: React.ReactNode | {
    style?: React.CSSProperties;
    label?: React.ReactNode;
  };
}

export interface SliderProps {
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否垂直 */
  vertical?: boolean;
  /** 范围刻度 */
  marks?: SliderMarks;
  /** 最大值 */
  max?: number;
  /** 最小值 */
  min?: number;
  /** 步长 */
  step?: number;
  /** 当前值 */
  value?: number;
  /** 默认值 */
  defaultValue?: number;
  /** 是否显示提示气泡 */
  tooltip?: boolean;
  /** 是否只能拖拽到刻度上 */
  dots?: boolean;
  /** 是否包含关系 */
  included?: boolean;
  /** 值变化时的回调函数 */
  onChange?: (value: number) => void;
  /** 拖拽结束后的回调函数 */
  onAfterChange?: (value: number) => void;
  /** 是否使用暗色主题 */
  dark?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 自定义前缀 */
  prefixCls?: string;
  /** 自定义提示内容 */
  tipFormatter?: (value: number) => React.ReactNode;
  /** 自定义轨道样式 */
  railStyle?: React.CSSProperties;
  /** 自定义轨道激活部分样式 */
  trackStyle?: React.CSSProperties;
  /** 自定义滑块样式 */
  handleStyle?: React.CSSProperties;
  /** 自定义刻度样式 */
  dotStyle?: React.CSSProperties;
  /** 自定义激活刻度样式 */
  activeDotStyle?: React.CSSProperties;
  /** 自定义标签样式 */
  markStyle?: React.CSSProperties;
  /** 自定义激活标签样式 */
  activeMarkStyle?: React.CSSProperties;
}

export const Slider = (props: SliderProps): ReactElement => {
  const {
    disabled = false,
    vertical = false,
    marks = {},
    max = 100,
    min = 0,
    step = 1,
    value,
    defaultValue = 0,
    tooltip = true,
    dots = false,
    included = true,
    onChange,
    onAfterChange,
    dark = false,
    className,
    style,
    prefixCls: customizePrefixCls,
    tipFormatter = (value: number) => value,
    railStyle,
    trackStyle,
    handleStyle,
    dotStyle,
    activeDotStyle,
    markStyle,
    activeMarkStyle,
  } = props;

  const { getPrefixCls } = useConfig();
  const prefixCls = getPrefixCls('slider', customizePrefixCls);

  // 内部状态
  const [innerValue, setInnerValue] = useState<number>(
    value !== undefined ? value : defaultValue
  );
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);

  // 同步外部value
  useEffect(() => {
    if (value !== undefined) {
      setInnerValue(value);
    }
  }, [value]);

  // 计算百分比
  const getPercent = (value: number): number => {
    return ((value - min) * 100) / (max - min);
  };

  // 计算值
  const getValue = (percent: number): number => {
    const rawValue = (percent * (max - min)) / 100 + min;
    const closestStep = Math.round(rawValue / step) * step;
    return Math.max(min, Math.min(max, closestStep));
  };

  // 处理点击事件
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;

    const sliderRect = sliderRef.current?.getBoundingClientRect();
    if (!sliderRect) return;

    let percent;
    if (vertical) {
      const offsetY = e.clientY - sliderRect.top;
      percent = (1 - offsetY / sliderRect.height) * 100;
    } else {
      const offsetX = e.clientX - sliderRect.left;
      percent = (offsetX / sliderRect.width) * 100;
    }

    const newValue = getValue(percent);
    setInnerValue(newValue);
    onChange?.(newValue);
    onAfterChange?.(newValue);
  };

  // 处理拖拽开始
  const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;

    setIsDragging(true);
    setShowTooltip(true);

    // 添加全局事件监听
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
  };

  // 处理拖拽移动
  const handleDragMove = (e: MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;

    const sliderRect = sliderRef.current.getBoundingClientRect();
    let percent;
    if (vertical) {
      const offsetY = e.clientY - sliderRect.top;
      percent = (1 - offsetY / sliderRect.height) * 100;
    } else {
      const offsetX = e.clientX - sliderRect.left;
      percent = (offsetX / sliderRect.width) * 100;
    }

    percent = Math.max(0, Math.min(100, percent));
    const newValue = getValue(percent);

    if (newValue !== innerValue) {
      setInnerValue(newValue);
      onChange?.(newValue);
    }
  };

  // 处理拖拽结束
  const handleDragEnd = () => {
    if (!isDragging) return;

    setIsDragging(false);
    setShowTooltip(false);
    onAfterChange?.(innerValue);

    // 移除全局事件监听
    document.removeEventListener('mousemove', handleDragMove);
    document.removeEventListener('mouseup', handleDragEnd);
  };

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;

    let newValue = innerValue;
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        newValue = Math.min(max, innerValue + step);
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        newValue = Math.max(min, innerValue - step);
        break;
      case 'Home':
        newValue = min;
        break;
      case 'End':
        newValue = max;
        break;
      default:
        return;
    }

    if (newValue !== innerValue) {
      setInnerValue(newValue);
      onChange?.(newValue);
      onAfterChange?.(newValue);
    }
  };

  // 处理鼠标进入
  const handleMouseEnter = () => {
    if (!disabled) {
      setShowTooltip(true);
    }
  };

  // 处理鼠标离开
  const handleMouseLeave = () => {
    if (!isDragging) {
      setShowTooltip(false);
    }
  };

  // 处理焦点
  const handleFocus = () => {
    if (!disabled) {
      setIsFocused(true);
    }
  };

  // 处理失焦
  const handleBlur = () => {
    setIsFocused(false);
  };

  // 渲染刻度点
  const renderDots = () => {
    if (!dots) return null;

    const range = max - min;
    const elements: React.ReactNode[] = [];

    for (let i = 0; i <= range; i += step) {
      const value = min + i;
      const percent = getPercent(value);
      const isActive = included ? value <= innerValue : value === innerValue;

      const dotStyle: React.CSSProperties = {
        [vertical ? 'bottom' : 'left']: `${percent}%`,
        ...(isActive ? activeDotStyle : dotStyle),
      };

      elements.push(
        <span
          key={value}
          className={cx(styles.dot, { [styles.dotActive]: isActive })}
          style={dotStyle}
        />
      );
    }

    return elements;
  };

  // 渲染标记
  const renderMarks = () => {
    if (!marks || Object.keys(marks).length === 0) return null;

    const elements: React.ReactNode[] = [];

    Object.entries(marks).forEach(([key, mark]) => {
      const value = parseFloat(key);
      const percent = getPercent(value);
      const isActive = included ? value <= innerValue : value === innerValue;

      let markNode: React.ReactNode;
      let customStyle: React.CSSProperties = {};

      if (typeof mark === 'object' && mark !== null) {
        markNode = mark.label;
        customStyle = mark.style || {};
      } else {
        markNode = mark;
      }

      const markStyle: React.CSSProperties = {
        [vertical ? 'bottom' : 'left']: `${percent}%`,
        ...customStyle,
        ...(isActive ? activeMarkStyle : markStyle),
      };

      elements.push(
        <span
          key={value}
          className={cx(styles.mark, { [styles.markActive]: isActive })}
          style={markStyle}
        >
          {markNode}
        </span>
      );
    });

    return elements;
  };

  // 计算样式
  const percent = getPercent(innerValue);
  const trackStyle: React.CSSProperties = {
    [vertical ? 'height' : 'width']: `${percent}%`,
    [vertical ? 'bottom' : 'left']: 0,
    ...trackStyle,
  };
  const handleStyle: React.CSSProperties = {
    [vertical ? 'bottom' : 'left']: `${percent}%`,
    transform: `translate${vertical ? 'Y' : 'X'}(-50%)`,
    ...handleStyle,
  };

  // 计算类名
  const sliderClassName = cx(
    styles.slider,
    {
      [styles.vertical]: vertical,
      [styles.withMarks]: marks && Object.keys(marks).length > 0,
      [styles.disabled]: disabled,
      [styles.dark]: dark,
    },
    className
  );

  return (
    <div
      ref={sliderRef}
      className={sliderClassName}
      style={style}
      onClick={handleClick}
    >
      <div className={styles.rail} style={railStyle} />
      <div className={styles.track} style={trackStyle} />
      {dots && renderDots()}
      {marks && renderMarks()}
      <div
        ref={handleRef}
        className={cx(styles.handle, { [styles.handleFocus]: isFocused })}
        style={handleStyle}
        onMouseDown={handleDragStart}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={innerValue}
        aria-disabled={disabled}
      >
        {tooltip && showTooltip && (
          <div className={styles.tooltip}>{tipFormatter(innerValue)}</div>
        )}
      </div>
    </div>
  );
};

export default Slider;