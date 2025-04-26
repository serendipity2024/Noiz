/* eslint-disable import/no-default-export */
import { createContext } from 'react';
import AuthStore from './stores/AuthStore';
import EditorStore from './stores/EditorStore';
import PersistedStore from './stores/PersistedStore';
import ProjectStore from './stores/ProjectStore';
import CoreStore from './stores/CoreStore';
import ValidationStore from './stores/ValidationStore';
import DiffStore from './stores/DiffStore';
import { DryRunStore } from './stores/DryRunStore';
import { SessionStore } from './stores/SessionStore';
import { TypeSystemStore } from './stores/TypeSystemStore';
import { FeatureStore } from './stores/FeatureStore';
import { SmsTemplateStore } from './stores/SmsTemplateStore';
import { FileStore } from './stores/FileStore';
import { AccountTagStore } from './stores/AccountTagStore';
import { AccountStore } from './stores/AccountStore';
import { DataModelStore } from './stores/DataModelStore';
import { RequestDebugStore } from './stores/RequestDebugStore';

export enum StoreTarget {
  ACCOUNT = 'accountStore',
  ACCOUNT_TAG = 'accountTagStore',
  AUTH = 'authStore',
  CORE = 'coreStore',
  DATA_MODEL = 'dataModelStore',
  DIFF = 'diffStore',
  DRY_RUN = 'dryRunStore',
  EDITOR = 'editorStore',
  FEATURE = 'featureStore',
  FILE = 'fileStore',
  PERSISTED = 'persistedStore',
  PROJECT = 'projectStore',
  REQUEST_DEBUG = 'requestDebugStore',
  SESSION = 'sessionStore',
  SMS_TEMPLATES = 'smsTemplateStore',
  TYPE_SYSTEM = 'typeSystemStore',
  VALIDATION = 'validationStore',
}

export const AllStores = {
  [StoreTarget.ACCOUNT]: new AccountStore(),
  [StoreTarget.ACCOUNT_TAG]: new AccountTagStore(),
  [StoreTarget.AUTH]: new AuthStore(),
  [StoreTarget.CORE]: new CoreStore(),
  [StoreTarget.DATA_MODEL]: new DataModelStore(),
  [StoreTarget.DIFF]: new DiffStore(),
  [StoreTarget.DRY_RUN]: new DryRunStore(),
  [StoreTarget.EDITOR]: new EditorStore(),
  [StoreTarget.FEATURE]: new FeatureStore(),
  [StoreTarget.FILE]: new FileStore(),
  [StoreTarget.PERSISTED]: new PersistedStore(),
  [StoreTarget.PROJECT]: new ProjectStore(),
  [StoreTarget.REQUEST_DEBUG]: new RequestDebugStore(),
  [StoreTarget.SESSION]: new SessionStore(),
  [StoreTarget.SMS_TEMPLATES]: new SmsTemplateStore(),
  [StoreTarget.TYPE_SYSTEM]: new TypeSystemStore(),
  [StoreTarget.VALIDATION]: new ValidationStore(),
};

export type AllStores = typeof AllStores;

const StoreContexts = createContext(AllStores);

export default StoreContexts;
