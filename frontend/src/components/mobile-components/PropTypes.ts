/* eslint-disable import/no-default-export */
import { MutableRefObject } from 'react';
import ComponentModel from '../../models/interfaces/ComponentModel';

/**
 * 基础组件引用属性接口
 * 用于所有移动组件的基础属性类型
 */
export interface MRefProp {
  mRef: MutableRefObject<ComponentModel | null>;
}

/**
 * 带子组件的组件引用属性接口
 */
export interface MRefWithChildrenProp extends MRefProp {
  children?: React.ReactNode;
}

/**
 * 条件容器子组件属性接口
 */
export interface ConditionalContainerChildProp extends MRefProp {
  isActive: boolean;
}

/**
 * 标签页视图项属性接口
 */
export interface TabViewItemProp {
  key: string;
  title: string;
  content: React.ReactNode;
}

/**
 * 标签页视图属性接口
 */
export interface TabViewProp extends MRefProp {
  items: TabViewItemProp[];
}

/**
 * 模态视图属性接口
 */
export interface ModalViewProp extends MRefWithChildrenProp {
  visible: boolean;
  onClose?: () => void;
}

/**
 * 列表项渲染器属性接口
 */
export interface ListItemRendererProp {
  item: any;
  index: number;
}

/**
 * 自定义列表属性接口
 */
export interface CustomListProp extends MRefProp {
  data: any[];
  renderItem: (props: ListItemRendererProp) => React.ReactNode;
  keyExtractor?: (item: any, index: number) => string;
}