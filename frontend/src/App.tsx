import { ApolloProvider } from '@apollo/client';
import 'antd-mobile/dist/antd-mobile.css';
import 'antd/dist/antd.css';
import { Observer } from 'mobx-react';
import React, { ReactElement, Suspense, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import './App.css';
import LoggerContext from './context/LoggerContext';
import useLogger from './hooks/useLogger';
import useStores from './hooks/useStores';
import { AllStores } from './mobx/StoreContexts';
import StoreHelpers from './mobx/StoreHelpers';
import { ZedSupportedPlatform } from './models/interfaces/ComponentModel';
import { LoggingEvent } from './utils/logging/LogSingleLineToServer';
import { ZLogger } from './utils/logging/ZLogger';
import { URLParameter } from './utils/ZConst';
import { ZAuthorizationView } from './views/ZAuthorizationView';
import ZLandingView from './views/ZLandingView';
import ZLoadingView from './views/ZLoadingView';
import ZLoginView from './views/ZLoginView';
import { ZOauthCallbackView } from './views/ZOauthCallbackView';
import ZProjectListView from './views/ZProjectListView';
import ZRegisterView from './views/ZRegisterView';
import { ZResetPasswordView } from './views/ZResetPasswordView';
import { ZSetUsernameView } from './views/ZSetUsernameView';
import ZToolView from './views/ZToolView';
import { ZUserProfile } from './views/ZUserProfile';
import { CustomerServiceBubbleLoader } from './components/CustomerServiceBubble';

export const App = (): ReactElement => {
  const { authStore } = useStores();
  return (
    <Observer>
      {() => (
        <WrapperProvider>
          <AppBody isLoggedIn={authStore.isLoggedIn} isActive={authStore.isActive} />
        </WrapperProvider>
      )}
    </Observer>
  );
};

function AppBody(props: { isLoggedIn: boolean; isActive: boolean }) {
  const logger = useLogger();
  const { sessionStore } = useStores();

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const extraData = {
      referrer: document.referrer,
      channel: urlSearchParams.get(URLParameter.channel),
      cookie: sessionStore.cookie,
    };
    logger.info(LoggingEvent.APP_LAUNCH, extraData);
    // eslint-disable-next-line
  }, []);

  return props.isLoggedIn ? <AuthenticatedApp isActive={props.isActive} /> : <UnauthenticatedApp />;
}

function WrapperProvider(props: { children: ReactElement }) {
  const { sessionStore } = useStores();
  const apolloClient = sessionStore.clientForSession;
  return (
    <ApolloProvider client={apolloClient}>
      <LoggerContext.Provider value={new ZLogger(apolloClient)}>
        <Router>
          {props.children}
          <Route path="/token/:token/:projectExId" component={ZAuthorizationView} exact />
          <Route path="/oauth" component={ZOauthCallbackView} exact />
        </Router>
      </LoggerContext.Provider>
    </ApolloProvider>
  );
}

function UnauthenticatedApp() {
  return (
    <Switch>
      <Route path="/loading" component={ZLoadingView} exact />
      <Route path="/landing" component={ZLandingView} exact />
      <Route path="/login" component={ZLoginView} exact />
      <Route path="/resetPassword" component={ZResetPasswordView} exact />
      <Route path="/register" component={ZRegisterView} exact />
      <Route
        path="/"
        render={() => (
          <Redirect
            to={{
              pathname: '/login',
              search: window.location.search,
            }}
          />
        )}
      />
    </Switch>
  );
}

function AuthenticatedApp(props: { isActive: boolean }) {
  const activation = React.lazy(() => import('./views/ZActivationView'));
  const wechatAuth = React.lazy(() => import('./views/ZWechatAuthRedirectView'));
  const downloadSchemaJson = React.lazy(() => import('./views/DownloadSchemaJson'));

  useEffect(() => {
    AllStores.featureStore.setupFeatureDataSync();
    AllStores.accountTagStore.fetchAccountTagValues();
    AllStores.accountStore.fetchUserAccount();
  }, []);

  const inactiveUserRouter = () => (
    <Switch>
      <Route path="/loading" component={ZLoadingView} exact />
      <Route path="/activation" component={activation} />
      <Route
        path="/"
        render={() => (
          <Redirect
            to={{
              pathname: '/activation',
              search: window.location.search,
            }}
          />
        )}
      />
    </Switch>
  );
  const activeUserRouter = () => (
    <Switch>
      <Route path="/loading" component={ZLoadingView} exact />
      <Route path="/resetPassword" component={ZResetPasswordView} exact />
      <Route path="/setUsername" component={ZSetUsernameView} exact />
      <Route path="/wechat/auth-redirect/:projectExId" component={wechatAuth} />
      <Route path="/download-schema-json" component={downloadSchemaJson} exact />
      <Route path="/projects" component={ZProjectListView} exact />
      <Route exact path="/userProfile" component={ZUserProfile} />
      <Route
        path="/tool/:projectExId/:platform"
        exact
        render={(data) => {
          const { platform, projectExId } = data.match.params;
          const currentPlatform = platform as ZedSupportedPlatform;
          if (Object.values(ZedSupportedPlatform).includes(currentPlatform)) {
            StoreHelpers.resetAllData();
            AllStores.editorStore.editorPlatform = currentPlatform;
            AllStores.editorStore.targetProjectExId = projectExId;
            return <ZToolView key={AllStores.projectStore.projectDetails?.projectExId} />;
          }
          return <div />;
        }}
      />
      <Route
        path="/tool/:projectExId"
        render={(data) => (
          <Redirect to={`/tool/${data.match.params.projectExId}/${ZedSupportedPlatform.WECHAT}`} />
        )}
      />
      <Route
        path="/"
        render={() => (
          <Redirect
            to={{
              pathname: '/projects',
              search: window.location.search,
            }}
          />
        )}
      />
    </Switch>
  );

  return (
    <Suspense fallback={<ZLoadingView />}>
      <DndProvider backend={Backend}>
        {!props.isActive ? inactiveUserRouter() : activeUserRouter()}
        <CustomerServiceBubbleLoader />
      </DndProvider>
    </Suspense>
  );
}
