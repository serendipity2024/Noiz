/* eslint-disable import/no-default-export */
import React, { ReactElement, ReactNode, useState, useRef, useEffect } from 'react';
import cx from 'classnames';
import styles from './Cascader.module.scss';

export interface CascaderOption {
  /** 选项值 */
  value: string | number;
  /** 选项标签 */
  label: React.ReactNode;
  /** 子选项 */
  children?: CascaderOption[];
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否是叶子节点 */
  isLeaf?: boolean;
  /** 加载动态数据的方法 */
  loading?: boolean;
}

export interface FieldNames {
  /** 替代 `label` 的字段名 */
  label?: string;
  /** 替代 `value` 的字段名 */
  value?: string;
  /** 替代 `children` 的字段名 */
  children?: string;
}

export interface FilledFieldNames {
  label: string;
  value: string;
  children: string;
}

export interface ShowSearchType {
  /** 接收 `inputValue` `path` 两个参数，当 `path` 符合筛选条件时，应返回 true，反之则返回 false */
  filter?: (inputValue: string, path: CascaderOption[]) => boolean;
  /** 搜索结果展示数量 */
  limit?: number;
  /** 搜索结果列表是否与输入框同宽 */
  matchInputWidth?: boolean;
  /** 用于渲染搜索结果的函数 */
  render?: (inputValue: string, path: CascaderOption[], prefixCls: string) => React.ReactNode;
  /** 用于排序搜索结果的函数 */
  sort?: (a: CascaderOption[], b: CascaderOption[], inputValue: string) => number;
}

export interface CascaderProps {
  /** 可选项数据源 */
  options: CascaderOption[];
  /** 默认的选中项 */
  defaultValue?: string[];
  /** 指定选中项 */
  value?: string[];
  /** 输入框占位文本 */
  placeholder?: string;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 输入框大小 */
  size?: 'large' | 'default' | 'small';
  /** 禁用 */
  disabled?: boolean;
  /** 是否支持清除 */
  allowClear?: boolean;
  /** 自定义显示 */
  displayRender?: (label: string[], selectedOptions?: CascaderOption[]) => ReactNode;
  /** 次级菜单的展开方式 */
  expandTrigger?: 'click' | 'hover';
  /** 当此项为 true 时，点选每级菜单选项值都会发生变化 */
  changeOnSelect?: boolean;
  /** 自定义浮层类名 */
  popupClassName?: string;
  /** 浮层预设位置 */
  popupPlacement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight';
  /** 自定义 options 中 label value children 的字段 */
  fieldNames?: FieldNames;
  /** 在选择框中显示搜索框 */
  showSearch?: boolean | ShowSearchType;
  /** 是否支持搜索 */
  notFoundContent?: React.ReactNode;
  /** 当下拉列表为空时显示的内容 */
  loadData?: (selectedOptions?: CascaderOption[]) => void;
  /** 选择完成后的回调 */
  onChange?: (value: string[], selectedOptions?: CascaderOption[]) => void;
  /** 显示/隐藏浮层的回调 */
  onVisibleChange?: (value: boolean) => void;
  /** 选择后展示的渲染函数 */
  children?: ReactNode;
}

const defaultFieldNames = {
  label: 'label',
  value: 'value',
  children: 'children',
};

export const Cascader = (props: CascaderProps): ReactElement => {
  const {
    options = [],
    defaultValue,
    value,
    placeholder = '请选择',
    className,
    style,
    size,
    disabled = false,
    allowClear = true,
    displayRender,
    expandTrigger = 'click',
    changeOnSelect = false,
    popupClassName,
    popupPlacement = 'bottomLeft',
    fieldNames = defaultFieldNames,
    showSearch = false,
    notFoundContent = '无匹配结果',
    loadData,
    onChange,
    onVisibleChange,
    children,
  } = props;

  const [selectedValue, setSelectedValue] = useState<string[]>(value || defaultValue || []);
  const [activeValue, setActiveValue] = useState<string[]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const inputRef = useRef<HTMLDivElement>(null);

  // 合并字段名
  const mergedFieldNames: FilledFieldNames = {
    ...defaultFieldNames,
    ...fieldNames,
  };

  // 处理选项变化
  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  // 处理显示隐藏变化
  useEffect(() => {
    if (onVisibleChange) {
      onVisibleChange(visible);
    }
  }, [visible, onVisibleChange]);

  // 获取选中的选项
  const getSelectedOptions = (values: string[] = selectedValue): CascaderOption[] => {
    const result: CascaderOption[] = [];
    let currentOptions = options;

    values.forEach((value) => {
      const option = currentOptions?.find(
        (opt) => String(opt[mergedFieldNames.value]) === String(value)
      );
      if (option) {
        result.push(option);
        currentOptions = option[mergedFieldNames.children] as CascaderOption[];
      }
    });

    return result;
  };

  // 渲染显示标签
  const getDisplayLabel = (): ReactNode => {
    if (!selectedValue.length) {
      return (
        <span className={styles.placeholder}>{placeholder}</span>
      );
    }

    const selectedOptions = getSelectedOptions();
    const labels = selectedOptions.map((option) => option[mergedFieldNames.label]);

    if (displayRender) {
      return displayRender(labels as string[], selectedOptions);
    }

    return labels.join(' / ');
  };

  // 处理选择
  const handleSelect = (option: CascaderOption, level: number) => {
    const { [mergedFieldNames.value]: value, [mergedFieldNames.children]: children } = option;
    const newActiveValue = [...activeValue];
    newActiveValue[level] = value as string;

    if (level < newActiveValue.length - 1) {
      newActiveValue.length = level + 1;
    }

    setActiveValue(newActiveValue);

    if (!children || !children.length || changeOnSelect) {
      const newValue = newActiveValue.slice(0, children && children.length ? level + 1 : level + 1);
      setSelectedValue(newValue);
      setVisible(!(children && children.length));

      if (onChange) {
        onChange(newValue, getSelectedOptions(newValue));
      }

      if (loadData && !children?.length && !option.isLeaf) {
        loadData([...getSelectedOptions(), option]);
      }
    } else if (loadData && !children?.length) {
      loadData([...getSelectedOptions(), option]);
    }
  };

  // 处理清除
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;

    setSelectedValue([]);
    setInputValue('');

    if (onChange) {
      onChange([], []);
    }
  };

  // 处理点击
  const handleClick = () => {
    if (disabled) return;

    setVisible(!visible);
    if (!visible) {
      setActiveValue(selectedValue);
    }
  };

  // 渲染菜单
  const renderMenu = () => {
    const renderMenuItems = (options: CascaderOption[], level: number) => {
      return (
        <ul className={styles.menuColumn}>
          {options.map((option) => {
            const { [mergedFieldNames.value]: value, [mergedFieldNames.label]: label, [mergedFieldNames.children]: children, disabled } = option;
            const isActive = activeValue[level] === value;
            const isSelected = selectedValue[level] === value;
            const hasChildren = children && children.length > 0;

            return (
              <li
                key={value as string}
                className={cx(styles.menuItem, {
                  [styles.menuItemDisabled]: disabled,
                  [styles.menuItemSelected]: isSelected,
                  [styles.menuItemActive]: isActive,
                  [styles.menuItemExpand]: hasChildren,
                })}
                onClick={() => !disabled && handleSelect(option, level)}
                onMouseEnter={() => {
                  if (expandTrigger === 'hover' && !disabled && hasChildren) {
                    handleSelect(option, level);
                  }
                }}
              >
                {label}
                {option.loading && <span>...</span>}
              </li>
            );
          })}
        </ul>
      );
    };

    const getActiveOptions = () => {
      const activeOptions: CascaderOption[][] = [];
      let currentOptions = options;
      activeOptions.push(currentOptions);

      for (let i = 0; i < activeValue.length; i++) {
        const activeOption = currentOptions?.find(
          (option) => String(option[mergedFieldNames.value]) === String(activeValue[i])
        );

        if (activeOption && activeOption[mergedFieldNames.children]) {
          currentOptions = activeOption[mergedFieldNames.children] as CascaderOption[];
          activeOptions.push(currentOptions);
        } else {
          break;
        }
      }

      return activeOptions;
    };

    const activeOptions = getActiveOptions();

    return (
      <div
        className={cx(styles.menu, popupClassName)}
        style={{
          position: 'absolute',
          top: inputRef.current ? inputRef.current.clientHeight + 4 : 36,
          left: popupPlacement.includes('Left') ? 0 : undefined,
          right: popupPlacement.includes('Right') ? 0 : undefined,
        }}
      >
        {activeOptions.map((options, level) => renderMenuItems(options, level))}
      </div>
    );
  };

  // 主渲染
  return (
    <div
      className={cx(styles.cascader, className, {
        [styles.disabled]: disabled,
        [styles.small]: size === 'small',
        [styles.large]: size === 'large',
      })}
      style={style}
    >
      <div
        ref={inputRef}
        className={styles.input}
        onClick={handleClick}
      >
        {getDisplayLabel()}

        {allowClear && selectedValue.length > 0 && !disabled ? (
          <span className={styles.clear} onClick={handleClear}>
            ×
          </span>
        ) : (
          <span className={cx(styles.arrow, { [styles.arrowExpanded]: visible })}>
            ▼
          </span>
        )}
      </div>

      {visible && renderMenu()}
    </div>
  );
};

export default Cascader;