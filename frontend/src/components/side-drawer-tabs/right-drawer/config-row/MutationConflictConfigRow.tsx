/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React from 'react';
import { head } from 'lodash';
import {
  ConflictActionType,
  GraphQLRequestBinding,
} from '../../../../shared/type-definition/EventBinding';
import { NullableReactElement } from '../../../../shared/type-definition/ZTypes';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import { MutationObjColumn } from '../../../../shared/type-definition/Mutation';
import useStores from '../../../../hooks/useStores';
import i18n from './MutationConflictConfigRow.i18n.json';
import useLocale from '../../../../hooks/useLocale';
import { ZColors, ZThemedColors } from '../../../../utils/ZConst';
import { Select } from '../../../../zui';

interface Props {
  request: GraphQLRequestBinding;
  onRequestChange: () => void;
}
const CONSTRAINT_PREFIX = 'constraint_';
const FIELD_PREFIX = 'field_';

export default observer(function MutationConflictConfigRow(props: Props): NullableReactElement {
  const { localizedContent: content } = useLocale(i18n);
  const { request, onRequestChange } = props;
  const {
    coreStore: {
      dataModel: { tableMetadata },
    },
  } = useStores();

  const uniqueFields =
    tableMetadata
      .find((data) => data.name === request.rootFieldType)
      ?.columnMetadata.filter(
        (column) => column.unique && Object.keys(request.object ?? {}).includes(column.name)
      )
      .map((column) => column.name) ?? [];
  const constraints =
    tableMetadata
      .find((data) => data.name === request.rootFieldType)
      ?.constraintMetadata.map((element) => element.name) ?? [];

  const currentValue =
    head(request.onMutationConflictAction?.columns.map((pc) => pc.pathComponents[0].name)) ??
    head(request.onMutationConflictAction?.constraints);

  return request.where ? (
    <div key={request.requestId} style={styles.sortContainer}>
      <div style={styles.title}>{content.label.conflict}</div>
      <Select
        allowClear
        bordered={false}
        value={currentValue}
        size="large"
        style={styles.select}
        onChange={(value) => {
          if (!value) {
            request.onMutationConflictAction = undefined;
          } else {
            request.onMutationConflictAction = {
              columns: value.startsWith(FIELD_PREFIX)
                ? [
                    {
                      pathComponents: [
                        {
                          name: value.substr(FIELD_PREFIX.length),
                          type: (request.object as MutationObjColumn)[
                            value.substr(FIELD_PREFIX.length)
                          ].type,
                          itemType: (request.object as MutationObjColumn)[
                            value.substr(FIELD_PREFIX.length)
                          ].itemType,
                        },
                      ],
                    },
                  ]
                : [],
              constraints: value.startsWith(CONSTRAINT_PREFIX)
                ? [value.substr(CONSTRAINT_PREFIX.length)]
                : [],
              actionType: request.onMutationConflictAction?.actionType ?? ConflictActionType.NONE,
            };
          }
          onRequestChange();
        }}
      >
        <Select.OptGroup key="field" label={content.label.field}>
          {uniqueFields.map((field) => (
            <Select.Option key={field} value={`${FIELD_PREFIX}${field}`}>
              {field}
            </Select.Option>
          ))}
        </Select.OptGroup>
        <Select.OptGroup key="constraint" label={content.label.constraint}>
          {constraints.map((constraint) => (
            <Select.Option key={constraint} value={`${CONSTRAINT_PREFIX}${constraint}`}>
              {constraint}
            </Select.Option>
          ))}
        </Select.OptGroup>
      </Select>
      {request.onMutationConflictAction && (
        <>
          <ZConfigRowTitle text={content.label.actionType} />
          <Select
            bordered={false}
            value={request.onMutationConflictAction?.actionType}
            size="large"
            style={styles.select}
            onChange={(value) => {
              if (request.onMutationConflictAction) {
                request.onMutationConflictAction.actionType = value;
                onRequestChange();
              }
            }}
          >
            {Object.values(ConflictActionType).map((element) => (
              <Select.Option key={element} value={element}>
                {content.actionType[element] ?? element}
              </Select.Option>
            ))}
          </Select>
        </>
      )}
    </div>
  ) : null;
});

const styles: Record<string, React.CSSProperties> = {
  title: {
    marginTop: '10px',
    marginBottom: '10px',
    color: ZColors.WHITE,
    opacity: '0.5',
  },
  sortContainer: {
    marginBottom: '10px',
  },
  select: {
    width: '100%',
    fontSize: '10px',
    background: ZThemedColors.PRIMARY,
    borderRadius: '6px',
    textAlign: 'center',
  },
  sortField: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: '40px',
    fontSize: '10px',
    background: '#eee',
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
  headerContainer: {
    position: 'absolute',
    background: '#fff',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  headerTitle: {
    fontSize: '15px',
    lineHeight: '15px',
    marginLeft: '5px',
  },
  headerContent: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  collapse: {
    marginTop: '10px',
  },
};
