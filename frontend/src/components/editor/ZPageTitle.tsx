/* eslint-disable import/no-default-export */
import React from 'react';
import { Helmet } from 'react-helmet';
import { NullableReactElement } from '../../shared/type-definition/ZTypes';

export default function ZPageTitle(props: { children: string }): NullableReactElement {
  if (!props.children) return null;

  return (
    <Helmet>
      <title>{`Zion | ${props.children}`}</title>
    </Helmet>
  );
}
