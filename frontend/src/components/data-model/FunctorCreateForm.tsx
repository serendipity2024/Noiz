/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React, { useState } from 'react';
import { useApolloClient } from '@apollo/client';
import { DeleteOutlined, MinusCircleOutlined } from '@ant-design/icons';
import {
  Language,
  FunctorType,
  QueryType,
  DbModificationType,
  PGType,
  DbInputInput,
  DbModificationInput,
  SqlArgInput,
  RuntimeInputInput,
  DbDataInput,
  FunctorCreationInputInput,
} from '../../graphQL/__generated__/globalTypes';
import { hackCreateFunctor } from '../../graphQL/functorApi';
import { ThirdPartySchema } from '../../shared/type-definition/ThirdPartySchema';
import useProjectDetails from '../../hooks/useProjectDetails';
import {
  Form,
  Input,
  Select,
  Modal,
  Button,
  Checkbox,
  Tabs,
  Divider,
  Row,
  ZInput,
} from '../../zui';

import { RequiredNonNullable } from '../../utils/utils';

export type DataType = { list: false; baseType: PGType } | { list: true; dataType: DataType };

export type DbData = RequiredNonNullable<DbDataInput>;

export interface SqlArg extends RequiredNonNullable<SqlArgInput> {
  dataType: DataType;
}

export interface RuntimeInput extends RequiredNonNullable<RuntimeInputInput> {
  dataType: DataType;
}

export interface DbInput extends RequiredNonNullable<DbInputInput> {
  dbData: DbData;
}

export interface DbModification extends RequiredNonNullable<DbModificationInput> {
  sqlArgs: SqlArg[];
}

export interface FunctorSchema extends FunctorCreationInputInput {
  dbInputs: DbInput[];
  dbModifications: DbModification[];
  runtimeInputs: RuntimeInput[];
  outputSchema: ThirdPartySchema;
}

interface Props {
  onFinish: () => void;
}

export default observer(function FunctorCreateForm(props: Props) {
  const { onFinish } = props;
  const { projectExId } = useProjectDetails();
  const client = useApolloClient();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const availableTypes = [
    PGType.INT8,
    PGType.FLOAT8,
    PGType.NUMERIC,
    PGType.TIME_WITH_TIMEZONE,
    PGType.TIMESTAMP_WITH_TIMEZONE,
    PGType.DATE,
    PGType.BOOL,
    PGType.VARCHAR,
    PGType.JSONB,
  ];

  const onSubmit = (data: any) => {
    const originalData = data as {
      displayName: string;
      type: FunctorType;
      language: Language;
      code: string;
      runtimeInputs: { argName: string; dataType: { pgType: PGType; isList: boolean } }[];
      dbInputs: {
        argName: string;
        dbData: {
          query: string;
          queryType: QueryType;
          queryArgs: {
            name: string;
            dataType: { pgType: PGType; isList: boolean };
          }[];
        };
      }[];
      dbModifications: {
        batch: boolean;
        sql: string;
        sqlArgs: { name: string; dataType: { pgType: PGType; isList: boolean } }[];
        type: DbModificationType;
      }[];
      outputSchema: string;
    };
    const { runtimeInputs, dbInputs, dbModifications, outputSchema } = originalData;
    const convertedRuntimeInputs = runtimeInputs.map(({ dataType, ...rest }) => ({
      ...rest,
      dataType: dataType.isList
        ? ({ list: true, dataType: { list: false, baseType: dataType.pgType } } as DataType)
        : ({ list: false, baseType: dataType.pgType } as DataType),
    }));
    const convertedDbInputs = dbInputs.map(({ dbData, ...rest }) => ({
      ...rest,
      dbData: {
        query: dbData.query,
        queryType: dbData.queryType,
        queryArgs: dbData.queryArgs.map(({ dataType, ...restArgs }) => ({
          ...restArgs,
          dataType: dataType.isList
            ? ({ list: true, dataType: { list: false, baseType: dataType.pgType } } as DataType)
            : ({ list: false, baseType: dataType.pgType } as DataType),
        })),
      },
    }));
    const convertedDbModifications = dbModifications.map(({ sqlArgs, ...rest }) => ({
      ...rest,
      sqlArgs: sqlArgs.map(({ dataType, ...restArgs }) => ({
        ...restArgs,
        dataType: dataType.isList
          ? ({ list: true, dataType: { list: false, baseType: dataType.pgType } } as DataType)
          : ({ list: false, baseType: dataType.pgType } as DataType),
      })),
    }));
    const processedData: FunctorSchema = {
      ...originalData,
      runtimeInputs: convertedRuntimeInputs,
      dbInputs: convertedDbInputs,
      dbModifications: convertedDbModifications,
      outputSchema: JSON.parse(outputSchema) as ThirdPartySchema,
    };
    setLoading(true);
    hackCreateFunctor(client, projectExId, processedData).finally(() => {
      setLoading(false);
      onFinish();
    });
  };

  const renderRuntimeInputs = () => (
    <Form.List name="runtimeInputs">
      {(runtimeInputs, { add, remove }) => (
        <>
          {runtimeInputs.map((runtimeInput) => (
            <Form.Item key={runtimeInput.key} noStyle>
              <Form.Item
                label="argName"
                fieldKey={[runtimeInput.fieldKey, 'argName']}
                name={[runtimeInput.name, 'argName']}
              >
                <ZInput />
              </Form.Item>
              <Form.Item noStyle>
                <Form.Item label="dataType" name={[runtimeInput.name, 'dataType', 'pgType']}>
                  <Select>
                    {availableTypes.map((type) => (
                      <Select.Option key={type} value={type}>
                        {type}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  label="isList"
                  name={[runtimeInput.name, 'dataType', 'isList']}
                  valuePropName="checked"
                >
                  <Checkbox />
                </Form.Item>
              </Form.Item>
              <Row justify="end">
                <Button onClick={() => remove(runtimeInput.name)} icon={<DeleteOutlined />} />
              </Row>
              <Divider />
            </Form.Item>
          ))}
          <Form.Item>
            <Button
              onClick={() => add({ argName: '', dataType: { pgType: PGType.INT4, isList: false } })}
              block
            >
              Add Runtime Input
            </Button>
          </Form.Item>
        </>
      )}
    </Form.List>
  );

  const renderDbInputs = () => (
    <Form.List name="dbInputs">
      {(dbFields, { add, remove }) => (
        <>
          {dbFields.map((dbField) => (
            <Form.Item key={dbField.key} noStyle>
              <Form.Item label="argName" name={[dbField.name, 'argName']}>
                <ZInput />
              </Form.Item>
              <Form.Item label="query" name={[dbField.name, 'dbData', 'query']}>
                <ZInput />
              </Form.Item>
              <Form.Item label="queryType" name={[dbField.name, 'dbData', 'queryType']}>
                <Select>
                  {Object.values(QueryType).map((type) => (
                    <Select.Option key={type} value={type}>
                      {type}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.List name={[dbField.name, 'dbData', 'queryArgs']}>
                {(queryArgs, { add: addQueryArg, remove: rmQueryArg }) => (
                  <>
                    {queryArgs.map((queryArg) => (
                      <Form.Item
                        key={queryArg.key}
                        label={
                          <>
                            <Button
                              type="text"
                              onClick={() => rmQueryArg(queryArg.name)}
                              icon={<MinusCircleOutlined />}
                            />
                            queryArgs
                          </>
                        }
                      >
                        <Form.Item label="name" name={[queryArg.name, 'name']}>
                          <ZInput />
                        </Form.Item>
                        <Form.Item noStyle>
                          <Form.Item label="dataType" name={[queryArg.name, 'dataType', 'pgType']}>
                            <Select>
                              {availableTypes.map((type) => (
                                <Select.Option key={type} value={type}>
                                  {type}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                          <Form.Item
                            label="isList"
                            name={[queryArg.name, 'dataType', 'isList']}
                            valuePropName="checked"
                          >
                            <Checkbox />
                          </Form.Item>
                        </Form.Item>
                      </Form.Item>
                    ))}
                    <Form.Item>
                      <Button
                        onClick={() =>
                          addQueryArg({
                            name: '',
                            dataType: { pgType: PGType.INT4, isList: false },
                          })
                        }
                        block
                      >
                        Add Query Arg
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
              <Row justify="end">
                <Button onClick={() => remove(dbField.name)} icon={<DeleteOutlined />} />
              </Row>
              <Divider />
            </Form.Item>
          ))}
          <Form.Item>
            <Button
              onClick={() =>
                add({ argName: '', dbData: { query: '', queryType: QueryType.ONE, queryArgs: [] } })
              }
              block
            >
              Add DB Input
            </Button>
          </Form.Item>
        </>
      )}
    </Form.List>
  );

  const renderDbModifications = () => (
    <Form.List name="dbModifications">
      {(dbModifications, { add: addDbModification, remove: rmDbModification }) => (
        <>
          {dbModifications.map((dbModification) => (
            <Form.Item key={dbModification.key} noStyle>
              <Form.Item
                label="type"
                name={[dbModification.name, 'type']}
                rules={[
                  {
                    validator: () => {
                      if (form.getFieldValue('type') === FunctorType.query) {
                        return Promise.reject(
                          Error('When type is query, there shall be no modification')
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Select>
                  {Object.values(DbModificationType).map((type) => (
                    <Select.Option key={type} value={type}>
                      {type}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="batch"
                name={[dbModification.name, 'batch']}
                valuePropName="checked"
              >
                <Checkbox />
              </Form.Item>
              <Form.Item label="sql" name={[dbModification.name, 'sql']}>
                <ZInput />
              </Form.Item>
              <Form.List name={[dbModification.name, 'sqlArgs']}>
                {(sqlArgs, { add: addSqlArg, remove: rmSqlArg }) => (
                  <>
                    {sqlArgs.map((sqlArg) => (
                      <Form.Item
                        key={sqlArg.key}
                        label={
                          <>
                            <Button
                              type="text"
                              onClick={() => rmSqlArg(sqlArg.name)}
                              icon={<MinusCircleOutlined />}
                            />
                            sqlArgs
                          </>
                        }
                      >
                        <Form.Item label="name" name={[sqlArg.name, 'name']}>
                          <ZInput />
                        </Form.Item>
                        <Form.Item noStyle>
                          <Form.Item label="dataType" name={[sqlArg.name, 'dataType', 'pgType']}>
                            <Select>
                              {availableTypes.map((type) => (
                                <Select.Option key={type} value={type}>
                                  {type}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                          <Form.Item
                            label="isList"
                            name={[sqlArg.name, 'dataType', 'isList']}
                            valuePropName="checked"
                            dependencies={['dbModifications', dbModification.name, 'batch']}
                            rules={[
                              ({ getFieldValue }) => ({
                                validator: (_rule, value) => {
                                  if (
                                    getFieldValue([
                                      'dbModifications',
                                      dbModification.name,
                                      'batch',
                                    ]) &&
                                    !value
                                  )
                                    return Promise.reject(
                                      Error('When batch is true, it must be list')
                                    );
                                  return Promise.resolve();
                                },
                              }),
                            ]}
                          >
                            <Checkbox />
                          </Form.Item>
                        </Form.Item>
                      </Form.Item>
                    ))}
                    <Form.Item>
                      <Button
                        onClick={() =>
                          addSqlArg({
                            name: '',
                            dataType: { pgType: PGType.INT4, isList: false },
                          })
                        }
                        block
                      >
                        Add SQL Arg
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
              <Row justify="end">
                <Button
                  onClick={() => rmDbModification(dbModification.name)}
                  icon={<DeleteOutlined />}
                />
              </Row>
              <Divider />
            </Form.Item>
          ))}
          <Form.Item>
            <Button
              onClick={() =>
                addDbModification({
                  type: DbModificationType.INSERT,
                  batch: false,
                  sql: '',
                  sqlArgs: [],
                })
              }
              block
            >
              Add DB Modification
            </Button>
          </Form.Item>
        </>
      )}
    </Form.List>
  );

  return (
    <Modal
      visible
      onOk={form.submit}
      onCancel={onFinish}
      confirmLoading={loading}
      title="Create functors"
    >
      <Form
        form={form}
        onFinish={onSubmit}
        initialValues={{
          displayName: '',
          language: Language.JS,
          type: FunctorType.query,
          code: '',
          runtimeInputs: [],
          dbInputs: [],
          dbModifications: [],
          outputSchema: '',
        }}
        labelCol={{ span: 8 }}
      >
        <Form.Item
          label="name"
          name="displayName"
          rules={[{ required: true, message: 'Name is required' }]}
        >
          <ZInput />
        </Form.Item>
        <Form.Item label="type" name="type">
          <Select>
            {Object.values(FunctorType).map((type) => (
              <Select.Option key={type} value={type}>
                {type}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="language" name="language">
          <Select disabled>
            {Object.values(Language).map((language) => (
              <Select.Option key={language} value={language}>
                {language}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="code" name="code">
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          label="outputSchema"
          name="outputSchema"
          validateTrigger={['onSubmit']}
          rules={[
            {
              validator: (rule, value) => {
                try {
                  JSON.parse(value);
                  return Promise.resolve();
                } catch (exception) {
                  return Promise.reject(Error('Output schema must be a valid json'));
                }
              },
            },
          ]}
        >
          <Input.TextArea />
        </Form.Item>
        <Tabs>
          <Tabs.TabPane key="runtimeInput" tabKey="runtimeInput" tab="runtimeInput" forceRender>
            {renderRuntimeInputs()}
          </Tabs.TabPane>
          <Tabs.TabPane key="dbInput" tabKey="dbInput" tab="dbInput" forceRender>
            {renderDbInputs()}
          </Tabs.TabPane>
          <Tabs.TabPane
            key="dbModification"
            tabKey="dbModification"
            tab="dbModification"
            forceRender
          >
            {renderDbModifications()}
          </Tabs.TabPane>
        </Tabs>
      </Form>
    </Modal>
  );
});
