/* eslint-disable import/no-default-export */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-param-reassign */
import { action, observable } from 'mobx';
import { SubsystemFragment } from '../../graphQL/__generated__/SubsystemFragment';
import { AppSchemaFragment } from '../../graphQL/__generated__/AppSchemaFragment';
import BaseComponentModel from '../../models/base/BaseComponentModel';
import BaseContainerModel from '../../models/base/BaseContainerModel';
import { BuildTarget } from '../../shared/data/BuildTarget';
import { Device } from '../../shared/data/Devices';
import DeviceViewportSizes from '../../shared/data/DeviceViewportSizes';
import { DataModel } from '../../shared/type-definition/DataModel';
import { FunctorApi } from '../../shared/type-definition/FunctorSchema';
import { ThirdPartySchemaGroup } from '../../shared/type-definition/ThirdPartySchema';
import { ColorTheme, ShortId } from '../../shared/type-definition/ZTypes';
import { ZColors, ZThemedColors } from '../../utils/ZConst';
import { AllStores } from '../StoreContexts';
import CoreStoreDataType, {
  AppConfiguration,
  AppGlobalSetting,
  ComponentTemplate,
  CompositeConfiguration,
  Configuration,
  WechatConfiguration,
} from './CoreStoreDataType';
import { ZedSupportedPlatform } from '../../models/interfaces/ComponentModel';
import {
  EventBinding,
  EventType,
  UserLoginActionType,
} from '../../shared/type-definition/EventBinding';
import { ActionFlow } from '../../shared/type-definition/ActionFlow';
import { ManagementConsoleConfig } from '../../shared/type-definition/ManagementConsole';
import { ThirdPartyRequest } from '../../shared/type-definition/ThirdPartyRequest';

const defaultTargetDevice: Device = 'iphone8';
const defaultBuildTarget: BuildTarget[] = ['WECHAT_MINIPROGRAM', 'MANAGEMENT_CONSOLE'];
const { width, height } = DeviceViewportSizes[defaultTargetDevice];
const defaultViewport = { width, height };

export const getConfiguration = (): CompositeConfiguration => {
  const { editorPlatform } = AllStores.editorStore;
  let configuration: CompositeConfiguration;
  switch (editorPlatform) {
    case ZedSupportedPlatform.WECHAT:
      configuration = AllStores.coreStore.wechatConfiguration;
      break;
    case ZedSupportedPlatform.WEB:
      configuration = AllStores.coreStore.webConfiguration;
      break;
    case ZedSupportedPlatform.MOBILE_WEB:
      configuration = AllStores.coreStore.mobileWebConfiguration;
      break;
    default:
      configuration = AllStores.coreStore.wechatConfiguration;
  }
  return configuration;
};

const wechatSilentLoginObject = {
  type: EventType.USER_LOGIN,
  value: UserLoginActionType.WECHAT_SILENT_LOGIN,
  successActions: [],
  failedActions: [],
} as EventBinding;

export const DefaultCoreStoreValues: CoreStoreDataType = {
  wechatRootMRefs: [],
  mobileWebRootMRefs: [],
  webRootMRefs: [],
  mRefMap: {},
  componentTemplates: [],
  dataModel: {
    tableMetadata: [],
    relationMetadata: [],
  },
  colorTheme: {
    background: ZColors.WHITE,
    primary: ZThemedColors.PRIMARY,
    accent: ZThemedColors.ACCENT,
  },
  colorThemeLabelMap: {},
  appGlobalSetting: {
    appDidLoad: [],
    globalVariableTable: {},
  },
  appConfiguration: {
    isReady: false,
    buildTarget: defaultBuildTarget,
    // TODO: clean up - rename this since it is not url
    iconfontScriptUrl: '//at.alicdn.com/t/font_1881519_t8mdeb1qdeq.js',
  },
  wechatConfiguration: {
    initialScreenMRef: undefined,
    viewport: defaultViewport,
    targetDevice: defaultTargetDevice,
    pageCountInMainPackage: 6,
    pageCountInSubPackage: 12,
    appDidLoad: [wechatSilentLoginObject],
    globalVariableTable: {},
    tabBarSetting: undefined,
  },
  webConfiguration: {
    initialScreenMRef: undefined,
    viewport: defaultViewport,
    targetDevice: defaultTargetDevice,
    appDidLoad: [],
    globalVariableTable: {},
    tabBarSetting: undefined,
  },
  mobileWebConfiguration: {
    initialScreenMRef: undefined,
    viewport: defaultViewport,
    targetDevice: defaultTargetDevice,
    appDidLoad: [],
    globalVariableTable: {},
    tabBarSetting: undefined,
  },
  mcConfiguration: {
    userRoles: [],
    menuItems: [],
    objects: [],
  },

  remoteApiSchema: [],
  functors: [],
  actionFlows: [],
  thirdPartyApiConfigs: [],
  subsystemRecords: [],
  zedVersion: '1.6.8',
};

export default class CoreStore {
  /*
   * =======================
   * || Observable Fields ||
   * =======================
   */
  @observable
  public wechatRootMRefs: ShortId[] = DefaultCoreStoreValues.wechatRootMRefs;

  @observable
  public mobileWebRootMRefs: ShortId[] = DefaultCoreStoreValues.mobileWebRootMRefs;

  @observable
  public webRootMRefs: ShortId[] = DefaultCoreStoreValues.webRootMRefs;

  @observable
  public mRefMap: Record<ShortId, BaseComponentModel> = DefaultCoreStoreValues.mRefMap;

  @observable
  public componentTemplates: ComponentTemplate[] = DefaultCoreStoreValues.componentTemplates;

  @observable
  public dataModel: DataModel = DefaultCoreStoreValues.dataModel;

  @observable
  public colorTheme: ColorTheme = DefaultCoreStoreValues.colorTheme;

  @observable
  public colorThemeLabelMap: Record<string, string> = DefaultCoreStoreValues.colorThemeLabelMap;

  @observable
  public appConfiguration: AppConfiguration = DefaultCoreStoreValues.appConfiguration;

  @observable
  public appGlobalSetting: AppGlobalSetting = DefaultCoreStoreValues.appGlobalSetting;

  @observable
  public wechatConfiguration: WechatConfiguration = DefaultCoreStoreValues.wechatConfiguration;

  @observable
  public webConfiguration: Configuration = DefaultCoreStoreValues.webConfiguration;

  @observable
  public mobileWebConfiguration: Configuration = DefaultCoreStoreValues.mobileWebConfiguration;

  @observable
  public mcConfiguration: ManagementConsoleConfig = DefaultCoreStoreValues.mcConfiguration;

  @observable
  public remoteApiSchema: ThirdPartySchemaGroup[] = DefaultCoreStoreValues.remoteApiSchema;

  @observable
  public functors: FunctorApi[] = DefaultCoreStoreValues.functors;

  @observable
  public actionFlows: ActionFlow[] = DefaultCoreStoreValues.actionFlows;

  @observable
  public thirdPartyApiConfigs: ThirdPartyRequest[] = DefaultCoreStoreValues.thirdPartyApiConfigs;

  @observable
  public subsystemRecords: SubsystemFragment[] = DefaultCoreStoreValues.subsystemRecords;

  public readonly zedVersion = DefaultCoreStoreValues.zedVersion;

  /*
   * ====================
   * || Helper Methods ||
   * ====================
   */
  public getModel<T extends BaseComponentModel>(mRef: ShortId): T | undefined {
    return this.mRefMap[mRef] as T;
  }

  public getModelsByName(name: string): BaseComponentModel[] {
    return Object.values(this.mRefMap).filter((value) => value.name === name);
  }

  /*
   * =============
   * || Actions ||
   * =============
   */
  @action
  public rehydrate(newStore: Partial<CoreStoreDataType>): void {
    const {
      wechatRootMRefs,
      mobileWebRootMRefs,
      webRootMRefs,
      mRefMap,
      componentTemplates,
      dataModel,
      colorTheme,
      appConfiguration,
      wechatConfiguration,
      webConfiguration,
      mobileWebConfiguration,
      mcConfiguration,
      remoteApiSchema,
      functors,
      actionFlows,
      thirdPartyApiConfigs,
      subsystemRecords,
    } = newStore;

    if (wechatRootMRefs) this.wechatRootMRefs = wechatRootMRefs;
    if (mobileWebRootMRefs) this.mobileWebRootMRefs = mobileWebRootMRefs;
    if (webRootMRefs) this.webRootMRefs = webRootMRefs;
    if (mRefMap) this.mRefMap = mRefMap;
    if (componentTemplates) this.componentTemplates = componentTemplates;

    if (dataModel) {
      this.dataModel = dataModel;
    } else {
      throw new Error(`reduceHydrateCore newState dataModel invalid, have ${newStore}`);
    }
    if (colorTheme) this.colorTheme = colorTheme;
    if (appConfiguration) this.appConfiguration = { ...this.appConfiguration, ...appConfiguration };
    if (wechatConfiguration)
      this.wechatConfiguration = { ...this.wechatConfiguration, ...wechatConfiguration };
    if (webConfiguration) this.webConfiguration = { ...this.webConfiguration, ...webConfiguration };
    if (mobileWebConfiguration)
      this.mobileWebConfiguration = { ...this.mobileWebConfiguration, ...mobileWebConfiguration };
    if (mcConfiguration) this.mcConfiguration = mcConfiguration;

    if (remoteApiSchema) this.remoteApiSchema = remoteApiSchema;
    if (functors) this.functors = functors;
    if (actionFlows) this.actionFlows = actionFlows;
    if (thirdPartyApiConfigs) this.thirdPartyApiConfigs = thirdPartyApiConfigs;
    if (subsystemRecords) this.subsystemRecords = subsystemRecords;

    this.appConfiguration.isReady = true;
    AllStores.diffStore.clearAllDiffs();
    AllStores.validationStore.rehydrate();
    AllStores.typeSystemStore.rehydrate();
    AllStores.projectStore.projectStatus = 'LOADED';
  }

  public exportCore(): void {
    this.exportAppSchema(this);
  }

  public exportAppSchema(schema: CoreStore | AppSchemaFragment, fileName = 'data'): void {
    const json = JSON.stringify(schema);
    const blob = new Blob([json], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = `${fileName}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  @action
  public removeComponent(targetMRef: ShortId): void {
    const target = this.getModel(targetMRef);
    if (!target) return;

    delete this.mRefMap[targetMRef];
    target.relatedMRefs.map((mRef) => this.removeComponent(mRef));

    // remove all children, DFS
    if (!target.isContainer) return;
    (target as BaseContainerModel).childMRefs.map((mRef) => this.removeComponent(mRef));

    if (target.isRootContainer) {
      this.wechatRootMRefs = this.wechatRootMRefs.filter((mRef) => mRef !== targetMRef);
      this.mobileWebRootMRefs = this.mobileWebRootMRefs.filter((mRef) => mRef !== targetMRef);
      this.webRootMRefs = this.webRootMRefs.filter((mRef) => mRef !== targetMRef);
    }
  }

  @action
  public updateComponentModel(newModel: BaseComponentModel): void {
    this.mRefMap[newModel.mRef] = newModel;
  }

  @action
  public processComponentModel(
    targetMRef: ShortId,
    process: (model: BaseComponentModel) => void
  ): void {
    const model = this.getModel(targetMRef);
    if (!model) return;
    process(model);
  }

  @action
  public addChildComponent(parentMRef: ShortId, childMRef: ShortId): void {
    this.processComponentModel(parentMRef, (model: BaseComponentModel) =>
      (model as BaseContainerModel).childMRefs.push(childMRef)
    );
  }

  @action
  public removeChildMRef(parentMRef: ShortId, childMRef: ShortId): void {
    this.processComponentModel(parentMRef, (model: BaseComponentModel) =>
      (model as BaseContainerModel).removeChildByMRef(childMRef)
    );
  }

  @action
  public updateAppConfiguration(newAppConfiguration: Partial<AppConfiguration>): void {
    this.appConfiguration = { ...this.appConfiguration, ...newAppConfiguration };
  }

  @action
  public updateWechatConfiguration(newWechatConfiguration: Partial<WechatConfiguration>): void {
    this.wechatConfiguration = { ...this.wechatConfiguration, ...newWechatConfiguration };
  }

  @action
  public updateWebConfiguration(newWebConfiguration: Partial<Configuration>): void {
    this.webConfiguration = { ...this.webConfiguration, ...newWebConfiguration };
  }

  @action
  public updateMobileWebConfiguration(newMobileWebConfiguration: Partial<Configuration>): void {
    this.mobileWebConfiguration = { ...this.mobileWebConfiguration, ...newMobileWebConfiguration };
  }

  @action
  public updateConfiguration(newConfiguration: Partial<CompositeConfiguration>): void {
    const { editorStore } = AllStores;
    switch (editorStore.editorPlatform) {
      case ZedSupportedPlatform.WECHAT:
        this.updateWechatConfiguration(newConfiguration);
        break;
      case ZedSupportedPlatform.WEB:
        this.updateWebConfiguration(newConfiguration);
        break;
      case ZedSupportedPlatform.MOBILE_WEB:
        this.updateMobileWebConfiguration(newConfiguration);
        break;
      default:
        this.updateWechatConfiguration(newConfiguration);
        break;
    }
  }

  @action
  public updateRemoteApiSchema(remoteApiSchema: ThirdPartySchemaGroup[]): void {
    this.remoteApiSchema = remoteApiSchema;
  }

  @action
  public updateFunctors(functors: FunctorApi[]): void {
    this.functors = functors;
  }

  @action
  public addFunctor(functor: FunctorApi): void {
    this.functors = [...this.functors, functor];
  }

  @action
  public reset(): void {
    AllStores.coreStore = new CoreStore();
  }
}
