import React, { ReactElement } from 'react';
import useLocale from '../../../hooks/useLocale';
import useLocalizedComponentModelType from '../../../hooks/useLocalizedComponentModelType';
import useStores from '../../../hooks/useStores';
import ImgButton from '../../../shared/assets/editor/drawer-options/button.svg';
import ImgConditionalContainer from '../../../shared/assets/editor/drawer-options/conditional-container.svg';
import ImgCustomList from '../../../shared/assets/editor/drawer-options/custom-list.svg';
import ImgCustomView from '../../../shared/assets/editor/drawer-options/custom-view.svg';
import ImgDataPicker from '../../../shared/assets/editor/drawer-options/data-picker.svg';
import ImgImagePicker from '../../../shared/assets/editor/drawer-options/image-picker.svg';
import ImgVideoPicker from '../../../shared/assets/editor/drawer-options/video-picker.svg';
import ImgImage from '../../../shared/assets/editor/drawer-options/image.svg';
import ImgVideo from '../../../shared/assets/editor/drawer-options/video.svg';
import ImgLottie from '../../../shared/assets/editor/drawer-options/component-Lottie.svg';
import ImgInput from '../../../shared/assets/editor/drawer-options/input.svg';
import ImgNumberInput from '../../../shared/assets/editor/drawer-options/number-input.svg';
import ImgSelectView from '../../../shared/assets/editor/drawer-options/select-view.svg';
import ImgSwitch from '../../../shared/assets/editor/drawer-options/switch.svg';
import ImgTabView from '../../../shared/assets/editor/drawer-options/tab-view.svg';
import ImgText from '../../../shared/assets/editor/drawer-options/text.svg';
import HCustomList from '../../../shared/assets/editor/drawer-options/h-custom-list.svg';
import ImgMapView from '../../../shared/assets/editor/drawer-options/map-view.svg';
import ImgMultiImagePicker from '../../../shared/assets/editor/drawer-options/multi-image-uploader.svg';
import ImgMultiImage from '../../../shared/assets/editor/drawer-options/multi-image.svg';
import ImgAdBanner from '../../../shared/assets/editor/drawer-options/ad-banner.svg';
import ImgCountDown from '../../../shared/assets/editor/drawer-options/count-down.svg';
import ImgProgressBar from '../../../shared/assets/editor/drawer-options/progress-bar.svg';
import ImgRichText from '../../../shared/assets/editor/drawer-options/rich-text.svg';
import ImgCustomMultiImagePicker from '../../../shared/assets/editor/drawer-options/custom-multi-image-picker.svg';
import WechatOfficialAccount from '../../../shared/assets/editor/drawer-options/component-official-account.svg';

import { ComponentModelType } from '../../../shared/type-definition/ComponentModelType';
import ZCategorizedMenu, { MenuCategory } from '../base/ZCategorizedMenu';
import i18n from './AddComponentTab.i18n.json';
import { ZedSupportedPlatform } from '../../../models/interfaces/ComponentModel';
import { FeatureType } from '../../../graphQL/__generated__/globalTypes';

export const AddComponentTab = (): ReactElement => {
  const { localizedContent } = useLocale(i18n);
  const { editorStore, featureStore } = useStores();
  const localizeModelType = useLocalizedComponentModelType();

  const prepareItem = (type: ComponentModelType, image: string | null, draggable = true): any => ({
    ...{ type, image, draggable },
    name: localizeModelType(type),
  });

  const mediaItem = [
    prepareItem(ComponentModelType.IMAGE, ImgImage),
    prepareItem(ComponentModelType.MULTI_IMAGE, ImgMultiImage),
    prepareItem(ComponentModelType.MAP_VIEW, ImgMapView),
    prepareItem(ComponentModelType.ADVERT_BANNER, ImgAdBanner),
    prepareItem(ComponentModelType.PROGRESS_BAR, ImgProgressBar),
    prepareItem(ComponentModelType.CAMERA_VIEW, ImgImage),
  ];

  const mobileData = [
    {
      categoryName: localizedContent.menuCategories.popular,
      options: [
        prepareItem(ComponentModelType.TEXT, ImgText),
        prepareItem(ComponentModelType.RICH_TEXT, ImgRichText),
        prepareItem(ComponentModelType.BUTTON, ImgButton),
        prepareItem(ComponentModelType.INPUT, ImgInput),
        prepareItem(ComponentModelType.IMAGE, ImgImage),
        prepareItem(ComponentModelType.CUSTOM_VIEW, ImgCustomView),
        prepareItem(ComponentModelType.CUSTOM_LIST, ImgCustomList),
        prepareItem(ComponentModelType.SELECT_VIEW, ImgSelectView),
        prepareItem(ComponentModelType.TAB_VIEW, ImgTabView),
        prepareItem(ComponentModelType.CONDITIONAL_CONTAINER, ImgConditionalContainer),
        prepareItem(ComponentModelType.COUNT_DOWN, ImgCountDown),
        prepareItem(ComponentModelType.PROGRESS_BAR, ImgProgressBar),
      ],
    },
    {
      categoryName: localizedContent.menuCategories.input,
      options: [
        prepareItem(ComponentModelType.INPUT, ImgInput),
        prepareItem(ComponentModelType.NUMBER_INPUT, ImgNumberInput),
        prepareItem(ComponentModelType.SWITCH, ImgSwitch),
        prepareItem(ComponentModelType.DATA_PICKER, ImgDataPicker),
        prepareItem(ComponentModelType.IMAGE_PICKER, ImgImagePicker),
        prepareItem(ComponentModelType.VIDEO_PICKER, ImgVideoPicker),
        prepareItem(ComponentModelType.MULTI_IMAGE_PICKER, ImgMultiImagePicker),
        prepareItem(ComponentModelType.COUNT_DOWN, ImgCountDown),
        prepareItem(ComponentModelType.CUSTOM_MULTI_IMAGE_PICKER, ImgCustomMultiImagePicker),
      ],
    },
    {
      categoryName: localizedContent.menuCategories.list,
      options: [
        prepareItem(ComponentModelType.CUSTOM_LIST, ImgCustomList),
        prepareItem(ComponentModelType.HORIZONTAL_LIST, HCustomList),
        prepareItem(ComponentModelType.SELECT_VIEW, ImgSelectView),
        prepareItem(ComponentModelType.DATA_PICKER, ImgDataPicker),
      ],
    },
    {
      categoryName: localizedContent.menuCategories.container,
      options: [
        prepareItem(ComponentModelType.CUSTOM_VIEW, ImgCustomView),
        prepareItem(ComponentModelType.CUSTOM_LIST, ImgCustomList),
        prepareItem(ComponentModelType.HORIZONTAL_LIST, HCustomList),
        prepareItem(ComponentModelType.TAB_VIEW, ImgTabView),
        prepareItem(ComponentModelType.SELECT_VIEW, ImgSelectView),
        prepareItem(ComponentModelType.CONDITIONAL_CONTAINER, ImgConditionalContainer),
      ],
    },
    {
      categoryName: localizedContent.menuCategories.media,
      options:
        editorStore.editorPlatform === ZedSupportedPlatform.MOBILE_WEB
          ? mediaItem
          : [
              ...mediaItem,
              prepareItem(ComponentModelType.LOTTIE, ImgLottie),
              prepareItem(ComponentModelType.VIDEO, ImgVideo),
            ],
    },
    {
      categoryName: localizedContent.menuCategories.componentTemplate,
      options: [],
    },
  ];
  if (
    editorStore.editorPlatform === ZedSupportedPlatform.WECHAT &&
    featureStore.isFeatureAccessible(FeatureType.WECHAT_OFFICIAL_ACCOUNT)
  ) {
    mobileData.push({
      categoryName: localizedContent.menuCategories.wechatDedicated,
      options: [prepareItem(ComponentModelType.WECHAT_OFFICIAL_ACCOUNT, WechatOfficialAccount)],
    });
  }

  const webData = [
    {
      categoryName: localizedContent.menuCategories.popular,
      options: [
        prepareItem(ComponentModelType.WEB_BUTTON, null),
        prepareItem(ComponentModelType.WEB_TEXT, null),
        prepareItem(ComponentModelType.WEB_CUSTOM_VIEW, null),
      ],
    },
  ];

  let data: MenuCategory[] = [];
  switch (editorStore.editorPlatform) {
    case ZedSupportedPlatform.MOBILE_WEB:
    case ZedSupportedPlatform.WECHAT: {
      data = mobileData;
      break;
    }
    case ZedSupportedPlatform.WEB: {
      data = webData;
      break;
    }
    default:
      break;
  }

  return <ZCategorizedMenu data={data} />;
};
