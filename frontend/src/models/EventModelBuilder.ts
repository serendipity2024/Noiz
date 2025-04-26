import { EventType } from '../shared/type-definition/EventBinding';
import { AudioActionModel } from './action/AudioActionModel';
import { CallPhoneActionModel } from './action/CallPhoneActionModel';
import { CheckVerificationCodeActionModel } from './action/CheckVerificationCodeActionModel';
import { ChooseLocationActionModel } from './action/ChooseLocationActionModel';
import { ConditionalActionModel } from './action/ConditionalActionModel';
import { ConfigureCameraActionModel } from './action/ConfigureCameraActionModel';
import { CountdownActionModel } from './action/CountdownActionModel';
import { EditFilterAndStickerActionModel } from './action/EditFilterAndStickerActionModel';
import { ImageFilterActionModel } from './action/ImageFilterActionModel';
import { FullscreenImageActionModel } from './action/FullscreenImageActionModel';
import { FunctorActionModel } from './action/FunctorActionModel';
import { FunctorMutationActionModel } from './action/FunctorMutationActionModel';
import { GenerateMiniProgramCodeActionModel } from './action/GenerateMiniProgramCodeActionModel';
import { GenerateQRCodeActionModel } from './action/GenerateQRCodeActionModel';
import { GetAdministrationAreaActionModel } from './action/GetAdministrationAreaActionModel';
import { GetLocationActionModel } from './action/GetLocationActionModel';
import { HideModalActionModel } from './action/HideModalActionModel';
import { ImagePickerAddImageActionModel } from './action/ImagePickerAddImageActionModel';
import { ImagePickerDeleteImageActionModel } from './action/ImagePickerDeleteImageActionModel';
import { ImagePickerReplaceImageActionModel } from './action/ImagePickerReplaceImageActionModel';
import { ListActionActionModel } from './action/ListActionActionModel';
import { LogActionModel } from './action/LogActionModel';
import { LottieActionModel } from './action/LottieActionModel';
import { MutationActionModel } from './action/MutationActionModel';
import { BatchMutationActionModel } from './action/BatchMutationActionModel';
import { NavigationActionModel } from './action/NavigationActionModel';
import { WechatNotificationActionModel } from './action/WechatNotificationActionModel';
import { NotificationAuthorizationActionModel } from './action/NotificationAuthorizationActionModel';
import { ObtainPhoneNumberActionModel } from './action/ObtainPhoneNumberActionModel';
import { OpenLocationActionModel } from './action/OpenLocationActionModel';
import { OpenRewardedVideoAdActionModel } from './action/OpenRewardedVideoAdActionModel';
import { OpenWebViewActionModel } from './action/OpenWebViewActionModel';
import { OpenWechatSettingActionModel } from './action/OpenWechatSettingActionModel';
import { PreviewDocumentActionModel } from './action/PreviewDocumentActionModel';
import { RefreshActionModel } from './action/RefreshActionModel';
import { RefreshCellActionModel } from './action/RefreshCellActionModel';
import { RefreshListActionModel } from './action/RefreshListActionModel';
import { RefreshLoginUserActionModel } from './action/RefreshLoginUserActionModel';
import { RerunConditionActionModel } from './action/RerunConditionActionModel';
import { ScanQRCodeActionModel } from './action/ScanQRCodeActionModel';
import { ScrollHorizontalListActionModel } from './action/ScrollHorizontalListActionModel';
import { ScrollPageToActionModel } from './action/ScrollPageToActionModel';
import { ScrollToActionModel } from './action/ScrollToActionModel';
import { SendVerificationCodeActionModel } from './action/SendVerificationCodeActionModel';
import { SetClipboardActionModel } from './action/SetClipboardActionModel';
import { SetComponentOutputDataActionModel } from './action/SetComponentOutputDataActionModel';
import { SetFlodModeActionModel } from './action/SetFlodModeActionModel';
import { SetGlobalDataActionModel } from './action/SetGlobalDataActionModel';
import { SetInputValueActionModel } from './action/SetInputValueActionModel';
import { SetPageDataActionModel } from './action/SetPageDataActionModel';
import { ShareActionModel } from './action/ShareActionModel';
import { ShowModalActionModel } from './action/ShowModalActionModal';
import { ShowToastActionModel } from './action/ShowToastActionModel';
import { SwitchViewCaseActionModel } from './action/SwitchViewCaseActionModel';
import { TakePhotoActionModel } from './action/TakePhotoActionModel';
import { ThirdPartyMutationActionModel } from './action/ThirdPartyMutationActionModel';
import { TransformBitmapActionModel } from './action/TransformBitmapActionModel';
import { TransformImageActionModel } from './action/TransformImageActionModel';
import { UploadFileActionModel } from './action/UploadFileActionModel';
import { UserLoginActionModel } from './action/UserLoginActionModel';
import { UserRegisterActionModel } from './action/UserRegisterActionModel';
import { VideoActionModel } from './action/VideoActionModel';
import { WechatContactActionModel } from './action/WechatContactActionModel';
import { ActionFlowActionModel } from './action/ActionFlowActionModel';
import { EventModel } from './interfaces/EventModel';
import { SmsNotificationActionModel } from './action/SmsNotificationActionModel';

export class EventModelBuilder {
  public static getByType(type: EventType): EventModel {
    switch (type) {
      case EventType.MUTATION:
        return new MutationActionModel();
      case EventType.FUNCTOR_API:
        return new FunctorMutationActionModel();
      case EventType.THIRD_PARTY_API:
        return new ThirdPartyMutationActionModel();
      case EventType.SWITCH_VIEW_CASE:
        return new SwitchViewCaseActionModel();
      case EventType.RERUN_CONDITION:
        return new RerunConditionActionModel();
      case EventType.NAVIGATION:
        return new NavigationActionModel();
      case EventType.SHOW_TOAST:
        return new ShowToastActionModel();
      case EventType.SHOW_MODAL:
        return new ShowModalActionModel();
      case EventType.HIDE_MODAL:
        return new HideModalActionModel();
      case EventType.BATCH_MUTATION:
        return new BatchMutationActionModel();
      case EventType.USER_LOGIN:
        return new UserLoginActionModel();
      case EventType.USER_REGISTER:
        return new UserRegisterActionModel();
      case EventType.REFRESH:
        return new RefreshActionModel();
      case EventType.REFRESH_LIST:
        return new RefreshListActionModel();
      case EventType.REFRESH_CELL:
        return new RefreshCellActionModel();
      case EventType.REFRESH_LOGIN_USER:
        return new RefreshLoginUserActionModel();
      case EventType.SEND_VERIFICATION_CODE:
        return new SendVerificationCodeActionModel();
      case EventType.CHECK_VERIFICATION_CODE:
        return new CheckVerificationCodeActionModel();
      case EventType.FUNCTOR:
        return new FunctorActionModel();
      case EventType.FULLSCREEN_IMAGE:
        return new FullscreenImageActionModel();
      case EventType.SET_CLIPBOARD:
        return new SetClipboardActionModel();
      case EventType.CALL_PHONE:
        return new CallPhoneActionModel();
      case EventType.WECHAT_CONTACT:
        return new WechatContactActionModel();
      case EventType.AUDIO:
        return new AudioActionModel();
      case EventType.VIDEO:
        return new VideoActionModel();
      case EventType.CONDITIONAL:
        return new ConditionalActionModel();
      case EventType.SET_PAGE_DATA:
        return new SetPageDataActionModel();
      case EventType.SET_GLOBAL_DATA:
        return new SetGlobalDataActionModel();
      case EventType.OPEN_LOCATION:
        return new OpenLocationActionModel();
      case EventType.GET_LOCATION:
        return new GetLocationActionModel();
      case EventType.CHOOSE_LOCATION:
        return new ChooseLocationActionModel();
      case EventType.LOG:
        return new LogActionModel();
      case EventType.SCROLL_TO:
        return new ScrollToActionModel();
      case EventType.UPLOAD_FILE:
        return new UploadFileActionModel();
      case EventType.SCROLL_PAGE_TO:
        return new ScrollPageToActionModel();
      case EventType.OBTAIN_PHONE_NUMBER:
        return new ObtainPhoneNumberActionModel();
      case EventType.OPEN_WEBVIEW:
        return new OpenWebViewActionModel();
      case EventType.OPEN_REWARDED_VIDEO_AD:
        return new OpenRewardedVideoAdActionModel();
      case EventType.SHARE:
        return new ShareActionModel();
      case EventType.COUNTDOWN:
        return new CountdownActionModel();
      case EventType.SET_INPUT_VALUE:
        return new SetInputValueActionModel();
      case EventType.WECHAT_NOTIFICATION:
        return new WechatNotificationActionModel();
      case EventType.SMS_NOTIFICATION:
        return new SmsNotificationActionModel();
      case EventType.NOTIFICATION_AUTHORIZATION:
        return new NotificationAuthorizationActionModel();
      case EventType.LOTTIE:
        return new LottieActionModel();
      case EventType.GENERATE_QR_CODE:
        return new GenerateQRCodeActionModel();
      case EventType.GENERATE_MINI_PROGRAM_CODE:
        return new GenerateMiniProgramCodeActionModel();
      case EventType.SCAN_QR_CODE:
        return new ScanQRCodeActionModel();
      case EventType.PREVIEW_DOCUMENT:
        return new PreviewDocumentActionModel();
      case EventType.OPEN_WECHAT_SETTING:
        return new OpenWechatSettingActionModel();
      case EventType.SCROLL_HORIZONTAL_LIST:
        return new ScrollHorizontalListActionModel();
      case EventType.CONFIGURE_CAMERA:
        return new ConfigureCameraActionModel();
      case EventType.TAKE_PHOTO:
        return new TakePhotoActionModel();
      case EventType.GET_ADMINISTRATION_AREA:
        return new GetAdministrationAreaActionModel();
      case EventType.SET_FOLD_MODE:
        return new SetFlodModeActionModel();
      case EventType.IMAGE_PICKER_ADD_IMAGE:
        return new ImagePickerAddImageActionModel();
      case EventType.IMAGE_PICKER_DELETE_IMAGE:
        return new ImagePickerDeleteImageActionModel();
      case EventType.IMAGE_PICKER_REPLACE_IMAGE:
        return new ImagePickerReplaceImageActionModel();
      case EventType.LIST_ACTION:
        return new ListActionActionModel();
      case EventType.IMAGE_FILTER:
        return new ImageFilterActionModel();
      case EventType.TRANSFORM_BITMAP_TO_IMAGE:
        return new TransformBitmapActionModel();
      case EventType.TRANSFORM_IMAGE_TO_BITMAP:
        return new TransformImageActionModel();
      case EventType.SET_COMPONENT_OUTPUT_DATA:
        return new SetComponentOutputDataActionModel();
      case EventType.EDIT_FILTER_AND_STICKER:
        return new EditFilterAndStickerActionModel();
      case EventType.ACTION_FLOW:
        return new ActionFlowActionModel();
      default:
        throw new Error(`EventType cannot be built: ${type}`);
    }
  }
}
