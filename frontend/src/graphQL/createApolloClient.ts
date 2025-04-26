import { ApolloClient, InMemoryCache, split, from, HttpLink } from '@apollo/client';
import { ErrorLink } from '@apollo/client/link/error';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { some, startsWith } from 'lodash';
import Environment, { ServerPath } from '../Environment';
import { AllStores } from '../mobx/StoreContexts';
import ZNotification from '../utils/notifications/ZNotifications';
import i18n from '../utils/notifications/ZNotifications.i18n.json';

export function createApolloClient(sessionId: string): ApolloClient<any> {
  const token = AllStores.authStore.userToken;
  const { locale } = AllStores.persistedStore;
  const notif = new ZNotification(i18n[locale]);
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
  const customFetch = (input: RequestInfo, init?: RequestInit | undefined) => {
    return fetch(input, init).then((response) => {
      if (response.headers.has('authorization')) {
        const bearer = response.headers.get('authorization') as string;
        if (
          startsWith(bearer, 'Bearer') &&
          AllStores.authStore.user?.username &&
          AllStores.authStore.user.roleNames
        )
          AllStores.authStore.loginFromData({
            username: AllStores.authStore.user.username,
            roleNames: AllStores.authStore.user.roleNames,
            token: bearer.replace('Bearer ', ''),
          });
      }
      return response;
    });
  };
  const httpLink = new HttpLink({
    uri: Environment.httpServerAddress + ServerPath.GQL_PATH,
    headers: { ...authHeader, 'X-SESSION-ID': sessionId },
    fetch: customFetch,
  });
  const errorLink = new ErrorLink(({ graphQLErrors, response }) => {
    if (some(graphQLErrors, { errorCode: 401 })) {
      if (response) response.errors = undefined;
      AllStores.authStore.logout();
      notif.send('LOGIN_EXPIRED');
    }
  });

  const wsAuthParams = token ? { authToken: token } : {};
  const wsLink = new WebSocketLink({
    uri: Environment.wsServerAddress + ServerPath.WS_PATH,
    options: {
      lazy: true,
      reconnect: !!token,
      connectionParams: { ...wsAuthParams, 'X-SESSION-ID': sessionId },
    },
  });
  const link = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
    },
    wsLink,
    from([errorLink, httpLink])
  );

  return new ApolloClient({
    link,
    cache: new InMemoryCache({ addTypename: false }),
    defaultOptions: {
      query: { fetchPolicy: 'no-cache' },
      watchQuery: { fetchPolicy: 'no-cache' },
    },
  });
}
