/* eslint-disable import/no-default-export */
/* eslint-disable no-shadow */
import { useObserver } from 'mobx-react';
import React from 'react';
import ComponentDiff from '../../../../diffs/ComponentDiff';
import useModel from '../../../../hooks/useModel';
import useStores from '../../../../hooks/useStores';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import BaseContainerModel from '../../../../models/base/BaseContainerModel';
import { NullableReactElement } from '../../../../shared/type-definition/ZTypes';
import { MRefProp } from '../../../mobile-components/PropTypes';
import { ComponentsDragDropConfigRow } from './ComponentsDragDropConfigRow';

interface Props extends MRefProp {
  reverse?: boolean;
}

export default function ChildComponentsConfigRow(props: Props): NullableReactElement {
  const { diffStore } = useStores();
  const model = useModel<BaseContainerModel>(props.mRef);
  const components = useObserver(() => model?.children());
  if (!components || !model) return null;

  return (
    <ComponentsDragDropConfigRow
      components={props.reverse ? Object.values(components).reverse() : components}
      onChange={(components: BaseComponentModel[]) => {
        const childMRefs = (props.reverse ? Object.values(components).reverse() : components).map(
          (e) => e.mRef
        );
        diffStore.applyDiff([ComponentDiff.buildUpdateChildMRefsDiff(model.mRef, childMRefs)]);
      }}
    />
  );
}
