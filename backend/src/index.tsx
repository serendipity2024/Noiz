import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import config from './config';

const webPathPrefix = config.webPathPrefix;
ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Switch>
        <Route
          exact
          path={`${webPathPrefix}/token/:token`}
          render={(props: any) => {
            console.log(props.match.params.token);
            localStorage.setItem('token', props.match.params.token);
            console.log('in local storage', localStorage.getItem('token'));
            return <Redirect to={`${webPathPrefix}/authenticated`} />;
          }}
        ></Route>
        <Route path={`${webPathPrefix}/authenticated`} render={() => <App />} />
      </Switch>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
