/* eslint-disable no-param-reassign */
import { DeleteFilled, PlusOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react';
import React, { useState } from 'react';
import uniqid from 'uniqid';
import _, { cloneDeep } from 'lodash';
import BaseContainerModel from '../../../../models/base/BaseContainerModel';
import { CustomRequestBinding } from '../../../../shared/type-definition/EventBinding';
import StringUtils from '../../../../utils/StringUtils';
import SharedStyles from './SharedStyles';
import CustomMutationActionRow from '../action-row/CustomMutationActionRow';
import i18n from './DataConfigRow.i18n.json';
import useLocale from '../../../../hooks/useLocale';
import { Button, Collapse, Input, message, Row, Select } from '../../../../zui';

interface Props {
  containerModel: BaseContainerModel;
  queryList: CustomRequestBinding[];
  saveCustomRequestData: (list: CustomRequestBinding[]) => void;
}

export const CustomRequestDataConfigRow = observer((props: Props): React.ReactElement => {
  const { localizedContent: content } = useLocale(i18n);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const { containerModel, queryList } = props;

  const thirdPartyQueries: CustomRequestBinding[] = _.cloneDeep(
    containerModel.thirdPartyQueries ?? []
  );

  const removeCustomRequestData = (requestId: string): void => {
    const list: CustomRequestBinding[] = thirdPartyQueries.filter(
      (element: CustomRequestBinding) => element.requestId !== requestId
    );
    props.saveCustomRequestData(list);
  };

  const updateCustomRequestDataName = (requestId: string, updateIndex: number): void => {
    if (!StringUtils.isValid(requestId)) {
      message.error(`invalid custom request name, ${requestId}`);
      return;
    }
    if (
      containerModel.queries.find((query) => query.requestId === requestId) ||
      containerModel.thirdPartyQueries.find((query) => query.requestId === requestId)
    ) {
      message.error(`request name already exists`);
      return;
    }
    const list = thirdPartyQueries.map((customRequest: CustomRequestBinding, index: number) => {
      if (index === updateIndex) {
        customRequest.requestId = requestId;
      }
      return customRequest;
    });
    props.saveCustomRequestData(list);
  };

  const updateCustomRequestDataType = (requestId: string, data: CustomRequestBinding): void => {
    const list = thirdPartyQueries.map((customRequest: CustomRequestBinding) => {
      if (customRequest.requestId === requestId) {
        customRequest = data;
      }
      return customRequest;
    });
    props.saveCustomRequestData(list);
  };

  const updateCustomRequestData = (requestIndex: number, data: CustomRequestBinding): void => {
    const list = thirdPartyQueries.map((customRequest: CustomRequestBinding, index) => {
      if (index === requestIndex) {
        customRequest = data;
      }
      return customRequest;
    });
    props.saveCustomRequestData(list);
  };

  const addCustomData = (): void => {
    if (queryList.length <= 0) {
      throw new Error('customQueries length error');
    }
    const query = queryList[0];
    const data: CustomRequestBinding = {
      type: query.type,
      value: query.value,
      requestId: `name_${uniqid.process()}`,
      operation: 'query',
      input: query.input,
      output: query.output,
      functorId: query.functorId,
      invokeApiName: query.invokeApiName,
    };
    props.saveCustomRequestData([...thirdPartyQueries, data]);
  };

  const getCustomRequestValue = (customRequestBinding: CustomRequestBinding): string => {
    return customRequestBinding.functorId
      ? `${customRequestBinding.value}_${customRequestBinding.functorId}`
      : customRequestBinding.value;
  };

  const renderCustomRequestDataItemComponent = (
    customRequestBinding: CustomRequestBinding,
    index: number
  ) => {
    return (
      <div>
        <Row justify="space-between" align="middle" style={styles.row}>
          <div>{content.data.name}</div>
          <Input
            key={uniqid.process()}
            defaultValue={customRequestBinding.requestId}
            style={styles.dataInput}
            onBlur={(e) => {
              updateCustomRequestDataName(e.target.value, index);
            }}
          />
        </Row>
        <Row justify="space-between" align="middle" style={styles.row}>
          <div>{content.data.type}</div>
          <Select
            value={getCustomRequestValue(customRequestBinding)}
            placeholder={content.data.placeholder}
            dropdownMatchSelectWidth={false}
            style={styles.dataCascader}
            onChange={(value, option: any) => {
              const optionValue: string = option.value as string;
              const api: CustomRequestBinding | undefined = queryList.find(
                (e) => getCustomRequestValue(e) === optionValue
              );
              if (api) {
                updateCustomRequestDataType(customRequestBinding.requestId, {
                  type: api.type,
                  value: api.value,
                  requestId: customRequestBinding.requestId,
                  operation: 'query',
                  input: api.input,
                  output: api.output,
                  functorId: api.functorId,
                  invokeApiName: api.invokeApiName,
                });
              }
            }}
          >
            {queryList.map((element: CustomRequestBinding) => {
              const value = getCustomRequestValue(element);
              return (
                <Select.Option key={value} value={value} style={styles.option}>
                  {element.value}
                </Select.Option>
              );
            })}
          </Select>
        </Row>
        <CustomMutationActionRow
          componentModel={containerModel}
          event={customRequestBinding}
          onEventChange={() => {
            updateCustomRequestData(index, customRequestBinding);
          }}
        />
      </div>
    );
  };

  return (
    <div>
      {thirdPartyQueries.length > 0 ? (
        <Collapse
          hasUnstableId
          activeIndex={activeIndex}
          onActiveIndexChange={(index: number) => setActiveIndex(index)}
          bordered
          setContentFontColorToOrangeBecauseHistoryIsCruel
          items={thirdPartyQueries.map((customRequest: CustomRequestBinding, index) => {
            return {
              title: customRequest.requestId,
              icon: (
                <DeleteFilled
                  onClick={(e): void => {
                    e.stopPropagation();
                    removeCustomRequestData(customRequest.requestId);
                  }}
                />
              ),
              content: renderCustomRequestDataItemComponent(cloneDeep(customRequest), index),
            };
          })}
        />
      ) : (
        <div style={styles.emptyContent}>{content.label.noCustomData}</div>
      )}
      <div style={styles.buttonContainer}>
        <Button
          icon={<PlusOutlined />}
          type="link"
          style={styles.addButton}
          onClick={addCustomData}
        >
          {content.label.addCustomData}
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
  },
  saveButton: {
    ...SharedStyles.configRowButton,
  },
  row: {
    marginBottom: '10px',
  },
  dataInput: {
    background: '#eee',
    height: '32px',
    width: '70%',
  },
  dataCascader: {
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
};
