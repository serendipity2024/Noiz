import React from 'react';
import { observer } from 'mobx-react';
import calendarIcon from '../../../../shared/assets/reusable-icons/calendar.png';
import cameraIcon from '../../../../shared/assets/reusable-icons/camera.png';
import cartIcon from '../../../../shared/assets/reusable-icons/cart.png';
import chatIcon from '../../../../shared/assets/reusable-icons/chat.png';
import desktopIcon from '../../../../shared/assets/reusable-icons/desktop.png';
import globeIcon from '../../../../shared/assets/reusable-icons/globe.png';
import homeIcon from '../../../../shared/assets/reusable-icons/home.png';
import imageIcon from '../../../../shared/assets/reusable-icons/image.png';
import locationIcon from '../../../../shared/assets/reusable-icons/location.png';
import profileIcon from '../../../../shared/assets/reusable-icons/profile.png';
import smileIcon from '../../../../shared/assets/reusable-icons/smile.png';

import ycCollectionIcon from '../../../../shared/assets/reusable-icons/yc_collection.png';
import ycCollectionSelectedIcon from '../../../../shared/assets/reusable-icons/yc_collection_selected.png';
import ycHomeIcon from '../../../../shared/assets/reusable-icons/yc_home.png';
import ycHomeSelectedIcon from '../../../../shared/assets/reusable-icons/yc_home_selected.png';
import ycProfileIcon from '../../../../shared/assets/reusable-icons/yc_profile.png';
import ycProfileSelectedIcon from '../../../../shared/assets/reusable-icons/yc_profile_selected.png';
import ycPublishIcon from '../../../../shared/assets/reusable-icons/yc_publish.png';
import ycPublishSelectedIcon from '../../../../shared/assets/reusable-icons/yc_publish_selected.png';

import qtmHomeIcon from '../../../../shared/assets/reusable-icons/qtm_home.png';
import qtmHomeSelectedIcon from '../../../../shared/assets/reusable-icons/qtm_home_selected.png';
import qtmFindIcon from '../../../../shared/assets/reusable-icons/qtm_find.png';
import qtmFindSelectedIcon from '../../../../shared/assets/reusable-icons/qtm_find_selected.png';
import qtmShopIcon from '../../../../shared/assets/reusable-icons/qtm_shop.png';
import qtmShopSelectedIcon from '../../../../shared/assets/reusable-icons/qtm_shop_selected.png';
import qtmMineIcon from '../../../../shared/assets/reusable-icons/qtm_mine.png';
import qtmMineSelectedIcon from '../../../../shared/assets/reusable-icons/qtm_mine_selected.png';

import fyHomeIcon from '../../../../shared/assets/reusable-icons/fy_home.png';
import fyHomeSelectedIcon from '../../../../shared/assets/reusable-icons/fy_home_selected.png';
import fyDealerIcon from '../../../../shared/assets/reusable-icons/fy_dealer.png';
import fyDealerSelectedIcon from '../../../../shared/assets/reusable-icons/fy_dealer_selected.png';
import fyMineIcon from '../../../../shared/assets/reusable-icons/fy_mine.png';
import fyMineSelectedIcon from '../../../../shared/assets/reusable-icons/fy_mine_selected.png';

import sodaHomeIcon from '../../../../shared/assets/reusable-icons/soda_home.png';
import sodaHomeSelectedIcon from '../../../../shared/assets/reusable-icons/soda_home_selected.png';
import sodaOrderIcon from '../../../../shared/assets/reusable-icons/soda_order.png';
import sodaOrderSelectedIcon from '../../../../shared/assets/reusable-icons/soda_order_selected.png';
import sodaMineIcon from '../../../../shared/assets/reusable-icons/soda_mine.png';
import sodaMineSelectedIcon from '../../../../shared/assets/reusable-icons/soda_mine_selected.png';

import hsNewIcon from '../../../../shared/assets/reusable-icons/hs_new.png';
import hsNewSelectedIcon from '../../../../shared/assets/reusable-icons/hs_new_selected.png';
import hsMeIcon from '../../../../shared/assets/reusable-icons/hs_me.png';
import hsMeSelectedIcon from '../../../../shared/assets/reusable-icons/hs_me_selected.png';
import hsAskIcon from '../../../../shared/assets/reusable-icons/hs_ask.png';
import hsAskSelectedIcon from '../../../../shared/assets/reusable-icons/hs_ask_selected.png';
import { useMediaUrl } from '../../../../hooks/useMediaUrl';
import { UploadType } from './UploadFile';

interface Props {
  icon: string;
}

export enum LocalIconName {
  home = 'home.png',
  calendar = 'calendar.png',
  camera = 'camera.png',
  cart = 'cart.png',
  chat = 'chat.png',
  desktop = 'desktop.png',
  globe = 'globe.png',
  image = 'image.png',
  location = 'location.png',
  profile = 'profile.png',
  smile = 'smile.png',
  ycCollection = 'yc_collection.png',
  ycCollectionSelected = 'yc_collection_selected.png',
  ycHome = 'yc_home.png',
  ycHomeSelected = 'yc_home_selected.png',
  ycProfile = 'yc_profile.png',
  ycProfileSelected = 'yc_profile_selected.png',
  ycPublish = 'yc_publish.png',
  ycPublishSelected = 'yc_publish_selected.png',
  qtmHome = 'qtm_home.png',
  qtmHomeSelected = 'qtm_home_selected.png',
  qtmFind = 'qtm_find.png',
  qtmFindSelected = 'qtm_find_selected.png',
  qtmShop = 'qtm_shop.png',
  qtmShopSelected = 'qtm_shop_selected.png',
  qtmMine = 'qtm_mine.png',
  qtmMineSelected = 'qtm_mine_selected.png',
  fyHome = 'fy_home.png',
  fyHomeSelected = 'fy_home_selected.png',
  fyDealer = 'fy_dealer.png',
  fyDealerSelected = 'fy_dealer_selected.png',
  fyMine = 'fy_mine.png',
  fyMineSelected = 'fy_mine_selected.png',
  sodaHome = 'soda_home.png',
  sodaHomeSelected = 'soda_home_selected.png',
  sodaOrder = 'soda_order.png',
  sodaOrderSelected = 'soda_order_selected.png',
  sodaMine = 'soda_mine.png',
  sodaMineSelected = 'soda_mine_selected.png',
  hsNew = 'hs_new.png',
  hsNewSelected = 'hs_new_selected.png',
  hsMe = 'hs_me.png',
  hsMeSelected = 'hs_me_selected.png',
  hsAsk = 'hs_ask.png',
  hsAskSelected = 'hs_ask_selected.png',
}

export const ConfigIcon = observer((props: Props): React.ReactElement => {
  const umu = useMediaUrl();
  const mapSource = (icon: string) => {
    switch (icon) {
      case LocalIconName.home: {
        return homeIcon;
      }
      case LocalIconName.calendar: {
        return calendarIcon;
      }
      case LocalIconName.camera: {
        return cameraIcon;
      }
      case LocalIconName.cart: {
        return cartIcon;
      }
      case LocalIconName.chat: {
        return chatIcon;
      }
      case LocalIconName.desktop: {
        return desktopIcon;
      }
      case LocalIconName.globe: {
        return globeIcon;
      }
      case LocalIconName.image: {
        return imageIcon;
      }
      case LocalIconName.location: {
        return locationIcon;
      }
      case LocalIconName.profile: {
        return profileIcon;
      }
      case LocalIconName.smile: {
        return smileIcon;
      }
      case LocalIconName.ycCollection: {
        return ycCollectionIcon;
      }
      case LocalIconName.ycCollectionSelected: {
        return ycCollectionSelectedIcon;
      }
      case LocalIconName.ycHome: {
        return ycHomeIcon;
      }
      case LocalIconName.ycHomeSelected: {
        return ycHomeSelectedIcon;
      }
      case LocalIconName.ycProfile: {
        return ycProfileIcon;
      }
      case LocalIconName.ycProfileSelected: {
        return ycProfileSelectedIcon;
      }
      case LocalIconName.ycPublish: {
        return ycPublishIcon;
      }
      case LocalIconName.ycPublishSelected: {
        return ycPublishSelectedIcon;
      }
      case LocalIconName.qtmHome: {
        return qtmHomeIcon;
      }
      case LocalIconName.qtmHomeSelected: {
        return qtmHomeSelectedIcon;
      }
      case LocalIconName.qtmFind: {
        return qtmFindIcon;
      }
      case LocalIconName.qtmFindSelected: {
        return qtmFindSelectedIcon;
      }
      case LocalIconName.qtmShop: {
        return qtmShopIcon;
      }
      case LocalIconName.qtmShopSelected: {
        return qtmShopSelectedIcon;
      }
      case LocalIconName.qtmMine: {
        return qtmMineIcon;
      }
      case LocalIconName.qtmMineSelected: {
        return qtmMineSelectedIcon;
      }
      case LocalIconName.fyHome: {
        return fyHomeIcon;
      }
      case LocalIconName.fyHomeSelected: {
        return fyHomeSelectedIcon;
      }
      case LocalIconName.fyDealer: {
        return fyDealerIcon;
      }
      case LocalIconName.fyDealerSelected: {
        return fyDealerSelectedIcon;
      }
      case LocalIconName.fyMine: {
        return fyMineIcon;
      }
      case LocalIconName.fyMineSelected: {
        return fyMineSelectedIcon;
      }
      case LocalIconName.sodaHome: {
        return sodaHomeIcon;
      }
      case LocalIconName.sodaHomeSelected: {
        return sodaHomeSelectedIcon;
      }
      case LocalIconName.sodaOrder: {
        return sodaOrderIcon;
      }
      case LocalIconName.sodaOrderSelected: {
        return sodaOrderSelectedIcon;
      }
      case LocalIconName.sodaMine: {
        return sodaMineIcon;
      }
      case LocalIconName.sodaMineSelected: {
        return sodaMineSelectedIcon;
      }
      case LocalIconName.hsNew: {
        return hsNewIcon;
      }
      case LocalIconName.hsNewSelected: {
        return hsNewSelectedIcon;
      }
      case LocalIconName.hsMe: {
        return hsMeIcon;
      }
      case LocalIconName.hsMeSelected: {
        return hsMeSelectedIcon;
      }
      case LocalIconName.hsAsk: {
        return hsAskIcon;
      }
      case LocalIconName.hsAskSelected: {
        return hsAskSelectedIcon;
      }
      default:
        return homeIcon;
    }
  };

  let source: string | undefined;
  if (Object.values(LocalIconName).find((value) => value === props.icon) !== undefined) {
    source = mapSource(props.icon);
  } else {
    const url = umu(props.icon, UploadType.IMAGE);
    source = url;
  }

  return <img src={source} alt="" style={{ width: '25px', height: '25px' }} />;
});
