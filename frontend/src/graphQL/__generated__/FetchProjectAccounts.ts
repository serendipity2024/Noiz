/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CollaboratorType } from "./globalTypes";

// ====================================================
// GraphQL query operation: FetchProjectAccounts
// ====================================================

export interface FetchProjectAccounts_projectAccounts_edges_node {
  __typename: "Account";
  /**
   * 外部ID
   */
  exId: string;
  /**
   * 显示名称
   */
  displayName: string | null;
  /**
   * 项目协作者类型
   */
  projectCollaboratorType: CollaboratorType | null;
}

export interface FetchProjectAccounts_projectAccounts_edges {
  __typename: "AccountEdge";
  /**
   * 节点
   */
  node: FetchProjectAccounts_projectAccounts_edges_node;
}

export interface FetchProjectAccounts_projectAccounts {
  __typename: "AccountConnection";
  /**
   * 边
   */
  edges: FetchProjectAccounts_projectAccounts_edges[];
}

export interface FetchProjectAccounts {
  /**
   * 项目账户
   */
  projectAccounts: FetchProjectAccounts_projectAccounts | null;
}

export interface FetchProjectAccountsVariables {
  projectExId: string;
}