import { gql } from "@apollo/client";
import createApolloClient from "../data-provider/CreateApolloClient";
import { AuthProvider } from "ra-core"
import globalConfig from '../config'

export type AuthProviderConfig = {
  authorityAndPath: string, 
  ssl: boolean
}

const buildAuthProvider: (config: AuthProviderConfig) => AuthProvider = (config) => {
  const client = createApolloClient(
    `${config.ssl ? 'https' : 'http'}://${config.authorityAndPath}`, 
    `${config.ssl ? 'wss' : 'ws'}://${config.authorityAndPath}`, 
    globalConfig.registerToken,
    'anonymous'
  );
  const authProvider = {
    async login(params: {username: string, password: string} ) {
      console.log('login', params);
      const mutation = gql`mutation Login($name:String!, $password:String!) {
        loginWithPassword(name:$name, password:$password) {
          jwt {
            token
          }
        }
      }
      `;
      const variables = {
        name: params.username,
        password: params.password
      };
      const result = await client.mutate({
        mutation,
        variables
      });
      localStorage.setItem('token', result.data.loginWithPassword.jwt.token);
    },
    async logout(params: any) {
      console.log('logout', params);
      localStorage.removeItem('token');
    },
    checkAuth(params: any) {
      console.log('checkAuth', params);
      if (localStorage.getItem('token') !== null && localStorage.getItem('token') !== undefined) {
      }
      return localStorage.getItem('token')
      ? Promise.resolve()
      : Promise.reject()
    },
    async checkError(params: any) {
      console.log('checkError', params);
    },
    async getPermissions(params: any) {
      console.log('getPermissions', params);
      return [];
    },
  };
  console.log(authProvider)
  return authProvider;
}

export default buildAuthProvider;