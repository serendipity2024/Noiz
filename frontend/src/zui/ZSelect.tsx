/* eslint-disable import/no-default-export */
import React, { ReactElement, ReactNode, useState, useRef, useEffect } from 'react';
import cx from 'classnames';
import styles from './ZSelect.module.scss';
import { useConfig } from './ConfigProvider';
import { Empty } from './Empty';

export type SelectValue = string | string[] | number | number[] | undefined;
export type SelectMode = 'multiple' | 'tags' | undefined;
export type SelectSize = 'large' | 'default' | 'small';
export type SelectFilterOption = boolean | ((inputValue: string, option: OptionProps) => boolean);
export type SelectPlacement = 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight';

export interface OptionProps {
  /** 选项值 */
  value: string | number;
  /** 选项标签 */
  label?: ReactNode;
  /** 是否禁用 */
  disabled?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 子元素 */
  children?: ReactNode;
}

export interface OptGroupProps {
  /** 分组标签 */
  label?: ReactNode;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 子元素 */
  children?: ReactNode;
}

export interface SelectProps {
  /** 是否允许清除 */
  allowClear?: boolean;
  /** 是否自动获取焦点 */
  autoFocus?: boolean;
  /** 默认获取焦点 */
  defaultActiveFirstOption?: boolean;
  /** 是否默认展开下拉菜单 */
  defaultOpen?: boolean;
  /** 指定默认选中的条目 */
  defaultValue?: SelectValue;
  /** 是否禁用 */
  disabled?: boolean;
  /** 下拉菜单的 className 属性 */
  dropdownClassName?: string;
  /** 下拉菜单和选择器同宽 */
  dropdownMatchSelectWidth?: boolean;
  /** 下拉菜单的 style 属性 */
  dropdownStyle?: React.CSSProperties;
  /** 自定义下拉框内容 */
  dropdownRender?: (menu: ReactNode) => ReactNode;
  /** 是否根据输入项进行筛选 */
  filterOption?: SelectFilterOption;
  /** 搜索时过滤对应的 option 属性，如设置为 children 表示对内嵌内容进行搜索 */
  optionFilterProp?: string;
  /** 菜单渲染父节点 */
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
  /** 是否把每个选项的 label 包装到 value 中 */
  labelInValue?: boolean;
  /** 设置弹窗滚动高度 */
  listHeight?: number;
  /** 加载中状态 */
  loading?: boolean;
  /** 最多显示多少个 tag */
  maxTagCount?: number;
  /** 隐藏 tag 时显示的内容 */
  maxTagPlaceholder?: ReactNode | ((omittedValues: SelectValue[]) => ReactNode);
  /** 最大显示的 tag 文本长度 */
  maxTagTextLength?: number;
  /** 设置 Select 的模式为多选或标签 */
  mode?: SelectMode;
  /** 当下拉列表为空时显示的内容 */
  notFoundContent?: ReactNode;
  /** 是否展开下拉菜单 */
  open?: boolean;
  /** 选择框默认文字 */
  placeholder?: ReactNode;
  /** 选择框弹出的位置 */
  placement?: SelectPlacement;
  /** 自定义的选择框后缀图标 */
  suffixIcon?: ReactNode;
  /** 自定义的多选框清除图标 */
  removeIcon?: ReactNode;
  /** 自定义的多选框清空图标 */
  clearIcon?: ReactNode;
  /** 自定义当前选中的条目图标 */
  menuItemSelectedIcon?: ReactNode;
  /** 是否显示下拉小箭头 */
  showArrow?: boolean;
  /** 是否显示边框 */
  bordered?: boolean;
  /** 使单选模式可搜索 */
  showSearch?: boolean;
  /** 选择框大小 */
  size?: SelectSize;
  /** 指定当前选中的条目 */
  value?: SelectValue;
  /** 是否使用虚拟滚动 */
  virtual?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 选择框前缀 */
  prefixCls?: string;
  /** 是否使用暗色主题 */
  dark?: boolean;
  /** 选中 option，或 input 的 value 变化时，调用此函数 */
  onChange?: (value: SelectValue, option: OptionProps | OptionProps[]) => void;
  /** 失去焦点时回调 */
  onBlur?: (e: React.FocusEvent<HTMLElement>) => void;
  /** 获得焦点时回调 */
  onFocus?: (e: React.FocusEvent<HTMLElement>) => void;
  /** 被选中时调用 */
  onSelect?: (value: SelectValue, option: OptionProps) => void;
  /** 取消选中时调用 */
  onDeselect?: (value: SelectValue, option: OptionProps) => void;
  /** 展开下拉菜单的回调 */
  onDropdownVisibleChange?: (open: boolean) => void;
  /** 文本框值变化时回调 */
  onSearch?: (value: string) => void;
  /** 按键按下时回调 */
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  /** 鼠标移入时回调 */
  onMouseEnter?: (e: React.MouseEvent<HTMLDivElement>) => void;
  /** 鼠标移出时回调 */
  onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void;
  /** 下拉列表滚动时的回调 */
  onPopupScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
  /** 清除内容时回调 */
  onClear?: () => void;
  /** 子元素 */
  children?: ReactNode;
  /** 选项列表 */
  options?: OptionProps[];
}

export const Option = (props: OptionProps): ReactElement => {
  const {
    value,
    label,
    disabled = false,
    className,
    style,
    children,
  } = props;

  return (
    <div className={className} style={style}>
      {label || children}
    </div>
  );
};

export const OptGroup = (props: OptGroupProps): ReactElement => {
  const {
    label,
    className,
    style,
    children,
  } = props;

  return (
    <div className={className} style={style}>
      {label}
      {children}
    </div>
  );
};

export const ZSelect = (props: SelectProps): ReactElement => {
  const {
    allowClear = true,
    autoFocus = false,
    defaultActiveFirstOption = true,
    defaultOpen,
    defaultValue,
    disabled = false,
    dropdownClassName,
    dropdownMatchSelectWidth = true,
    dropdownStyle,
    dropdownRender,
    filterOption = true,
    optionFilterProp = 'value',
    getPopupContainer,
    labelInValue = false,
    listHeight = 256,
    loading = false,
    maxTagCount,
    maxTagPlaceholder,
    maxTagTextLength,
    mode,
    notFoundContent,
    open,
    placeholder,
    placement = 'bottomLeft',
    suffixIcon,
    removeIcon,
    clearIcon,
    menuItemSelectedIcon,
    showArrow = true,
    bordered = true,
    showSearch = false,
    size = 'default',
    value,
    virtual = true,
    className,
    style,
    prefixCls: customizePrefixCls,
    dark = false,
    onChange,
    onBlur,
    onFocus,
    onSelect,
    onDeselect,
    onDropdownVisibleChange,
    onSearch,
    onKeyDown,
    onMouseEnter,
    onMouseLeave,
    onPopupScroll,
    onClear,
    children,
    options,
  } = props;

  const { getPrefixCls } = useConfig();
  const prefixCls = getPrefixCls('select', customizePrefixCls);

  // 内部状态
  const [innerValue, setInnerValue] = useState<SelectValue>(value !== undefined ? value : defaultValue);
  const [innerOpen, setInnerOpen] = useState<boolean>(open !== undefined ? open : defaultOpen || false);
  const [focused, setFocused] = useState<boolean>(autoFocus);
  const [searchValue, setSearchValue] = useState<string>('');
  const [activeIndex, setActiveIndex] = useState<number>(defaultActiveFirstOption ? 0 : -1);
  const selectRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 同步外部状态
  useEffect(() => {
    if (value !== undefined) {
      setInnerValue(value);
    }
  }, [value]);

  useEffect(() => {
    if (open !== undefined) {
      setInnerOpen(open);
    }
  }, [open]);

  // 自动聚焦
  useEffect(() => {
    if (autoFocus && !disabled) {
      inputRef.current?.focus();
      setFocused(true);
    }
  }, [autoFocus, disabled]);

  // 处理选项列表
  const getOptions = () => {
    if (options) {
      return options;
    }

    const optionsList: OptionProps[] = [];
    React.Children.forEach(children, (child) => {
      if (!React.isValidElement(child)) return;

      if (child.type === Option) {
        const { value, label, disabled, children } = child.props;
        optionsList.push({
          value,
          label: label || children,
          disabled,
        });
      } else if (child.type === OptGroup) {
        React.Children.forEach(child.props.children, (groupChild) => {
          if (!React.isValidElement(groupChild) || groupChild.type !== Option) return;

          const { value, label, disabled, children } = groupChild.props;
          optionsList.push({
            value,
            label: label || children,
            disabled,
          });
        });
      }
    });

    return optionsList;
  };

  // 过滤选项
  const getFilteredOptions = () => {
    const optionsList = getOptions();
    if (!showSearch || !searchValue) {
      return optionsList;
    }

    return optionsList.filter((option) => {
      if (typeof filterOption === 'function') {
        return filterOption(searchValue, option);
      }
      if (filterOption) {
        const optionValue = String(option[optionFilterProp as keyof OptionProps] || '');
        return optionValue.toLowerCase().includes(searchValue.toLowerCase());
      }
      return true;
    });
  };

  // 处理点击
  const handleClick = () => {
    if (disabled) return;

    if (!innerOpen) {
      setInnerOpen(true);
      onDropdownVisibleChange?.(true);
    }

    if (!focused) {
      inputRef.current?.focus();
      setFocused(true);
    }
  };

  // 处理失焦
  const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
    setFocused(false);
    setInnerOpen(false);
    onDropdownVisibleChange?.(false);
    onBlur?.(e);
  };

  // 处理聚焦
  const handleFocus = (e: React.FocusEvent<HTMLElement>) => {
    setFocused(true);
    onFocus?.(e);
  };

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const filteredOptions = getFilteredOptions();

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!innerOpen) {
          setInnerOpen(true);
          onDropdownVisibleChange?.(true);
        } else {
          setActiveIndex((prevIndex) => {
            const nextIndex = prevIndex < filteredOptions.length - 1 ? prevIndex + 1 : 0;
            return nextIndex;
          });
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (!innerOpen) {
          setInnerOpen(true);
          onDropdownVisibleChange?.(true);
        } else {
          setActiveIndex((prevIndex) => {
            const nextIndex = prevIndex > 0 ? prevIndex - 1 : filteredOptions.length - 1;
            return nextIndex;
          });
        }
        break;
      case 'Enter':
        e.preventDefault();
        if (innerOpen && activeIndex >= 0 && activeIndex < filteredOptions.length) {
          const option = filteredOptions[activeIndex];
          handleOptionSelect(option);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setInnerOpen(false);
        onDropdownVisibleChange?.(false);
        break;
      default:
        onKeyDown?.(e);
    }
  };

  // 处理搜索
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearch?.(value);
  };

  // 处理选项选择
  const handleOptionSelect = (option: OptionProps) => {
    if (option.disabled) return;

    let newValue: SelectValue;
    if (mode === 'multiple' || mode === 'tags') {
      const values = Array.isArray(innerValue) ? [...innerValue] : [];
      const optionValue = option.value;
      const index = values.indexOf(optionValue);

      if (index >= 0) {
        values.splice(index, 1);
        onDeselect?.(optionValue, option);
      } else {
        values.push(optionValue);
        onSelect?.(optionValue, option);
      }

      newValue = values;
    } else {
      newValue = option.value;
      onSelect?.(option.value, option);
      setInnerOpen(false);
      onDropdownVisibleChange?.(false);
    }

    if (value === undefined) {
      setInnerValue(newValue);
    }

    onChange?.(newValue, mode === 'multiple' || mode === 'tags' ? getOptions().filter((o) => Array.isArray(newValue) && newValue.includes(o.value)) : option);

    if (mode !== 'multiple' && mode !== 'tags') {
      setSearchValue('');
    }
  };

  // 处理清除
  const handleClear = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();

    const newValue = mode === 'multiple' || mode === 'tags' ? [] : undefined;

    if (value === undefined) {
      setInnerValue(newValue);
    }

    onChange?.(newValue, []);
    onClear?.();
    setSearchValue('');
  };

  // 处理标签移除
  const handleTagRemove = (e: React.MouseEvent<HTMLSpanElement>, optionValue: string | number) => {
    e.stopPropagation();

    if (disabled) return;

    const values = Array.isArray(innerValue) ? [...innerValue] : [];
    const index = values.indexOf(optionValue);

    if (index >= 0) {
      values.splice(index, 1);
      const option = getOptions().find((o) => o.value === optionValue);

      if (option) {
        onDeselect?.(optionValue, option);
      }

      if (value === undefined) {
        setInnerValue(values);
      }

      onChange?.(values, getOptions().filter((o) => values.includes(o.value)));
    }
  };

  // 渲染选择框
  const renderSelector = () => {
    const isMultiple = mode === 'multiple' || mode === 'tags';
    const filteredOptions = getFilteredOptions();
    const selectedOptions = getOptions().filter((o) => {
      if (isMultiple) {
        return Array.isArray(innerValue) && innerValue.includes(o.value);
      }
      return o.value === innerValue;
    });

    // 渲染单选
    if (!isMultiple) {
      const selectedOption = selectedOptions[0];

      return (
        <div
          className={cx(
            styles.selector,
            styles.selectorSingle,
            {
              [styles.selectorFocused]: focused,
              [styles.selectorDisabled]: disabled,
              [styles.selectorHasClear]: allowClear && innerValue !== undefined,
            }
          )}
        >
          <div className={styles.selectorSelection}>
            {showSearch ? (
              <div className={styles.selectorSearch}>
                <input
                  ref={inputRef}
                  type="text"
                  className={cx(
                    styles.selectorSearchInput,
                    {
                      [styles.selectorSearchInputDisabled]: disabled,
                    }
                  )}
                  value={searchValue}
                  onChange={handleSearch}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown}
                  disabled={disabled}
                  placeholder={selectedOption ? undefined : placeholder as string}
                />
                {!searchValue && selectedOption && (
                  <div className={styles.selectorSelectionItem}>
                    <div className={styles.selectorSelectionItemContent}>
                      {selectedOption.label || selectedOption.value}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                {selectedOption ? (
                  <div className={styles.selectorSelectionItem}>
                    <div className={styles.selectorSelectionItemContent}>
                      {selectedOption.label || selectedOption.value}
                    </div>
                  </div>
                ) : (
                  <div
                    className={cx(
                      styles.selectorSelectionPlaceholder,
                      {
                        [styles.selectorSelectionPlaceholderHidden]: selectedOption,
                      }
                    )}
                  >
                    {placeholder}
                  </div>
                )}
              </>
            )}
          </div>

          {allowClear && innerValue !== undefined && (
            <span className={styles.selectorClear} onClick={handleClear}>
              {clearIcon || '×'}
            </span>
          )}

          {showArrow && (
            <span
              className={cx(
                styles.selectorArrow,
                {
                  [styles.selectorArrowRotated]: innerOpen,
                }
              )}
            >
              {suffixIcon || '▼'}
            </span>
          )}
        </div>
      );
    }

    // 渲染多选
    return (
      <div
        className={cx(
          styles.selector,
          styles.selectorMultiple,
          {
            [styles.selectorFocused]: focused,
            [styles.selectorDisabled]: disabled,
            [styles.selectorHasClear]: allowClear && Array.isArray(innerValue) && innerValue.length > 0,
          }
        )}
      >
        <div className={styles.selectorSelection}>
          {selectedOptions.map((option) => (
            <div
              key={option.value}
              className={cx(
                styles.selectorSelectionItem,
                {
                  [styles.selectorSelectionItemDisabled]: disabled,
                }
              )}
            >
              <div className={styles.selectorSelectionItemContent}>
                {option.label || option.value}
              </div>
              {!disabled && (
                <span
                  className={styles.selectorSelectionItemRemove}
                  onClick={(e) => handleTagRemove(e, option.value)}
                >
                  {removeIcon || '×'}
                </span>
              )}
            </div>
          ))}

          <div className={styles.selectorSearch}>
            <input
              ref={inputRef}
              type="text"
              className={cx(
                styles.selectorSearchInput,
                {
                  [styles.selectorSearchInputDisabled]: disabled,
                }
              )}
              value={searchValue}
              onChange={handleSearch}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              disabled={disabled}
              placeholder={selectedOptions.length === 0 ? placeholder as string : undefined}
            />
          </div>
        </div>

        {allowClear && Array.isArray(innerValue) && innerValue.length > 0 && (
          <span className={styles.selectorClear} onClick={handleClear}>
            {clearIcon || '×'}
          </span>
        )}

        {showArrow && (
          <span
            className={cx(
              styles.selectorArrow,
              {
                [styles.selectorArrowRotated]: innerOpen,
              }
            )}
          >
            {suffixIcon || '▼'}
          </span>
        )}
      </div>
    );
  };

  // 渲染下拉菜单
  const renderDropdown = () => {
    if (!innerOpen) return null;

    const filteredOptions = getFilteredOptions();
    const isMultiple = mode === 'multiple' || mode === 'tags';

    const menu = (
      <div
        className={styles.dropdownMenu}
        style={{ maxHeight: listHeight }}
        onScroll={onPopupScroll}
      >
        {filteredOptions.length === 0 ? (
          <div className={styles.dropdownEmpty}>
            {notFoundContent || <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
          </div>
        ) : (
          filteredOptions.map((option, index) => (
            <div
              key={option.value}
              className={cx(
                styles.dropdownOption,
                {
                  [styles.dropdownOptionActive]: index === activeIndex,
                  [styles.dropdownOptionSelected]: isMultiple
                    ? Array.isArray(innerValue) && innerValue.includes(option.value)
                    : option.value === innerValue,
                  [styles.dropdownOptionDisabled]: option.disabled,
                }
              )}
              onClick={() => handleOptionSelect(option)}
            >
              {option.label || option.value}
              {(isMultiple
                ? Array.isArray(innerValue) && innerValue.includes(option.value)
                : option.value === innerValue) && menuItemSelectedIcon && (
                <span className={styles.dropdownOptionSelectedIcon}>
                  {menuItemSelectedIcon}
                </span>
              )}
            </div>
          ))
        )}
      </div>
    );

    return (
      <div
        ref={dropdownRef}
        className={cx(
          styles.dropdown,
          {
            [styles.dropdownHidden]: !innerOpen,
          },
          dropdownClassName
        )}
        style={{
          ...dropdownStyle,
          width: dropdownMatchSelectWidth && selectRef.current ? selectRef.current.offsetWidth : undefined,
        }}
      >
        {dropdownRender ? dropdownRender(menu) : menu}
      </div>
    );
  };

  // 计算类名
  const selectClassName = cx(
    styles.select,
    {
      [styles.selectLarge]: size === 'large',
      [styles.selectSmall]: size === 'small',
      [styles.dark]: dark,
    },
    className
  );

  return (
    <div
      ref={selectRef}
      className={selectClassName}
      style={style}
      onClick={handleClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {renderSelector()}
      {renderDropdown()}
    </div>
  );
};

ZSelect.Option = Option;
ZSelect.OptGroup = OptGroup;

export default ZSelect;