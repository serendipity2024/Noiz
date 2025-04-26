/* eslint-disable import/no-default-export */
import { message } from 'antd';

export type ZNotificationLevel = 'fyi' | 'info' | 'success' | 'warning' | 'error';

interface ZNotificationData {
  key: string;
  level: ZNotificationLevel;
}

interface ZUnregisteredNotificationData {
  text: string;
  level: ZNotificationLevel;
}

const createNotificationData = (key: string, level: ZNotificationLevel): ZNotificationData => ({
  key,
  level,
});

export const ZMessage = {
  // auth
  LOGIN_SUCCEESS: createNotificationData('loginSuccess', 'info'),
  LOGIN_EXPIRED: createNotificationData('loginExpired', 'error'),
  LOGIN_FAILURE: createNotificationData('failedToLogin', 'error'),
  FETCH_USER_INFO_FAILURE: createNotificationData('failedToFetchUser', 'error'),
  REDIRECT_TO_LOGIN: createNotificationData('redirectToLogin', 'info'),
  REDEEM_CODE_SUCCESS: createNotificationData('redeemCodeSuccess', 'info'),
  REDEEM_CODE_FAILURE: createNotificationData('failedToRedeemCode', 'error'),
  SEND_VERIFICATION_CODE_SUCCESS: createNotificationData('sendVerficationCodeSuccess', 'fyi'),
  SEND_VERIFICATION_CODE_FAILURE: createNotificationData('sendVerficationCodeFailure', 'error'),
  RESET_PASSWORD_SUCCESS: createNotificationData('resetPasswordSuccess', 'info'),

  // pay
  BALANCE_NOT_ENOUGH: createNotificationData('balanceNotEnough', 'error'),

  // project lifecycle
  PROJECT_INIT_FAILURE: createNotificationData('projectInitFailure', 'error'),
  PROJECT_NO_TARGET: createNotificationData('projectNoTarget', 'error'),
  PROJECT_FETCHING_SUCCESS: createNotificationData('projectFetchingSuccess', 'success'),
  PROJECT_CREATION_SUCCESS: createNotificationData('projectCreationSuccess', 'success'),
  PROJECT_CREATION_FAILURE: createNotificationData('projectCreationFailure', 'error'),
  PROJECT_INFO_INVALID: createNotificationData('projectInfoInvalid', 'error'),
  PROJECT_NAME_MISSING: createNotificationData('projectNameMissing', 'error'),
  PROJECT_MINI_PROGRAM_APP_ID_MISSING: createNotificationData(
    'projectMiniProgramAppIdMissing',
    'error'
  ),
  PROJECT_MINI_PROGRAM_APP_SECRET_MISSING: createNotificationData(
    'projectMiniProgramAppSecretMissing',
    'error'
  ),
  PROJECT_SAVED: createNotificationData('projectSaved', 'success'),
  PROJECT_SAVE_FAILURE: createNotificationData('projectSaveFailure', 'error'),
  PROJECT_DELETION_FAILURE: createNotificationData('projectDeletionFailed', 'error'),
  PROJECT_RESET_SUBMISSION_FAILURE: createNotificationData('projectResetSubmissionFailed', 'error'),
  PROJECT_DETAILS_SAVED: createNotificationData('projectDetailsSaved', 'success'),
  PROJECT_DETAILS_SAVE_FAILURE: createNotificationData('projectDetailsSaveFailed', 'error'),
  PROJECT_DETAILS_SAVE_SUBMISSION_FAILURE: createNotificationData(
    'projectDetailsSaveSubmissionFailed',
    'error'
  ),
  PROJECT_UPLOAD_FAILURE: createNotificationData('projectUploadFailure', 'error'),
  PROJECT_CHECK_FAILURE: createNotificationData('projectCheckFailure', 'error'),
  PROJECT_CHECK_SUCCESS: createNotificationData('projectCheckSuccess', 'success'),
  PROJECT_DEPLOYMENT_STARTED: createNotificationData('projectDeploymentStarted', 'info'),
  PROJECT_DEPLOYMENT_FAILURE: createNotificationData('projectDeploymentFailure', 'error'),
  PROJECT_DEPLOYMENT_SUBMISSION_FAILURE: createNotificationData(
    'projectDeploymentSubmissionFailure',
    'error'
  ),
  DEVELOPER_MODE_VERIFICATION_FAILURE: createNotificationData(
    'failedToVerifyDeveloperMode',
    'error'
  ),
  DEVELOPER_MODE_VERIFICATION_SUBMISSION_FAILURE: createNotificationData(
    'failedToSubmitDeveloperModeVerification',
    'error'
  ),

  PROJECT_GET_PRE_AUTH_PATH_URL_FAILURE: createNotificationData(
    'projectGetPreAuthPathUrlFailure',
    'error'
  ),
  PROJECT_GET_SUPERSET_ACCESS_URL_FAILURE: createNotificationData(
    'projectGetSupersetAccessUrlFailure',
    'error'
  ),
  PROJECT_SUBMIT_AUDIT_FAILURE: createNotificationData('projectSubmitAuditFailure', 'error'),
  PROJECT_SUBMIT_AUDIT_SUCCESS: createNotificationData('projectSubmitAuditSuccess', 'success'),
  PROJECT_PUBLISH_FAILURE: createNotificationData('projectPublishFailure', 'error'),
  PROJECT_PUBLISH_SUCCESS: createNotificationData('projectPublishSuccess', 'success'),

  // project config
  CONFIG_WECHAT_SUCCESS: createNotificationData('configWechatSuccess', 'success'),
  CONFIG_WECHAT_FAILURE: createNotificationData('configWechatFailure', 'error'),
  CONFIG_CLOUD_SUCCESS: createNotificationData('configCloudSuccess', 'success'),
  CONFIG_CLOUD_FAILURE: createNotificationData('configCloudFailure', 'error'),
  CONFIG_EMAIL_SUCCESS: createNotificationData('configEmailSuccess', 'success'),
  CONFIG_EMAIL_FAILURE: createNotificationData('configEmailFailure', 'error'),
  CONFIG_SMS_SUCCESS: createNotificationData('configSmsSuccess', 'success'),
  CONFIG_SMS_FAILURE: createNotificationData('configSmsFailure', 'error'),
  CONFIG_BUSINESS_LICENSE_SUCCESS: createNotificationData(
    'configBusinessLicenseSuccess',
    'success'
  ),
  CONFIG_BUSINESS_LICENSE_FAILURE: createNotificationData('configBusinessLicenseFailure', 'error'),
  CONFIG_PAGES_PACKAGE_NUMBER_SUCCESS: createNotificationData(
    'configPagesPackageNumberSuccess',
    'success'
  ),
  CONFIG_PAGES_PACKAGE_NUMBER_FAILURE: createNotificationData(
    'configPagesPackageNumberFailure',
    'error'
  ),

  // components
  UPLOAD_FILE_UNSUPPORTED: createNotificationData('uploadFileUnsupported', 'error'),
  UPLOAD_PICTURE_EXCEEDING_MAX_SIZE: createNotificationData(
    'uploadPictureExceedingMaxSize',
    'error'
  ),
  UPLOAD_FILE_EXCEEDING_MAX_SIZE: createNotificationData('uploadFileExceedingMaxSize', 'error'),
  COMPONENT_TEMPLATES_CANNOT_NEST_ITSELF: createNotificationData(
    'componentTemplatesCanNotNestItSelf',
    'error'
  ),

  // user interactions
  COPIED_TO_CLIPBOARD: createNotificationData('copiedToClipboard', 'fyi'),
  PASTED_FROM_CLIPBOARD: createNotificationData('pastedFromClipboard', 'fyi'),
  SETTING_CLIPBOARD_CONTAINER: createNotificationData('settingClipboardContainer', 'fyi'),
  SHARING_LINK_COPIED: createNotificationData('sharingLinkCopied', 'success'),
  INVITATION_CODE_COPIED: createNotificationData('invitationCodeCopied', 'success'),
  COMPONENT_NOT_DELETABLE: createNotificationData('componentNotDeletable', 'warning'),

  // user-friendly failures/errors
  WECHAT_NOT_AUTHORIZED: createNotificationData('wechatAppNotAuthorized', 'warning'),
  NONE_CHROME_WARNING: createNotificationData('noneChromeWarning', 'warning'),
  IS_MOBILE_WARNING: createNotificationData('isMobileWarning', 'warning'),
  THEME_COLOR_IN_USE: createNotificationData('themeColorInUse', 'error'),

  // misc
  CREATE_FEEDBACK_SUCCESS: createNotificationData('feedbackSent', 'success'),
  CREATE_FEEDBACK_FAILURE: createNotificationData('failedToSendFeedback', 'error'),

  // wechat member management
  WECHAT_TESTER_ADD_SUCCESS: createNotificationData('addWechatTesterSuccess', 'success'),
  WECHAT_TESTER_ADD_FAILURE: createNotificationData('addWechatTesterFailure', 'error'),

  // wechat webview domain management
  WECHAT_WEBVIEW_DOMAIN_ADD_SUCCESS: createNotificationData('addWebViewDomainSuccess', 'success'),
  WECHAT_WEBVIEW_DOMAIN_ADD_FAILURE: createNotificationData('addWebViewDomainFailure', 'error'),

  // wechat mini app package download
  WECHAT_MINI_APP_DOWNLOAD_FAILURE: createNotificationData('wecharMiniAppDownloadFailure', 'error'),

  // build
  WECHAT_BUILD_PENDING: createNotificationData('wechatBuildPending', 'info'),
  WECHAT_BUILD_COMMENCE: createNotificationData('wechatBuildCommence', 'info'),
  WECHAT_PACKAGE_COMMENCE: createNotificationData('wechatPackageCommence', 'info'),
  WECHAT_BUILD_SUCCESS: createNotificationData('wechatBuildSuccess', 'success'),
  WECHAT_BUILD_FAILURE: createNotificationData('wechatBuildFailure', 'error'),

  MOBILE_WEB_BUILD_PENDING: createNotificationData('mobileWebBuildPending', 'info'),
  MOBILE_WEB_BUILD_COMMENCE: createNotificationData('mobileWebBuildCommence', 'info'),
  MOBILE_WEB_PACKAGE_COMMENCE: createNotificationData('mobileWebPackageCommence', 'info'),
  MOBILE_WEB_BUILD_SUCCESS: createNotificationData('mobileWebBuildSuccess', 'success'),
  MOBILE_WEB_BUILD_FAILURE: createNotificationData('mobileWebBuildFailure', 'error'),

  // left drawer
  CREATE_COMPONENT_TEMPLATE_SUCCESS: createNotificationData(
    'createCustomComponentTemplateSuccess',
    'success'
  ),
  CREATE_COMPONENT_TEMPLATE_FAILURE: createNotificationData(
    'createCustomComponentTemplateFailure',
    'error'
  ),
  UPLOAD_THIRD_PARTY_API_SUCCESS: createNotificationData('uploadThirdPartyAPISuccess', 'success'),
  UPLOAD_THIRD_PARTY_API_FAILURE: createNotificationData('uploadThirdPartyAPIFailure', 'error'),
  UPLOAD_FUNCTOR_API_SUCCESS: createNotificationData('uploadFunctorAPISuccess', 'success'),
  UPLOAD_FUNCTOR_API_FAILURE: createNotificationData('uploadFunctorAPIFailure', 'error'),

  // right drawer
  MAX_LESS_THAN_MIN: createNotificationData('maxLessThanMin', 'error'),
  MIN_LARGER_THAN_MAX: createNotificationData('minLargerThanMax', 'error'),
  ILLEGAL_STEP_VALUE: createNotificationData('illegalStepValue', 'error'),
  SAVE_LINKED_DATA_SUCCESS: createNotificationData('saveLinkedDataSuccess', 'fyi'),
  SAVE_PAGE_DATA_SUCCESS: createNotificationData('savePageDataSuccess', 'fyi'),
  SAVE_REMOTE_DATA_SUCCESS: createNotificationData('saveRemoteDataSuccess', 'fyi'),
  SAVE_CUSTOM_DATA_SUCCESS: createNotificationData('saveCustomDataSuccess', 'fyi'),
  EMPTY_DATA: createNotificationData('emptyData', 'error'),

  // share project
  GENERATE_SHARE_TOKEN_FAILURE: createNotificationData('generateShareTokenFailure', 'error'),
  JOIN_PROJECT_SUCCESS: createNotificationData('joinProjectSuccess', 'success'),
  JOIN_PROJECT_FAILURE: createNotificationData('joinProjectFailure', 'error'),

  // feature gating project
  FAILED_TO_FETCH_FEATURES: createNotificationData('failedToFetchFeatures', 'error'),

  // add component
  COMPONENT_LIMIT_ONE: createNotificationData('componentLimitOne', 'error'),
  ADD_COMPONENT_FAILURE: createNotificationData('failedToAddToThisContiner', 'error'),
};

export type ZMessageKey = keyof typeof ZMessage;

export const TextNotificationDuration = {
  LONG: 1.5,
  MEDIUM: 1,
  SHORT: 0.5,
};

export interface NotificationConfig {
  duration: number;
}

export default class ZNotification {
  constructor(public content: Record<string, any>) {
    // do nothing
  }

  public send(
    msg: ZMessageKey,
    callback?: (data: Record<string, any>) => void,
    notificationConfig?: NotificationConfig
  ): void {
    const msgData: ZNotificationData = ZMessage[msg];
    const text = this.content[msgData.key];
    this.sendTextNotification(text, msgData.level, notificationConfig);
    if (callback) callback({ ...msgData, text });
  }

  public sendUnregistered(
    msgData: ZUnregisteredNotificationData,
    callback?: (data: Record<string, any>) => void
  ): void {
    this.sendTextNotification(msgData.text, msgData.level);
    if (callback) callback({ ...msgData, key: 'unregistered' });
  }

  public sendTextNotification(
    text: string,
    level: ZNotificationLevel,
    notificationConfig?: NotificationConfig
  ): void {
    const duration = notificationConfig?.duration;
    switch (level) {
      case 'fyi':
        message.success(text, duration ?? TextNotificationDuration.SHORT);
        break;
      case 'info':
        message.info(text, duration ?? TextNotificationDuration.MEDIUM);
        break;
      case 'success':
        message.success(text, duration ?? TextNotificationDuration.MEDIUM);
        break;
      case 'error':
        message.error(text, duration ?? TextNotificationDuration.LONG);
        break;
      case 'warning':
        message.warning(text, duration ?? TextNotificationDuration.LONG);
        break;
      default:
      // do nothing
    }
  }
}
