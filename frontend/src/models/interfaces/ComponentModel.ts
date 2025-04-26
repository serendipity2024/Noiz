/* eslint-disable import/no-default-export */
import React from 'react';
import { ComponentModelType } from '../../shared/type-definition/ComponentModelType';
import { DataBinding, Variable, VariableTable } from '../../shared/type-definition/DataBinding';
import { VerticalDirection, VerticalLayoutMode } from '../../shared/type-definition/Layout';
import { ShortId } from '../../shared/type-definition/ZTypes';
import BaseComponentModel from '../base/BaseComponentModel';
import ZFrame from './Frame';
import ZGridLayout from './GridLayout';

export enum ZedSupportedPlatform {
  WECHAT = 'wechat',
  MOBILE_WEB = 'mobile-web',
  WEB = 'web',
}

export default interface ComponentModel {
  mRef: ShortId;
  type: ComponentModelType;
  applicablePlatforms: ZedSupportedPlatform[];
  componentName: string;
  parentMRef: ShortId;
  dataAttributes: Record<string, any>;
  variableTable: VariableTable;
  localVariableTable: VariableTable;

  // template
  isTemplate: boolean;
  referencedTemplateMRef?: ShortId;
  inputDataSource?: ComponentInputOutputData[];
  outputDataSource?: ComponentInputOutputData[];

  // helper methods
  isRootContainer: boolean;
  isContainer: boolean;
  isDraggable: boolean;

  // life-cyle
  save(): void;
  getCreatedAt(): number;
  getUpdatedAt(): number;
}

export interface ComponentModelFrameable {
  verticalLayout: ComponentModelLayout | undefined;
  isFloating: boolean | undefined;

  getComponentFrame(): ZFrame;
}

export interface ComponentModelLayout {
  location: VerticalDirection;
  layoutMode: VerticalLayoutMode;
  referenceMRef?: string;
  margin?: number;
  minValue?: number;
}

export interface ComponentModelGridLayout {
  gridLayout: ZGridLayout | undefined;
}

export interface ComponentFrameConfiguration {
  positionEnabled: boolean;
  sizeEnabled: boolean;
}

export interface ComponentLayoutConfiguration {
  floatEnabled: boolean;
  locationEnabled: boolean;
  layoutModeEnabled: boolean;
}

export interface ComponentInputOutputData {
  name: string;
  variable: Variable;
  referencedData?: DataBinding;
}

export interface PreviewRenderable {
  renderForPreview(): React.ReactNode;
}

export interface ComponentFocusable {
  hasFocusMode(): boolean;
  renderForFocusView(): React.ReactNode;
}

export interface ComponentModelCopyable {
  canCopy(): boolean;
  createCopy(parentMRef?: ShortId): BaseComponentModel | null;
}

export interface ComponentCustomable {
  canCreateComponentTemplate(): boolean;
}
