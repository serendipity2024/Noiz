/* eslint-disable import/no-default-export */
/* eslint-disable react/no-danger */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { observer } from 'mobx-react';
import React, { useState, useEffect } from 'react';
import { useApolloClient } from '@apollo/client';
import useModel from '../../hooks/useModel';
import ZFrame from '../../models/interfaces/Frame';
import { DataBinding, DataBindingKind } from '../../shared/type-definition/DataBinding';
import { NullableReactElement } from '../../shared/type-definition/ZTypes';
import { MRefProp } from './PropTypes';
import useShowDataBinding from '../../hooks/useShowDataBinding';
import { IMAGE_PREFIX } from '../side-drawer-tabs/right-drawer/config-row/ValueBindingConfigRow';
import RichTextModel from '../../models/mobile-components/RichTextModel';
import { BaseType } from '../../shared/type-definition/DataModel';
import { GQL_GET_IMAGE_LIST_BY_EX_IDS } from '../../graphQL/getResourceMedia';
import useProjectDetails from '../../hooks/useProjectDetails';
import { isNotNull } from '../../utils/utils';
import {
  GetImageListByExIds,
  GetImageListByExIdsVariables,
} from '../../graphQL/__generated__/GetImageListByExIds';

export const ZRichTextDefaultReferenceAttributes = {
  value: DataBinding.withTextVariable([
    { kind: DataBindingKind.LITERAL, value: '<div style="color: rgb(255, 165, 34)">ZION</div>' },
  ]),
};

export const ZRichTextDefaultDataAttributes = {
  ...ZRichTextDefaultReferenceAttributes,
};

export type RichTextAttributes = typeof ZRichTextDefaultDataAttributes;

export const ZRichTextDefaultFrame: ZFrame = {
  size: { width: 120, height: 25 },
  position: { x: 0, y: 0 },
};

export default observer(function ZRichText(props: MRefProp): NullableReactElement {
  const model = useModel<RichTextModel>(props.mRef);
  const { projectExId } = useProjectDetails();
  const showDataBinding = useShowDataBinding();
  const client = useApolloClient();

  const value = showDataBinding(
    model?.dataAttributes.value ?? DataBinding.withLiteral('', BaseType.TEXT)
  );
  const [displayContent, setDisplayContent] = useState(value);

  useEffect(() => {
    const translateDisplayContent = async () => {
      let tmpDisplayContent = value;
      const imageExIds = Array.from(
        value.matchAll(new RegExp(`${IMAGE_PREFIX}([a-zA-Z0-9]{11})`, 'g'))
      ).map(([, imageId]) => imageId);
      if (imageExIds.length > 0) {
        const { data } = await client.query<GetImageListByExIds, GetImageListByExIdsVariables>({
          query: GQL_GET_IMAGE_LIST_BY_EX_IDS,
          variables: {
            projectExId,
            imageExIds,
          },
        });
        (data.getImageListByExIds ?? []).filter(isNotNull).forEach(({ url }, index) => {
          tmpDisplayContent = tmpDisplayContent.replace(`${IMAGE_PREFIX}${imageExIds[index]}`, url);
        });
      }
      setDisplayContent(tmpDisplayContent);
    };
    translateDisplayContent();
  }, [value, client, displayContent, projectExId]);

  if (!model) return null;

  return (
    <div style={{ height: '100%', width: '100%', overflow: 'hidden' }}>
      <div style={{ all: 'initial' }}>
        <div dangerouslySetInnerHTML={{ __html: displayContent }} />
      </div>
    </div>
  );
});
