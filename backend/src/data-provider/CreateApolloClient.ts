import { ApolloClient, InMemoryCache, HttpLink, split } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';

export default function createApolloClient(httpUrl: string, subscriptionUrl: string, token?: string, role?: string): any {
  let authHeader: Record<string, any> = token ? { Authorization: `Bearer ${token}` } : {};
  if (role) {
    authHeader['x-hasura-role'] = role;
  }
  const httpLink = new HttpLink({
    uri: httpUrl,
    headers: { ...authHeader},
  });

  const wsAuthParams = token ? { authToken: token } : {};
  const wsLink = new WebSocketLink({
    uri: subscriptionUrl,
    options: {
      lazy: true,
      reconnect: !!token,
      connectionParams: { ...wsAuthParams },
    },
  });
  const link = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
    },
    wsLink,
    httpLink
  );

  return new ApolloClient({
    link,
    cache: new InMemoryCache(),
    defaultOptions: {
      query: { fetchPolicy: 'no-cache' },
      watchQuery: { fetchPolicy: 'no-cache' },
    },
  });
}
