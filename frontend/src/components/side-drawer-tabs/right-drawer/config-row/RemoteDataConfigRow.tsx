import { DeleteFilled, PlusOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react';
import React, { ReactElement, useState } from 'react';
import uniqid from 'uniqid';
import _ from 'lodash';
import { DataModelRegistry, Field } from '../../../../shared/type-definition/DataModelRegistry';
import BaseContainerModel from '../../../../models/base/BaseContainerModel';
import { USER_ROLE } from '../../../../shared/type-definition/DataModel';
import {
  EventType,
  fetchFieldItemType,
  GraphQLRequestBinding,
} from '../../../../shared/type-definition/EventBinding';
import DataBindingHelper from '../../../../utils/DataBindingHelper';
import StringUtils from '../../../../utils/StringUtils';
import GraphQLRequestConfigRow from './GraphQLRequestConfigRow';
import SharedStyles from './SharedStyles';
import i18n from './DataConfigRow.i18n.json';
import useLocale from '../../../../hooks/useLocale';
import { ZColors, ZThemedColors } from '../../../../utils/ZConst';
import {
  Button,
  Checkbox,
  Collapse,
  Input,
  InputNumber,
  message,
  Row,
  Select,
} from '../../../../zui';

interface Props {
  data: BaseContainerModel;
  dataModelRegistry: DataModelRegistry;
  saveRemoteData: (list: GraphQLRequestBinding[]) => void;
}

export const RemoteDataConfigRow = observer((props: Props): ReactElement => {
  const { localizedContent: content } = useLocale(i18n);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const remoteList: GraphQLRequestBinding[] = _.cloneDeep(props.data.queries ?? []);

  const removeRemoteData = (name: string): void => {
    const list: GraphQLRequestBinding[] = remoteList.filter(
      (request: GraphQLRequestBinding) => request.value !== name
    );
    props.saveRemoteData(list);
  };

  const updateRemoteDataName = (name: string, updateIndex: number): void => {
    if (!StringUtils.isValid(name)) {
      message.error(`invalid remote data name, ${name}`);
      return;
    }
    if (
      props.data.queries.find((query) => query.requestId === name) ||
      props.data.thirdPartyQueries.find((query) => query.requestId === name)
    ) {
      message.error(`request name already exists`);
      return;
    }
    props.saveRemoteData(
      remoteList.map((request: GraphQLRequestBinding, index: number) => {
        if (index === updateIndex) {
          return { ...request, value: name, requestId: name };
        }
        return request;
      })
    );
  };

  const updateRemoteDataType = (updateName: string, data: GraphQLRequestBinding): void => {
    props.saveRemoteData(
      remoteList.map((request: GraphQLRequestBinding) => {
        if (request.value === updateName) {
          return data;
        }
        return request;
      })
    );
  };

  const updateRemoteData = (updateIndex: number, data: GraphQLRequestBinding): void => {
    props.saveRemoteData(
      remoteList.map((request: GraphQLRequestBinding, index: number) => {
        if (index === updateIndex) {
          return data;
        }
        return request;
      })
    );
  };

  const updateRemoteDataLimit = (updateIndex: number, limit: number | undefined): void => {
    props.saveRemoteData(
      remoteList.map((request: GraphQLRequestBinding, index: number) => {
        if (index === updateIndex) {
          request.limit = limit;
          const nowLimit: number = limit ?? -1;
          const rootFieldType: string = fetchFieldItemType(request);
          return {
            ...request,
            limit,
            rootFieldType: nowLimit !== 1 ? `${rootFieldType}[]` : rootFieldType,
          };
        }
        return request;
      })
    );
  };

  const addRemoteData = (): void => {
    const options: Field[] = DataBindingHelper.fetchReferenceFields(props.dataModelRegistry);
    if (options.length <= 0) {
      throw new Error('remote data length error');
    }
    const option = options[0];
    const name = `name_${uniqid.process()}`;
    const data: GraphQLRequestBinding = {
      type: EventType.QUERY,
      listMutation: false,
      value: name,
      requestId: name,
      rootFieldType: option.type,
      role: USER_ROLE,
      limit: 1,
      where: { _and: [] },
      isWhereError: true,
    };
    props.saveRemoteData([...remoteList, data]);
  };

  const renderRemoteDataItemComponent = (remoteData: GraphQLRequestBinding, index: number) => {
    const options: Field[] = DataBindingHelper.fetchReferenceFields(props.dataModelRegistry);
    const rootFieldType: string = fetchFieldItemType(remoteData);
    return (
      <div>
        <Row justify="space-between" align="middle" style={styles.linkedDataContainer}>
          <div>{content.data.name}</div>
          <Input
            key={uniqid.process()}
            defaultValue={remoteData.value}
            style={styles.linkedDataInput}
            onBlur={(e) => {
              updateRemoteDataName(e.target.value, index);
            }}
          />
        </Row>
        <Row justify="space-between" align="middle" style={styles.linkedDataContainer}>
          <div>{content.data.type}</div>
          <Select
            value={rootFieldType.length > 0 ? rootFieldType : undefined}
            placeholder={content.data.placeholder}
            style={styles.linkedDataCascader}
            dropdownMatchSelectWidth={false}
            onChange={(value, option: any) => {
              updateRemoteDataType(remoteData.value, {
                type: EventType.QUERY,
                listMutation: false,
                value: remoteData.value,
                requestId: remoteData.value,
                rootFieldType: option.value,
                role: USER_ROLE,
                limit: 1,
                where: { _and: [] },
                isWhereError: true,
              });
            }}
          >
            {options.map((element: Field) => {
              const value = element.itemType ?? element.type;
              return (
                <Select.Option key={value} value={value} style={styles.option}>
                  {element.name}
                </Select.Option>
              );
            })}
          </Select>
        </Row>

        <Row justify="space-between" align="middle" style={styles.linkedDataContainer}>
          <Checkbox
            key={remoteData.limit}
            checked={remoteData.limit !== undefined}
            onChange={(e) => updateRemoteDataLimit(index, e.target.checked ? 10 : undefined)}
          >
            {content.data.limit}
          </Checkbox>
          {remoteData.limit ? (
            <InputNumber
              style={styles.limitInput}
              size="small"
              min={1}
              value={remoteData.limit}
              onChange={(value) => {
                // value default is 1
                let limit = typeof value === 'string' ? parseInt(value, 10) : value;
                if (!limit) {
                  limit = 1;
                }
                updateRemoteDataLimit(index, limit);
              }}
            />
          ) : null}
        </Row>
        <div style={styles.limitLine} />
        {rootFieldType.length > 0 && (
          <GraphQLRequestConfigRow
            filterRemoteId={remoteData.value}
            request={remoteData}
            componentModel={props.data}
            subscriptionEnabled
            onRequestChange={() => {
              updateRemoteData(index, remoteData);
            }}
          />
        )}
      </div>
    );
  };

  return (
    <div>
      {remoteList.length > 0 ? (
        <Collapse
          hasUnstableId
          activeIndex={activeIndex}
          onActiveIndexChange={(index: number) => setActiveIndex(index)}
          items={remoteList.map((request: GraphQLRequestBinding, index) => ({
            title: request.value,
            icon: (
              <DeleteFilled
                onClick={(e): void => {
                  e.stopPropagation();
                  removeRemoteData(request.value);
                }}
              />
            ),
            content: renderRemoteDataItemComponent(request, index),
          }))}
          bordered
          setContentFontColorToOrangeBecauseHistoryIsCruel
        />
      ) : (
        <div style={styles.emptyContent}>{content.label.noRemoteData}</div>
      )}
      <div style={styles.buttonContainer}>
        <Button
          icon={<PlusOutlined />}
          type="link"
          style={styles.addButton}
          onClick={addRemoteData}
        >
          {content.label.addRemoteData}
        </Button>
      </div>
    </div>
  );
});

const styles: Record<string, React.CSSProperties> = {
  emptyContent: {
    borderWidth: '1px',
    borderColor: '#ccc',
    borderRadius: '5px',
    borderStyle: 'dashed',
    width: '100%',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: ZColors.WHITE,
    opacity: '0.5',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  addButton: {
    borderWidth: 0,
    width: '100%',
    height: '45px',
    textAlign: 'center',
    boxShadow: '0 0 0 0',
    WebkitBoxShadow: '0 0 0 0',
    color: ZThemedColors.ACCENT,
  },
  saveButton: {
    ...SharedStyles.configRowButton,
  },
  linkedDataContainer: {
    marginBottom: '10px',
  },
  linkedDataInput: {
    background: '#eee',
    height: '32px',
    width: '70%',
  },
  linkedDataCascader: {
    width: '70%',
    fontSize: '12px',
  },
  limitInput: {
    width: '40%',
  },
  limitLine: {
    width: '100%',
    height: '1px',
    backgroundColor: '#bbb',
    marginTop: '10px',
    marginBottom: '15px',
  },
  option: {
    fontSize: '12px',
  },
  select: {
    width: '100%',
    fontSize: '10px',
    background: '#eee',
    textAlign: 'center',
  },
};
