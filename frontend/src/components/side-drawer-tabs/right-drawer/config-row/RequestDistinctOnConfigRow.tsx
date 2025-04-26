/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React from 'react';
import useLocale from '../../../../hooks/useLocale';
import useStores from '../../../../hooks/useStores';
import {
  fetchFieldItemType,
  GraphQLRequestBinding,
} from '../../../../shared/type-definition/EventBinding';
import { NullableReactElement } from '../../../../shared/type-definition/ZTypes';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import i18n from './RequestDistinctOnConfigRow.i18n.json';
import { Select } from '../../../../zui';

interface Props {
  request: GraphQLRequestBinding;
  onRequestChange: (request: GraphQLRequestBinding) => void;
}

export default observer(function RequestDistinctOnConfigRow(props: Props): NullableReactElement {
  const { localizedContent: content } = useLocale(i18n);
  const { coreStore } = useStores();
  const { request, onRequestChange } = props;

  const table = coreStore.dataModel.tableMetadata.find(
    (tb) => tb.name === fetchFieldItemType(request)
  );
  const options = table?.columnMetadata
    .filter((metadata) => !metadata.uiHidden)
    .map((metadata) => ({
      label: metadata.name,
      value: metadata.name,
    }));

  return request.where && options ? (
    <div key={request.requestId} style={styles.distinctOnContainer}>
      <ZConfigRowTitle text={content.label.distinctOn} />
      <Select
        mode="multiple"
        placeholder={content.placeholder}
        options={options}
        value={request.distinctOnFieldNames ?? []}
        style={styles.select}
        onChange={(value) => {
          request.distinctOnFieldNames = value;
          onRequestChange(request);
        }}
      />
    </div>
  ) : null;
});

const styles: Record<string, React.CSSProperties> = {
  distinctOnContainer: {
    marginBottom: '10px',
  },
  distinctOnField: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: '40px',
    fontSize: '10px',
    background: '#eee',
  },
  distinctOnTitle: {
    textAlign: 'center',
    flex: '1',
    marginLeft: '10px',
    marginRight: '10px',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    wordBreak: 'break-all',
    WebkitLineClamp: 1,
  },
  distinctOnIcon: {
    fontSize: '12px',
    color: '#a8a8a8',
    marginRight: '10px',
  },
  select: {
    width: '100%',
  },
};
