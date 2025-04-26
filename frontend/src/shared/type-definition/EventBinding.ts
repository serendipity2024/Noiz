/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { TableFilterExp } from './TableFilterExp';
import { AllCondition } from './conditions/Condition';
import { DataBinding, PathComponent } from './DataBinding';
import { MutationObjColumn } from './Mutation';
import { ShortId } from './ZTypes';

export const TRIGGER_BINDING = 'trigger-mutation';

export enum EventType {
  SWITCH_VIEW_CASE = 'switch-view-case',
  RERUN_CONDITION = 'rerun-condition',
  NAVIGATION = 'navigation',
  MUTATION = 'mutation',
  THIRD_PARTY_API = 'thirdParty-api',
  FUNCTOR_API = 'functor-api',
  FUNCTOR = 'functor',
  BATCH_MUTATION = 'batch-mutation',
  QUERY = 'query',
  SUBSCRIPTION = 'subscription',
  SET_CLIPBOARD = 'set-clipboard',
  SET_INPUT_VALUE = 'set-input-value',
  SET_PAGE_DATA = 'set-page-data',
  SET_GLOBAL_DATA = 'set-global-data',
  REFRESH = 'refresh',
  REFRESH_LIST = 'refresh-list',
  REFRESH_CELL = 'refresh-cell',
  REFRESH_LOGIN_USER = 'refresh-login-user',
  USER_REGISTER = 'user-register',
  USER_LOGIN = 'user-login',
  SEND_VERIFICATION_CODE = 'send-verification-code',
  CHECK_VERIFICATION_CODE = 'check-verification-code',
  CONDITIONAL = 'conditional',
  SHOW_MODAL = 'show-modal',
  HIDE_MODAL = 'hide-modal',
  SHOW_TOAST = 'show-toast',
  LOG = 'log',
  AUDIO = 'audio',
  VIDEO = 'video',
  CALL_PHONE = 'call-phone',
  FULLSCREEN_IMAGE = 'fullscreen-image',
  WECHAT_CONTACT = 'wechat-contact',
  GET_LOCATION = 'get-location',
  OPEN_LOCATION = 'open-location',
  CHOOSE_LOCATION = 'choose-location',
  SCROLL_TO = 'scroll-to',
  UPLOAD_FILE = 'upload-file',
  SCROLL_PAGE_TO = 'scroll-page-to',
  OBTAIN_PHONE_NUMBER = 'obtain-phone-number',
  OPEN_WEBVIEW = 'open-web-view',
  OPEN_REWARDED_VIDEO_AD = 'open-rewarded-video-ad',
  SHARE = 'share',
  LOTTIE = 'lottie',
  COUNTDOWN = 'countdown',
  WECHAT_NOTIFICATION = 'wechat-notification',
  SMS_NOTIFICATION = 'sms-notification',
  NOTIFICATION_AUTHORIZATION = 'notification-authorization',
  GENERATE_QR_CODE = 'generate-qr-code',
  GENERATE_MINI_PROGRAM_CODE = 'generate-mini-program-code',
  SCAN_QR_CODE = 'scan-qr-code',
  PREVIEW_DOCUMENT = 'preview-document',
  OPEN_WECHAT_SETTING = 'open-wechat-setting',
  SCROLL_HORIZONTAL_LIST = 'scroll-horizontal-list',
  CONFIGURE_CAMERA = 'configure-camera',
  TAKE_PHOTO = 'take-photo',
  GET_ADMINISTRATION_AREA = 'get-administration-area',
  SET_FOLD_MODE = 'set-fold-mode',
  IMAGE_PICKER_ADD_IMAGE = 'image-picker-add-image',
  IMAGE_PICKER_DELETE_IMAGE = 'image-picker-delete-image',
  IMAGE_PICKER_REPLACE_IMAGE = 'image-picker-replace-image',
  LIST_ACTION = 'list-action',
  IMAGE_FILTER = 'image-filter',
  TRANSFORM_BITMAP_TO_IMAGE = 'transform-bitmap-to-image',
  TRANSFORM_IMAGE_TO_BITMAP = 'transform-image-to-bitmap',
  SET_COMPONENT_OUTPUT_DATA = 'set-component-output-data',
  EDIT_FILTER_AND_STICKER = 'edit-filter-and-sticker',
  ACTION_FLOW = 'action-flow',
}

export const EventTypes = Object.values(EventType);

export const isEventBinding = (input: any): boolean =>
  input && input.type && EventTypes.includes(input.type);

export enum ScreenTransitionType {
  PUSH = 'push',
  MODAL = 'modal',
  SWITCH_TO = 'switch-to',
  REDIRECT = 'redirect',
  RELAUNCH = 'reLaunch',
}

export enum NavigationOperation {
  GO = 'go',
  GO_BACK = 'go-back',
}

export enum UserLoginActionType {
  WECHAT_LOGIN = 'wechat-login',
  WECHAT_SILENT_LOGIN = 'wechat-silent-login',
  WECHAT_PHONE_NUMBER_LOGIN = 'wechat-phone-number-login',
  LOGIN = 'login',
  LOGOUT = 'logout',
}

export enum ModalViewMode {
  ALERT = 'alert',
  CUSTOM = 'custom',
}

export enum MediaAction {
  PLAY = 'play',
  PAUSE = 'pause',
  STOP = 'stop',
}

export enum Ordering {
  ASCENDING = 'ascending',
  DESCENDING = 'descending',
}

export enum SetVariableData {
  ASSIGN = 'assign',
  APPEND = 'append',
  REMOVE = 'remove',
}

export enum ConflictActionType {
  NONE = 'none',
  UPDATE = 'update',
}

export enum CountdownAction {
  START = 'start',
  PAUSE = 'pause',
  RESET = 'reset',
}

export enum NotificationMethod {
  WECHAT = 'wechat',
  SMS = 'sms',
  EMAIL = 'email',
}

export enum LottieAction {
  PLAY = 'play',
  STOP = 'stop',
  PAUSE = 'pause',
  PLAY_SEGMENTS = 'playSegments',
  SET_DIRECTION = 'setDirection',
}

export enum MiniAppCodeType {
  WECHAT = 'wechat',
  CUSTOM = 'custom',
}

export enum ScrollHorizontalListDirection {
  BACKWRAD = 'backward',
  FORWARD = 'forward',
}

export enum ScrollPageToMode {
  COMPONENT = 'component',
  TOP = 'top',
}

export enum CameraPosition {
  FRONT = 'front',
  BACK = 'back',
}

export enum CameraFlash {
  AUTO = 'auto',
  ON = 'on',
  OFF = 'off',
  TORCH = 'torch',
}

export enum CameraResolution {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum CameraFrameSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}

export enum FoldingMode {
  NONE = 'none',
  FOLDED = 'folded',
  UNFOLDED = 'unfolded',
}

export type EventBinding =
  | GraphQLRequestBinding
  | SwitchViewCaseHandleBinding
  | RerunConditionHandleBinding
  | NavigationActionHandleBinding
  | RefreshHandleBinding
  | RefreshListHandleBinding
  | RefreshCellHandleBinding
  | RefreshLoginUserHandleBinding
  | MutationZipHandleBinding
  | UserRegisterActionHandleBinding
  | UserLoginActionHandleBinding
  | SendVerificationCodeHandleBinding
  | CheckVerificationCodeHandleBinding
  | ShowModalHandleBinding
  | HideModalHandleBinding
  | ShowToastHandleBinding
  | FunctorHandleBinding
  | FullScreenImageHandleBinding
  | SetClipboardHandleBinding
  | CustomRequestBinding
  | CallPhoneHandleBinding
  | WechatContactHandleBinding
  | AudioHandleBinding
  | VideoHandleBinding
  | ConditionalActionHandleBinding
  | SetPageDataHandleBinding
  | SetGlobalDataHandleBinding
  | OpenLocationHandleBinding
  | ChooseLocationHandleBinding
  | GetLocationHandleBinding
  | UploadFileHandleBinding
  | LogHandleBinding
  | ScrollToHandleBinding
  | ScrollPageToHandleBinding
  | ObtainPhoneNumberHandleBinding
  | OpenWebViewHandleBinding
  | OpenRewardedVideoAdHandleBinding
  | ShareHandleBinding
  | CountdownHandleBinding
  | SetInputValueHandleBinding
  // | NotificationHandleBinding
  | WechatNotificationHandleBinding
  | SmsNotificationHandleBinding
  | NotificationAuthorizationHandleBinding
  | LottieHandleBinding
  | GenerateQRCodeHandleBinding
  | GenerateMiniProgramCodeHandleBinding
  | ScanQRCodeHandleBinding
  | PreviewDocumentHandleBinding
  | OpenWechatSettingHandleBinding
  | ScrollHorizontalListHandleBinding
  | ConfigureCameraHandleBinding
  | TakePhotoHandleBinding
  | GetAdministrationAreaHandleBinding
  | SetFlodModeHandleBinding
  | ImagePickerAddImageHandleBinding
  | ImagePickerDeleteImageHandleBinding
  | ImagePickerReplaceImageHandleBinding
  | ListActionHandleBinding
  | ImageFilterHandleBinding
  | TransformBitmapToImageHandleBinding
  | TransformImageToBitmapHandleBinding
  | SetComponentOutputHandleBinding
  | EditFilterAndStickerHandleBinding
  | ActionFlowHandleBinding;

export interface BaseEventBinding {
  // to be used in codegen
  mRef?: string;
}

export interface RequestResultHandleBinding {
  type: EventType;
  successActions?: EventBinding[];
  failedActions?: EventBinding[];
  onRequestStatusChangeActions?: EventBinding[];
}

export interface AuthorizationFailureHandleBinding {
  type: EventType;
  authorizationFailedActions?: EventBinding[];
}

export interface GraphQLRequestBinding extends RequestResultHandleBinding, BaseEventBinding {
  type: EventType.MUTATION | EventType.QUERY | EventType.SUBSCRIPTION;
  value: string;
  requestId: string;
  operation?: 'insert' | 'upsert' | 'update' | 'delete';
  rootFieldType: string;
  role: string;

  where?: TableFilterExp;
  isWhereError: boolean;
  object?: MutationObjColumn;
  triggers?: (
    | TriggerHandleBinding
    | WechatNotificationHandleBinding
    | SmsNotificationHandleBinding
  )[];
  distinctOnFieldNames?: string[];

  limit?: number;
  sortFields?: PathComponent[];
  sortType?: Ordering;

  onMutationConflictAction?: {
    columns: {
      pathComponents: PathComponent[];
    }[];
    constraints: string[];
    actionType: ConflictActionType;
  };

  distanceArgs?: Record<string, DataBinding>;

  listMutationSourceData?: DataBinding;
  listMutation: boolean;
}

export function fetchFieldItemType(data: GraphQLRequestBinding): string {
  const isArray: boolean = data.rootFieldType.endsWith('[]');
  return isArray
    ? data.rootFieldType.substring(0, data.rootFieldType.length - 2)
    : data.rootFieldType;
}

export interface TriggerHandleBinding {
  type: 'trigger-mutation';
  id: ShortId;
  table: string;
  operation?: 'insert' | 'upsert' | 'update' | 'delete';
  columns: string[];
  value: GraphQLRequestBinding;
}

export interface CustomRequestBinding extends RequestResultHandleBinding, BaseEventBinding {
  type: EventType.THIRD_PARTY_API | EventType.FUNCTOR_API;
  value: string;
  requestId: string;
  operation: 'query' | 'mutation';
  input?: CustomRequestField;
  output?: CustomRequestField;
  functorId?: string;
  invokeApiName?: string;
}

export interface CustomRequestField {
  name: string;
  type: string;
  itemType?: string;
  object?: CustomRequestField[];
  list?: CustomRequestField[];
  value?: DataBinding;
}

export interface SwitchViewCaseHandleBinding extends BaseEventBinding {
  type: EventType.SWITCH_VIEW_CASE;
  target: ShortId; // target conditional-container child's mRef
  value: string; // target conditional-container child's component-name
  parent: ShortId;
}

export interface RerunConditionHandleBinding extends BaseEventBinding {
  type: EventType.RERUN_CONDITION;
  value: ShortId;
}

export interface NavigationActionHandleBinding extends BaseEventBinding {
  type: EventType.NAVIGATION;
  value: string;
  targetMRef: ShortId;
  transition?: ScreenTransitionType;
  operation: NavigationOperation;
  args?: Record<string, DataBinding>;
}

export interface RefreshHandleBinding extends BaseEventBinding {
  type: EventType.REFRESH;
  refreshList: string[];
}

export interface RefreshPathComponent {
  listMRef?: ShortId;
  cellIndex?: DataBinding;
}

export interface RefreshListHandleBinding extends BaseEventBinding {
  type: EventType.REFRESH_LIST;
  refreshPathComponents: RefreshPathComponent[];
}

export interface RefreshCellHandleBinding extends RefreshPathComponent, BaseEventBinding {
  type: EventType.REFRESH_CELL;
}

export interface RefreshLoginUserHandleBinding extends BaseEventBinding {
  type: EventType.REFRESH_LOGIN_USER;
}

export interface MutationZipHandleBinding extends RequestResultHandleBinding, BaseEventBinding {
  type: EventType.BATCH_MUTATION;
  eventList: EventBinding[];
}

export const USER_REGISTER_FIELD = [
  'email',
  'emailVerificationCode',
  'phone',
  'phoneVerificationCode',
  'username',
  'password',
  'verifyPassword',
  'invitationCode',
] as const;
export interface UserRegisterActionHandleBinding
  extends RequestResultHandleBinding,
    BaseEventBinding {
  type: EventType.USER_REGISTER;
  registrationForm: Partial<Record<typeof USER_REGISTER_FIELD[number], DataBinding>>;
}

export interface UserLoginActionHandleBinding extends RequestResultHandleBinding, BaseEventBinding {
  type: EventType.USER_LOGIN;
  value: UserLoginActionType;
  loginCredential?: UserLoginCredential;
  createAccountOnLogin?: boolean;
}

export const USER_ACCOUNT_IDENTIFIER_TYPES = ['email', 'phone', 'username'] as const;
export const USER_CREDENTIAL_TYPES = ['verificationCode', 'password'] as const;
export interface UserLoginCredential {
  accountIdentifierType: typeof USER_ACCOUNT_IDENTIFIER_TYPES[number];
  accountIdentifier: DataBinding;
  credentialType: typeof USER_CREDENTIAL_TYPES[number];
  credential: DataBinding;
}

export interface SendVerificationCodeHandleBinding
  extends RequestResultHandleBinding,
    BaseEventBinding {
  type: EventType.SEND_VERIFICATION_CODE;
  target: DataBinding;
  contactType: 'email' | 'phone';
}

export interface CheckVerificationCodeHandleBinding
  extends RequestResultHandleBinding,
    BaseEventBinding {
  type: EventType.CHECK_VERIFICATION_CODE;
  target: DataBinding;
  verificationCode: DataBinding;
  contactType: 'email' | 'phone';
}

export interface ShowModalHandleBinding extends BaseEventBinding {
  type: EventType.SHOW_MODAL;
  title: string;
  detail: DataBinding;
  cancelTitle: string;
  confirmTitle: string;
  confirmActions: EventBinding[];
  mode: ModalViewMode;
  modalViewMRef?: ShortId;
}

export interface HideModalHandleBinding extends BaseEventBinding {
  type: EventType.HIDE_MODAL;
  modalViewMRef: ShortId;
}

export interface FunctorHandleBinding extends BaseEventBinding {
  type: EventType.FUNCTOR;
  name: string;
  args?: Record<string, DataBinding>;
  resultAssociatedPathComponents?: PathComponent[];
  onSucceedActions: EventBinding[];
  onFailedActions: EventBinding[];
}

export interface ShowToastHandleBinding extends BaseEventBinding {
  type: EventType.SHOW_TOAST;
  title: DataBinding;
}

export interface FullScreenImageHandleBinding extends BaseEventBinding {
  type: EventType.FULLSCREEN_IMAGE;
}

export interface SetClipboardHandleBinding extends BaseEventBinding {
  type: EventType.SET_CLIPBOARD;
  text: DataBinding;
}

export interface CallPhoneHandleBinding extends BaseEventBinding {
  type: EventType.CALL_PHONE;
  phoneNumber: DataBinding;
}

export interface WechatContactHandleBinding extends BaseEventBinding {
  type: EventType.WECHAT_CONTACT;
}

export interface AudioHandleBinding extends BaseEventBinding {
  type: EventType.AUDIO;
  src: DataBinding;
  action: MediaAction;
  loop?: boolean;
}

export interface VideoHandleBinding extends BaseEventBinding {
  type: EventType.VIDEO;
  target?: ShortId;
  action: MediaAction;
}

export interface ConditionalActionHandleBinding extends BaseEventBinding {
  type: EventType.CONDITIONAL;
  conditionalActions: ConditionalAction[];
}

export interface ConditionalAction {
  id: string;
  name?: string;
  condition: AllCondition;
  actions: EventBinding[];
}

export interface SetPageDataHandleBinding extends BaseEventBinding {
  type: EventType.SET_PAGE_DATA;
  action?: SetVariableData;
  pathComponents?: PathComponent[];
  data?: DataBinding;
}

export interface OpenLocationHandleBinding extends BaseEventBinding {
  type: EventType.OPEN_LOCATION;
  geoPoint: DataBinding;
  address: DataBinding;
  name: DataBinding;
}

export interface ChooseLocationHandleBinding
  extends RequestResultHandleBinding,
    AuthorizationFailureHandleBinding,
    BaseEventBinding {
  type: EventType.CHOOSE_LOCATION;
  geoPointAssociatedPathComponents?: PathComponent[];
  addressAssociatedPathComponents?: PathComponent[];
  nameAssociatedPathComponents?: PathComponent[];
}

export interface UploadFileHandleBinding
  extends RequestResultHandleBinding,
    AuthorizationFailureHandleBinding,
    BaseEventBinding {
  type: EventType.UPLOAD_FILE;
  fileInfoComponents?: PathComponent[];
}

export interface GetLocationHandleBinding
  extends RequestResultHandleBinding,
    AuthorizationFailureHandleBinding,
    BaseEventBinding {
  type: EventType.GET_LOCATION;
  geoPointAssociatedPathComponents?: PathComponent[];
}

export interface LogHandleBinding extends BaseEventBinding {
  type: EventType.LOG;
  title: string;
  args: Record<string, DataBinding>;
}

export interface ScrollToHandleBinding extends BaseEventBinding {
  type: EventType.SCROLL_TO;
  target?: ShortId;
  sectionIndex?: DataBinding;
}

export interface ScrollPageToHandleBinding extends BaseEventBinding {
  type: EventType.SCROLL_PAGE_TO;
  target?: ShortId;
  mode: ScrollPageToMode;
}

export interface ObtainPhoneNumberHandleBinding
  extends BaseEventBinding,
    RequestResultHandleBinding {
  type: EventType.OBTAIN_PHONE_NUMBER;
  target: PathComponent[];
}

export interface OpenWebViewHandleBinding extends BaseEventBinding {
  type: EventType.OPEN_WEBVIEW;
  src: DataBinding;
}

export interface OpenRewardedVideoAdHandleBinding extends BaseEventBinding {
  type: EventType.OPEN_REWARDED_VIDEO_AD;
  advertId: string;
  onCloseWithEndedActions: EventBinding[];
}

export interface ShareHandleBinding extends BaseEventBinding {
  type: EventType.SHARE;
  pageMRef?: ShortId;
  title: DataBinding;
  imageSource: DataBinding;
  imageObject: DataBinding;
  args?: Record<string, DataBinding>;
}

export interface CountdownHandleBinding extends BaseEventBinding {
  type: EventType.COUNTDOWN;
  action: CountdownAction;
  targetMRef: ShortId;
}

export interface SetInputValueHandleBinding extends BaseEventBinding {
  type: EventType.SET_INPUT_VALUE;
  targetMRef: ShortId;
  value: DataBinding;
}

export interface WechatNotificationHandleBinding extends BaseEventBinding {
  type: EventType.WECHAT_NOTIFICATION;
  id: ShortId;
  accountId: DataBinding;
  templateId: string;
  args?: Record<string, DataBinding>;
  content?: DataBinding;
}

export interface SmsNotificationHandleBinding extends BaseEventBinding {
  type: EventType.SMS_NOTIFICATION;
  id: ShortId;
  phoneNumber: DataBinding;
  templateId: string;
  args?: Record<string, DataBinding>;
  content?: DataBinding;
}
export interface NotificationAuthorizationHandleBinding
  extends RequestResultHandleBinding,
    BaseEventBinding {
  type: EventType.NOTIFICATION_AUTHORIZATION;
  templateIds: string[];
}

export interface LottieHandleBinding extends BaseEventBinding {
  type: EventType.LOTTIE;
  action: LottieAction;
  targetMRef: ShortId;
  startFrame: DataBinding;
  endFrame: DataBinding;
  direction: DataBinding;
}

export interface GenerateImageHandleBinding {
  type: EventType.GENERATE_QR_CODE | EventType.GENERATE_MINI_PROGRAM_CODE;
  args?: Record<string, DataBinding>;
  assignTo: PathComponent[];
  size: number;
  backgroundImageExId?: string;
  backgroundRelativePosition?: [number, number];
}

export interface GenerateQRCodeHandleBinding
  extends RequestResultHandleBinding,
    GenerateImageHandleBinding,
    BaseEventBinding {
  type: EventType.GENERATE_QR_CODE;
}

export interface GenerateMiniProgramCodeHandleBinding
  extends RequestResultHandleBinding,
    GenerateImageHandleBinding,
    BaseEventBinding {
  type: EventType.GENERATE_MINI_PROGRAM_CODE;
  codeType: MiniAppCodeType;
  pageMRef?: ShortId;
}

export interface ScanQRCodeHandleBinding extends RequestResultHandleBinding, BaseEventBinding {
  type: EventType.SCAN_QR_CODE;
  expectedFields: Record<string, PathComponent[]>;
}

export interface PreviewDocumentHandleBinding extends BaseEventBinding {
  type: EventType.PREVIEW_DOCUMENT;
  fileId: DataBinding;
}

export interface OpenWechatSettingHandleBinding extends BaseEventBinding {
  type: EventType.OPEN_WECHAT_SETTING;
}

export interface ScrollHorizontalListHandleBinding extends BaseEventBinding {
  type: EventType.SCROLL_HORIZONTAL_LIST;
  targetMRef: ShortId;
  direction: ScrollHorizontalListDirection;
}

export interface ConfigureCameraHandleBinding extends BaseEventBinding {
  type: EventType.CONFIGURE_CAMERA;
  targetMRef?: ShortId;
  devicePosition?: CameraPosition;
  flash?: CameraFlash;
}
export interface TakePhotoHandleBinding extends RequestResultHandleBinding, BaseEventBinding {
  type: EventType.TAKE_PHOTO;
  assignTo: PathComponent[];
}

export interface GetAdministrationAreaHandleBinding
  extends RequestResultHandleBinding,
    BaseEventBinding {
  type: EventType.GET_ADMINISTRATION_AREA;
  location: DataBinding;
  assignTo: PathComponent[];
}

export interface SetFlodModeHandleBinding extends BaseEventBinding {
  type: EventType.SET_FOLD_MODE;
  targetMRef?: ShortId;
  foldingMode?: FoldingMode;
}

export interface ImagePickerAddImageHandleBinding extends BaseEventBinding {
  type: EventType.IMAGE_PICKER_ADD_IMAGE;
  targetMRef?: ShortId;
}

export interface ImagePickerDeleteImageHandleBinding extends BaseEventBinding {
  type: EventType.IMAGE_PICKER_DELETE_IMAGE;
  targetMRef?: ShortId;
  index?: DataBinding;
}

export interface ImagePickerReplaceImageHandleBinding extends BaseEventBinding {
  type: EventType.IMAGE_PICKER_REPLACE_IMAGE;
  targetMRef?: ShortId;
  index?: DataBinding;
  image?: DataBinding;
}

export interface ListActionHandleBinding extends BaseEventBinding {
  type: EventType.LIST_ACTION;
  id: ShortId;
  dataSource?: DataBinding;
  itemActions?: EventBinding[];
}

export type ImageFilterParamsType =
  | DataBinding
  | Record<string, DataBinding>
  | Record<string, DataBinding>[];

export interface ImageFilterHandleBinding extends RequestResultHandleBinding, BaseEventBinding {
  type: EventType.IMAGE_FILTER;
  bitmap: DataBinding;
  filterName?: string;
  params?: Record<string, ImageFilterParamsType>;
  assignTo: PathComponent[];
}

export interface SetGlobalDataHandleBinding extends BaseEventBinding {
  type: EventType.SET_GLOBAL_DATA;
  action?: SetVariableData;
  pathComponents?: PathComponent[];
  data?: DataBinding;
}

export interface TransformBitmapToImageHandleBinding
  extends RequestResultHandleBinding,
    BaseEventBinding {
  type: EventType.TRANSFORM_BITMAP_TO_IMAGE;
  bitmap: DataBinding;
  assignTo: PathComponent[];
}

export interface TransformImageToBitmapHandleBinding
  extends RequestResultHandleBinding,
    BaseEventBinding {
  type: EventType.TRANSFORM_IMAGE_TO_BITMAP;
  image: DataBinding;
  assignTo: PathComponent[];
}

export interface SetComponentOutputHandleBinding extends BaseEventBinding {
  type: EventType.SET_COMPONENT_OUTPUT_DATA;
  action?: SetVariableData;
  pathComponents?: PathComponent[];
  data?: DataBinding;
}

export interface EditFilterAndStickerHandleBinding
  extends RequestResultHandleBinding,
    BaseEventBinding {
  type: EventType.EDIT_FILTER_AND_STICKER;
  image: DataBinding;
  assignTo: PathComponent[];
}

export interface ActionFlowHandleBinding extends RequestResultHandleBinding, BaseEventBinding {
  type: EventType.ACTION_FLOW;
  actionFlowId: string;
  inputArgs?: Record<string, DataBinding>;
  actionId: string;
}
