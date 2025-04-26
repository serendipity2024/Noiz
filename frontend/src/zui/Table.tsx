/* eslint-disable import/no-default-export */
import React, { ReactElement, ReactNode, CSSProperties, useState, useEffect, useRef } from 'react';
import cx from 'classnames';
import styles from './Table.module.scss';
import { useConfig } from './ConfigProvider';
import { Empty } from './Empty';
import { Pagination } from './Pagination';
import { Spin } from './Spin';

export type TableSize = 'default' | 'middle' | 'small';
export type TableLayout = 'auto' | 'fixed';
export type RowSelectionType = 'checkbox' | 'radio';
export type SelectionSelectFn<T> = (record: T, selected: boolean, selectedRows: T[], nativeEvent: Event) => void;
export type TableRowSelection<T> = {
  type?: RowSelectionType;
  selectedRowKeys?: string[] | number[];
  onChange?: (selectedRowKeys: string[] | number[], selectedRows: T[]) => void;
  getCheckboxProps?: (record: T) => object;
  onSelect?: SelectionSelectFn<T>;
  onSelectAll?: (selected: boolean, selectedRows: T[], changeRows: T[]) => void;
  onSelectInvert?: (selectedRowKeys: string[] | number[]) => void;
  selections?: boolean | ReactNode[];
  columnWidth?: string | number;
  fixed?: boolean;
  columnTitle?: ReactNode;
};
export type SortOrder = 'descend' | 'ascend' | null;
export type CompareFn<T> = (a: T, b: T, sortOrder?: SortOrder) => number;
export type ColumnFilterItem = {
  text: ReactNode;
  value: string | number | boolean;
  children?: ColumnFilterItem[];
};
export type FilterDropdownProps = {
  prefixCls: string;
  setSelectedKeys: (selectedKeys: React.Key[]) => void;
  selectedKeys: React.Key[];
  confirm: () => void;
  clearFilters: () => void;
  filters?: ColumnFilterItem[];
  visible: boolean;
};
export type ColumnType<T> = {
  title?: ReactNode;
  key?: string;
  dataIndex?: string;
  render?: (text: any, record: T, index: number) => ReactNode;
  align?: 'left' | 'right' | 'center';
  className?: string;
  fixed?: boolean | 'left' | 'right';
  width?: string | number;
  ellipsis?: boolean;
  sorter?: boolean | CompareFn<T>;
  sortOrder?: SortOrder;
  defaultSortOrder?: SortOrder;
  sortDirections?: SortOrder[];
  showSorterTooltip?: boolean;
  filtered?: boolean;
  filters?: ColumnFilterItem[];
  filterDropdown?: ReactNode | ((props: FilterDropdownProps) => ReactNode);
  filterMultiple?: boolean;
  filteredValue?: React.Key[];
  filterIcon?: ReactNode | ((filtered: boolean) => ReactNode);
  onFilter?: (value: string | number | boolean, record: T) => boolean;
  onFilterDropdownVisibleChange?: (visible: boolean) => void;
  children?: ColumnType<T>[];
  colSpan?: number;
  rowSpan?: number;
};
export type ExpandableConfig<T> = {
  expandedRowKeys?: string[] | number[];
  defaultExpandedRowKeys?: string[] | number[];
  expandedRowRender?: (record: T, index: number, indent: number, expanded: boolean) => ReactNode;
  expandRowByClick?: boolean;
  expandIcon?: (props: {
    expanded: boolean;
    onExpand: (record: T, e: React.MouseEvent<HTMLElement>) => void;
    record: T;
  }) => ReactNode;
  onExpand?: (expanded: boolean, record: T) => void;
  onExpandedRowsChange?: (expandedRows: string[] | number[]) => void;
  rowExpandable?: (record: T) => boolean;
  columnWidth?: string | number;
  fixed?: boolean;
  indentSize?: number;
};
export type TablePaginationConfig = {
  position?: 'top' | 'bottom' | 'both';
  total?: number;
  current?: number;
  pageSize?: number;
  defaultCurrent?: number;
  defaultPageSize?: number;
  onChange?: (page: number, pageSize?: number) => void;
  hideOnSinglePage?: boolean;
  showSizeChanger?: boolean;
  pageSizeOptions?: string[];
  onShowSizeChange?: (current: number, size: number) => void;
  showQuickJumper?: boolean;
  showTotal?: (total: number, range: [number, number]) => ReactNode;
  simple?: boolean;
  size?: 'default' | 'small';
};

export interface TableProps<T> {
  /** 表格数据源 */
  dataSource: T[];
  /** 表格列的配置描述 */
  columns: ColumnType<T>[];
  /** 表格行 key 的取值 */
  rowKey?: string | ((record: T, index: number) => string);
  /** 表格行的类名 */
  rowClassName?: string | ((record: T, index: number) => string);
  /** 表格行的样式 */
  rowStyle?: CSSProperties | ((record: T, index: number) => CSSProperties);
  /** 表格行的属性 */
  onRow?: (record: T, index: number) => object;
  /** 表格头部行的属性 */
  onHeaderRow?: (columns: ColumnType<T>[], index: number) => object;
  /** 表格标题 */
  title?: ReactNode | ((data: T[]) => ReactNode);
  /** 表格尾部 */
  footer?: ReactNode | ((data: T[]) => ReactNode);
  /** 表格是否加载中 */
  loading?: boolean | { spinning: boolean; delay?: number };
  /** 表格大小 */
  size?: TableSize;
  /** 表格布局 */
  tableLayout?: TableLayout;
  /** 表格是否显示边框 */
  bordered?: boolean;
  /** 表格是否显示表头 */
  showHeader?: boolean;
  /** 表格行选择配置 */
  rowSelection?: TableRowSelection<T>;
  /** 表格分页配置 */
  pagination?: TablePaginationConfig | false;
  /** 表格是否可展开 */
  expandable?: ExpandableConfig<T>;
  /** 表格滚动配置 */
  scroll?: {
    x?: number | true | string;
    y?: number | string;
    scrollToFirstRowOnChange?: boolean;
  };
  /** 表格空数据时的展示内容 */
  locale?: {
    emptyText?: ReactNode;
    filterConfirm?: ReactNode;
    filterReset?: ReactNode;
    filterEmptyText?: ReactNode;
    filterCheckall?: ReactNode;
    filterSearchPlaceholder?: ReactNode;
    selectionAll?: ReactNode;
    selectInvert?: ReactNode;
    selectNone?: ReactNode;
    selectionInvert?: ReactNode;
    sortTitle?: ReactNode;
    triggerDesc?: ReactNode;
    triggerAsc?: ReactNode;
    cancelSort?: ReactNode;
  };
  /** 表格是否使用暗色主题 */
  dark?: boolean;
  /** 表格自定义类名 */
  className?: string;
  /** 表格自定义样式 */
  style?: CSSProperties;
  /** 表格自定义前缀 */
  prefixCls?: string;
  /** 表格变化时的回调 */
  onChange?: (
    pagination: TablePaginationConfig,
    filters: Record<string, (string | number | boolean)[]>,
    sorter: {
      column?: ColumnType<T>;
      order?: SortOrder;
      field?: string | string[];
      columnKey?: string;
    },
    extra: {
      currentDataSource: T[];
      action: 'paginate' | 'sort' | 'filter';
    }
  ) => void;
}

export interface TableState<T> {
  currentPage: number;
  pageSize: number;
  selectedRowKeys: string[] | number[];
  expandedRowKeys: string[] | number[];
  sortColumn?: ColumnType<T>;
  sortOrder?: SortOrder;
  filters: Record<string, (string | number | boolean)[]>;
}

export const Table = <T extends object>(props: TableProps<T>): ReactElement => {
  const {
    dataSource = [],
    columns = [],
    rowKey = 'key',
    rowClassName,
    rowStyle,
    onRow,
    onHeaderRow,
    title,
    footer,
    loading = false,
    size = 'default',
    tableLayout = 'auto',
    bordered = false,
    showHeader = true,
    rowSelection,
    pagination = {},
    expandable,
    scroll,
    locale = { emptyText: '暂无数据' },
    dark = false,
    className,
    style,
    prefixCls: customizePrefixCls,
    onChange,
  } = props;

  const { getPrefixCls } = useConfig();
  const prefixCls = getPrefixCls('table', customizePrefixCls);

  // 内部状态
  const [state, setState] = useState<TableState<T>>({
    currentPage: pagination && 'current' in pagination ? pagination.current as number : 1,
    pageSize: pagination && 'pageSize' in pagination ? pagination.pageSize as number : 10,
    selectedRowKeys: rowSelection && 'selectedRowKeys' in rowSelection ? rowSelection.selectedRowKeys as (string[] | number[]) : [],
    expandedRowKeys: expandable && 'expandedRowKeys' in expandable ? expandable.expandedRowKeys as (string[] | number[]) : [],
    filters: {},
  });

  // 同步外部状态
  useEffect(() => {
    if (pagination && 'current' in pagination) {
      setState((prevState) => ({ ...prevState, currentPage: pagination.current as number }));
    }
    if (pagination && 'pageSize' in pagination) {
      setState((prevState) => ({ ...prevState, pageSize: pagination.pageSize as number }));
    }
    if (rowSelection && 'selectedRowKeys' in rowSelection) {
      setState((prevState) => ({ ...prevState, selectedRowKeys: rowSelection.selectedRowKeys as (string[] | number[]) }));
    }
    if (expandable && 'expandedRowKeys' in expandable) {
      setState((prevState) => ({ ...prevState, expandedRowKeys: expandable.expandedRowKeys as (string[] | number[]) }));
    }
  }, [pagination, rowSelection, expandable]);

  // 获取行的 key
  const getRowKey = (record: T, index: number): string => {
    if (typeof rowKey === 'function') {
      return rowKey(record, index);
    }
    return (record as any)[rowKey];
  };

  // 处理分页变化
  const handlePageChange = (page: number, pageSize?: number) => {
    const newState = {
      ...state,
      currentPage: page,
      pageSize: pageSize || state.pageSize,
    };
    setState(newState);

    if (pagination && onChange) {
      onChange(
        {
          ...pagination,
          current: page,
          pageSize: pageSize || state.pageSize,
        },
        state.filters,
        { order: state.sortOrder, column: state.sortColumn },
        {
          currentDataSource: dataSource,
          action: 'paginate',
        }
      );
    }
  };

  // 处理排序变化
  const handleSortChange = (column: ColumnType<T>, order: SortOrder) => {
    const newState = {
      ...state,
      sortColumn: column,
      sortOrder: order,
    };
    setState(newState);

    if (onChange) {
      onChange(
        pagination as TablePaginationConfig,
        state.filters,
        {
          column,
          order,
          field: column.dataIndex as string,
          columnKey: column.key as string,
        },
        {
          currentDataSource: dataSource,
          action: 'sort',
        }
      );
    }
  };

  // 处理筛选变化
  const handleFilterChange = (columnKey: string, filteredValues: (string | number | boolean)[]) => {
    const newFilters = {
      ...state.filters,
      [columnKey]: filteredValues,
    };
    const newState = {
      ...state,
      filters: newFilters,
      currentPage: 1, // 重置到第一页
    };
    setState(newState);

    if (onChange) {
      onChange(
        {
          ...pagination as TablePaginationConfig,
          current: 1,
        },
        newFilters,
        { order: state.sortOrder, column: state.sortColumn },
        {
          currentDataSource: dataSource,
          action: 'filter',
        }
      );
    }
  };

  // 处理选择变化
  const handleSelectChange = (selectedRowKeys: string[] | number[], selectedRows: T[]) => {
    setState((prevState) => ({ ...prevState, selectedRowKeys }));

    if (rowSelection && rowSelection.onChange) {
      rowSelection.onChange(selectedRowKeys, selectedRows);
    }
  };

  // 处理展开变化
  const handleExpandChange = (expandedRowKeys: string[] | number[]) => {
    setState((prevState) => ({ ...prevState, expandedRowKeys }));

    if (expandable && expandable.onExpandedRowsChange) {
      expandable.onExpandedRowsChange(expandedRowKeys);
    }
  };

  // 获取当前页数据
  const getCurrentPageData = () => {
    if (!pagination) {
      return dataSource;
    }

    const { currentPage, pageSize } = state;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return dataSource.slice(startIndex, endIndex);
  };

  // 渲染表头
  const renderHeader = () => {
    if (!showHeader) {
      return null;
    }

    return (
      <thead className={styles.tableHeader}>
        <tr>
          {rowSelection && (
            <th className={styles.tableCell}>
              {/* 这里可以实现全选功能 */}
              <input
                type={rowSelection.type === 'radio' ? 'radio' : 'checkbox'}
                onChange={(e) => {
                  const checked = e.target.checked;
                  const currentPageData = getCurrentPageData();
                  const selectedKeys = checked
                    ? currentPageData.map((record, index) => getRowKey(record, index))
                    : [];
                  handleSelectChange(selectedKeys, checked ? currentPageData : []);
                }}
                checked={
                  getCurrentPageData().length > 0 &&
                  getCurrentPageData().every((record, index) =>
                    state.selectedRowKeys.includes(getRowKey(record, index))
                  )
                }
              />
            </th>
          )}
          {expandable && expandable.expandedRowRender && (
            <th className={styles.tableExpandIconCell}></th>
          )}
          {columns.map((column, index) => {
            const isColumnSorted = state.sortColumn === column;
            const columnClassName = cx(styles.tableCell, {
              [styles.tableColumnSorted]: isColumnSorted,
              [styles.tableColumnFiltered]: column.filtered,
              [column.className || '']: column.className,
            });

            // 渲染排序图标
            const renderSortIcon = () => {
              if (!column.sorter) {
                return null;
              }

              return (
                <span
                  className={cx(styles.tableColumnSortIcon, {
                    [styles.tableColumnSortIconAsc]: state.sortOrder === 'ascend' && isColumnSorted,
                    [styles.tableColumnSortIconDesc]: state.sortOrder === 'descend' && isColumnSorted,
                  })}
                  onClick={() => {
                    let order: SortOrder = null;
                    if (state.sortOrder === 'ascend' && isColumnSorted) {
                      order = 'descend';
                    } else if (state.sortOrder === 'descend' && isColumnSorted) {
                      order = null;
                    } else {
                      order = 'ascend';
                    }
                    handleSortChange(column, order);
                  }}
                >
                  {state.sortOrder === 'ascend' && isColumnSorted ? '↑' : state.sortOrder === 'descend' && isColumnSorted ? '↓' : '↕'}
                </span>
              );
            };

            // 渲染筛选图标
            const renderFilterIcon = () => {
              if (!column.filters) {
                return null;
              }

              const isFiltered = column.key && state.filters[column.key as string]?.length > 0;

              return (
                <span
                  className={cx(styles.tableColumnFilterIcon, {
                    [styles.tableColumnFilterIconFiltered]: isFiltered,
                  })}
                  onClick={() => {
                    // 这里可以实现筛选功能
                  }}
                >
                  🔍
                </span>
              );
            };

            return (
              <th
                key={column.key || column.dataIndex || index}
                className={columnClassName}
                style={{
                  textAlign: column.align,
                  width: column.width,
                }}
              >
                {column.title}
                {renderSortIcon()}
                {renderFilterIcon()}
              </th>
            );
          })}
        </tr>
      </thead>
    );
  };

  // 渲染表格主体
  const renderBody = () => {
    const currentPageData = getCurrentPageData();

    if (currentPageData.length === 0) {
      return (
        <tbody className={styles.tableBody}>
          <tr>
            <td
              colSpan={
                columns.length +
                (rowSelection ? 1 : 0) +
                (expandable && expandable.expandedRowRender ? 1 : 0)
              }
              className={styles.tablePlaceholder}
            >
              {locale.emptyText || <Empty />}
            </td>
          </tr>
        </tbody>
      );
    }

    return (
      <tbody className={styles.tableBody}>
        {currentPageData.map((record, index) => {
          const key = getRowKey(record, index);
          const isSelected = state.selectedRowKeys.includes(key);
          const isExpanded = state.expandedRowKeys.includes(key);
          const rowClass = typeof rowClassName === 'function' ? rowClassName(record, index) : rowClassName;
          const rowStyleValue = typeof rowStyle === 'function' ? rowStyle(record, index) : rowStyle;
          const rowProps = onRow ? onRow(record, index) : {};

          const rowClassNames = cx(styles.tableRow, {
            [styles.tableRowSelected]: isSelected,
            [rowClass || '']: rowClass,
          });

          // 渲染展开行
          const renderExpandedRow = () => {
            if (!expandable || !expandable.expandedRowRender || !isExpanded) {
              return null;
            }

            return (
              <tr key={`${key}-expanded`}>
                <td
                  colSpan={
                    columns.length +
                    (rowSelection ? 1 : 0) +
                    (expandable && expandable.expandedRowRender ? 1 : 0)
                  }
                >
                  {expandable.expandedRowRender(record, index, 0, isExpanded)}
                </td>
              </tr>
            );
          };

          return (
            <React.Fragment key={key}>
              <tr className={rowClassNames} style={rowStyleValue} {...rowProps}>
                {rowSelection && (
                  <td className={styles.tableCell}>
                    <input
                      type={rowSelection.type === 'radio' ? 'radio' : 'checkbox'}
                      checked={isSelected}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        let newSelectedRowKeys: (string | number)[];
                        let newSelectedRows: T[];

                        if (rowSelection.type === 'radio') {
                          newSelectedRowKeys = checked ? [key] : [];
                          newSelectedRows = checked ? [record] : [];
                        } else {
                          if (checked) {
                            newSelectedRowKeys = [...state.selectedRowKeys, key];
                            newSelectedRows = [
                              ...dataSource.filter((r, i) =>
                                state.selectedRowKeys.includes(getRowKey(r, i))
                              ),
                              record,
                            ];
                          } else {
                            newSelectedRowKeys = state.selectedRowKeys.filter((k) => k !== key);
                            newSelectedRows = dataSource.filter(
                              (r, i) => newSelectedRowKeys.includes(getRowKey(r, i))
                            );
                          }
                        }

                        handleSelectChange(newSelectedRowKeys, newSelectedRows);

                        if (rowSelection.onSelect) {
                          rowSelection.onSelect(record, checked, newSelectedRows, e.nativeEvent);
                        }
                      }}
                    />
                  </td>
                )}
                {expandable && expandable.expandedRowRender && (
                  <td className={styles.tableExpandIconCell}>
                    <span
                      className={cx(styles.tableExpandIcon, {
                        [styles.tableRowExpanded]: isExpanded,
                        [styles.tableRowCollapsed]: !isExpanded,
                      })}
                      onClick={(e) => {
                        e.stopPropagation();
                        const newExpandedRowKeys = isExpanded
                          ? state.expandedRowKeys.filter((k) => k !== key)
                          : [...state.expandedRowKeys, key];
                        handleExpandChange(newExpandedRowKeys);

                        if (expandable.onExpand) {
                          expandable.onExpand(!isExpanded, record);
                        }
                      }}
                    />
                  </td>
                )}
                {columns.map((column, columnIndex) => {
                  const text = column.dataIndex ? (record as any)[column.dataIndex] : null;
                  const cellContent = column.render ? column.render(text, record, index) : text;

                  return (
                    <td
                      key={column.key || column.dataIndex || columnIndex}
                      className={cx(styles.tableCell, {
                        [styles.tableColumnSorted]: state.sortColumn === column,
                        [styles.tableColumnFiltered]: column.filtered,
                        [column.className || '']: column.className,
                      })}
                      style={{
                        textAlign: column.align,
                      }}
                    >
                      {cellContent}
                    </td>
                  );
                })}
              </tr>
              {renderExpandedRow()}
            </React.Fragment>
          );
        })}
      </tbody>
    );
  };

  // 渲染分页
  const renderPagination = () => {
    if (!pagination) {
      return null;
    }

    const paginationProps = {
      ...pagination,
      current: state.currentPage,
      pageSize: state.pageSize,
      total: dataSource.length,
      onChange: handlePageChange,
      onShowSizeChange: (current: number, size: number) => {
        handlePageChange(current, size);
      },
    };

    return (
      <div className={styles.tablePagination}>
        <Pagination {...paginationProps} />
      </div>
    );
  };

  // 计算类名
  const tableClassName = cx(
    styles.table,
    {
      [styles.tableBordered]: bordered,
      [styles.tableMainSmall]: size === 'small',
      [styles.dark]: dark,
    },
    className
  );

  // 计算样式
  const tableStyle: CSSProperties = {
    ...style,
    tableLayout,
  };

  // 渲染加载状态
  const loadingProp = loading === true ? { spinning: true } : loading;
  const isLoading = loadingProp && loadingProp.spinning;

  return (
    <div className={tableClassName} style={tableStyle}>
      <div className={styles.tableWrapper}>
        {title && <div className={styles.tableTitle}>{typeof title === 'function' ? title(dataSource) : title}</div>}
        <div className={styles.tableContent}>
          <Spin spinning={isLoading}>
            <div
              className={cx(styles.tableScroll, {
                [styles.tableScrollHorizontal]: scroll && scroll.x,
              })}
              style={{
                maxHeight: scroll && scroll.y ? scroll.y : undefined,
                overflowY: scroll && scroll.y ? 'auto' : undefined,
              }}
            >
              <table className={styles.tableMain}>
                {renderHeader()}
                {renderBody()}
              </table>
            </div>
          </Spin>
        </div>
        {footer && <div className={styles.tableFooter}>{typeof footer === 'function' ? footer(dataSource) : footer}</div>}
        {renderPagination()}
      </div>
    </div>
  );
};

export default Table;