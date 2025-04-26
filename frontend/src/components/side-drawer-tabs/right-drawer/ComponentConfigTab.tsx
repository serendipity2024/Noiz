/* eslint-disable import/no-default-export */
import React from 'react';
import { observer } from 'mobx-react';
import { ComponentModelType } from '../../../shared/type-definition/ComponentModelType';
import { NullableReactElement } from '../../../shared/type-definition/ZTypes';
import BlankContainerConfigTab from './mobile-config-tab/BlankContainerConfigTab';
import ButtonConfigTab from './mobile-config-tab/ButtonConfigTab';
import ConditionalContainerChildConfigTab from './mobile-config-tab/ConditionalContainerChildConfigTab';
import ConditionalContainerConfigTab from './mobile-config-tab/ConditionalContainerConfigTab';
import CustomListConfigTab from './mobile-config-tab/CustomListConfigTab';
import CustomViewConfigTab from './mobile-config-tab/CustomViewConfigTab';
import DataPickerTab from './mobile-config-tab/DataPickerTab';
import IconConfigTab from './mobile-config-tab/IconConfigTab';
import ImageConfigTab from './mobile-config-tab/ImageConfigTab';
import InputConfigTab from './mobile-config-tab/InputConfigTab';
import MediaPickerTab from './mobile-config-tab/MediaPickerTab';
import ModalViewConfigTab from './mobile-config-tab/ModalViewConfigTab';
import NavigationBarConfigTab from './mobile-config-tab/WechatNavigationBarConfigTab';
import NumberInputConfigTab from './mobile-config-tab/NumberInputConfigTab';
import { MobilePageConfigTab } from './mobile-config-tab/MobilePageConfigTab';
import ScrollViewConfigTab from './mobile-config-tab/ScrollViewConfigTab';
import SelectViewConfigTab from './mobile-config-tab/SelectViewConfigTab';
import SwitchConfigTab from './mobile-config-tab/SwitchConfigTab';
import TabViewConfigTab from './mobile-config-tab/TabViewConfigTab';
import TextConfigTab from './mobile-config-tab/TextConfigTab';
import HorizontalListConfigTab from './mobile-config-tab/HorizontalListConfigTab';
import VideoConfigTab from './mobile-config-tab/VideoConfigTab';
import MultiImageConfigTab from './mobile-config-tab/MultiImageConfigTab';
import MultiImagePickerConfigTab from './mobile-config-tab/MultiImagePickerConfigTab';
import MapViewConfigTab from './mobile-config-tab/MapViewConfigTab';
import AdvertBannerConfigTab from './mobile-config-tab/AdvertBannerConfigTab';
import CountDownConfigTab from './mobile-config-tab/CountDownConfigTab';
import LottieConfigTab from './mobile-config-tab/LottieConfigTab';
import ProgressBarConfigTab from './mobile-config-tab/ProgressBarConfigTab';
import CalendarConfigTab from './mobile-config-tab/CalendarConfigTab';
import CameraViewConfigTab from './mobile-config-tab/CameraViewConfigTab';
import RichTextConfigTab from './mobile-config-tab/RichTextConfigTab';
import WebButtonConfigTab from './web-config-tab/WebButtonConfigTab';
import WebPageConfigTab from './web-config-tab/WebPageConfigTab';
import CustomMultiImagePickerConfigTab from './mobile-config-tab/CustomMultiImagePickerConfigTab';
import WebTextConfigTab from './web-config-tab/WebTextConfigTab';
import WebCustomViewConfigTab from './web-config-tab/WebCustomViewConfigTab';
import MobileNavigationBarConfigTav from './mobile-config-tab/MobileNavigationBarConfigTab';
import StoreHelpers from '../../../mobx/StoreHelpers';
import { MRefProp } from '../../mobile-components/PropTypes';
import { WechatOfficialAccountConfigTab } from './mobile-config-tab/WechatOfficialAccountConfigTab';

const ConfigTabComponentByModelType: Record<ComponentModelType, any> = {
  // base-components
  [ComponentModelType.BASE_COMPONENT]: null,
  [ComponentModelType.BASE_CONTAINER]: null,

  // wechat components
  [ComponentModelType.MOBILE_PAGE]: MobilePageConfigTab,
  [ComponentModelType.CUSTOM_VIEW]: CustomViewConfigTab,
  [ComponentModelType.MODAL_VIEW]: ModalViewConfigTab,
  [ComponentModelType.TEXT]: TextConfigTab,
  [ComponentModelType.RICH_TEXT]: RichTextConfigTab,
  [ComponentModelType.IMAGE]: ImageConfigTab,
  [ComponentModelType.VIDEO]: VideoConfigTab,
  [ComponentModelType.LOTTIE]: LottieConfigTab,
  [ComponentModelType.BUTTON]: ButtonConfigTab,
  [ComponentModelType.INPUT]: InputConfigTab,
  [ComponentModelType.NUMBER_INPUT]: NumberInputConfigTab,
  [ComponentModelType.WECHAT_NAVIGATION_BAR]: NavigationBarConfigTab,
  [ComponentModelType.MOBILE_NAVIGATION_BAR]: MobileNavigationBarConfigTav,
  [ComponentModelType.CUSTOM_LIST]: CustomListConfigTab,
  [ComponentModelType.HORIZONTAL_LIST]: HorizontalListConfigTab,
  [ComponentModelType.DATA_PICKER]: DataPickerTab,
  [ComponentModelType.IMAGE_PICKER]: MediaPickerTab,
  [ComponentModelType.VIDEO_PICKER]: MediaPickerTab,
  [ComponentModelType.FILE_PICKER]: MediaPickerTab,
  [ComponentModelType.TAB_VIEW]: TabViewConfigTab,
  [ComponentModelType.SCROLL_VIEW]: ScrollViewConfigTab,
  [ComponentModelType.SELECT_VIEW]: SelectViewConfigTab,
  [ComponentModelType.SWITCH]: SwitchConfigTab,
  [ComponentModelType.BLANK_CONTAINER]: BlankContainerConfigTab,
  [ComponentModelType.CONDITIONAL_CONTAINER]: ConditionalContainerConfigTab,
  [ComponentModelType.CONDITIONAL_CONTAINER_CHILD]: ConditionalContainerChildConfigTab,
  [ComponentModelType.MULTI_IMAGE]: MultiImageConfigTab,
  [ComponentModelType.MULTI_IMAGE_PICKER]: MultiImagePickerConfigTab,
  [ComponentModelType.MAP_VIEW]: MapViewConfigTab,
  [ComponentModelType.ADVERT_BANNER]: AdvertBannerConfigTab,
  [ComponentModelType.COUNT_DOWN]: CountDownConfigTab,
  [ComponentModelType.PROGRESS_BAR]: ProgressBarConfigTab,
  [ComponentModelType.CAMERA_VIEW]: CameraViewConfigTab,
  [ComponentModelType.CUSTOM_MULTI_IMAGE_PICKER]: CustomMultiImagePickerConfigTab,
  [ComponentModelType.WECHAT_OFFICIAL_ACCOUNT]: WechatOfficialAccountConfigTab,

  // web components
  [ComponentModelType.WEB_PAGE]: WebPageConfigTab,
  [ComponentModelType.WEB_BUTTON]: WebButtonConfigTab,
  [ComponentModelType.WEB_TEXT]: WebTextConfigTab,
  [ComponentModelType.WEB_CUSTOM_VIEW]: WebCustomViewConfigTab,

  // not-used
  [ComponentModelType.SLOT_FOOTER]: null,
  [ComponentModelType.MOBILE_STATUS_BAR]: null,
  [ComponentModelType.SIMPLE_LIST]: null,
  [ComponentModelType.UNKNOWN]: null,
  [ComponentModelType.CALENDER]: CalendarConfigTab,
  [ComponentModelType.ICON]: IconConfigTab,
};

export default observer(function ComponentConfigTab(props: MRefProp): NullableReactElement {
  const model = StoreHelpers.findComponentModelOrThrow(props.mRef);

  const renderConfigTab = () => {
    const component = ConfigTabComponentByModelType[model.type];
    return component ? React.createElement(component, { mRef: model.mRef }) : <p>{model.mRef}</p>;
  };

  return <div key={model.mRef}>{renderConfigTab()}</div>;
});
