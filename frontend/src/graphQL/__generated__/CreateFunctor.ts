/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { FunctorCreationInputInput, Language, FunctorType } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateFunctor
// ====================================================

export interface CreateFunctor_addFunctorToProjectSchema {
  __typename: "Functor";
  /**
   * 函数ID
   */
  id: string;
  /**
   * API版本
   */
  apiVersion: string;
  /**
   * 创建时间
   */
  createdAt: any;
  /**
   * 显示名称
   */
  displayName: string;
  /**
   * 调用API名称
   */
  invokeApiName: string;
  /**
   * 函数类型
   */
  type: string;
  /**
   * 唯一ID
   */
  uniqueId: string;
  /**
   * 输入模式
   */
  inputSchema: any;
  /**
   * 输出模式
   */
  outputSchema: any;
}

export interface CreateFunctor {
  /**
   * 添加函数到项目模式
   */
  addFunctorToProjectSchema: CreateFunctor_addFunctorToProjectSchema;
}

export interface CreateFunctorVariables {
  functor: FunctorCreationInputInput;
  schemaExId: string;
}