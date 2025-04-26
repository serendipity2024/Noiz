/* eslint-disable import/no-default-export */
export enum ComponentModelType {
  // base components
  BASE_COMPONENT = 'base-component',
  BASE_CONTAINER = 'base-container',

  // mobile components
  MOBILE_PAGE = 'mobile-page',
  BUTTON = 'button',
  TEXT = 'text',
  CUSTOM_VIEW = 'custom-view',
  CUSTOM_LIST = 'custom-list',
  HORIZONTAL_LIST = 'horizontal-list',
  IMAGE = 'image',
  VIDEO = 'video',
  LOTTIE = 'lottie',
  ICON = 'icon',
  MOBILE_STATUS_BAR = 'mobile-status-bar',
  WECHAT_NAVIGATION_BAR = 'wechat-navigation-bar',
  MOBILE_NAVIGATION_BAR = 'mobile-navigation-bar',
  SIMPLE_LIST = 'simple-list',
  SLOT_FOOTER = 'slot-footer',
  RICH_TEXT = 'rich-text',
  INPUT = 'input',
  NUMBER_INPUT = 'number-input',
  DATA_PICKER = 'data-picker',
  IMAGE_PICKER = 'image-picker',
  VIDEO_PICKER = 'video-picker',
  FILE_PICKER = 'file-picker',
  TAB_VIEW = 'tab-view',
  BLANK_CONTAINER = 'blank-container',
  SCROLL_VIEW = 'scroll-view',
  SELECT_VIEW = 'select-view',
  SWITCH = 'switch',
  MODAL_VIEW = 'modal-view',
  MULTI_IMAGE = 'multi-image',
  MULTI_IMAGE_PICKER = 'multi-image-picker',
  MAP_VIEW = 'map-view',
  ADVERT_BANNER = 'advert-banner',
  COUNT_DOWN = 'count-down',
  PROGRESS_BAR = 'progress-bar',
  CALENDER = 'calendar',
  CAMERA_VIEW = 'camera-view',
  CONDITIONAL_CONTAINER = 'conditional-container',
  CONDITIONAL_CONTAINER_CHILD = 'conditional-container-child',
  CUSTOM_MULTI_IMAGE_PICKER = 'custom-multi-image-picker',
  WECHAT_OFFICIAL_ACCOUNT = 'wechat-official-account',

  // web components
  WEB_PAGE = 'web-page',
  WEB_BUTTON = 'web-button',
  WEB_TEXT = 'web-text',
  WEB_CUSTOM_VIEW = 'web-custom-view',

  UNKNOWN = 'unknown',
}

export default ComponentModelType;
