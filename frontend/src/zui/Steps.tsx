/* eslint-disable import/no-default-export */
import React, { ReactElement, ReactNode, CSSProperties } from 'react';
import cx from 'classnames';
import styles from './Steps.module.scss';
import { useConfig } from './ConfigProvider';

export type StepStatus = 'wait' | 'process' | 'finish' | 'error';
export type StepDirection = 'horizontal' | 'vertical';
export type StepType = 'default' | 'navigation';
export type StepLabelPlacement = 'horizontal' | 'vertical';
export type StepSize = 'default' | 'small';

export interface StepProps {
  /** 步骤的详细描述，可选 */
  description?: ReactNode;
  /** 步骤图标的类型，可选 */
  icon?: ReactNode;
  /** 步骤条的状态，可选 */
  status?: StepStatus;
  /** 指定步骤的标题，必填 */
  title: ReactNode;
  /** 指定步骤的子标题，可选 */
  subTitle?: ReactNode;
  /** 是否禁用点击，可选 */
  disabled?: boolean;
  /** 点击步骤时触发的回调，可选 */
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  /** 自定义类名，可选 */
  className?: string;
  /** 自定义样式，可选 */
  style?: CSSProperties;
}

export interface StepsProps {
  /** 指定当前步骤，从 0 开始记数 */
  current?: number;
  /** 指定步骤条方向 */
  direction?: StepDirection;
  /** 指定步骤条类型 */
  type?: StepType;
  /** 指定标签放置位置 */
  labelPlacement?: StepLabelPlacement;
  /** 指定大小 */
  size?: StepSize;
  /** 指定当前步骤的状态 */
  status?: StepStatus;
  /** 起始序号，从 0 开始记数 */
  initial?: number;
  /** 点状步骤条，可以设置为一个 function */
  progressDot?: boolean | ((iconDot: ReactNode, { index, status, title, description }: {
    index: number;
    status: StepStatus;
    title: ReactNode;
    description: ReactNode;
  }) => ReactNode);
  /** 步骤图标的渲染函数 */
  stepIcon?: (info: {
    index: number;
    status: StepStatus;
    title: ReactNode;
    description: ReactNode;
    node: ReactNode;
  }) => ReactNode;
  /** 点击切换步骤时触发 */
  onChange?: (current: number) => void;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: CSSProperties;
  /** 子元素 */
  children?: ReactNode;
  /** 是否使用暗色主题 */
  dark?: boolean;
  /** 自定义前缀 */
  prefixCls?: string;
}

export const Step = (props: StepProps): ReactElement => {
  const {
    description,
    icon,
    status,
    title,
    subTitle,
    disabled,
    onClick,
    className,
    style,
  } = props;

  return (
    <div className={className} style={style} onClick={disabled ? undefined : onClick}>
      {title}
    </div>
  );
};

export const Steps = (props: StepsProps): ReactElement => {
  const {
    current = 0,
    direction = 'horizontal',
    type = 'default',
    labelPlacement = 'horizontal',
    size = 'default',
    status = 'process',
    initial = 0,
    progressDot = false,
    stepIcon,
    onChange,
    className,
    style,
    children,
    dark = false,
    prefixCls: customizePrefixCls,
  } = props;

  const { getPrefixCls } = useConfig();
  const prefixCls = getPrefixCls('steps', customizePrefixCls);

  // 处理点击
  const handleClick = (index: number) => {
    if (onChange && current !== index) {
      onChange(index);
    }
  };

  // 计算类名
  const stepsClassName = cx(
    styles.steps,
    {
      [styles.stepsHorizontal]: direction === 'horizontal',
      [styles.stepsVertical]: direction === 'vertical',
      [styles.stepsNavigation]: type === 'navigation',
      [styles.stepsSmall]: size === 'small',
      [styles.stepsLabelVertical]: labelPlacement === 'vertical',
      [styles.dark]: dark,
    },
    className
  );

  // 渲染步骤
  const renderSteps = () => {
    const childrenArray = React.Children.toArray(children);
    return childrenArray.map((child: React.ReactElement, index) => {
      if (!React.isValidElement(child)) {
        return child;
      }

      // 计算状态
      let childStatus: StepStatus = 'wait';
      const stepNumber = initial + index;

      if (stepNumber < current) {
        childStatus = 'finish';
      } else if (stepNumber === current) {
        childStatus = status;
      } else {
        childStatus = 'wait';
      }

      // 处理点击
      const childProps: Partial<StepProps> = {
        ...child.props,
      };

      if (child.props.status) {
        childStatus = child.props.status;
      }

      if (!child.props.disabled && onChange) {
        childProps.onClick = (e) => {
          handleClick(stepNumber);
          if (child.props.onClick) {
            child.props.onClick(e);
          }
        };
      }

      // 渲染图标
      const renderIcon = () => {
        const iconNode = child.props.icon || (
          <span className={styles.stepsIcon}>
            {progressDot ? (
              <span className={styles.stepsItemIconDot} />
            ) : (
              stepNumber + 1
            )}
          </span>
        );

        if (stepIcon) {
          return stepIcon({
            index: stepNumber,
            status: childStatus,
            title: child.props.title,
            description: child.props.description,
            node: iconNode,
          });
        }

        return iconNode;
      };

      // 渲染尾部
      const renderTail = () => {
        if (index === childrenArray.length - 1) {
          return null;
        }
        return <div className={styles.stepsItemTail} />;
      };

      // 渲染内容
      const renderContent = () => {
        const { title, subTitle, description } = child.props;
        return (
          <div className={styles.stepsItemContent}>
            <div className={styles.stepsItemTitle}>
              {title}
              {subTitle && <div className={styles.stepsItemSubtitle}>{subTitle}</div>}
            </div>
            {description && <div className={styles.stepsItemDescription}>{description}</div>}
          </div>
        );
      };

      // 计算类名
      const itemClassName = cx(
        styles.stepsItem,
        {
          [styles.stepsItemWait]: childStatus === 'wait',
          [styles.stepsItemProcess]: childStatus === 'process',
          [styles.stepsItemFinish]: childStatus === 'finish',
          [styles.stepsItemError]: childStatus === 'error',
        },
        child.props.className
      );

      return (
        <div key={index} className={itemClassName} style={child.props.style}>
          <div className={styles.stepsItemContainer}>
            {renderTail()}
            <div className={styles.stepsItemIcon}>{renderIcon()}</div>
            {renderContent()}
          </div>
        </div>
      );
    });
  };

  return (
    <div className={stepsClassName} style={style}>
      {renderSteps()}
    </div>
  );
};

Steps.Step = Step;

export default Steps;