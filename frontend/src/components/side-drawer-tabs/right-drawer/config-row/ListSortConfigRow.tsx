/* eslint-disable import/no-default-export */
import { DownOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react';
import React from 'react';
import useDataModelMetadata from '../../../../hooks/useDataModelMetadata';
import useLocale from '../../../../hooks/useLocale';
import { Field } from '../../../../shared/type-definition/DataModelRegistry';
import { CascaderSelectModel } from '../../../../models/antd/CascaderSelectModel';
import { PathComponent } from '../../../../shared/type-definition/DataBinding';
import {
  fetchFieldItemType,
  GraphQLRequestBinding,
  Ordering,
} from '../../../../shared/type-definition/EventBinding';
import { NullableReactElement } from '../../../../shared/type-definition/ZTypes';
import { ZThemedColors } from '../../../../utils/ZConst';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import CustomCascaderConfigRow, { convertFieldToOption } from './CustomCascaderConfigRow';
import i18n from './ListSortConfigRow.i18n.json';
import { Dropdown, Select } from '../../../../zui';

const NONE = 'none';

interface Props {
  request: GraphQLRequestBinding;
  onRequestChange: () => void;
}

export default observer(function ListSortConfigRow(props: Props): NullableReactElement {
  const { localizedContent: content } = useLocale(i18n);
  const { request, onRequestChange } = props;
  const { dataModelRegistry } = useDataModelMetadata();

  const rootFieldType: string = fetchFieldItemType(request);
  const requestField: Field | undefined = dataModelRegistry
    .getQueries()
    .find((e: Field) => e.type === rootFieldType);

  const cascaderOptions: CascaderSelectModel[] =
    requestField?.where?.map((e) => convertFieldToOption(e, dataModelRegistry)) ?? [];

  const NONE_OPTION = {
    value: NONE,
    label: content.label.none,
    isLeaf: true,
  };

  return request.where ? (
    <div key={request.requestId} style={styles.sortContainer}>
      <ZConfigRowTitle text={content.label.sortField} />
      <CustomCascaderConfigRow
        cascaderOptions={[NONE_OPTION, ...cascaderOptions]}
        customComponent={(menu) => (
          <Dropdown overlay={menu} trigger={['click']}>
            <div style={styles.sortField}>
              <div style={styles.sortTitle}>
                {request.sortFields?.map((field) => field.name).join('/') ?? content.label.none}
              </div>
              <DownOutlined style={styles.sortIcon} />
            </div>
          </Dropdown>
        )}
        onCascaderChange={(value, selectedOptions) => {
          const sortFieldName = value.join('/');
          if (sortFieldName === NONE) {
            request.sortFields = undefined;
            request.sortType = undefined;
          } else {
            request.sortFields = selectedOptions?.map((option) => ({
              name: option.value,
              type: option.type,
            })) as PathComponent[];
            request.sortType = Ordering.ASCENDING;
          }
          onRequestChange();
        }}
      />
      {(request.sortFields?.length ?? 0) > 0 ? (
        <>
          <ZConfigRowTitle text={content.label.sortType} />
          <Select
            bordered={false}
            value={request.sortType ?? undefined}
            placeholder={content.placeholder.selectSortType}
            size="large"
            style={styles.select}
            onChange={(value) => {
              request.sortType = value;
              onRequestChange();
            }}
          >
            {Object.values(Ordering).map((type: Ordering) => (
              <Select.Option key={type} value={type}>
                {content.sort[type] ?? type}
              </Select.Option>
            ))}
          </Select>
        </>
      ) : null}
    </div>
  ) : null;
});

const styles: Record<string, React.CSSProperties> = {
  sortContainer: {
    marginBottom: '10px',
  },
  select: {
    width: '100%',
    fontSize: '10px',
    background: ZThemedColors.PRIMARY,
    textAlign: 'center',
    borderRadius: '6px',
  },
  sortField: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: '40px',
    fontSize: '10px',
    background: ZThemedColors.PRIMARY,
    borderRadius: '6px',
  },
  sortTitle: {
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
  sortIcon: {
    fontSize: '12px',
    color: '#a8a8a8',
    marginRight: '10px',
  },
};
