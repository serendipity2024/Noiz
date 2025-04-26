import React, { ReactElement } from 'react';
import { RouteComponentProps, Redirect } from 'react-router-dom';

export const ZAuthorizationView = (
  props: RouteComponentProps<{ token: string; projectExId: string }>
): ReactElement => {
  const { token, projectExId } = props.match.params;

  if (token) {
    return (
      <Redirect
        to={{
          pathname: '/oauth',
          search: `?token=${token}&projectExId=${projectExId}`,
        }}
      />
    );
  }
  return <Redirect to="/" />;
};
