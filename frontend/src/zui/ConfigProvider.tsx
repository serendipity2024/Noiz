/* eslint-disable import/no-default-export */
import React, { ReactNode, createContext, useContext } from 'react';
import cx from 'classnames';
import styles from './ConfigProvider.module.scss';

// 空状态渲染函数类型
export type RenderEmptyHandler = (componentName?: string) => ReactNode;

// CSP 配置类型
export interface CSPConfig {
  nonce?: string;
}

// 国际化配置类型
export interface Locale {
  locale: string;
  Pagination?: object;
  DatePicker?: object;
  TimePicker?: object;
  Calendar?: object;
  Table?: object;
  Modal?: object;
  Popconfirm?: object;
  Transfer?: object;
  Select?: object;
  Upload?: object;
  Form?: object;
  Empty?: object;
  global?: object;
}

// 配置上下文属性类型
export interface ConfigConsumerProps {
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
  rootPrefixCls?: string;
  getPrefixCls: (suffixCls: string, customizePrefixCls?: string) => string;
  renderEmpty: RenderEmptyHandler;
  csp?: CSPConfig;
  autoInsertSpaceInButton?: boolean;
  locale?: Locale;
  pageHeader?: {
    ghost: boolean;
  };
  direction?: 'ltr' | 'rtl';
  space?: {
    size: 'small' | 'middle' | 'large' | number;
  };
  virtual?: boolean;
  dropdownMatchSelectWidth?: boolean;
}

// 配置提供者属性类型
export interface ConfigProviderProps {
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
  prefixCls?: string;
  children?: ReactNode;
  renderEmpty?: RenderEmptyHandler;
  csp?: CSPConfig;
  autoInsertSpaceInButton?: boolean;
  locale?: Locale;
  pageHeader?: {
    ghost: boolean;
  };
  direction?: 'ltr' | 'rtl';
  space?: {
    size: 'small' | 'middle' | 'large' | number;
  };
  virtual?: boolean;
  dropdownMatchSelectWidth?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

// 默认的空状态渲染函数
const DefaultRenderEmpty = (componentName?: string): ReactNode => {
  return (
    <div className={styles.empty}>
      <div className={styles.emptyImage}>
        {/* 可以在这里添加一个空状态图标 */}
        <svg
          width="64"
          height="41"
          viewBox="0 0 64 41"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g transform="translate(0 1)" fill="none" fillRule="evenodd">
            <ellipse fill="#F5F5F5" cx="32" cy="33" rx="32" ry="7" />
            <g fillRule="nonzero" stroke="#D9D9D9">
              <path d="M55 12.76L44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761V22h46v-9.24z" />
              <path
                d="M41.613 15.931c0-1.605.994-2.93 2.227-2.931H55v18.137C55 33.26 53.68 35 52.05 35h-40.1C10.32 35 9 33.259 9 31.137V13h11.16c1.233 0 2.227 1.323 2.227 2.928v.022c0 1.605 1.005 2.901 2.237 2.901h14.752c1.232 0 2.237-1.308 2.237-2.913v-.007z"
                fill="#FAFAFA"
              />
            </g>
          </g>
        </svg>
      </div>
      <div className={styles.emptyDescription}>
        {componentName ? `No ${componentName}` : 'No Data'}
      </div>
    </div>
  );
};

// 默认的配置
const defaultGetPrefixCls = (suffixCls: string, customizePrefixCls?: string) => {
  if (customizePrefixCls) return customizePrefixCls;
  return suffixCls ? `z-${suffixCls}` : 'z';
};

// 创建配置上下文
export const ConfigContext = createContext<ConfigConsumerProps>({
  getPrefixCls: defaultGetPrefixCls,
  renderEmpty: DefaultRenderEmpty,
});

// 配置消费者
export const ConfigConsumer = ConfigContext.Consumer;

// 使用配置的Hook
export const useConfig = () => useContext(ConfigContext);

// 配置提供者组件
export const ConfigProvider: React.FC<ConfigProviderProps> = (props) => {
  const {
    children,
    prefixCls,
    getPopupContainer,
    renderEmpty,
    csp,
    autoInsertSpaceInButton,
    locale,
    pageHeader,
    direction,
    space,
    virtual,
    dropdownMatchSelectWidth,
    className,
    style,
  } = props;

  const getPrefixCls = React.useCallback(
    (suffixCls: string, customizePrefixCls?: string) => {
      if (customizePrefixCls) return customizePrefixCls;
      const prefix = prefixCls || 'z';
      return suffixCls ? `${prefix}-${suffixCls}` : prefix;
    },
    [prefixCls]
  );

  const config = {
    getPrefixCls,
    renderEmpty: renderEmpty || DefaultRenderEmpty,
    csp,
    autoInsertSpaceInButton,
    locale,
    pageHeader,
    direction,
    space,
    virtual,
    dropdownMatchSelectWidth,
  };

  if (getPopupContainer) {
    config.getPopupContainer = getPopupContainer;
  }

  return (
    <ConfigContext.Provider value={config}>
      <div className={cx(styles.configProvider, className)} style={style}>
        {children}
      </div>
    </ConfigContext.Provider>
  );
};

// 高阶组件，用于包装组件以获取配置
export function withConfigConsumer<T>(Component: React.ComponentType<T & ConfigConsumerProps>) {
  return (props: T) => (
    <ConfigConsumer>
      {(configProps) => <Component {...configProps} {...props} />}
    </ConfigConsumer>
  );
}

export default ConfigProvider;