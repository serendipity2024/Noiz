/* eslint-disable import/no-default-export */
import { EventBinding, EventType } from '../shared/type-definition/EventBinding';
import useLocale from './useLocale';
import i18n from './useLocalizeEventBindingTitle.i18n.json';
import useStores from './useStores';
import useScreenModels from './useScreenModels';
import { ShortId } from '../shared/type-definition/ZTypes';
import BaseContainerModel from '../models/base/BaseContainerModel';

const useLocalizeEventBindingTitle: () => (eventBinding: EventBinding) => string = () => {
  const { localizedContent: content } = useLocale(i18n);
  const { coreStore } = useStores();
  const screenComponents = useScreenModels();
  const screenMRefMap = new Map<ShortId, BaseContainerModel>();
  screenComponents.forEach((model): void => {
    screenMRefMap.set(model.mRef, model);
  });
  return (eventBinding: EventBinding) => {
    const { type } = eventBinding;
    let headerTitle = '';
    switch (eventBinding.type) {
      case EventType.MUTATION:
      case EventType.THIRD_PARTY_API:
      case EventType.FUNCTOR_API: {
        headerTitle = `${content.action[type]} → ${eventBinding.value}`;
        break;
      }
      case EventType.USER_LOGIN: {
        headerTitle = `${content.action[type]} → ${
          content.userLogin[eventBinding.value] ?? eventBinding.value
        }`;
        break;
      }
      case EventType.FUNCTOR: {
        headerTitle = `${content.action[type]} → ${eventBinding.name}`;
        break;
      }
      case EventType.VIDEO:
      case EventType.AUDIO: {
        headerTitle = `${content.action[type]} → ${content.media[eventBinding.action]}`;
        break;
      }
      case EventType.SWITCH_VIEW_CASE: {
        headerTitle = `${content.action[type]} → ${eventBinding.value}`;
        break;
      }
      case EventType.SHOW_MODAL: {
        headerTitle = content.action[type];
        break;
      }
      case EventType.HIDE_MODAL: {
        const hideModalAction = eventBinding;
        const component = coreStore.getModel(hideModalAction.modalViewMRef);
        const componentName = component?.componentName ?? hideModalAction.modalViewMRef;
        headerTitle = `${content.action[type]} → ${componentName}`;
        break;
      }
      case EventType.NAVIGATION: {
        const navigationAction = eventBinding;
        const label = screenMRefMap.get(navigationAction.value || '')?.componentName;
        headerTitle = `${content.action[type]} → ${
          label ??
          (content.navigation as Record<string, string>)[navigationAction.value] ??
          navigationAction.value
        }`;
        break;
      }
      case EventType.COUNTDOWN: {
        const countdownAction = eventBinding;
        headerTitle = `${content.action[type]} → ${
          content.countdown[countdownAction.action] ?? countdownAction.action
        }`;
        break;
      }
      default: {
        headerTitle = content.action[type] ?? type;
        break;
      }
    }
    return headerTitle;
  };
};

export default useLocalizeEventBindingTitle;
