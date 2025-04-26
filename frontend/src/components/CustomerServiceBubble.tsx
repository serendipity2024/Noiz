import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import useStores from '../hooks/useStores';
import { isDev } from '../Environment';
import { FeatureType } from '../graphQL/__generated__/globalTypes';
import i18n from './CustomerServiceBubble.i18n.json';
import useLocale from '../hooks/useLocale';

const getLoaderScript = (
  email: string,
  phoneNumber: string,
  username: string,
  displayName: string,
  ageRange: string,
  industry: string,
  exId: string,
  projectExId: string,
  localizedContent: {
    contact: string;
  }
) => `
 function initFreshChat() {
    window.fcWidget.init({
      token: "d1ae1fb8-a6b2-40f7-8a1c-ea8ec37133db",
      host: "https://wchat.freshchat.com",
      config: {
        content: {
          headers: {
            chat: ${JSON.stringify(localizedContent.contact)}
          }
        }
      }
    });

    window.fcWidget.setExternalId(${JSON.stringify(username)});
    window.fcWidget.user.setFirstName(${JSON.stringify(displayName)});
    window.fcWidget.user.setEmail(${JSON.stringify(email)});
    window.fcWidget.user.setPhone(${JSON.stringify(phoneNumber)});
    window.fcWidget.user.setProperties({
      phoneNumber: ${JSON.stringify(phoneNumber)},
      ageRange: ${JSON.stringify(ageRange)},
      industry: ${JSON.stringify(industry)},
      exId: ${JSON.stringify(exId)},
      projectExId: ${JSON.stringify(projectExId)}
    })
  }
  function initialize(i,t){
    var e;i.getElementById(t)?initFreshChat():((e=i.createElement("script")).id=t,e.async=!0,e.src="https://wchat.freshchat.com/js/widget.js",e.onload=initFreshChat,i.head.appendChild(e))
  }
  function initiateCall(){
    initialize(document,"Freshdesk Messaging-js-sdk")
  }
  if (document.readyState == 'complete') {
    initiateCall()
  }else {
    window.addEventListener?window.addEventListener("load",initiateCall,!1):window.attachEvent("load",initiateCall,!1);
  }
`;

export const CustomerServiceBubbleLoader = observer((): null => {
  const { localizedContent: content } = useLocale(i18n);
  const {
    accountStore: {
      account: { exId, email, phoneNumber, username, displayName, userProfile },
    },
    projectStore: { projectDetails },
    featureStore,
  } = useStores();

  const { ageRange, industry } = userProfile || { ageRange: '', industry: '' };
  const { projectExId } = projectDetails || { projectExId: '' };

  const [initialized, setInitialized] = useState(false);

  const featureEnabled = featureStore.isFeatureAccessible(FeatureType.CUSTOMER_SERVICE_BUBBLE);

  useEffect(() => {
    if (!initialized && featureEnabled && !isDev() && username) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.text = getLoaderScript(
        email || '',
        phoneNumber || '',
        username,
        displayName || '',
        ageRange || '',
        industry || '',
        exId || '',
        projectExId,
        content
      );
      document.body.appendChild(script);
      setInitialized(true);
    }
  }, [initialized, featureEnabled, email, phoneNumber, username, displayName, ageRange, industry]);

  return null;
});
