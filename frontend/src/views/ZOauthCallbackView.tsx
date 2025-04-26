import { useApolloClient } from '@apollo/client';
import React, { ReactElement, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import GQL_FETCH_CURRENT_USER_INFO from '../graphQL/fetchCurrentUserInfo';
import useNotificationDisplay from '../hooks/useNotificationDisplay';
import useStores from '../hooks/useStores';
import User from '../mobx/data-model/user';
import ZLoadingView from './ZLoadingView';

export function ZOauthCallbackView(): ReactElement {
  const query = new URLSearchParams(useLocation().search);
  const history = useHistory();
  const client = useApolloClient();
  const displayNotification = useNotificationDisplay();
  const { authStore } = useStores();

  useEffect(() => {
    const token = query.get('token');
    const handleFailure = () =>
      displayNotification('FETCH_USER_INFO_FAILURE', () =>
        displayNotification('REDIRECT_TO_LOGIN', () => history.push('/'))
      );

    client
      .query({
        query: GQL_FETCH_CURRENT_USER_INFO,
        context: { headers: { Authorization: `Bearer ${token}` } },
      })
      .then((rsp: any) => {
        const userData = rsp?.data?.user;
        if (!userData) {
          handleFailure();
          return;
        }
        // Before switching account authorization, clear the information first
        if (authStore.userToken && authStore.userToken !== token) {
          authStore.logout();
        }
        userData.username = userData.displayName;
        const user = User.buildFromUserData(userData);
        user.token = token ?? undefined;
        if (token && (!user.roleNames || user.roleNames.length === 0)) {
          const { roles } = JSON.parse(atob(token.split('.')[1]));
          user.roleNames = roles ?? [];
        }
        displayNotification('LOGIN_SUCCEESS', () => {
          authStore.login(user);
          const projectExId = query.get('projectExId');
          if (projectExId) {
            history.replace(`/tool/${projectExId}`);
          }
        });
      })
      .catch((e) => {
        window.console.error(e);
        handleFailure();
      });
  }, [client, history, query, displayNotification, authStore]);

  return <ZLoadingView />;
}
