/* eslint-disable import/no-default-export */
import { ComponentModelType } from '../shared/type-definition/ComponentModelType';
import { NullableShortId, ShortId } from '../shared/type-definition/ZTypes';
import BaseComponentModel from './base/BaseComponentModel';
import BaseContainerModel from './base/BaseContainerModel';
import BasicFooterSlotModel from './basic-components/BasicFooterSlotModel';
import BasicMobileModel from './basic-components/BasicMobileModel';
import BlankContainerModel from './mobile-components/BlankContainerModel';
import ButtonModel from './mobile-components/ButtonModel';
import ConditionalContainerChildModel from './mobile-components/ConditionalContainerChildModel';
import ConditionalContainerModel from './mobile-components/ConditionalContainerModel';
import CustomListModel from './mobile-components/CustomListModel';
import CustomViewModel from './mobile-components/CustomViewModel';
import DataPickerModel from './mobile-components/DataPickerModel';
import FilePickerModel from './mobile-components/FilePickerModel';
import IconModel from './mobile-components/IconModel';
import ImageModel from './mobile-components/ImageModel';
import ImagePickerModel from './mobile-components/ImagePickerModel';
import InputModel from './mobile-components/InputModel';
import ModalViewModel from './mobile-components/ModalViewModel';
import WechatNavigationBarModel from './mobile-components/WechatNavigationBarModel';
import NumberInputModel from './mobile-components/NumberInputModel';
import ScrollViewModel from './mobile-components/ScrollViewModel';
import SelectViewModel from './mobile-components/SelectViewModel';
import SimpleListModel from './mobile-components/SimpleListModel';
import StatusBarModel from './mobile-components/StatusBarModel';
import SwitchModel from './mobile-components/SwitchModel';
import TabViewModel from './mobile-components/TabViewModel';
import TextModel from './mobile-components/TextModel';
import VideoPickerModel from './mobile-components/VideoPickerModel';
import HorizontalListModel from './mobile-components/HorizontalListModel';
import VideoModel from './mobile-components/VideoModel';
import MultiImageModel from './mobile-components/MultiImageModel';
import MultiImagePickerModel from './mobile-components/MultiImagePickerModel';
import MapViewModel from './mobile-components/MapViewModel';
import StoreRehydrate from '../mobx/StoreRehydrate';
import AdvertBannerModel from './mobile-components/AdvertBannerModel';
import CountDownModel from './mobile-components/CountDownModel';
import LottieModel from './mobile-components/LottieModel';
import ProgressBarModel from './mobile-components/ProgressBarModel';
import CalendarModel from './mobile-components/CalendarModel';
import CameraViewModel from './mobile-components/CameraViewModel';
import RichTextModel from './mobile-components/RichTextModel';
import BasicWebModel from './basic-components/BasicWebModel';
import WebButtonModel from './web-components/WebButtonModel';
import CustomMultiImagePickerModel from './mobile-components/CustomMultiImagePickerModel';
import WebTextModel from './web-components/WebTextModel';
import WebCustomViewModel from './web-components/WebCustomViewModel';
import MobileNavigationBarModel from './mobile-components/MobileNavigationBarModel';
import { WechatOfficialAccountModel } from './mobile-components/WechatOfficialAccountModel';

export default class ComponentModelBuilder {
  public static buildByType(
    parentMRef: ShortId,
    type: ComponentModelType,
    shouldInitialize = true
  ): BaseComponentModel {
    let model: BaseComponentModel | undefined;
    switch (type) {
      //  mobile components
      case ComponentModelType.CUSTOM_VIEW:
        model = new CustomViewModel(parentMRef);
        break;
      case ComponentModelType.BUTTON:
        model = new ButtonModel(parentMRef);
        break;
      case ComponentModelType.CUSTOM_LIST:
        model = new CustomListModel(parentMRef, shouldInitialize);
        break;
      case ComponentModelType.HORIZONTAL_LIST:
        model = new HorizontalListModel(parentMRef, shouldInitialize);
        break;
      case ComponentModelType.SIMPLE_LIST:
        model = new SimpleListModel(parentMRef);
        break;
      case ComponentModelType.MOBILE_NAVIGATION_BAR:
        model = new MobileNavigationBarModel(parentMRef);
        break;
      case ComponentModelType.WECHAT_NAVIGATION_BAR:
        model = new WechatNavigationBarModel(parentMRef);
        break;
      case ComponentModelType.MOBILE_STATUS_BAR:
        model = new StatusBarModel(parentMRef);
        break;
      case ComponentModelType.TEXT:
        model = new TextModel(parentMRef);
        break;
      case ComponentModelType.IMAGE:
        model = new ImageModel(parentMRef);
        break;
      case ComponentModelType.VIDEO:
        model = new VideoModel(parentMRef);
        break;
      case ComponentModelType.LOTTIE:
        model = new LottieModel(parentMRef);
        break;
      case ComponentModelType.INPUT:
        model = new InputModel(parentMRef);
        break;
      case ComponentModelType.NUMBER_INPUT:
        model = new NumberInputModel(parentMRef);
        break;
      case ComponentModelType.ICON:
        model = new IconModel(parentMRef);
        break;
      case ComponentModelType.DATA_PICKER:
        model = new DataPickerModel(parentMRef);
        break;
      case ComponentModelType.IMAGE_PICKER:
        model = new ImagePickerModel(parentMRef);
        break;
      case ComponentModelType.VIDEO_PICKER:
        model = new VideoPickerModel(parentMRef);
        break;
      case ComponentModelType.FILE_PICKER:
        model = new FilePickerModel(parentMRef);
        break;
      case ComponentModelType.TAB_VIEW:
        model = new TabViewModel(parentMRef, shouldInitialize);
        break;
      case ComponentModelType.SLOT_FOOTER:
        model = new BasicFooterSlotModel(parentMRef);
        break;
      case ComponentModelType.BLANK_CONTAINER:
        model = new BlankContainerModel(parentMRef);
        break;
      case ComponentModelType.CONDITIONAL_CONTAINER:
        model = new ConditionalContainerModel(parentMRef);
        break;
      case ComponentModelType.CONDITIONAL_CONTAINER_CHILD:
        model = new ConditionalContainerChildModel(parentMRef);
        break;
      case ComponentModelType.SCROLL_VIEW:
        model = new ScrollViewModel(parentMRef);
        break;
      case ComponentModelType.SELECT_VIEW:
        model = new SelectViewModel(parentMRef, shouldInitialize);
        break;
      case ComponentModelType.SWITCH:
        model = new SwitchModel(parentMRef);
        break;
      case ComponentModelType.MODAL_VIEW:
        model = new ModalViewModel(parentMRef);
        break;
      case ComponentModelType.MULTI_IMAGE:
        model = new MultiImageModel(parentMRef);
        break;
      case ComponentModelType.MULTI_IMAGE_PICKER:
        model = new MultiImagePickerModel(parentMRef);
        break;
      case ComponentModelType.MAP_VIEW:
        model = new MapViewModel(parentMRef);
        break;
      case ComponentModelType.ADVERT_BANNER:
        model = new AdvertBannerModel(parentMRef);
        break;
      case ComponentModelType.COUNT_DOWN:
        model = new CountDownModel(parentMRef);
        break;
      case ComponentModelType.PROGRESS_BAR:
        model = new ProgressBarModel(parentMRef, shouldInitialize);
        break;
      case ComponentModelType.CALENDER:
        model = new CalendarModel(parentMRef);
        break;
      case ComponentModelType.MOBILE_PAGE:
        model = new BasicMobileModel('blank-screen', shouldInitialize);
        break;
      case ComponentModelType.CAMERA_VIEW:
        model = new CameraViewModel(parentMRef);
        break;
      case ComponentModelType.RICH_TEXT:
        model = new RichTextModel(parentMRef);
        break;
      case ComponentModelType.CUSTOM_MULTI_IMAGE_PICKER:
        model = new CustomMultiImagePickerModel(parentMRef, shouldInitialize);
        break;
      case ComponentModelType.WECHAT_OFFICIAL_ACCOUNT:
        model = new WechatOfficialAccountModel(parentMRef);
        break;

      //  web components
      case ComponentModelType.WEB_PAGE:
        model = new BasicWebModel('blank-web', shouldInitialize);
        break;
      case ComponentModelType.WEB_BUTTON:
        model = new WebButtonModel(parentMRef);
        break;
      case ComponentModelType.WEB_TEXT:
        model = new WebTextModel(parentMRef);
        break;
      case ComponentModelType.WEB_CUSTOM_VIEW:
        model = new WebCustomViewModel(parentMRef);
        break;
      default:
        throw new Error(`a type cannot be built: ${type}`);
    }
    model.dataAttributes = { ...model.defaultDataAttributes(), ...model.dataAttributes };
    return model;
  }
}

export interface ModelInput {
  mRef: ShortId;
  parentMRef: NullableShortId;
  type: ComponentModelType;
  [others: string]: any;
}

export function toModel(obj: ModelInput): BaseComponentModel {
  const { parentMRef, type } = obj;
  const model = ComponentModelBuilder.buildByType(parentMRef ?? '', type, false);
  const defaultDataAttributes = model.defaultDataAttributes();
  Object.assign(model, obj);
  model.dataAttributes = {
    ...defaultDataAttributes,
    ...StoreRehydrate.rehydrateDataAttributes(model.dataAttributes),
  };
  if (!model.isContainer) return model;
  return model as BaseContainerModel;
}
